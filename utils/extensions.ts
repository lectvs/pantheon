// Source: https://stackoverflow.com/questions/13897659/extending-functionality-in-typescript

Array.prototype.findIndexLast = function(predicate: (value: any, index: number, obj: any[]) => any): number {
    if (this.length === 0) return -1;
    for (let i = this.length-1; i >= 0; i--) {
        if (predicate(this[i], i, this)) return i;
    }
    return -1;
}

Array.prototype.findLast = function(predicate: (value: any, index: number, obj: any[]) => any) {
    if (this.length === 0) return undefined;
    for (let i = this.length-1; i >= 0; i--) {
        if (predicate(this[i], i, this)) return this[i];
    }
    return undefined;
}

Array.prototype.last = function() {
    if (this.length === 0) return undefined;
    return this[this.length-1];
}