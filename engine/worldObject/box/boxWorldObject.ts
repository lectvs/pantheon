namespace BoxWorldObject {
    export type Config = WorldObject.Config<BoxWorldObject> & {
        /**
         * Box position is relative to the WorldObject.
         * All WorldObjects in the box will be added to the WorldObject as children.
         */
        box: Box;
    }
}

class BoxWorldObject extends WorldObject {
    box: Box;

    debugDrawBox: boolean;

    constructor(config: BoxWorldObject.Config) {
        super(config);
        this.box = config.box.build();
        this.addChildren(this.box.getAllWorldObjects$());

        this.debugDrawBox = false;
    }

    override postUpdate(): void {
        super.postUpdate();

        if (this.debugDrawBox) {
            this.moveToFront();
        }
    }

    override render(): Render.Result {
        let result: Render.Result = FrameCache.array();
        if (this.debugDrawBox) {
            result.pushAll(this.renderBox());
        }
        result.pushAll(super.render());
        return result;
    }

    private renderBox() {
        return this.box.debugRender()
    }
}
