import { indexOf } from "lodash";
import { getColor } from "./framework/radialPalette";
import TerminalGameCanvas from "./TerminalGameCanvas";

export enum LogLevel {
	DEBUG,
	INFO,
	WARNING,
	DANGER,
	WHITE,
	RED,
	GREEN,
	YELLOW
}

class LogMessage {
	level: LogLevel;
	message: string;
	private readonly maxLifeSpan: number;
	private lifeSpan: number;

	constructor(message: string, level: LogLevel = LogLevel.INFO, lifeSpan: number = 3000) {
		this.message = message;
		this.level = level;
		this.maxLifeSpan = lifeSpan;
		this.lifeSpan = lifeSpan;
	}

	get isAlive(): boolean {
		return this.lifeSpan > 0;
	}

	private get intensity(): number {
		return Math.ceil(5 * this.lifeSpan / this.maxLifeSpan);
	}

	get foregroundColor(): number {
		switch (this.level) {
			default:
			case LogLevel.INFO:
			case LogLevel.WHITE:
				return getColor(this.intensity, this.intensity, this.intensity);
			case LogLevel.WARNING:
			case LogLevel.YELLOW:
				return getColor(this.intensity, this.intensity, 0);
			case LogLevel.DANGER:
			case LogLevel.RED:
				return getColor(0);
		}
	}

	get backgroundColor(): number {
		switch (this.level) {
			default:
			case LogLevel.INFO:
			case LogLevel.WHITE:
				return getColor(0);
			case LogLevel.WARNING:
			case LogLevel.YELLOW:
				return getColor(0);
			case LogLevel.DANGER:
			case LogLevel.RED:
				return getColor(this.intensity, 0, 0);
		}
	}

	update(time: number) {
		this.lifeSpan -= time;
	}

	render(terminal: TerminalGameCanvas, row: number) {
		terminal.drawString(row, 0, this.message, this.foregroundColor, this.backgroundColor);
	}
}

export default abstract class Logger {
	static messages: LogMessage[] = [];

	static log(text: string, level: LogLevel = LogLevel.INFO) {
		console.log(text);
		if (level !== LogLevel.DEBUG) {
			Logger.messages.push(new LogMessage(text, level));
		}
	}

	static update(time: number) {
		const deadMessages: LogMessage[] = [];

		for (let n = 0; n < Logger.messages.length; n++) {
			const msg = Logger.messages[n];
			msg.update(time);
			if (!msg.isAlive) {
				deadMessages.push(msg);
			}
		}

		for (let n = 0; n < deadMessages.length; n++) {
			Logger.messages = Logger.messages.filter(x => x !== deadMessages[n]);
		}
	}

	static render(terminal: TerminalGameCanvas) {
		for (let n = 0; n < Logger.messages.length; n++) {
			Logger.messages[n].render(terminal, terminal.rows - (Logger.messages.length - n));
		}
	}
}
