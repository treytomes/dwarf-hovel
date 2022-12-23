import MoreMath from "../framework/MoreMath";

export default class Rectangle {
	x: number;
	y: number;
	width: number;
	height: number;
	
	constructor(x: number, y: number, width: number, height: number) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
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
}
