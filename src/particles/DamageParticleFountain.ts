import { getColor } from "../framework/radialPalette";
import Particle from "./Particle";
import ParticleFountain from "./ParticleFountain";

export default class DamageParticleFountain extends ParticleFountain {
	constructor(x: number, y: number) {
		super(x, y);
		this.spawnRate = 0;

		const SPEED = 50;
		const LIFESPAN = 800;
		const FG_COLOR = getColor(5, 0, 0);
		const BG_COLOR = getColor(0, 0, 0);

		this.particles.push(new Particle(this.x, this.y,  1,  1, SPEED, LIFESPAN, FG_COLOR, BG_COLOR));
		this.particles.push(new Particle(this.x, this.y,  0,  1, SPEED, LIFESPAN, FG_COLOR, BG_COLOR));
		this.particles.push(new Particle(this.x, this.y, -1,  1, SPEED, LIFESPAN, FG_COLOR, BG_COLOR));
		this.particles.push(new Particle(this.x, this.y,  1,  0, SPEED, LIFESPAN, FG_COLOR, BG_COLOR));
		this.particles.push(new Particle(this.x, this.y, -1,  0, SPEED, LIFESPAN, FG_COLOR, BG_COLOR));
		this.particles.push(new Particle(this.x, this.y,  1, -1, SPEED, LIFESPAN, FG_COLOR, BG_COLOR));
		this.particles.push(new Particle(this.x, this.y,  0, -1, SPEED, LIFESPAN, FG_COLOR, BG_COLOR));
		this.particles.push(new Particle(this.x, this.y, -1, -1, SPEED, LIFESPAN, FG_COLOR, BG_COLOR));
	}
}
