import AntBehavior from "./AntBehavior";
import AntEntity from "../entities/AntEntity";
import GameplayState from "../GameplayState";
import ReturningHome from "./ReturningHome";

export default class SearchingForFood extends AntBehavior {
	update(entity: AntEntity, world: GameplayState) {
		if (entity.foodValue > 0) {
			entity.behavior = new ReturningHome();
		}
	}
}
