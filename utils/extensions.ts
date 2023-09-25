// Source: https://stackoverflow.com/questions/13897659/extending-functionality-in-typescript

Array.prototype.last = function() {
    if (this.length === 0) return undefined;
    return this[this.length-1];
}