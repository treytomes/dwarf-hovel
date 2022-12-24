export default class Point {
	private _x: number;
	private _y: number;
	
	constructor(x: number, y: number) {
		this.x = x;
		this.y = y;
	}

	get x(): number {
		return this._x;
	}

	set x(n: number) {
		this._x = Math.floor(n);
	}

	get y(): number {
		return this._y;
	}

	set y(n: number) {
		this._y = Math.floor(n);
	}

	static get zero(): Point {
		return new Point(0, 0);
	}

	static get unitX(): Point {
		return new Point(1, 0);
	}

	static get unitY(): Point {
		return new Point(0, 1);
	}

	get negate(): Point {
		return new Point(-this.x, -this.y);
	}

	add(p: Point): Point {
		return new Point(this.x + p.x, this.y + p.y);
	}

	multiply(value: number): Point {
		return new Point(this.x * value, this.y * value);
	}
}