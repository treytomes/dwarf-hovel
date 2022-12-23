import Rectangle from "../math/Rectangle";
import TerminalGameCanvas from "../TerminalGameCanvas";
import UIElement from "./UIElement";

export default class UIContainer extends UIElement {
	children: UIElement[];

	constructor(parent: UIElement, bounds: Rectangle) {
		super(parent, bounds);
		this.children = [];
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