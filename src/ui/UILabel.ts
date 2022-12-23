import Rectangle from "../math/Rectangle";
import TerminalGameCanvas from "../TerminalGameCanvas";
import UIElement from "./UIElement";

export default class UILabel extends UIElement {
	foregroundColor: number;
	backgroundColor: number;
	message: string|(() => string);

	constructor(parent: UIElement, bounds: Rectangle, foregroundColor: number, backgroundColor: number, message: string|(() => string)) {
		super(parent, bounds);
		this.foregroundColor = foregroundColor;
		this.backgroundColor = backgroundColor;
		this.message = message;
	}

	render(terminal: TerminalGameCanvas) {
		let msg ='';
		if (this.message instanceof String) {
			msg = this.message as string;
		} else {
			msg = (this.message as () => string)();
		}
		terminal.drawString(this.bounds.y, this.bounds.x, msg, this.foregroundColor, this.backgroundColor)
	}
}
