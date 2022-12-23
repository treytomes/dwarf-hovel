import Entity from "../entities/Entity";
import GameplayState from "../GameplayState";

export default abstract class AntBehavior {
	update(entity: Entity, world: GameplayState) { }
}
