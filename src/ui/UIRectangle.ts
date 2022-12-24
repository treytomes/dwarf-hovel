import { getColor } from "../framework/radialPalette";
import Rectangle from "../math/Rectangle";
import TerminalGameCanvas from "../TerminalGameCanvas";
import UIContainer from "./UIContainer";
import UIElement from "./UIElement";

const TILEINDEX_SPACE = 32;

export default class UIRectangle extends UIElement {
	backgroundColor: number = null;

	constructor(parent: UIElement, bounds: Rectangle, backgroundColor: number) {
		super(parent, bounds);
		this.backgroundColor = backgroundColor;
	}

	render(terminal: TerminalGameCanvas) {
		const r = this.absoluteBounds;
		terminal.fillRect(r.x, r.y, r.width, r.height, TILEINDEX_SPACE, getColor(0), this.backgroundColor);
	}
}
