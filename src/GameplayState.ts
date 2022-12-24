import AntNestEntity from "./entities/AntNestEntity";
import DamageParticleFountain from "./particles/DamageParticleFountain";
import DungeonWorldGenerator from "./worldgen/DungeonWorldGenerator";
import Entity from "./entities/Entity";
import EntityFactory from "./entities/EntityFactory";
import { getColor } from "./framework/radialPalette";
import GameState from "./GameState";
import Keys from "./Keys";
import ParticleFountain from "./particles/ParticleFountain";
import PlayerEntity from "./entities/PlayerEntity";
import TerminalGameCanvas from "./TerminalGameCanvas";
import WorldTile from "./WorldTile";
import Logger, { LogLevel } from "./Logger";
import Settings from "./settings.json";
import FieldOfVisionCalculator from "./math/FieldOfVisionCalculator";
import Rectangle from "./math/Rectangle";
import UIContainer from "./ui/UIContainer";
import UIRectangle from "./ui/UIRectangle";
import UILabel from "./ui/UILabel";
import UIBorder, { BorderStyle } from "./ui/UIBorder";

const HUD_BG_COLOR = getColor(5);
const HUD_FG_COLOR = getColor(550);

export default class GameplayState extends GameState {
	rows: number;
	columns: number;
	worldTiles: Array<Array<WorldTile>>;
	entities: Array<Entity>;
	player: PlayerEntity;
	particleFountains: Array<ParticleFountain>;
	fov: FieldOfVisionCalculator;
	ui: UIContainer;

	constructor(rows: number, columns: number) {
		super();

		this.rows = rows;
		this.columns = columns;

		const generator = new DungeonWorldGenerator(Settings.world.width, Settings.world.height);
		//const generator = new ArenaWorldGenerator(Settings.world.width, Settings.world.height);
		this.worldTiles = generator.worldTiles;
		let spawnPoint = generator.getStartPoint();
		this.player = EntityFactory.player(spawnPoint.x, spawnPoint.y);
		
		this.entities = [];

		// Place the ant nest.
		// TODO: Place the ant nest somewhere random.
		//spawnPoint = generator.getSpawnPoint();
		this.entities.push(EntityFactory.antNest(spawnPoint.x, spawnPoint.y));

		this.particleFountains = [];
		this.fov = new FieldOfVisionCalculator(Settings.world.width, Settings.world.height);

		this.ui = new UIContainer(null, new Rectangle(0, 0, this.columns, this.rows));
		const hud =  new UIContainer(this.ui, new Rectangle(0, 0, this.ui.bounds.width, 1));
		this.ui.children.push(hud);

		const hudBackground = new UIRectangle(hud, new Rectangle(0, 0, this.ui.bounds.width, 1), HUD_BG_COLOR);
		hud.children.push(hudBackground);

		const lvlLabel = new UILabel(hud, new Rectangle(0, 0, 8, 1), HUD_FG_COLOR, HUD_BG_COLOR, () => `LVL:${this.player.level}`);
		hud.children.push(lvlLabel);

		const xpLabel = new UILabel(hud, new Rectangle(8, 0, 8, 1), HUD_FG_COLOR, HUD_BG_COLOR, () => `XP:${this.player.experience}/${this.player.experienceToLevel}`);
		hud.children.push(xpLabel);

		const hpLabel = new UILabel(hud, new Rectangle(16, 0, 8, 1), HUD_FG_COLOR, HUD_BG_COLOR, () => `HP:${this.player.currentHealth}/${this.player.maxHealth}`);
		hud.children.push(hpLabel);

		const x = this.ui.bounds.width * 1 / 4;
		const y = this.ui.bounds.height * 1 / 4;
		const w = this.ui.bounds.width - x * 2;
		const h = this.ui.bounds.height - y * 2;
		const descWindow = new UIContainer(this.ui, new Rectangle(x, y, w, h));
		this.ui.children.push(descWindow);
		
		// TODO: Don't allow an element to be it's own parent.
		// TODO: Need a simpler way to represent this.  Maybe some rectangle math.  And a better addChild function.

		console.log(x, y, w, h);
		const descWindowBackground = new UIRectangle(descWindow, new Rectangle(0, 0, w, h), getColor(3));
		descWindow.children.push(descWindowBackground);

		const descWindowBorder = new UIBorder(descWindow, new Rectangle(0, 0, w, h), BorderStyle.Double, getColor(440), getColor(3));
		descWindow.children.push(descWindowBorder);
	}

