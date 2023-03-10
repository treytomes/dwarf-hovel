import Rectangle from "../math/Rectangle";
import TerminalGameCanvas from "../TerminalGameCanvas";

export default abstract class UIElement {
	parent: UIElement;

	/**
	 * Bounds relative to the parent.
	 */
	bounds: Rectangle;

	constructor(bounds: Rectangle) {
		this.parent = null;
		this.bounds = bounds;
	}

	/**
	 * Bounds relative to children.
	 */
	get clientArea(): Rectangle {
		return new Rectangle(0, 0, this.bounds.width, this.bounds.height);
	}

	/**
	 * Computed bounds relative to the screen.
	 * Size will be clipped to the parent.
	 */
	get absoluteBounds(): Rectangle {
		if (this.parent === null) {
			return this.bounds;
		} else {
			let parentBounds = this.parent.absoluteBounds;
			let r = new Rectangle(this.bounds.x, this.bounds.y, this.bounds.width, this.bounds.height);
			r.x += parentBounds.x;
			r.y += parentBounds.y;
			if (r.right > parentBounds.right) {
				r.width = parentBounds.right - r.left;
			}
			if (r.bottom > parentBounds.bottom) {
				r.height = parentBounds.bottom - r.top;
			}
			return r;
		}
	}

	update(deltaTime: number) {
	}

	render(terminal: TerminalGameCanvas) {
	}
}
