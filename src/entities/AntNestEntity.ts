import { max, min, random } from "lodash";
import Entity from "./Entity";
import EntityFactory from "./EntityFactory";
import { getColor } from "../framework/radialPalette";
import GameplayState from "../GameplayState";

export default class AntNestEntity extends Entity {
	numAnts: number;
	totalFood: number;
	spawnRadius: number;

	constructor() {
		super('O', getColor(420), getColor(210));
		this.name = 'ant nest';
		this.numAnts = 20;
		this.totalFood = 0;
		this.speed = 5;
		this.spawnRadius = 1;
	}

	get spawnCost() {
		return 1000;
	}

	update(world: GameplayState) {
		super.update(world);

		if (!this.canAct) {
			return;
		}

		if (this.numAnts > 0) {
			if (this.spawnAnt(world)) {
				this.numAnts--;
				this.energy -= this.spawnCost;
			}
			// TODO: this.numAnts should increase over time.
		}
	}

	spawnAnt(world: GameplayState) {
		const spawnPoint = this.findSpawnPoint(world);
		if (!spawnPoint) {
			return false;
		}
		const ant = EntityFactory.ant(spawnPoint.x, spawnPoint.y);
		world.entities.push(ant);
		return true;
	}

	findSpawnPoint(world: GameplayState) {
		const NUM_TRIES = 5;
		for (let n = 0; n < NUM_TRIES; n++) {
			let x = random(max([this.x - this.spawnRadius, 0]), min([this.x + this.spawnRadius, world.columns - 1]));
			let y = random(max([this.y - this.spawnRadius, 0]), min([this.y + this.spawnRadius, world.rows - 1]));
			if (!world.worldTiles[y][x].blocksMovement) {
				return { x: x, y: y };
			}
		}
		return null;
	}
}
