import ConsoleTile from "./ConsoleTile";

export default class WorldTile extends ConsoleTile {
	name: string;
	blocksMovement: boolean;
	blocksVision: boolean;
	isExplored: boolean;

	constructor(tileIndex: number|string, foregroundColor: number, backgroundColor: number) {
		super(tileIndex, foregroundColor, backgroundColor);
		this.blocksMovement = false;
		this.blocksVision = false;
		this.isExplored = false;
		this.name = '';
	}
}
