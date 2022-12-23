import { random } from "lodash";
import BspTree from "./BspTree";
import Room from "../Room";
import TileFactory from "../TileFactory";
import WorldGenerator from "./WorldGenerator";
import Logger from "../Logger";
import Settings from "../settings.json";

export default class DungeonWorldGenerator extends WorldGenerator {
	rooms: Array<Room>;

	constructor(width: number, height: number) {
		super(width, height);
	}

	generate() {
		this.rooms = [];
		this.fillRect(0, 0, this.width, this.height, () => TileFactory.wall());

		const tree = new BspTree(0, 0, this.width, this.height, Settings.room.width.max, Settings.room.height.max);
		this.bspDescend(tree);
		this.connectAllRooms();
		this.decorateRooms();
	}

	getStartPoint() {
		const spawnRoom = this.rooms[0];
		const x = random(spawnRoom.left + 1, spawnRoom.right - 1);
		const y = random(spawnRoom.top + 1, spawnRoom.bottom - 1);
		return { x: x, y: y };
	}

	getSpawnPoint() {
		const spawnRoom = this.rooms[random(0, this.rooms.length - 1)];
		const x = random(spawnRoom.left + 1, spawnRoom.right - 1);
		const y = random(spawnRoom.top + 1, spawnRoom.bottom - 1);
		return { x: x, y: y };
	}

	/**
	 * Descend through the tree until you find the leaves, then create rooms out of those leaves.
	 * 
	 * Populates the rooms array.
	 */
	bspDescend(tree: BspTree) {
		if ((tree.A === null) || (tree.B === null)) {
			if ((tree.width < Settings.room.width.min) || (tree.height < Settings.room.height.min)) {
				return;
			}
			if (tree.width > Settings.room.width.max) {
				tree.width = Settings.room.width.max;
			}
			if (tree.height > Settings.room.height.max) {
				tree.height = Settings.room.height.max;
			}

			this.rooms.push(new Room(tree));
		} else {
			this.bspDescend(tree.A);
			this.bspDescend(tree.B);
		}
	}

	decorateRooms() {
		for (let n = 0; n < this.rooms.length; n++) {
			this.decorateRoom(this.rooms[n]);
		}
	}

	canPlaceHorizontalDoor(x: number, y: number) {
		return this.getTile(x - 1, y).blocksMovement && this.getTile(x + 1, y).blocksMovement;
	}

	canPlaceVerticalDoor(x: number, y: number) {
		return this.getTile(x, y - 1).blocksMovement && this.getTile(x, y + 1).blocksMovement;
	}

	decorateRoom(room: Room) {
		// Walk the room permiter and place doors where a tunnel enters the room.
		for (let x = room.left + 1; x <= room.right - 1; x++) {
			if (this.getTile(x, room.top).blocksMovement) {
				this.setTile(x, room.top, TileFactory.wall());
			} else {
				if (this.canPlaceHorizontalDoor(x, room.top)) {
					this.setTile(x, room.top, TileFactory.door());
				}
			}
			if (this.getTile(x, room.bottom).blocksMovement) {
				this.setTile(x, room.bottom, TileFactory.wall());
			} else {
				if (this.canPlaceHorizontalDoor(x, room.bottom)) {
					this.setTile(x, room.bottom, TileFactory.door());
				}
			}
		}
		for (let y = room.top + 1; y <= room.bottom - 1; y++) {
			if (this.getTile(room.left, y).blocksMovement) {
				this.setTile(room.left, y, TileFactory.wall());
			} else {
				if (this.canPlaceVerticalDoor(room.left, y)) {
					this.setTile(room.left, y, TileFactory.door());
				}
			}
			if (this.getTile(room.right, y).blocksMovement) {
				this.setTile(room.right, y, TileFactory.wall());
			} else {
				if (this.canPlaceVerticalDoor(room.right, y)) {
					this.setTile(room.right, y, TileFactory.door());
				}
			}
		}
		this.fillRect(room.x + 1, room.y + 1, room.width - 2, room.height - 2, () => TileFactory.floor());
	}

	connectAllRooms() {
		for (let n = 1; n < this.rooms.length; n++) {
			const previousRoom = this.rooms[n - 1];
			const thisRoom = this.rooms[n];
			this.connectRooms(previousRoom, thisRoom);
		}
	}

	connectRooms(roomA: Room, roomB: Room) {
		this.carveTunnel(roomA.centerX, roomA.centerY, roomB.centerX, roomB.centerY);
	}

	carveTunnel(x1: number, y1: number, x2: number, y2: number) {
		const dx = (x1 < x2) ? 1 : -1;
		const dy = (y1 < y2) ? 1 : -1;
		let x = x1;
		let y = y1;
		while (x !== x2) {
			this.worldTiles[y][x] = TileFactory.floor();
			x += dx;
		}
		if (x === 0) {
			Logger.log(JSON.stringify([ x, y ]));
		}
		while (y !== y2) {
			this.setTile(x, y, TileFactory.floor());
			y += dy;
		} 
	}
}
