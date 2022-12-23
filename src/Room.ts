import Rectangle from './math/Rectangle';

export default class Room extends Rectangle {
	constructor(rect: Rectangle) {
		super(rect.x, rect.y, rect.width, rect.height);
	}
}
