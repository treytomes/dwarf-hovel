import { getColor } from "../framework/radialPalette";
import GameplayState from "../GameplayState";
import Logger, { LogLevel } from "../Logger";
import WorldTile from "../WorldTile";

export default class Entity extends WorldTile {
	x: number;
	y: number;
	maxHealth: number;
	currentHealth: number;
	speed: number;
	energy: number;
	perception: number;

	constructor(tileIndex: number|string, foregroundColor: number, backgroundColor: number) {
		super(tileIndex, foregroundColor, backgroundColor);
		this.x = 0;
		this.y = 0;
		this.maxHealth = this.currentHealth = 1;
		this.name = 'Entity';
		this.speed = 1;
		this.energy = 0;
		this.perception = 1;
	}

	get rangeOfVision() {
		return this.perception;
	}

	get isDead() {
		return this.currentHealth <= 0;
	}

	get isAlive() {
		return !this.isDead;
	}

	get canAct() {
		return this.energy >= 0;
	}

	get movementCost() {
		return 100;
	}

	heal(delta: number) {
		if (this.currentHealth + delta < 0) {
			delta = this.currentHealth;
		} else if (this.currentHealth + delta > this.maxHealth) {
			delta = this.maxHealth - this.currentHealth;
		}
		this.currentHealth += delta;
		Logger.log(`${this.name} was healed by ${delta}.`, LogLevel.GREEN);
	}

	damage(delta: number) {
		if (this.currentHealth - delta < 0) {
			delta = this.currentHealth;
		} else if (this.currentHealth - delta > this.maxHealth) {
			delta = this.maxHealth - this.currentHealth;
		}
		this.currentHealth -= delta;
		Logger.log(`${this.name} was damaged by ${delta}.`, LogLevel.RED);
	}

	update(world: GameplayState) {
		if (this.energy < 0) {
			this.energy += this.speed;
		}
	}

	move(world: GameplayState, dx: number, dy: number) {
		if ((dx === 0) && (dy === 0)) {
			return false;
		}

		const newX = this.x + dx;
		const newY = this.y + dy;
		const tile = world.worldTiles[newY][newX];
		if (!tile.blocksMovement) {
			this.x = newX;
			this.y = newY;
			this.energy -= this.movementCost;
			return true;
		}
		return false;
	}
}
