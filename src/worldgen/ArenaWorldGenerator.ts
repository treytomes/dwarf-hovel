import { random } from "lodash";
import Logger from "../Logger";
import Room from "../Room";
import TileFactory from "../TileFactory";
import WorldGenerator from "./WorldGenerator";

export default class ArenaWorldGenerator extends WorldGenerator {
	rooms: Array<Room>;

	constructor(width: number, height: number) {
		super(width, height);
	}

	generate() {
		this.rooms = [];
		this.fillRect(1, 1, this.width - 2, this.height - 2, () => TileFactory.floor());
		this.drawRect(0, 0, this.width, this.height, () => TileFactory.wall());

		const NUM_PILLARS = random(20, 40);
		Logger.log(`Generating ${NUM_PILLARS} pillars.`);
		for (let n = 0; n < NUM_PILLARS; n++) {
			const x = random(1, this.width - 2);
			const y = random(1, this.height - 2);
			this.drawPillar(x, y);
		}
	}

	getStartPoint() {
		while (true) {
			const x = random(1, this.width - 2);
			const y = random(1, this.height - 2);
			const tile = this.getTile(x, y);
			if (!tile.blocksMovement) {
				return { x: x, y: y };
			}
		}
	}

	getSpawnPoint() {
		while (true) {
			const x = random(1, this.width - 2);
			const y = random(1, this.height - 2);
			const tile = this.getTile(x, y);
			if (!tile.blocksMovement) {
				return { x: x, y: y };
			}
		}
	}

	drawPillar(x: number, y: number) {
		this.worldTiles[y][x] = TileFactory.wall();
		this.worldTiles[y - 1][x] = TileFactory.wall();
		this.worldTiles[y + 1][x] = TileFactory.wall();
		this.worldTiles[y][x - 1] = TileFactory.wall();
		this.worldTiles[y][x + 1] = TileFactory.wall();
	}
}
