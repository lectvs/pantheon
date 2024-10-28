namespace BoxWorldObject {
    export type Config = WorldObject.Config<BoxWorldObject> & {
        /**
         * BoxWorldObject uses the root of the box provided here.
         * Box position is relative to the WorldObject.
         * All WorldObjects in the box will be added to the WorldObject as children.
         */
        box: Box | Box.Subdivision;
    }

    export type ListConfig = Omit<BoxWorldObject.Config, 'box'> & {
        itemCount: number;
        itemWidth: number;
        itemHeight: number;
        itemBox: (box: Box, i: number) => void;
        alignment: 'horizontal' | 'vertical';
        anchor?: Vector2;
    }
}

class BoxWorldObject extends WorldObject {
    box: Box;

    debugDrawBox: boolean;

    constructor(config: BoxWorldObject.Config) {
        super(config);
        this.box = config.box.root().build();
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

namespace BoxWorldObject {
    export class List extends BoxWorldObject {
        constructor(config: BoxWorldObject.ListConfig) {
            let boxWidth = config.alignment === 'vertical' ? config.itemWidth : config.itemWidth * config.itemCount;
            let boxHeight = config.alignment === 'horizontal' ? config.itemHeight : config.itemHeight * config.itemCount;
            let box = new Box(0, 0, boxWidth, boxHeight).anchor(config.anchor ?? Anchor.TOP_LEFT);
            let subdivision = config.alignment === 'horizontal'
                ? box.subdivideX(config.itemCount)
                : box.subdivideY(config.itemCount);
            for (let i = 0; i < config.itemCount; i++) {
                config.itemBox(subdivision.index(i), i);
            }

            super({
                ...config,
                box,
            });
        }
    }
}
