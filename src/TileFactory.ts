import { getColor } from "./framework/radialPalette";
import WorldTile from "./WorldTile";

/*
enum Direction {
	N,
	NE,
	E,
	SE,
	S,
	SW,
	W,
	NW,
}
*/

// TODO: Define these in JSON.
export default class TileFactory {
	static wall() {
		const tile = new WorldTile('#', getColor(420), getColor(0));
		tile.blocksMovement = true;
		tile.blocksVision = true;
		tile.name = 'wall';
		return tile;
	}

	static floor() {
		const tile = new WorldTile('.', getColor(210), getColor(0));
		tile.blocksMovement = false;
		tile.blocksVision = false;
		tile.name = 'floor';
		return tile;
	}

	static door() {
		const tile = new WorldTile(8, getColor(555), getColor(0))
		tile.blocksMovement = false;
		tile.blocksVision = true;
		tile.name = 'door';
		return tile;
	}

	static window() {
		// TODO: Tiles need to know the context they're being placed in.
		// 186 for vertical windows; 205 for horizontal windows.
		const tile = new WorldTile(8, getColor(555), getColor(0))
		tile.blocksMovement = true;
		tile.blocksVision = false;
		tile.name = 'window';
		return tile;
	}
}