	spawnDamageParticles(x: number, y: number) {
		this.particleFountains.push(new DamageParticleFountain(x, y));
	}

	updateFountains(deltaTime: number) {
		const deadFountains: Array<ParticleFountain> = [];

		for (let n = 0; n < this.particleFountains.length; n++) {
			const fountain = this.particleFountains[n];
			fountain.update(deltaTime);
			if (fountain.isDead) {
				deadFountains.push(fountain);
			}
		}

		for (let n = 0; n < deadFountains.length; n++) {
			this.particleFountains = this.particleFountains.filter(x => x !== deadFountains[n]);
		}
	}

	onUpdate(deltaTime: number) {
		this.updateFountains(deltaTime);

		this.player.update(this);
		if (!this.player.canAct) {
			for (let n = 0; n < this.entities.length; n++) {
				this.entities[n].update(this);
			}
		}

		this.ui.update(deltaTime);
	}

	drawWorld(terminal: TerminalGameCanvas) {
		terminal.clear();

		const SCREEN_START_X = 0;
		const SCREEN_START_Y = 1;
		const SCREEN_DISPLAY_WIDTH = terminal.columns;
		const SCREEN_DISPLAY_HEIGHT = terminal.rows - 1;

		let worldLeft = this.player.x - terminal.columns / 2;
		let worldRight = worldLeft + SCREEN_DISPLAY_WIDTH;
		let worldTop = this.player.y - terminal.rows / 2;
		let worldBottom = worldTop + SCREEN_DISPLAY_HEIGHT;

		const x_off = SCREEN_START_X + terminal.columns / 2 - this.player.x;
		const y_off = SCREEN_START_Y + terminal.rows / 2 - this.player.y;

		if (worldLeft < 0) {
			worldLeft = 0;
		}
		if (worldRight > Settings.world.width) {
			worldRight = Settings.world.width;
		}
		if (worldTop < 0) {
			worldTop = 0;
		}
		if (worldBottom > Settings.world.height) {
			worldBottom = Settings.world.height;
		}

		for (let y = worldTop; y < worldBottom; y++) {
			for (let x = worldLeft; x < worldRight; x++) {
				const tile = this.worldTiles[y][x];
				if (this.fov.isVisible(x, y)) {
					terminal.drawTile(y_off + y, x_off + x, tile.tileIndex, tile.foregroundColor, tile.backgroundColor);
					tile.isExplored = true;
				} else {
					if (tile.isExplored) {
						terminal.drawTile(y_off + y, x_off + x, tile.tileIndex, getColor(111), getColor(0));
					}
				}
			}
		}

		for (let n = 0; n < this.entities.length; n++) {
			const entity = this.entities[n];
			if (this.fov.isVisible(entity.x, entity.y)) {
				let healthPercent = entity.currentHealth / entity.maxHealth;
				let backgroundColor = getColor(Math.floor(5 * (1 - healthPercent)) * 100);
				terminal.drawTile(y_off + entity.y, x_off + entity.x, entity.tileIndex, entity.foregroundColor, backgroundColor);
			}
		}

		let healthPercent = this.player.currentHealth / this.player.maxHealth;
		let backgroundColor = getColor(Math.floor(5 * (1 - healthPercent)) * 100);
		terminal.drawTile(y_off + this.player.y, x_off + this.player.x, this.player.tileIndex, this.player.foregroundColor, backgroundColor);

		for (let n = 0; n < this.particleFountains.length; n++) {
			this.particleFountains[n].draw(terminal, x_off, y_off);
		}
	}

