import Rectangle from "../math/Rectangle";
import TerminalGameCanvas from "../TerminalGameCanvas";
import UIElement from "./UIElement";

export default class UIContainer extends UIElement {
	private children: UIElement[];

	constructor(bounds: Rectangle) {
		super(bounds);
		this.children = [];
	}

	addChild<TElement extends UIElement>(elem: TElement): TElement {
		if (this.children.includes(elem) || ((elem as unknown) === this)) {
			throw new Error('Invalid child element.');
		}
		elem.parent = this;
		this.children.push(elem);
		return elem;
	}

	update(deltaTime: number) {
		for (let n = 0; n < this.children.length; n++) {
			this.children[n].update(deltaTime);
		}
	}

	render(terminal: TerminalGameCanvas) {
		for (let n = 0; n < this.children.length; n++) {
			this.children[n].render(terminal);
		}
	}

	bringToFront(elem: UIElement) {
		if (!this.children.includes(elem)) {
			return;
		}
		const index = this.children.indexOf(elem);
		this.children.splice(index, 1);
		this.children.push(elem);
	}

	sendToBack(elem: UIElement) {
		if (!this.children.includes(elem)) {
			return;
		}
		const index = this.children.indexOf(elem);
		this.children.splice(index, 1);
		this.children.splice(0, 0, elem);
	}
}