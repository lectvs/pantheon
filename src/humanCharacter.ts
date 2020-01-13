/// <reference path="./sprite.ts" />

class HumanCharacter extends Sprite {
    speed: number = 60;

    private direction: Direction2D;
    private _follow: Follow;

    constructor(config: Sprite.Config) {
        super(config);

        this.controllerSchema = {
            left: () => Input.isDown('left'),
            right: () => Input.isDown('right'),
            up: () => Input.isDown('up'),
            down: () => Input.isDown('down'),
        };

        this.direction = Direction2D.LEFT;
    }

    update(delta: number) {
        this.updateFollow();

        let haxis = (this.controller.right ? 1 : 0) - (this.controller.left ? 1 : 0);
        let vaxis = (this.controller.down ? 1 : 0) - (this.controller.up ? 1 : 0);

        if (haxis < 0) {
            this.vx = -this.speed;
            this.direction.h = Direction.LEFT;
            if (vaxis == 0) this.direction.v = Direction.NONE;
            this.flipX = false;
        } else if (haxis > 0) {
            this.vx = this.speed;
            this.direction.h = Direction.RIGHT;
            if (vaxis == 0) this.direction.v = Direction.NONE;
            this.flipX = true;
        } else {
            this.vx = 0;
        }

        if (vaxis < 0) {
            this.vy = -this.speed;
            this.direction.v = Direction.UP;
            if (haxis == 0) this.direction.h = Direction.NONE;
        } else if (vaxis > 0) {
            this.vy = this.speed;
            this.direction.v = Direction.DOWN;
            if (haxis == 0) this.direction.h = Direction.NONE;
        } else {
            this.vy = 0;
        }

        super.update(delta);

        this.updateInteractions();

        // Handle animation.
        let anim_state = (haxis == 0 && vaxis == 0) ? 'idle' : 'run';
        let anim_dir = this.direction.v == Direction.UP ? 'up' : (this.direction.h == Direction.NONE ? 'down' : 'side');

        this.playAnimation(`${anim_state}_${anim_dir}`);
    }

    updateInteractions() {
        if (!this.isControlled) {
            global.theater.interactionManager.highlight(null);
            return;
        }

        let interactableObjects = global.theater.interactionManager.getInteractableObjects();
        let interactRadius = 2;

        let highlightedObject: string = null;

        G.expandRectangle(this.bounds, interactRadius);
        for (let obj of interactableObjects) {
            if (this.isOverlapping(this.world.getWorldObjectByName<PhysicsWorldObject>(obj))) {
                highlightedObject = obj;
            }
        }
        G.expandRectangle(this.bounds, -interactRadius);

        global.theater.interactionManager.highlight(highlightedObject);
        if (Input.justDown('interact') && highlightedObject) {
            global.theater.interactionManager.interact(highlightedObject);
        }
    }

    follow(thing: Follow.Target, maxDistance: number = 24) {
        this._follow = new Follow(thing, maxDistance);
    }

    onCollide(other: PhysicsWorldObject) {
        if (other instanceof Warp) {
            other.warp();
        }
    }

    setDirection(direction: Direction2D) {
        this.direction.h = direction.h;
        this.direction.v = direction.v;
    }

    unfollow() {
        this._follow = null;
    }

    private updateFollow() {
        if (this._follow) this._follow.update(this);
    }
}