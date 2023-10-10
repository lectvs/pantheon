type TouchData = {
    id: number;
    x: number;
    y: number;
    radius: number;
}

class TouchManager {
    private static touches: TouchData[] = [];

    static get isTouching() { return this.touches.length > 0; }

    static get touch() { return this.isTouching ? this.touches[0] : undefined; }

    static onTouchDown: () => void;
    static onTouchUp: () => void;

    static handleTouchStartEvent(event: TouchEvent) {
        // TODO: handle multiple touches at some point
        if (this.isTouching) return;

        for (let i = 0; i < event.changedTouches.length; i++) {
            let touch = event.changedTouches[i];
            this.touches.push(this.getTouchData(touch));
        }
        if (this.isTouching && this.onTouchDown) this.onTouchDown();
    }

    static handleTouchMoveEvent(event: TouchEvent) {
        for (let i = 0; i < event.changedTouches.length; i++) {
            let touch = event.changedTouches[i];
            let index = this.touches.findIndex(td => td.id === touch.identifier);
            if (index >= 0) {
                this.touches[index] = this.getTouchData(touch);
            }
        }
    }

    static handleTouchEndEvent(event: TouchEvent) {
        for (let i = 0; i < event.changedTouches.length; i++) {
            let touch = event.changedTouches[i];
            let index = this.touches.findIndex(td => td.id === touch.identifier);
            if (index >= 0) {
                this.touches.splice(index, 1);
            }
        }
        if (!this.isTouching && this.onTouchUp) this.onTouchUp();
    }

    static handleTouchCancelEvent(event: TouchEvent) {
        for (let i = 0; i < event.changedTouches.length; i++) {
            let touch = event.changedTouches[i];
            let index = this.touches.findIndex(td => td.id === touch.identifier);
            if (index >= 0) {
                this.touches.splice(index, 1);
            }
        }
        if (!this.isTouching && this.onTouchUp) this.onTouchUp();
    }

    private static getTouchData(touch: Touch): TouchData {
        let bounds = Main.renderer.view.getBoundingClientRect();
        return {
            id: touch.identifier,
            x: M.map(touch.pageX, bounds.left, bounds.right, 0, global.gameWidth),
            y: M.map(touch.pageY, bounds.top, bounds.bottom, 0, global.gameHeight),
            radius: 10, // TODO: touch radius issues on Android?
        };
    }
}