import Entity from "./Entity";
import { getColor } from "../framework/radialPalette";

export default class PlayerEntity extends Entity {
	level: number;
	experience: number;
	experienceToLevel: number;

	constructor() {
		super('@', getColor(555), getColor(0));
		this.maxHealth = this.currentHealth = 10;
		this.level = 1;
		this.experience = 0;
		this.experienceToLevel = 0;
		this.name = 'player';
		this.speed = 10;
	}
}
