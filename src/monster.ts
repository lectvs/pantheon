class Monster extends Human {
    private static readonly attackDistance = 16;

    private attackdx: number;
    private attackdy: number;

    private pickupScript: Script;
    get pickingUp() { return this.pickupScript && !this.pickupScript.done; }

    get immobile() { return this.stunned || this.swinging || this.pickingUp; }

    constructor(config: Human.Config) {
        super(config, {
            speed: 10,
            preSwingWait: 0.3,
            postSwingWait: 2,
            itemGrabDistance: 8,
            animations: [
                Animations.fromTextureList({ name: 'idle_empty', texturePrefix: 'monster_', textures: [0, 1, 2], frameRate: 8, count: -1 }),
                Animations.fromTextureList({ name: 'run_empty', texturePrefix: 'monster_', textures: [4, 5, 6, 7], frameRate: 8, count: -1 }),
                Animations.fromTextureList({ name: 'idle_holding', texturePrefix: 'monster_', textures: [8, 9, 10], frameRate: 4, count: -1 }),
                Animations.fromTextureList({ name: 'run_holding', texturePrefix: 'monster_', textures: [12, 13, 14, 15], frameRate: 8, count: -1 }),
                Animations.fromTextureList({ name: 'swing', texturePrefix: 'monster_', textures: [16, 17, 17, 17, 16], frameRate: 8, count: 1, forceRequired: true }),
                Animations.fromTextureList({ name: 'hurt', texturePrefix: 'monster_', textures: [24], frameRate: 1/6, count: 1, forceRequired: true, nextFrameRef: 'hurt_shake/0' }),
                Animations.fromTextureList({ name: 'hurt_shake', texturePrefix: 'monster_', textures: [20, 20, 20, 20, 20, 20, 20, 20,
                                                                                                       21, 22, 23, 22, 21, 22, 23, 22], frameRate: 8, count: 1, forceRequired: true }),
                Animations.fromTextureList({ name: 'pickup', texturePrefix: 'monster_', textures: [25], frameRate: 2, count: 1, forceRequired: true, nextFrameRef: 'idle_holding/0' }),

            ]
        });

        this.attackdx = 0;
        this.attackdy = 0;

        this.pickupItem(new ItemGround(<Item.Config>{
            name: 'monsteraxe',
            constructor: ItemGround,
            type: Item.Type.AXE,
            layer: this.layer,
        }));
    }

    update(delta: number) {
        let player = this.world.getWorldObjectByType(Player);
        let axe = this.getClosestAxe();

        this.setControllerInput(this.heldItem ? player : axe);
        super.update(delta);

        this.handlePickup();
        this.setAttackD(player);
        this.handleAttacking(player);
    }

    private getClosestAxe() {
        let axes = this.world.getWorldObjectsByType(ItemGround).filter(item => item.type === Item.Type.AXE);
        return M.argmin(axes, axe => M.distance(this.x, this.y, axe.x, axe.y));
    }

    private handleAttacking(target: WorldObject) {
        if (!this.world) return;
        if (this.immobile) return;
        if (!this.heldItem) return;

        if (M.distance(this.x, this.y, target.x, target.y) < Monster.attackDistance) {
            this.swingItem();
        }
    }

    private handlePickup() {
        if (this.heldItem || this.pickingUp) return;

        let overlappingItem = this.getOverlappingItem();
        if (overlappingItem && overlappingItem.type === Item.Type.AXE) {
            this.pickupScript = this.world.runScript(S.chain(
                S.call(() => {
                    this.playAnimation('pickup');
                }),
                S.waitUntil(() => this.getCurrentAnimationName() !== 'pickup'),
                S.call(() => {
                    this.controller.pickupDropItem = true;
                }),
            ));
        }
    }

    private setControllerInput(target: WorldObject) {
        let haxis = 0;
        let vaxis = 0;
        if (!this.immobile) {
            haxis = target.x - this.x;
            vaxis = target.y - this.y;
            if (-2 < haxis && haxis < 2) haxis = 0;
            if (-2 < vaxis && vaxis < 2) vaxis = 0;
        }
        this.controller.left = haxis < 0;
        this.controller.right = haxis > 0;
        this.controller.up = vaxis < 0;
        this.controller.down = vaxis > 0;
    }

    private setAttackD(target: WorldObject) {
        if (this.immobile) return;
        this.attackdx = target.x - this.x;
        this.attackdy = target.y - this.y;
        let mag = M.magnitude(this.attackdx, this.attackdy);
        if (mag !== 0) {
            this.attackdx /= mag;
            this.attackdy /= mag;
        }
    }

    protected hitStuff() {
        if (!this.world) return;
        if (!this.heldItem) return;

        let player = this.world.getWorldObjectByType(Player);
        let swingHitbox = this.getSwingHitbox();

        if (player.isOverlappingRect(swingHitbox)) {
            player.hit();
        }
    }

    protected getSwingHitbox(): Rect {
        return {
            x: this.x - 8 + this.attackdx*8,
            y: this.y - 8 + this.attackdy*8,
            width: 16,
            height: 16
        };
    }
}