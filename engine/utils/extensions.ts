// Source: https://stackoverflow.com/questions/13897659/extending-functionality-in-typescript

Array.prototype.clear = function() {
    this.length = 0;
}

Array.prototype.filterInPlace = function(predicate: (value: any, index: number, obj: any[]) => any) {
    let currentEndIndex = 0;
    for (let i = 0; i < this.length; i++) {
        if (predicate(this[i], i, this)) {
            if (currentEndIndex !== i) this[currentEndIndex] = this[i];
            currentEndIndex++;
        }
    }
    this.length = currentEndIndex;
    return this;
}

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

Array.prototype.mapInPlace = function(fn: (value: any, index: number, obj: any[]) => any) {
    for (let i = 0; i < this.length; i++) {
        this[i] = fn(this[i], i, this);
    }
    return this;
}

Array.prototype.pushAll = function(other: any[]) {
    for (let i = 0; i < other.length; i++) {
        this.push(other[i]);
    }
    return this.length;
}

Array.prototype.removeAt = function(index: number, removeCount: number = 1) {
    if (index < 0 || index >= this.length) return undefined;
    for (let i = index + removeCount; i < this.length; i++) {
        this[i - removeCount] = this[i];
    }
    this.length -= removeCount;
}

PIXI.Sprite.prototype.updateAndSetEffects = function(effects: Effects) {
    let filters = effects.getFilterList$();
    for (let filter of filters) {
        filter.setTextureValuesFromSprite(this);
    }
    if (!A.equals(this.filters, filters)) {
        this.filters = filters.slice();
    }

    let filterArea = TextureUtils.getFilterArea(this.texture, filters, {
        x: this.x,
        y: this.y,
        scaleX: this.scale.x,
        scaleY: this.scale.y,
        angle: this.angle,
    });

    if (filterArea) {
        this.filterArea = filterArea;
    } else {
        // @ts-expect-error
        this.filterArea = null;
    }
}