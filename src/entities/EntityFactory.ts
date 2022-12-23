import AntEntity from "./AntEntity";
import AntNestEntity from "./AntNestEntity";
import PlayerEntity from "./PlayerEntity";

export default class EntityFactory {
	static player(x: number, y: number) {
		const entity = new PlayerEntity();
		entity.x = x;
		entity.y = y;
		return entity;
	}

	static ant(x: number, y: number) {
		const entity = new AntEntity(x, y);
		entity.x = x;
		entity.y = y;
		return entity;
	}

	static antNest(x: number, y: number) {
		const entity = new AntNestEntity();
		entity.x = x;
		entity.y = y;
		return entity;
	}
}
