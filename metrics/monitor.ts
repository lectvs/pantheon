class Monitor {
    private points: number[];

    constructor() {
        this.points = [];
    }

    addPoint(point: number) {
        this.points.push(point);
    }

    clear() {
        this.points = [];
    }

    getAvg() {
        return A.sum(this.points) / this.points.length;
    }

    getP(p: number) {
        let count = (p === 100) ? 1 : Math.ceil(this.points.length * (100-p) / 100);
        let sum = 0;
        A.sort(this.points, point => point);
        for (let i = this.points.length - count; i < this.points.length; i++) {
            sum += this.points[i];
        }
        return sum / count;
    }

    getQ(q: number) {
        let count = (q === 0) ? 1 : Math.ceil(this.points.length * q / 100);
        let sum = 0;
        A.sort(this.points, point => point);
        for (let i = 0; i < count; i++) {
            sum += this.points[i];
        }
        return sum / count;
    }

    isEmpty() {
        return _.isEmpty(this.points);
    }
}