import AntBehavior from "./AntBehavior";
import AntEntity from "../entities/AntEntity";
import GameplayState from "../GameplayState";

export default class ReturningHome extends AntBehavior {
	update(entity: AntEntity, world: GameplayState) {
		const home_dx = (entity.x - entity.homeX);
		const home_dy = (entity.y - entity.homeY);
		const homeDistance = Math.sqrt(home_dx * home_dx + home_dy * home_dy);
		const closeToHome = (homeDistance <= 2);

		if (!closeToHome) {
			// Move towards home.
			const move_dx = Math.sign(home_dx);
			const move_dy = Math.sign(home_dy);
			entity.move(world, move_dx, 0);
			entity.move(world, 0, move_dy);
		}
	}
}
