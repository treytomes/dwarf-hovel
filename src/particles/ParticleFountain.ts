import { getColor } from "../framework/radialPalette";
import Particle from "./Particle";
import TerminalGameCanvas from "../TerminalGameCanvas";

export default class ParticleFountain {
	x: number;
	y: number
	particles: Array<Particle>;
	spawnTimer: number;
	lastSpawnTime: number;
	spawnRate: number;

	constructor(x: number, y: number) {
		this.x = x;
		this.y = y;
		this.particles = [];

		this.spawnTimer = 0;
		this.lastSpawnTime = 0;
		this.spawnRate = 1000;
	}

	get isAlive() {
		return (this.spawnRate > 0) || (this.particles.filter(x => x.isAlive).length > 0);
	}

	get isDead() {
		return !this.isAlive;
	}

	spawn() {
		this.particles.push(new Particle(this.x, this.y, 1, 0, 300, 5000, getColor(5, 5, 5), getColor(0, 0, 0)));
	}

	/**
	 * 
	 * @param {number} time Elapsed milliseconds. 
	 */
	update(time: number) {
		const deadParticles: Particle[] = [];
		this.spawnTimer += time;
		if ((this.spawnRate > 0) && this.spawnTimer - this.lastSpawnTime >= this.spawnRate) {
			this.spawn();
			this.lastSpawnTime = this.spawnTimer;
		}

		for (let n = 0; n < this.particles.length; n++) {
			const particle = this.particles[n];
			particle.update(time);
			if (particle.isDead) {
				deadParticles.push(particle);
			}
		}

		for (let n = 0; n < deadParticles.length; n++) {
			this.particles = this.particles.filter(x => x !== deadParticles[n]);
		}
	}

	draw(world: TerminalGameCanvas, offsetX: number, offsetY: number) {
		for (let n = 0; n < this.particles.length; n++) {
			this.particles[n].draw(world, offsetX, offsetY);
		}
	}
}
