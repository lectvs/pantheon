var __values = (this && this.__values) || function (o) {
    var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
    if (m) return m.call(o);
    return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Point = PIXI.Point;
var Rectangle = PIXI.Rectangle;
var AnimationManager = /** @class */ (function () {
    function AnimationManager(sprite) {
        this.sprite = sprite;
        this.animations = {};
        this.currentFrame = null;
        this.currentFrameTime = 0;
    }
    AnimationManager.prototype.update = function (delta) {
        if (this.currentFrame) {
            this.currentFrameTime += delta;
            if (this.currentFrameTime >= this.currentFrame.duration) {
                this.currentFrameTime -= this.currentFrame.duration;
                this.setCurrentFrame(this.currentFrame.nextFrameRef, false, true);
            }
        }
    };
    AnimationManager.prototype.addAnimation = function (name, frames) {
        if (this.animations[name]) {
            debug("Cannot add animation '" + name + "' to sprite", this.sprite, "since it already exists");
            return;
        }
        this.animations[name] = frames;
    };
    Object.defineProperty(AnimationManager.prototype, "forceRequired", {
        get: function () {
            return this.currentFrame && this.currentFrame.forceRequired;
        },
        enumerable: true,
        configurable: true
    });
    AnimationManager.prototype.getCurrentAnimationName = function () {
        for (var name_1 in this.animations) {
            if (_.contains(this.animations[name_1], this.currentFrame)) {
                return name_1;
            }
        }
        return null;
    };
    AnimationManager.prototype.getCurrentFrame = function () {
        return this.currentFrame;
    };
    AnimationManager.prototype.getFrameByRef = function (ref) {
        var parts = ref.split('/');
        if (parts.length != 2) {
            debug("Cannot get frame '" + name + "' on sprite", this.sprite, "as it does not fit the form '[animation]/[frame]'");
            return null;
        }
        var animation = this.animations[parts[0]];
        if (!animation) {
            debug("Cannot get frame '" + name + "' on sprite", this.sprite, "as animation '" + parts[0] + "' does not exist");
            return null;
        }
        var frame = parseInt(parts[1]);
        if (!isFinite(frame) || frame < 0 || frame >= animation.length) {
            debug("Cannot get frame '" + name + "' on sprite", this.sprite, "as animation '" + parts[0] + " does not have frame '" + parts[1] + "'");
            return null;
        }
        return animation[frame];
    };
    AnimationManager.prototype.hasAnimation = function (name) {
        return !!this.animations[name];
    };
    AnimationManager.prototype.isAnimationEmpty = function (name) {
        return _.isEmpty(this.animations[name]);
    };
    Object.defineProperty(AnimationManager.prototype, "isPlaying", {
        get: function () {
            return !!this.currentFrame;
        },
        enumerable: true,
        configurable: true
    });
    AnimationManager.prototype.playAnimation = function (name, startFrame, force) {
        if (startFrame === void 0) { startFrame = 0; }
        if (force === void 0) { force = false; }
        if (!force && (this.forceRequired || this.getCurrentAnimationName() == name)) {
            return;
        }
        if (this.hasAnimation(name) && this.isAnimationEmpty(name)) {
            this.setCurrentFrame(null, true, force);
            return;
        }
        this.setCurrentFrame(name + "/" + startFrame, true, force);
    };
    AnimationManager.prototype.setCurrentFrame = function (frameRef, resetFrameTime, force) {
        if (resetFrameTime === void 0) { resetFrameTime = true; }
        if (force === void 0) { force = false; }
        if (this.forceRequired && !force) {
            return;
        }
        // Reset frame time.
        if (resetFrameTime) {
            this.currentFrameTime = 0;
        }
        if (!frameRef) {
            this.currentFrame = null;
            return;
        }
        var frame = this.getFrameByRef(frameRef);
        if (!frame)
            return;
        this.currentFrame = frame;
        // Set sprite properties from the frame.
        if (this.currentFrame.texture) {
            this.sprite.setTexture(this.currentFrame.texture);
        }
    };
    AnimationManager.prototype.stop = function () {
        this.setCurrentFrame(null, true, true);
    };
    return AnimationManager;
}());
var A;
(function (A) {
    function clone(array) {
        if (_.isEmpty(array))
            return [];
        return Array.from(array);
    }
    A.clone = clone;
    function clone2D(array) {
        if (_.isEmpty(array))
            return [];
        return array.map(function (line) { return clone(line); });
    }
    A.clone2D = clone2D;
    function filledArray(n, fillWith) {
        var result = [];
        for (var i = 0; i < n; i++) {
            result.push(fillWith);
        }
        return result;
    }
    A.filledArray = filledArray;
    function filledArray2D(n, m, fillWith) {
        var result = [];
        for (var i = 0; i < n; i++) {
            var line = [];
            for (var j = 0; j < m; j++) {
                line.push(fillWith);
            }
            result.push(line);
        }
        return result;
    }
    A.filledArray2D = filledArray2D;
    function get2DArrayDimensions(array) {
        if (_.isEmpty(array))
            return { width: 0, height: 0 };
        return { width: M.max(array, function (line) { return _.isEmpty(line) ? 0 : line.length; }), height: array.length };
    }
    A.get2DArrayDimensions = get2DArrayDimensions;
    function map2D(array, fn) {
        if (_.isEmpty(array))
            return [];
        return array.map(function (line) { return _.isEmpty(line) ? [] : line.map(fn); });
    }
    A.map2D = map2D;
    function mergeArray(array, into, key, combine) {
        if (combine === void 0) { combine = (function (e, into) { return e; }); }
        var e_1, _a;
        var result = A.clone(into);
        try {
            for (var array_1 = __values(array), array_1_1 = array_1.next(); !array_1_1.done; array_1_1 = array_1.next()) {
                var element = array_1_1.value;
                var resultContainedKey = false;
                for (var i = 0; i < result.length; i++) {
                    if (key(element) === key(result[i])) {
                        result[i] = combine(element, result[i]);
                        resultContainedKey = true;
                        break;
                    }
                }
                if (!resultContainedKey) {
                    result.push(element);
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (array_1_1 && !array_1_1.done && (_a = array_1.return)) _a.call(array_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return result;
    }
    A.mergeArray = mergeArray;
    function removeAll(array, obj, startingAt) {
        if (startingAt === void 0) { startingAt = 0; }
        if (!array)
            return 0;
        var count = 0;
        for (var i = array.length - 1; i >= startingAt; i--) {
            if (array[i] === obj) {
                array.splice(i, 1);
                count++;
            }
        }
        return count;
    }
    A.removeAll = removeAll;
    function removeDuplicates(array) {
        for (var i = 0; i < array.length - 1; i++) {
            removeAll(array, array[i], i + 1);
        }
        return array;
    }
    A.removeDuplicates = removeDuplicates;
    function repeat(array, count) {
        var result = [];
        for (var i = 0; i < count; i++) {
            result.push.apply(result, __spread(array));
        }
        return result;
    }
    A.repeat = repeat;
    function sort(array, reverse) {
        if (reverse === void 0) { reverse = false; }
        var r = reverse ? -1 : 1;
        return array.sort(function (a, b) { return r * (a - b); });
    }
    A.sort = sort;
    function sorted(array, reverse) {
        if (reverse === void 0) { reverse = false; }
        return A.sort(A.clone(array), reverse);
    }
    A.sorted = sorted;
    function sum(array) {
        if (_.isEmpty(array))
            return 0;
        var result = 0;
        for (var i = 0; i < array.length; i++) {
            result += array[i];
        }
        return result;
    }
    A.sum = sum;
})(A || (A = {}));
/// <reference path="./utils/a_array.ts" />
var Animations = /** @class */ (function () {
    function Animations() {
    }
    Animations.emptyList = function () {
        var names = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            names[_i] = arguments[_i];
        }
        if (_.isEmpty(names))
            return [];
        return names.map(function (name) { return { name: name, frames: [] }; });
    };
    Animations.fromTextureList = function (config) {
        _.defaults(config, {
            texturePrefix: "",
            count: 1,
        });
        if (config.count < 0) {
            config.nextFrameRef = config.name + "/0";
            config.count = 1;
        }
        var frameDuration = 1 / config.frameRate;
        var textures = A.repeat(config.textures, config.count);
        var result = {
            name: config.name,
            frames: [],
        };
        if (_.isEmpty(textures)) {
            return result;
        }
        for (var i = 0; i < textures.length; i++) {
            var animationFrame = {
                duration: frameDuration,
                texture: "" + config.texturePrefix + textures[i],
                nextFrameRef: config.name + "/" + (i + 1),
                forceRequired: config.forceRequired,
            };
            result.frames.push(animationFrame);
        }
        result.frames[result.frames.length - 1].nextFrameRef = config.nextFrameRef;
        return result;
    };
    return Animations;
}());
// Only meant to be populated by Preload
var AssetCache = /** @class */ (function () {
    function AssetCache() {
    }
    AssetCache.getPixiTexture = function (key) {
        if (!this.pixiTextures[key]) {
            debug("Texture '" + key + "' does not exist.");
        }
        return this.pixiTextures[key];
    };
    AssetCache.getTexture = function (key) {
        if (!this.textures[key]) {
            debug("Texture '" + key + "' does not exist.");
            return Texture.none();
        }
        return this.textures[key];
    };
    AssetCache.getTilemap = function (key) {
        if (!this.tilemaps[key]) {
            debug("Tilemap '" + key + "' does not exist.");
        }
        return this.tilemaps[key];
    };
    AssetCache.pixiTextures = {};
    AssetCache.textures = {};
    AssetCache.tilemaps = {};
    AssetCache.DEFAULT_ANCHOR = { x: 0, y: 0 };
    return AssetCache;
}());
var S;
(function (S) {
    // There is no async function. Use global.script.world.runScript(scriptFunction) instead.
    function call(func) {
        return function () {
            return __generator(this, function (_a) {
                func();
                return [2 /*return*/];
            });
        };
    }
    S.call = call;
    function chain() {
        var scriptFunctions = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            scriptFunctions[_i] = arguments[_i];
        }
        return function () {
            var e_2, _a, scriptFunctions_1, scriptFunctions_1_1, scriptFunction, e_2_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 5, 6, 7]);
                        scriptFunctions_1 = __values(scriptFunctions), scriptFunctions_1_1 = scriptFunctions_1.next();
                        _b.label = 1;
                    case 1:
                        if (!!scriptFunctions_1_1.done) return [3 /*break*/, 4];
                        scriptFunction = scriptFunctions_1_1.value;
                        return [5 /*yield**/, __values(scriptFunction())];
                    case 2:
                        _b.sent();
                        _b.label = 3;
                    case 3:
                        scriptFunctions_1_1 = scriptFunctions_1.next();
                        return [3 /*break*/, 1];
                    case 4: return [3 /*break*/, 7];
                    case 5:
                        e_2_1 = _b.sent();
                        e_2 = { error: e_2_1 };
                        return [3 /*break*/, 7];
                    case 6:
                        try {
                            if (scriptFunctions_1_1 && !scriptFunctions_1_1.done && (_a = scriptFunctions_1.return)) _a.call(scriptFunctions_1);
                        }
                        finally { if (e_2) throw e_2.error; }
                        return [7 /*endfinally*/];
                    case 7: return [2 /*return*/];
                }
            });
        };
    }
    S.chain = chain;
    function doOverTime(time, func) {
        return function () {
            var t;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        t = new Timer(time);
                        _a.label = 1;
                    case 1:
                        if (!!t.done) return [3 /*break*/, 3];
                        func(t.progress);
                        t.update(global.script.delta);
                        return [4 /*yield*/];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 1];
                    case 3:
                        func(1);
                        return [2 /*return*/];
                }
            });
        };
    }
    S.doOverTime = doOverTime;
    function loopFor(count, scriptFunction) {
        return function () {
            var i;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        i = 0;
                        _a.label = 1;
                    case 1:
                        if (!(i < count)) return [3 /*break*/, 4];
                        return [5 /*yield**/, __values(scriptFunction())];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/];
                }
            });
        };
    }
    S.loopFor = loopFor;
    function loopUntil(condition, scriptFunction) {
        return function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!!condition()) return [3 /*break*/, 2];
                        return [5 /*yield**/, __values(scriptFunction())];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 0];
                    case 2: return [2 /*return*/];
                }
            });
        };
    }
    S.loopUntil = loopUntil;
    function noop() {
        return function () { return __generator(this, function (_a) {
            return [2 /*return*/];
        }); };
    }
    S.noop = noop;
    function simul() {
        var scriptFunctions = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            scriptFunctions[_i] = arguments[_i];
        }
        return function () {
            var scripts;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        scripts = scriptFunctions.map(function (sfn) { return new Script(sfn); });
                        _a.label = 1;
                    case 1:
                        if (!!_.isEmpty(scripts)) return [3 /*break*/, 4];
                        scripts = scripts.filter(function (script) {
                            script.update(global.script.delta);
                            return !script.done;
                        });
                        if (!!_.isEmpty(scripts)) return [3 /*break*/, 3];
                        return [4 /*yield*/];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [3 /*break*/, 1];
                    case 4: return [2 /*return*/];
                }
            });
        };
    }
    S.simul = simul;
    function tween(obj, prop, start, end, duration, easingFunction) {
        if (easingFunction === void 0) { easingFunction = Tween.Easing.Linear; }
        return function () {
            var tween;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        tween = new Tween(start, end, duration, easingFunction);
                        _a.label = 1;
                    case 1:
                        if (!!tween.done) return [3 /*break*/, 3];
                        tween.update(global.script.delta);
                        obj[prop] = tween.value;
                        return [4 /*yield*/];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 1];
                    case 3:
                        obj[prop] = end;
                        return [2 /*return*/];
                }
            });
        };
    }
    S.tween = tween;
    function wait(time) {
        return doOverTime(time, function (t) { return null; });
    }
    S.wait = wait;
    function waitUntil(condition) {
        return function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!!condition()) return [3 /*break*/, 2];
                        return [4 /*yield*/];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 0];
                    case 2: return [2 /*return*/];
                }
            });
        };
    }
    S.waitUntil = waitUntil;
    function yield() {
        return function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        };
    }
    S.yield = yield;
})(S || (S = {}));
var O;
(function (O) {
    function deepClone(obj) {
        return deepCloneInternal(obj);
    }
    O.deepClone = deepClone;
    function deepCloneInternal(obj) {
        var e_3, _a;
        if (_.isArray(obj)) {
            if (_.isEmpty(obj))
                return [];
            var result = [];
            try {
                for (var obj_1 = __values(obj), obj_1_1 = obj_1.next(); !obj_1_1.done; obj_1_1 = obj_1.next()) {
                    var el = obj_1_1.value;
                    result.push(deepCloneInternal(el));
                }
            }
            catch (e_3_1) { e_3 = { error: e_3_1 }; }
            finally {
                try {
                    if (obj_1_1 && !obj_1_1.done && (_a = obj_1.return)) _a.call(obj_1);
                }
                finally { if (e_3) throw e_3.error; }
            }
            return result;
        }
        if (_.isFunction(obj))
            return obj;
        if (_.isObject(obj)) {
            if (_.isEmpty(obj))
                return {};
            var result = {};
            for (var key in obj) {
                result[key] = deepCloneInternal(obj[key]);
            }
            return result;
        }
        return obj;
    }
    function deepOverride(obj, overrides) {
        for (var key in overrides) {
            if (obj[key] && _.isArray(overrides[key])) {
                obj[key] = overrides[key];
            }
            else if (obj[key] && _.isObject(obj[key]) && _.isObject(overrides[key])) {
                deepOverride(obj[key], overrides[key]);
            }
            else {
                obj[key] = overrides[key];
            }
        }
    }
    O.deepOverride = deepOverride;
    function getOrDefault(obj, def) {
        return obj === undefined ? def : obj;
    }
    O.getOrDefault = getOrDefault;
    function mergeObject(obj, into, combine) {
        if (combine === void 0) { combine = (function (e, into) { return e; }); }
        var result = _.clone(into);
        for (var key in obj) {
            if (result[key]) {
                result[key] = combine(obj[key], result[key]);
            }
            else {
                result[key] = obj[key];
            }
        }
        return result;
    }
    O.mergeObject = mergeObject;
    function withDefaults(obj, defaults) {
        var result = _.clone(obj);
        _.defaults(result, defaults);
        return result;
    }
    O.withDefaults = withDefaults;
    function withOverrides(obj, overrides) {
        var result = _.clone(obj);
        _.extend(result, overrides);
        return result;
    }
    O.withOverrides = withOverrides;
})(O || (O = {}));
/// <reference path="./utils/o_object.ts"/>
var Camera = /** @class */ (function () {
    function Camera(config) {
        _.defaults(config, {
            width: global.gameWidth,
            height: global.gameHeight,
            bounds: { x: -Infinity, y: -Infinity, width: Infinity, height: Infinity },
            mode: { type: 'focus', point: { x: config.width / 2, y: config.height / 2 } },
            movement: { type: 'snap' },
        });
        this.x = config.width / 2;
        this.y = config.height / 2;
        this.width = config.width;
        this.height = config.height;
        this.bounds = O.withDefaults(config.bounds, {
            top: -Infinity,
            bottom: Infinity,
            left: -Infinity,
            right: Infinity,
        });
        this.mode = _.clone(config.mode);
        this.movement = _.clone(config.movement);
        this.shakeIntensity = 0;
        this._shakeX = 0;
        this._shakeY = 0;
    }
    Object.defineProperty(Camera.prototype, "worldOffsetX", {
        get: function () { return this.x + this._shakeX - this.width / 2; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Camera.prototype, "worldOffsetY", {
        get: function () { return this.y + this._shakeY - this.height / 2; },
        enumerable: true,
        configurable: true
    });
    Camera.prototype.update = function (world, delta) {
        if (this.mode.type === 'follow') {
            var target = this.mode.target;
            if (_.isString(target)) {
                target = world.getWorldObjectByName(target);
            }
            this.moveTowardsPoint(target.x + this.mode.offset.x, target.y + this.mode.offset.y, delta);
        }
        else if (this.mode.type === 'focus') {
            this.moveTowardsPoint(this.mode.point.x, this.mode.point.y, delta);
        }
        if (this.shakeIntensity > 0) {
            var pt = Random.inCircle(this.shakeIntensity);
            this._shakeX = pt.x;
            this._shakeY = pt.y;
        }
        else {
            this._shakeX = 0;
            this._shakeY = 0;
        }
        this.clampToBounds();
    };
    Camera.prototype.clampToBounds = function () {
        if (this.bounds.left > -Infinity && this.x - this.width / 2 < this.bounds.left) {
            this.x = this.bounds.left + this.width / 2;
        }
        if (this.bounds.right < Infinity && this.x + this.width / 2 > this.bounds.right) {
            this.x = this.bounds.right - this.width / 2;
        }
        if (this.bounds.top > -Infinity && this.y - this.height / 2 < this.bounds.top) {
            this.y = this.bounds.top + this.height / 2;
        }
        if (this.bounds.bottom < Infinity && this.y + this.height / 2 > this.bounds.bottom) {
            this.y = this.bounds.bottom - this.height / 2;
        }
    };
    Camera.prototype.moveTowardsPoint = function (x, y, delta) {
        if (this.movement.type === 'snap') {
            this.x = x;
            this.y = y;
        }
        else if (this.movement.type === 'smooth') {
            // TODO: implement smooth movement
            this.x = M.lerp(this.x, x, 0.25);
            this.y = M.lerp(this.y, y, 0.25);
        }
    };
    Camera.prototype.setMode = function (mode) {
        this.mode = mode;
    };
    Camera.prototype.setModeFollow = function (target, offsetX, offsetY) {
        this.setMode({
            type: 'follow',
            target: target,
            offset: { x: offsetX || 0, y: offsetY || 0 },
        });
    };
    Camera.prototype.setModeFocus = function (x, y) {
        this.setMode({
            type: 'focus',
            point: { x: x, y: y },
        });
    };
    Camera.prototype.setMovement = function (movement) {
        this.movement = movement;
    };
    Camera.prototype.setMovementSnap = function () {
        this.setMovement({
            type: 'snap',
        });
    };
    Camera.prototype.setMovementSmooth = function (speed, deadZoneWidth, deadZoneHeight) {
        this.setMovement({
            type: 'smooth',
            speed: speed,
            deadZoneWidth: deadZoneWidth,
            deadZoneHeight: deadZoneHeight,
        });
    };
    return Camera;
}());
(function (Camera) {
    var Mode;
    (function (Mode) {
        function FOLLOW(target, offsetX, offsetY) {
            return { type: 'follow', target: target, offset: { x: O.getOrDefault(offsetX, 0), y: O.getOrDefault(offsetY, 0) } };
        }
        Mode.FOLLOW = FOLLOW;
        function FOCUS(x, y) {
            return { type: 'focus', point: { x: x, y: y } };
        }
        Mode.FOCUS = FOCUS;
    })(Mode = Camera.Mode || (Camera.Mode = {}));
})(Camera || (Camera = {}));
var CutsceneManager = /** @class */ (function () {
    function CutsceneManager(theater, storyboard) {
        this.theater = theater;
        this.storyboard = storyboard;
        this.current = null;
        this.playedCutscenes = new Set();
    }
    Object.defineProperty(CutsceneManager.prototype, "isCutscenePlaying", {
        get: function () { return !!this.current; },
        enumerable: true,
        configurable: true
    });
    CutsceneManager.prototype.toScript = function (generator) {
        var cm = this;
        return function () {
            var iterator, result, script;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        iterator = generator();
                        _a.label = 1;
                    case 1:
                        if (!true) return [3 /*break*/, 8];
                        result = iterator.next();
                        if (!result.value) return [3 /*break*/, 5];
                        if (_.isArray(result.value)) {
                            result.value = S.simul.apply(S, __spread(result.value.map(function (scr) { return cm.toScript(scr); })));
                        }
                        script = new Script(result.value);
                        _a.label = 2;
                    case 2:
                        if (!!script.done) return [3 /*break*/, 4];
                        script.update(global.script.delta);
                        if (script.done)
                            return [3 /*break*/, 4];
                        return [4 /*yield*/];
                    case 3:
                        _a.sent();
                        return [3 /*break*/, 2];
                    case 4: return [3 /*break*/, 7];
                    case 5:
                        if (!!result.done) return [3 /*break*/, 7];
                        return [4 /*yield*/];
                    case 6:
                        _a.sent();
                        _a.label = 7;
                    case 7:
                        if (result.done)
                            return [3 /*break*/, 8];
                        return [3 /*break*/, 1];
                    case 8: return [2 /*return*/];
                }
            });
        };
    };
    CutsceneManager.prototype.update = function (delta) {
        if (this.current) {
            this.current.script.update(delta);
            if (this.current.script.done) {
                this.finishCurrentCutscene();
            }
        }
    };
    CutsceneManager.prototype.canPlayCutscene = function (name) {
        var cutscene = this.getCutsceneByName(name);
        if (!cutscene)
            return false;
        if (cutscene.type !== 'cutscene')
            return false;
        if (cutscene.playOnlyOnce && this.playedCutscenes.has(name))
            return false;
        return true;
    };
    CutsceneManager.prototype.fastForwardCutscene = function (name) {
        this.playCutscene(name);
        this.finishCurrentCutscene();
    };
    CutsceneManager.prototype.finishCurrentCutscene = function () {
        if (!this.current)
            return;
        var completed = this.current;
        this.current = null;
        this.playedCutscenes.add(completed.name);
    };
    CutsceneManager.prototype.onStageLoad = function () {
        this.finishCurrentCutscene();
    };
    CutsceneManager.prototype.playCutscene = function (name) {
        var cutscene = this.getCutsceneByName(name);
        if (!cutscene)
            return;
        if (this.current) {
            debug("Cannot play cutscene " + name + " because a cutscene is already playing:", this.current);
            return;
        }
        this.current = {
            name: name,
            script: new Script(this.toScript(cutscene.script))
        };
    };
    CutsceneManager.prototype.reset = function () {
        if (this.current) {
            this.current.script.done = true;
        }
        this.current = null;
    };
    CutsceneManager.prototype.getCutsceneByName = function (name) {
        var node = this.storyboard[name];
        if (!node) {
            debug("Cannot get cutscene " + name + " because it does not exist on storyboard:", this.storyboard);
            return undefined;
        }
        if (node.type !== 'cutscene') {
            debug("Tried to play node " + name + " as a cutscene when it is not one", node);
            return undefined;
        }
        return node;
    };
    return CutsceneManager;
}());
var S;
(function (S) {
    function dialog(p1, p2) {
        return function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (p2) {
                            global.theater.dialogBox.showPortrait(p1);
                            global.theater.dialogBox.showDialog(p2);
                        }
                        else {
                            global.theater.dialogBox.showDialog(p1);
                        }
                        _a.label = 1;
                    case 1:
                        if (!!global.theater.dialogBox.done) return [3 /*break*/, 3];
                        return [4 /*yield*/];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 1];
                    case 3: return [2 /*return*/];
                }
            });
        };
    }
    S.dialog = dialog;
    function fadeSlides(duration) {
        return function () {
            var slideAlphas, timer, i;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (_.isEmpty(global.theater.slides))
                            return [2 /*return*/];
                        slideAlphas = global.theater.slides.map(function (slide) { return slide.alpha; });
                        timer = new Timer(duration);
                        _a.label = 1;
                    case 1:
                        if (!!timer.done) return [3 /*break*/, 3];
                        for (i = 0; i < global.theater.slides.length; i++) {
                            global.theater.slides[i].alpha = slideAlphas[i] * (1 - timer.progress);
                        }
                        timer.update(global.script.delta);
                        return [4 /*yield*/];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 1];
                    case 3:
                        global.theater.clearSlides();
                        return [2 /*return*/];
                }
            });
        };
    }
    S.fadeSlides = fadeSlides;
    function fadeOut(duration, tint) {
        if (tint === void 0) { tint = 0x000000; }
        return showSlide({
            x: 0, y: 0,
            texture: Texture.filledRect(global.gameWidth, global.gameHeight, tint),
            timeToLoad: duration,
            fadeIn: true
        });
    }
    S.fadeOut = fadeOut;
    function jump(sprite, peakDelta, time, landOnGround) {
        if (landOnGround === void 0) { landOnGround = false; }
        return runInCurrentWorld(function () {
            var start, groundDelta, timer;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        start = sprite.offset.y;
                        groundDelta = landOnGround ? -start : 0;
                        timer = new Timer(time);
                        _a.label = 1;
                    case 1:
                        if (!!timer.done) return [3 /*break*/, 3];
                        sprite.offset.y = M.jumpParabola(start, -peakDelta, groundDelta, timer.progress);
                        timer.update(global.script.delta);
                        return [4 /*yield*/];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 1];
                    case 3:
                        sprite.offset.y = start + groundDelta;
                        return [2 /*return*/];
                }
            });
        });
    }
    S.jump = jump;
    function moveTo(worldObject, x, y, maxTime) {
        if (maxTime === void 0) { maxTime = 10; }
        return S.simul(moveToX(worldObject, x, maxTime), moveToY(worldObject, y, maxTime));
    }
    S.moveTo = moveTo;
    function moveToX(worldObject, x, maxTime) {
        if (maxTime === void 0) { maxTime = 10; }
        return runInCurrentWorld(function () {
            var dx, timer;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        dx = x - worldObject.x;
                        if (dx === 0)
                            return [2 /*return*/];
                        timer = new Timer(maxTime);
                        if (!(dx > 0)) return [3 /*break*/, 4];
                        _a.label = 1;
                    case 1:
                        if (!(worldObject.x < x && !timer.done)) return [3 /*break*/, 3];
                        worldObject.controller.right = true;
                        timer.update(global.script.delta);
                        return [4 /*yield*/];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 1];
                    case 3: return [3 /*break*/, 6];
                    case 4:
                        if (!(worldObject.x > x && !timer.done)) return [3 /*break*/, 6];
                        worldObject.controller.left = true;
                        timer.update(global.script.delta);
                        return [4 /*yield*/];
                    case 5:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 6:
                        worldObject.x = x;
                        return [2 /*return*/];
                }
            });
        });
    }
    S.moveToX = moveToX;
    function moveToY(worldObject, y, maxTime) {
        if (maxTime === void 0) { maxTime = 10; }
        return runInCurrentWorld(function () {
            var dy, timer;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        dy = y - worldObject.y;
                        if (dy === 0)
                            return [2 /*return*/];
                        timer = new Timer(maxTime);
                        if (!(dy > 0)) return [3 /*break*/, 4];
                        _a.label = 1;
                    case 1:
                        if (!(worldObject.y < y && !timer.done)) return [3 /*break*/, 3];
                        worldObject.controller.down = true;
                        timer.update(global.script.delta);
                        return [4 /*yield*/];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 1];
                    case 3: return [3 /*break*/, 6];
                    case 4:
                        if (!(worldObject.y > y && !timer.done)) return [3 /*break*/, 6];
                        worldObject.controller.up = true;
                        timer.update(global.script.delta);
                        return [4 /*yield*/];
                    case 5:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 6:
                        worldObject.y = y;
                        return [2 /*return*/];
                }
            });
        });
    }
    S.moveToY = moveToY;
    function playAnimation(sprite, animationName, startFrame, force, waitForCompletion) {
        if (startFrame === void 0) { startFrame = 0; }
        if (force === void 0) { force = true; }
        if (waitForCompletion === void 0) { waitForCompletion = true; }
        return runInCurrentWorld(function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        sprite.playAnimation(animationName, startFrame, force);
                        if (!waitForCompletion) return [3 /*break*/, 3];
                        _a.label = 1;
                    case 1:
                        if (!(sprite.getCurrentAnimationName() === animationName)) return [3 /*break*/, 3];
                        return [4 /*yield*/];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 1];
                    case 3: return [2 /*return*/];
                }
            });
        });
    }
    S.playAnimation = playAnimation;
    function runInCurrentWorld(script) {
        return function () {
            var scr;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        scr = global.theater.currentWorld.runScript(script);
                        _a.label = 1;
                    case 1:
                        if (!!scr.done) return [3 /*break*/, 3];
                        return [4 /*yield*/];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 1];
                    case 3: return [2 /*return*/];
                }
            });
        };
    }
    S.runInCurrentWorld = runInCurrentWorld;
    function shake(intensity, time) {
        return runInCurrentWorld(function () {
            var timer;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        global.world.camera.shakeIntensity += intensity;
                        timer = new Timer(time);
                        _a.label = 1;
                    case 1:
                        if (!!timer.done) return [3 /*break*/, 3];
                        timer.update(global.script.delta);
                        return [4 /*yield*/];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 1];
                    case 3:
                        global.world.camera.shakeIntensity -= intensity;
                        return [2 /*return*/];
                }
            });
        });
    }
    S.shake = shake;
    function showSlide(config, waitForCompletion) {
        if (waitForCompletion === void 0) { waitForCompletion = true; }
        var slide;
        return function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        slide = global.theater.addSlideByConfig(config);
                        if (!waitForCompletion) return [3 /*break*/, 3];
                        _a.label = 1;
                    case 1:
                        if (!!slide.fullyLoaded) return [3 /*break*/, 3];
                        return [4 /*yield*/];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 1];
                    case 3: return [2 /*return*/];
                }
            });
        };
    }
    S.showSlide = showSlide;
})(S || (S = {}));
var DebugValues = /** @class */ (function () {
    function DebugValues() {
    }
    DebugValues.prototype.init = function (config) {
        Debug.DEBUG = true;
        Debug.ALL_PHYSICS_BOUNDS = false;
        Debug.MOVE_CAMERA_WITH_ARROWS = true;
        Debug.SHOW_MOUSE_POSITION = true;
        Debug.MOUSE_POSITION_FONT = config.mousePositionFont;
        Debug.SKIP_RATE = 1;
        Debug.PROGRAMMATIC_INPUT = false;
        Debug.AUTOPLAY = true;
        Debug.SKIP_MAIN_MENU = true;
    };
    Object.defineProperty(DebugValues.prototype, "DEBUG", {
        get: function () { return this._DEBUG; },
        set: function (value) { this._DEBUG = value; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DebugValues.prototype, "ALL_PHYSICS_BOUNDS", {
        get: function () { return this.DEBUG && this._ALL_PHYSICS_BOUNDS; },
        set: function (value) { this._ALL_PHYSICS_BOUNDS = value; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DebugValues.prototype, "MOVE_CAMERA_WITH_ARROWS", {
        get: function () { return this.DEBUG && this._MOVE_CAMERA_WITH_ARROWS; },
        set: function (value) { this._MOVE_CAMERA_WITH_ARROWS = value; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DebugValues.prototype, "SHOW_MOUSE_POSITION", {
        get: function () { return this.DEBUG && this._SHOW_MOUSE_POSITION; },
        set: function (value) { this._SHOW_MOUSE_POSITION = value; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DebugValues.prototype, "SKIP_RATE", {
        get: function () { return this.DEBUG ? this._SKIP_RATE : 1; },
        set: function (value) { this._SKIP_RATE = value; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DebugValues.prototype, "PROGRAMMATIC_INPUT", {
        get: function () { return this.DEBUG && this._PROGRAMMATIC_INPUT; },
        set: function (value) { this._PROGRAMMATIC_INPUT = value; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DebugValues.prototype, "AUTOPLAY", {
        get: function () { return this.DEBUG && this._AUTOPLAY; },
        set: function (value) { this._AUTOPLAY = value; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DebugValues.prototype, "SKIP_MAIN_MENU", {
        get: function () { return this.DEBUG && this._SKIP_MAIN_MENU; },
        set: function (value) { this._SKIP_MAIN_MENU = value; },
        enumerable: true,
        configurable: true
    });
    return DebugValues;
}());
var Debug = new DebugValues();
var debug = console.info;
// function debug(message?: any, ...optionalParams: any[]) {
//     if (DEBUG) {
//         console.log(message, ...optionalParams);
//     }
// }
function get(name) {
    var worldObject = global.game.theater.currentWorld.getWorldObjectByName(name);
    if (worldObject)
        return worldObject;
    return undefined;
}
var WorldObject = /** @class */ (function () {
    function WorldObject(config, defaults) {
        var _this = this;
        config = WorldObject.resolveConfig(config, defaults);
        this.localx = O.getOrDefault(config.x, 0);
        this.localy = O.getOrDefault(config.y, 0);
        this.visible = O.getOrDefault(config.visible, true);
        this.active = O.getOrDefault(config.active, true);
        this.life = new Timer(O.getOrDefault(config.life, Infinity), function () { return _this.kill(); });
        this.ignoreCamera = O.getOrDefault(config.ignoreCamera, false);
        this.data = _.clone(O.getOrDefault(config.data, {}));
        this.alive = true;
        this.lastx = this.x;
        this.lasty = this.y;
        this.controllable = O.getOrDefault(config.controllable, false);
        this.controller = {};
        this.controllerSchema = {};
        this.preRenderStoredX = this.x;
        this.preRenderStoredY = this.y;
        this._world = null;
        this.internalSetNameWorldObject(config.name);
        this.internalSetLayerWorldObject(config.layer);
        this.internalSetPhysicsGroupWorldObject(config.physicsGroup);
        this._children = [];
        this._parent = null;
        this.addChildren(config.children);
        this.scriptManager = new ScriptManager();
        this.stateMachine = new StateMachine();
        this.updateCallback = config.updateCallback;
    }
    Object.defineProperty(WorldObject.prototype, "x", {
        get: function () { return this.localx + (this.parent ? this.parent.x : 0); },
        set: function (value) { this.localx = value - (this.parent ? this.parent.x : 0); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WorldObject.prototype, "y", {
        get: function () { return this.localy + (this.parent ? this.parent.y : 0); },
        set: function (value) { this.localy = value - (this.parent ? this.parent.y : 0); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WorldObject.prototype, "world", {
        get: function () { return this._world; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WorldObject.prototype, "name", {
        get: function () { return this._name; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WorldObject.prototype, "layer", {
        get: function () { return this._layer; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WorldObject.prototype, "physicsGroup", {
        get: function () { return this._physicsGroup; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WorldObject.prototype, "children", {
        get: function () { return this._children; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WorldObject.prototype, "parent", {
        get: function () { return this._parent; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WorldObject.prototype, "isControlled", {
        get: function () { return this.controllable && !global.theater.isCutscenePlaying; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WorldObject.prototype, "state", {
        get: function () { return this.stateMachine.getCurrentStateName(); },
        enumerable: true,
        configurable: true
    });
    WorldObject.prototype.onAdd = function () { };
    WorldObject.prototype.onRemove = function () { };
    WorldObject.prototype.preUpdate = function () {
        this.lastx = this.x;
        this.lasty = this.y;
        if (this.isControlled) {
            this.updateControllerFromSchema();
        }
    };
    WorldObject.prototype.update = function (delta) {
        this.updateScriptManager(delta);
        this.updateStateMachine(delta);
        if (this.updateCallback)
            this.updateCallback(this, delta);
        this.life.update(delta);
    };
    WorldObject.prototype.updateScriptManager = function (delta) {
        this.scriptManager.update(delta);
    };
    WorldObject.prototype.updateStateMachine = function (delta) {
        this.stateMachine.update(delta);
    };
    WorldObject.prototype.postUpdate = function () {
        this.resetController();
    };
    WorldObject.prototype.fullUpdate = function (delta) {
        this.preUpdate();
        this.update(delta);
        this.postUpdate();
    };
    WorldObject.prototype.preRender = function () {
        this.preRenderStoredX = this.x;
        this.preRenderStoredY = this.y;
        if (!this.ignoreCamera) {
            this.x -= this.world.camera.worldOffsetX;
            this.y -= this.world.camera.worldOffsetY;
        }
        this.x = Math.round(this.x);
        this.y = Math.round(this.y);
    };
    WorldObject.prototype.render = function (screen) {
    };
    WorldObject.prototype.postRender = function () {
        this.x = this.preRenderStoredX;
        this.y = this.preRenderStoredY;
    };
    WorldObject.prototype.fullRender = function (screen) {
        this.preRender();
        this.render(screen);
        this.postRender();
    };
    WorldObject.prototype.addChild = function (child) {
        var worldObject = child instanceof WorldObject ? child : WorldObject.fromConfig(child);
        return World.Actions.addChildToParent(worldObject, this);
    };
    WorldObject.prototype.addChildren = function (children) {
        var worldObjects = _.isEmpty(children) ? [] : children.map(function (child) { return child instanceof WorldObject ? child : WorldObject.fromConfig(child); });
        return World.Actions.addChildrenToParent(worldObjects, this);
    };
    WorldObject.prototype.getChildByName = function (name) {
        var e_4, _a;
        try {
            for (var _b = __values(this.children), _c = _b.next(); !_c.done; _c = _b.next()) {
                var child = _c.value;
                if (child.name === name)
                    return child;
            }
        }
        catch (e_4_1) { e_4 = { error: e_4_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_4) throw e_4.error; }
        }
        debug("Cannot find child named " + name + " on parent:", this);
        return undefined;
    };
    WorldObject.prototype.kill = function () {
        this.alive = false;
    };
    WorldObject.prototype.removeAllChildren = function () {
        return this.removeChildren(this.children);
    };
    WorldObject.prototype.removeChild = function (child) {
        if (!child)
            return undefined;
        if (_.isString(child)) {
            child = this.getChildByName(child);
            if (!child)
                return;
        }
        if (child.parent !== this) {
            debug("Cannot remove child " + child.name + " from parent " + this.name + ", but no such relationship exists");
            return undefined;
        }
        return World.Actions.removeChildFromParent(child);
    };
    WorldObject.prototype.removeChildren = function (children) {
        var _this = this;
        if (_.isEmpty(children))
            return [];
        return children.map(function (child) { return _this.removeChild(child); }).filter(function (child) { return child; });
    };
    WorldObject.prototype.removeFromWorld = function () {
        if (!this.world)
            return this;
        return World.Actions.removeWorldObjectFromWorld(this);
    };
    WorldObject.prototype.resetController = function () {
        for (var key in this.controller) {
            this.controller[key] = false;
        }
    };
    WorldObject.prototype.runScript = function (script) {
        return this.scriptManager.runScript(script);
    };
    WorldObject.prototype.setState = function (state) {
        this.stateMachine.setState(state);
    };
    WorldObject.prototype.updateControllerFromSchema = function () {
        for (var key in this.controllerSchema) {
            this.controller[key] = this.controllerSchema[key]();
        }
    };
    // For use with World.Actions.addWorldObjectToWorld
    WorldObject.prototype.internalAddWorldObjectToWorldWorldObject = function (world) {
        this._world = world;
        if (!this._layer)
            this._layer = World.DEFAULT_LAYER;
    };
    // For use with World.Actions.removeWorldObjectFromWorld
    WorldObject.prototype.internalRemoveWorldObjectFromWorldWorldObject = function (world) {
        this._world = null;
    };
    // For use with World.Actions.setName
    WorldObject.prototype.internalSetNameWorldObject = function (name) {
        this._name = name;
    };
    // For use with World.Actions.setLayer
    WorldObject.prototype.internalSetLayerWorldObject = function (layer) {
        this._layer = layer;
    };
    // For use with World.Actions.setPhysicsGroup
    WorldObject.prototype.internalSetPhysicsGroupWorldObject = function (physicsGroup) {
        this._physicsGroup = physicsGroup;
    };
    // For use with World.Actions.addChildToParent
    WorldObject.prototype.internalAddChildToParentWorldObjectChild = function (parent) {
        this._parent = parent;
    };
    // For use with World.Actions.addChildToParent
    WorldObject.prototype.internalAddChildToParentWorldObjectParent = function (child) {
        this._children.push(child);
    };
    // For use with World.Actions.removeChildFromParent
    WorldObject.prototype.internalRemoveChildFromParentWorldObjectChild = function () {
        this._parent = null;
    };
    // For use with World.Actions.removeChildFromParent
    WorldObject.prototype.internalRemoveChildFromParentWorldObjectParent = function (child) {
        A.removeAll(this._children, child);
    };
    return WorldObject;
}());
(function (WorldObject) {
    function fromConfig(config) {
        config = WorldObject.resolveConfig(config);
        var result = new config.constructor(config);
        if (result === config)
            result = new WorldObject(config); // Default constructor to WorldObject
        return result;
    }
    WorldObject.fromConfig = fromConfig;
    function resolveConfig(config) {
        var parents = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            parents[_i - 1] = arguments[_i];
        }
        var e_5, _a;
        var result = resolveConfigParent(config);
        if (_.isEmpty(parents))
            return result;
        try {
            for (var parents_1 = __values(parents), parents_1_1 = parents_1.next(); !parents_1_1.done; parents_1_1 = parents_1.next()) {
                var parent_1 = parents_1_1.value;
                result.parent = parent_1;
                result = resolveConfig(result);
            }
        }
        catch (e_5_1) { e_5 = { error: e_5_1 }; }
        finally {
            try {
                if (parents_1_1 && !parents_1_1.done && (_a = parents_1.return)) _a.call(parents_1);
            }
            finally { if (e_5) throw e_5.error; }
        }
        return result;
    }
    WorldObject.resolveConfig = resolveConfig;
    function resolveConfigParent(config) {
        if (!config.parent)
            return _.clone(config);
        var result = resolveConfig(config.parent);
        for (var key in config) {
            if (key === 'parent')
                continue;
            if (!result[key]) {
                result[key] = config[key];
            }
            else if (key === 'animations') {
                result[key] = A.mergeArray(config[key], result[key], function (e) { return e.name; });
            }
            else if (key === 'states') {
                result[key] = O.mergeObject(config[key], result[key]);
            }
            else if (key === 'data') {
                result[key] = O.withOverrides(result[key], config[key]);
            }
            else {
                result[key] = config[key];
            }
        }
        return result;
    }
})(WorldObject || (WorldObject = {}));
/// <reference path="./worldObject.ts" />
var PhysicsWorldObject = /** @class */ (function (_super) {
    __extends(PhysicsWorldObject, _super);
    function PhysicsWorldObject(config, defaults) {
        var _this = this;
        config = WorldObject.resolveConfig(config, defaults);
        _this = _super.call(this, config) || this;
        _this.vx = O.getOrDefault(config.vx, 0);
        _this.vy = O.getOrDefault(config.vy, 0);
        _this.mass = O.getOrDefault(config.mass, 1);
        _this.gravity = config.gravity || { x: 0, y: 0 };
        _this.bounce = O.getOrDefault(config.bounce, 0);
        _this.bounds = config.bounds || { x: 0, y: 0, width: 0, height: 0 };
        _this.immovable = O.getOrDefault(config.immovable, false);
        _this.colliding = O.getOrDefault(config.colliding, true);
        _this.debugBounds = O.getOrDefault(config.debugBounds, false);
        _this.simulating = O.getOrDefault(config.startSimulating, true);
        _this.preMovementX = _this.x;
        _this.preMovementY = _this.y;
        return _this;
    }
    PhysicsWorldObject.prototype.update = function (delta) {
        _super.prototype.update.call(this, delta);
        if (this.simulating) {
            this.simulate(delta);
        }
    };
    PhysicsWorldObject.prototype.render = function (screen) {
        if (Debug.ALL_PHYSICS_BOUNDS || this.debugBounds) {
            var worldBounds = this.getWorldBounds();
            Draw.brush.color = 0x00FF00;
            Draw.brush.alpha = 1;
            Draw.rectangleOutline(screen, worldBounds.x, worldBounds.y, worldBounds.width, worldBounds.height);
        }
        _super.prototype.render.call(this, screen);
    };
    PhysicsWorldObject.prototype.onCollide = function (other) {
    };
    PhysicsWorldObject.prototype.applyGravity = function (delta) {
        this.vx += this.gravity.x * delta;
        this.vy += this.gravity.y * delta;
    };
    PhysicsWorldObject.prototype.isOverlapping = function (other) {
        this.bounds.x += this.x;
        this.bounds.y += this.y;
        other.bounds.x += other.x;
        other.bounds.y += other.y;
        var result = G.overlapRectangles(this.bounds, other.bounds);
        this.bounds.x -= this.x;
        this.bounds.y -= this.y;
        other.bounds.x -= other.x;
        other.bounds.y -= other.y;
        return result;
    };
    PhysicsWorldObject.prototype.isOverlappingRect = function (rect) {
        this.bounds.x += this.x;
        this.bounds.y += this.y;
        var result = G.overlapRectangles(this.bounds, rect);
        this.bounds.x -= this.x;
        this.bounds.y -= this.y;
        return result;
    };
    PhysicsWorldObject.prototype.getWorldBounds = function (newX, newY) {
        if (newX === void 0) { newX = this.x; }
        if (newY === void 0) { newY = this.y; }
        return new Rectangle(newX + this.bounds.x, newY + this.bounds.y, this.bounds.width, this.bounds.height);
    };
    PhysicsWorldObject.prototype.move = function (delta) {
        this.preMovementX = this.x;
        this.preMovementY = this.y;
        this.x += this.vx * delta;
        this.y += this.vy * delta;
    };
    PhysicsWorldObject.prototype.simulate = function (delta) {
        this.applyGravity(delta);
        this.move(delta);
    };
    return PhysicsWorldObject;
}(WorldObject));
/// <reference path="./physicsWorldObject.ts" />
var Sprite = /** @class */ (function (_super) {
    __extends(Sprite, _super);
    function Sprite(config, defaults) {
        var e_6, _a;
        var _this = this;
        config = WorldObject.resolveConfig(config, defaults);
        _this = _super.call(this, config) || this;
        _this.setTexture(config.texture);
        if (config.bounds === undefined) {
            // TODO: set this to texture's bounds (local)
            _this.bounds = { x: 0, y: 0, width: 0, height: 0 };
        }
        _this.animationManager = new AnimationManager(_this);
        if (config.animations) {
            try {
                for (var _b = __values(config.animations), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var animation = _c.value;
                    _.defaults(animation, {
                        frames: [],
                    });
                    _this.animationManager.addAnimation(animation.name, animation.frames);
                }
            }
            catch (e_6_1) { e_6 = { error: e_6_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_6) throw e_6.error; }
            }
        }
        if (config.defaultAnimation) {
            _this.playAnimation(config.defaultAnimation, 0, true);
        }
        _this.flipX = O.getOrDefault(config.flipX, false);
        _this.flipY = O.getOrDefault(config.flipY, false);
        _this.offset = config.offset || { x: 0, y: 0 };
        _this.angle = O.getOrDefault(config.angle, 0);
        _this.scaleX = O.getOrDefault(config.scaleX, 1);
        _this.scaleY = O.getOrDefault(config.scaleY, 1);
        _this.tint = O.getOrDefault(config.tint, 0xFFFFFF);
        _this.alpha = O.getOrDefault(config.alpha, 1);
        _this.effects = new Effects();
        _this.effects.updateFromConfig(config.effects);
        return _this;
    }
    Sprite.prototype.update = function (delta) {
        _super.prototype.update.call(this, delta);
        this.animationManager.update(delta);
    };
    Sprite.prototype.render = function (screen) {
        screen.render(this.texture, {
            x: this.x + this.offset.x,
            y: this.y + this.offset.y,
            scaleX: (this.flipX ? -1 : 1) * this.scaleX,
            scaleY: (this.flipY ? -1 : 1) * this.scaleY,
            angle: this.angle,
            tint: this.tint,
            alpha: this.alpha,
            filters: this.effects.getFilterList(),
        });
        _super.prototype.render.call(this, screen);
    };
    Sprite.prototype.getCurrentAnimationName = function () {
        return this.animationManager.getCurrentAnimationName();
    };
    Sprite.prototype.playAnimation = function (name, startFrame, force) {
        if (startFrame === void 0) { startFrame = 0; }
        if (force === void 0) { force = false; }
        this.animationManager.playAnimation(name, startFrame, force);
    };
    Sprite.prototype.setTexture = function (key) {
        if (!key) {
            this.texture = Texture.none();
            return;
        }
        if (_.isString(key))
            key = AssetCache.getTexture(key);
        this.texture = key;
    };
    return Sprite;
}(PhysicsWorldObject));
/// <reference path="./sprite.ts" />
var DialogBox = /** @class */ (function (_super) {
    __extends(DialogBox, _super);
    function DialogBox(config) {
        var _this = _super.call(this, config) || this;
        _this.charQueue = [];
        _this.textAreaFull = config.textAreaFull;
        _this.portraitPosition = config.portraitPosition;
        _this.textAreaPortrait = config.textAreaPortrait;
        _this.advanceKey = config.advanceKey;
        _this.textArea = _this.textAreaFull;
        _this.done = true;
        _this.spriteText = new SpriteText({
            font: config.spriteTextFont,
        });
        var textAreaWorldRect = _this.getTextAreaWorldRect();
        _this.spriteText.mask = new Texture(global.gameWidth, global.gameHeight);
        Draw.brush.color = 0xFFFFFF;
        Draw.brush.alpha = 1;
        Draw.rectangleSolid(_this.spriteText.mask, textAreaWorldRect.x, textAreaWorldRect.y, textAreaWorldRect.width, textAreaWorldRect.height);
        _this.spriteTextOffset = 0;
        _this.portraitSprite = new Sprite({});
        _this.characterTimer = new Timer(0.05, function () { return _this.advanceCharacter(); }, true);
        return _this;
    }
    DialogBox.prototype.update = function (delta) {
        _super.prototype.update.call(this, delta);
        this.characterTimer.update(delta);
        if (this.done) {
            this.visible = false;
        }
        if (Input.justDown(this.advanceKey)) {
            this.advanceDialog();
        }
    };
    DialogBox.prototype.render = function (screen) {
        _super.prototype.render.call(this, screen);
        if (this.portraitSprite.visible) {
            this.setPortraitSpriteProperties();
            this.portraitSprite.render(screen);
        }
        this.setSpriteTextProperties();
        this.spriteText.render(screen);
    };
    DialogBox.prototype.advanceDialog = function () {
        if (this.advanceCharacter()) {
            this.completePage();
        }
        else if (!_.isEmpty(this.charQueue)) {
            this.advancePage();
        }
        else {
            this.completeDialog();
        }
    };
    DialogBox.prototype.advanceCharacter = function () {
        if (!_.isEmpty(this.charQueue) && this.charQueue[0].bottom <= this.spriteTextOffset + this.textArea.height) {
            this.spriteText.chars.push(this.charQueue.shift());
            return true;
        }
        return false;
    };
    DialogBox.prototype.advancePage = function () {
        this.completePage();
        this.spriteTextOffset = this.spriteText.getTextHeight();
    };
    DialogBox.prototype.completeDialog = function () {
        this.done = true;
    };
    DialogBox.prototype.completePage = function () {
        var iters = 0;
        while (this.advanceCharacter() && iters < DialogBox.MAX_COMPLETE_PAGE_ITERS) {
            iters++;
        }
    };
    DialogBox.prototype.getPortraitWorldPosition = function () {
        return {
            x: this.x + this.portraitPosition.x,
            y: this.y + this.portraitPosition.y,
        };
    };
    DialogBox.prototype.getTextAreaWorldRect = function () {
        return {
            x: this.x + this.textArea.x,
            y: this.y + this.textArea.y,
            width: this.textArea.width,
            height: this.textArea.height,
        };
    };
    DialogBox.prototype.setPortraitSpriteProperties = function () {
        this.portraitSprite.x = this.x + this.portraitPosition.x;
        this.portraitSprite.y = this.y + this.portraitPosition.y;
    };
    DialogBox.prototype.setSpriteTextProperties = function () {
        this.spriteText.x = this.x + this.textArea.x;
        this.spriteText.y = this.y + this.textArea.y - this.spriteTextOffset;
    };
    DialogBox.prototype.showDialog = function (dialogText) {
        // Reset dialog properties.
        this.spriteText.clear();
        this.spriteTextOffset = 0;
        this.visible = true;
        this.done = false;
        this.charQueue = SpriteTextConverter.textToCharListWithWordWrap(dialogText, this.spriteText.font, this.textArea.width);
        this.characterTimer.reset();
        this.advanceCharacter(); // Advance character once to start the dialog with one displayed character.
    };
    DialogBox.prototype.showPortrait = function (portrait) {
        if (!portrait || portrait === DialogBox.NONE_PORTRAIT) {
            this.portraitSprite.visible = false;
            this.textArea = this.textAreaFull;
        }
        else {
            this.portraitSprite.setTexture(portrait);
            this.portraitSprite.visible = true;
            this.textArea = this.textAreaPortrait;
        }
    };
    DialogBox.MAX_COMPLETE_PAGE_ITERS = 10000;
    DialogBox.NONE_PORTRAIT = 'none';
    return DialogBox;
}(Sprite));
var Direction2D = /** @class */ (function () {
    function Direction2D() {
    }
    Object.defineProperty(Direction2D, "UP", {
        get: function () { return Direction.TOP_CENTER; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Direction2D, "DOWN", {
        get: function () { return Direction.BOTTOM_CENTER; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Direction2D, "LEFT", {
        get: function () { return Direction.CENTER_LEFT; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Direction2D, "RIGHT", {
        get: function () { return Direction.CENTER_RIGHT; },
        enumerable: true,
        configurable: true
    });
    return Direction2D;
}());
var Direction = /** @class */ (function () {
    function Direction() {
    }
    Object.defineProperty(Direction, "TOP", {
        get: function () { return -1; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Direction, "CENTER", {
        get: function () { return 0; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Direction, "BOTTOM", {
        get: function () { return 1; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Direction, "LEFT", {
        get: function () { return -1; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Direction, "RIGHT", {
        get: function () { return 1; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Direction, "UP", {
        get: function () { return -1; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Direction, "DOWN", {
        get: function () { return 1; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Direction, "NONE", {
        get: function () { return 0; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Direction, "TOP_LEFT", {
        get: function () { return { v: Direction.TOP, h: Direction.LEFT }; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Direction, "TOP_CENTER", {
        get: function () { return { v: Direction.TOP, h: Direction.CENTER }; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Direction, "TOP_RIGHT", {
        get: function () { return { v: Direction.TOP, h: Direction.RIGHT }; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Direction, "CENTER_LEFT", {
        get: function () { return { v: Direction.CENTER, h: Direction.LEFT }; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Direction, "CENTER_CENTER", {
        get: function () { return { v: Direction.CENTER, h: Direction.CENTER }; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Direction, "CENTER_RIGHT", {
        get: function () { return { v: Direction.CENTER, h: Direction.RIGHT }; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Direction, "BOTTOM_LEFT", {
        get: function () { return { v: Direction.BOTTOM, h: Direction.LEFT }; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Direction, "BOTTOM_CENTER", {
        get: function () { return { v: Direction.BOTTOM, h: Direction.CENTER }; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Direction, "BOTTOM_RIGHT", {
        get: function () { return { v: Direction.BOTTOM, h: Direction.RIGHT }; },
        enumerable: true,
        configurable: true
    });
    Direction.angleOf = function (direction) {
        return V.angle({ x: direction.h, y: direction.v });
    };
    // static closestDirection(angle: number, cardinalOnly: boolean = false) {
    //     let directions = [
    //         Direction.TOP_CENTER,
    //         Direction.CENTER_LEFT,
    //         Direction.BOTTOM_CENTER,
    //         Direction.CENTER_RIGHT
    //     ];
    //     if (!cardinalOnly) {
    //         directions.push(
    //             Direction.TOP_LEFT,
    //             Direction.TOP_RIGHT,
    //             Direction.BOTTOM_RIGHT,
    //             Direction.BOTTOM_LEFT
    //         );
    //     }
    //     return L.argmax(directions, direction => Math.abs(Phaser.Math.Angle.ShortestBetween(angle*Phaser.Math.RAD_TO_DEG, Direction.angleOf(direction)*Phaser.Math.RAD_TO_DEG)));
    // }
    Direction.equals = function (d1, d2) {
        if (!d1 && !d2)
            return true;
        if (!d1 || !d2)
            return false;
        return d1.h == d2.h && d1.v == d2.v;
    };
    Direction.rotatePointByDirection = function (x, y, direction) {
        if (Direction.equals(direction, Direction.CENTER_RIGHT)) {
            return { x: x, y: y };
        }
        if (Direction.equals(direction, Direction.TOP_CENTER)) {
            return { x: -y, y: x };
        }
        if (Direction.equals(direction, Direction.CENTER_LEFT)) {
            return { x: -x, y: -y };
        }
        if (Direction.equals(direction, Direction.BOTTOM_CENTER)) {
            return { x: y, y: -x };
        }
        debug("Direction", direction, "is not supported by rotatePointByDirection.");
        return { x: x, y: y };
    };
    Direction.rotatePointBetweenDirections = function (x, y, startDirection, endDirection) {
        var pointFromStart = Direction.rotatePointByDirection(x, y, { h: startDirection.h, v: -startDirection.v });
        return Direction.rotatePointByDirection(pointFromStart.x, pointFromStart.y, endDirection);
    };
    return Direction;
}());
var Draw = /** @class */ (function () {
    function Draw() {
    }
    Draw.fill = function (texture, brush) {
        if (brush === void 0) { brush = Draw.brush; }
        this.graphics.lineStyle(0, 0, 0);
        this.graphics.clear();
        this.graphics.beginFill(brush.color, brush.alpha);
        this.graphics.drawRect(0, 0, texture.width, texture.height);
        this.graphics.endFill();
        texture.clear();
        texture.renderDisplayObject(this.graphics);
    };
    Draw.pixel = function (texture, x, y, brush) {
        if (brush === void 0) { brush = Draw.brush; }
        this.graphics.lineStyle(1, brush.color, brush.alpha, this.ALIGNMENT_INNER);
        this.graphics.clear();
        this.graphics.beginFill(0, 0);
        this.graphics.drawRect(x, y, 1, 1);
        this.graphics.endFill();
        texture.renderDisplayObject(this.graphics);
    };
    Draw.rectangleOutline = function (texture, x, y, width, height, alignment, brush) {
        if (alignment === void 0) { alignment = this.ALIGNMENT_INNER; }
        if (brush === void 0) { brush = Draw.brush; }
        this.graphics.lineStyle(brush.thickness, brush.color, brush.alpha, alignment);
        this.graphics.clear();
        this.graphics.beginFill(0, 0);
        this.graphics.drawRect(x, y, width, height);
        this.graphics.endFill();
        texture.renderDisplayObject(this.graphics);
    };
    Draw.rectangleSolid = function (texture, x, y, width, height, brush) {
        if (brush === void 0) { brush = Draw.brush; }
        this.graphics.lineStyle(0, 0, 0);
        this.graphics.clear();
        this.graphics.beginFill(brush.color, brush.alpha);
        this.graphics.drawRect(x, y, width, height);
        this.graphics.endFill();
        texture.renderDisplayObject(this.graphics);
    };
    Draw.brush = {
        color: 0x000000,
        alpha: 1,
        thickness: 1
    };
    Draw.graphics = new PIXI.Graphics();
    Draw.ALIGNMENT_INNER = 0;
    Draw.ALIGNMENT_MIDDLE = 0.5;
    Draw.ALIGNMENT_OUTER = 1;
    return Draw;
}());
"\n\nDraw.pixel(texture, 34, 56, 0xFFF000, 0.5);\n\nDraw.color = 0xFFF000;\nDraw.alpha = 1;\nDraw.pixel(texture, 34, 56);\n\n";
///<reference path="./debug.ts"/>
var TextureFilter = /** @class */ (function () {
    function TextureFilter(config) {
        this.pixiFilter = this.constructPixiFilterCached(config.code, config.uniforms);
        this.uniforms = this.constructUniforms(config.uniforms);
        this.setUniforms(config.defaultUniforms);
        this.enabled = true;
    }
    TextureFilter.prototype.getPixiFilter = function () {
        return this.pixiFilter;
    };
    TextureFilter.prototype.getUniform = function (uniform) {
        return this.uniforms[uniform];
    };
    TextureFilter.prototype.setPixiUniforms = function () {
        for (var uniform in this.uniforms) {
            this.pixiFilter.uniforms[uniform] = this.uniforms[uniform];
        }
    };
    TextureFilter.prototype.setDimensions = function (width, height) { };
    TextureFilter.prototype.setTexturePosition = function (posx, posy) {
        this.pixiFilter.uniforms['posx'] = posx;
        this.pixiFilter.uniforms['posy'] = posy;
    };
    TextureFilter.prototype.setUniform = function (uniform, value) {
        this.uniforms[uniform] = value;
    };
    TextureFilter.prototype.setUniforms = function (uniforms) {
        if (!uniforms)
            return;
        for (var key in uniforms) {
            this.uniforms[key] = uniforms[key];
        }
    };
    TextureFilter.prototype.constructUniforms = function (uniformDeclarations) {
        if (_.isEmpty(uniformDeclarations))
            return {};
        var uniformMap = {};
        uniformDeclarations
            .map(function (decl) { return decl.trim(); })
            .map(function (decl) { return decl.substring(decl.lastIndexOf(' ') + 1); })
            .forEach(function (decl) { return (uniformMap[decl] = undefined); });
        return uniformMap;
    };
    TextureFilter.prototype.constructPixiFilterCached = function (code, uniforms) {
        var uniformsCode = (uniforms || []).map(function (uniform) { return "uniform " + uniform + ";"; }).join('');
        var cacheKey = uniformsCode + code;
        if (!TextureFilter.cache[cacheKey]) {
            var vert = TextureFilter.vert;
            var frag = TextureFilter.fragPreUniforms + uniformsCode + TextureFilter.fragStartFunc + code + TextureFilter.fragEndFunc;
            var result = new PIXI.Filter(vert, frag, {});
            TextureFilter.cache[cacheKey] = result;
        }
        return TextureFilter.cache[cacheKey];
    };
    TextureFilter.vert = "\n        attribute vec2 aVertexPosition;\n        uniform mat3 projectionMatrix;\n        varying vec2 vTextureCoord;\n        uniform vec4 inputSize;\n        uniform vec4 outputFrame;\n        varying vec4 is;\n        \n        vec4 filterVertexPosition(void) {\n            vec2 position = aVertexPosition * max(outputFrame.zw, vec2(0.)) + outputFrame.xy;\n            return vec4((projectionMatrix * vec3(position, 1.0)).xy, 0.0, 1.0);\n        }\n        \n        vec2 filterTextureCoord(void) {\n            return aVertexPosition * (outputFrame.zw * inputSize.zw);\n        }\n        \n        void main(void) {\n            gl_Position = filterVertexPosition();\n            vTextureCoord = filterTextureCoord();\n            is = inputSize;\n        }\n    ";
    TextureFilter.fragPreUniforms = "\n        varying vec2 vTextureCoord;\n        varying vec4 is;\n        uniform sampler2D uSampler;\n        uniform float posx;\n        uniform float posy;\n\n        float width;\n        float height;\n    ";
    TextureFilter.fragStartFunc = "\n        vec4 getColor(float localx, float localy) {\n            float tx = (localx + posx) / width;\n            float ty = (localy + posy) / height;\n            return texture2D(uSampler, vec2(tx, ty));\n        }\n\n        vec4 getWorldColor(float worldx, float worldy) {\n            float tx = worldx / width;\n            float ty = worldy / height;\n            return texture2D(uSampler, vec2(tx, ty));\n        }\n\n        void main(void) {\n            width = is.x;\n            height = is.y;\n            float worldx = vTextureCoord.x * width;\n            float worldy = vTextureCoord.y * height;\n            float x = worldx - posx;\n            float y = worldy - posy;\n            vec4 inp = texture2D(uSampler, vTextureCoord);\n            // Un-premultiply alpha before applying the color matrix. See PIXI issue #3539.\n            if (inp.a > 0.0) {\n                inp.rgb /= inp.a;\n            }\n            vec4 outp = vec4(inp.r, inp.g, inp.b, inp.a);\n    ";
    TextureFilter.fragEndFunc = "\n            // Premultiply alpha again.\n            outp.rgb *= outp.a;\n            gl_FragColor = outp;\n        }\n    ";
    return TextureFilter;
}());
(function (TextureFilter) {
    TextureFilter.cache = {};
    var Static = /** @class */ (function (_super) {
        __extends(Static, _super);
        function Static(code) {
            return _super.call(this, { code: code }) || this;
        }
        return Static;
    }(TextureFilter));
    TextureFilter.Static = Static;
    var Mask = /** @class */ (function (_super) {
        __extends(Mask, _super);
        function Mask(config) {
            var _this = _super.call(this, {
                uniforms: ["sampler2D mask", "float maskWidth", "float maskHeight", "float maskX", "float maskY", "bool invert"],
                code: "\n                    vec2 vTextureCoordMask = vTextureCoord * is.xy / vec2(maskWidth, maskHeight) - vec2(maskX, maskY) / vec2(maskWidth, maskHeight);\n                    if (vTextureCoordMask.x >= 0.0 && vTextureCoordMask.x < 1.0 && vTextureCoordMask.y >= 0.0 && vTextureCoordMask.y < 1.0) {\n                        float a = texture2D(mask, vTextureCoordMask).a;\n                        outp *= invert ? 1.0-a : a;\n                    } else {\n                        outp.a = invert ? inp.a : 0.0;\n                    }\n                "
            }) || this;
            _this.type = config.type;
            _this.offsetX = O.getOrDefault(config.offsetX, 0);
            _this.offsetY = O.getOrDefault(config.offsetY, 0);
            _this.invert = O.getOrDefault(config.invert, false);
            _this.setMask(config.mask);
            return _this;
        }
        Object.defineProperty(Mask.prototype, "invert", {
            get: function () { return this.getUniform('invert'); },
            set: function (value) { this.setUniform('invert', value); },
            enumerable: true,
            configurable: true
        });
        Mask.prototype.setMask = function (mask) {
            this.setUniform('mask', mask.toMaskTexture());
            this.setUniform('maskWidth', mask.width);
            this.setUniform('maskHeight', mask.height);
            this.setMaskPosition(0, 0);
        };
        Mask.prototype.setTexturePosition = function (posx, posy) {
            _super.prototype.setTexturePosition.call(this, posx, posy);
            this.setMaskPosition(posx, posy);
        };
        Mask.prototype.setMaskPosition = function (textureX, textureY) {
            if (this.type === Mask.Type.GLOBAL) {
                this.setUniform('maskX', this.offsetX);
                this.setUniform('maskY', this.offsetY);
            }
            else if (this.type === Mask.Type.LOCAL) {
                this.setUniform('maskX', textureX + this.offsetX);
                this.setUniform('maskY', textureY + this.offsetY);
            }
        };
        return Mask;
    }(TextureFilter));
    TextureFilter.Mask = Mask;
    (function (Mask) {
        var Type;
        (function (Type) {
            Type["GLOBAL"] = "global";
            Type["LOCAL"] = "local";
        })(Type = Mask.Type || (Mask.Type = {}));
    })(Mask = TextureFilter.Mask || (TextureFilter.Mask = {}));
    var Slice = /** @class */ (function (_super) {
        __extends(Slice, _super);
        function Slice(rect) {
            return _super.call(this, {
                uniforms: ["float sliceX", "float sliceY", "float sliceWidth", "float sliceHeight"],
                defaultUniforms: {
                    'sliceX': rect.x,
                    'sliceY': rect.y,
                    'sliceWidth': rect.width,
                    'sliceHeight': rect.height,
                },
                code: "\n                    if (x < sliceX || x >= sliceX + sliceWidth || y < sliceY || y >= sliceY + sliceHeight) {\n                        outp.a = 0.0;\n                    }\n                "
            }) || this;
        }
        Slice.prototype.setSlice = function (rect) {
            this.setUniforms({
                'sliceX': rect.x,
                'sliceY': rect.y,
                'sliceWidth': rect.width,
                'sliceHeight': rect.height,
            });
        };
        return Slice;
    }(TextureFilter));
    TextureFilter.Slice = Slice;
    var _sliceFilter = new Slice({ x: 0, y: 0, width: 0, height: 0 });
    function SLICE(rect) {
        _sliceFilter.setSlice(rect);
        return _sliceFilter;
    }
    TextureFilter.SLICE = SLICE;
})(TextureFilter || (TextureFilter = {}));
/// <reference path="./textureFilter.ts" />
// TODO: major issue where the same two filter types cannot be applied to a texture at the same time (due to caching issues)
var Effects = /** @class */ (function () {
    function Effects(config) {
        if (config === void 0) { config = {}; }
        this.effects = [undefined, undefined];
        this.pre = { filters: [], enabled: true };
        this.post = { filters: [], enabled: true };
        this.updateFromConfig(config);
    }
    Object.defineProperty(Effects.prototype, "silhouette", {
        get: function () {
            if (!this.effects[Effects.SILHOUETTE_I]) {
                this.effects[Effects.SILHOUETTE_I] = new Effects.Filters.Silhouette(0x000000, 1);
                this.effects[Effects.SILHOUETTE_I].enabled = false;
            }
            return this.effects[Effects.SILHOUETTE_I];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Effects.prototype, "outline", {
        get: function () {
            if (!this.effects[Effects.OUTLINE_I]) {
                this.effects[Effects.OUTLINE_I] = new Effects.Filters.Outline(0x000000, 1);
                this.effects[Effects.OUTLINE_I].enabled = false;
            }
            return this.effects[Effects.OUTLINE_I];
        },
        enumerable: true,
        configurable: true
    });
    Effects.prototype.getFilterList = function () {
        return this.pre.filters.concat(this.effects).concat(this.post.filters);
    };
    Effects.prototype.updateFromConfig = function (config) {
        if (!config)
            return;
        if (config.pre) {
            this.pre.filters = O.getOrDefault(config.pre.filters, []);
            this.pre.enabled = O.getOrDefault(config.pre.enabled, true);
        }
        if (config.silhouette) {
            this.silhouette.color = O.getOrDefault(config.silhouette.color, 0x000000);
            this.silhouette.alpha = O.getOrDefault(config.silhouette.alpha, 1);
            this.silhouette.enabled = O.getOrDefault(config.silhouette.enabled, true);
        }
        if (config.outline) {
            this.outline.color = O.getOrDefault(config.outline.color, 0x000000);
            this.outline.alpha = O.getOrDefault(config.outline.alpha, 1);
            this.outline.enabled = O.getOrDefault(config.outline.enabled, true);
            ;
        }
        if (config.post) {
            this.post.filters = O.getOrDefault(config.post.filters, []);
            this.post.enabled = O.getOrDefault(config.post.enabled, true);
        }
    };
    Effects.SILHOUETTE_I = 0;
    Effects.OUTLINE_I = 1;
    return Effects;
}());
(function (Effects) {
    var Filters;
    (function (Filters) {
        var Silhouette = /** @class */ (function (_super) {
            __extends(Silhouette, _super);
            function Silhouette(color, alpha) {
                var _this = _super.call(this, {
                    uniforms: ["vec3 color", "float alpha"],
                    code: "\n                        if (inp.a > 0.0) {\n                            outp = vec4(color, alpha);\n                        }\n                    "
                }) || this;
                _this.color = color;
                _this.alpha = alpha;
                return _this;
            }
            Object.defineProperty(Silhouette.prototype, "color", {
                get: function () { return M.vec3ToColor(this.getUniform('color')); },
                set: function (value) { this.setUniform('color', M.colorToVec3(value)); },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Silhouette.prototype, "alpha", {
                get: function () { return this.getUniform('alpha'); },
                set: function (value) { this.setUniform('alpha', value); },
                enumerable: true,
                configurable: true
            });
            return Silhouette;
        }(TextureFilter));
        Filters.Silhouette = Silhouette;
        var Outline = /** @class */ (function (_super) {
            __extends(Outline, _super);
            function Outline(color, alpha) {
                var _this = _super.call(this, {
                    uniforms: ["vec3 color", "float alpha"],
                    code: "\n                        if (inp.a == 0.0 && (getColor(x-1.0, y).a > 0.0 || getColor(x+1.0, y).a > 0.0 || getColor(x, y-1.0).a > 0.0 || getColor(x, y+1.0).a > 0.0)) {\n                            outp = vec4(color, alpha);\n                        }\n                    "
                }) || this;
                _this.color = color;
                _this.alpha = alpha;
                return _this;
            }
            Object.defineProperty(Outline.prototype, "color", {
                get: function () { return M.vec3ToColor(this.getUniform('color')); },
                set: function (value) { this.setUniform('color', M.colorToVec3(value)); },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Outline.prototype, "alpha", {
                get: function () { return this.getUniform('alpha'); },
                set: function (value) { this.setUniform('alpha', value); },
                enumerable: true,
                configurable: true
            });
            return Outline;
        }(TextureFilter));
        Filters.Outline = Outline;
    })(Filters = Effects.Filters || (Effects.Filters = {}));
})(Effects || (Effects = {}));
var FPSMetricManager = /** @class */ (function () {
    function FPSMetricManager(timePerReport) {
        this.monitor = new Monitor();
        this.timePerReport = timePerReport;
        this.time = 0;
    }
    FPSMetricManager.prototype.update = function (delta) {
        this.monitor.addPoint(delta);
        this.time += delta;
        if (this.time >= this.timePerReport) {
            this.report();
            this.monitor.clear();
            this.time = 0;
        }
    };
    FPSMetricManager.prototype.report = function () {
        //debug(`avg: ${1/this.monitor.getAvg()}, p50: ${1/this.monitor.getP(50)}`);
    };
    return FPSMetricManager;
}());
var Game = /** @class */ (function () {
    function Game(config) {
        this.mainMenuClass = config.mainMenuClass;
        this.pauseMenuClass = config.pauseMenuClass;
        this.theaterClass = config.theaterClass;
        this.theaterConfig = config.theaterConfig;
        this.fpsMetricManager = new FPSMetricManager(1);
        this.menuSystem = new MenuSystem(this);
        this.loadMainMenu();
        if (Debug.SKIP_MAIN_MENU) {
            this.startGame();
        }
    }
    Object.defineProperty(Game.prototype, "isPaused", {
        get: function () { return this.menuSystem.inMenu && this.menuSystem.currentMenu instanceof this.pauseMenuClass; },
        enumerable: true,
        configurable: true
    });
    Game.prototype.update = function (delta) {
        this.fpsMetricManager.update(delta);
        this.updatePause();
        if (this.menuSystem.inMenu) {
            this.menuSystem.update(delta);
        }
        else {
            this.theater.update(delta);
        }
    };
    Game.prototype.updatePause = function () {
        if (this.menuSystem.inMenu) {
            if (Input.justDown('pause') && this.isPaused) {
                this.unpauseGame();
            }
        }
        else {
            if (Input.justDown('pause')) {
                this.pauseGame();
            }
        }
    };
    Game.prototype.render = function (screen) {
        if (this.menuSystem.inMenu) {
            this.menuSystem.render(screen);
        }
        else {
            this.theater.render(screen);
        }
    };
    Game.prototype.loadMainMenu = function () {
        this.menuSystem.loadMenu(this.mainMenuClass);
    };
    Game.prototype.loadTheater = function () {
        this.theater = new this.theaterClass(this.theaterConfig);
        global.theater = this.theater;
        // fade out since the cutscene can't do this in 1 frame
        global.theater.runScript(S.fadeOut(0)).finishImmediately();
    };
    Game.prototype.pauseGame = function () {
        this.menuSystem.loadMenu(this.pauseMenuClass);
    };
    Game.prototype.startGame = function () {
        this.loadTheater();
        this.menuSystem.clear();
    };
    Game.prototype.unpauseGame = function () {
        this.menuSystem.clear();
    };
    return Game;
}());
var global = /** @class */ (function () {
    function global() {
    }
    global.clearStacks = function () {
        this.scriptStack = [];
    };
    Object.defineProperty(global, "script", {
        // Update options
        get: function () { return this.scriptStack[this.scriptStack.length - 1]; },
        enumerable: true,
        configurable: true
    });
    ;
    global.pushScript = function (script) { this.scriptStack.push(script); };
    global.popScript = function () { return this.scriptStack.pop(); };
    Object.defineProperty(global, "world", {
        get: function () { return this.theater ? this.theater.currentWorld : undefined; },
        enumerable: true,
        configurable: true
    });
    global.scriptStack = [];
    return global;
}());
var Input = /** @class */ (function () {
    function Input() {
    }
    Input.setKeys = function (keyCodesByName) {
        var e_7, _a;
        this.keyCodesByName = _.clone(keyCodesByName);
        this.isDownByKeyCode = {};
        this.keysByKeycode = {};
        for (var name_2 in keyCodesByName) {
            this.keyCodesByName[name_2].push(this.debugKeyCode(name_2));
            try {
                for (var _b = __values(keyCodesByName[name_2]), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var keyCode = _c.value;
                    this.setupKeyCode(keyCode);
                }
            }
            catch (e_7_1) { e_7 = { error: e_7_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_7) throw e_7.error; }
            }
        }
    };
    Input.update = function () {
        if (Debug.PROGRAMMATIC_INPUT) {
            this.clearKeys();
        }
        this.updateKeys();
        this.updateMousePosition();
    };
    Input.consume = function (key) {
        var e_8, _a;
        try {
            for (var _b = __values(this.keyCodesByName[key] || []), _c = _b.next(); !_c.done; _c = _b.next()) {
                var keyCode = _c.value;
                this.keysByKeycode[keyCode].consume();
            }
        }
        catch (e_8_1) { e_8 = { error: e_8_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_8) throw e_8.error; }
        }
    };
    Input.debugKeyDown = function (name) {
        if (!Debug.PROGRAMMATIC_INPUT)
            return;
        this.keysByKeycode[this.debugKeyCode(name)].setDown();
    };
    Input.debugKeyJustDown = function (name) {
        if (!Debug.PROGRAMMATIC_INPUT)
            return;
        this.keysByKeycode[this.debugKeyCode(name)].setJustDown();
    };
    Input.debugKeyUp = function (name) {
        if (!Debug.PROGRAMMATIC_INPUT)
            return;
        this.keysByKeycode[this.debugKeyCode(name)].setUp();
    };
    Input.debugKeyJustUp = function (name) {
        if (!Debug.PROGRAMMATIC_INPUT)
            return;
        this.keysByKeycode[this.debugKeyCode(name)].setJustUp();
    };
    Input.debugKeyCode = function (name) {
        return this.DEBUG_PREFIX + name;
    };
    Input.updateKeys = function () {
        for (var keyCode in this.keysByKeycode) {
            this.keysByKeycode[keyCode].update(this.isDownByKeyCode[keyCode]);
        }
    };
    Input.clearKeys = function () {
        for (var keyCode in this.isDownByKeyCode) {
            this.isDownByKeyCode[keyCode] = false;
        }
    };
    Input.updateMousePosition = function () {
        this._canvasMouseX = global.renderer.plugins.interaction.mouse.global.x;
        this._canvasMouseY = global.renderer.plugins.interaction.mouse.global.y;
        if (this.isMouseOnCanvas) {
            this._mouseX = Math.floor(this._canvasMouseX);
            this._mouseY = Math.floor(this._canvasMouseY);
        }
    };
    Input.setupKeyCode = function (keyCode) {
        this.isDownByKeyCode[keyCode] = false;
        this.keysByKeycode[keyCode] = this.keysByKeycode[keyCode] || new Input.Key();
    };
    Input.isDown = function (key) {
        var _this = this;
        return this.keyCodesByName[key] && this.keyCodesByName[key].some(function (keyCode) { return _this.keysByKeycode[keyCode].isDown; });
    };
    Input.isUp = function (key) {
        var _this = this;
        return this.keyCodesByName[key] && this.keyCodesByName[key].every(function (keyCode) { return _this.keysByKeycode[keyCode].isUp; });
    };
    Input.justDown = function (key) {
        var _this = this;
        return this.keyCodesByName[key] && this.keyCodesByName[key].some(function (keyCode) { return _this.keysByKeycode[keyCode].justDown; });
    };
    Input.justUp = function (key) {
        var _this = this;
        return this.keyCodesByName[key] && this.keyCodesByName[key].some(function (keyCode) { return _this.keysByKeycode[keyCode].justUp; })
            && this.keyCodesByName[key].every(function (keyCode) { return _this.keysByKeycode[keyCode].isUp || _this.keysByKeycode[keyCode].justUp; });
    };
    Object.defineProperty(Input, "mouseX", {
        get: function () {
            return this._mouseX;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Input, "mouseY", {
        get: function () {
            return this._mouseY;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Input, "mousePosition", {
        get: function () {
            return { x: this.mouseX, y: this.mouseY };
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Input, "canvasMouseX", {
        get: function () {
            return this._canvasMouseX;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Input, "canvasMouseY", {
        get: function () {
            return this._canvasMouseY;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Input, "canvasMousePosition", {
        get: function () {
            return { x: this.canvasMouseX, y: this.canvasMouseY };
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Input, "isMouseOnCanvas", {
        get: function () {
            return 0 <= this.canvasMouseX && this.canvasMouseX < global.gameWidth && 0 <= this.canvasMouseY && this.canvasMouseY < global.gameHeight;
        },
        enumerable: true,
        configurable: true
    });
    Input.handleKeyDownEvent = function (event) {
        if (this.isDownByKeyCode[event.key] !== undefined) {
            this.isDownByKeyCode[event.key] = true;
            event.preventDefault();
        }
    };
    Input.handleKeyUpEvent = function (event) {
        if (this.isDownByKeyCode[event.key] !== undefined) {
            this.isDownByKeyCode[event.key] = false;
            event.preventDefault();
        }
    };
    Input.handleMouseDownEvent = function (event) {
        var keyCode = this.MOUSE_KEYCODES[event.button];
        if (keyCode && this.isDownByKeyCode[keyCode] !== undefined) {
            this.isDownByKeyCode[keyCode] = true;
            event.preventDefault();
        }
    };
    Input.handleMouseUpEvent = function (event) {
        var keyCode = this.MOUSE_KEYCODES[event.button];
        if (keyCode && this.isDownByKeyCode[keyCode] !== undefined) {
            this.isDownByKeyCode[keyCode] = false;
            event.preventDefault();
        }
    };
    Input._mouseX = 0;
    Input._mouseY = 0;
    Input._canvasMouseX = 0;
    Input._canvasMouseY = 0;
    Input.MOUSE_KEYCODES = ["MouseLeft", "MouseMiddle", "MouseRight", "MouseBack", "MouseForward"];
    Input.DEBUG_PREFIX = "debug::";
    return Input;
}());
(function (Input) {
    var Key = /** @class */ (function () {
        function Key() {
            this._isDown = false;
        }
        Object.defineProperty(Key.prototype, "isDown", {
            get: function () { return this._isDown; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Key.prototype, "isUp", {
            get: function () { return !this._isDown; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Key.prototype, "justDown", {
            get: function () { return this._isDown && !this._lastDown; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Key.prototype, "justUp", {
            get: function () { return !this._isDown && this._lastDown; },
            enumerable: true,
            configurable: true
        });
        Key.prototype.update = function (isDown) {
            this._lastDown = this._isDown;
            this._isDown = isDown;
        };
        Key.prototype.consume = function () {
            this._lastDown = this._isDown;
        };
        Key.prototype.setDown = function () {
            this._isDown = true;
            this._lastDown = true;
        };
        Key.prototype.setJustDown = function () {
            this._isDown = true;
            this._lastDown = false;
        };
        Key.prototype.setUp = function () {
            this._isDown = false;
            this._lastDown = false;
        };
        Key.prototype.setJustUp = function () {
            this._isDown = false;
            this._lastDown = true;
        };
        return Key;
    }());
    Input.Key = Key;
})(Input || (Input = {}));
var InteractionManager = /** @class */ (function () {
    function InteractionManager(theater) {
        this.theater = theater;
        this.reset();
    }
    Object.defineProperty(InteractionManager.prototype, "interactRequested", {
        get: function () { return this._interactRequested; },
        enumerable: true,
        configurable: true
    });
    InteractionManager.prototype.preRender = function () {
        if (this.highlightedObject) {
            this.highlightedObjectOutline = {
                enabled: this.highlightedObject.effects.outline.enabled,
                color: this.highlightedObject.effects.outline.color,
                alpha: this.highlightedObject.effects.outline.alpha
            };
            this.highlightedObject.effects.outline.enabled = true;
            this.highlightedObject.effects.outline.color = 0xFFFF00;
            this.highlightedObject.effects.outline.alpha = 1;
        }
    };
    InteractionManager.prototype.postRender = function () {
        if (this.highlightedObject) {
            this.highlightedObject.effects.outline.enabled = this.highlightedObjectOutline.enabled;
            this.highlightedObject.effects.outline.color = this.highlightedObjectOutline.color;
            this.highlightedObject.effects.outline.alpha = this.highlightedObjectOutline.alpha;
        }
    };
    InteractionManager.prototype.consumeInteraction = function () {
        this._interactRequested = null;
    };
    InteractionManager.prototype.getInteractableObjects = function () {
        var e_9, _a;
        var interactableObjects = this.theater.storyManager.getInteractableObjects(this.theater.storyManager.currentNode);
        var result = new Set();
        try {
            for (var interactableObjects_1 = __values(interactableObjects), interactableObjects_1_1 = interactableObjects_1.next(); !interactableObjects_1_1.done; interactableObjects_1_1 = interactableObjects_1.next()) {
                var name_3 = interactableObjects_1_1.value;
                if (!this.theater.currentWorld.hasWorldObject(name_3))
                    continue;
                result.add(name_3);
            }
        }
        catch (e_9_1) { e_9 = { error: e_9_1 }; }
        finally {
            try {
                if (interactableObjects_1_1 && !interactableObjects_1_1.done && (_a = interactableObjects_1.return)) _a.call(interactableObjects_1);
            }
            finally { if (e_9) throw e_9.error; }
        }
        return result;
    };
    InteractionManager.prototype.highlight = function (obj) {
        if (!obj) {
            this.highlightedObject = null;
            return;
        }
        var worldObject = this.theater.currentWorld.getWorldObjectByName(obj);
        if (!(worldObject instanceof Sprite)) {
            debug("Cannot highlight object " + obj + " because it is not a Sprite");
            return;
        }
        this.highlightedObject = worldObject;
    };
    InteractionManager.prototype.interact = function (obj) {
        if (obj === void 0) { obj = this.highlightedObject.name; }
        this._interactRequested = obj;
    };
    InteractionManager.prototype.reset = function () {
        this.highlightedObject = null;
        this.highlightedObjectOutline = null;
        this._interactRequested = null;
    };
    return InteractionManager;
}());
/// <reference path="./worldObject.ts" />
var World = /** @class */ (function () {
    function World(config, defaults) {
        var e_10, _a;
        config = WorldObject.resolveConfig(config, defaults);
        this.scriptManager = new ScriptManager();
        this.width = O.getOrDefault(config.width, global.gameWidth);
        this.height = O.getOrDefault(config.height, global.gameHeight);
        this.worldObjects = [];
        this.physicsGroups = this.createPhysicsGroups(config.physicsGroups);
        this.collisionOrder = O.getOrDefault(config.collisionOrder, []);
        this.worldObjectsByName = {};
        this.layers = this.createLayers(config.layers);
        this.backgroundColor = O.getOrDefault(config.backgroundColor, global.backgroundColor);
        this.backgroundAlpha = O.getOrDefault(config.backgroundAlpha, 1);
        var cameraConfig = O.getOrDefault(config.camera, {});
        _.defaults(cameraConfig, {
            width: this.width,
            height: this.height,
        });
        this.camera = new Camera(cameraConfig);
        this.screen = new Texture(this.width, this.height);
        this.layerTexture = new Texture(this.width, this.height);
        this.entryPoints = O.getOrDefault(config.entryPoints, {});
        try {
            for (var _b = __values(config.worldObjects || []), _c = _b.next(); !_c.done; _c = _b.next()) {
                var worldObjectConfig = _c.value;
                World.Actions.addWorldObjectToWorld(WorldObject.fromConfig(worldObjectConfig), this);
            }
        }
        catch (e_10_1) { e_10 = { error: e_10_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_10) throw e_10.error; }
        }
        this.debugCameraX = 0;
        this.debugCameraY = 0;
        this.debugMousePositionText = this.addWorldObject({
            constructor: SpriteText,
            x: 0, y: 0,
            font: Debug.MOUSE_POSITION_FONT,
            style: { color: 0x008800 },
            ignoreCamera: true,
            visible: false,
            active: false,
        });
    }
    World.prototype.update = function (delta) {
        var e_11, _a, e_12, _b, e_13, _c;
        this.updateDebugMousePosition();
        this.updateScriptManager(delta);
        try {
            for (var _d = __values(this.worldObjects), _e = _d.next(); !_e.done; _e = _d.next()) {
                var worldObject = _e.value;
                if (worldObject.active)
                    worldObject.preUpdate();
            }
        }
        catch (e_11_1) { e_11 = { error: e_11_1 }; }
        finally {
            try {
                if (_e && !_e.done && (_a = _d.return)) _a.call(_d);
            }
            finally { if (e_11) throw e_11.error; }
        }
        try {
            for (var _f = __values(this.worldObjects), _g = _f.next(); !_g.done; _g = _f.next()) {
                var worldObject = _g.value;
                if (worldObject.active)
                    worldObject.update(delta);
            }
        }
        catch (e_12_1) { e_12 = { error: e_12_1 }; }
        finally {
            try {
                if (_g && !_g.done && (_b = _f.return)) _b.call(_f);
            }
            finally { if (e_12) throw e_12.error; }
        }
        this.handleCollisions();
        try {
            for (var _h = __values(this.worldObjects), _j = _h.next(); !_j.done; _j = _h.next()) {
                var worldObject = _j.value;
                if (worldObject.active)
                    worldObject.postUpdate();
            }
        }
        catch (e_13_1) { e_13 = { error: e_13_1 }; }
        finally {
            try {
                if (_j && !_j.done && (_c = _h.return)) _c.call(_h);
            }
            finally { if (e_13) throw e_13.error; }
        }
        this.removeDeadWorldObjects();
        if (Debug.MOVE_CAMERA_WITH_ARROWS && global.theater && this === global.theater.currentWorld) {
            if (Input.isDown('debugMoveCameraLeft'))
                this.debugCameraX -= 1;
            if (Input.isDown('debugMoveCameraRight'))
                this.debugCameraX += 1;
            if (Input.isDown('debugMoveCameraUp'))
                this.debugCameraY -= 1;
            if (Input.isDown('debugMoveCameraDown'))
                this.debugCameraY += 1;
        }
        this.camera.update(this, delta);
    };
    World.prototype.updateDebugMousePosition = function () {
        this.debugMousePositionText.active = Debug.SHOW_MOUSE_POSITION;
        this.debugMousePositionText.visible = Debug.SHOW_MOUSE_POSITION;
        if (Debug.SHOW_MOUSE_POSITION) {
            this.debugMousePositionText.setText(St.padLeft(this.getWorldMouseX().toString(), 3) + " " + St.padLeft(this.getWorldMouseY().toString(), 3));
        }
    };
    World.prototype.updateScriptManager = function (delta) {
        this.scriptManager.update(delta);
    };
    World.prototype.render = function (screen) {
        var e_14, _a;
        var oldCameraX = this.camera.x;
        var oldCameraY = this.camera.y;
        if (Debug.MOVE_CAMERA_WITH_ARROWS && global.theater && this === global.theater.currentWorld) {
            this.camera.x += this.debugCameraX;
            this.camera.y += this.debugCameraY;
        }
        // Render background color.
        Draw.brush.color = this.backgroundColor;
        Draw.brush.alpha = this.backgroundAlpha;
        Draw.fill(this.screen);
        try {
            for (var _b = __values(this.layers), _c = _b.next(); !_c.done; _c = _b.next()) {
                var layer = _c.value;
                this.renderLayer(layer, this.layerTexture, this.screen);
            }
        }
        catch (e_14_1) { e_14 = { error: e_14_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_14) throw e_14.error; }
        }
        this.camera.x = oldCameraX;
        this.camera.y = oldCameraY;
        screen.render(this.screen);
    };
    World.prototype.renderLayer = function (layer, layerTexture, screen) {
        var e_15, _a;
        layerTexture.clear();
        layer.sort();
        try {
            for (var _b = __values(layer.worldObjects), _c = _b.next(); !_c.done; _c = _b.next()) {
                var worldObject = _c.value;
                if (worldObject.visible) {
                    worldObject.fullRender(layerTexture);
                }
            }
        }
        catch (e_15_1) { e_15 = { error: e_15_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_15) throw e_15.error; }
        }
        screen.render(layerTexture, {
            filters: layer.effects.getFilterList()
        });
    };
    World.prototype.addWorldObject = function (obj) {
        var worldObject = obj instanceof WorldObject ? obj : WorldObject.fromConfig(obj);
        return World.Actions.addWorldObjectToWorld(worldObject, this);
    };
    World.prototype.addWorldObjects = function (objs) {
        var worldObjects = _.isEmpty(objs) ? [] : objs.map(function (obj) { return obj instanceof WorldObject ? obj : WorldObject.fromConfig(obj); });
        return World.Actions.addWorldObjectsToWorld(worldObjects, this);
    };
    World.prototype.getDeadWorldObjects = function () {
        return this.worldObjects.filter(function (obj) { return !obj.alive; });
    };
    World.prototype.getEntryPoint = function (entryPointKey) {
        if (!this.entryPoints || !this.entryPoints[entryPointKey]) {
            debug("World does not have an entry point named '" + entryPointKey + "':", this);
            return undefined;
        }
        return this.entryPoints[entryPointKey];
    };
    World.prototype.getLayer = function (obj) {
        var e_16, _a;
        if (_.isString(obj))
            obj = this.getWorldObjectByName(obj);
        try {
            for (var _b = __values(this.layers), _c = _b.next(); !_c.done; _c = _b.next()) {
                var layer = _c.value;
                if (_.contains(layer.worldObjects, obj))
                    return layer.name;
            }
        }
        catch (e_16_1) { e_16 = { error: e_16_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_16) throw e_16.error; }
        }
        return undefined;
    };
    World.prototype.getLayerByName = function (name) {
        var e_17, _a;
        try {
            for (var _b = __values(this.layers), _c = _b.next(); !_c.done; _c = _b.next()) {
                var layer = _c.value;
                if (layer.name === name)
                    return layer;
            }
        }
        catch (e_17_1) { e_17 = { error: e_17_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_17) throw e_17.error; }
        }
        return undefined;
    };
    World.prototype.getName = function (obj) {
        if (_.isString(obj))
            return obj;
        for (var name_4 in this.worldObjectsByName) {
            if (this.worldObjectsByName[name_4] === obj)
                return name_4;
        }
        return undefined;
    };
    World.prototype.getPhysicsGroup = function (obj) {
        if (_.isString(obj))
            obj = this.getWorldObjectByName(obj);
        for (var name_5 in this.physicsGroups) {
            if (_.contains(this.physicsGroups[name_5].worldObjects, obj))
                return name_5;
        }
        return undefined;
    };
    World.prototype.getPhysicsGroupByName = function (name) {
        return this.physicsGroups[name];
    };
    World.prototype.getWorldMouseX = function () {
        return Input.mouseX + Math.floor(this.camera.x - this.camera.width / 2);
    };
    World.prototype.getWorldMouseY = function () {
        return Input.mouseY + Math.floor(this.camera.y - this.camera.height / 2);
    };
    World.prototype.getWorldMousePosition = function () {
        return { x: this.getWorldMouseX(), y: this.getWorldMouseY() };
    };
    World.prototype.getWorldObjectByName = function (name) {
        if (!this.worldObjectsByName[name]) {
            debug("No object with name '" + name + "' exists in world", this);
        }
        return this.worldObjectsByName[name];
    };
    World.prototype.getWorldObjectByType = function (type) {
        var results = this.getWorldObjectsByType(type);
        if (_.isEmpty(results)) {
            debug("No object of type " + type.name + " exists in world", this);
            return undefined;
        }
        if (results.length > 1) {
            debug("Multiple objects of type " + type.name + " exist in world. Returning one of them. World:", this);
        }
        return results[0];
    };
    World.prototype.getWorldObjectsByType = function (type) {
        return this.worldObjects.filter(function (obj) { return obj instanceof type; });
    };
    World.prototype.handleCollisions = function () {
        var _this = this;
        var e_18, _a, e_19, _b, e_20, _c;
        try {
            for (var _d = __values(this.collisionOrder), _e = _d.next(); !_e.done; _e = _d.next()) {
                var collision = _e.value;
                var move = _.isArray(collision.move) ? collision.move : [collision.move];
                var from = _.isArray(collision.from) ? collision.from : [collision.from];
                var fromObjects = _.flatten(from.map(function (name) { return _this.physicsGroups[name].worldObjects; }));
                try {
                    for (var move_1 = __values(move), move_1_1 = move_1.next(); !move_1_1.done; move_1_1 = move_1.next()) {
                        var moveGroup = move_1_1.value;
                        var group = this.physicsGroups[moveGroup].worldObjects;
                        try {
                            for (var group_1 = __values(group), group_1_1 = group_1.next(); !group_1_1.done; group_1_1 = group_1.next()) {
                                var obj = group_1_1.value;
                                Physics.collide(obj, fromObjects, {
                                    callback: collision.callback,
                                    transferMomentum: collision.transferMomentum,
                                });
                            }
                        }
                        catch (e_20_1) { e_20 = { error: e_20_1 }; }
                        finally {
                            try {
                                if (group_1_1 && !group_1_1.done && (_c = group_1.return)) _c.call(group_1);
                            }
                            finally { if (e_20) throw e_20.error; }
                        }
                    }
                }
                catch (e_19_1) { e_19 = { error: e_19_1 }; }
                finally {
                    try {
                        if (move_1_1 && !move_1_1.done && (_b = move_1.return)) _b.call(move_1);
                    }
                    finally { if (e_19) throw e_19.error; }
                }
            }
        }
        catch (e_18_1) { e_18 = { error: e_18_1 }; }
        finally {
            try {
                if (_e && !_e.done && (_a = _d.return)) _a.call(_d);
            }
            finally { if (e_18) throw e_18.error; }
        }
    };
    World.prototype.hasWorldObject = function (obj) {
        if (_.isString(obj)) {
            return !!this.worldObjectsByName[obj];
        }
        return _.contains(this.worldObjects, obj);
    };
    World.prototype.removeWorldObject = function (obj) {
        if (!obj)
            return undefined;
        if (_.isString(obj)) {
            obj = this.getWorldObjectByName(obj);
            if (!obj)
                return;
        }
        if (obj.world !== this) {
            debug("Cannot remove object " + obj.name + " from world because it does not exist in the world. World:", this);
            return undefined;
        }
        return World.Actions.removeWorldObjectFromWorld(obj);
    };
    World.prototype.removeWorldObjects = function (objs) {
        var _this = this;
        if (_.isEmpty(objs))
            return [];
        return objs.map(function (obj) { return _this.removeWorldObject(obj); }).filter(function (obj) { return obj; });
    };
    World.prototype.runScript = function (script) {
        return this.scriptManager.runScript(script);
    };
    World.prototype.takeSnapshot = function () {
        var screen = new Texture(this.camera.width, this.camera.height);
        this.render(screen);
        return screen;
    };
    World.prototype.createLayers = function (layers) {
        var e_21, _a;
        if (_.isEmpty(layers))
            layers = [];
        layers.push({ name: World.DEFAULT_LAYER });
        var result = [];
        try {
            for (var layers_1 = __values(layers), layers_1_1 = layers_1.next(); !layers_1_1.done; layers_1_1 = layers_1.next()) {
                var layer = layers_1_1.value;
                _.defaults(layer, {
                    reverseSort: false,
                });
                result.push(new World.Layer(layer.name, layer, this.width, this.height));
            }
        }
        catch (e_21_1) { e_21 = { error: e_21_1 }; }
        finally {
            try {
                if (layers_1_1 && !layers_1_1.done && (_a = layers_1.return)) _a.call(layers_1);
            }
            finally { if (e_21) throw e_21.error; }
        }
        return result;
    };
    World.prototype.createPhysicsGroups = function (physicsGroups) {
        if (_.isEmpty(physicsGroups))
            return {};
        var result = {};
        for (var name_6 in physicsGroups) {
            _.defaults(physicsGroups[name_6], {
                collidesWith: [],
            });
            result[name_6] = new World.PhysicsGroup(name_6, physicsGroups[name_6]);
        }
        return result;
    };
    World.prototype.removeDeadWorldObjects = function () {
        this.removeWorldObjects(this.getDeadWorldObjects());
    };
    // For use with World.Actions.addWorldObjectToWorld
    World.prototype.internalAddWorldObjectToWorldWorld = function (obj) {
        this.worldObjects.push(obj);
        if (obj.name) {
            World.Actions.setName(obj, obj.name);
        }
        if (obj.layer) {
            World.Actions.setLayer(obj, obj.layer);
        }
        else {
            World.Actions.setLayer(obj, World.DEFAULT_LAYER);
        }
        if (obj instanceof PhysicsWorldObject && obj.physicsGroup) {
            World.Actions.setPhysicsGroup(obj, obj.physicsGroup);
        }
    };
    // For use with World.Actions.removeWorldObjectFromWorld
    World.prototype.internalRemoveWorldObjectFromWorldWorld = function (obj) {
        this.removeName(obj);
        this.removeFromAllLayers(obj);
        this.removeFromAllPhysicsGroups(obj);
        A.removeAll(this.worldObjects, obj);
    };
    // For use with World.Actions.setName
    World.prototype.internalSetNameWorld = function (obj, name) {
        this.removeName(obj);
        if (!_.isEmpty(name)) {
            this.worldObjectsByName[name] = obj;
        }
    };
    // For use with World.Actions.setLayer
    World.prototype.internalSetLayerWorld = function (obj, layerName) {
        var e_22, _a;
        this.removeFromAllLayers(obj);
        try {
            for (var _b = __values(this.layers), _c = _b.next(); !_c.done; _c = _b.next()) {
                var layer = _c.value;
                if (layer.name === layerName) {
                    layer.worldObjects.push(obj);
                    return;
                }
            }
        }
        catch (e_22_1) { e_22 = { error: e_22_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_22) throw e_22.error; }
        }
    };
    // For use with World.Actions.setPhysicsGroup
    World.prototype.internalSetPhysicsGroupWorld = function (obj, physicsGroupName) {
        this.removeFromAllPhysicsGroups(obj);
        if (!_.isEmpty(physicsGroupName)) {
            this.getPhysicsGroupByName(physicsGroupName).worldObjects.push(obj);
        }
    };
    // For use with World.Actions.addChildToParent
    World.prototype.internalAddChildToParentWorld = function (child, obj) {
        if (child.world !== this) {
            World.Actions.addWorldObjectToWorld(child, this);
        }
    };
    // For use with World.Actions.removeChildFromParent
    World.prototype.internalRemoveChildFromParentWorld = function (child) {
    };
    World.prototype.removeName = function (obj) {
        for (var name_7 in this.worldObjectsByName) {
            if (this.worldObjectsByName[name_7] === obj) {
                delete this.worldObjectsByName[name_7];
            }
        }
    };
    World.prototype.removeFromAllLayers = function (obj) {
        var e_23, _a;
        try {
            for (var _b = __values(this.layers), _c = _b.next(); !_c.done; _c = _b.next()) {
                var layer = _c.value;
                A.removeAll(layer.worldObjects, obj);
            }
        }
        catch (e_23_1) { e_23 = { error: e_23_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_23) throw e_23.error; }
        }
    };
    World.prototype.removeFromAllPhysicsGroups = function (obj) {
        for (var name_8 in this.physicsGroups) {
            A.removeAll(this.physicsGroups[name_8].worldObjects, obj);
        }
    };
    World.DEFAULT_LAYER = 'default';
    return World;
}());
(function (World) {
    var Layer = /** @class */ (function () {
        function Layer(name, config, width, height) {
            this.name = name;
            this.worldObjects = [];
            this.sortKey = config.sortKey;
            this.reverseSort = config.reverseSort;
            this.effects = new Effects(config.effects);
        }
        Layer.prototype.sort = function () {
            var _this = this;
            if (!this.sortKey)
                return;
            var r = this.reverseSort ? -1 : 1;
            this.worldObjects.sort(function (a, b) { return r * (a[_this.sortKey] - b[_this.sortKey]); });
        };
        return Layer;
    }());
    World.Layer = Layer;
    var PhysicsGroup = /** @class */ (function () {
        function PhysicsGroup(name, config) {
            this.name = name;
            this.worldObjects = [];
        }
        return PhysicsGroup;
    }());
    World.PhysicsGroup = PhysicsGroup;
    var Actions;
    (function (Actions) {
        /**
         * Adds a WorldObject to the world. Returns the object added.
         */
        function addWorldObjectToWorld(obj, world) {
            var e_24, _a;
            if (!obj || !world)
                return obj;
            if (obj.world) {
                debug("Cannot add object " + obj.name + " to world because it aleady exists in another world! You must remove object from previous world first. World:", world, 'Previous world:', obj.world);
                return undefined;
            }
            if (obj.name && world.hasWorldObject(obj.name)) {
                debug("Cannot add object " + obj.name + " to world because an object already exists with that name! World:", world);
                return undefined;
            }
            /// @ts-ignore
            obj.internalAddWorldObjectToWorldWorldObject(world);
            /// @ts-ignore
            world.internalAddWorldObjectToWorldWorld(obj);
            try {
                for (var _b = __values(obj.children), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var child = _c.value;
                    World.Actions.addWorldObjectToWorld(child, world);
                }
            }
            catch (e_24_1) { e_24 = { error: e_24_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_24) throw e_24.error; }
            }
            obj.onAdd();
            return obj;
        }
        Actions.addWorldObjectToWorld = addWorldObjectToWorld;
        /**
         * Adds a list of WorldObjects to a world. Returns as a list the objects added successfully.
         */
        function addWorldObjectsToWorld(objs, world) {
            if (_.isEmpty(objs))
                return [];
            return objs.filter(function (obj) { return addWorldObjectToWorld(obj, world); });
        }
        Actions.addWorldObjectsToWorld = addWorldObjectsToWorld;
        /**
         * Removes a WorldObject from its containing world. Returns the object removed.
         */
        function removeWorldObjectFromWorld(obj) {
            var e_25, _a;
            if (!obj)
                return obj;
            if (!obj.world) {
                debug("Tried to remove object " + obj.name + " from its containing world, but it does not belong to a world! Object:", obj);
                return obj;
            }
            var world = obj.world;
            obj.onRemove();
            /// @ts-ignore
            obj.internalRemoveWorldObjectFromWorldWorldObject(world);
            /// @ts-ignore
            world.internalRemoveWorldObjectFromWorldWorld(obj);
            try {
                for (var _b = __values(obj.children), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var child = _c.value;
                    World.Actions.removeWorldObjectFromWorld(child);
                }
            }
            catch (e_25_1) { e_25 = { error: e_25_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_25) throw e_25.error; }
            }
            if (obj.parent) {
                World.Actions.removeChildFromParent(obj);
            }
            return obj;
        }
        Actions.removeWorldObjectFromWorld = removeWorldObjectFromWorld;
        /**
         * Removes a list of WorldObjects from their containing worlds. Returns as a list the objects successfully removed.
         */
        function removeWorldObjectsFromWorld(objs) {
            if (_.isEmpty(objs))
                return [];
            return objs.filter(function (obj) { return removeWorldObjectFromWorld(obj); });
        }
        Actions.removeWorldObjectsFromWorld = removeWorldObjectsFromWorld;
        /**
         * Sets the name of a WorldObject. Returns the new name of the object.
         */
        function setName(obj, name) {
            if (!obj)
                return undefined;
            if (obj.world && obj.world.hasWorldObject(name)) {
                debug("Cannot name object '" + name + "' as that name already exists in world!", obj.world);
                return obj.name;
            }
            /// @ts-ignore
            obj.internalSetNameWorldObject(name);
            if (obj.world) {
                /// @ts-ignore
                obj.world.internalSetNameWorld(obj, name);
            }
            return obj.name;
        }
        Actions.setName = setName;
        /**
         * Sets the layer of a WorldObject. Returns the new layer name of the object.
         */
        function setLayer(obj, layerName) {
            if (!obj)
                return undefined;
            if (obj.world && !obj.world.getLayerByName(layerName)) {
                debug("Cannot set layer on object '" + obj.name + "' as no layer named " + layerName + " exists in world!", obj.world);
                return obj.layer;
            }
            /// @ts-ignore
            obj.internalSetLayerWorldObject(layerName);
            if (obj.world) {
                /// @ts-ignore
                obj.world.internalSetLayerWorld(obj, layerName);
            }
            return obj.layer;
        }
        Actions.setLayer = setLayer;
        /**
         * Sets the physics group of a WorldObject. Returns the new physics group name of the object.
         */
        function setPhysicsGroup(obj, physicsGroupName) {
            if (!obj)
                return undefined;
            if (obj.world && !_.isEmpty(physicsGroupName) && !obj.world.getPhysicsGroupByName(physicsGroupName)) {
                debug("Cannot set physicsGroup on object '" + obj.name + "' as no physicsGroup named " + physicsGroupName + " exists in world!", obj.world);
                return obj.physicsGroup;
            }
            /// @ts-ignore
            obj.internalSetPhysicsGroupWorldObject(physicsGroupName);
            if (obj.world) {
                /// @ts-ignore
                obj.world.internalSetPhysicsGroupWorld(obj, physicsGroupName);
            }
            return obj.physicsGroup;
        }
        Actions.setPhysicsGroup = setPhysicsGroup;
        /**
         * Adds a WorldObject as a child to a parent. Returns the child object if successful.
         */
        function addChildToParent(child, obj) {
            if (!child || !obj)
                return child;
            if (child.parent) {
                debug("Cannot add child " + child.name + " to parent " + obj.name + " becase the child is already the child of another parent!", child.parent);
                return undefined;
            }
            if (child.world && child.world !== obj.world) {
                debug("Cannot add child " + child.name + " to parent " + obj.name + " becase the child exists in a different world!", child.world);
                return undefined;
            }
            /// @ts-ignore
            child.internalAddChildToParentWorldObjectChild(obj);
            /// @ts-ignore
            obj.internalAddChildToParentWorldObjectParent(child);
            if (obj.world) {
                /// @ts-ignore
                obj.world.internalAddChildToParentWorld(child, obj);
            }
            return child;
        }
        Actions.addChildToParent = addChildToParent;
        /**
         * Adds a list of WorldObjects as children to a parent. Returns as a list the children successfully added.
         */
        function addChildrenToParent(children, obj) {
            if (_.isEmpty(children))
                return [];
            return children.filter(function (child) { return addChildToParent(child, obj); });
        }
        Actions.addChildrenToParent = addChildrenToParent;
        /**
         * Removes a child from its parent. Returns the child if successfully removed.
         */
        function removeChildFromParent(child) {
            if (!child)
                return child;
            if (!child.parent) {
                debug("Tried to remove child " + child.name + " from its parent, but its parent does not exist! Child:", child);
                return child;
            }
            /// @ts-ignore
            child.parent.internalRemoveChildFromParentWorldObjectParent(child);
            /// @ts-ignore
            child.internalRemoveChildFromParentWorldObjectChild();
            if (child.world) {
                /// @ts-ignore
                child.world.internalRemoveChildFromParentWorld(child);
            }
            return child;
        }
        Actions.removeChildFromParent = removeChildFromParent;
        /**
         * Removes a list of children from their parents. Returns as a list the children successfully removed.
         */
        function removeChildrenFromParent(children) {
            if (_.isEmpty(children))
                return [];
            // Protect against iterating against the same list you're removing from.
            if (children[0].parent && children === children[0].parent.children)
                children = A.clone(children);
            return children.filter(function (child) { return removeChildFromParent(child); });
        }
        Actions.removeChildrenFromParent = removeChildrenFromParent;
    })(Actions = World.Actions || (World.Actions = {}));
})(World || (World = {}));
(function (World) {
    var WorldAsWorldObject = /** @class */ (function (_super) {
        __extends(WorldAsWorldObject, _super);
        function WorldAsWorldObject(containedWorld) {
            var _this = this;
            var texture = new Texture(containedWorld.width, containedWorld.height);
            _this = _super.call(this, { texture: texture }) || this;
            _this.containedWorld = containedWorld;
            _this.worldTexture = texture;
            return _this;
        }
        WorldAsWorldObject.prototype.update = function (delta) {
            _super.prototype.update.call(this, delta);
            this.containedWorld.update(delta);
        };
        WorldAsWorldObject.prototype.render = function (screen) {
            this.worldTexture.clear();
            this.containedWorld.render(this.worldTexture);
            _super.prototype.render.call(this, screen);
        };
        return WorldAsWorldObject;
    }(Sprite));
    World.WorldAsWorldObject = WorldAsWorldObject;
})(World || (World = {}));
(function (World) {
    function fromConfig(config) {
        config = World.resolveConfig(config);
        var result = new config.constructor(config);
        if (result === config)
            result = new World(config); // Default constructor to World
        return result;
    }
    World.fromConfig = fromConfig;
    function resolveConfig(config) {
        var parents = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            parents[_i - 1] = arguments[_i];
        }
        var e_26, _a;
        var result = resolveConfigParent(config);
        if (_.isEmpty(parents))
            return result;
        try {
            for (var parents_2 = __values(parents), parents_2_1 = parents_2.next(); !parents_2_1.done; parents_2_1 = parents_2.next()) {
                var parent_2 = parents_2_1.value;
                result.parent = parent_2;
                result = resolveConfig(result);
            }
        }
        catch (e_26_1) { e_26 = { error: e_26_1 }; }
        finally {
            try {
                if (parents_2_1 && !parents_2_1.done && (_a = parents_2.return)) _a.call(parents_2);
            }
            finally { if (e_26) throw e_26.error; }
        }
        return result;
    }
    World.resolveConfig = resolveConfig;
    function resolveConfigParent(config) {
        if (!config.parent)
            return _.clone(config);
        var result = resolveConfig(config.parent);
        for (var key in config) {
            if (key === 'parent')
                continue;
            if (!result[key]) {
                result[key] = config[key];
            }
            else if (key === 'entryPoints') {
                result[key] = O.mergeObject(config[key], result[key]);
            }
            else if (key === 'worldObjects') {
                result[key] = A.mergeArray(config[key], result[key], function (e) { return e.name; }, function (e, into) {
                    e = resolveConfig(e);
                    e.parent = into;
                    return resolveConfig(e);
                });
            }
            else if (key === 'layers') {
                // merge layerconfig objects to add effects, for example
                result[key] = A.mergeArray(config[key], result[key], function (e) { return e.name; }, function (e, into) {
                    return O.mergeObject(e, into);
                });
            }
            else {
                result[key] = config[key];
            }
        }
        return result;
    }
})(World || (World = {}));
/// <reference path="./world.ts" />
var Menu = /** @class */ (function (_super) {
    __extends(Menu, _super);
    function Menu(menuSystem, config, items) {
        if (config === void 0) { config = {}; }
        var _this = _super.call(this, config) || this;
        _this.menuSystem = menuSystem;
        World.Actions.addWorldObjectsToWorld(items, _this);
        return _this;
    }
    return Menu;
}(World));
var SpriteText = /** @class */ (function (_super) {
    __extends(SpriteText, _super);
    function SpriteText(config) {
        var _this = _super.call(this, config) || this;
        _this.font = config.font;
        _this.style = _.defaults(config.style, {
            color: 0xFFFFFF,
            alpha: 1,
            offset: 0,
        });
        _this.setText(config.text);
        _this.fontTexture = AssetCache.getTexture(_this.font.texture);
        return _this;
    }
    SpriteText.prototype.render = function (screen) {
        var e_27, _a;
        var filters = this.mask ? [new TextureFilter.Mask({ type: TextureFilter.Mask.Type.GLOBAL, mask: this.mask })] : [];
        try {
            for (var _b = __values(this.chars), _c = _b.next(); !_c.done; _c = _b.next()) {
                var char = _c.value;
                screen.render(this.fontTexture, {
                    x: this.x + char.x,
                    y: this.y + char.y + O.getOrDefault(char.style.offset, this.style.offset),
                    tint: O.getOrDefault(char.style.color, this.style.color),
                    alpha: O.getOrDefault(char.style.alpha, this.style.alpha),
                    slice: {
                        x: SpriteText.charCodes[char.char].x * this.font.charWidth,
                        y: SpriteText.charCodes[char.char].y * this.font.charHeight,
                        width: this.font.charWidth,
                        height: this.font.charHeight
                    },
                    filters: filters,
                });
            }
        }
        catch (e_27_1) { e_27 = { error: e_27_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_27) throw e_27.error; }
        }
        _super.prototype.render.call(this, screen);
    };
    SpriteText.prototype.clear = function () {
        this.setText("");
    };
    SpriteText.prototype.getTextWidth = function () {
        return SpriteText.getWidthOfCharList(this.chars);
    };
    SpriteText.prototype.getTextHeight = function () {
        return SpriteText.getHeightOfCharList(this.chars);
    };
    SpriteText.prototype.getTextWorldBounds = function () {
        // TODO: adjust for alignment
        return { x: this.x, y: this.y, width: this.getTextWidth(), height: this.getTextHeight() };
    };
    SpriteText.prototype.setText = function (text) {
        this.chars = SpriteTextConverter.textToCharListWithWordWrap(text, this.font, 0);
    };
    return SpriteText;
}(WorldObject));
(function (SpriteText) {
    SpriteText.charCodes = getCharCodes();
    function getCharCodes() {
        var spriteFontCharList = [
            ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'],
            ['K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T'],
            ['U', 'V', 'W', 'X', 'Y', 'Z', 'a', 'b', 'c', 'd'],
            ['e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n'],
            ['o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x'],
            ['y', 'z', '0', '1', '2', '3', '4', '5', '6', '7'],
            ['8', '9', '!', '@', '#', '$', '%', '^', '&', '*'],
            ['(', ')', '-', '_', '=', '+', '{', '}', '[', ']'],
            ['\\', '|', ';', ':', "'", '"', ',', '.', '<', '>'],
            ['/', '?', '`', '~'],
        ];
        var result = {};
        for (var y = 0; y < spriteFontCharList.length; y++) {
            for (var x = 0; x < spriteFontCharList[y].length; x++) {
                result[spriteFontCharList[y][x]] = { x: x, y: y };
            }
        }
        result[' '] = { x: -1, y: -1 };
        return result;
    }
})(SpriteText || (SpriteText = {}));
(function (SpriteText) {
    var _a;
    var Character = /** @class */ (function () {
        function Character() {
        }
        Object.defineProperty(Character.prototype, "width", {
            get: function () {
                return this.font.charWidth;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Character.prototype, "height", {
            get: function () {
                return this.font.charHeight;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Character.prototype, "left", {
            get: function () {
                return this.x;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Character.prototype, "right", {
            get: function () {
                return this.x + this.width;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Character.prototype, "top", {
            get: function () {
                return this.y;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Character.prototype, "bottom", {
            get: function () {
                return this.y + this.height;
            },
            enumerable: true,
            configurable: true
        });
        return Character;
    }());
    SpriteText.Character = Character;
    function getWidthOfCharList(list) {
        if (_.isEmpty(list))
            return 0;
        return M.max(list, function (char) { return char.x + char.width; });
    }
    SpriteText.getWidthOfCharList = getWidthOfCharList;
    function getHeightOfCharList(list) {
        if (_.isEmpty(list))
            return 0;
        return M.max(list, function (char) { return char.y + char.height; });
    }
    SpriteText.getHeightOfCharList = getHeightOfCharList;
    SpriteText.NOOP_TAG = 'noop';
    SpriteText.DEFAULT_TAGS = (_a = {},
        _a[SpriteText.NOOP_TAG] = function (params) {
            return {};
        },
        _a['y'] = function (params) {
            return { color: 0xFFFF00 };
        },
        _a['o'] = function (params) {
            return { offset: getInt(params[0], 0) };
        },
        // can't define custom tags in Assets...
        _a['e'] = function (params) {
            return { color: 0x424242 };
        },
        _a);
    function getInt(text, def) {
        var result = parseInt(text);
        if (!isFinite(result))
            return def;
        return result;
    }
})(SpriteText || (SpriteText = {}));
/// <reference path="spriteText.ts" />
var MenuTextButton = /** @class */ (function (_super) {
    __extends(MenuTextButton, _super);
    function MenuTextButton(config) {
        var _this = _super.call(this, config) || this;
        _this.onClick = O.getOrDefault(config.onClick, function () { return null; });
        return _this;
    }
    MenuTextButton.prototype.update = function (delta) {
        _super.prototype.update.call(this, delta);
        if (this.isHovered()) {
            this.style.alpha = 0.5;
            if (Input.justDown('lmb')) {
                Input.consume('lmb');
                this.onClick();
            }
        }
        else {
            this.style.alpha = 1;
        }
    };
    MenuTextButton.prototype.isHovered = function () {
        return G.rectContainsPt(this.getTextWorldBounds(), this.world.getWorldMousePosition());
    };
    return MenuTextButton;
}(SpriteText));
var MenuSystem = /** @class */ (function () {
    function MenuSystem(game) {
        this.game = game;
        this.menuStack = [];
    }
    Object.defineProperty(MenuSystem.prototype, "currentMenu", {
        get: function () { return _.last(this.menuStack); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MenuSystem.prototype, "inMenu", {
        get: function () { return !!this.currentMenu; },
        enumerable: true,
        configurable: true
    });
    MenuSystem.prototype.update = function (delta) {
        if (this.inMenu) {
            this.currentMenu.update(delta);
        }
    };
    MenuSystem.prototype.render = function (screen) {
        if (this.inMenu) {
            this.currentMenu.render(screen);
        }
    };
    MenuSystem.prototype.back = function () {
        if (this.inMenu)
            this.menuStack.pop();
    };
    MenuSystem.prototype.clear = function () {
        this.menuStack = [];
    };
    MenuSystem.prototype.loadMenu = function (menuClass) {
        var instance = new menuClass(this);
        this.menuStack.push(instance);
    };
    return MenuSystem;
}());
var Monitor = /** @class */ (function () {
    function Monitor() {
        this.points = [];
    }
    Monitor.prototype.addPoint = function (point) {
        this.points.push(point);
    };
    Monitor.prototype.clear = function () {
        this.points = [];
    };
    Monitor.prototype.getAvg = function () {
        return A.sum(this.points) / this.points.length;
    };
    Monitor.prototype.getP = function (p) {
        var count = (p === 100) ? 1 : Math.ceil(this.points.length * (100 - p) / 100);
        var sum = 0;
        A.sort(this.points);
        for (var i = this.points.length - count; i < this.points.length; i++) {
            sum += this.points[i];
        }
        return sum / count;
    };
    Monitor.prototype.getQ = function (q) {
        var count = (q === 0) ? 1 : Math.ceil(this.points.length * q / 100);
        var sum = 0;
        A.sort(this.points);
        for (var i = 0; i < count; i++) {
            sum += this.points[i];
        }
        return sum / count;
    };
    return Monitor;
}());
var PartyManager = /** @class */ (function () {
    function PartyManager(theater, config) {
        this.theater = theater;
        this.leader = config.leader;
        this.activeMembers = new Set(config.activeMembers);
        this.members = config.members;
        this.load();
    }
    PartyManager.prototype.addMembersToWorld = function (world, stageName, entryPoint) {
        for (var memberName in this.members) {
            var member = this.members[memberName];
            if (this.isMemberActive(memberName)) {
                member.stage = stageName;
                member.worldObject.x = entryPoint.x;
                member.worldObject.y = entryPoint.y;
            }
            if (member.stage === stageName) {
                if (member.worldObject.world) {
                    World.Actions.removeWorldObjectFromWorld(member.worldObject);
                }
                World.Actions.addWorldObjectToWorld(member.worldObject, world);
            }
        }
    };
    PartyManager.prototype.getMember = function (name) {
        var member = this.members[name];
        if (!member) {
            debug("No party member named '" + name + "':", this);
        }
        return member;
    };
    PartyManager.prototype.isMemberActive = function (name) {
        return this.activeMembers.has(name);
    };
    Object.defineProperty(PartyManager.prototype, "leader", {
        get: function () {
            return this._leader;
        },
        set: function (name) {
            this._leader = name;
            for (var key in this.members) {
                if (this.members[key].worldObject) {
                    this.members[key].worldObject.controllable = (key === this.leader);
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    PartyManager.prototype.load = function () {
        for (var key in this.members) {
            var member = this.members[key];
            member.config = WorldObject.resolveConfig(member.config);
            member.worldObject = WorldObject.fromConfig(member.config);
            if (key === this.leader) {
                member.worldObject.controllable = true;
            }
        }
    };
    PartyManager.prototype.moveMemberToStage = function (memberName, stageName, x, y) {
        var member = this.getMember(memberName);
        if (!member)
            return;
        if (!stageName) {
            member.stage = null;
            return;
        }
        var stage = this.theater.stageManager.stages[stageName];
        if (!stage) {
            debug("Cannot move party member " + memberName + " to stage " + stageName + " because the stage does not exist");
            return;
        }
        member.stage = stageName;
        member.worldObject.x = x;
        member.worldObject.y = y;
    };
    PartyManager.prototype.setMemberActive = function (name) {
        if (!this.getMember(name))
            return;
        this.activeMembers.add(name);
    };
    PartyManager.prototype.setMemberInactive = function (name) {
        if (!this.getMember(name))
            return;
        this.activeMembers.delete(name);
    };
    return PartyManager;
}());
var Physics = /** @class */ (function () {
    function Physics() {
    }
    Physics.getCollision = function (obj, from) {
        var _a;
        var dx1 = obj.x - obj.preMovementX;
        var dy1 = obj.y - obj.preMovementY;
        var dx2 = from.x - from.preMovementX;
        var dy2 = from.y - from.preMovementY;
        var b1 = obj.getWorldBounds(obj.preMovementX, obj.preMovementY);
        var b2 = from.getWorldBounds(from.preMovementX, from.preMovementY);
        var topbot_t = Infinity;
        var bottop_t = Infinity;
        var leftright_t = Infinity;
        var rightleft_t = Infinity;
        if (dy1 !== dy2) {
            topbot_t = (b1.top - b2.bottom) / (dy2 - dy1);
            if (b1.right + dx1 * topbot_t <= b2.left + dx2 * topbot_t || b1.left + dx1 * topbot_t >= b2.right + dx2 * topbot_t) {
                topbot_t = Infinity;
            }
            bottop_t = (b1.bottom - b2.top) / (dy2 - dy1);
            if (b1.right + dx1 * bottop_t <= b2.left + dx2 * bottop_t || b1.left + dx1 * bottop_t >= b2.right + dx2 * bottop_t) {
                bottop_t = Infinity;
            }
        }
        if (dx1 !== dx2) {
            leftright_t = (b1.left - b2.right) / (dx2 - dx1);
            if (b1.bottom + dy1 * leftright_t <= b2.top + dy2 * leftright_t || b1.top + dy1 * leftright_t >= b2.bottom + dy2 * leftright_t) {
                leftright_t = Infinity;
            }
            rightleft_t = (b1.right - b2.left) / (dx2 - dx1);
            if (b1.bottom + dy1 * rightleft_t <= b2.top + dy2 * rightleft_t || b1.top + dy1 * rightleft_t >= b2.bottom + dy2 * rightleft_t) {
                rightleft_t = Infinity;
            }
        }
        var min_t = Math.min(topbot_t, bottop_t, leftright_t, rightleft_t);
        var direction = (_a = {},
            _a[topbot_t] = Physics.Collision.Direction.UP,
            _a[bottop_t] = Physics.Collision.Direction.DOWN,
            _a[leftright_t] = Physics.Collision.Direction.LEFT,
            _a[rightleft_t] = Physics.Collision.Direction.RIGHT,
            _a)[min_t];
        var result = new Physics.Collision();
        result.move = obj;
        result.from = from;
        result.t = min_t;
        result.direction = direction;
        if (!result.isVertical && !result.isHorizontal) {
            debug('collision was neither vertical nor horizontal:', result);
        }
        return result;
    };
    Physics.collide = function (obj, from, options) {
        if (options === void 0) { options = {}; }
        var e_28, _a;
        if (_.isEmpty(from))
            return;
        if (!obj.colliding)
            return;
        _.defaults(options, {
            callback: false,
            transferMomentum: true,
            maxIters: Physics.MAX_ITERS,
        });
        var startX = obj.x;
        var startY = obj.y;
        var collidingWith = from.filter(function (other) { return obj !== other && other.colliding && obj.isOverlapping(other); });
        var iters = 0;
        while (!_.isEmpty(collidingWith) && iters < options.maxIters) {
            var collisions = collidingWith.map(function (other) { return Physics.getCollision(obj, other); });
            collisions.sort(function (a, b) { return a.t - b.t; });
            try {
                for (var collisions_1 = __values(collisions), collisions_1_1 = collisions_1.next(); !collisions_1_1.done; collisions_1_1 = collisions_1.next()) {
                    var collision = collisions_1_1.value;
                    var d = Physics.separate(collision);
                    if (d !== 0 && options.transferMomentum) {
                        Physics.transferMomentum(collision);
                    }
                    if (options.callback) {
                        if (_.isFunction(options.callback)) {
                            options.callback(collision.move, collision.from);
                        }
                        else {
                            collision.move.onCollide(collision.from);
                            collision.from.onCollide(collision.move);
                        }
                    }
                }
            }
            catch (e_28_1) { e_28 = { error: e_28_1 }; }
            finally {
                try {
                    if (collisions_1_1 && !collisions_1_1.done && (_a = collisions_1.return)) _a.call(collisions_1);
                }
                finally { if (e_28) throw e_28.error; }
            }
            collidingWith = collidingWith.filter(function (other) { return obj.isOverlapping(other); });
            iters++;
        }
        return { x: obj.x - startX, y: obj.y - startY };
    };
    Physics.separate = function (collision, skipSeparation) {
        if (skipSeparation === void 0) { skipSeparation = false; }
        if (collision.isVertical) {
            return this.separateFromY(collision.move, collision.from, skipSeparation);
        }
        if (collision.isHorizontal) {
            return this.separateFromX(collision.move, collision.from, skipSeparation);
        }
        return 0;
    };
    Physics.separateFromX = function (obj, from, skipSeparation) {
        if (skipSeparation === void 0) { skipSeparation = false; }
        var objBounds = obj.getWorldBounds();
        var fromBounds = from.getWorldBounds();
        if (!G.overlapRectangles(objBounds, fromBounds)) {
            return 0;
        }
        var leftdx = fromBounds.right - objBounds.left;
        var rightdx = fromBounds.left - objBounds.right;
        var relativedx = (obj.x - obj.preMovementX) - (from.x - from.preMovementX);
        var dx = 0;
        if (relativedx < 0) {
            dx = leftdx;
        }
        else if (relativedx > 0) {
            dx = rightdx;
        }
        else {
            if (Math.abs(rightdx) < Math.abs(leftdx)) {
                dx = rightdx;
            }
            else {
                dx = leftdx;
            }
        }
        if (!skipSeparation) {
            obj.x += dx;
        }
        return dx;
    };
    Physics.separateFromY = function (obj, from, skipSeparation) {
        if (skipSeparation === void 0) { skipSeparation = false; }
        var objBounds = obj.getWorldBounds();
        var fromBounds = from.getWorldBounds();
        if (!G.overlapRectangles(objBounds, fromBounds)) {
            return 0;
        }
        var updy = fromBounds.bottom - objBounds.top;
        var downdy = fromBounds.top - objBounds.bottom;
        var relativedy = (obj.y - obj.preMovementY) - (from.y - from.preMovementY);
        var dy = 0;
        if (relativedy < 0) {
            dy = updy;
        }
        else if (relativedy > 0) {
            dy = downdy;
        }
        else {
            if (Math.abs(downdy) < Math.abs(updy)) {
                dy = downdy;
            }
            else {
                dy = updy;
            }
        }
        if (!skipSeparation) {
            obj.y += dy;
        }
        return dy;
    };
    Physics.transferMomentum = function (collision) {
        if (collision.isVertical) {
            return this.transferMomentumY(collision.move, collision.from);
        }
        if (collision.isHorizontal) {
            return this.transferMomentumX(collision.move, collision.from);
        }
    };
    Physics.transferMomentumWithProperty = function (property, obj1, obj2) {
        var v1i = obj1[property];
        var v2i = obj2[property];
        var m1 = obj1.mass;
        var m2 = obj2.mass;
        if (m1 === 0 && m2 === 0) {
            m1 = 1;
            m2 = 1;
        }
        var v1f = -v1i;
        if (!obj2.immovable) {
            v1f = 2 * m2 / (m1 + m2) * (v2i - v1i) + v1i;
        }
        if (!obj1.immovable) {
            obj1[property] = v1f * obj1.bounce;
        }
        var v2f = -v2i;
        if (!obj1.immovable) {
            v2f = 2 * m1 / (m1 + m2) * (v1i - v2i) + v2i;
        }
        if (!obj2.immovable) {
            obj2[property] = v2f * obj2.bounce;
        }
    };
    Physics.transferMomentumX = function (obj1, obj2) {
        return this.transferMomentumWithProperty('vx', obj1, obj2);
    };
    Physics.transferMomentumY = function (obj1, obj2) {
        return this.transferMomentumWithProperty('vy', obj1, obj2);
    };
    return Physics;
}());
(function (Physics) {
    Physics.MAX_ITERS = 10;
    var Collision = /** @class */ (function () {
        function Collision() {
        }
        Object.defineProperty(Collision.prototype, "isVertical", {
            get: function () {
                return this.direction === Collision.Direction.UP || this.direction === Collision.Direction.DOWN;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Collision.prototype, "isHorizontal", {
            get: function () {
                return this.direction === Collision.Direction.LEFT || this.direction === Collision.Direction.RIGHT;
            },
            enumerable: true,
            configurable: true
        });
        Collision.prototype.getOther = function (orig) {
            return this.move !== orig ? this.move : this.from;
        };
        return Collision;
    }());
    Physics.Collision = Collision;
    (function (Collision) {
        var Direction;
        (function (Direction) {
            Direction[Direction["LEFT"] = 0] = "LEFT";
            Direction[Direction["RIGHT"] = 1] = "RIGHT";
            Direction[Direction["UP"] = 2] = "UP";
            Direction[Direction["DOWN"] = 3] = "DOWN";
        })(Direction = Collision.Direction || (Collision.Direction = {}));
    })(Collision = Physics.Collision || (Physics.Collision = {}));
})(Physics || (Physics = {}));
/// <reference path="textureFilter.ts"/>
var Texture = /** @class */ (function () {
    function Texture(width, height, immutable) {
        if (immutable === void 0) { immutable = false; }
        this.renderTextureSprite = new Texture.PIXIRenderTextureSprite(width, height);
        this.anchorX = 0;
        this.anchorY = 0;
        this.immutable = immutable;
    }
    Object.defineProperty(Texture.prototype, "width", {
        get: function () { return this.renderTextureSprite.width; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Texture.prototype, "height", {
        get: function () { return this.renderTextureSprite.height; },
        enumerable: true,
        configurable: true
    });
    Texture.prototype.clear = function () {
        if (this.immutable) {
            debug('Cannot clear immutable texture!');
            return;
        }
        this.renderTextureSprite.clear();
    };
    Texture.prototype.clone = function () {
        var result = new Texture(this.width, this.height);
        result.render(this, { x: this.anchorX * this.width, y: this.anchorY * this.height });
        result.anchorX = this.anchorX;
        result.anchorY = this.anchorY;
        return result;
    };
    Texture.prototype.free = function () {
        this.renderTextureSprite.renderTexture.destroy(true);
    };
    Texture.prototype.render = function (texture, properties) {
        if (!texture)
            return;
        if (this.immutable) {
            debug('Cannot render to immutable texture!');
            return;
        }
        this.setRenderTextureSpriteProperties(texture, properties);
        this.renderDisplayObject(texture.renderTextureSprite);
    };
    Texture.prototype.renderDisplayObject = function (displayObject) {
        if (this.immutable) {
            debug('Cannot render to immutable texture!');
            return;
        }
        global.renderer.render(displayObject, this.renderTextureSprite.renderTexture, false);
    };
    Texture.prototype.toMaskTexture = function () {
        return this.renderTextureSprite.renderTexture;
    };
    Texture.prototype.setRenderTextureSpriteProperties = function (texture, properties) {
        var _this = this;
        if (!properties)
            properties = {};
        _.defaults(properties, {
            x: 0,
            y: 0,
            scaleX: 1,
            scaleY: 1,
            angle: 0,
            tint: 0xFFFFFF,
            alpha: 1,
            slice: undefined,
            filters: [],
        });
        var sliceRect = properties.slice || { x: 0, y: 0, width: texture.width, height: texture.height };
        // Position
        var afterSliceX = properties.x + texture.anchorX * texture.width - (sliceRect.x + texture.anchorX * sliceRect.width);
        var afterSliceY = properties.y + texture.anchorY * texture.height - (sliceRect.y + texture.anchorY * sliceRect.height);
        texture.renderTextureSprite.x = afterSliceX;
        texture.renderTextureSprite.y = afterSliceY;
        // Other values
        texture.renderTextureSprite.scale.x = properties.scaleX;
        texture.renderTextureSprite.scale.y = properties.scaleY;
        texture.renderTextureSprite.angle = properties.angle;
        texture.renderTextureSprite.tint = properties.tint;
        texture.renderTextureSprite.alpha = properties.alpha;
        // Filter values
        var allFilters = [];
        if (properties.slice) {
            var sliceFilterPosX = texture.renderTextureSprite.x - texture.anchorX * sliceRect.width;
            var sliceFilterPosY = texture.renderTextureSprite.y - texture.anchorY * sliceRect.height;
            var sliceFilter = TextureFilter.SLICE(properties.slice);
            Texture.setFilterProperties(sliceFilter, this.width, this.height, sliceFilterPosX, sliceFilterPosY);
            allFilters.push(sliceFilter);
        }
        var filterPosX = properties.x - texture.anchorX * sliceRect.width;
        var filterPosY = properties.y - texture.anchorY * sliceRect.height;
        properties.filters.forEach(function (filter) { return filter && Texture.setFilterProperties(filter, _this.width, _this.height, filterPosX, filterPosY); });
        allFilters.push.apply(allFilters, __spread(properties.filters));
        texture.renderTextureSprite.filters = allFilters.filter(function (filter) { return filter && filter.enabled; }).map(function (filter) { return filter.getPixiFilter(); });
        texture.renderTextureSprite.filterArea = new PIXI.Rectangle(0, 0, this.width, this.height);
        // Anchor
        texture.renderTextureSprite.anchor.x = texture.anchorX;
        texture.renderTextureSprite.anchor.y = texture.anchorY;
    };
    Texture.setFilterProperties = function (filter, width, height, posx, posy) {
        filter.setDimensions(width, height);
        filter.setTexturePosition(posx, posy);
        filter.setPixiUniforms();
    };
    return Texture;
}());
(function (Texture) {
    function filledRect(width, height, fillColor, fillAlpha) {
        if (fillAlpha === void 0) { fillAlpha = 1; }
        var result = new Texture(width, height);
        Draw.fill(result, { color: fillColor, alpha: fillAlpha, thickness: 0 });
        return result;
    }
    Texture.filledRect = filledRect;
    function fromPixiTexture(pixiTexture) {
        var sprite = new PIXI.Sprite(pixiTexture);
        var texture = new Texture(pixiTexture.width, pixiTexture.height);
        texture.anchorX = pixiTexture.defaultAnchor.x;
        texture.anchorY = pixiTexture.defaultAnchor.y;
        sprite.x = texture.anchorX * texture.width;
        sprite.y = texture.anchorY * texture.height;
        texture.renderDisplayObject(sprite);
        texture.immutable = true;
        return texture;
    }
    Texture.fromPixiTexture = fromPixiTexture;
    function none() {
        return new Texture(0, 0);
    }
    Texture.none = none;
    var PIXIRenderTextureSprite = /** @class */ (function (_super) {
        __extends(PIXIRenderTextureSprite, _super);
        function PIXIRenderTextureSprite(width, height) {
            var _this = this;
            var renderTexture = PIXI.RenderTexture.create({ width: width, height: height });
            _this = _super.call(this, renderTexture) || this;
            _this._renderTexture = renderTexture;
            return _this;
        }
        Object.defineProperty(PIXIRenderTextureSprite.prototype, "renderTexture", {
            get: function () { return this._renderTexture; },
            enumerable: true,
            configurable: true
        });
        PIXIRenderTextureSprite.prototype.clear = function () {
            global.renderer.render(Utils.NOOP_DISPLAYOBJECT, this._renderTexture, true);
        };
        PIXIRenderTextureSprite.prototype.resize = function (width, height) {
            this._renderTexture.resize(width, height);
        };
        return PIXIRenderTextureSprite;
    }(PIXI.Sprite));
    Texture.PIXIRenderTextureSprite = PIXIRenderTextureSprite;
})(Texture || (Texture = {}));
/// <reference path="texture.ts"/>
var Preload = /** @class */ (function () {
    function Preload() {
    }
    Preload.preload = function (options) {
        var _this = this;
        if (options.textures) {
            for (var key in options.textures) {
                this.preloadTexture(key, options.textures[key]);
            }
        }
        if (options.pyxelTilemaps) {
            for (var key in options.pyxelTilemaps) {
                this.preloadPyxelTilemap(key, options.pyxelTilemaps[key]);
            }
        }
        PIXI.Loader.shared.load(function () { return _this.load(options); });
    };
    Preload.load = function (options) {
        if (options.textures) {
            for (var key in options.textures) {
                this.loadTexture(key, options.textures[key]);
            }
        }
        if (options.pyxelTilemaps) {
            for (var key in options.pyxelTilemaps) {
                this.loadPyxelTilemap(key, options.pyxelTilemaps[key]);
            }
        }
        if (options.onLoad) {
            options.onLoad();
        }
    };
    Preload.preloadTexture = function (key, texture) {
        var url = texture.url || "assets/" + key + ".png";
        PIXI.Loader.shared.add(key, url);
    };
    Preload.loadTexture = function (key, texture) {
        var baseTexture = PIXI.utils.TextureCache[key];
        var mainTexture = new PIXI.Texture(baseTexture);
        var rect = texture.rect;
        var anchor = texture.anchor;
        if (rect) {
            mainTexture.frame = new Rectangle(rect.x, rect.y, rect.width, rect.height);
        }
        if (anchor) {
            mainTexture.defaultAnchor = new Point(anchor.x, anchor.y);
        }
        AssetCache.pixiTextures[key] = mainTexture;
        AssetCache.textures[key] = Texture.fromPixiTexture(mainTexture);
        var frames = {};
        if (texture.spritesheet) {
            var numFramesX = Math.floor(baseTexture.width / texture.spritesheet.frameWidth);
            var numFramesY = Math.floor(baseTexture.height / texture.spritesheet.frameHeight);
            for (var y = 0; y < numFramesY; y++) {
                for (var x = 0; x < numFramesX; x++) {
                    var frameKeyPrefix = O.getOrDefault(texture.spritesheet.prefix, key + "_");
                    var frameKey = "" + frameKeyPrefix + (x + y * numFramesX);
                    frames[frameKey] = {
                        rect: {
                            x: x * texture.spritesheet.frameWidth,
                            y: y * texture.spritesheet.frameHeight,
                            width: texture.spritesheet.frameWidth,
                            height: texture.spritesheet.frameHeight
                        },
                        anchor: texture.spritesheet.anchor,
                    };
                }
            }
        }
        if (texture.frames) {
            for (var frame in texture.frames) {
                frames[frame] = texture.frames[frame];
            }
        }
        for (var frame in frames) {
            var frameTexture = new PIXI.Texture(baseTexture);
            var rect_1 = frames[frame].rect || texture.rect;
            var anchor_1 = frames[frame].anchor || texture.defaultAnchor;
            if (rect_1) {
                frameTexture.frame = new Rectangle(rect_1.x, rect_1.y, rect_1.width, rect_1.height);
            }
            if (anchor_1) {
                frameTexture.defaultAnchor = new Point(anchor_1.x, anchor_1.y);
            }
            AssetCache.pixiTextures[frame] = frameTexture;
            AssetCache.textures[frame] = Texture.fromPixiTexture(frameTexture);
        }
    };
    Preload.preloadPyxelTilemap = function (key, tilemap) {
        var url = tilemap.url || "assets/" + key + ".json";
        PIXI.Loader.shared.add(key + this.TILEMAP_KEY_SUFFIX, url);
    };
    Preload.loadPyxelTilemap = function (key, tilemap) {
        var e_29, _a;
        var tilemapJson = PIXI.Loader.shared.resources[key + this.TILEMAP_KEY_SUFFIX].data;
        var tilemapForCache = {
            tileset: tilemap.tileset,
            layers: [],
        };
        for (var i = 0; i < tilemapJson.layers.length; i++) {
            var tilemapLayer = A.filledArray2D(tilemapJson.tileshigh, tilemapJson.tileswide);
            try {
                for (var _b = __values(tilemapJson.layers[i].tiles), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var tile = _c.value;
                    tilemapLayer[tile.y][tile.x] = {
                        index: Math.max(tile.tile, -1),
                    };
                }
            }
            catch (e_29_1) { e_29 = { error: e_29_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_29) throw e_29.error; }
            }
            tilemapForCache.layers.push(tilemapLayer);
        }
        AssetCache.tilemaps[key] = tilemapForCache;
    };
    Preload.TILEMAP_KEY_SUFFIX = '_tilemap_';
    return Preload;
}());
(function (Preload) {
    function allTilesWithPrefix(prefix, count) {
        if (count === void 0) { count = 100; }
        var result = [];
        for (var i = 0; i < count; i++) {
            result.push("" + prefix + i);
        }
        return result;
    }
    Preload.allTilesWithPrefix = allTilesWithPrefix;
})(Preload || (Preload = {}));
var Script = /** @class */ (function () {
    function Script(scriptFunction) {
        this.iterator = scriptFunction();
        this.data = {};
    }
    Object.defineProperty(Script.prototype, "running", {
        get: function () {
            return !this.paused && !this.done;
        },
        enumerable: true,
        configurable: true
    });
    Script.prototype.update = function (delta) {
        if (!this.running)
            return;
        global.pushScript(this);
        this.delta = delta;
        var result = this.iterator.next();
        if (result.done) {
            this.done = true;
        }
        global.popScript();
    };
    Script.prototype.finishImmediately = function (maxIters) {
        if (maxIters === void 0) { maxIters = Script.FINISH_IMMEDIATELY_MAX_ITERS; }
        for (var i = 0; i < maxIters && !this.done; i++) {
            this.update(0.01);
        }
        this.done = true;
    };
    Script.FINISH_IMMEDIATELY_MAX_ITERS = 1000000;
    return Script;
}());
var ScriptManager = /** @class */ (function () {
    function ScriptManager() {
        this.activeScripts = [];
    }
    ScriptManager.prototype.update = function (delta) {
        for (var i = this.activeScripts.length - 1; i >= 0; i--) {
            this.activeScripts[i].update(delta);
            if (this.activeScripts[i].done) {
                this.activeScripts.splice(i, 1);
            }
        }
    };
    ScriptManager.prototype.reset = function () {
        this.activeScripts = [];
    };
    ScriptManager.prototype.runScript = function (script) {
        if (script instanceof Script) {
            if (script.done)
                return;
        }
        else {
            script = new Script(script);
        }
        this.activeScripts.push(script);
        return script;
    };
    return ScriptManager;
}());
var Slide = /** @class */ (function (_super) {
    __extends(Slide, _super);
    function Slide(config) {
        var _this = _super.call(this, config, {
            x: global.gameWidth / 2,
            y: global.gameHeight / 2,
        }) || this;
        _this.timer = new Timer(O.getOrDefault(config.timeToLoad, 0));
        if (config.fadeIn) {
            _this.targetAlpha = _this.alpha;
            _this.alpha = 0;
        }
        _this.fullyLoaded = false;
        return _this;
    }
    Slide.prototype.update = function (delta) {
        _super.prototype.update.call(this, delta);
        if (this.fullyLoaded)
            return;
        this.timer.update(delta);
        if (this.targetAlpha !== undefined) {
            this.alpha = this.targetAlpha * this.timer.progress;
        }
        if (this.timer.done) {
            this.fullyLoaded = true;
        }
    };
    Slide.prototype.finishLoading = function () {
        this.timer.finish();
    };
    return Slide;
}(Sprite));
var SlideManager = /** @class */ (function () {
    function SlideManager(theater) {
        this.theater = theater;
        this.slides = [];
    }
    SlideManager.prototype.addSlideByConfig = function (config) {
        var slide = new Slide(config);
        World.Actions.setLayer(slide, Theater.LAYER_SLIDES);
        World.Actions.addWorldObjectToWorld(slide, this.theater);
        this.slides.push(slide);
        return slide;
    };
    SlideManager.prototype.clearSlides = function (exceptLast) {
        if (exceptLast === void 0) { exceptLast = 0; }
        var deleteCount = this.slides.length - exceptLast;
        for (var i = 0; i < deleteCount; i++) {
            World.Actions.removeWorldObjectFromWorld(this.slides[i]);
        }
        this.slides.splice(0, deleteCount);
    };
    return SlideManager;
}());
var SpriteTextConverter = /** @class */ (function () {
    function SpriteTextConverter() {
    }
    SpriteTextConverter.textToCharListWithWordWrap = function (text, font, maxWidth) {
        if (!text)
            return [];
        var result = [];
        var word = [];
        var nextCharPosition = { x: 0, y: 0 };
        var styleStack = [];
        for (var i = 0; i < text.length; i++) {
            if (text[i] === ' ') {
                this.pushWord(word, result, nextCharPosition, maxWidth);
                nextCharPosition.x += font.spaceWidth;
            }
            else if (text[i] === '\n') {
                this.pushWord(word, result, nextCharPosition, maxWidth);
                nextCharPosition.x = 0;
                // TODO: properly newline
                nextCharPosition.y += font.newlineHeight; //SpriteText.getHeightOfCharList(result);
            }
            else if (text[i] === '[') {
                var closingBracketIndex = text.indexOf(']', i);
                if (closingBracketIndex < i + 1) {
                    debug("Text '" + text + "' has an unclosed tag bracket.");
                    continue;
                }
                var parts = this.parseTag(text.substring(i + 1, closingBracketIndex));
                if (parts[0].startsWith('/')) {
                    if (!_.isEmpty(styleStack)) {
                        styleStack.pop();
                    }
                }
                else {
                    var tag = parts.shift();
                    var newStyle = this.getStyleFromTag(tag, parts);
                    styleStack.push(newStyle);
                }
                i = closingBracketIndex;
            }
            else {
                if (text[i] === '\\' && i < text.length - 1)
                    i++;
                var style = this.getFullStyleFromStack(styleStack);
                var char = this.createCharacter(text[i], nextCharPosition.x, nextCharPosition.y, font, style);
                word.push(char);
                nextCharPosition.x += char.width;
            }
        }
        this.pushWord(word, result, nextCharPosition, maxWidth);
        return result;
    };
    SpriteTextConverter.createCharacter = function (char, x, y, font, style) {
        var character = new SpriteText.Character();
        character.char = char;
        character.x = x;
        character.y = y;
        character.font = font;
        character.style = style;
        return character;
    };
    SpriteTextConverter.getFullStyleFromStack = function (styleStack) {
        return _.extend.apply(_, __spread([{}], styleStack));
    };
    SpriteTextConverter.getStyleFromTag = function (tag, params) {
        var tagFunction = SpriteText.DEFAULT_TAGS[tag] || SpriteText.DEFAULT_TAGS[SpriteText.NOOP_TAG];
        return tagFunction(params);
    };
    SpriteTextConverter.parseTag = function (tag) {
        var result = St.splitOnWhitespace(tag);
        if (_.isEmpty(result)) {
            debug("Tag " + tag + " must have the tag part specified.");
            return [SpriteText.NOOP_TAG];
        }
        return result;
    };
    SpriteTextConverter.pushWord = function (word, result, position, maxWidth) {
        var e_30, _a;
        if (_.isEmpty(word))
            return;
        var lastChar = _.last(word);
        if (maxWidth > 0 && lastChar.right > maxWidth) {
            var diffx = word[0].x;
            var diffy = word[0].y - SpriteText.getHeightOfCharList(result);
            try {
                for (var word_1 = __values(word), word_1_1 = word_1.next(); !word_1_1.done; word_1_1 = word_1.next()) {
                    var char = word_1_1.value;
                    char.x -= diffx;
                    char.y -= diffy;
                }
            }
            catch (e_30_1) { e_30 = { error: e_30_1 }; }
            finally {
                try {
                    if (word_1_1 && !word_1_1.done && (_a = word_1.return)) _a.call(word_1);
                }
                finally { if (e_30) throw e_30.error; }
            }
            position.x -= diffx;
            position.y -= diffy;
        }
        while (word.length > 0) {
            result.push(word.shift());
        }
        return;
    };
    return SpriteTextConverter;
}());
var StageManager = /** @class */ (function () {
    function StageManager(theater, stages) {
        this.theater = theater;
        this.stages = stages;
        this.currentStageName = null;
        this.currentWorld = null;
        this.currentWorldAsWorldObject = null;
        this.stageLoadQueue = null;
    }
    Object.defineProperty(StageManager.prototype, "transitioning", {
        get: function () { return !!this.transition; },
        enumerable: true,
        configurable: true
    });
    StageManager.prototype.loadStage = function (name, transitionConfig, entryPoint) {
        if (!this.stages[name]) {
            debug("Cannot load world '" + name + "' because it does not exist:", this.stages);
            return;
        }
        if (!entryPoint)
            entryPoint = { x: this.theater.width / 2, y: this.theater.height / 2 };
        if (!this.currentStageName) {
            if (transitionConfig.type !== 'instant')
                debug("Ignoring transition " + transitionConfig.type + " for world " + name + " because no other world is loaded");
            this.setStage(name, entryPoint);
            return;
        }
        this.stageLoadQueue = { name: name, transitionConfig: transitionConfig, entryPoint: entryPoint };
    };
    StageManager.prototype.loadStageIfQueued = function () {
        if (!this.stageLoadQueue)
            return;
        var name = this.stageLoadQueue.name;
        var transitionConfig = this.stageLoadQueue.transitionConfig;
        var entryPoint = this.stageLoadQueue.entryPoint;
        this.stageLoadQueue = null;
        var oldWorld = this.currentWorld;
        var oldSnapshot = oldWorld.takeSnapshot();
        this.setStage(name, entryPoint);
        this.currentWorld.update(0);
        var newSnapshot = this.currentWorld.takeSnapshot();
        this.currentWorldAsWorldObject.active = false;
        this.currentWorldAsWorldObject.visible = false;
        // this is outside the script to avoid 1-frame flicker
        this.transition = Transition.fromConfigAndSnapshots(transitionConfig, oldSnapshot, newSnapshot);
        World.Actions.setLayer(this.transition, Theater.LAYER_TRANSITION);
        World.Actions.addWorldObjectToWorld(this.transition, this.theater);
        var stageManager = this;
        this.theater.runScript(function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!!stageManager.transition.done) return [3 /*break*/, 2];
                        return [4 /*yield*/];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 0];
                    case 2:
                        World.Actions.removeWorldObjectFromWorld(stageManager.transition);
                        stageManager.transition = null;
                        stageManager.currentWorldAsWorldObject.active = true;
                        stageManager.currentWorldAsWorldObject.visible = true;
                        return [2 /*return*/];
                }
            });
        });
    };
    StageManager.prototype.setStage = function (name, entryPoint) {
        // Remove old stuff
        if (this.currentWorld) {
            World.Actions.removeWorldObjectFromWorld(this.currentWorldAsWorldObject);
        }
        this.theater.interactionManager.reset();
        // Create new stuff
        this.currentStageName = name;
        this.currentWorld = World.fromConfig(this.stages[name]);
        this.currentWorldAsWorldObject = new World.WorldAsWorldObject(this.currentWorld);
        this.addPartyToWorld(this.currentWorld, name, entryPoint);
        World.Actions.setLayer(this.currentWorldAsWorldObject, Theater.LAYER_WORLD);
        World.Actions.addWorldObjectToWorld(this.currentWorldAsWorldObject, this.theater);
        this.theater.onStageLoad();
    };
    StageManager.prototype.addPartyToWorld = function (world, stageName, entryPoint) {
        // Resolve entry point.
        if (_.isString(entryPoint)) {
            entryPoint = world.getEntryPoint(entryPoint);
        }
        this.theater.partyManager.addMembersToWorld(world, stageName, entryPoint);
    };
    return StageManager;
}());
var StateMachine = /** @class */ (function () {
    function StateMachine() {
        this.states = {};
    }
    StateMachine.prototype.addState = function (name, state) {
        this.states[name] = state;
    };
    StateMachine.prototype.setState = function (name) {
        var _this = this;
        if (this.script)
            this.script.done = true;
        var state = this.getState(name);
        if (!state)
            return;
        this.currentState = state;
        if (state.callback)
            state.callback();
        var stateScript = O.getOrDefault(state.script, S.noop());
        this.script = new Script(S.chain(stateScript, S.loopFor(Infinity, S.chain(S.call(function () {
            var transition = _this.getValidTransition(_this.currentState);
            if (transition) {
                _this.setState(transition.toState);
            }
        }), S.yield()))));
    };
    StateMachine.prototype.update = function (delta) {
        if (this.script)
            this.script.update(delta);
    };
    StateMachine.prototype.getCurrentStateName = function () {
        for (var name_9 in this.states) {
            if (this.states[name_9] === this.currentState) {
                return name_9;
            }
        }
        return undefined;
    };
    StateMachine.prototype.getState = function (name) {
        if (!this.states[name]) {
            debug("No state named " + name + " exists on state machine", this);
        }
        return this.states[name];
    };
    StateMachine.prototype.getValidTransition = function (state) {
        var e_31, _a;
        try {
            for (var _b = __values(state.transitions || []), _c = _b.next(); !_c.done; _c = _b.next()) {
                var transition = _c.value;
                if (transition.type === 'instant')
                    return transition;
                else
                    debug("Invalid transition type " + transition.type + " for transition", transition);
            }
        }
        catch (e_31_1) { e_31 = { error: e_31_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_31) throw e_31.error; }
        }
        return undefined;
    };
    return StateMachine;
}());
var StoryConfig = /** @class */ (function () {
    function StoryConfig(theater, config) {
        this.theater = theater;
        this.config = O.deepClone(config.initialConfig);
        this.executeFn = config.executeFn;
    }
    StoryConfig.prototype.execute = function () {
        this.executeFn(this);
    };
    StoryConfig.prototype.updateConfig = function (config) {
        O.deepOverride(this.config, config);
        for (var key in config) {
            if (this.config[key] === undefined) {
                this.config[key] = config[key];
            }
        }
    };
    return StoryConfig;
}());
var StoryEventManager = /** @class */ (function () {
    function StoryEventManager(theater, storyEvents) {
        this.theater = theater;
        this.storyEvents = storyEvents;
        this.completedEvents = new Set();
    }
    StoryEventManager.prototype.toScript = function (generator) {
        var sem = this;
        return function () {
            var iterator, result, script;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        iterator = generator();
                        _a.label = 1;
                    case 1:
                        if (!true) return [3 /*break*/, 8];
                        result = iterator.next();
                        if (!result.value) return [3 /*break*/, 5];
                        if (_.isArray(result.value)) {
                            result.value = S.simul.apply(S, __spread(result.value.map(function (scr) { return sem.toScript(scr); })));
                        }
                        script = new Script(result.value);
                        _a.label = 2;
                    case 2:
                        if (!!script.done) return [3 /*break*/, 4];
                        script.update(global.script.delta);
                        if (script.done)
                            return [3 /*break*/, 4];
                        return [4 /*yield*/];
                    case 3:
                        _a.sent();
                        return [3 /*break*/, 2];
                    case 4: return [3 /*break*/, 7];
                    case 5:
                        if (!!result.done) return [3 /*break*/, 7];
                        return [4 /*yield*/];
                    case 6:
                        _a.sent();
                        _a.label = 7;
                    case 7:
                        if (result.done)
                            return [3 /*break*/, 8];
                        return [3 /*break*/, 1];
                    case 8: return [2 /*return*/];
                }
            });
        };
    };
    StoryEventManager.prototype.canStartEvent = function (name) {
        var event = this.getEventByName(name);
        if (!event)
            return false;
        if (this.theater.currentStageName !== event.stage)
            return false;
        if (!event.neverComplete && this.completedEvents.has(name))
            return false;
        return true;
    };
    StoryEventManager.prototype.completeEvent = function (name) {
        var event = this.getEventByName(name);
        if (!event)
            return;
        this.completedEvents.add(name);
    };
    StoryEventManager.prototype.onStageLoad = function () {
        for (var eventName in this.storyEvents) {
            if (this.canStartEvent(eventName)) {
                this.startEvent(eventName);
            }
        }
    };
    StoryEventManager.prototype.reset = function () {
    };
    StoryEventManager.prototype.startEvent = function (name) {
        var event = this.getEventByName(name);
        if (!event)
            return;
        var sem = this;
        this.theater.currentWorld.runScript(S.chain(this.toScript(event.script), function () {
            return __generator(this, function (_a) {
                sem.completeEvent(name);
                return [2 /*return*/];
            });
        }));
    };
    StoryEventManager.prototype.getEventByName = function (name) {
        var event = this.storyEvents[name];
        if (!event) {
            debug("Cannot get event " + name + " because it does not exist:", this.storyEvents);
            return undefined;
        }
        return event;
    };
    return StoryEventManager;
}());
var StoryManager = /** @class */ (function () {
    function StoryManager(theater, storyboard, storyboardPath, events, storyConfig) {
        this.theater = theater;
        this.storyboard = storyboard;
        this.cutsceneManager = new CutsceneManager(theater, storyboard);
        this.eventManager = new StoryEventManager(theater, events);
        this.storyConfig = new StoryConfig(theater, storyConfig);
        this.fastForward(storyboardPath);
        if (this.currentNode) {
            this.theater.runScript(this.script());
        }
    }
    Object.defineProperty(StoryManager.prototype, "currentNodeName", {
        get: function () { return this._currentNodeName; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StoryManager.prototype, "currentNode", {
        get: function () { return this.getNodeByName(this.currentNodeName); },
        enumerable: true,
        configurable: true
    });
    StoryManager.prototype.script = function () {
        var sm = this;
        return function () {
            var transition;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(sm.currentNode.type === 'cutscene')) return [3 /*break*/, 4];
                        sm.cutsceneManager.playCutscene(sm.currentNodeName);
                        _a.label = 1;
                    case 1:
                        if (!sm.cutsceneManager.isCutscenePlaying) return [3 /*break*/, 3];
                        sm.cutsceneManager.update(global.script.delta);
                        return [4 /*yield*/];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 1];
                    case 3: return [3 /*break*/, 5];
                    case 4:
                        if (sm.currentNode.type === 'party') {
                            sm.updateParty(sm.currentNode);
                        }
                        else if (sm.currentNode.type === 'config') {
                            sm.storyConfig.updateConfig(sm.currentNode.config);
                            sm.storyConfig.execute();
                        }
                        _a.label = 5;
                    case 5:
                        transition = sm.getFirstValidTransition(sm.currentNode);
                        _a.label = 6;
                    case 6:
                        if (!!transition) return [3 /*break*/, 8];
                        return [4 /*yield*/];
                    case 7:
                        _a.sent();
                        transition = sm.getFirstValidTransition(sm.currentNode);
                        return [3 /*break*/, 6];
                    case 8:
                        sm._currentNodeName = transition.toNode;
                        if (sm.currentNode) {
                            sm.theater.runScript(sm.script());
                        }
                        return [2 /*return*/];
                }
            });
        };
    };
    StoryManager.prototype.onStageLoad = function () {
        this.cutsceneManager.onStageLoad();
        this.eventManager.onStageLoad();
        this.storyConfig.execute();
    };
    StoryManager.prototype.getInteractableObjects = function (node, stageName) {
        var e_32, _a;
        var result = new Set();
        if (!node)
            return result;
        try {
            for (var _b = __values(node.transitions), _c = _b.next(); !_c.done; _c = _b.next()) {
                var transition = _c.value;
                if (transition.type !== 'onInteract')
                    continue;
                if (stageName && transition.onStage && stageName === transition.onStage)
                    continue;
                var toNode = this.getNodeByName(transition.toNode);
                if (toNode.type === 'cutscene' && !this.cutsceneManager.canPlayCutscene(transition.toNode))
                    continue;
                result.add(transition.with);
            }
        }
        catch (e_32_1) { e_32 = { error: e_32_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_32) throw e_32.error; }
        }
        return result;
    };
    StoryManager.prototype.fastForward = function (path) {
        for (var i = 0; i < path.length - 1; i++) {
            var node = this.getNodeByName(path[i]);
            if (!node)
                continue;
            if (node.type === 'cutscene') {
                this.cutsceneManager.fastForwardCutscene(path[i]);
            }
            else if (node.type === 'party') {
                this.updateParty(node);
            }
            else if (node.type === 'config') {
                this.storyConfig.updateConfig(node.config);
            }
        }
        this.storyConfig.execute();
        this._currentNodeName = _.last(path);
    };
    StoryManager.prototype.getFirstValidTransition = function (node) {
        var e_33, _a;
        try {
            for (var _b = __values(node.transitions), _c = _b.next(); !_c.done; _c = _b.next()) {
                var transition = _c.value;
                if (transition.type === 'instant') {
                    return transition;
                }
                else if (transition.type === 'onStage') {
                    if (this.theater.currentStageName === transition.stage && !this.theater.stageManager.transitioning)
                        return transition;
                }
                else if (transition.type === 'onInteract') {
                    if (this.theater.interactionManager.interactRequested === transition.with) {
                        this.theater.interactionManager.consumeInteraction();
                        return transition;
                    }
                }
                else if (transition.type === 'onCondition') {
                    if (transition.condition()) {
                        return transition;
                    }
                }
            }
        }
        catch (e_33_1) { e_33 = { error: e_33_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_33) throw e_33.error; }
        }
        return null;
    };
    StoryManager.prototype.getNodeByName = function (name) {
        if (!this.storyboard[name]) {
            debug("No storyboard node exists with name " + name);
        }
        return this.storyboard[name];
    };
    StoryManager.prototype.updateParty = function (party) {
        var e_34, _a, e_35, _b;
        if (party.setLeader !== undefined) {
            this.theater.partyManager.leader = party.setLeader;
        }
        if (!_.isEmpty(party.setMembersActive)) {
            try {
                for (var _c = __values(party.setMembersActive), _d = _c.next(); !_d.done; _d = _c.next()) {
                    var m = _d.value;
                    this.theater.partyManager.setMemberActive(m);
                }
            }
            catch (e_34_1) { e_34 = { error: e_34_1 }; }
            finally {
                try {
                    if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
                }
                finally { if (e_34) throw e_34.error; }
            }
        }
        if (!_.isEmpty(party.setMembersInactive)) {
            try {
                for (var _e = __values(party.setMembersInactive), _f = _e.next(); !_f.done; _f = _e.next()) {
                    var m = _f.value;
                    this.theater.partyManager.setMemberInactive(m);
                }
            }
            catch (e_35_1) { e_35 = { error: e_35_1 }; }
            finally {
                try {
                    if (_f && !_f.done && (_b = _e.return)) _b.call(_e);
                }
                finally { if (e_35) throw e_35.error; }
            }
        }
    };
    return StoryManager;
}());
var Storyboard;
(function (Storyboard) {
    function arbitraryPathToNode(storyboard, endNode) {
        if (!storyboard[endNode]) {
            debug("Cannot make path to end node " + endNode + " since it doesn't exist in storyboard", storyboard);
            return [];
        }
        var result = [endNode];
        var currentNode = endNode;
        while (storyboard[currentNode].type !== 'start') {
            var foundNode = undefined;
            for (var node in storyboard) {
                var transition = storyboard[node].transitions.find(function (t) { return t.toNode === currentNode; });
                if (transition) {
                    foundNode = node;
                    break;
                }
            }
            if (foundNode) {
                result.unshift(foundNode);
                currentNode = foundNode;
            }
            else {
                debug("Could not find a path to " + endNode + " in storyboard", storyboard);
                return [];
            }
        }
        return result;
    }
    Storyboard.arbitraryPathToNode = arbitraryPathToNode;
})(Storyboard || (Storyboard = {}));
/// <reference path="./worldObject.ts"/>
var Transition = /** @class */ (function (_super) {
    __extends(Transition, _super);
    function Transition() {
        var _this = _super.call(this, {}) || this;
        _this.done = false;
        return _this;
    }
    return Transition;
}(WorldObject));
(function (Transition) {
    Transition.INSTANT = { type: 'instant' };
    function FADE(preTime, time, postTime) {
        return {
            type: 'fade', preTime: preTime, time: time, postTime: postTime
        };
    }
    Transition.FADE = FADE;
    function fromConfigAndSnapshots(config, oldSnapshot, newSnapshot) {
        if (config.type === 'instant') {
            return new Instant();
        }
        if (config.type === 'fade') {
            return new Fade(oldSnapshot, newSnapshot, config.preTime, config.time, config.postTime);
        }
        // @ts-ignore
        debug("Transition type " + config.type + " not found.");
        return undefined;
    }
    Transition.fromConfigAndSnapshots = fromConfigAndSnapshots;
    var Instant = /** @class */ (function (_super) {
        __extends(Instant, _super);
        function Instant() {
            var _this = _super.call(this) || this;
            _this.done = true;
            return _this;
        }
        return Instant;
    }(Transition));
    var Fade = /** @class */ (function (_super) {
        __extends(Fade, _super);
        function Fade(oldSnapshot, newSnapshot, preTime, time, postTime) {
            var _this = _super.call(this) || this;
            _this.oldSnapshot = oldSnapshot;
            _this.newSnapshot = newSnapshot;
            _this.newAlpha = 0;
            global.theater.runScript(S.chain(S.wait(preTime), S.doOverTime(time, function (t) {
                _this.newAlpha = t;
            }), S.wait(postTime), S.call(function () { return _this.done = true; })));
            return _this;
        }
        Fade.prototype.render = function (screen) {
            _super.prototype.render.call(this, screen);
            screen.render(this.oldSnapshot);
            screen.render(this.newSnapshot, {
                alpha: this.newAlpha
            });
        };
        return Fade;
    }(Transition));
})(Transition || (Transition = {}));
/// <reference path="./transition.ts"/>
/// <reference path="./world.ts"/>
var Theater = /** @class */ (function (_super) {
    __extends(Theater, _super);
    function Theater(config) {
        var _this = _super.call(this, {
            layers: [
                { name: Theater.LAYER_WORLD },
                { name: Theater.LAYER_TRANSITION },
                { name: Theater.LAYER_SLIDES },
                { name: Theater.LAYER_DIALOG },
            ],
        }) || this;
        _this.loadDialogBox(config.dialogBox);
        _this.partyManager = new PartyManager(_this, config.party);
        _this.storyManager = new StoryManager(_this, config.story.storyboard, config.story.storyboardPath, config.story.storyEvents, config.story.storyConfig);
        _this.stageManager = new StageManager(_this, config.stages);
        _this.interactionManager = new InteractionManager(_this);
        _this.slideManager = new SlideManager(_this);
        _this.stageManager.loadStage(config.stageToLoad, Transition.INSTANT, config.stageEntryPoint);
        if (Debug.AUTOPLAY && config.autoPlayScript) {
            _this.runScript(config.autoPlayScript);
        }
        return _this;
    }
    Object.defineProperty(Theater.prototype, "currentStageName", {
        get: function () { return this.stageManager ? this.stageManager.currentStageName : undefined; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Theater.prototype, "currentWorld", {
        get: function () { return this.stageManager ? this.stageManager.currentWorld : undefined; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Theater.prototype, "currentStage", {
        get: function () { return (this.stageManager && this.stageManager.stages) ? this.stageManager.stages[this.stageManager.currentStageName] : undefined; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Theater.prototype, "isCutscenePlaying", {
        get: function () { return this.storyManager ? this.storyManager.cutsceneManager.isCutscenePlaying : false; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Theater.prototype, "slides", {
        get: function () { return this.slideManager ? this.slideManager.slides : []; },
        enumerable: true,
        configurable: true
    });
    // Theater cannot have preUpdate or postUpdate because I say so
    Theater.prototype.update = function (delta) {
        _super.prototype.update.call(this, delta);
        this.stageManager.loadStageIfQueued();
    };
    // Theater cannot have preRender or postRender because it doesn't have a parent world
    Theater.prototype.render = function (screen) {
        this.interactionManager.preRender();
        _super.prototype.render.call(this, screen);
        this.interactionManager.postRender();
    };
    Theater.prototype.addSlideByConfig = function (config) {
        return this.slideManager.addSlideByConfig(config);
    };
    Theater.prototype.clearSlides = function (exceptLast) {
        if (exceptLast === void 0) { exceptLast = 0; }
        this.slideManager.clearSlides(exceptLast);
    };
    Theater.prototype.loadStage = function (name, transition, entryPoint) {
        if (transition === void 0) { transition = Transition.INSTANT; }
        this.stageManager.loadStage(name, transition, entryPoint);
    };
    Theater.prototype.onStageLoad = function () {
        this.storyManager.onStageLoad();
    };
    Theater.prototype.updateDebugMousePosition = function () {
        // Override to do nothing since we don't want to display the theater's mouse position
    };
    Theater.prototype.loadDialogBox = function (config) {
        this.dialogBox = WorldObject.fromConfig(config);
        this.dialogBox.visible = false;
        World.Actions.setLayer(this.dialogBox, Theater.LAYER_DIALOG);
        World.Actions.addWorldObjectToWorld(this.dialogBox, this);
    };
    Theater.LAYER_WORLD = 'world';
    Theater.LAYER_TRANSITION = 'transition';
    Theater.LAYER_SLIDES = 'slides';
    Theater.LAYER_DIALOG = 'dialog';
    return Theater;
}(World));
// TODO: convert this to a sprite?
var Tilemap = /** @class */ (function (_super) {
    __extends(Tilemap, _super);
    function Tilemap(config) {
        var _this = _super.call(this, config) || this;
        _this.tilemap = Tilemap.cloneTilemap(AssetCache.getTilemap(config.tilemap));
        _this.tilemapLayer = O.getOrDefault(config.tilemapLayer, 0);
        var tilemapDimens = A.get2DArrayDimensions(_this.currentTilemapLayer);
        _this.numTilesX = tilemapDimens.width;
        _this.numTilesY = tilemapDimens.height;
        _this.renderTexture = new Texture(_this.numTilesX * _this.tilemap.tileset.tileWidth, _this.numTilesY * _this.tilemap.tileset.tileHeight);
        _this.createCollisionBoxes(O.getOrDefault(config.debugBounds, false));
        _this.tint = O.getOrDefault(config.tint, 0xFFFFFF);
        _this.dirty = true;
        return _this;
    }
    Object.defineProperty(Tilemap.prototype, "currentTilemapLayer", {
        get: function () { return this.tilemap.layers[this.tilemapLayer]; },
        enumerable: true,
        configurable: true
    });
    Tilemap.prototype.postUpdate = function () {
        var e_36, _a;
        if (!_.isEmpty(this.collisionBoxes) && (this.collisionBoxes[0].x !== this.x || this.collisionBoxes[0].y !== this.y)) {
            try {
                for (var _b = __values(this.collisionBoxes), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var box = _c.value;
                    box.x = this.x;
                    box.y = this.y;
                }
            }
            catch (e_36_1) { e_36 = { error: e_36_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_36) throw e_36.error; }
            }
        }
        _super.prototype.postUpdate.call(this);
    };
    Tilemap.prototype.render = function (screen) {
        if (this.dirty) {
            this.drawRenderTexture();
            this.dirty = false;
        }
        screen.render(this.renderTexture, {
            x: this.x,
            y: this.y,
            tint: this.tint
        });
        _super.prototype.render.call(this, screen);
    };
    Tilemap.prototype.createCollisionBoxes = function (debugBounds) {
        var e_37, _a;
        this.collisionBoxes = [];
        var collisionRects = Tilemap.getCollisionRects(this.currentTilemapLayer, this.tilemap.tileset);
        Tilemap.optimizeCollisionRects(collisionRects); // Not optimizing entire array first to save some cycles.
        Tilemap.optimizeCollisionRects(collisionRects, Tilemap.OPTIMIZE_ALL);
        try {
            for (var collisionRects_1 = __values(collisionRects), collisionRects_1_1 = collisionRects_1.next(); !collisionRects_1_1.done; collisionRects_1_1 = collisionRects_1.next()) {
                var rect = collisionRects_1_1.value;
                var box = new PhysicsWorldObject({
                    x: this.x, y: this.y,
                    bounds: rect,
                    physicsGroup: this.physicsGroup,
                    immovable: true,
                });
                box.debugBounds = debugBounds;
                this.collisionBoxes.push(box);
            }
        }
        catch (e_37_1) { e_37 = { error: e_37_1 }; }
        finally {
            try {
                if (collisionRects_1_1 && !collisionRects_1_1.done && (_a = collisionRects_1.return)) _a.call(collisionRects_1);
            }
            finally { if (e_37) throw e_37.error; }
        }
        World.Actions.addChildrenToParent(this.collisionBoxes, this);
    };
    Tilemap.prototype.drawRenderTexture = function () {
        this.renderTexture.clear();
        for (var y = 0; y < this.currentTilemapLayer.length; y++) {
            for (var x = 0; x < this.currentTilemapLayer[y].length; x++) {
                this.drawTile(this.currentTilemapLayer[y][x], x, y, this.renderTexture);
            }
        }
    };
    Tilemap.prototype.drawTile = function (tile, tileX, tileY, renderTexture) {
        if (!tile || tile.index < 0)
            return;
        var textureKey = this.tilemap.tileset.tiles[tile.index];
        var texture = AssetCache.getTexture(textureKey);
        renderTexture.render(texture, { x: tileX * this.tilemap.tileset.tileWidth, y: tileY * this.tilemap.tileset.tileHeight });
    };
    return Tilemap;
}(WorldObject));
(function (Tilemap) {
    function cloneTilemap(tilemap) {
        var result = {
            tileset: tilemap.tileset,
            layers: [],
        };
        for (var i = 0; i < tilemap.layers.length; i++) {
            result.layers.push(A.clone2D(tilemap.layers[i]));
        }
        return result;
    }
    Tilemap.cloneTilemap = cloneTilemap;
    function getCollisionRects(tilemapLayer, tileset) {
        if (_.isEmpty(tileset.collisionIndices))
            return [];
        var result = [];
        for (var y = 0; y < tilemapLayer.length; y++) {
            for (var x = 0; x < tilemapLayer[y].length; x++) {
                var tile = tilemapLayer[y][x];
                if (_.contains(tileset.collisionIndices, tile.index)) {
                    var rect = {
                        x: x * tileset.tileWidth,
                        y: y * tileset.tileHeight,
                        width: tileset.tileWidth,
                        height: tileset.tileHeight
                    };
                    result.push(rect);
                }
            }
        }
        return result;
    }
    Tilemap.getCollisionRects = getCollisionRects;
    function optimizeCollisionRects(rects, all) {
        if (all === void 0) { all = !Tilemap.OPTIMIZE_ALL; }
        var i = 0;
        while (i < rects.length) {
            var j = i + 1;
            while (j < rects.length) {
                var combined = combineRects(rects[j], rects[i]);
                if (combined) {
                    rects.splice(j, 1);
                }
                else if (all) {
                    j++;
                }
                else {
                    break;
                }
            }
            i++;
        }
    }
    Tilemap.optimizeCollisionRects = optimizeCollisionRects;
    Tilemap.OPTIMIZE_ALL = true;
    function combineRects(rect, into) {
        if (G.rectContainsRect(into, rect))
            return true;
        if (G.rectContainsRect(rect, into)) {
            into.x = rect.x;
            into.y = rect.y;
            into.width = rect.width;
            into.height = rect.height;
            return true;
        }
        if (rect.x == into.x && rect.width == into.width) {
            if (rect.y <= into.y + into.height && rect.y + rect.height >= into.y) {
                var newY = Math.min(rect.y, into.y);
                var newH = Math.max(rect.y + rect.height, into.y + into.height) - newY;
                into.y = newY;
                into.height = newH;
                return true;
            }
        }
        if (rect.y == into.y && rect.height == into.height) {
            if (rect.x <= into.x + into.width && rect.x + rect.width >= into.x) {
                var newX = Math.min(rect.x, into.x);
                var newW = Math.max(rect.x + rect.width, into.x + into.width) - newX;
                into.x = newX;
                into.width = newW;
                return true;
            }
        }
        return false;
    }
})(Tilemap || (Tilemap = {}));
var Timer = /** @class */ (function () {
    function Timer(duration, callback, repeat) {
        if (repeat === void 0) { repeat = false; }
        this.duration = duration;
        this.speed = 1;
        this.time = 0;
        this.paused = false;
        this.callback = callback;
        this.repeat = repeat;
    }
    Object.defineProperty(Timer.prototype, "running", {
        get: function () { return !this.done && !this.paused; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Timer.prototype, "done", {
        get: function () { return !this.repeat && this.progress >= 1; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Timer.prototype, "progress", {
        get: function () {
            if (this.duration === 0)
                return 1;
            return Math.min(this.time / this.duration, 1);
        },
        enumerable: true,
        configurable: true
    });
    Timer.prototype.update = function (delta) {
        if (this.running) {
            this.time += delta * this.speed;
            if (this.time >= this.duration) {
                if (this.repeat) {
                    while (this.time >= this.duration) {
                        this.time -= this.duration;
                        if (this.callback)
                            this.callback();
                    }
                }
                else {
                    this.time = this.duration;
                    if (this.callback)
                        this.callback();
                }
            }
        }
    };
    Timer.prototype.finish = function () {
        this.time = this.duration;
    };
    Timer.prototype.reset = function () {
        this.time = 0;
    };
    return Timer;
}());
var Tween = /** @class */ (function () {
    function Tween(start, end, duration, easingFunction) {
        if (easingFunction === void 0) { easingFunction = Tween.Easing.Linear; }
        this.start = start;
        this.end = end;
        this.duration = duration;
        this.easingFunction = easingFunction;
        this.timer = new Timer(duration);
    }
    Object.defineProperty(Tween.prototype, "done", {
        get: function () { return this.timer.done; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Tween.prototype, "value", {
        get: function () { return this.start + (this.end - this.start) * this.easingFunction(this.timer.progress); },
        enumerable: true,
        configurable: true
    });
    Tween.prototype.update = function (delta) {
        this.timer.update(delta);
    };
    return Tween;
}());
(function (Tween) {
    var Easing;
    (function (Easing) {
        Easing.Linear = (function (t) { return t; });
        Easing.Square = (function (t) { return Math.pow(t, 2); });
        Easing.InvSquare = (function (t) { return 1 - Math.pow((1 - t), 2); });
    })(Easing = Tween.Easing || (Tween.Easing = {}));
})(Tween || (Tween = {}));
var Warp = /** @class */ (function (_super) {
    __extends(Warp, _super);
    function Warp(config) {
        var _this = _super.call(this, config) || this;
        _this.stage = _this.data.stage;
        _this.entryPoint = _this.data.entryPoint;
        _this.transition = O.getOrDefault(_this.data.transition, Transition.INSTANT);
        return _this;
    }
    Warp.prototype.warp = function () {
        global.theater.loadStage(this.stage, this.transition, this.entryPoint);
    };
    return Warp;
}(PhysicsWorldObject));
var ZOrderedTilemap = /** @class */ (function (_super) {
    __extends(ZOrderedTilemap, _super);
    function ZOrderedTilemap(config) {
        var _this = _super.call(this, config) || this;
        _this.tilemap = Tilemap.cloneTilemap(AssetCache.getTilemap(config.tilemap));
        _this.tilemapLayer = O.getOrDefault(config.tilemapLayer, 0);
        var tilemapDimens = A.get2DArrayDimensions(_this.currentTilemapLayer);
        _this.numTilesX = tilemapDimens.width;
        _this.numTilesY = tilemapDimens.height;
        _this.createCollisionBoxes(O.getOrDefault(config.debugBounds, false));
        _this.dirty = true;
        _this.zMap = config.zMap;
        return _this;
    }
    Object.defineProperty(ZOrderedTilemap.prototype, "currentTilemapLayer", {
        get: function () { return this.tilemap.layers[this.tilemapLayer]; },
        enumerable: true,
        configurable: true
    });
    ZOrderedTilemap.prototype.update = function (delta) {
        if (this.dirty) {
            this.drawRenderTexture();
            this.dirty = false;
        }
    };
    ZOrderedTilemap.prototype.postUpdate = function () {
        var e_38, _a;
        if (!_.isEmpty(this.collisionBoxes) && (this.collisionBoxes[0].x !== this.x || this.collisionBoxes[0].y !== this.y)) {
            try {
                for (var _b = __values(this.collisionBoxes), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var box = _c.value;
                    box.x = this.x;
                    box.y = this.y;
                }
            }
            catch (e_38_1) { e_38 = { error: e_38_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_38) throw e_38.error; }
            }
        }
        _super.prototype.postUpdate.call(this);
    };
    ZOrderedTilemap.prototype.createCollisionBoxes = function (debugBounds) {
        if (debugBounds === void 0) { debugBounds = false; }
        var e_39, _a;
        this.collisionBoxes = [];
        var collisionRects = Tilemap.getCollisionRects(this.currentTilemapLayer, this.tilemap.tileset);
        Tilemap.optimizeCollisionRects(collisionRects); // Not optimizing entire array first to save some cycles.
        Tilemap.optimizeCollisionRects(collisionRects, Tilemap.OPTIMIZE_ALL);
        try {
            for (var collisionRects_2 = __values(collisionRects), collisionRects_2_1 = collisionRects_2.next(); !collisionRects_2_1.done; collisionRects_2_1 = collisionRects_2.next()) {
                var rect = collisionRects_2_1.value;
                var box = new PhysicsWorldObject({ x: this.x, y: this.y, bounds: rect, physicsGroup: this.physicsGroup });
                box.debugBounds = debugBounds;
                this.collisionBoxes.push(box);
            }
        }
        catch (e_39_1) { e_39 = { error: e_39_1 }; }
        finally {
            try {
                if (collisionRects_2_1 && !collisionRects_2_1.done && (_a = collisionRects_2.return)) _a.call(collisionRects_2);
            }
            finally { if (e_39) throw e_39.error; }
        }
        World.Actions.addChildrenToParent(this.collisionBoxes, this);
    };
    ZOrderedTilemap.prototype.drawRenderTexture = function () {
        this.clearZTextures();
        var zTileIndices = ZOrderedTilemap.createZTileIndicies(this.currentTilemapLayer, this.zMap);
        var zTextures = this.createZTextures(zTileIndices);
        for (var y = 0; y < this.currentTilemapLayer.length; y++) {
            for (var x = 0; x < this.currentTilemapLayer[y].length; x++) {
                var zValue = ZOrderedTilemap.getZValue(zTileIndices, y, x);
                if (!zTextures[zValue])
                    continue;
                this.drawTile(this.currentTilemapLayer[y][x], x - zTextures[zValue].tileBounds.left, y - zTextures[zValue].tileBounds.top, zTextures[zValue].texture);
            }
        }
    };
    ZOrderedTilemap.prototype.drawTile = function (tile, tileX, tileY, renderTexture) {
        if (!tile || tile.index < 0)
            return;
        var textureKey = this.tilemap.tileset.tiles[tile.index];
        var texture = AssetCache.getTexture(textureKey);
        renderTexture.render(texture, { x: tileX * this.tilemap.tileset.tileWidth, y: tileY * this.tilemap.tileset.tileHeight });
    };
    ZOrderedTilemap.prototype.createZTextures = function (zTileIndices) {
        var texturesByZ = ZOrderedTilemap.createEmptyZTextures(zTileIndices, this.tilemap.tileset);
        for (var zValue in texturesByZ) {
            var zHeight = texturesByZ[zValue].zHeight * this.tilemap.tileset.tileHeight;
            World.Actions.addChildToParent(new Sprite({
                layer: this.layer,
                x: this.x + texturesByZ[zValue].bounds.x,
                y: this.y + texturesByZ[zValue].bounds.y + zHeight,
                texture: texturesByZ[zValue].texture,
                offset: { x: 0, y: -zHeight },
            }), this);
        }
        return texturesByZ;
    };
    ZOrderedTilemap.prototype.clearZTextures = function () {
        World.Actions.removeWorldObjectsFromWorld(this.children);
    };
    return ZOrderedTilemap;
}(WorldObject));
(function (ZOrderedTilemap) {
    function createZTileIndicies(layer, zMap) {
        var zTileIndices = getInitialZTileIndicies(layer, zMap);
        fillZTileIndicies(zTileIndices);
        return zTileIndices;
    }
    ZOrderedTilemap.createZTileIndicies = createZTileIndicies;
    function createEmptyZTextures(zTileIndices, tileset) {
        var zTextureSlots = {};
        for (var y = 0; y < zTileIndices.length; y++) {
            for (var x = 0; x < zTileIndices[y].length; x++) {
                if (isFinite(zTileIndices[y][x])) {
                    var zValue = getZValue(zTileIndices, y, x);
                    if (!zTextureSlots[zValue])
                        zTextureSlots[zValue] = {
                            texture: null,
                            bounds: { x: 0, y: 0, width: 0, height: 0 },
                            tileBounds: { left: Infinity, right: -Infinity, top: Infinity, bottom: -Infinity },
                            zHeight: -Infinity,
                        };
                    if (x < zTextureSlots[zValue].tileBounds.left)
                        zTextureSlots[zValue].tileBounds.left = x;
                    if (x > zTextureSlots[zValue].tileBounds.right)
                        zTextureSlots[zValue].tileBounds.right = x;
                    if (y < zTextureSlots[zValue].tileBounds.top)
                        zTextureSlots[zValue].tileBounds.top = y;
                    if (y > zTextureSlots[zValue].tileBounds.bottom)
                        zTextureSlots[zValue].tileBounds.bottom = y;
                    if (zTileIndices[y][x] > zTextureSlots[zValue].zHeight)
                        zTextureSlots[zValue].zHeight = zTileIndices[y][x];
                }
            }
        }
        for (var zValue in zTextureSlots) {
            zTextureSlots[zValue].bounds.x = zTextureSlots[zValue].tileBounds.left * tileset.tileWidth;
            zTextureSlots[zValue].bounds.y = zTextureSlots[zValue].tileBounds.top * tileset.tileHeight;
            zTextureSlots[zValue].bounds.width = (zTextureSlots[zValue].tileBounds.right - zTextureSlots[zValue].tileBounds.left + 1) * tileset.tileWidth;
            zTextureSlots[zValue].bounds.height = (zTextureSlots[zValue].tileBounds.bottom - zTextureSlots[zValue].tileBounds.top + 1) * tileset.tileHeight;
            zTextureSlots[zValue].texture = new Texture(zTextureSlots[zValue].bounds.width, zTextureSlots[zValue].bounds.height);
        }
        return zTextureSlots;
    }
    ZOrderedTilemap.createEmptyZTextures = createEmptyZTextures;
    function getZValue(zTileIndices, y, x) {
        return y + zTileIndices[y][x];
    }
    ZOrderedTilemap.getZValue = getZValue;
    function getInitialZTileIndicies(layer, zMap) {
        var zTileIndices = A.filledArray2D(layer.length, layer[0].length, undefined);
        for (var y = 0; y < layer.length; y++) {
            for (var x = 0; x < layer[y].length; x++) {
                var tileIndex = layer[y][x].index;
                zTileIndices[y][x] = tileIndex === -1 ? -Infinity : zMap[tileIndex];
            }
        }
        return zTileIndices;
    }
    function fillZTileIndicies(zTileIndices) {
        for (var y = 1; y < zTileIndices.length; y++) {
            for (var x = 0; x < zTileIndices[y].length; x++) {
                if (zTileIndices[y][x] === undefined && isFinite(zTileIndices[y - 1][x])) {
                    zTileIndices[y][x] = zTileIndices[y - 1][x] - 1;
                }
            }
        }
        for (var y = zTileIndices.length - 2; y >= 0; y--) {
            for (var x = 0; x < zTileIndices[y].length; x++) {
                if (zTileIndices[y][x] === undefined && isFinite(zTileIndices[y + 1][x])) {
                    zTileIndices[y][x] = zTileIndices[y + 1][x] + 1;
                }
            }
        }
        for (var y = 0; y < zTileIndices.length; y++) {
            for (var x = 0; x < zTileIndices[y].length; x++) {
                if (zTileIndices[y][x] === undefined) {
                    zTileIndices[y][x] = 0;
                }
            }
        }
    }
})(ZOrderedTilemap || (ZOrderedTilemap = {}));
var G;
(function (G) {
    function distance(pt1, pt2) {
        return M.distance(pt1.x, pt1.y, pt2.x, pt2.y);
    }
    G.distance = distance;
    function distanceSq(pt1, pt2) {
        return M.distanceSq(pt1.x, pt1.y, pt2.x, pt2.y);
    }
    G.distanceSq = distanceSq;
    function expandRectangle(rect, amount) {
        rect.x -= amount;
        rect.y -= amount;
        rect.width += 2 * amount;
        rect.height += 2 * amount;
    }
    G.expandRectangle = expandRectangle;
    function overlapRectangles(rect1, rect2) {
        return rect1.x < rect2.x + rect2.width && rect1.x + rect1.width > rect2.x && rect1.y < rect2.y + rect2.height && rect1.y + rect1.height > rect2.y;
    }
    G.overlapRectangles = overlapRectangles;
    function rectContainsPt(rect, pt) {
        return pt.x >= rect.x && pt.y >= rect.y && pt.x < rect.x + rect.width && pt.y < rect.y + rect.height;
    }
    G.rectContainsPt = rectContainsPt;
    function rectContainsRect(rect, contains) {
        return rect.x <= contains.x && rect.x + rect.width >= contains.x + contains.width
            && rect.y <= contains.y && rect.y + rect.height >= contains.y + contains.height;
    }
    G.rectContainsRect = rectContainsRect;
})(G || (G = {}));
var M;
(function (M) {
    function argmax(array, key) {
        return this.argmin(array, function (x) { return -key(x); });
    }
    M.argmax = argmax;
    function argmin(array, key) {
        if (!array || array.length == 0)
            return null;
        var result = array[0];
        var resultValue = key(array[0]);
        for (var i = 1; i < array.length; i++) {
            var value = key(array[i]);
            if (value < resultValue) {
                result = array[i];
                resultValue = value;
            }
        }
        return result;
    }
    M.argmin = argmin;
    function clamp(val, min, max) {
        return val < min ? min : (val > max ? max : val);
    }
    M.clamp = clamp;
    function colorToVec3(color) {
        var r = (color >> 16) & 255;
        var g = (color >> 8) & 255;
        var b = color & 255;
        return [r / 255, g / 255, b / 255];
    }
    M.colorToVec3 = colorToVec3;
    function degToRad(deg) {
        return Math.PI * deg / 180;
    }
    M.degToRad = degToRad;
    function distance(x1, y1, x2, y2) {
        return Math.sqrt(distanceSq(x1, y1, x2, y2));
    }
    M.distance = distance;
    function distanceSq(x1, y1, x2, y2) {
        var dx = x2 - x1;
        var dy = y2 - y1;
        return dx * dx + dy * dy;
    }
    M.distanceSq = distanceSq;
    /* Calculates the height of a parabola that starts at startHeight, increases to startHeight + peakDelta, then falls to startHeight + groundDelta.
    0 <= t <= 1 is the percent completion of the jump. */
    function jumpParabola(startHeight, peakDelta, groundDelta, t) {
        var a = 2 * groundDelta - 4 * peakDelta;
        var b = 4 * peakDelta - groundDelta;
        return a * t * t + b * t + startHeight;
    }
    M.jumpParabola = jumpParabola;
    function lerp(a, b, t) {
        return a * (1 - t) + b * t;
    }
    M.lerp = lerp;
    function magnitude(dx, dy) {
        return Math.sqrt(this.magnitudeSq(dx, dy));
    }
    M.magnitude = magnitude;
    function magnitudeSq(dx, dy) {
        return dx * dx + dy * dy;
    }
    M.magnitudeSq = magnitudeSq;
    function max(array, key) {
        return -this.min(array, function (x) { return -key(x); });
    }
    M.max = max;
    function min(array, key) {
        if (!array)
            return NaN;
        var result = key(array[0]);
        for (var i = 1; i < array.length; i++) {
            var value = key(array[i]);
            if (value < result)
                result = value;
        }
        return result;
    }
    M.min = min;
    function minPowerOf2(num) {
        return Math.pow(2, Math.ceil(Math.log2(num)));
    }
    M.minPowerOf2 = minPowerOf2;
    function radToDeg(rad) {
        return 180 / Math.PI * rad;
    }
    M.radToDeg = radToDeg;
    function vec3ToColor(vec3) {
        return (Math.round(vec3[0] * 255) << 16) + (Math.round(vec3[1] * 255) << 8) + Math.round(vec3[2] * 255);
    }
    M.vec3ToColor = vec3ToColor;
})(M || (M = {}));
var RandomNumberGenerator = /** @class */ (function () {
    function RandomNumberGenerator(seed) {
        this.seed(seed);
    }
    Object.defineProperty(RandomNumberGenerator.prototype, "value", {
        /**
         * Random float between 0 and 1.
         */
        get: function () {
            return this.generate();
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Random boolean, true or false.
     * @param trueChance Default: 0.5
     */
    RandomNumberGenerator.prototype.boolean = function (trueChance) {
        if (trueChance === void 0) { trueChance = 0.5; }
        return this.value < trueChance;
    };
    /**
     * Random color from 0x000000 to 0xFFFFFF.
     */
    RandomNumberGenerator.prototype.color = function () {
        return this.int(0x000000, 0xFFFFFF);
    };
    /**
     * Random float between {min} and {max}.
     * @param min Default: 0
     * @param max Default: 1
     */
    RandomNumberGenerator.prototype.float = function (min, max) {
        if (min === void 0) { min = 0; }
        if (max === void 0) { max = 1; }
        return min + (max - min) * this.value;
    };
    /**
     * Random element from array, uniformly.
     */
    RandomNumberGenerator.prototype.element = function (array) {
        if (_.isEmpty(array))
            return undefined;
        return array[this.index(array)];
    };
    /**
     * Random point uniformly in a unit circle.
     * @param radius Default: 1
     */
    RandomNumberGenerator.prototype.inCircle = function (radius) {
        if (radius === void 0) { radius = 1; }
        var angle = this.float(0, 2 * Math.PI);
        var r = radius * Math.sqrt(this.value);
        return { x: r * Math.cos(angle), y: r * Math.sin(angle) };
    };
    /**
     * Random int from {0} to {array.length - 1}.
     */
    RandomNumberGenerator.prototype.index = function (array) {
        return this.int(0, array.length - 1);
    };
    /**
     * Random int between {min} and {max}, inclusive.
     */
    RandomNumberGenerator.prototype.int = function (min, max) {
        return Math.floor(this.float(min, max + 1));
    };
    /**
     * Random point on a unit circle.
     * @param radius Default: 1
     */
    RandomNumberGenerator.prototype.onCircle = function (radius) {
        if (radius === void 0) { radius = 1; }
        var angle = this.float(0, 2 * Math.PI);
        return { x: radius * Math.cos(angle), y: radius * Math.sin(angle) };
    };
    /**
     * Random sign, -1 or +1.
     */
    RandomNumberGenerator.prototype.sign = function () {
        return this.value < 0.5 ? -1 : 1;
    };
    /**
     * Sets the seed of the random number generator.
     * @param seed
     */
    RandomNumberGenerator.prototype.seed = function (seed) {
        // @ts-ignore
        this.generate = new Math.seedrandom(seed);
    };
    return RandomNumberGenerator;
}());
var Random = new RandomNumberGenerator();
var St;
(function (St) {
    function padLeft(text, minLength, padString) {
        if (padString === void 0) { padString = ' '; }
        while (text.length < minLength) {
            text = padString + text;
        }
        return text;
    }
    St.padLeft = padLeft;
    function padRight(text, minLength, padString) {
        if (padString === void 0) { padString = ' '; }
        while (text.length < minLength) {
            text = text + padString;
        }
        return text;
    }
    St.padRight = padRight;
    function replaceAll(str, replace, wiith) {
        if (!str)
            return "";
        return str.split(replace).join(wiith);
    }
    St.replaceAll = replaceAll;
    function splitOnWhitespace(str) {
        if (_.isEmpty(str))
            return [];
        return str.match(/\S+/g) || [];
    }
    St.splitOnWhitespace = splitOnWhitespace;
})(St || (St = {}));
var Utils;
(function (Utils) {
    Utils.NOOP_DISPLAYOBJECT = new PIXI.DisplayObject();
})(Utils || (Utils = {}));
var V;
(function (V) {
    function angle(vector) {
        var angle = Math.atan2(vector.y, vector.x);
        if (angle < 0) {
            angle += 2 * Math.PI;
        }
        return angle;
    }
    V.angle = angle;
    function magnitude(vector) {
        return Math.sqrt(this.magnitudeSq(vector));
    }
    V.magnitude = magnitude;
    function magnitudeSq(vector) {
        return vector.x * vector.x + vector.y * vector.y;
    }
    V.magnitudeSq = magnitudeSq;
    function normalize(vector) {
        var mag = this.magnitude(vector);
        if (mag !== 0) {
            vector.x /= mag;
            vector.y /= mag;
        }
    }
    V.normalize = normalize;
    function normalized(vector) {
        var mag = this.magnitude(vector);
        if (mag === 0) {
            return new Point(0, 0);
        }
        return new Point(vector.x / mag, vector.y / mag);
    }
    V.normalized = normalized;
    function scale(vector, amount) {
        vector.x *= amount;
        vector.y *= amount;
    }
    V.scale = scale;
    function scaled(vector, amount) {
        return new Point(vector.x * amount, vector.y * amount);
    }
    V.scaled = scaled;
    function setMagnitude(vector, magnitude) {
        this.normalize(vector);
        this.scale(vector, magnitude);
    }
    V.setMagnitude = setMagnitude;
})(V || (V = {}));
var Assets;
(function (Assets) {
    Assets.textures = {
        'none': {},
        'blank': {},
        // Debug
        'debug': {},
        // Entities
        'player': {
            defaultAnchor: { x: 0.5, y: 1 },
            spritesheet: { frameWidth: 16, frameHeight: 16 },
        },
        'blacktree': {
            anchor: { x: 0.5, y: 1 }
        },
        'whitetree': {
            anchor: { x: 0.5, y: 1 }
        },
        'door': {
            anchor: { x: 0.5, y: 1 }
        },
        'monster': {
            defaultAnchor: { x: 0.5, y: 1 },
            spritesheet: { frameWidth: 16, frameHeight: 16 },
        },
        // Items
        'log': {
            anchor: { x: 0.5, y: 0.5 }
        },
        'axe': {
            anchor: { x: 0.5, y: 0.5 }
        },
        'monsteraxe': {
            anchor: { x: 0.5, y: 0.5 }
        },
        'key': {
            anchor: { x: 0.5, y: 0.5 }
        },
        'torch': {
            anchor: { x: 0.5, y: 0.5 }
        },
        'gasoline': {
            anchor: { x: 0.5, y: 0.5 }
        },
        // Props
        'campfire': {
            anchor: { x: 0.5, y: 0.5 }
        },
        'fire': {
            defaultAnchor: { x: 0.5, y: 1 },
            spritesheet: { frameWidth: 16, frameHeight: 16 }
        },
        'smoke': {
            anchor: { x: 0.5, y: 1 }
        },
        // Scenery
        'world': {
            spritesheet: { frameWidth: 16, frameHeight: 16 }
        },
        'ground': {
            anchor: { x: 0.5, y: 0.5 }
        },
        // Fonts
        'deluxe16': {},
    };
    Assets.tilesets = {
        'world': {
            tiles: Preload.allTilesWithPrefix('world_'),
            tileWidth: 16,
            tileHeight: 16,
            collisionIndices: [1],
        },
    };
    Assets.pyxelTilemaps = {
        'world': {
            url: 'assets/world.json',
            tileset: Assets.tilesets['world']
        }
    };
    var fonts = /** @class */ (function () {
        function fonts() {
        }
        fonts.DELUXE16 = {
            texture: 'deluxe16',
            charWidth: 8,
            charHeight: 15,
            spaceWidth: 8,
            newlineHeight: 15,
        };
        return fonts;
    }());
    Assets.fonts = fonts;
    Assets.tags = {};
})(Assets || (Assets = {}));
var Lighting;
(function (Lighting) {
    var FirelightFilter = /** @class */ (function (_super) {
        __extends(FirelightFilter, _super);
        function FirelightFilter(numLights) {
            var _this = this;
            var uniforms = [];
            var defaultUniforms = {};
            var distanceCalculations = "";
            var lightCalculations = "";
            var maxCalculations = "";
            for (var i = 0; i < numLights; i++) {
                uniforms.push("float light_" + i + "_x");
                uniforms.push("float light_" + i + "_y");
                uniforms.push("float light_" + i + "_radius");
                uniforms.push("float light_" + i + "_buffer");
                defaultUniforms["light_" + i + "_x"] = 0;
                defaultUniforms["light_" + i + "_y"] = 0;
                defaultUniforms["light_" + i + "_radius"] = 0;
                defaultUniforms["light_" + i + "_buffer"] = 0;
                distanceCalculations += "float light_" + i + "_distance = sqrt((worldx - light_" + i + "_x) * (worldx - light_" + i + "_x) + (worldy - light_" + i + "_y) * (worldy - light_" + i + "_y));\n";
                lightCalculations += "float light_" + i + "_light = 1.0;\n                                    if (light_" + i + "_distance > light_" + i + "_radius) light_" + i + "_light = 0.5;\n                                    if (light_" + i + "_distance > light_" + i + "_radius + light_" + i + "_buffer) light_" + i + "_light = 0.0;\n";
                maxCalculations += "light = max(light, light_" + i + "_light);\n";
            }
            _this = _super.call(this, {
                uniforms: uniforms,
                defaultUniforms: defaultUniforms,
                code: "\n                    float light = 0.0;\n\n                    " + distanceCalculations + "\n                    " + lightCalculations + "\n                    " + maxCalculations + "\n\n                    if (light == 0.5) {\n                        if (outp.rgb == vec3(1.0, 1.0, 1.0)) {\n                            outp.rgb = vec3(0.0, 0.0, 0.0);\n                        } else if (outp.rgb == vec3(0.0, 0.0, 0.0)) {\n                            outp.rgb = vec3(1.0, 1.0, 1.0);\n                        }\n                    } else if (light == 0.0 && inp.rgb != vec3(1.0, 0.0, 0.0)) {\n                        outp.r = 0.0;\n                        outp.g = 0.0;\n                        outp.b = 0.0;\n                    }\n                "
            }) || this;
            return _this;
        }
        FirelightFilter.prototype.setLightUniform = function (i, uniform, value) {
            this.setUniform("light_" + i + "_" + uniform, value);
        };
        return FirelightFilter;
    }(TextureFilter));
    Lighting.FirelightFilter = FirelightFilter;
})(Lighting || (Lighting = {}));
var LightingManager = /** @class */ (function (_super) {
    __extends(LightingManager, _super);
    function LightingManager(config) {
        var _this = _super.call(this, config) || this;
        _this.fireRadius = new LerpingValueWithNoise(0, 600, 10, 1);
        _this.fireBuffer = new LerpingValueWithNoise(0, 600, 0, 0);
        _this.winRadius = 0;
        return _this;
    }
    Object.defineProperty(LightingManager.prototype, "firelightFilter", {
        get: function () { return this.world.getLayerByName('main').effects.post.filters[0]; },
        enumerable: true,
        configurable: true
    });
    LightingManager.prototype.update = function (delta) {
        var player = this.world.getWorldObjectByType(Player);
        var campfire = this.world.getWorldObjectByType(Campfire);
        var torchLightManager = this.world.getWorldObjectByType(TorchLightManager);
        // Update fire light
        this.fireRadius.goal = campfire.getRadius();
        this.fireBuffer.goal = campfire.getBuffer();
        if (global.theater.storyManager.currentNodeName === 'intro') {
            this.fireRadius.goal = 40;
        }
        if (global.theater.storyManager.currentNodeName === 'win') {
            this.fireRadius.goal = Math.min(this.fireRadius.goal, 40);
        }
        if (player.state === 'hurt') {
            this.fireRadius.goal = 0;
            this.fireBuffer.goal = campfire.getRadius() + campfire.getBuffer();
        }
        this.fireRadius.update(delta);
        this.fireBuffer.update(delta);
        this.firelightFilter.setLightUniform(0, 'x', campfire.x - this.world.camera.worldOffsetX);
        this.firelightFilter.setLightUniform(0, 'y', campfire.y - this.world.camera.worldOffsetY);
        this.firelightFilter.setLightUniform(0, 'radius', this.fireRadius.value);
        this.firelightFilter.setLightUniform(0, 'buffer', this.fireBuffer.value);
        // Update torch light
        this.firelightFilter.setLightUniform(1, 'x', torchLightManager.torchLightX - this.world.camera.worldOffsetX);
        this.firelightFilter.setLightUniform(1, 'y', torchLightManager.torchLightY - this.world.camera.worldOffsetY);
        this.firelightFilter.setLightUniform(1, 'radius', torchLightManager.torchLightRadius);
        this.firelightFilter.setLightUniform(1, 'buffer', torchLightManager.torchLightBuffer);
        // Update win light
        this.firelightFilter.setLightUniform(2, 'x', campfire.x - this.world.camera.worldOffsetX);
        this.firelightFilter.setLightUniform(2, 'y', campfire.y - this.world.camera.worldOffsetY);
        this.firelightFilter.setLightUniform(2, 'radius', this.winRadius);
        this.firelightFilter.setLightUniform(2, 'buffer', 0);
        _super.prototype.update.call(this, delta);
    };
    return LightingManager;
}(WorldObject));
/// <reference path="lightingManager.ts" />
var DEFAULT_SCREEN_TRANSITION = Transition.FADE(0.2, 0.5, 0.2);
function BASE_STAGE() {
    var firelightFilter = new Lighting.FirelightFilter(3);
    return {
        constructor: World,
        layers: [
            { name: 'bg', effects: { post: { filters: [firelightFilter] } } },
            { name: 'main', sortKey: 'y', effects: { post: { filters: [firelightFilter] } } },
            { name: 'fg', effects: { post: { filters: [firelightFilter] } } },
            { name: 'above' },
        ],
        physicsGroups: {
            'player': {},
            'props': {},
            'items': {},
            'walls': {},
        },
        collisionOrder: [
            { move: 'player', from: ['props', 'walls'], callback: true },
            { move: 'items', from: ['props', 'walls'], callback: true, transferMomentum: true },
        ],
    };
}
function WORLD_BOUNDS(left, top, right, bottom) {
    var thickness = 12;
    var width = right - left;
    var height = bottom - top;
    return {
        constructor: WorldObject,
        children: [
            {
                constructor: PhysicsWorldObject,
                bounds: { x: left - thickness, y: top - thickness, width: thickness, height: height + 2 * thickness },
                physicsGroup: 'walls',
            },
            {
                constructor: PhysicsWorldObject,
                bounds: { x: right, y: top - thickness, width: thickness, height: height + 2 * thickness },
                physicsGroup: 'walls',
            },
            {
                constructor: PhysicsWorldObject,
                bounds: { x: left, y: top - thickness, width: width, height: thickness },
                physicsGroup: 'walls',
            },
            {
                constructor: PhysicsWorldObject,
                bounds: { x: left, y: bottom, width: width, height: thickness },
                physicsGroup: 'walls',
            },
        ]
    };
}
function fireSpriteConfig() {
    return {
        constructor: Sprite,
        animations: [
            Animations.fromTextureList({ name: 'blaze', texturePrefix: 'fire_', textures: [0, 1, 2, 3, 4, 5, 6, 7], frameRate: 16, count: -1 }),
        ],
        defaultAnimation: 'blaze'
    };
}
function screenShake(world) {
    return function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!global.theater || global.theater.currentWorld !== world)
                        return [2 /*return*/];
                    world.camera.shakeIntensity += 1;
                    return [5 /*yield**/, __values(S.wait(0.1)())];
                case 1:
                    _a.sent();
                    world.camera.shakeIntensity -= 1;
                    return [2 /*return*/];
            }
        });
    };
}
var Campfire = /** @class */ (function (_super) {
    __extends(Campfire, _super);
    function Campfire(config) {
        var _this = _super.call(this, config, {
            texture: 'campfire',
        }) || this;
        _this.logConsumptionRadius = 20;
        _this.fireSprite = _this.addChild({
            name: 'fire',
            parent: fireSpriteConfig(),
            layer: _this.layer,
        });
        _this.fireRadius = new FireRadius();
        _this.fireBuffer = new FireBuffer();
        _this.currentlyConsumedItems = [];
        _this.hasConsumedGasoline = false;
        return _this;
    }
    Object.defineProperty(Campfire.prototype, "isOut", {
        get: function () { return this.fireRadius.getRadiusPercent() === 0; },
        enumerable: true,
        configurable: true
    });
    Campfire.prototype.update = function (delta) {
        _super.prototype.update.call(this, delta);
        this.consumeItems();
        this.fireRadius.update(delta);
        var fireScale = 0.2 + this.fireRadius.getRadiusPercent();
        this.fireSprite.scaleX = fireScale;
        this.fireSprite.scaleY = fireScale;
        if (Random.boolean(5 * delta)) {
            this.fireSprite.offset.y = Random.int(0, 1);
        }
    };
    Campfire.prototype.extinguish = function () {
        this.fireSprite.alpha = 0;
    };
    Campfire.prototype.getBuffer = function () {
        return this.fireBuffer.getBuffer();
    };
    Campfire.prototype.getRadius = function () {
        return this.fireRadius.getRadius();
    };
    Campfire.prototype.startBurn = function () {
        this.fireRadius.startBurn();
    };
    Campfire.prototype.stopBurn = function () {
        this.fireRadius.stopBurn();
    };
    Campfire.prototype.win = function () {
        this.fireRadius.win();
    };
    Campfire.prototype.consumeItems = function () {
        var e_40, _a;
        var items = this.world.getWorldObjectsByType(Item).filter(function (item) { return item.consumable && !item.held; });
        try {
            for (var items_1 = __values(items), items_1_1 = items_1.next(); !items_1_1.done; items_1_1 = items_1.next()) {
                var item = items_1_1.value;
                if (_.contains(this.currentlyConsumedItems, item))
                    continue;
                if (item.offset.y < -5)
                    continue;
                if (M.distance(item.x, item.y, this.x, this.y) > this.logConsumptionRadius)
                    continue;
                this.consumeItem(item);
            }
        }
        catch (e_40_1) { e_40 = { error: e_40_1 }; }
        finally {
            try {
                if (items_1_1 && !items_1_1.done && (_a = items_1.return)) _a.call(items_1);
            }
            finally { if (e_40) throw e_40.error; }
        }
    };
    Campfire.prototype.consumeItem = function (item) {
        var _this = this;
        this.currentlyConsumedItems.push(item);
        item.beingConsumed = true;
        if (item.type === Item.Type.GASOLINE) {
            this.hasConsumedGasoline = true;
        }
        this.world.runScript(S.chain(item.type !== Item.Type.GASOLINE
            ? S.doOverTime(0.5, function (t) { item.alpha = 1 - t; })
            : S.doOverTime(4, function (t) {
                if (Random.boolean(1 - t)) {
                    item.alpha = 1 - item.alpha;
                }
                if (t == 1)
                    item.alpha = 0;
            }), S.call(function () {
            item.world.removeWorldObject(item);
            A.removeAll(_this.currentlyConsumedItems, item);
            if (!_this.hasConsumedGasoline) {
                _this.fireRadius.increaseTime();
                if (item.name !== 'start_log') {
                    // Don't increase the buffer for the first log (helps make the intro cutscene look good)
                    _this.fireBuffer.increaseBuffer();
                }
            }
        })));
    };
    return Campfire;
}(Sprite));
var Door = /** @class */ (function (_super) {
    __extends(Door, _super);
    function Door(config) {
        return _super.call(this, config, {
            texture: 'door',
            bounds: { x: -16, y: -4, width: 32, height: 4 },
            immovable: true,
        }) || this;
    }
    Door.prototype.onCollide = function (other) {
        if (other instanceof Item && other.type === Item.Type.KEY) {
            World.Actions.removeWorldObjectFromWorld(this);
            World.Actions.removeWorldObjectFromWorld(other);
        }
        if (other instanceof Player && other.isHoldingKey) {
            World.Actions.removeWorldObjectFromWorld(this);
            other.deleteHeldItem();
        }
    };
    return Door;
}(Sprite));
var FireBuffer = /** @class */ (function () {
    function FireBuffer() {
        this.bufferAtFull = 20;
        this.bufferIncrease = 16;
        this.decaySpeed = 4;
        this.buffer = this.bufferAtFull;
    }
    Object.defineProperty(FireBuffer.prototype, "baseBuffer", {
        get: function () { return this.buffer; },
        enumerable: true,
        configurable: true
    });
    FireBuffer.prototype.update = function (delta) {
        this.buffer -= this.decaySpeed * delta;
        this.buffer = M.clamp(this.buffer, this.bufferAtFull, Infinity);
    };
    FireBuffer.prototype.getBuffer = function () {
        return this.baseBuffer;
    };
    FireBuffer.prototype.increaseBuffer = function () {
        this.buffer += this.bufferIncrease;
    };
    return FireBuffer;
}());
var FireRadius = /** @class */ (function () {
    function FireRadius() {
        this.fullTime = 60;
        this.radiusAtFullTime = 200;
        this.timeGainedOnLogConsumptionAtZero = 25;
        this.timeGainedOnLogConsumptionAtFull = 10;
        this.timer = new Timer(this.fullTime);
        this.timer.time = this.fullTime / 2;
        this.timer.paused = true;
    }
    Object.defineProperty(FireRadius.prototype, "baseRadius", {
        get: function () { return this.radiusAtFullTime * (1 - this.timer.progress); },
        enumerable: true,
        configurable: true
    });
    FireRadius.prototype.update = function (delta) {
        this.timer.update(delta);
    };
    FireRadius.prototype.getRadius = function () {
        return this.baseRadius;
    };
    FireRadius.prototype.getRadiusPercent = function () {
        return this.getRadius() / this.radiusAtFullTime;
    };
    FireRadius.prototype.increaseTime = function () {
        var timeGainedOnLogConsumption = M.lerp(this.timeGainedOnLogConsumptionAtFull, this.timeGainedOnLogConsumptionAtZero, this.timer.progress);
        this.timer.time -= timeGainedOnLogConsumption;
    };
    FireRadius.prototype.startBurn = function () {
        this.timer.paused = false;
    };
    FireRadius.prototype.stopBurn = function () {
        this.timer.paused = true;
    };
    FireRadius.prototype.win = function () {
        this.timer.paused = false;
        this.timer.speed = -200;
    };
    return FireRadius;
}());
var Human = /** @class */ (function (_super) {
    __extends(Human, _super);
    function Human(config, defaults) {
        var _this = this;
        config = WorldObject.resolveConfig(config, defaults);
        _this = _super.call(this, config, {
            bounds: { x: -4, y: -2, width: 8, height: 4 },
            animations: Animations.emptyList('idle_empty', 'run_empty', 'idle_holding', 'run_holding', 'throw', 'swing', 'hurt'),
        }) || this;
        _this.stateMachine.addState('normal', {});
        _this.stateMachine.addState('swinging', {
            script: S.chain(S.wait(O.getOrDefault(config.preSwingWait, 0)), S.simul(S.doOverTime(Human.swingTime, function (t) {
                if (!_this.heldItem)
                    return;
                var angle = (_this.flipX ? -1 : 1) * 90 * Math.sin(Math.PI * Math.pow(t, 0.5));
                _this.heldItem.offset.x = Human.itemFullSwingOffsetX * Math.sin(M.degToRad(angle));
                _this.heldItem.offset.y = Human.itemOffsetY * -Math.cos(M.degToRad(angle));
                _this.heldItem.angle = angle;
                if (t === 1)
                    _this.heldItem.angle = 0;
            }), S.chain(S.call(function () { return _this.playAnimation('swing', 0, true); }), S.wait(Human.swingTime * 0.25), S.call(function () {
                _this.hitStuff();
            }))), S.wait(O.getOrDefault(config.postSwingWait, 0))),
            transitions: [
                { type: 'instant', toState: 'normal' }
            ]
        });
        _this.stateMachine.addState('hurt', {
            callback: function () {
                _this.playAnimation('hurt', 0, true);
                _this.dropHeldItem();
            },
            script: S.chain(S.doOverTime(0.5, function (t) {
                _this.offset.y = -16 * Math.exp(-4 * t) * Math.abs(Math.sin(4 * Math.PI * t * t));
            }), S.waitUntil(function () { return !_this.getCurrentAnimationName().startsWith('hurt'); }), S.call(function () {
                _this.alpha = 1;
            })),
            transitions: [
                { type: 'instant', toState: 'normal' }
            ]
        });
        _this.setState('normal');
        _this.speed = O.getOrDefault(config.speed, 40);
        _this.itemGrabDistance = O.getOrDefault(config.itemGrabDistance, 16);
        _this.direction = Direction2D.RIGHT;
        return _this;
    }
    Object.defineProperty(Human.prototype, "moving", {
        get: function () { return Math.abs(this.vx) > 1 || Math.abs(this.vy) > 1; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Human.prototype, "immobile", {
        get: function () { return this.state === 'hurt'; },
        enumerable: true,
        configurable: true
    });
    Human.prototype.update = function (delta) {
        var haxis = (this.controller.right ? 1 : 0) - (this.controller.left ? 1 : 0);
        var vaxis = (this.controller.down ? 1 : 0) - (this.controller.up ? 1 : 0);
        this.updateMovement(haxis, vaxis);
        _super.prototype.update.call(this, delta);
        if (this.heldItem) {
            this.heldItem.flipX = this.flipX;
        }
        if (this.controller.useItem) {
            this.handleItemUse();
        }
        if (this.controller.pickupDropItem) {
            this.handleItemPickupDrop();
        }
        // Handle animation.
        var anim_state = (haxis == 0 && vaxis == 0) ? 'idle' : 'run';
        var holding = this.heldItem ? 'holding' : 'empty';
        this.playAnimation(anim_state + "_" + holding);
    };
    Human.prototype.render = function (screen) {
        _super.prototype.render.call(this, screen);
        if (this.debugBounds) {
            var shb = this.getSwingHitbox();
            Draw.brush.color = 0x00FF00;
            Draw.rectangleOutline(screen, shb.x, shb.y, shb.width, shb.height);
        }
    };
    Human.prototype.updateMovement = function (haxis, vaxis) {
        if (this.immobile) {
            haxis = 0;
            vaxis = 0;
        }
        if (haxis < 0) {
            this.vx = -this.speed;
            this.direction.h = Direction.LEFT;
            if (vaxis == 0)
                this.direction.v = Direction.NONE;
            this.flipX = true;
        }
        else if (haxis > 0) {
            this.vx = this.speed;
            this.direction.h = Direction.RIGHT;
            if (vaxis == 0)
                this.direction.v = Direction.NONE;
            this.flipX = false;
        }
        else {
            this.vx = 0;
        }
        if (vaxis < 0) {
            this.vy = -this.speed;
            this.direction.v = Direction.UP;
            if (haxis == 0)
                this.direction.h = Direction.NONE;
        }
        else if (vaxis > 0) {
            this.vy = this.speed;
            this.direction.v = Direction.DOWN;
            if (haxis == 0)
                this.direction.h = Direction.NONE;
        }
        else {
            this.vy = 0;
        }
    };
    Human.prototype.getOverlappingItem = function () {
        var e_41, _a;
        var overlappingItemDistance = Infinity;
        var overlappingItem = undefined;
        try {
            for (var _b = __values(this.world.getWorldObjectsByType(Item)), _c = _b.next(); !_c.done; _c = _b.next()) {
                var item = _c.value;
                if (item.held)
                    continue;
                var distance = M.distance(this.x, this.y, item.x, item.y);
                if (distance < this.itemGrabDistance && distance < overlappingItemDistance && !item.beingConsumed) {
                    overlappingItem = item;
                    overlappingItemDistance = distance;
                }
            }
        }
        catch (e_41_1) { e_41 = { error: e_41_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_41) throw e_41.error; }
        }
        return overlappingItem;
    };
    Human.prototype.handleItemPickupDrop = function () {
        if (this.state === 'swinging')
            return;
        if (this.immobile)
            return;
        var overlappingItem = this.getOverlappingItem();
        if (this.heldItem) {
            this.dropHeldItem();
            if (this.moving)
                return;
        }
        if (overlappingItem) {
            this.pickupItem(overlappingItem);
        }
    };
    Human.prototype.handleItemUse = function () {
        if (!this.heldItem)
            return;
        if (!this.heldItem.usable)
            return;
        if (this.immobile)
            return;
        this.swingItem();
    };
    Human.prototype.pickupItem = function (item) {
        if (!item)
            return;
        this.heldItem = this.addChild(item);
        this.heldItem.localx = 0;
        this.heldItem.localy = 0;
        this.heldItem.vx = 0;
        this.heldItem.vy = 0;
        this.heldItem.angle = 0;
        this.heldItem.offset.x = 0;
        this.heldItem.offset.y = -Human.itemOffsetY;
        World.Actions.setPhysicsGroup(this.heldItem, null);
    };
    Human.prototype.dropHeldItem = function () {
        if (!this.heldItem)
            return;
        var droppedItem = this.removeChild(this.heldItem);
        droppedItem.x = this.x;
        droppedItem.y = this.y;
        droppedItem.offset.x = 0;
        droppedItem.offset.y = 0;
        droppedItem.flipX = this.heldItem.flipX;
        World.Actions.setPhysicsGroup(droppedItem, 'items');
        this.heldItem = null;
        if (this.getCurrentAnimationName() === 'hurt') {
            // toss randomly
            droppedItem.offset.x = 0;
            droppedItem.offset.y = -Human.itemOffsetY;
            var v = Random.onCircle(Human.hurtDropSpeed);
            droppedItem.vx = v.x;
            droppedItem.vy = v.y;
            return;
        }
        if (this.moving) {
            // throw instead of drop
            droppedItem.offset.x = 0;
            droppedItem.offset.y = -Human.itemOffsetY;
            droppedItem.vx = Human.throwSpeed * Math.sign(this.vx);
            droppedItem.vy = Human.throwSpeed * Math.sign(this.vy);
            this.playAnimation('throw', 0, true);
            return;
        }
    };
    Human.prototype.deleteHeldItem = function () {
        if (!this.heldItem)
            return;
        this.heldItem.removeFromWorld();
        this.heldItem = null;
    };
    Human.prototype.hit = function () {
        this.setState('hurt');
    };
    Human.prototype.swingItem = function () {
        if (this.state === 'hurt' || this.state === 'swinging')
            return;
        this.setState('swinging');
    };
    Human.prototype.hitStuff = function () { };
    Human.prototype.getSwingHitbox = function () {
        return { x: this.x, y: this.y, width: 0, height: 0 };
    };
    Human.throwSpeed = 80;
    Human.hurtDropSpeed = 40;
    Human.swingTime = 0.15;
    Human.itemOffsetY = 20;
    Human.itemFullSwingOffsetX = 10;
    return Human;
}(Sprite));
var Item = /** @class */ (function (_super) {
    __extends(Item, _super);
    function Item(config) {
        var _this = _super.call(this, config, {
            texture: config.type,
            bounds: { x: 0, y: 0, width: 0, height: 0 },
            bounce: 1,
        }) || this;
        _this.friction = 20000;
        _this.zGravity = 100;
        _this.type = config.type;
        _this.vz = 0;
        _this.beingConsumed = false;
        return _this;
    }
    Object.defineProperty(Item.prototype, "usable", {
        get: function () {
            return this.type !== Item.Type.KEY && this.type !== Item.Type.GASOLINE;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Item.prototype, "cutsTrees", {
        get: function () {
            return this.type === Item.Type.AXE || this.type === Item.Type.MONSTERAXE;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Item.prototype, "hurtsMonster", {
        get: function () {
            return this.type === Item.Type.AXE || this.type === Item.Type.MONSTERAXE || this.type === Item.Type.LOG;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Item.prototype, "consumable", {
        get: function () {
            return this.type === Item.Type.LOG || this.type === Item.Type.GASOLINE;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Item.prototype, "held", {
        get: function () { return !!this.parent; },
        enumerable: true,
        configurable: true
    });
    Item.prototype.update = function (delta) {
        if (!this.held) {
            this.updateMovement(delta);
        }
        _super.prototype.update.call(this, delta);
        if (this.type === Item.Type.TORCH) {
            Item.updateTorchFireSprite(this);
        }
    };
    Item.prototype.updateMovement = function (delta) {
        this.offset.y = Math.min(0, this.offset.y + this.vz * delta);
        this.vz += this.zGravity * delta;
        if (this.offset.y == 0) {
            this.vz = 0;
            if (this.vx > 0) {
                this.vx = Math.max(0, this.vx - this.friction * delta);
            }
            else if (this.vx < 0) {
                this.vx = Math.min(0, this.vx + this.friction * delta);
            }
            if (this.vy > 0) {
                this.vy = Math.max(0, this.vy - this.friction * delta);
            }
            else if (this.vy < 0) {
                this.vy = Math.min(0, this.vy + this.friction * delta);
            }
        }
    };
    return Item;
}(Sprite));
(function (Item) {
    var Type;
    (function (Type) {
        Type["LOG"] = "log";
        Type["AXE"] = "axe";
        Type["MONSTERAXE"] = "monsteraxe";
        Type["KEY"] = "key";
        Type["TORCH"] = "torch";
        Type["GASOLINE"] = "gasoline";
    })(Type = Item.Type || (Item.Type = {}));
})(Item || (Item = {}));
var ItemName = /** @class */ (function (_super) {
    __extends(ItemName, _super);
    function ItemName(config) {
        var _this = _super.call(this, config) || this;
        _this.style.color = 0x555555;
        return _this;
    }
    ItemName.prototype.update = function (delta) {
        _super.prototype.update.call(this, delta);
        this.localy -= 16 * delta;
        this.style.alpha = 1 - Math.pow(this.life.progress, 2);
    };
    return ItemName;
}(SpriteText));
(function (Item) {
    function updateTorchFireSprite(item) {
        var torchFire = item.getChildByName('torchFire');
        var torchLightManager = item.world.getWorldObjectByType(TorchLightManager);
        var torchScale = torchLightManager.torchFuel;
        torchFire.scaleX = 0.7 * torchScale;
        torchFire.scaleY = 0.7 * torchScale;
        torchFire.offset.x = item.offset.x;
        torchFire.offset.y = item.offset.y - 4;
    }
    Item.updateTorchFireSprite = updateTorchFireSprite;
})(Item || (Item = {}));
/// <reference path="../lectvs/menu.ts" />
var IntroMenu = /** @class */ (function (_super) {
    __extends(IntroMenu, _super);
    function IntroMenu(menuSystem) {
        var _this = _super.call(this, menuSystem, {
            backgroundColor: 0x000000,
            worldObjects: [
                {
                    constructor: SpriteText,
                    name: 'introtext',
                    x: 20, y: 80, text: "- a game by hayden mccraw -",
                    font: Assets.fonts.DELUXE16, style: { color: 0xFFFFFF },
                },
            ]
        }) || this;
        var introtext = _this.getWorldObjectByName('introtext');
        introtext.x = Main.width / 2 - introtext.getTextWidth() / 2;
        introtext.y = Main.height / 2 - introtext.getTextHeight() / 2;
        _this.runScript(S.chain(S.wait(1.5), S.call(function () {
            introtext.setText("- made in 48 hours\n  for ludum dare 46 -");
            introtext.x = Main.width / 2 - introtext.getTextWidth() / 2;
            introtext.y = Main.height / 2 - introtext.getTextHeight() / 2;
        }), S.wait(1.5), S.call(function () { menuSystem.loadMenu(MainMenu); })));
        return _this;
    }
    return IntroMenu;
}(Menu));
var MainMenu = /** @class */ (function (_super) {
    __extends(MainMenu, _super);
    function MainMenu(menuSystem) {
        return _super.call(this, menuSystem, {
            backgroundColor: 0x000000,
            worldObjects: [
                {
                    constructor: SpriteText,
                    x: 20, y: 20, text: "- a night in the dark -",
                    font: Assets.fonts.DELUXE16, style: { color: 0xFFFFFF },
                },
                {
                    constructor: MenuTextButton,
                    x: 20, y: 50, text: "start game",
                    font: Assets.fonts.DELUXE16, style: { color: 0xFFFFFF },
                    onClick: function () { return menuSystem.game.startGame(); },
                },
                {
                    constructor: MenuTextButton,
                    x: 20, y: 68, text: "controls",
                    font: Assets.fonts.DELUXE16, style: { color: 0xFFFFFF },
                    onClick: function () { return menuSystem.loadMenu(ControlsMenu); },
                },
            ]
        }) || this;
    }
    return MainMenu;
}(Menu));
var ControlsMenu = /** @class */ (function (_super) {
    __extends(ControlsMenu, _super);
    function ControlsMenu(menuSystem) {
        var _this = _super.call(this, menuSystem, {
            backgroundColor: 0x000000,
            physicsGroups: { 'items': {} },
            worldObjects: [
                {
                    constructor: SpriteText,
                    x: 20, y: 15, text: "controls",
                    font: Assets.fonts.DELUXE16, style: { color: 0xFFFFFF },
                },
                {
                    constructor: SpriteText,
                    x: 20, y: 42, text: "arrows <^> - move\n\n" +
                        "c - pickup\n" +
                        "    drop\n" +
                        "    throw\n\n" +
                        "x - attack",
                    font: Assets.fonts.DELUXE16, style: { color: 0xFFFFFF },
                },
                {
                    constructor: Player,
                    name: 'player_move',
                    x: 180, y: 53,
                    effects: { outline: { color: 0xFFFFFF } }
                },
                {
                    constructor: Player,
                    name: 'player_pickup',
                    x: 140, y: 90,
                    effects: { outline: { color: 0xFFFFFF } }
                },
                {
                    constructor: Item,
                    name: 'log',
                    x: 140, y: 90,
                    type: Item.Type.LOG,
                },
                {
                    constructor: Player,
                    name: 'player_attack',
                    x: 140, y: 154,
                    effects: { outline: { color: 0xFFFFFF } }
                },
                {
                    constructor: Item,
                    name: 'axe',
                    x: 140, y: 156,
                    type: Item.Type.AXE,
                    effects: { outline: { color: 0xFFFFFF } }
                },
                {
                    constructor: Tree,
                    name: 'tree',
                    x: 160, y: 156,
                    effects: { outline: { color: 0xFFFFFF } }
                },
                {
                    constructor: MenuTextButton,
                    x: 20, y: 160, text: "back",
                    font: Assets.fonts.DELUXE16, style: { color: 0xFFFFFF },
                    onClick: function () { return menuSystem.back(); },
                },
            ]
        }) || this;
        var player_move = _this.getWorldObjectByName('player_move');
        player_move.test = true;
        var player_pickup = _this.getWorldObjectByName('player_pickup');
        player_pickup.test = true;
        var player_attack = _this.getWorldObjectByName('player_attack');
        player_attack.test = true;
        var tree = _this.getWorldObjectByName('tree');
        tree.setTexture('blacktree');
        _this.runScript(S.simul(S.loopFor(Infinity, S.chain(S.doOverTime(0.8, function (t) { player_move.controller.right = true; }), S.doOverTime(0.8, function (t) { player_move.controller.left = true; }))), S.loopFor(Infinity, S.chain(S.wait(0.5), S.call(function () { player_pickup.controller.pickupDropItem = true; }), S.wait(0.5), S.call(function () { player_pickup.controller.pickupDropItem = true; }), S.wait(0.5), S.call(function () { player_pickup.controller.pickupDropItem = true; }), S.wait(0.5), S.simul(S.doOverTime(1.5, function (t) { player_pickup.controller.right = true; }), S.chain(S.wait(0.2), S.call(function () { player_pickup.controller.pickupDropItem = true; }))), S.yield(), S.call(function () { player_pickup.flipX = true; }), S.wait(0.5), S.call(function () { player_pickup.controller.pickupDropItem = true; }), S.wait(0.5), S.simul(S.doOverTime(1.5, function (t) { player_pickup.controller.left = true; }), S.chain(S.wait(0.2), S.call(function () { player_pickup.controller.pickupDropItem = true; }))), S.yield(), S.call(function () { player_pickup.flipX = false; }))), S.loopFor(Infinity, S.chain(S.call(function () {
            var log = _this.getWorldObjectByName('log');
            log.effects.outline.enabled = true;
            log.effects.outline.color = 0xFFFFFF;
        }), S.call(function () {
            var axe = _this.getWorldObjectByName('axe');
            axe.effects.outline.enabled = true;
            axe.effects.outline.color = 0xFFFFFF;
        }), S.wait(0.01))), S.chain(S.call(function () { player_attack.controller.pickupDropItem = true; }), S.loopFor(Infinity, S.chain(S.wait(0.5), S.call(function () { player_attack.controller.useItem = true; }), S.call(function () { tree.heal(); }))))));
        return _this;
    }
    return ControlsMenu;
}(Menu));
var PauseMenu = /** @class */ (function (_super) {
    __extends(PauseMenu, _super);
    function PauseMenu(menuSystem) {
        return _super.call(this, menuSystem, {
            backgroundColor: 0x000000,
            worldObjects: [
                {
                    constructor: SpriteText,
                    x: 20, y: 20, text: "- paused -",
                    font: Assets.fonts.DELUXE16, style: { color: 0xFFFFFF },
                },
                {
                    constructor: MenuTextButton,
                    x: 20, y: 50, text: "resume",
                    font: Assets.fonts.DELUXE16, style: { color: 0xFFFFFF },
                    onClick: function () { return menuSystem.game.unpauseGame(); },
                }
            ]
        }) || this;
    }
    return PauseMenu;
}(Menu));
/// <reference path="../lectvs/preload.ts" />
/// <reference path="./assets.ts" />
var Main = /** @class */ (function () {
    function Main() {
    }
    Object.defineProperty(Main, "width", {
        get: function () { return 240; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Main, "height", {
        get: function () { return 180; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Main, "backgroundColor", {
        get: function () { return 0x000000; },
        enumerable: true,
        configurable: true
    });
    // no need to modify
    Main.preload = function () {
        PIXI.utils.sayHello(PIXI.utils.isWebGLSupported() ? 'WebGL' : 'Canvas');
        PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
        global.gameWidth = Main.width;
        global.gameHeight = Main.height;
        global.backgroundColor = Main.backgroundColor;
        Main.renderer = PIXI.autoDetectRenderer({
            width: global.gameWidth,
            height: global.gameHeight,
            resolution: 4,
            backgroundColor: global.backgroundColor,
        });
        global.renderer = Main.renderer;
        Preload.preload({
            textures: Assets.textures,
            pyxelTilemaps: Assets.pyxelTilemaps,
            onLoad: function () {
                Main.load();
                Main.play();
            }
        });
    };
    // modify this method
    Main.load = function () {
        document.body.appendChild(Main.renderer.view);
        Main.screen = new Texture(Main.width, Main.height);
        Input.setKeys({
            'left': ['ArrowLeft'],
            'right': ['ArrowRight'],
            'up': ['ArrowUp'],
            'down': ['ArrowDown'],
            'useItem': ['x'],
            'pickupDropItem': ['c'],
            'interact': ['e'],
            'advanceDialog': ['MouseLeft', 'e', ' '],
            'pause': ['Escape', 'Backspace'],
            'debugMoveCameraUp': ['i'],
            'debugMoveCameraDown': ['k'],
            'debugMoveCameraLeft': ['j'],
            'debugMoveCameraRight': ['l'],
            '1': ['1'],
            '2': ['2'],
            '3': ['3'],
            '4': ['4'],
            '5': ['5'],
            '6': ['6'],
            '7': ['7'],
            '8': ['8'],
            '9': ['9'],
            '0': ['0'],
            'lmb': ['MouseLeft'],
        });
        window.addEventListener("keydown", function (event) { return Input.handleKeyDownEvent(event); }, false);
        window.addEventListener("keyup", function (event) { return Input.handleKeyUpEvent(event); }, false);
        window.addEventListener("mousedown", function (event) { return Input.handleMouseDownEvent(event); }, false);
        window.addEventListener("mouseup", function (event) { return Input.handleMouseUpEvent(event); }, false);
        window.addEventListener("contextmenu", function (event) { return event.preventDefault(); }, false);
        Debug.init({
            mousePositionFont: Assets.fonts.DELUXE16,
        });
        this.game = new Game({
            mainMenuClass: IntroMenu,
            pauseMenuClass: PauseMenu,
            theaterClass: Theater,
            theaterConfig: {
                stages: stages,
                stageToLoad: 'game',
                stageEntryPoint: 'main',
                story: {
                    storyboard: storyboard,
                    storyboardPath: ['start'],
                    storyEvents: storyEvents,
                    storyConfig: storyConfig,
                },
                party: party,
                dialogBox: {
                    constructor: DialogBox,
                    x: Main.width / 2, y: Main.height - 32,
                    texture: 'none',
                    spriteTextFont: Assets.fonts.DELUXE16,
                    textAreaFull: { x: -114, y: -27, width: 228, height: 54 },
                    textAreaPortrait: { x: -114, y: -27, width: 158, height: 54 },
                    portraitPosition: { x: 78, y: 0 },
                    advanceKey: 'advanceDialog',
                },
            },
        });
        global.game = Main.game;
    };
    // no need to modify
    Main.play = function () {
        PIXI.Ticker.shared.add(function (frameDelta) {
            Main.delta = frameDelta / 60;
            global.clearStacks();
            for (var i = 0; i < Debug.SKIP_RATE; i++) {
                Input.update();
                Main.game.update(Main.delta);
            }
            Main.screen.clear();
            Main.game.render(Main.screen);
            Main.renderer.render(Utils.NOOP_DISPLAYOBJECT, undefined, true); // Clear the renderer
            Main.renderer.render(Main.screen.renderTextureSprite);
        });
    };
    return Main;
}());
// Actually load the game
Main.preload();
/// <reference path="main.ts" />
var party = {
    leader: 'sai',
    activeMembers: ['sai', 'dad'],
    members: {
        'player': {
            config: {
                name: 'player',
                constructor: Sprite,
                x: Main.width / 2 - 8, y: Main.height / 2 - 8,
                texture: 'debug',
            },
            stage: 'none',
        },
    }
};
var Monster = /** @class */ (function (_super) {
    __extends(Monster, _super);
    function Monster(config) {
        var _this = _super.call(this, config, {
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
                Animations.fromTextureList({ name: 'hurt', texturePrefix: 'monster_', textures: [24], frameRate: 1 / 6, count: 1, forceRequired: true, nextFrameRef: 'hurt_shake/0' }),
                Animations.fromTextureList({ name: 'hurt_shake', texturePrefix: 'monster_', textures: [20, 20, 20, 20, 20, 20, 20, 20,
                        21, 22, 23, 22, 21, 22, 23, 22], frameRate: 8, count: 1, forceRequired: true }),
                Animations.fromTextureList({ name: 'pickup', texturePrefix: 'monster_', textures: [25], frameRate: 2, count: 1, forceRequired: true, nextFrameRef: 'idle_holding/0' }),
            ]
        }) || this;
        _this.attackdx = 0;
        _this.attackdy = 0;
        _this.pickupItem(new Item({
            name: 'monsteraxe',
            constructor: Item,
            type: Item.Type.AXE,
            layer: _this.layer,
        }));
        return _this;
    }
    Object.defineProperty(Monster.prototype, "pickingUp", {
        get: function () { return this.pickupScript && !this.pickupScript.done; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Monster.prototype, "immobile", {
        get: function () { return this.state === 'hurt' || this.state === 'swinging' || this.pickingUp; },
        enumerable: true,
        configurable: true
    });
    Monster.prototype.update = function (delta) {
        var player = this.world.getWorldObjectByType(Player);
        var axe = this.getClosestAxe();
        var target = this.heldItem ? player : axe;
        this.setControllerInput(target);
        _super.prototype.update.call(this, delta);
        this.handlePickup();
        this.setAttackD(player);
        this.handleAttacking(player);
    };
    Monster.prototype.getClosestAxe = function () {
        var _this = this;
        var axes = this.world.getWorldObjectsByType(Item).filter(function (item) { return item.type === Item.Type.AXE; });
        return M.argmin(axes, function (axe) { return M.distance(_this.x, _this.y, axe.x, axe.y); });
    };
    Monster.prototype.handleAttacking = function (target) {
        if (!this.world)
            return;
        if (this.immobile)
            return;
        if (!this.heldItem)
            return;
        if (M.distance(this.x, this.y, target.x, target.y) < Monster.attackDistance) {
            this.swingItem();
        }
    };
    Monster.prototype.handlePickup = function () {
        var _this = this;
        if (this.heldItem || this.pickingUp)
            return;
        var overlappingItem = this.getOverlappingItem();
        if (overlappingItem && overlappingItem.type === Item.Type.AXE) {
            this.pickupScript = this.runScript(S.chain(S.call(function () {
                _this.playAnimation('pickup');
            }), S.waitUntil(function () { return _this.getCurrentAnimationName() !== 'pickup'; }), S.call(function () {
                _this.controller.pickupDropItem = true;
            })));
        }
    };
    Monster.prototype.setControllerInput = function (target) {
        var haxis = 0;
        var vaxis = 0;
        if (!this.immobile) {
            haxis = target.x - this.x;
            vaxis = target.y - this.y;
            if (-2 < haxis && haxis < 2)
                haxis = 0;
            if (-2 < vaxis && vaxis < 2)
                vaxis = 0;
        }
        this.controller.left = haxis < 0;
        this.controller.right = haxis > 0;
        this.controller.up = vaxis < 0;
        this.controller.down = vaxis > 0;
    };
    Monster.prototype.setAttackD = function (target) {
        if (this.immobile)
            return;
        this.attackdx = target.x - this.x;
        this.attackdy = target.y - this.y;
        var mag = M.magnitude(this.attackdx, this.attackdy);
        if (mag !== 0) {
            this.attackdx /= mag;
            this.attackdy /= mag;
        }
    };
    Monster.prototype.hitStuff = function () {
        if (!this.world)
            return;
        if (!this.heldItem)
            return;
        var player = this.world.getWorldObjectByType(Player);
        var swingHitbox = this.getSwingHitbox();
        if (player.isOverlappingRect(swingHitbox)) {
            player.hit();
        }
    };
    Monster.prototype.getSwingHitbox = function () {
        return {
            x: this.x - 8 + this.attackdx * 8,
            y: this.y - 8 + this.attackdy * 8,
            width: 16,
            height: 16
        };
    };
    Monster.attackDistance = 16;
    return Monster;
}(Human));
/// <reference path="human.ts" />
var Player = /** @class */ (function (_super) {
    __extends(Player, _super);
    function Player(config) {
        var _this = _super.call(this, config, {
            speed: 40,
            preSwingWait: 0,
            postSwingWait: 0,
            itemGrabDistance: 16,
            animations: [
                Animations.fromTextureList({ name: 'idle_empty', texturePrefix: 'player_', textures: [0, 1, 2], frameRate: 8, count: -1 }),
                Animations.fromTextureList({ name: 'run_empty', texturePrefix: 'player_', textures: [4, 5, 6, 7], frameRate: 16, count: -1 }),
                Animations.fromTextureList({ name: 'idle_holding', texturePrefix: 'player_', textures: [8, 9, 10], frameRate: 8, count: -1 }),
                Animations.fromTextureList({ name: 'run_holding', texturePrefix: 'player_', textures: [12, 13, 14, 15], frameRate: 16, count: -1 }),
                Animations.fromTextureList({ name: 'throw', texturePrefix: 'player_', textures: [16, 17, 17, 17, 17], frameRate: 24, count: 1, forceRequired: true }),
                Animations.fromTextureList({ name: 'swing', texturePrefix: 'player_', textures: [16, 17, 17, 17, 16], frameRate: 24, count: 1, forceRequired: true }),
                Animations.fromTextureList({ name: 'hurt', texturePrefix: 'player_', textures: [20, 20, 20, 20, 20, 20, 20, 20,
                        21, 22, 23, 22, 21, 22, 23, 22], frameRate: 16, count: 1, forceRequired: true }),
                Animations.fromTextureList({ name: 'intro_idle', texturePrefix: 'player_', textures: [0, 1, 2], frameRate: 2, count: 3, forceRequired: true }),
            ],
        }) || this;
        _this.controllerSchema = {
            left: function () { return Input.isDown('left'); },
            right: function () { return Input.isDown('right'); },
            up: function () { return Input.isDown('up'); },
            down: function () { return Input.isDown('down'); },
            useItem: function () { return Input.justDown('useItem'); },
            pickupDropItem: function () { return Input.justDown('pickupDropItem'); },
        };
        return _this;
    }
    Object.defineProperty(Player.prototype, "isHoldingKey", {
        get: function () { return this.heldItem && this.heldItem.type === Item.Type.KEY; },
        enumerable: true,
        configurable: true
    });
    Player.prototype.update = function (delta) {
        _super.prototype.update.call(this, delta);
        this.updateItemOutlines();
    };
    Player.prototype.updateItemOutlines = function () {
        var overlappingItem = this.getOverlappingItem();
        if (!this.test) {
            this.world.getWorldObjectsByType(Item).map(function (item) { return item.effects.outline.enabled = false; });
        }
        if (overlappingItem) {
            overlappingItem.effects.outline.color = 0xFFFF00;
            overlappingItem.effects.outline.enabled = true;
        }
    };
    Player.prototype.pickupItem = function (item) {
        _super.prototype.pickupItem.call(this, item);
        if (this.world && this.world.getLayerByName('above')) {
            var itemName = new ItemName({ text: item.type, font: Assets.fonts.DELUXE16, life: 1, layer: 'above' });
            itemName.x = -itemName.getTextWidth() / 2;
            itemName.y = -32;
            this.addChild(itemName);
        }
    };
    Player.prototype.hitStuff = function () {
        var e_42, _a;
        if (!this.heldItem)
            return;
        var swingHitbox = this.getSwingHitbox();
        try {
            for (var _b = __values(this.world.worldObjects), _c = _b.next(); !_c.done; _c = _b.next()) {
                var obj = _c.value;
                if (this.heldItem.cutsTrees && obj instanceof Tree && obj.isOverlappingRect(swingHitbox)) {
                    obj.hit();
                }
                if (this.heldItem.hurtsMonster && obj instanceof Monster && obj.isOverlappingRect(swingHitbox)) {
                    obj.hit();
                }
            }
        }
        catch (e_42_1) { e_42 = { error: e_42_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_42) throw e_42.error; }
        }
    };
    Player.prototype.getSwingHitbox = function () {
        return {
            x: this.x - 10 + (this.flipX ? -1 : 1) * 10,
            y: this.y - 8 - 18,
            width: 20,
            height: 36
        };
    };
    return Player;
}(Human));
var TorchLightManager = /** @class */ (function (_super) {
    __extends(TorchLightManager, _super);
    function TorchLightManager(config) {
        var _this = _super.call(this, config) || this;
        _this.torchRefuelDistance = 16;
        _this.torchFuelEmptyThreshold = 0.1;
        _this.torchFuel = 0;
        _this.torchRadiusNoise = 0;
        return _this;
    }
    Object.defineProperty(TorchLightManager.prototype, "torchLightX", {
        get: function () {
            if (!this.world.hasWorldObject('torch')) {
                return 0;
            }
            var torch = this.world.getWorldObjectByName('torch');
            return torch.x + torch.offset.x;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TorchLightManager.prototype, "torchLightY", {
        get: function () {
            if (!this.world.hasWorldObject('torch')) {
                return 0;
            }
            var torch = this.world.getWorldObjectByName('torch');
            return torch.y + torch.offset.y;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TorchLightManager.prototype, "torchLightRadius", {
        get: function () {
            if (!this.world.hasWorldObject('torch') || /*this.world.getWorldObjectByType(Campfire).hitEffect ||*/ global.theater.storyManager.currentNodeName === 'lose') {
                return 0;
            }
            var radius = Math.pow(this.torchFuel, 0.7) * 40;
            return radius === 0 ? 0 : radius + this.torchRadiusNoise;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TorchLightManager.prototype, "torchLightBuffer", {
        get: function () { return Math.pow(this.torchFuel, 0.7) * 10; },
        enumerable: true,
        configurable: true
    });
    TorchLightManager.prototype.update = function (delta) {
        if (this.world.hasWorldObject('torch')) {
            var torch = this.world.getWorldObjectByName('torch');
            var campfire = this.world.getWorldObjectByType(Campfire);
            var oldTorchFuel = this.torchFuel;
            this.torchFuel -= 0.03 * delta;
            if (M.distance(campfire.x, campfire.y, torch.x, torch.y) < this.torchRefuelDistance) {
                this.torchFuel += 1 * delta;
            }
            this.torchFuel = M.clamp(this.torchFuel, 0, 1);
            if (this.torchFuel <= this.torchFuelEmptyThreshold && oldTorchFuel > this.torchFuelEmptyThreshold) {
                this.torchFuel = 0;
                this.world.getWorldObjectByName('torchFire').addChild({
                    constructor: Sprite,
                    x: 0, y: 0,
                    texture: 'smoke',
                    scaleX: 0.5, scaleY: 0.5,
                    layer: 'above',
                    life: 2,
                    updateCallback: function (smoke, delta) {
                        var t = smoke.life.progress;
                        var torchFire = smoke.parent;
                        smoke.offset.x = torchFire.offset.x + 2 * Math.exp(-t) * Math.sin(4 * Math.PI * t);
                        smoke.offset.y = torchFire.offset.y + -16 * t;
                        smoke.alpha = 1 - t;
                    }
                });
            }
        }
        if (Random.boolean(10 * delta)) {
            this.torchRadiusNoise = Random.float(-1, 1);
        }
        _super.prototype.update.call(this, delta);
    };
    return TorchLightManager;
}(WorldObject));
var Tree = /** @class */ (function (_super) {
    __extends(Tree, _super);
    function Tree(config) {
        var _this = _super.call(this, config, {
            texture: Random.boolean() ? 'blacktree' : 'whitetree',
            flipX: Random.boolean(),
            bounds: { x: -4, y: -2, width: 8, height: 3 },
        }) || this;
        _this.maxhp = 3;
        _this.stateMachine.addState('normal', {});
        _this.stateMachine.addState('hurt', {
            script: S.doOverTime(0.5, function (t) { _this.angle = 30 * Math.exp(5 * -t) * Math.cos(5 * t); }),
            transitions: [{ type: 'instant', toState: 'normal' }]
        });
        _this.stateMachine.addState('die', {
            script: S.chain(S.doOverTime(0.5, function (t) { _this.angle = 30 * Math.exp(5 * -t) * Math.cos(5 * t); }), S.call(function () {
                _this.colliding = false;
            }), S.doOverTime(1, function (t) { _this.angle = 90 * (t + t * t) / 2; }), S.call(function () {
                _this.spawnLog();
                if (_this.spawnsTorch)
                    _this.spawnTorch();
                _this.kill();
            }))
        });
        _this.hp = _this.maxhp;
        _this.spawnsTorch = O.getOrDefault(_this.data.spawnsTorch, false);
        return _this;
    }
    Tree.prototype.hit = function () {
        if (this.state === 'die')
            return;
        this.hp--;
        if (this.hp > 0) {
            this.setState('hurt');
        }
        else {
            this.setState('die');
        }
    };
    Tree.prototype.heal = function () {
        this.hp = this.maxhp;
    };
    Tree.prototype.spawnLog = function () {
        this.world.addWorldObject({
            constructor: Item,
            x: this.x + 16, y: this.y,
            layer: 'main',
            offset: { x: 0, y: -8 },
            physicsGroup: 'items',
            type: Item.Type.LOG,
        });
    };
    Tree.prototype.spawnTorch = function () {
        this.world.addWorldObject({
            name: 'torch',
            constructor: Item,
            x: this.x, y: this.y,
            layer: 'main',
            offset: { x: 0, y: -12 },
            physicsGroup: 'items',
            type: Item.Type.TORCH,
            children: [{
                    name: 'torchFire',
                    parent: fireSpriteConfig(),
                    layer: 'main'
                }],
        });
    };
    return Tree;
}(Sprite));
/// <reference path="base.ts" />
/// <reference path="campfire.ts" />
/// <reference path="door.ts" />
/// <reference path="item.ts" />
/// <reference path="lightingManager.ts" />
/// <reference path="main.ts" />
/// <reference path="monster.ts" />
/// <reference path="player.ts" />
/// <reference path="torchLightManager.ts" />
/// <reference path="tree.ts" />
var stages = {
    'game': {
        parent: BASE_STAGE(),
        camera: {
            movement: { type: 'smooth', speed: 0, deadZoneWidth: 0, deadZoneHeight: 0 },
            mode: Camera.Mode.FOLLOW('player', 0, -8),
        },
        entryPoints: {
            'main': { x: Main.width / 2, y: Main.height / 2 },
        },
        worldObjects: __spread([
            WORLD_BOUNDS(0, 0, Main.width, Main.height),
            {
                constructor: LightingManager,
            },
            {
                constructor: TorchLightManager,
            },
            {
                constructor: Tilemap,
                x: 0, y: 0,
                tilemap: 'world',
                tilemapLayer: 1,
                layer: 'bg',
            },
            {
                constructor: Tilemap,
                x: 0, y: 0,
                tilemap: 'world',
                tilemapLayer: 0,
                layer: 'fg',
                physicsGroup: 'walls',
            },
            {
                name: 'ground',
                constructor: Sprite,
                x: 400, y: 400,
                texture: 'ground',
                layer: 'bg',
            },
            {
                name: 'campfire',
                constructor: Campfire,
                x: 400, y: 400,
                layer: 'main',
            },
            {
                name: 'player',
                constructor: Player,
                controllable: true,
                x: 387, y: 394,
                flipX: false,
                layer: 'main',
                physicsGroup: 'player',
            },
            {
                name: 'door',
                constructor: Door,
                x: 400, y: 240,
                layer: 'main',
                physicsGroup: 'props',
            }
        ], [
            { x: 424, y: 296 },
            { x: 344, y: 344 },
            { x: 392, y: 328 },
            { x: 472, y: 360 },
            { x: 312, y: 408 },
            { x: 504, y: 408 },
            { x: 328, y: 440 },
            { x: 472, y: 440 },
            { x: 376, y: 472 },
            { x: 408, y: 488 },
            { x: 584, y: 408 },
        ].map(function (pos) { return ({
            constructor: Tree,
            x: pos.x, y: pos.y,
            layer: 'main',
            physicsGroup: 'props',
            immovable: true,
            data: {
                spawnsTorch: pos.x === 328 && pos.y === 440,
            }
        }); }), [
            {
                name: 'start_log',
                constructor: Item,
                type: Item.Type.LOG,
                x: 425, y: 408,
                layer: 'main',
                physicsGroup: 'items',
            },
            {
                constructor: Item,
                type: Item.Type.AXE,
                x: 447, y: 436,
                angle: -90,
                layer: 'main',
                physicsGroup: 'items',
            },
            {
                constructor: Item,
                type: Item.Type.KEY,
                x: 688, y: 400,
                layer: 'main',
                physicsGroup: 'items',
            },
            {
                name: 'gasoline',
                constructor: Item,
                type: Item.Type.GASOLINE,
                x: 528, y: 84,
                layer: 'main',
                physicsGroup: 'items',
            },
        ])
    },
};
/// <reference path="./main.ts"/>
var storyConfig = {
    initialConfig: {},
    executeFn: function (sc) {
    }
};
var S;
(function (S) {
    S.storyEvents = {
        'spawn_monster': {
            stage: 'game',
            script: function () {
                var player;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, S.wait(Debug.DEBUG ? 3 : 60)];
                        case 1:
                            _a.sent();
                            player = global.world.getWorldObjectByType(Player);
                            global.world.addWorldObject({
                                name: 'monster',
                                constructor: Monster,
                                x: player.x + 200, y: player.y + 200,
                                layer: 'main',
                            });
                            return [2 /*return*/];
                    }
                });
            }
        }
    };
})(S || (S = {}));
var storyEvents = S.storyEvents;
/// <reference path="player.ts" />
var S;
(function (S) {
    S.storyboard = {
        'start': {
            type: 'start',
            transitions: [{ type: 'onStage', stage: 'game', toNode: 'intro' }]
        },
        'intro': {
            type: 'cutscene',
            script: function () {
                var SKIP, player, campfire, startLog;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            SKIP = Debug.DEBUG && true;
                            player = global.world.getWorldObjectByType(Player);
                            campfire = global.world.getWorldObjectByType(Campfire);
                            startLog = global.world.getWorldObjectByName('start_log');
                            global.world.camera.setModeFocus(campfire.x, campfire.y);
                            if (!!SKIP) return [3 /*break*/, 5];
                            return [4 /*yield*/, S.wait(2)];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, S.dialog("Don't let the fire burn out...")];
                        case 2:
                            _a.sent();
                            return [4 /*yield*/, S.dialog("It's the only light you have in this world.")];
                        case 3:
                            _a.sent();
                            return [4 /*yield*/, S.wait(0.5)];
                        case 4:
                            _a.sent();
                            _a.label = 5;
                        case 5:
                            if (SKIP)
                                Debug.SKIP_RATE = 100;
                            return [4 /*yield*/, S.simul(S.fadeSlides(1), S.playAnimation(player, 'intro_idle'))];
                        case 6:
                            _a.sent();
                            return [4 /*yield*/, S.moveToX(player, startLog.x)];
                        case 7:
                            _a.sent();
                            player.flipX = true;
                            return [4 /*yield*/, S.wait(0.5)];
                        case 8:
                            _a.sent();
                            return [4 /*yield*/, S.moveToY(player, startLog.y - 2)];
                        case 9:
                            _a.sent();
                            return [4 /*yield*/, S.wait(0.5)];
                        case 10:
                            _a.sent();
                            player.controller.pickupDropItem = true;
                            return [4 /*yield*/];
                        case 11:
                            _a.sent();
                            return [4 /*yield*/, S.wait(0.5)];
                        case 12:
                            _a.sent();
                            return [4 /*yield*/, S.moveToX(player, player.x - 12)];
                        case 13:
                            _a.sent();
                            return [4 /*yield*/, S.wait(0.5)];
                        case 14:
                            _a.sent();
                            player.controller.pickupDropItem = true;
                            return [4 /*yield*/];
                        case 15:
                            _a.sent();
                            return [4 /*yield*/, S.wait(1)];
                        case 16:
                            _a.sent();
                            campfire.startBurn();
                            Debug.SKIP_RATE = 1;
                            return [2 /*return*/];
                    }
                });
            },
            transitions: [{ type: 'instant', toNode: 'post_intro_wait' }]
        },
        'post_intro_wait': {
            type: 'cutscene',
            script: function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, S.wait(1)];
                        case 1:
                            _a.sent();
                            global.theater.currentWorld.camera.setModeFollow('player');
                            return [2 /*return*/];
                    }
                });
            },
            transitions: [{ type: 'instant', toNode: 'gameplay' }]
        },
        'gameplay': {
            type: 'gameplay',
            transitions: [
                { type: 'onCondition', condition: function () { return global.world.getWorldObjectByType(Campfire).hasConsumedGasoline; }, toNode: 'win' },
                { type: 'onCondition', condition: function () { return global.world.getWorldObjectByType(Campfire).isOut; }, toNode: 'lose' },
            ]
        },
        'win': {
            type: 'cutscene',
            script: function () {
                var campfire, lightingManager;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            campfire = global.world.getWorldObjectByType(Campfire);
                            lightingManager = global.world.getWorldObjectByType(LightingManager);
                            global.world.camera.setModeFocus(campfire.x, campfire.y);
                            global.world.camera.setMovementSmooth(0, 0, 0);
                            if (global.world.hasWorldObject('monster')) {
                                global.world.removeWorldObject('monster');
                            }
                            campfire.stopBurn();
                            return [4 /*yield*/, S.wait(4)];
                        case 1:
                            _a.sent();
                            campfire.win();
                            return [4 /*yield*/, S.doOverTime(3, function (t) {
                                    lightingManager.winRadius += 400 * global.script.delta;
                                })];
                        case 2:
                            _a.sent();
                            global.world.addWorldObject({
                                constructor: Sprite,
                                texture: Texture.filledRect(Main.width, Main.height, 0xFFFFFF),
                                layer: 'above',
                                ignoreCamera: true,
                            });
                            global.world.addWorldObject({
                                constructor: SpriteText,
                                font: Assets.fonts.DELUXE16,
                                x: 61, y: 72,
                                text: "your fire lives\nanother day...",
                                style: { color: 0x000000, },
                                ignoreCamera: true,
                            });
                            return [4 /*yield*/, S.wait(2)];
                        case 3:
                            _a.sent();
                            return [4 /*yield*/, S.fadeOut(3, 0xFFFFFF)];
                        case 4:
                            _a.sent();
                            return [4 /*yield*/, S.wait(1)];
                        case 5:
                            _a.sent();
                            return [4 /*yield*/, S.fadeOut(3)];
                        case 6:
                            _a.sent();
                            return [4 /*yield*/, S.wait(1)];
                        case 7:
                            _a.sent();
                            global.game.loadMainMenu();
                            return [2 /*return*/];
                    }
                });
            },
            transitions: []
        },
        'lose': {
            type: 'cutscene',
            script: function () {
                var campfire, losshint;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            campfire = global.world.getWorldObjectByType(Campfire);
                            global.world.camera.setModeFocus(campfire.x, campfire.y);
                            global.world.camera.setMovementSmooth(0, 0, 0);
                            if (global.world.hasWorldObject('monster')) {
                                global.world.removeWorldObject('monster');
                            }
                            return [4 /*yield*/, S.wait(2)];
                        case 1:
                            _a.sent();
                            campfire.extinguish();
                            global.world.addWorldObject({
                                name: 'fireout',
                                constructor: Sprite,
                                x: campfire.x, y: campfire.y,
                                texture: 'smoke',
                                layer: 'above',
                                life: 2,
                                updateCallback: function (smoke, delta) {
                                    var t = smoke.life.progress;
                                    smoke.offset.x = 4 * Math.exp(-t) * Math.sin(4 * Math.PI * t);
                                    smoke.offset.y = -32 * t;
                                    smoke.alpha = 1 - t;
                                }
                            });
                            return [4 /*yield*/, S.waitUntil(function () { return !global.world.hasWorldObject('fireout'); })];
                        case 2:
                            _a.sent();
                            return [4 /*yield*/, S.wait(1)];
                        case 3:
                            _a.sent();
                            global.world.addWorldObject({
                                constructor: Sprite,
                                texture: Texture.filledRect(Main.width, Main.height, 0x000000),
                                ignoreCamera: true,
                            });
                            global.world.addWorldObject({
                                name: 'losstext',
                                constructor: SpriteText,
                                font: Assets.fonts.DELUXE16,
                                x: 30, y: 80,
                                text: "you ran out of light...",
                                style: { color: 0xFFFFFF, },
                                ignoreCamera: true,
                            });
                            return [4 /*yield*/, S.wait(2)];
                        case 4:
                            _a.sent();
                            losshint = global.world.addWorldObject({
                                name: 'losshint',
                                constructor: SpriteText,
                                font: Assets.fonts.DELUXE16,
                                x: 30, y: 160,
                                text: Random.element([
                                    "chop faster",
                                    "[e]throw[/e] logs into the fire",
                                    "did you find the [e]door[/e]?",
                                    "did you find the [e]key[/e]?",
                                    "did you find the [e]torch[/e]?",
                                ]),
                                style: { color: 0x333333, alpha: 0 },
                                ignoreCamera: true,
                            });
                            return [4 /*yield*/, S.doOverTime(2, function (t) {
                                    losshint.x = Main.width / 2 - losshint.getTextWidth() / 2;
                                    losshint.style.alpha = t;
                                })];
                        case 5:
                            _a.sent();
                            return [4 /*yield*/, S.wait(2)];
                        case 6:
                            _a.sent();
                            return [4 /*yield*/, S.fadeOut(3)];
                        case 7:
                            _a.sent();
                            return [4 /*yield*/, S.wait(1)];
                        case 8:
                            _a.sent();
                            global.game.loadMainMenu();
                            return [2 /*return*/];
                    }
                });
            },
            transitions: []
        }
    };
})(S || (S = {}));
var storyboard = S.storyboard;
var LerpingValueWithNoise = /** @class */ (function () {
    function LerpingValueWithNoise(initialValue, speed, noiseFactor, noiseIntensity) {
        this.speed = speed;
        this.noiseFactor = noiseFactor;
        this.noiseIntensity = noiseIntensity;
        this.baseValue = initialValue;
        this.goal = initialValue;
        this.noise = 0;
    }
    Object.defineProperty(LerpingValueWithNoise.prototype, "value", {
        get: function () { return this.baseValue + this.noise; },
        enumerable: true,
        configurable: true
    });
    LerpingValueWithNoise.prototype.update = function (delta) {
        if (this.baseValue > this.goal) {
            this.baseValue = Math.max(this.baseValue - this.speed * delta, this.goal);
        }
        else if (this.baseValue < this.goal) {
            this.baseValue = Math.min(this.baseValue + this.speed * delta, this.goal);
        }
        if (Random.boolean(this.noiseFactor * delta)) {
            this.noise = Random.float(-this.noiseIntensity, this.noiseIntensity);
        }
    };
    return LerpingValueWithNoise;
}());
