namespace UIKeyboardSystem {
    export type Config = WorldObject.Config<UIKeyboardSystem> & {
        elements: (WorldObject | UIElement)[];
        startSelectionMode?: UIElement.SelectionMode;
        startSelectedIndex?: number;
        precisionAngle?: number;
        minMajorAxisDistance?: number;
        autoRepeatEnabled?: boolean;
        keys?: {
            up?: string;
            down?: string;
            left?: string;
            right?: string;
            interact?: string;
        };
    }
}

class UIKeyboardSystem extends WorldObject {
    private elements: UIElement[];
    private precisionAngle: number;
    private minMajorAxisDistance: number;
    private autoRepeatEnabled: boolean;

    private selectedIndex: number;
    private clickedDown: boolean;

    constructor(config: UIKeyboardSystem.Config) {
        super(config);
        this.elements = config.elements.map(e => {
            if (e instanceof UIElement) return e;
            let module = e.getModule(UIElement);
            if (module) return module;
            console.error('WorldObject does not have UIElement for keyboard system:', config.elements, this);
            return new UIElement({});
        });
        this.precisionAngle = config.precisionAngle ?? 10;
        this.minMajorAxisDistance = config.minMajorAxisDistance ?? 2;
        this.autoRepeatEnabled = config.autoRepeatEnabled ?? true;
        this.selectedIndex = config.startSelectedIndex ?? this.elements.findIndex(e => !e.state.disabled);
        this.clickedDown = false;

        let upKey = config.keys?.up ?? 'up';
        let downKey = config.keys?.down ?? 'down';
        let leftKey = config.keys?.left ?? 'left';
        let rightKey = config.keys?.right ?? 'right';
        let interactKey = config.keys?.interact ?? 'game_select';

        let uiKeyboardSystem = this;
        this.behavior = new ControllerBehavior(function(delta) {
            if (uiKeyboardSystem.autoRepeatEnabled) {
                let isDirectionKeyPressed = Input.isDown(upKey) || Input.isDown(downKey) || Input.isDown(leftKey) || Input.isDown(rightKey);
                let autoRepeat = lazy('UIKeyboardSystem/autoRepeat', () => new AutoRepeat(0.5, 0.08));
                autoRepeat.update(isDirectionKeyPressed, delta);
    
                this.controller.up = Input.isDown(upKey) && autoRepeat.get();
                this.controller.down = Input.isDown(downKey) && autoRepeat.get();
                this.controller.left = Input.isDown(leftKey) && autoRepeat.get();
                this.controller.right = Input.isDown(rightKey) && autoRepeat.get();
            } else {
                this.controller.up = Input.justDown(upKey);
                this.controller.down = Input.justDown(downKey);
                this.controller.left = Input.justDown(leftKey);
                this.controller.right = Input.justDown(rightKey);
            }

            this.controller.interact = Input.justUp(interactKey);
            this.controller.keys.justInteract = Input.justDown(interactKey);
            this.controller.keys.holdInteract = Input.isDown(interactKey);
        });

        if (config.startSelectionMode) {
            this.setSelectionMode(config.startSelectionMode);
        }
    }

    override update(): void {
        super.update();

        if (this.elements.every(e => e.state.disabled)) {
            return;
        }

        if (this.selectedIndex < 0) {
            this.elements.findIndex(e => !e.state.disabled);
        }

        if (this.elements.some(e => e.selectionMode === 'mouse') && this.elements.some(e => e.selectionMode === 'manual')) {
            this.setSelectionMode('mouse');
        }

        if (this.controller.up || this.controller.down || this.controller.left || this.controller.right) {
            this.setSelectionMode('manual');
            this.clickedDown = false;
        }

        let currentMode = this.elements.some(e => e.selectionMode === 'mouse') ? 'mouse' : 'manual';

        if (currentMode === 'mouse' && !this.elements[this.selectedIndex].state.hovered) {
            let hoveredIndex = this.elements.findIndex(e => e.state.hovered);
            this.selectedIndex = hoveredIndex >= 0 ? hoveredIndex : this.selectedIndex;
        }

        if (this.controller.left) {
            this.elements[this.selectedIndex].setSelected(false);
            this.selectToDirection('left');
            this.elements[this.selectedIndex].setSelected(true);
        }
        if (this.controller.right) {
            this.elements[this.selectedIndex].setSelected(false);
            this.selectToDirection('right');
            this.elements[this.selectedIndex].setSelected(true);
        }
        if (this.controller.up) {
            this.elements[this.selectedIndex].setSelected(false);
            this.selectToDirection('up');
            this.elements[this.selectedIndex].setSelected(true);
        }
        if (this.controller.down) {
            this.elements[this.selectedIndex].setSelected(false);
            this.selectToDirection('down');
            this.elements[this.selectedIndex].setSelected(true);
        }

        if (currentMode === 'manual') {
            if (this.controller.keys.holdInteract) {
                this.elements[this.selectedIndex].setClickedDown(true);
            } else {
                this.elements[this.selectedIndex].setClickedDown(false);
            }
        }

        if (this.controller.keys.justInteract) {
            this.clickedDown = true;
        }

        if (this.controller.interact && this.clickedDown) {
            this.clickedDown = false;
            this.elements[this.selectedIndex].click();
        }
    }

