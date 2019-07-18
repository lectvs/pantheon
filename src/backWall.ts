class BackWall extends PhysicsWorldObject {
    tiles: Sprite[];

    constructor(config: PhysicsWorldObject.Config) {
        super(config, {
            bounds: { x: 0, y: 64, width: 128, height: 16 },
        });
        this.createTiles();
    }

    update() {
        super.update();

        if (Input.justDown('1')) {
            for (let i = 0; i < 10; i++) this.crumble();
        }
    }

    render() {
        for (let tile of this.tiles) {
            tile.render();
        }
        super.render();
    }

    crumble() {
        for (let i = 0; i < 4; i++) {
            if (!_.isEmpty(this.tiles)) {
                this.destroyTile(Random.index(this.tiles));
            }
        }

        if (_.isEmpty(this.tiles)) {
            global.world.removeWorldObject(this);
        }
    }

    createTiles() {
        this.tiles = [];
        for (let x = 0; x < 8; x++) {
            for (let y = 0; y < 5; y++) {
                let tile = new Sprite({
                    x: this.x,
                    y: this.y,
                    offset: {
                        x: 8 + 16*x,
                        y: 8 + 16*y,
                    },
                    texture: `room_backwall_${x + 8*y}`,
                });
                this.tiles.push(tile);
            }
        }
    }

    destroyTile(index: number) {
        let [tile] = this.tiles.splice(index, 1);

        let gravity = 200;
        let angularSpeed = Math.sqrt(Random.value) * 500 * Random.sign();
        let velocity = Random.onCircle(32);

        tile.vx = velocity.x;
        tile.vy = velocity.y;

        global.world.addWorldObject(tile, { layer: global.world.getLayer(this) });
        global.world.runScript(S.doOverTime(1, t => {
            tile.vy += gravity * global.delta;
            tile.angle += angularSpeed * global.delta;
            if (t === 1) {
                global.world.removeWorldObject(tile);
            }
        }));
    }
}