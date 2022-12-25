import MoreMath from "../framework/MoreMath";

export default class Rectangle {
	private _x: number;
	private _y: number;
	private _width: number;
	private _height: number;
	
	constructor(x: number, y: number, width: number, height: number) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
	}

	static get zero() {
		return new Rectangle(0, 0, 0, 0);
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

	get width(): number {
		return this._width;
	}

	set width(n: number) {
		this._width = Math.floor(n);
	}

	get height(): number {
		return this._height;
	}

	set height(n: number) {
		this._height = Math.floor(n);
	}

	get left() {
		return this.x;
	}

	get right() {
		return this.x + this.width - 1;
	}

	get top() {
		return this.y;
	}

	get bottom() {
		return this.y + this.height - 1;
	}

	get centerX() {
		return Math.floor((this.left + this.right) / 2);
	}

	get centerY() {
		return Math.floor((this.top + this.bottom) / 2);
	}

	contains(x: number, y: number): boolean {
		return MoreMath.isInRange(x, this.left, this.right) && MoreMath.isInRange(y, this.top, this.bottom);
	}

	scale(n: number): Rectangle {
		return new Rectangle(
			this.x + this.width * n,
			this.y + this.height * n,
			this.width * n * 2,
			this.height * n * 2
		);
	}

	resize(w: number, h: number): Rectangle {
		return new Rectangle(
			this.x,
			this.y,
			w,
			h
		);
	}
}
