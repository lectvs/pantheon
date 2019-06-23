type AllStageConfig  = WorldObject.StageConfig & World.StageConfig & PhysicsWorldObject.StageConfig & Sprite.StageConfig & SpriteText.StageConfig;
type SomeStageConfig = WorldObject.StageConfig | World.StageConfig | PhysicsWorldObject.StageConfig | Sprite.StageConfig | SpriteText.StageConfig;

type Stage = World.Config & Schema;

type Schema = {
    worldObjects?: SomeStageConfig[];
}

namespace WorldObject {
    export type StageConfig = Config & {
        constructor?: any;
        layer?: string;
    }
}

namespace World {
    export type StageConfig = Config & WorldObject.StageConfig & {
        
    };
}

namespace PhysicsWorldObject {
    export type StageConfig = Config & WorldObject.StageConfig & {
        physicsGroup?: string;
    }
}

namespace Sprite {
    export type StageConfig = Sprite.Config & PhysicsWorldObject.StageConfig & {
        
    }
}

namespace SpriteText {
    export type StageConfig = SpriteText.Config & WorldObject.StageConfig & {

    }
}
