namespace Chain {
    export type Node = {
        p: Vector2;
        lastp: Vector2;
    }
}

class Chain extends WorldObject {
    private nodes: Chain.Node[];
    private springLengths: number[];
    private gravity: number;

    constructor(nodes: Vector2[]) {
        super({
            x: nodes[0].x, y: nodes[0].y,
            layer: 'main',
        });

        this.nodes = nodes.map(node => this.newNode(node.x, node.y));
        this.springLengths = A.range(this.nodes.length-1).map(i => G.distance(this.nodes[i].p, this.nodes[i+1].p));
        this.gravity = 200;
    }

    update() {
        super.update();

        for (let node of this.nodes) {
            let dx = node.p.x - node.lastp.x;
            let dy = node.p.y - node.lastp.y;

            let drag = Math.pow(0.99, 60*this.delta);

            dx *= drag;
            dy *= drag;
            dy += this.gravity * this.delta**2;

            node.lastp.x = node.p.x;
            node.lastp.y = node.p.y;
            node.p.x += dx;
            node.p.y += dy;
        }

        for (let iter = 0; iter < 20; iter++) {
            for (let i = 0; i < this.springLengths.length; i++) {
                let node = this.nodes[i];
                let nextNode = this.nodes[i+1];

                let restDistance = this.springLengths[i];

                let d = vec2(nextNode.p.x - node.p.x, nextNode.p.y - node.p.y);
                let restd = d.withMagnitude(restDistance);

                let dd = vec2(d.x - restd.x, d.y - restd.y);

                node.p.x += dd.x/2;
                node.p.y += dd.y/2;
                nextNode.p.x -= dd.x/2;
                nextNode.p.y -= dd.y/2;
            }
        }

        this.nodes[0].p.x = this.x;
        this.nodes[0].p.y = this.y;

        if (Input.isDown('lmb')) {
            this.nodes[this.nodes.length-1].p.x = this.world.getWorldMouseX();
            this.nodes[this.nodes.length-1].p.y = this.world.getWorldMouseY();
        }
    }

    render(texture: Texture, x: number, y: number) {
        Draw.brush.color = 0xFFFFFF;
        Draw.brush.alpha = 1;
        Draw.brush.thickness = 2;
        for (let i = 1; i < this.nodes.length; i++) {
            let node = this.nodes[i];
            let previousNode = this.nodes[i-1];
            Draw.line(texture, x + previousNode.p.x - this.x, y + previousNode.p.y - this.y, x + node.p.x - this.x, y + node.p.y - this.y);
        }

        // Draw.brush.color = 0x00FF00;
        // for (let node of this.nodes) {
        //     Draw.pixel(texture, x + node.p.x - this.x, y + node.p.y - this.y);
        // }

        super.render(texture, x, y);
    }

    getClosestNodeTo(x: number, y: number) {
        return M.argmin(A.range(this.nodes.length-1), i => M.distance(this.nodes[i+1].p.x, this.nodes[i+1].p.y, x, y));
    }

    getNodePosition(index: number) {
        return this.nodes[index].p.clone();
    }

    getNodeVelocity(index: number) {
        if (this.delta === 0) return Vector2.ZERO;
        let node = this.nodes[index];
        let v = vec2(node.p.x - node.lastp.x, node.p.y - node.lastp.y);
        v.scale(1/this.delta);
        return v;
    }

    applyNodeAcceleration(index: number, v: Vector2) {
        let node = this.nodes[index];
        let dx = node.p.x - node.lastp.x;
        let dy = node.p.y - node.lastp.y;

        let nodeDir = this.averageDir();
        let cnodeDir = vec2(-nodeDir.y, nodeDir.x);

        let vp = v.projectedOnto(cnodeDir);

        dx += vp.x * this.delta**2;
        dy += vp.y * this.delta**2;

        node.lastp.x = node.p.x - dx;
        node.lastp.y = node.p.y - dy;
    }

    private averageDir() {
        let result = Vector2.ZERO;
        for (let i = 0; i < this.nodes.length-1; i++) {
            result.x += this.nodes[i+1].p.x - this.nodes[i].p.x;
            result.y += this.nodes[i+1].p.y - this.nodes[i].p.y;
        }
        result.scale(1/(this.nodes.length-1));
        return result;
    }

    private newNode(x: number, y: number): Chain.Node {
        return {
            p: vec2(x, y),
            lastp: vec2(x, y),
        };
    }
}