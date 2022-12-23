import { random } from "lodash";
import AntBehavior from "../behaviors/AntBehavior";
import Entity from "./Entity";
import { getColor } from "../framework/radialPalette";
import GameplayState from "../GameplayState";
import SearchingForFood from "../behaviors/SearchingForFood";

export default class AntEntity extends Entity {
	behavior: AntBehavior;
	foodValue: number;
	homeX: number;
	homeY: number;

	constructor(homeX: number, homeY: number) {
		super('a', getColor(140), getColor(0));
		this.name = 'ant';
		this.speed = 8;
		this.behavior = new SearchingForFood();
		this.foodValue = 0;
		this.homeX = homeX;
		this.homeY = homeY;
	}

	update(world: GameplayState) {
		super.update(world);

		if (this.canAct) {
			const dx = random(-1, 1);
			const dy = random(-1, 1);
			this.move(world, dx, dy);
		}
	}
}
