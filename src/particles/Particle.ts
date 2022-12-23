import ConsoleTile from '../ConsoleTile';
import TerminalGameCanvas from '../TerminalGameCanvas';

export default class Particle extends ConsoleTile {
	x: number;
	y: number;
	dx: number;
	dy: number;
	totalTime: number;
	lastUpdateTime: number;
	speed: number;
	lifeSpan: number;

	constructor(x: number, y: number, dx: number, dy: number, speed: number, lifeSpan: number, foregroundColor: number, backgroundColor: number) {
		super('*', foregroundColor, backgroundColor);
		this.x = x;
		this.y = y;
		this.dx = dx;
		this.dy = dy;

		this.totalTime = 0;
		this.lastUpdateTime = 0;
		this.speed = speed;

		// Lifespan in milliseconds.
		this.lifeSpan = lifeSpan;
	}

	get isAlive() {
		return this.totalTime < this.lifeSpan;
	}

	get isDead() {
		return !this.isAlive;
	}

	update(time: number) {
		this.totalTime += time;
		if (this.totalTime - this.lastUpdateTime > this.speed) {
			this.x += this.dx;
			this.y += this.dy;
			this.lastUpdateTime = this.totalTime;
		}
	}

	draw(world: TerminalGameCanvas, offsetX: number, offsetY: number) {
		world.drawTile(offsetY + this.y, offsetX + this.x, '*', this.foregroundColor, this.backgroundColor);
	}
}