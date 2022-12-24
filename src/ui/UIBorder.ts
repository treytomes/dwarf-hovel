import { getColor } from "../framework/radialPalette";
import Rectangle from "../math/Rectangle";
import TerminalGameCanvas from "../TerminalGameCanvas";
import UIElement from "./UIElement";

const TILEINDEX_SOLID = 219;

// TODO: Border Style
export enum BorderStyle {
    Single,
    Double,
    Hash,
    Solid
}

export default class UIBorder extends UIElement {
    foregroundColor: number;
    backgroundColor: number = null;
    style: BorderStyle;

	constructor(parent: UIElement, bounds: Rectangle, style: BorderStyle, foregroundColor: number, backgroundColor: number = null) {
		super(parent, bounds);
        this.foregroundColor = foregroundColor;
		this.backgroundColor = backgroundColor;
        this.style = style;
	}

	render(terminal: TerminalGameCanvas) {
		const r = this.absoluteBounds;

        switch (this.style) {
            case BorderStyle.Hash:
                terminal.drawRect(r.x, r.y, r.width, r.height, '#', this.foregroundColor, this.backgroundColor);
                break;
            case BorderStyle.Solid:
                terminal.drawRect(r.x, r.y, r.width, r.height, 219, this.foregroundColor, this.backgroundColor);
                break;
            case BorderStyle.Single:
                terminal.drawSingleRect(r.x, r.y, r.width, r.height, this.foregroundColor, this.backgroundColor);
                break;
            case BorderStyle.Double:
                terminal.drawDoubleRect(r.x, r.y, r.width, r.height, this.foregroundColor, this.backgroundColor);
                break;
        }
	}
}