    private selectToDirection(direction: 'left' | 'right' | 'up' | 'down') {
        let preciseResults = this.getNextSelectToDirection(direction, this.precisionAngle);
        if (preciseResults.closestPosI >= 0) {
            this.selectedIndex = preciseResults.closestPosI;
            return;
        }

        let broadResults = this.getNextSelectToDirection(direction, 360);
        if (broadResults.closestPosI >= 0) {
            this.selectedIndex = broadResults.closestPosI;
            return;
        }

        // Prefer broad wrap-around over narrow. If this should be changed, make it an option for the user.
        if (broadResults.farthestNegI >= 0) {
            this.selectedIndex = broadResults.farthestNegI;
            return;
        }

        if (preciseResults.farthestNegI >= 0) {
            this.selectedIndex = preciseResults.farthestNegI;
            return;
        }
    }

    private getNextSelectToDirection(direction: 'left' | 'right' | 'up' | 'down', limitAngle: number) {
        let currentElement = this.elements[this.selectedIndex];
        let closestPosI = -1;
        let farthestNegI = -1;
        let closestPosD = Infinity;
        let farthestNegD = 0;
        for (let i = 0; i < this.elements.length; i++) {
            if (i === this.selectedIndex) continue;
            let element = this.elements[i];

            if (element.state.disabled) continue;

            let dx = element.worldObject.x - currentElement.worldObject.x;
            let dy = element.worldObject.y - currentElement.worldObject.y;

            if (dx === 0 && dy === 0) continue;
            let angleBetweenDirs = Vector2.angleBetween(tmp.vec2(dx, dy), Direction.fromLike(direction));
            if (angleBetweenDirs > limitAngle && angleBetweenDirs < 180 - limitAngle) continue;

            let majorAxis: number;
            let minorAxis: number;

            if (direction === 'left') {
                majorAxis = -dx;
                minorAxis = Math.abs(dy);
            } else if (direction === 'right') {
                majorAxis = dx;
                minorAxis = Math.abs(dy);
            } else if (direction === 'up') {
                majorAxis = -dy;
                minorAxis = Math.abs(dx);
            } else /* down */ {
                majorAxis = dy;
                minorAxis = Math.abs(dx);
            }

            if (Math.abs(majorAxis) < this.minMajorAxisDistance) continue;
            
            let totalD = majorAxis + 0.001 * minorAxis;

            if (totalD > 0 && totalD < closestPosD) {
                closestPosD = totalD;
                closestPosI = i;
            } else if (totalD < 0 && totalD < farthestNegD) {
                farthestNegD = totalD;
                farthestNegI = i;
            }
        }

        let result = FrameCache.object() as { closestPosI: number, farthestNegI: number };

        result.closestPosI = closestPosI;
        result.farthestNegI = farthestNegI;

        return result;
    }

    private setSelectionMode(selectionMode: UIElement.SelectionMode) {
        for (let i = 0; i < this.elements.length; i++) {
            let element = this.elements[i];
            element.selectionMode = selectionMode;
            if (selectionMode === 'manual') {
                element.setHovered(false);
                if (i === this.selectedIndex) {
                    element.setSelected(true);
                } else {
                    element.setSelected(false);
                }
            } else {
                element.setSelected(false);
            }
        }
    }
}