	onRender(time: number, terminal: TerminalGameCanvas) {
		terminal.clear();
		this.drawWorld(terminal);
		this.ui.render(terminal);
	}

	onKeyDown(e: KeyboardEvent) {
		if (!this.player.canAct) {
			return;
		}

		let dx = 0;
		let dy = 0;
		switch (e.code) {
			case Keys.KEY_W:
				dy--;
				break;
			case Keys.KEY_S:
				dy++;
				break;
			case Keys.KEY_A:
				dx--;
				break;
			case Keys.KEY_D:
				dx++;
				break;
			case Keys.KEY_F:
				this.player.damage(1);
				this.spawnDamageParticles(this.player.x, this.player.y);
				break;
			default:
				Logger.log(`onKeyDown: ${e.code}`, LogLevel.DEBUG);
				break;
		}

		this.player.move(this, dx, dy);
		this.fov.refresh(this.player.x, this.player.y, 8, (x: number, y: number) => this.worldTiles[y][x].blocksVision);
	}

	pixelsToWorld(x: number, y: number) {
		const TILE_SIZE = 8;
		const SCREEN_START_X = 0;
		const SCREEN_START_Y = 1;
		const x_off = this.player.x - this.columns / 2 - SCREEN_START_X;
		const y_off = this.player.y - this.rows / 2 - SCREEN_START_Y;
		const row = y_off + Math.floor(y / TILE_SIZE);
		const column = x_off + Math.floor(x / TILE_SIZE);
		return [ row, column ];
	}

	findEntitiesAt(x: number, y: number) {
		const entities = [];
		if ((this.player.x === x) && (this.player.y === y)) {
			entities.push(this.player);
		}
		for (let n = 0; n < this.entities.length; n++) {
			const entity = this.entities[n];
			if ((entity.x === x) && (entity.y === y)) {
				entities.push(entity);
			}
		}
		return entities;
	}

	describe(entity: Entity) {
		console.log(`Description of ${entity.name}:`);
		
		const desc = new Map();
		desc.set('currentHealth', entity.currentHealth);
		desc.set('maxHealth', entity.maxHealth);
		desc.set('speed', entity.speed);
		desc.set('energy', entity.energy);

		const isAntNest = (entity instanceof AntNestEntity);
		if (isAntNest) {
			desc.set('numAnts', (entity as AntNestEntity).numAnts);
			desc.set('totalFood', (entity as AntNestEntity).totalFood);
		}

		// TODO: Put this into a window.
		console.log(desc);
	}

	onMouseDown(x: number, y: number, buttons: number) {
		const [ row, column ] = this.pixelsToWorld(x, y);

		if ((row >= 0) && (row < this.rows) && (column >= 0) && (column < this.columns)) {
			const entities = this.findEntitiesAt(column, row);
			if (entities.length > 0) {
				for (let n = 0; n < entities.length; n++) {
					this.describe(entities[n]);
				}
			}

			const tile = this.worldTiles[row][column];
			if (this.fov.isVisible(column, row)) {
				Logger.log(`There is a ${tile.name} here.`);
			} else {
				Logger.log('You can\'t see that.', LogLevel.WARNING);
			}
		}
	}

    onMouseUp(x: number, y: number, buttons: number) {
		const [ row, column ] = this.pixelsToWorld(x, y);
		//Logger.log(`onMouseUp: ${x}, ${y}, ${column}, ${row}`);
	}

    onMouseMove(x: number, y: number, buttons: number) {
		const [ row, column ] = this.pixelsToWorld(x, y);
		//Logger.log(`onMouseMove: ${x}, ${y}, ${column}, ${row}`);
		const entities = this.findEntitiesAt(column, row);
		if (entities.length > 0) {
			Logger.log(`Entities @ (${column}, ${row}): ${entities.map(x => x.name).join(', ')}`, LogLevel.DEBUG);
		}
	}
}
