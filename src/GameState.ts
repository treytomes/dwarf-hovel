import TerminalGameCanvas from "./TerminalGameCanvas";

/**
 * A generic state to base all other states on.
 */
export default class GameState {
	constructor() {}
	
	/**
	 * @param {number} time Elapsed time since the last frame. 
	 */
	onUpdate(time: number) {}

	/**
	 * 
	 * @param {number} time Elapsed time since the last frame.
	 * @param {TerminalGameCanvas} terminal The screen to draw to.
	 */
	onRender(time: number, terminal: TerminalGameCanvas) {}

	onKeyDown(e: KeyboardEvent) {}

	onKeyUp(e: KeyboardEvent) {}

	onMouseDown(x: number, y: number, buttons: number) {}

	onMouseUp(x: number, y: number, buttons: number) {}

	onMouseMove(x: number, y: number, buttons: number) {}
}
