// Source: https://stackoverflow.com/questions/13897659/extending-functionality-in-typescript

Array.prototype.argmax = function(key: (value: any, index: number, obj: any[]) => number) {
    return this.argmin((value, index, obj) => -key(value, index, obj));
}

Array.prototype.argmin = function(key: (value: any, index: number, obj: any[]) => number) {
    if (this.length == 0) return undefined;
    let result = this[0];
    let resultValue = key(this[0], 0, this);

    for (let i = 1; i < this.length; i++) {
        let value = key(this[i], i, this);
        if (value < resultValue)  {
            result = this[i];
            resultValue = value;
        }
    }

    return result;
}

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

Array.prototype.mapToObject = function(keyFn: (value: any, index: number, obj: any[]) => any, valueFn: (value: any, index: number, obj: any[]) => any, resolveConflicts: 'earliest' | 'latest' = 'latest') {
    let result: any = {};
    for (let i = 0; i < this.length; i++) {
        let key = keyFn(this[i], i, this);
        let value = valueFn(this[i], i, this);
        if (key in result && resolveConflicts === 'earliest') {
            continue;
        }
        result[key] = value;
    }
    return result;
}

Array.prototype.max = function(key: (value: any, index: number, obj: any[]) => number = Utils.IDENTITY) {
    return -this.min((value, index, obj) => -key(value, index, obj));
}

Array.prototype.min = function(key: (value: any, index: number, obj: any[]) => number = Utils.IDENTITY) {
    if (this.length == 0) return NaN;
    let resultValue = key(this[0], 0, this);

    for (let i = 1; i < this.length; i++) {
        let value = key(this[i], i, this);
        if (value < resultValue)  {
            resultValue = value;
        }
    }

    return resultValue;
}

Array.prototype.pushAll = function(other: any[]) {
    if (!other) return this.length;
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

    let filterArea = TextureUtils.getFilterArea$(this.texture, filters,
        this.x,
        this.y,
        this.scale.x,
        this.scale.y,
        this.angle,
        this.anchor,
    );

    if (filterArea) {
        if (this.filterArea) {
            this.filterArea.copyFrom(filterArea);
        } else {
            this.filterArea = new PIXI.Rectangle().copyFrom(filterArea);
        }
    } else {
        // @ts-expect-error
        this.filterArea = null;
    }
}

PIXI.Filter.prototype.setUpscale = function(scale: number) {
    // Pass, implement per-filter
}

Object.defineProperty(PIXI.Texture.prototype, 'left', {
    get: function(this: PIXI.Texture) {
        return this.width * (-this.defaultAnchor.x);
    },
});
Object.defineProperty(PIXI.Texture.prototype, 'right', {
    get: function(this: PIXI.Texture) {
        return this.width * (1-this.defaultAnchor.x);
    },
});
Object.defineProperty(PIXI.Texture.prototype, 'top', {
    get: function(this: PIXI.Texture) {
        return this.height * (-this.defaultAnchor.y);
    },
});
Object.defineProperty(PIXI.Texture.prototype, 'bottom', {
    get: function(this: PIXI.Texture) {
        return this.height * (1-this.defaultAnchor.y);
    },
});