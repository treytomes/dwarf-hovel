import { initialize } from './framework/bootstrap';
import TerminalGameCanvas from './TerminalGameCanvas';
import './style.css';
import GameState from './GameState';
import GameplayState from './GameplayState';
import Logger from './Logger';

// TODO: https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API

//const ASPECT_RATIO = 8 / 7; // SNES
const ASPECT_RATIO = 16 / 9; // Standard
//const SCREEN_ROWS = 28; // Looks more like an SNES display.
const SCREEN_ROWS = 32;

class DwarfHovelGameCanvas extends TerminalGameCanvas {
	states: Array<GameState>;

	constructor() {
		super(SCREEN_ROWS, Math.ceil(28 * ASPECT_RATIO))

		this.states = [];
		this.states.push(new GameplayState(this.rows, this.columns));
	}

	get currentState() {
		return this.states[this.states.length - 1];
	}
	
    onUpdate(time: number) {
		this.currentState.onUpdate(time);
		Logger.update(time);
	}

	onRender(time: number) {
		this.currentState.onRender(time, this);
		Logger.render(this);
		super.onRender(time);
	}

	onKeyDown(e: KeyboardEvent) {
		this.currentState.onKeyDown(e);
	}

	onKeyUp(e: KeyboardEvent) {
		this.currentState.onKeyUp(e);
	}

	onMouseDown(x: number, y: number, buttons: number) {
		this.currentState.onMouseDown(x, y, buttons);
	}

    onMouseUp(x: number, y: number, buttons: number) {
		this.currentState.onMouseUp(x, y, buttons);
	}

    onMouseMove(x: number, y: number, buttons: number) {
		this.currentState.onMouseMove(x, y, buttons);
	}
}

function onWindowLoad() {
	initialize(new DwarfHovelGameCanvas());
}

window.addEventListener('load', onWindowLoad, false);
