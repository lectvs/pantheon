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
    function removeAll(array, obj) {
        if (!array)
            return 0;
        var count = 0;
        for (var i = array.length - 1; i >= 0; i--) {
            if (array[i] === obj) {
                array.splice(i, 1);
                count++;
            }
        }
        return count;
    }
    A.removeAll = removeAll;
    function repeat(array, count) {
        var result = [];
        for (var i = 0; i < count; i++) {
            result.push.apply(result, __spread(array));
        }
        return result;
    }
    A.repeat = repeat;
})(A || (A = {}));
/// <reference path="./utils/a_array.ts" />
var Animations = /** @class */ (function () {
    function Animations() {
    }
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
    AssetCache.getTexture = function (key) {
        if (!this.textures[key]) {
            debug("Texture '" + key + "' does not exist.");
        }
        return this.textures[key];
    };
    AssetCache.textures = {};
    AssetCache.DEFAULT_ANCHOR = { x: 0, y: 0 };
    return AssetCache;
}());
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
        PIXI.Loader.shared.load(function () { return _this.load(options); });
    };
    Preload.load = function (options) {
        if (options.textures) {
            for (var key in options.textures) {
                this.loadTexture(key, options.textures[key]);
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
        AssetCache.textures[key] = mainTexture;
        if (texture.frames) {
            for (var frame in texture.frames) {
                var frameTexture = new PIXI.Texture(baseTexture);
                var rect_1 = texture.frames[frame].rect || texture.rect;
                var anchor_1 = texture.frames[frame].anchor || texture.anchor;
                if (rect_1) {
                    frameTexture.frame = new Rectangle(rect_1.x, rect_1.y, rect_1.width, rect_1.height);
                }
                if (anchor_1) {
                    frameTexture.defaultAnchor = new Point(anchor_1.x, anchor_1.y);
                }
                AssetCache.textures[frame] = frameTexture;
            }
        }
    };
    return Preload;
}());
(function (Preload) {
    function spritesheet(config) {
        var result = {};
        for (var x = 0; x < config.numFramesX; x++) {
            for (var y = 0; y < config.numFramesY; y++) {
                var name_2 = "" + config.prefix + (x + y * config.numFramesX);
                var frame = {
                    rect: { x: x * config.frameWidth, y: y * config.frameHeight, width: config.frameWidth, height: config.frameHeight },
                };
                result[name_2] = frame;
            }
        }
        return result;
    }
    Preload.spritesheet = spritesheet;
})(Preload || (Preload = {}));
/// <reference path="./preload.ts" />
var Assets;
(function (Assets) {
    Assets.textures = {
        'none': {},
        'blank': {},
        'debug': {},
        'dialogbox': {
            anchor: { x: 0.5, y: 0.5 },
        },
        'indicator': {},
        'room_bg': {},
        'room_backwall': {
            rect: { x: 0, y: 0, width: 128, height: 80 },
        },
        'milo_sprites': {
            anchor: { x: 0.5, y: 1 },
            frames: Preload.spritesheet({ prefix: 'milo_sprites_', frameWidth: 32, frameHeight: 36, numFramesX: 8, numFramesY: 4 }),
        },
        'milo_demon_sprites': {},
        'angie_sprites': {},
        'props': {
            anchor: { x: 0.5, y: 1 },
            frames: {
                'bed': {
                    rect: { x: 2, y: 2, width: 36, height: 27 },
                },
                'door_closed': {
                    rect: { x: 40, y: 2, width: 24, height: 36 },
                    anchor: { x: 0, y: 0 },
                },
                'door_open': {
                    rect: { x: 66, y: 2, width: 4, height: 45 },
                    anchor: { x: 0, y: 0 },
                },
                'window': {
                    rect: { x: 72, y: 2, width: 44, height: 35 },
                },
                'chair': {
                    rect: { x: 2, y: 31, width: 12, height: 17 },
                },
                'desk': {
                    rect: { x: 16, y: 40, width: 36, height: 34 },
                },
            }
        },
        // Portraits
        'portraits/milo': {
            anchor: { x: 0.5, y: 0.5 },
            frames: {
                'milo/happy': {
                    rect: { x: 0, y: 0, width: 74, height: 54 },
                },
            }
        },
        // Fonts
        'deluxe16': {
            rect: { x: 0, y: 0, width: 8, height: 15 },
            anchor: { x: 0, y: 0 },
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
        };
        return fonts;
    }());
    Assets.fonts = fonts;
    Assets.tags = {};
})(Assets || (Assets = {}));
var S;
(function (S) {
    function printNumber(upTo) {
        return {
            generator: function () {
                var i, t;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            i = 1;
                            eval("x = 5;");
                            debug(eval("x"));
                            t = new Timer(1, function () {
                                debug(i);
                                i++;
                            }, true);
                            _a.label = 1;
                        case 1:
                            if (!(i <= upTo)) return [3 /*break*/, 3];
                            t.update(S.global.delta);
                            return [4 /*yield*/];
                        case 2:
                            _a.sent();
                            return [3 /*break*/, 1];
                        case 3: return [2 /*return*/];
                    }
                });
            },
            endState: function () { return debug("Done!"); },
        };
    }
    S.printNumber = printNumber;
})(S || (S = {}));
var Cutscene;
(function (Cutscene) {
    function toScript(script) {
        var lines = script.split('\n');
        return {
            generator: function () {
                var e_1, _a, lines_1, lines_1_1, line;
                return __generator(this, function (_b) {
                    try {
                        for (lines_1 = __values(lines), lines_1_1 = lines_1.next(); !lines_1_1.done; lines_1_1 = lines_1.next()) {
                            line = lines_1_1.value;
                            eval(line);
                        }
                    }
                    catch (e_1_1) { e_1 = { error: e_1_1 }; }
                    finally {
                        try {
                            if (lines_1_1 && !lines_1_1.done && (_a = lines_1.return)) _a.call(lines_1);
                        }
                        finally { if (e_1) throw e_1.error; }
                    }
                    return [2 /*return*/];
                });
            }
        };
    }
    Cutscene.toScript = toScript;
})(Cutscene || (Cutscene = {}));
var CutsceneManager = /** @class */ (function () {
    function CutsceneManager() {
        this.current = null;
    }
    CutsceneManager.prototype.update = function (delta, world) {
        if (this.current) {
            this.current.script.update(delta, world);
            if (this.current.script.done) {
                this.current = null;
            }
        }
    };
    CutsceneManager.prototype.playCutscene = function (cutscene) {
        if (this.current) {
            debug("Cannot play cutscene:", cutscene, "because a cutscene is already playing:", this.current.cutscene);
            return;
        }
        var script = new Script(Cutscene.toScript(cutscene.script));
        this.current = { cutscene: cutscene, script: script };
    };
    return CutsceneManager;
}());
var DEBUG = true;
var DEBUG_ALL_PHYSICS_BOUNDS = false;
function debug(message) {
    var optionalParams = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        optionalParams[_i - 1] = arguments[_i];
    }
    if (DEBUG) {
        console.log.apply(console, __spread([message], optionalParams));
    }
}
var WorldObject = /** @class */ (function () {
    function WorldObject(config, defaults) {
        if (defaults === void 0) { defaults = {}; }
        config = O.withDefaults(config, defaults);
        this.x = O.getOrDefault(config.x, 0);
        this.y = O.getOrDefault(config.y, 0);
        this.visible = O.getOrDefault(config.visible, true);
        this.lastx = this.x;
        this.lasty = this.y;
    }
    Object.defineProperty(WorldObject.prototype, "mask", {
        get: function () { return undefined; },
        set: function (value) { },
        enumerable: true,
        configurable: true
    });
    WorldObject.prototype.update = function (delta, world) {
        this.lastx = this.x;
        this.lasty = this.y;
    };
    WorldObject.prototype.render = function (renderer, renderTexture) {
    };
    return WorldObject;
}());
/// <reference path="./worldObject.ts" />
var PhysicsWorldObject = /** @class */ (function (_super) {
    __extends(PhysicsWorldObject, _super);
    function PhysicsWorldObject(config, defaults) {
        if (defaults === void 0) { defaults = {}; }
        var _this = this;
        config = O.withDefaults(config, defaults);
        _this = _super.call(this, config) || this;
        _this.vx = O.getOrDefault(config.vx, 0);
        _this.vy = O.getOrDefault(config.vy, 0);
        _this.mass = O.getOrDefault(config.mass, 1);
        _this.gravity = config.gravity ? new Point(config.gravity.x, config.gravity.y) : new Point(0, 0);
        _this.bounce = O.getOrDefault(config.bounce, 0);
        _this.bounds = config.bounds ? new Rectangle(config.bounds.x, config.bounds.y, config.bounds.width, config.bounds.height) : new Rectangle(0, 0, 0, 0);
        _this.immovable = O.getOrDefault(config.immovable, false);
        _this.debugBounds = O.getOrDefault(config.debugBounds, false);
        _this.simulating = O.getOrDefault(config.startSimulating, true);
        _this.preMovementX = _this.x;
        _this.preMovementY = _this.y;
        return _this;
    }
    PhysicsWorldObject.prototype.update = function (delta, world) {
        _super.prototype.update.call(this, delta, world);
        if (this.simulating) {
            this.simulate(delta, world);
        }
    };
    PhysicsWorldObject.prototype.render = function (renderer, renderTexture) {
        if (DEBUG_ALL_PHYSICS_BOUNDS || this.debugBounds) {
            var worldBounds = this.getWorldBounds();
            Draw.renderer(renderer, renderTexture).lineStyle(1, 0x00FF00).noFill()
                .drawRectangle(worldBounds.x, worldBounds.y, worldBounds.width, worldBounds.height);
        }
        _super.prototype.render.call(this, renderer, renderTexture);
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
    PhysicsWorldObject.prototype.simulate = function (delta, world) {
        this.applyGravity(delta);
        this.move(delta);
    };
    return PhysicsWorldObject;
}(WorldObject));
/// <reference path="./physicsWorldObject.ts" />
var Sprite = /** @class */ (function (_super) {
    __extends(Sprite, _super);
    function Sprite(config, defaults) {
        var e_2, _a;
        if (defaults === void 0) { defaults = {}; }
        var _this = this;
        config = O.withDefaults(config, defaults);
        _this = _super.call(this, config) || this;
        if (config.texture) {
            _this.setTexture(config.texture);
        }
        else if (config.graphics) {
            _this.setGraphics(config.graphics);
        }
        else if (config.renderTexture) {
            _this.setRenderTextureDimensions(config.renderTexture.width, config.renderTexture.height);
        }
        else {
            console.debug("SpriteConfig must have texture, graphics, or renderTexture specified:", config);
            _this.setGraphics(new PIXI.Graphics()); // Continue gracefully
        }
        if (config.bounds === undefined) {
            _this.bounds = _this.getDisplayObjectLocalBounds();
        }
        _this.animationManager = new AnimationManager(_this);
        if (config.animations) {
            try {
                for (var _b = __values(config.animations), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var animation = _c.value;
                    _this.animationManager.addAnimation(animation.name, animation.frames);
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_2) throw e_2.error; }
            }
        }
        _this.flipX = false;
        _this.flipY = false;
        _this.graphicOffsetX = config.graphicOffset ? config.graphicOffset.x : 0;
        _this.graphicOffsetY = config.graphicOffset ? config.graphicOffset.y : 0;
        return _this;
    }
    Sprite.prototype.update = function (delta, world) {
        _super.prototype.update.call(this, delta, world);
        this.animationManager.update(delta);
    };
    Sprite.prototype.render = function (renderer, renderTexture) {
        this.setDisplayObjectProperties();
        renderer.render(this.displayObject, renderTexture, false);
        _super.prototype.render.call(this, renderer, renderTexture);
    };
    Sprite.prototype.getDisplayObjectLocalBounds = function () {
        return this.displayObject.getLocalBounds();
    };
    Sprite.prototype.getDisplayObjectWorldBounds = function () {
        var local = this.getDisplayObjectLocalBounds();
        return new Rectangle(local.x + this.displayObject.x, local.y + this.displayObject.y, local.width, local.height);
    };
    Sprite.prototype.playAnimation = function (name, startFrame, force) {
        if (startFrame === void 0) { startFrame = 0; }
        if (force === void 0) { force = false; }
        this.animationManager.playAnimation(name, startFrame, force);
    };
    Sprite.prototype.setDisplayObjectProperties = function () {
        this.displayObject.x = this.x + this.graphicOffsetX;
        this.displayObject.y = this.y + this.graphicOffsetY;
        this.displayObject.scale.x = this.flipX ? -1 : 1;
        this.displayObject.scale.y = this.flipY ? -1 : 1;
    };
    Sprite.prototype.setGraphics = function (graphics) {
        this.displayObject = graphics;
        this.spriteType = Sprite.Type.GRAPHICS;
    };
    Sprite.prototype.setRenderTextureDimensions = function (width, height) {
        if (this.spriteType === Sprite.Type.RENDERTEXTURE) {
            var renderTexture = this.displayObject;
            if (renderTexture.width !== width || renderTexture.height !== height) {
                renderTexture.resize(width, height);
            }
        }
        else {
            this.displayObject = new PIXIRenderTextureSprite(width, height);
            this.spriteType = Sprite.Type.RENDERTEXTURE;
        }
    };
    Sprite.prototype.setTexture = function (key) {
        if (this.spriteType === Sprite.Type.SPRITE) {
            var sprite = this.displayObject;
            var texture = AssetCache.getTexture(key);
            if (sprite.texture !== texture) {
                sprite.texture = texture;
            }
        }
        else {
            this.displayObject = new PIXI.Sprite(AssetCache.getTexture(key));
            this.spriteType = Sprite.Type.SPRITE;
        }
    };
    return Sprite;
}(PhysicsWorldObject));
(function (Sprite) {
    var Type;
    (function (Type) {
        Type[Type["SPRITE"] = 0] = "SPRITE";
        Type[Type["GRAPHICS"] = 1] = "GRAPHICS";
        Type[Type["RENDERTEXTURE"] = 2] = "RENDERTEXTURE";
    })(Type = Sprite.Type || (Sprite.Type = {}));
})(Sprite || (Sprite = {}));
/// <reference path="./sprite.ts" />
var DialogBox = /** @class */ (function (_super) {
    __extends(DialogBox, _super);
    function DialogBox(config) {
        var _this = _super.call(this, config) || this;
        _this.charQueue = [];
        _this.textArea = config.textArea;
        _this.advanceKey = config.advanceKey;
        _this.spriteTextOffset = 0;
        _this.spriteText = new SpriteText({
            font: config.spriteTextFont,
        });
        _this.spriteTextMask = Mask.newRectangleMask(_this.getTextAreaWorldRect());
        _this.spriteText.mask = _this.spriteTextMask;
        _this.characterTimer = new Timer(0.05, function () { return _this.advanceCharacter(); }, true);
        return _this;
    }
    DialogBox.prototype.update = function (delta, world) {
        _super.prototype.update.call(this, delta, world);
        this.characterTimer.update(delta);
        if (Input.justDown(this.advanceKey)) {
            this.advanceDialog();
        }
    };
    DialogBox.prototype.render = function (renderer, renderTexture) {
        _super.prototype.render.call(this, renderer, renderTexture);
        this.setSpriteTextProperties();
        this.drawMask();
        this.spriteText.render(renderer, renderTexture);
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
        this.visible = false;
    };
    DialogBox.prototype.completePage = function () {
        var iters = 0;
        while (this.advanceCharacter() && iters < DialogBox.MAX_COMPLETE_PAGE_ITERS) {
            iters++;
        }
    };
    DialogBox.prototype.drawMask = function () {
        Mask.drawRectangleMask(this.spriteTextMask, this.getTextAreaWorldRect());
    };
    DialogBox.prototype.getTextAreaWorldRect = function () {
        return {
            x: this.x + this.textArea.x,
            y: this.y + this.textArea.y,
            width: this.textArea.width,
            height: this.textArea.height,
        };
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
        this.charQueue = SpriteTextConverter.textToCharListWithWordWrap(dialogText, this.spriteText.font, this.textArea.width);
        this.characterTimer.reset();
        this.advanceCharacter(); // Advance character once to start the dialog with one displayed character.
    };
    DialogBox.MAX_COMPLETE_PAGE_ITERS = 10000;
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
    Draw.lineStyle = function (width, color, alpha, alignment) {
        if (alpha === void 0) { alpha = 1; }
        if (alignment === void 0) { alignment = Draw.ALIGNMENT_INNER; }
        this.graphics.lineStyle(width, color, alpha, alignment);
        return this;
    };
    Draw.noStroke = function () {
        return this.lineStyle(0, 0x000000, 0);
    };
    Draw.fillColor = function (color, alpha) {
        if (alpha === void 0) { alpha = 1; }
        this._fillColor = color;
        this._fillAlpha = alpha;
        return this;
    };
    Draw.noFill = function () {
        return this.fillColor(0x000000, 0);
    };
    Draw.renderer = function (renderer, renderTexture) {
        this._renderer = renderer;
        this._renderTexture = renderTexture;
        return this;
    };
    Draw.drawRectangle = function (x, y, width, height) {
        this.graphics.clear();
        this.graphics.beginFill(this._fillColor, this._fillAlpha);
        this.graphics.drawRect(x, y, width, height);
        this.graphics.endFill();
        this.render();
        return this;
    };
    Draw.render = function () {
        this._renderer.render(this.graphics, this._renderTexture, false);
    };
    Draw.graphics = new PIXI.Graphics();
    Draw._fillColor = 0x000000;
    Draw._fillAlpha = 1;
    Draw.ALIGNMENT_INNER = 0;
    Draw.ALIGNMENT_MIDDLE = 0.5;
    Draw.ALIGNMENT_OUTER = 1;
    return Draw;
}());
var Input = /** @class */ (function () {
    function Input() {
    }
    Input.setKeys = function (keyCodesByName) {
        var e_3, _a, e_4, _b;
        this.keyCodesByName = _.clone(keyCodesByName);
        this.isDownByKeyCode = {};
        this.keysByKeycode = {};
        for (var name_3 in keyCodesByName) {
            try {
                for (var _c = __values(keyCodesByName[name_3]), _d = _c.next(); !_d.done; _d = _c.next()) {
                    var keyCode = _d.value;
                    this.isDownByKeyCode[keyCode] = false;
                    this.keysByKeycode[keyCode] = this.keysByKeycode[keyCode] || new Input.Key();
                }
            }
            catch (e_3_1) { e_3 = { error: e_3_1 }; }
            finally {
                try {
                    if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
                }
                finally { if (e_3) throw e_3.error; }
            }
        }
        try {
            for (var _e = __values(Input.MOUSE_KEYCODES), _f = _e.next(); !_f.done; _f = _e.next()) {
                var keyCode = _f.value;
                this.isDownByKeyCode[keyCode] = false;
                this.keysByKeycode[keyCode] = new Input.Key();
            }
        }
        catch (e_4_1) { e_4 = { error: e_4_1 }; }
        finally {
            try {
                if (_f && !_f.done && (_b = _e.return)) _b.call(_e);
            }
            finally { if (e_4) throw e_4.error; }
        }
    };
    Input.update = function () {
        this.updateKeys();
        this.updateMousePosition();
    };
    Input.updateKeys = function () {
        for (var keyCode in this.keysByKeycode) {
            this.keysByKeycode[keyCode].update(this.isDownByKeyCode[keyCode]);
        }
    };
    Input.updateMousePosition = function () {
        this._globalMouseX = Main.renderer.plugins.interaction.mouse.global.x;
        this._globalMouseY = Main.renderer.plugins.interaction.mouse.global.y;
        if (this.isMouseOnCanvas) {
            this._mouseX = this._globalMouseX;
            this._mouseY = this._globalMouseY;
        }
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
            return new Point(this.mouseX, this.mouseY);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Input, "globalMouseX", {
        get: function () {
            return this._globalMouseX;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Input, "globalMouseY", {
        get: function () {
            return this._globalMouseY;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Input, "globalMousePosition", {
        get: function () {
            return new Point(this.globalMouseX, this.globalMouseY);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Input, "isMouseOnCanvas", {
        get: function () {
            return 0 <= this.globalMouseX && this.globalMouseX < Main.width && 0 <= this.globalMouseY && this.globalMouseY < Main.height;
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
    Input._globalMouseX = 0;
    Input._globalMouseY = 0;
    Input.MOUSE_KEYCODES = ["MouseLeft", "MouseMiddle", "MouseRight", "MouseBack", "MouseForward"];
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
        return Key;
    }());
    Input.Key = Key;
})(Input || (Input = {}));
/// <reference path="./preload.ts" />
function load() {
    PIXI.utils.sayHello(PIXI.utils.isWebGLSupported() ? 'WebGL' : 'Canvas');
    Preload.preload({
        textures: Assets.textures,
        onLoad: function () { return Main.start(); },
    });
}
var Main = /** @class */ (function () {
    function Main() {
    }
    Object.defineProperty(Main, "width", {
        get: function () { return 256; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Main, "height", {
        get: function () { return 192; },
        enumerable: true,
        configurable: true
    });
    Main.start = function () {
        var _this = this;
        PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
        this.renderer = PIXI.autoDetectRenderer({
            width: this.width,
            height: this.height,
            resolution: 4,
            backgroundColor: 0x061639,
        });
        document.body.appendChild(this.renderer.view);
        Input.setKeys({
            'left': ['ArrowLeft'],
            'right': ['ArrowRight'],
            'up': ['ArrowUp'],
            'down': ['ArrowDown'],
            'advanceDialog': ['MouseLeft'],
        });
        window.addEventListener("keydown", function (event) { return Input.handleKeyDownEvent(event); }, false);
        window.addEventListener("keyup", function (event) { return Input.handleKeyUpEvent(event); }, false);
        window.addEventListener("mousedown", function (event) { return Input.handleMouseDownEvent(event); }, false);
        window.addEventListener("mouseup", function (event) { return Input.handleMouseUpEvent(event); }, false);
        window.addEventListener("contextmenu", function (event) { return event.preventDefault(); }, false);
        this.theater = new Theater({
            scenes: scenes,
            sceneToLoad: 'main',
            dialogBox: {
                x: Main.width / 2, y: Main.height - 32,
                texture: 'dialogbox',
                spriteTextFont: Assets.fonts.DELUXE16,
                textArea: { x: -122, y: -27, width: 244, height: 54 },
                advanceKey: 'advanceDialog',
            }
        });
        PIXI.Ticker.shared.add(function (frameDelta) {
            _this.delta = frameDelta / 60;
            Input.update();
            _this.theater.update(_this.delta);
            _this.renderer.render(Utils.NOOP_DISPLAYOBJECT, undefined, true); // Clear the renderer
            _this.theater.render(_this.renderer);
        });
    };
    return Main;
}());
// Actually load the game
load();
var Mask;
(function (Mask) {
    function drawRectangleMask(mask, rect) {
        mask.clear();
        mask.lineStyle(0);
        mask.beginFill(0xFFFFFF, 1);
        mask.drawRect(rect.x, rect.y, rect.width, rect.height);
        mask.endFill();
    }
    Mask.drawRectangleMask = drawRectangleMask;
    function newRectangleMask(rect) {
        var result = new PIXI.Graphics();
        result.lineStyle(0);
        result.beginFill(0xFFFFFF, 1);
        result.drawRect(rect.x, rect.y, rect.width, rect.height);
        result.endFill();
        return result;
    }
    Mask.newRectangleMask = newRectangleMask;
})(Mask || (Mask = {}));
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
        var e_5, _a;
        if (_.isEmpty(from))
            return;
        _.defaults(options, {
            transferMomentum: true,
            maxIters: Physics.MAX_ITERS,
        });
        var startX = obj.x;
        var startY = obj.y;
        var collidingWith = from.filter(function (other) { return obj !== other && obj.isOverlapping(other); });
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
                }
            }
            catch (e_5_1) { e_5 = { error: e_5_1 }; }
            finally {
                try {
                    if (collisions_1_1 && !collisions_1_1.done && (_a = collisions_1.return)) _a.call(collisions_1);
                }
                finally { if (e_5) throw e_5.error; }
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
/// <reference path="./sprite.ts" />
var Player = /** @class */ (function (_super) {
    __extends(Player, _super);
    function Player(config) {
        var _this = _super.call(this, config, {
            texture: 'milo_sprites_0',
            bounds: { x: -5, y: -2, width: 10, height: 2 },
        }) || this;
        _this.speed = 60;
        _this.direction = Direction2D.LEFT;
        return _this;
    }
    Player.prototype.update = function (delta, world) {
        var haxis = (Input.isDown('right') ? 1 : 0) - (Input.isDown('left') ? 1 : 0);
        var vaxis = (Input.isDown('down') ? 1 : 0) - (Input.isDown('up') ? 1 : 0);
        if (haxis < 0) {
            this.vx = -this.speed;
            this.direction.h = Direction.LEFT;
            if (vaxis == 0)
                this.direction.v = Direction.NONE;
            this.flipX = false;
        }
        else if (haxis > 0) {
            this.vx = this.speed;
            this.direction.h = Direction.RIGHT;
            if (vaxis == 0)
                this.direction.v = Direction.NONE;
            this.flipX = true;
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
        _super.prototype.update.call(this, delta, world);
        // Handle animation.
        var anim_state = (haxis == 0 && vaxis == 0) ? 'idle' : 'run';
        var anim_dir = this.direction.v == Direction.UP ? 'up' : (this.direction.h == Direction.NONE ? 'down' : 'side');
        this.playAnimation(anim_state + "_" + anim_dir);
    };
    return Player;
}(Sprite));
var PIXIRenderTextureSprite = /** @class */ (function (_super) {
    __extends(PIXIRenderTextureSprite, _super);
    function PIXIRenderTextureSprite(width, height) {
        var _this = this;
        var renderTexture = PIXI.RenderTexture.create({ width: width, height: height });
        _this = _super.call(this, renderTexture) || this;
        _this.renderTexture = renderTexture;
        return _this;
    }
    PIXIRenderTextureSprite.prototype.clear = function (renderer) {
        renderer.render(Utils.NOOP_DISPLAYOBJECT, this.renderTexture, true);
    };
    PIXIRenderTextureSprite.prototype.resize = function (width, height) {
        this.renderTexture.resize(width, height);
    };
    return PIXIRenderTextureSprite;
}(PIXI.Sprite));
var Stages;
(function (Stages) {
    Stages.MILOS_ROOM = {
        layers: [
            { name: 'bg' },
            { name: 'main', sortKey: 'y', },
            { name: 'fg' },
        ],
        physicsGroups: {
            'player': {},
            'props': {},
            'walls': {},
        },
        collisionOrder: [
            { move: 'player', from: ['props', 'walls'] },
        ],
        worldObjects: [
            {
                constructor: PhysicsWorldObject,
                bounds: { x: 48, y: 64, width: 16, height: 112 },
                physicsGroup: 'walls',
            },
            {
                constructor: PhysicsWorldObject,
                bounds: { x: 192, y: 64, width: 16, height: 112 },
                physicsGroup: 'walls',
            },
            {
                constructor: PhysicsWorldObject,
                bounds: { x: 64, y: 64, width: 128, height: 16 },
                physicsGroup: 'walls',
            },
            {
                constructor: PhysicsWorldObject,
                bounds: { x: 64, y: 160, width: 128, height: 16 },
                physicsGroup: 'walls',
            },
            {
                constructor: Sprite,
                texture: 'room_bg',
                layer: 'bg',
            },
            {
                constructor: Sprite,
                texture: 'room_backwall',
                x: 64, y: 0,
                layer: 'bg',
            },
            {
                constructor: Sprite,
                texture: 'bed',
                x: 84, y: 143,
                layer: 'main',
                physicsGroup: 'props',
                bounds: { x: -18, y: -20, width: 36, height: 20 },
            },
            {
                constructor: Sprite,
                texture: 'chair',
                x: 172, y: 134,
                layer: 'main',
            },
            {
                constructor: Sprite,
                texture: 'desk',
                x: 172, y: 158,
                layer: 'main',
                physicsGroup: 'props',
                bounds: { x: -18, y: -23, width: 36, height: 23 },
            },
            {
                constructor: Sprite,
                texture: 'door_closed',
                x: 84, y: 80,
                layer: 'main',
                graphicOffset: { x: 0, y: -36 },
            },
            {
                constructor: Sprite,
                texture: 'window',
                x: 156, y: 80,
                layer: 'main',
                graphicOffset: { x: 0, y: -7 },
                physicsGroup: 'props',
                bounds: { x: -22, y: -3, width: 43, height: 3 },
            },
        ]
    };
})(Stages || (Stages = {}));
/// <reference path="./animations.ts" />
/// <reference path="./stages.ts" />
var scenes = {
    'main': {
        stage: Stages.MILOS_ROOM,
        schema: {
            worldObjects: [
                {
                    constructor: Player,
                    x: 128, y: 108,
                    layer: 'main',
                    physicsGroup: 'player',
                    animations: [
                        Animations.fromTextureList({ name: 'idle_side', texturePrefix: 'milo_sprites_', textures: [0, 1], frameRate: 1, count: -1 }),
                        Animations.fromTextureList({ name: 'idle_down', texturePrefix: 'milo_sprites_', textures: [8, 9], frameRate: 1, count: -1 }),
                        Animations.fromTextureList({ name: 'idle_up', texturePrefix: 'milo_sprites_', textures: [16, 17], frameRate: 1, count: -1 }),
                        Animations.fromTextureList({ name: 'run_side', texturePrefix: 'milo_sprites_', textures: [2, 3], frameRate: 8, count: -1 }),
                        Animations.fromTextureList({ name: 'run_down', texturePrefix: 'milo_sprites_', textures: [10, 11], frameRate: 8, count: -1 }),
                        Animations.fromTextureList({ name: 'run_up', texturePrefix: 'milo_sprites_', textures: [18, 19], frameRate: 8, count: -1 }),
                    ],
                },
            ]
        },
        entry: 'test',
        cutscenes: {
            'test': {
                condition: function () { return true; },
                script: "\n                    x = 5;\n                    debug(x);\n                "
            }
        },
    }
};
var Script = /** @class */ (function () {
    function Script(scriptFunction) {
        this.generator = scriptFunction.generator();
        this.endState = scriptFunction.endState;
    }
    Object.defineProperty(Script.prototype, "running", {
        get: function () {
            return !this.paused && !this.done;
        },
        enumerable: true,
        configurable: true
    });
    Script.prototype.update = function (delta, world) {
        if (!this.running)
            return;
        S.global = {
            delta: delta,
            world: world,
            script: this,
        };
        var result = this.generator.next();
        if (result.done) {
            if (this.endState)
                this.endState();
            this.done = true;
        }
    };
    return Script;
}());
var S;
(function (S) {
})(S || (S = {}));
var ScriptManager = /** @class */ (function () {
    function ScriptManager() {
        this.activeScripts = [];
    }
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
    ScriptManager.prototype.update = function (delta, currentWorld) {
        for (var i = this.activeScripts.length - 1; i >= 0; i--) {
            this.activeScripts[i].update(delta, currentWorld);
            if (this.activeScripts[i].done) {
                this.activeScripts.splice(i, 1);
            }
        }
    };
    return ScriptManager;
}());
var SpriteText = /** @class */ (function (_super) {
    __extends(SpriteText, _super);
    function SpriteText(config) {
        var _this = _super.call(this, config) || this;
        _this.font = config.font;
        _this.style = _.defaults(config.style, {
            color: 0xFFFFFF,
            offset: 0,
        });
        _this.setText(config.text);
        _this.fontSprite = new PIXI.Sprite(AssetCache.getTexture(_this.font.texture).clone());
        return _this;
    }
    SpriteText.prototype.update = function (delta, world) {
        _super.prototype.update.call(this, delta, world);
    };
    SpriteText.prototype.render = function (renderer, renderTexture) {
        var e_6, _a;
        try {
            for (var _b = __values(this.chars), _c = _b.next(); !_c.done; _c = _b.next()) {
                var char = _c.value;
                this.setFontSpriteToCharacter(char);
                this.setStyle(char.style);
                renderer.render(this.fontSprite, renderTexture, false);
            }
        }
        catch (e_6_1) { e_6 = { error: e_6_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_6) throw e_6.error; }
        }
        _super.prototype.render.call(this, renderer, renderTexture);
    };
    SpriteText.prototype.clear = function () {
        this.setText("");
    };
    Object.defineProperty(SpriteText.prototype, "mask", {
        get: function () {
            return this.fontSprite.mask;
        },
        set: function (value) {
            this.fontSprite.mask = value;
        },
        enumerable: true,
        configurable: true
    });
    SpriteText.prototype.getTextHeight = function () {
        return SpriteText.getHeightOfCharList(this.chars);
    };
    SpriteText.prototype.setFontSpriteToCharacter = function (char) {
        this.fontSprite.x = this.x + char.x;
        this.fontSprite.y = this.y + char.y;
        var frame = SpriteText.charCodes[char.char];
        this.fontSprite.texture.frame.x = frame.x * this.font.charWidth;
        this.fontSprite.texture.frame.y = frame.y * this.font.charHeight;
        this.fontSprite.texture.frame = this.fontSprite.texture.frame; // Must actually set the frame for changes to take effect.
    };
    SpriteText.prototype.setStyle = function (style) {
        this.fontSprite.tint = O.getOrDefault(style.color, this.style.color);
        this.fontSprite.y += O.getOrDefault(style.offset, this.style.offset);
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
        _a);
    function getInt(text, def) {
        var result = parseInt(text);
        if (!isFinite(result))
            return def;
        return result;
    }
})(SpriteText || (SpriteText = {}));
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
                nextCharPosition.y = SpriteText.getHeightOfCharList(result);
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
        var result = S.splitOnWhitespace(tag);
        if (_.isEmpty(result)) {
            debug("Tag " + tag + " must have the tag part specified.");
            return [SpriteText.NOOP_TAG];
        }
        return result;
    };
    SpriteTextConverter.pushWord = function (word, result, position, maxWidth) {
        var e_7, _a;
        if (_.isEmpty(word))
            return;
        var lastChar = _.last(word);
        if (lastChar.right > maxWidth) {
            var diffx = word[0].x;
            var diffy = word[0].y - SpriteText.getHeightOfCharList(result);
            try {
                for (var word_1 = __values(word), word_1_1 = word_1.next(); !word_1_1.done; word_1_1 = word_1.next()) {
                    var char = word_1_1.value;
                    char.x -= diffx;
                    char.y -= diffy;
                }
            }
            catch (e_7_1) { e_7 = { error: e_7_1 }; }
            finally {
                try {
                    if (word_1_1 && !word_1_1.done && (_a = word_1.return)) _a.call(word_1);
                }
                finally { if (e_7) throw e_7.error; }
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
/// <reference path="./worldObject.ts" />
var World = /** @class */ (function (_super) {
    __extends(World, _super);
    function World(config, defaults) {
        if (defaults === void 0) { defaults = {}; }
        var _this = this;
        config = O.withDefaults(config, defaults);
        _this = _super.call(this, config) || this;
        _this.worldObjects = [];
        _this.physicsGroups = _this.createPhysicsGroups(config.physicsGroups);
        _this.collisionOrder = O.getOrDefault(config.collisionOrder, []);
        _this.layers = _this.createLayers(config.layers);
        if (!config.renderDirectly) {
            _this.renderTexture = new PIXIRenderTextureSprite(O.getOrDefault(config.width, Main.width), O.getOrDefault(config.height, Main.height));
        }
        return _this;
    }
    World.prototype.update = function (delta, world) {
        var e_8, _a;
        _super.prototype.update.call(this, delta, world);
        try {
            for (var _b = __values(this.worldObjects), _c = _b.next(); !_c.done; _c = _b.next()) {
                var worldObject = _c.value;
                worldObject.update(delta, this);
            }
        }
        catch (e_8_1) { e_8 = { error: e_8_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_8) throw e_8.error; }
        }
        this.handleCollisions();
    };
    World.prototype.render = function (renderer, renderTexture) {
        if (this.renderingDirectly) {
            this.renderWorld(renderer, renderTexture);
        }
        else {
            this.renderTexture.clear(renderer);
            this.renderWorld(renderer, this.renderTexture.renderTexture);
            renderer.render(this.renderTexture, renderTexture, false);
        }
        _super.prototype.render.call(this, renderer, renderTexture);
    };
    World.prototype.renderWorld = function (renderer, renderTexture) {
        var e_9, _a, e_10, _b;
        try {
            for (var _c = __values(this.layers), _d = _c.next(); !_d.done; _d = _c.next()) {
                var layer = _d.value;
                layer.sort();
                try {
                    for (var _e = __values(layer.worldObjects), _f = _e.next(); !_f.done; _f = _e.next()) {
                        var worldObject = _f.value;
                        if (worldObject.visible) {
                            worldObject.render(renderer, renderTexture);
                        }
                    }
                }
                catch (e_10_1) { e_10 = { error: e_10_1 }; }
                finally {
                    try {
                        if (_f && !_f.done && (_b = _e.return)) _b.call(_e);
                    }
                    finally { if (e_10) throw e_10.error; }
                }
            }
        }
        catch (e_9_1) { e_9 = { error: e_9_1 }; }
        finally {
            try {
                if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
            }
            finally { if (e_9) throw e_9.error; }
        }
    };
    World.prototype.addWorldObject = function (obj) {
        this.worldObjects.push(obj);
        this.setLayer(obj, World.DEFAULT_LAYER);
    };
    World.prototype.handleCollisions = function () {
        var _this = this;
        var e_11, _a, e_12, _b, e_13, _c;
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
                                    transferMomentum: collision.transferMomentum,
                                });
                            }
                        }
                        catch (e_13_1) { e_13 = { error: e_13_1 }; }
                        finally {
                            try {
                                if (group_1_1 && !group_1_1.done && (_c = group_1.return)) _c.call(group_1);
                            }
                            finally { if (e_13) throw e_13.error; }
                        }
                    }
                }
                catch (e_12_1) { e_12 = { error: e_12_1 }; }
                finally {
                    try {
                        if (move_1_1 && !move_1_1.done && (_b = move_1.return)) _b.call(move_1);
                    }
                    finally { if (e_12) throw e_12.error; }
                }
            }
        }
        catch (e_11_1) { e_11 = { error: e_11_1 }; }
        finally {
            try {
                if (_e && !_e.done && (_a = _d.return)) _a.call(_d);
            }
            finally { if (e_11) throw e_11.error; }
        }
    };
    World.prototype.removeFromAllLayers = function (obj) {
        var e_14, _a;
        try {
            for (var _b = __values(this.layers), _c = _b.next(); !_c.done; _c = _b.next()) {
                var layer = _c.value;
                A.removeAll(layer.worldObjects, obj);
            }
        }
        catch (e_14_1) { e_14 = { error: e_14_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_14) throw e_14.error; }
        }
    };
    World.prototype.removeFromAllPhysicsGroups = function (obj) {
        for (var name_4 in this.physicsGroups) {
            A.removeAll(this.physicsGroups[name_4].worldObjects, obj);
        }
    };
    World.prototype.removeWorldObject = function (obj) {
        this.removeFromAllLayers(obj);
        this.removeFromAllPhysicsGroups(obj);
        A.removeAll(this.worldObjects, obj);
    };
    Object.defineProperty(World.prototype, "renderingDirectly", {
        get: function () {
            return !this.renderTexture;
        },
        enumerable: true,
        configurable: true
    });
    World.prototype.setLayer = function (obj, name) {
        if (name === void 0) { name = World.DEFAULT_LAYER; }
        var e_15, _a;
        this.removeFromAllLayers(obj);
        try {
            for (var _b = __values(this.layers), _c = _b.next(); !_c.done; _c = _b.next()) {
                var layer = _c.value;
                if (layer.name === name) {
                    layer.worldObjects.push(obj);
                    return;
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
        debug("Layer '" + name + "' does not exist in the world.");
    };
    World.prototype.setPhysicsGroup = function (obj, name) {
        this.removeFromAllPhysicsGroups(obj);
        var physicsGroup = this.physicsGroups[name];
        if (!physicsGroup) {
            debug("PhysicsGroup '" + name + "' does not exist in the world.");
            return;
        }
        physicsGroup.worldObjects.push(obj);
    };
    World.prototype.createLayers = function (layers) {
        var e_16, _a;
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
                result.push(new World.Layer(layer.name, layer));
            }
        }
        catch (e_16_1) { e_16 = { error: e_16_1 }; }
        finally {
            try {
                if (layers_1_1 && !layers_1_1.done && (_a = layers_1.return)) _a.call(layers_1);
            }
            finally { if (e_16) throw e_16.error; }
        }
        return result;
    };
    World.prototype.createPhysicsGroups = function (physicsGroups) {
        if (_.isEmpty(physicsGroups))
            return {};
        var result = {};
        for (var name_5 in physicsGroups) {
            _.defaults(physicsGroups[name_5], {
                collidesWith: [],
            });
            result[name_5] = new World.PhysicsGroup(name_5, physicsGroups[name_5]);
        }
        return result;
    };
    World.DEFAULT_LAYER = 'default';
    return World;
}(WorldObject));
(function (World) {
    var Layer = /** @class */ (function () {
        function Layer(name, config) {
            this.name = name;
            this.worldObjects = [];
            this.sortKey = config.sortKey;
            this.reverseSort = config.reverseSort;
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
})(World || (World = {}));
/// <reference path="./world.ts"/>
var Theater = /** @class */ (function (_super) {
    __extends(Theater, _super);
    function Theater(config) {
        var _this = _super.call(this, {
            layers: [
                { name: 'main' },
                { name: 'dialog' },
            ],
        }) || this;
        _this.scenes = config.scenes;
        _this.loadDialogBox(config.dialogBox);
        _this.loadScene(config.sceneToLoad);
        _this.scriptManager = new ScriptManager();
        _this.cutsceneManager = new CutsceneManager();
        return _this;
    }
    Theater.prototype.update = function (delta, world) {
        this.scriptManager.update(delta, this.currentWorld);
        this.cutsceneManager.update(delta, this.currentWorld);
        _super.prototype.update.call(this, delta, world);
    };
    Theater.prototype.loadDialogBox = function (config) {
        this.dialogBox = new DialogBox(config);
        this.dialogBox.visible = false;
        this.addWorldObject(this.dialogBox);
        this.setLayer(this.dialogBox, 'dialog');
    };
    Theater.prototype.loadScene = function (name) {
        var scene = this.scenes[name];
        if (!scene) {
            debug("Scene '" + name + "' does not exist in world.");
            return;
        }
        // Remove old stuff
        if (this.currentWorld) {
            this.removeWorldObject(this.currentWorld);
        }
        // Create new stuff
        this.currentSceneName = name;
        this.currentWorld = Theater.createWorldFromScene(scene);
        this.addWorldObject(this.currentWorld);
        this.setLayer(this.currentWorld, 'main');
    };
    Theater.prototype.runScript = function (script) {
        this.scriptManager.runScript(script);
    };
    Theater.addWorldObjectFromStageConfig = function (world, worldObject) {
        if (!worldObject.constructor)
            return;
        var obj = new worldObject.constructor(worldObject);
        world.addWorldObject(obj);
        var config = worldObject;
        if (obj instanceof WorldObject) {
            _.defaults(config, {
                layer: World.DEFAULT_LAYER,
            });
            world.setLayer(obj, config.layer);
        }
        if (obj instanceof PhysicsWorldObject) {
            if (config.physicsGroup)
                world.setPhysicsGroup(obj, config.physicsGroup);
        }
    };
    Theater.createWorldFromScene = function (scene) {
        var e_17, _a, e_18, _b;
        var world = new World(scene.stage, {
            renderDirectly: true,
        });
        if (scene.stage.worldObjects) {
            try {
                for (var _c = __values(scene.stage.worldObjects), _d = _c.next(); !_d.done; _d = _c.next()) {
                    var worldObject = _d.value;
                    this.addWorldObjectFromStageConfig(world, worldObject);
                }
            }
            catch (e_17_1) { e_17 = { error: e_17_1 }; }
            finally {
                try {
                    if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
                }
                finally { if (e_17) throw e_17.error; }
            }
        }
        if (scene.schema.worldObjects) {
            try {
                for (var _e = __values(scene.schema.worldObjects), _f = _e.next(); !_f.done; _f = _e.next()) {
                    var worldObject = _f.value;
                    this.addWorldObjectFromStageConfig(world, worldObject);
                }
            }
            catch (e_18_1) { e_18 = { error: e_18_1 }; }
            finally {
                try {
                    if (_f && !_f.done && (_b = _e.return)) _b.call(_e);
                }
                finally { if (e_18) throw e_18.error; }
            }
        }
        return world;
    };
    return Theater;
}(World));
var Timer = /** @class */ (function () {
    function Timer(duration, callback, repeat) {
        if (repeat === void 0) { repeat = false; }
        this.duration = duration;
        this.speed = 1;
        this.time = 0;
        this.done = false;
        this.callback = callback;
        this.repeat = repeat;
    }
    Timer.prototype.update = function (delta) {
        if (!this.done) {
            this.time += delta;
            while (this.time >= this.duration) {
                if (this.callback)
                    this.callback();
                this.time -= this.duration;
                this.done = !this.repeat;
            }
        }
    };
    Timer.prototype.reset = function () {
        this.time = 0;
        this.done = false;
    };
    return Timer;
}());
var Wall = /** @class */ (function (_super) {
    __extends(Wall, _super);
    function Wall(config) {
        return _super.call(this, config, {
            texture: 'debug',
        }) || this;
    }
    return Wall;
}(Sprite));
var G;
(function (G) {
    function overlapRectangles(rect1, rect2) {
        return rect1.left < rect2.right && rect1.right > rect2.left && rect1.top < rect2.bottom && rect1.bottom > rect2.top;
    }
    G.overlapRectangles = overlapRectangles;
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
})(M || (M = {}));
var O;
(function (O) {
    function getOrDefault(obj, def) {
        return obj === undefined ? def : obj;
    }
    O.getOrDefault = getOrDefault;
    function withDefaults(obj, defaults) {
        var result = _.clone(obj);
        _.defaults(result, defaults);
        return result;
    }
    O.withDefaults = withDefaults;
})(O || (O = {}));
var S;
(function (S) {
    function splitOnWhitespace(str) {
        if (_.isEmpty(str))
            return [];
        return str.match(/\S+/g) || [];
    }
    S.splitOnWhitespace = splitOnWhitespace;
})(S || (S = {}));
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
