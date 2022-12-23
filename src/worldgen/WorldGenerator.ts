import Logger from '../Logger';
import WorldTile from '../WorldTile';

export default class WorldGenerator {
	width: number;
	height: number;
	worldTiles: Array<Array<WorldTile>>;

	constructor(width: number, height: number) {
		this.width = width;
		this.height = height;
		this.worldTiles = null;

		this.initialize();
		this.generate();
	}

	initialize() {
		this.worldTiles = [];
		for (let y = 0; y < this.height; y++) {
			const row = [];
			for (let x = 0; x < this.width; x++) {
				row.push(new WorldTile(0, 0, 0));
			}
			this.worldTiles.push(row);
		}
	}

	generate() {}

	getSpawnPoint() {}

	getTile(x: number, y: number) {
		if ((x < 0) || (x >= this.width) || (y < 0) || (y >= this.height)) {
			Logger.log("getTile error: " + JSON.stringify([ x, y ]));
			return;
		}
		return this.worldTiles[y][x];
	}

	setTile(x: number, y: number, tile: WorldTile) {
		if ((x < 0) || (x >= this.width) || (y < 0) || (y >= this.height)) {
			Logger.log("setTile error: " + JSON.stringify([ x, y ]));
			return;
		}
		this.worldTiles[y][x] = tile;
	}

	drawText(x: number, y: number, text: string, foregroundColor: number, backgroundColor: number, blocksMovement = true) {
		for (let n = 0; n < text.length; n++) {
			const tile = new WorldTile(text[n], foregroundColor, backgroundColor);
			tile.blocksMovement = blocksMovement;
			this.setTile(x + n, y, tile);
		}
	}

	drawRect(x: number, y: number, width: number, height: number, tileFn: () => WorldTile) {
		if (x + width > this.width) {
			width = this.width - x;
		}
		if (y + height > this.height) {
			height = this.height - y;
		}
		for (let _x = x; _x < x + width; _x++) {
			this.setTile(_x, y, tileFn());
			this.setTile(_x, y + height - 1, tileFn());
		}
		for (let _y = y + 1; _y < y + height - 1; _y++) {
			this.setTile(x, _y, tileFn());
			this.setTile(x + width - 1, _y, tileFn());
		}
	}

	fillRect(x: number, y: number, width: number, height: number, tileFn: () => WorldTile) {
		for (let _y = y; _y < y + height; _y++) {
			for (let _x = x; _x < x + width; _x++) {
				this.setTile(_x, _y, tileFn());
			}
		}
	}
}
