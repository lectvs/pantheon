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
var Point = PIXI.Point;
var Rectangle = PIXI.Rectangle;
var AnimationManager = /** @class */ (function () {
    function AnimationManager(sprite) {
        this.sprite = sprite;
        this.animations = {};
        this.currentFrame = null;
        this.currentFrameTime = 0;
    }
    AnimationManager.prototype.update = function () {
        if (this.currentFrame) {
            this.currentFrameTime += global.delta;
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
    AssetCache.getTilemap = function (key) {
        if (!this.tilemaps[key]) {
            debug("Tilemap '" + key + "' does not exist.");
        }
        return this.tilemaps[key];
    };
    AssetCache.textures = {};
    AssetCache.tilemaps = {};
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
        AssetCache.textures[key] = mainTexture;
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
            AssetCache.textures[frame] = frameTexture;
        }
    };
    Preload.preloadPyxelTilemap = function (key, tilemap) {
        var url = tilemap.url || "assets/" + key + ".json";
        PIXI.Loader.shared.add(key + this.TILEMAP_KEY_SUFFIX, url);
    };
    Preload.loadPyxelTilemap = function (key, tilemap) {
        var e_1, _a;
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
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_1) throw e_1.error; }
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
        'room_bg': {},
        'room_backwall': {
            spritesheet: { frameWidth: 16, frameHeight: 16, anchor: { x: 0.5, y: 0.5 } },
        },
        'milo_sprites': {
            defaultAnchor: { x: 0.5, y: 1 },
            spritesheet: { frameWidth: 32, frameHeight: 36 },
        },
        'angie_sprites': {
            defaultAnchor: { x: 0.5, y: 1 },
            spritesheet: { frameWidth: 32, frameHeight: 36 },
        },
        'props': {
            defaultAnchor: { x: 0.5, y: 1 },
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
                'stone_frame': {
                    rect: { x: 117, y: 2, width: 16, height: 72 },
                    anchor: { x: 0, y: 1 },
                },
                'archway': {
                    rect: { x: 174, y: 2, width: 80, height: 119 },
                    anchor: { x: 1, y: 0 },
                },
                'archway_front': {
                    rect: { x: 174, y: 2, width: 40, height: 119 },
                    anchor: { x: 1, y: 1 },
                },
            }
        },
        'spotlight': {},
        'mainworld': {
            url: 'assets/tilemap/mainworld.png',
            spritesheet: { frameWidth: 16, frameHeight: 16 },
        },
        'cave': {
            url: 'assets/tilemap/cave.png',
            spritesheet: { frameWidth: 16, frameHeight: 16 },
        },
        // Portraits
        'portraits/milo': {
            defaultAnchor: { x: 0.5, y: 0.5 },
            frames: {
                'milo/happy': {
                    rect: { x: 0 * 74, y: 0 * 54, width: 74, height: 54 },
                },
                'milo/angry': {
                    rect: { x: 1 * 74, y: 0 * 54, width: 74, height: 54 },
                },
                'milo/sad': {
                    rect: { x: 2 * 74, y: 0 * 54, width: 74, height: 54 },
                },
                'milo/sigh': {
                    rect: { x: 3 * 74, y: 0 * 54, width: 74, height: 54 },
                },
                'milo/scared': {
                    rect: { x: 4 * 74, y: 0 * 54, width: 74, height: 54 },
                },
                'milo/shocked': {
                    rect: { x: 5 * 74, y: 0 * 54, width: 74, height: 54 },
                },
            }
        },
        'portraits/angie': {
            defaultAnchor: { x: 0.5, y: 0.5 },
            frames: {
                'angie/happy': {
                    rect: { x: 0 * 74, y: 0 * 54, width: 74, height: 54 },
                },
            }
        },
        // Fonts
        'deluxe16': {
            rect: { x: 0, y: 0, width: 8, height: 15 },
            anchor: { x: 0, y: 0 },
        },
    };
    Assets.tilesets = {
        'mainworld': {
            tiles: Preload.allTilesWithPrefix('mainworld_'),
            tileWidth: 16,
            tileHeight: 16,
            collisionIndices: [-1, 9, 10, 11],
        },
        'cave': {
            tiles: Preload.allTilesWithPrefix('cave_'),
            tileWidth: 16,
            tileHeight: 16,
            collisionIndices: [-1, 1, 5, 16],
        },
    };
    Assets.pyxelTilemaps = {
        'mainworld': {
            url: 'assets/tilemap/mainworld.json',
            tileset: Assets.tilesets.mainworld,
        },
        'cave': {
            url: 'assets/tilemap/cave.json',
            tileset: Assets.tilesets.cave,
        },
        'connector': {
            url: 'assets/tilemap/connector.json',
            tileset: Assets.tilesets.mainworld,
        },
        'upper': {
            url: 'assets/tilemap/upper.json',
            tileset: Assets.tilesets.mainworld,
        },
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
var WorldObject = /** @class */ (function () {
    function WorldObject(config, defaults) {
        if (defaults === void 0) { defaults = {}; }
        config = O.withDefaults(config, defaults);
        this.x = O.getOrDefault(config.x, 0);
        this.y = O.getOrDefault(config.y, 0);
        this.visible = O.getOrDefault(config.visible, true);
        this.active = O.getOrDefault(config.active, true);
        this.ignoreCamera = O.getOrDefault(config.ignoreCamera, false);
        this.data = _.clone(O.getOrDefault(config.data, {}));
        this.lastx = this.x;
        this.lasty = this.y;
        this.controllable = O.getOrDefault(config.controllable, false);
        this.controller = {};
        this.controllerSchema = {};
        this.preRenderStoredX = this.x;
        this.preRenderStoredY = this.y;
    }
    Object.defineProperty(WorldObject.prototype, "isControlled", {
        get: function () { return this.controllable && !global.theater.isCutscenePlaying; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WorldObject.prototype, "mask", {
        get: function () { return undefined; },
        set: function (value) { },
        enumerable: true,
        configurable: true
    });
    WorldObject.prototype.preUpdate = function () {
        this.lastx = this.x;
        this.lasty = this.y;
        if (this.isControlled) {
            this.updateControllerFromSchema();
        }
    };
    WorldObject.prototype.update = function () {
    };
    WorldObject.prototype.postUpdate = function () {
    };
    WorldObject.prototype.fullUpdate = function () {
        this.preUpdate();
        this.update();
        this.postUpdate();
    };
    WorldObject.prototype.preRender = function () {
        this.preRenderStoredX = this.x;
        this.preRenderStoredY = this.y;
        if (!this.ignoreCamera) {
            this.x -= global.world.camera.worldOffsetX;
            this.y -= global.world.camera.worldOffsetY;
        }
        this.x = Math.round(this.x);
        this.y = Math.round(this.y);
    };
    WorldObject.prototype.render = function () {
    };
    WorldObject.prototype.postRender = function () {
        this.x = this.preRenderStoredX;
        this.y = this.preRenderStoredY;
    };
    WorldObject.prototype.fullRender = function () {
        this.preRender();
        this.render();
        this.postRender();
    };
    WorldObject.prototype.resetController = function () {
        for (var key in this.controller) {
            this.controller[key] = false;
        }
    };
    WorldObject.prototype.updateControllerFromSchema = function () {
        for (var key in this.controllerSchema) {
            this.controller[key] = this.controllerSchema[key]();
        }
    };
    WorldObject.prototype.onAdd = function () {
    };
    WorldObject.prototype.onRemove = function () {
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
        _this.colliding = O.getOrDefault(config.colliding, true);
        _this.debugBounds = O.getOrDefault(config.debugBounds, false);
        _this.simulating = O.getOrDefault(config.startSimulating, true);
        _this.preMovementX = _this.x;
        _this.preMovementY = _this.y;
        return _this;
    }
    PhysicsWorldObject.prototype.update = function () {
        _super.prototype.update.call(this);
        if (this.simulating) {
            this.simulate(global.delta, global.world);
        }
    };
    PhysicsWorldObject.prototype.render = function () {
        if (DEBUG_ALL_PHYSICS_BOUNDS || this.debugBounds) {
            var worldBounds = this.getWorldBounds();
            Draw.lineStyle(1, 0x00FF00).noFill()
                .drawRectangle(worldBounds.x, worldBounds.y, worldBounds.width, worldBounds.height);
        }
        _super.prototype.render.call(this);
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
/// <reference path="./physicsWorldObject.ts"/>
var BackWall = /** @class */ (function (_super) {
    __extends(BackWall, _super);
    function BackWall(config) {
        var _this = _super.call(this, config, {
            bounds: { x: 0, y: 64, width: 128, height: 16 },
        }) || this;
        _this.createTiles();
        return _this;
    }
    BackWall.prototype.onAdd = function () {
        var e_2, _a;
        try {
            for (var _b = __values(this.tiles), _c = _b.next(); !_c.done; _c = _b.next()) {
                var tile = _c.value;
                global.world.addWorldObject(tile, { layer: global.world.getLayer(this) });
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_2) throw e_2.error; }
        }
    };
    BackWall.prototype.update = function () {
        _super.prototype.update.call(this);
        if (Input.justDown('1')) {
            for (var i = 0; i < 10; i++)
                this.crumble();
        }
    };
    BackWall.prototype.crumble = function () {
        for (var i = 0; i < 4; i++) {
            if (!_.isEmpty(this.tiles)) {
                this.destroyTile(Random.index(this.tiles));
            }
        }
        if (_.isEmpty(this.tiles)) {
            global.world.removeWorldObject(this);
        }
    };
    BackWall.prototype.createTiles = function () {
        this.tiles = [];
        for (var x = 0; x < 8; x++) {
            for (var y = 0; y < 5; y++) {
                var tile = new Sprite({
                    x: this.x,
                    y: this.y,
                    offset: {
                        x: 8 + 16 * x,
                        y: 8 + 16 * y,
                    },
                    texture: "room_backwall_" + (x + 8 * y),
                });
                this.tiles.push(tile);
            }
        }
    };
    BackWall.prototype.destroyTile = function (index) {
        var _a = __read(this.tiles.splice(index, 1), 1), tile = _a[0];
        var gravity = 200;
        var angularSpeed = Math.sqrt(Random.value) * 500 * Random.sign();
        var velocity = Random.onCircle(32);
        tile.vx = velocity.x;
        tile.vy = velocity.y;
        global.world.runScript(S.doOverTime(1, function (t) {
            tile.vy += gravity * global.delta;
            tile.angle += angularSpeed * global.delta;
            if (t === 1) {
                global.world.removeWorldObject(tile);
            }
        }));
    };
    return BackWall;
}(PhysicsWorldObject));
var BASE_STAGE = {
    layers: [
        { name: 'bg' },
        { name: 'room' },
        { name: 'main', sortKey: 'y' },
        { name: 'fg' },
        { name: 'spotlight' },
    ],
    physicsGroups: {
        'player': {},
        'props': {},
        'walls': {},
    },
    collisionOrder: [
        { move: 'player', from: ['props', 'walls'], callback: true },
    ],
};
var S;
(function (S) {
    function chain() {
        var scriptFunctions = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            scriptFunctions[_i] = arguments[_i];
        }
        var i = 0;
        return {
            generator: function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!(i < scriptFunctions.length)) return [3 /*break*/, 2];
                            return [5 /*yield**/, __values(runScript(scriptFunctions[i]))];
                        case 1:
                            _a.sent();
                            i++;
                            return [3 /*break*/, 0];
                        case 2: return [2 /*return*/];
                    }
                });
            },
            endState: function () {
                while (i < scriptFunctions.length) {
                    if (scriptFunctions[i].endState)
                        scriptFunctions[i].endState();
                    i++;
                }
            }
        };
    }
    S.chain = chain;
    function doOverTime(time, func) {
        return {
            generator: function () {
                var t;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            t = new Timer(time);
                            _a.label = 1;
                        case 1:
                            if (!!t.done) return [3 /*break*/, 3];
                            func(t.progress);
                            t.update();
                            return [4 /*yield*/];
                        case 2:
                            _a.sent();
                            return [3 /*break*/, 1];
                        case 3: return [2 /*return*/];
                    }
                });
            }, endState: function () { return func(1); },
        };
    }
    S.doOverTime = doOverTime;
    function finishImmediately(scriptFunction, maxIters) {
        if (maxIters === void 0) { maxIters = Script.FINISH_IMMEDIATELY_MAX_ITERS; }
        var script = new Script(scriptFunction);
        script.finishImmediately(maxIters);
    }
    S.finishImmediately = finishImmediately;
    function runScript(scriptFunction) {
        return function () {
            var script;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        script = global.world.runScript(scriptFunction);
                        _a.label = 1;
                    case 1:
                        if (!!script.done) return [3 /*break*/, 3];
                        return [4 /*yield*/];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 1];
                    case 3: return [2 /*return*/];
                }
            });
        }();
    }
    S.runScript = runScript;
    function simul() {
        var scriptFunctions = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            scriptFunctions[_i] = arguments[_i];
        }
        var scripts = [];
        return {
            generator: function () {
                var i;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            scripts = scriptFunctions.map(function (sfn) { return global.world.runScript(sfn); });
                            _a.label = 1;
                        case 1:
                            if (!!_.isEmpty(scripts)) return [3 /*break*/, 3];
                            for (i = scripts.length - 1; i >= 0; i--) {
                                if (scripts[i].done)
                                    scripts.splice(i, 1);
                            }
                            return [4 /*yield*/];
                        case 2:
                            _a.sent();
                            return [3 /*break*/, 1];
                        case 3: return [2 /*return*/];
                    }
                });
            },
            endState: function () {
                var e_3, _a;
                if (!_.isEmpty(scripts)) {
                    try {
                        for (var scripts_1 = __values(scripts), scripts_1_1 = scripts_1.next(); !scripts_1_1.done; scripts_1_1 = scripts_1.next()) {
                            var script = scripts_1_1.value;
                            script.endState();
                        }
                    }
                    catch (e_3_1) { e_3 = { error: e_3_1 }; }
                    finally {
                        try {
                            if (scripts_1_1 && !scripts_1_1.done && (_a = scripts_1.return)) _a.call(scripts_1);
                        }
                        finally { if (e_3) throw e_3.error; }
                    }
                }
            }
        };
    }
    S.simul = simul;
    function tween(obj, prop, start, end, duration, easingFunction) {
        if (easingFunction === void 0) { easingFunction = Tween.Easing.Linear; }
        return {
            generator: function () {
                var tween;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            tween = new Tween(start, end, duration, easingFunction);
                            _a.label = 1;
                        case 1:
                            if (!!tween.done) return [3 /*break*/, 3];
                            tween.update();
                            obj[prop] = tween.value;
                            return [4 /*yield*/];
                        case 2:
                            _a.sent();
                            return [3 /*break*/, 1];
                        case 3: return [2 /*return*/];
                    }
                });
            },
            endState: function () {
                obj[prop] = end;
            }
        };
    }
    S.tween = tween;
    function wait(time) {
        return {
            generator: doOverTime(time, function (t) { return null; }).generator,
        };
    }
    S.wait = wait;
})(S || (S = {}));
var Camera = /** @class */ (function () {
    function Camera(config) {
        _.defaults(config, {
            width: Main.width,
            height: Main.height,
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
    Camera.prototype.update = function () {
        if (this.mode.type === 'follow') {
            var target = this.mode.target;
            if (_.isString(target)) {
                target = global.world.getWorldObjectByName(target);
            }
            this.moveTowardsPoint(target.x + this.mode.offset.x, target.y + this.mode.offset.y);
        }
        else if (this.mode.type === 'focus') {
            this.moveTowardsPoint(this.mode.point.x, this.mode.point.y);
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
    Camera.prototype.moveTowardsPoint = function (x, y) {
        if (this.movement.type === 'snap') {
            this.x = x;
            this.y = y;
        }
        else if (this.movement.type === 'smooth') {
            // TODO: implement smooth movement
            this.x = x;
            this.y = y;
        }
    };
    Camera.prototype.setModeFollow = function (target, offsetX, offsetY) {
        this.mode = {
            type: 'follow',
            target: target,
            offset: { x: offsetX || 0, y: offsetY || 0 },
        };
    };
    Camera.prototype.setModeFocus = function (x, y) {
        this.mode = {
            type: 'focus',
            point: { x: x, y: y },
        };
    };
    Camera.prototype.setMovementSnap = function () {
        this.movement = {
            type: 'snap',
        };
    };
    Camera.prototype.setMovementSmooth = function (speed, deadZoneWidth, deadZoneHeight) {
        this.movement = {
            type: 'smooth',
            speed: speed,
            deadZoneWidth: deadZoneWidth,
            deadZoneHeight: deadZoneHeight,
        };
    };
    return Camera;
}());
var Cutscene;
(function (Cutscene) {
    function toScript(generator, skipCutsceneScriptKey) {
        return {
            generator: function () {
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
                                result.value = S.simul.apply(S, __spread(result.value.map(function (scr) { return Cutscene.toScript(scr, skipCutsceneScriptKey); })));
                            }
                            script = global.world.runScript(result.value);
                            if (DEBUG_SKIP_ALL_CUTSCENE_SCRIPTS) {
                                script.finishImmediately();
                            }
                            _a.label = 2;
                        case 2:
                            if (!!script.done) return [3 /*break*/, 4];
                            if (DEBUG_SKIP_ALL_CUTSCENE_SCRIPTS || Input.justDown(skipCutsceneScriptKey)) {
                                script.finishImmediately();
                            }
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
            },
            endState: function () { }
        };
    }
    Cutscene.toScript = toScript;
})(Cutscene || (Cutscene = {}));
var CutsceneManager = /** @class */ (function () {
    function CutsceneManager() {
        this.current = null;
        this.playedCutscenes = new Set();
    }
    Object.defineProperty(CutsceneManager.prototype, "isCutscenePlaying", {
        get: function () { return !!this.current; },
        enumerable: true,
        configurable: true
    });
    CutsceneManager.prototype.update = function () {
        if (this.current) {
            if (this.current.script.done) {
                var completedCutscene = this.current;
                this.current = null;
                this.playedCutscenes.add(completedCutscene.name);
                if (completedCutscene.cutscene.after) {
                    global.theater.startStoryboardComponentByName(completedCutscene.cutscene.after);
                }
            }
        }
    };
    CutsceneManager.prototype.canPlayCutscene = function (name) {
        var cutscene = global.theater.getStoryboardComponentByName(name);
        if (cutscene.type !== 'cutscene') {
            return false;
        }
        if (cutscene.playOnlyOnce && this.playedCutscenes.has(name)) {
            return false;
        }
        return true;
    };
    CutsceneManager.prototype.playCutscene = function (name, cutscene, world, skipCutsceneScriptKey) {
        if (this.current) {
            debug("Cannot play cutscene:", cutscene, "because a cutscene is already playing:", this.current.cutscene);
            return;
        }
        var script = world.runScript(Cutscene.toScript(cutscene.script, skipCutsceneScriptKey));
        this.current = { name: name, cutscene: cutscene, script: script };
    };
    CutsceneManager.prototype.reset = function () {
        if (this.current) {
            this.current.script.done = true;
        }
        this.current = null;
    };
    return CutsceneManager;
}());
var S;
(function (S) {
    function dialog(p1, p2) {
        return {
            generator: function () {
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
            },
            endState: function () {
                global.theater.dialogBox.done = true;
            }
        };
    }
    S.dialog = dialog;
    function fadeSlides(duration, removeAllButLast) {
        if (removeAllButLast === void 0) { removeAllButLast = 1; }
        return {
            generator: function () {
                var slideAlphas, timer, i;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            global.theater.clearSlides(removeAllButLast);
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
                            timer.update();
                            return [4 /*yield*/];
                        case 2:
                            _a.sent();
                            return [3 /*break*/, 1];
                        case 3: return [2 /*return*/];
                    }
                });
            },
            endState: function () {
                global.theater.clearSlides();
            }
        };
    }
    S.fadeSlides = fadeSlides;
    function fadeOut(duration, tint) {
        if (tint === void 0) { tint = 0x000000; }
        var graphics = new PIXI.Graphics();
        graphics.beginFill(tint, 1);
        graphics.drawRect(0, 0, Main.width, Main.height);
        graphics.endFill();
        return showSlide({ x: 0, y: 0, graphics: graphics, timeToLoad: duration, fadeIn: true });
    }
    S.fadeOut = fadeOut;
    function jump(sprite, peakDelta, time, landOnGround) {
        if (landOnGround === void 0) { landOnGround = false; }
        var start = sprite.offset.y;
        var groundDelta = landOnGround ? -start : 0;
        return {
            generator: function () {
                var timer;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            timer = new Timer(time);
                            _a.label = 1;
                        case 1:
                            if (!!timer.done) return [3 /*break*/, 3];
                            sprite.offset.y = M.jumpParabola(start, -peakDelta, groundDelta, timer.progress);
                            timer.update();
                            return [4 /*yield*/];
                        case 2:
                            _a.sent();
                            return [3 /*break*/, 1];
                        case 3: return [2 /*return*/];
                    }
                });
            },
            endState: function () {
                sprite.offset.y = start + groundDelta;
            }
        };
    }
    S.jump = jump;
    function moveTo(worldObject, x, y, maxTime) {
        if (maxTime === void 0) { maxTime = 10; }
        return S.simul(moveToX(worldObject, x, maxTime), moveToY(worldObject, y, maxTime));
    }
    S.moveTo = moveTo;
    function moveToX(worldObject, x, maxTime) {
        if (maxTime === void 0) { maxTime = 10; }
        return {
            generator: function () {
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
                            timer.update();
                            return [4 /*yield*/];
                        case 2:
                            _a.sent();
                            return [3 /*break*/, 1];
                        case 3: return [3 /*break*/, 6];
                        case 4:
                            if (!(worldObject.x > x && !timer.done)) return [3 /*break*/, 6];
                            worldObject.controller.left = true;
                            timer.update();
                            return [4 /*yield*/];
                        case 5:
                            _a.sent();
                            return [3 /*break*/, 4];
                        case 6: return [2 /*return*/];
                    }
                });
            },
            endState: function () {
                worldObject.x = x;
            }
        };
    }
    S.moveToX = moveToX;
    function moveToY(worldObject, y, maxTime) {
        if (maxTime === void 0) { maxTime = 10; }
        return {
            generator: function () {
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
                            timer.update();
                            return [4 /*yield*/];
                        case 2:
                            _a.sent();
                            return [3 /*break*/, 1];
                        case 3: return [3 /*break*/, 6];
                        case 4:
                            if (!(worldObject.y > y && !timer.done)) return [3 /*break*/, 6];
                            worldObject.controller.up = true;
                            timer.update();
                            return [4 /*yield*/];
                        case 5:
                            _a.sent();
                            return [3 /*break*/, 4];
                        case 6: return [2 /*return*/];
                    }
                });
            },
            endState: function () {
                worldObject.y = y;
            }
        };
    }
    S.moveToY = moveToY;
    function playAnimation(sprite, animationName, startFrame, force, waitForCompletion) {
        if (startFrame === void 0) { startFrame = 0; }
        if (force === void 0) { force = true; }
        if (waitForCompletion === void 0) { waitForCompletion = true; }
        return {
            generator: function () {
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
            }
        };
    }
    S.playAnimation = playAnimation;
    function shake(intensity, time) {
        return {
            generator: function () {
                var timer;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            global.world.camera.shakeIntensity = intensity;
                            timer = new Timer(time);
                            _a.label = 1;
                        case 1:
                            if (!!timer.done) return [3 /*break*/, 3];
                            timer.update();
                            return [4 /*yield*/];
                        case 2:
                            _a.sent();
                            return [3 /*break*/, 1];
                        case 3: return [2 /*return*/];
                    }
                });
            },
            endState: function () {
                global.world.camera.shakeIntensity = 0;
            }
        };
    }
    S.shake = shake;
    function showSlide(config, waitForCompletion) {
        if (waitForCompletion === void 0) { waitForCompletion = true; }
        var slide;
        return {
            generator: function () {
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
            },
            endState: function () {
                if (!slide) {
                    slide = global.theater.addSlideByConfig(config);
                }
                slide.finishLoading();
            }
        };
    }
    S.showSlide = showSlide;
})(S || (S = {}));
//var DEBUG: boolean = true;
var DEBUG_ALL_PHYSICS_BOUNDS = false;
var DEBUG_MOVE_CAMERA_WITH_ARROWS = true;
var DEBUG_SHOW_MOUSE_POSITION = true;
var DEBUG_SKIP_ALL_CUTSCENE_SCRIPTS = false;
var debug = console.info;
// function debug(message?: any, ...optionalParams: any[]) {
//     if (DEBUG) {
//         console.log(message, ...optionalParams);
//     }
// }
function get(name) {
    var worldObject = Main.theater.currentWorld.getWorldObjectByName(name);
    if (worldObject)
        return worldObject;
    return undefined;
}
/// <reference path="./physicsWorldObject.ts" />
var Sprite = /** @class */ (function (_super) {
    __extends(Sprite, _super);
    function Sprite(config, defaults) {
        var e_4, _a;
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
            if (config.renderTexture instanceof PIXIRenderTextureSprite) {
                _this.setRenderTexture(config.renderTexture);
            }
            else {
                _this.setRenderTextureDimensions(config.renderTexture.width, config.renderTexture.height);
            }
        }
        else {
            debug("SpriteConfig must have texture, graphics, or renderTexture specified:", config);
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
                    _.defaults(animation, {
                        duration: 0,
                    });
                    _this.animationManager.addAnimation(animation.name, animation.frames);
                }
            }
            catch (e_4_1) { e_4 = { error: e_4_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_4) throw e_4.error; }
            }
        }
        if (config.defaultAnimation) {
            _this.playAnimation(config.defaultAnimation, 0, true);
        }
        _this.flipX = false;
        _this.flipY = false;
        _this.offset = config.offset || { x: 0, y: 0 };
        _this.angle = O.getOrDefault(config.angle, 0);
        _this.tint = O.getOrDefault(config.tint, 0xFFFFFF);
        _this.alpha = O.getOrDefault(config.alpha, 1);
        _this.effects = Effects.empty();
        _this.setEffects(config.effects);
        _this.effectsFilter = new Effects.Filter(_this.effects);
        return _this;
    }
    Sprite.prototype.update = function () {
        _super.prototype.update.call(this);
        this.animationManager.update();
        if (global.world.getName(this) === 'angie' && Input.justDown('1')) {
            this.effects.outline.enabled = !this.effects.outline.enabled;
            this.effects.outline.color = 0xFF00FF;
        }
    };
    Sprite.prototype.render = function () {
        this.effectsFilter.update();
        this.setDisplayObjectProperties();
        global.renderer.render(this.displayObject, global.renderTexture, false);
        _super.prototype.render.call(this);
    };
    Sprite.prototype.getCurrentAnimationName = function () {
        return this.animationManager.getCurrentAnimationName();
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
        this.displayObject.x = this.x + this.offset.x;
        this.displayObject.y = this.y + this.offset.y;
        this.displayObject.scale.x = this.flipX ? -1 : 1;
        this.displayObject.scale.y = this.flipY ? -1 : 1;
        this.displayObject.angle = this.angle;
        this.displayObject.tint = this.tint;
        this.displayObject.alpha = this.alpha;
        this.displayObject.filters = [this.effectsFilter];
        this.displayObject.filterArea = global.renderer.screen;
    };
    Sprite.prototype.setEffects = function (effects) {
        if (!effects)
            return;
        for (var key in effects) {
            this.effects[key] = _.clone(effects[key]);
        }
    };
    Sprite.prototype.setGraphics = function (graphics) {
        this.displayObject = graphics;
        this.spriteType = Sprite.Type.GRAPHICS;
    };
    Sprite.prototype.setRenderTexture = function (renderTexture) {
        this.displayObject = renderTexture;
        this.spriteType = Sprite.Type.RENDERTEXTURE;
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
                // creating new PIXI sprite to avoid scaling/anchor issues when changing to a texture with a different width/height/anchor
                this.displayObject = new PIXI.Sprite(texture);
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
        _this.textAreaFull = config.textAreaFull;
        _this.portraitPosition = config.portraitPosition;
        _this.textAreaPortrait = config.textAreaPortrait;
        _this.advanceKey = config.advanceKey;
        _this.textArea = _this.textAreaFull;
        _this.done = true;
        _this.spriteText = new SpriteText({
            font: config.spriteTextFont,
        });
        _this.spriteTextMask = Mask.newRectangleMask(_this.getTextAreaWorldRect());
        _this.spriteText.mask = _this.spriteTextMask;
        _this.spriteTextOffset = 0;
        _this.portraitSprite = new Sprite({ texture: 'none' });
        _this.characterTimer = new Timer(0.05, function () { return _this.advanceCharacter(); }, true);
        return _this;
    }
    DialogBox.prototype.update = function () {
        _super.prototype.update.call(this);
        this.characterTimer.update();
        if (this.done) {
            this.visible = false;
        }
        if (Input.justDown(this.advanceKey)) {
            this.advanceDialog();
        }
    };
    DialogBox.prototype.render = function () {
        _super.prototype.render.call(this);
        this.drawMask();
        if (this.portraitSprite.visible) {
            this.setPortraitSpriteProperties();
            this.portraitSprite.render();
        }
        this.setSpriteTextProperties();
        this.spriteText.render();
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
    DialogBox.prototype.drawMask = function () {
        Mask.drawRectangleMask(this.spriteTextMask, this.getTextAreaWorldRect());
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
    Draw.drawRectangle = function (x, y, width, height) {
        this.graphics.clear();
        this.graphics.beginFill(this._fillColor, this._fillAlpha);
        this.graphics.drawRect(x, y, width, height);
        this.graphics.endFill();
        this.render();
        return this;
    };
    Draw.render = function () {
        global.renderer.render(this.graphics, global.renderTexture, false);
    };
    Draw.graphics = new PIXI.Graphics();
    Draw._fillColor = 0x000000;
    Draw._fillAlpha = 1;
    Draw.ALIGNMENT_INNER = 0;
    Draw.ALIGNMENT_MIDDLE = 0.5;
    Draw.ALIGNMENT_OUTER = 1;
    return Draw;
}());
var Effects;
(function (Effects) {
    function empty() {
        return {
            silhouette: {
                enabled: false,
                color: 0xFFFFFF,
            },
            outline: {
                enabled: false,
                color: 0x000000,
            },
        };
    }
    Effects.empty = empty;
    function partial(effects) {
        var result = empty();
        O.deepOverride(result, effects);
        return result;
    }
    Effects.partial = partial;
    var Filter = /** @class */ (function (_super) {
        __extends(Filter, _super);
        function Filter(effects) {
            var _this = _super.call(this, Filter.vertSource, Filter.fragSource, {}) || this;
            _this.effects = effects;
            _this.update();
            return _this;
        }
        Filter.prototype.update = function () {
            this.uniforms.filterDimensions = [Main.width, Main.height];
            this.uniforms.silhouetteEnabled = this.effects.silhouette.enabled;
            this.uniforms.silhouetteColor = this.colorToVec3(this.effects.silhouette.color);
            this.uniforms.outlineEnabled = this.effects.outline.enabled;
            this.uniforms.outlineColor = this.colorToVec3(this.effects.outline.color);
        };
        Filter.prototype.colorToVec3 = function (color) {
            var r = (color >> 16) & 255;
            var g = (color >> 8) & 255;
            var b = color & 255;
            return [r / 255, g / 255, b / 255];
        };
        return Filter;
    }(PIXI.Filter));
    Effects.Filter = Filter;
    (function (Filter) {
        Filter.vertSource = "\n            attribute vec2 aVertexPosition;\n            uniform mat3 projectionMatrix;\n            varying vec2 vTextureCoord;\n            uniform vec4 inputSize;\n            uniform vec4 outputFrame;\n            \n            vec4 filterVertexPosition(void) {\n                vec2 position = aVertexPosition * max(outputFrame.zw, vec2(0.)) + outputFrame.xy;\n                return vec4((projectionMatrix * vec3(position, 1.0)).xy, 0.0, 1.0);\n            }\n            \n            vec2 filterTextureCoord(void) {\n                return aVertexPosition * (outputFrame.zw * inputSize.zw);\n            }\n            \n            void main(void) {\n                gl_Position = filterVertexPosition();\n                vTextureCoord = filterTextureCoord();\n            }\n        ";
        Filter.fragSource = "\n            varying vec2 vTextureCoord;\n            uniform sampler2D uSampler;\n            uniform vec2 filterDimensions;\n\n            uniform bool silhouetteEnabled;\n            uniform vec3 silhouetteColor;\n\n            uniform bool outlineEnabled;\n            uniform vec3 outlineColor;\n            \n            void main(void) {\n                vec2 px = vec2(1.0/filterDimensions.x, 1.0/filterDimensions.y);\n                vec4 c = texture2D(uSampler, vTextureCoord);\n                \n                // Un-premultiply alpha before applying the color matrix. See PIXI issue #3539.\n                if (c.a > 0.0) {\n                    c.rgb /= c.a;\n                }\n                \n                vec4 result = vec4(c);\n\n                if (silhouetteEnabled) {\n                    result.r = silhouetteColor.r;\n                    result.g = silhouetteColor.g;\n                    result.b = silhouetteColor.b;\n                }\n\n                if (outlineEnabled) {\n                    vec4 cup = texture2D(uSampler, vTextureCoord + vec2(0.0, -px.y));\n                    vec4 cdown = texture2D(uSampler, vTextureCoord + vec2(0.0, px.y));\n                    vec4 cleft = texture2D(uSampler, vTextureCoord + vec2(-px.x, 0.0));\n                    vec4 cright = texture2D(uSampler, vTextureCoord + vec2(px.x, 0.0));\n                    if (c.a == 0. && (cup.a > 0. || cdown.a > 0. || cleft.a > 0. || cright.a > 0.)) {\n                        result.r = outlineColor.r;\n                        result.g = outlineColor.g;\n                        result.b = outlineColor.b;\n                        result.a = 1.0;\n                    }\n                }\n                \n                // Premultiply alpha again.\n                result.rgb *= result.a;\n\n                gl_FragColor = result;\n            }\n        ";
    })(Filter = Effects.Filter || (Effects.Filter = {}));
})(Effects || (Effects = {}));
var Follow = /** @class */ (function () {
    function Follow(target, maxDistance, moveThreshold) {
        if (moveThreshold === void 0) { moveThreshold = 2; }
        this.target = target;
        this.maxDistance = maxDistance;
        this.targetHistory = [];
        this.moveThreshold = moveThreshold;
    }
    Follow.prototype.update = function (sprite) {
        this.attemptToResolveTarget();
        this.pushTargetPosition();
        var dist = 0;
        var i = 0;
        for (i = this.targetHistory.length - 4; i >= 0 && dist < this.maxDistance; i -= 2) {
            var p1 = { x: this.targetHistory[i + 0], y: this.targetHistory[i + 1] };
            var p2 = { x: this.targetHistory[i + 2], y: this.targetHistory[i + 3] };
            dist += M.distance(p1, p2);
        }
        if (i >= 0) {
            this.targetHistory.splice(0, i);
        }
        if (!_.isEmpty(this.targetHistory)) {
            var dx = this.targetHistory[0] - sprite.x;
            var dy = this.targetHistory[1] - sprite.y;
            if (dx >= this.moveThreshold)
                sprite.controller.right = true;
            else if (dx <= -this.moveThreshold)
                sprite.controller.left = true;
            if (dy >= this.moveThreshold)
                sprite.controller.down = true;
            else if (dy <= -this.moveThreshold)
                sprite.controller.up = true;
        }
    };
    Follow.prototype.renderTrail = function () {
        for (var i = 0; i < this.targetHistory.length - 1; i += 2) {
            Draw.noStroke().fillColor(0x00FF00)
                .drawRectangle(this.targetHistory[i], this.targetHistory[i + 1], 1, 1);
        }
    };
    Follow.prototype.attemptToResolveTarget = function () {
        if (_.isString(this.target)) {
            this.target = global.world.worldObjectsByName[this.target] || this.target;
        }
    };
    Follow.prototype.pushTargetPosition = function () {
        if (_.isString(this.target))
            return;
        if (_.isEmpty(this.targetHistory)
            || this.target.x !== this.targetHistory[this.targetHistory.length - 2]
            || this.target.y !== this.targetHistory[this.targetHistory.length - 1]) {
            this.targetHistory.push(this.target.x, this.target.y);
        }
    };
    return Follow;
}());
var global = /** @class */ (function () {
    function global() {
    }
    global.clearStacks = function () {
        this.worldStack = [];
        this.deltaStack = [];
        this.rendererStack = [];
        this.renderTextureStack = [];
        this.scriptStack = [];
    };
    global.getSprite = function (name) {
        var obj = this.world.getWorldObjectByName(name);
        if (!(obj instanceof Sprite)) {
            debug("Getting sprite '" + name + "' from world which is not a sprite!", this.world);
            return undefined;
        }
        return obj;
    };
    global.getWorldObject = function (name) {
        return this.world.getWorldObjectByName(name);
    };
    Object.defineProperty(global, "world", {
        // Update options
        get: function () { return this.worldStack[this.worldStack.length - 1]; },
        enumerable: true,
        configurable: true
    });
    ;
    global.pushWorld = function (world) { this.worldStack.push(world); };
    global.popWorld = function () { return this.worldStack.pop(); };
    Object.defineProperty(global, "delta", {
        get: function () { return this.deltaStack[this.deltaStack.length - 1]; },
        enumerable: true,
        configurable: true
    });
    ;
    global.pushDelta = function (delta) { this.deltaStack.push(delta); };
    global.popDelta = function () { return this.deltaStack.pop(); };
    Object.defineProperty(global, "renderer", {
        // Render options
        get: function () { return this.rendererStack[this.rendererStack.length - 1]; },
        enumerable: true,
        configurable: true
    });
    ;
    global.pushRenderer = function (renderer) { this.rendererStack.push(renderer); };
    global.popRenderer = function () { return this.rendererStack.pop(); };
    Object.defineProperty(global, "renderTexture", {
        get: function () { return this.renderTextureStack[this.renderTextureStack.length - 1]; },
        enumerable: true,
        configurable: true
    });
    ;
    global.pushRenderTexture = function (renderTexture) { this.renderTextureStack.push(renderTexture); };
    global.popRenderTexture = function () { return this.renderTextureStack.pop(); };
    Object.defineProperty(global, "script", {
        get: function () { return this.scriptStack[this.scriptStack.length - 1]; },
        enumerable: true,
        configurable: true
    });
    ;
    global.pushScript = function (script) { this.scriptStack.push(script); };
    global.popScript = function () { return this.scriptStack.pop(); };
    global.worldStack = [];
    global.deltaStack = [];
    global.rendererStack = [];
    global.renderTextureStack = [];
    global.scriptStack = [];
    return global;
}());
function group(config) {
    var e_5, _a;
    _.defaults(config, {
        overrides: [],
        x: 0, y: 0,
        prefix: '',
    });
    var results = config.worldObjects.map(function (obj) { return Stage.resolveWorldObjectConfig(obj); });
    try {
        for (var _b = __values(config.overrides), _c = _b.next(); !_c.done; _c = _b.next()) {
            var override = _c.value;
            for (var i = 0; i < results.length; i++) {
                if (results[i].name === override.name) {
                    override = Stage.resolveWorldObjectConfig(override);
                    override.parent = results[i];
                    delete override.name;
                    results[i] = override;
                    break;
                }
                if (i === results.length - 1) {
                    debug("No world object in group that matches override", override);
                }
            }
        }
    }
    catch (e_5_1) { e_5 = { error: e_5_1 }; }
    finally {
        try {
            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
        }
        finally { if (e_5) throw e_5.error; }
    }
    for (var i = 0; i < results.length; i++) {
        results[i].x = config.x + O.getOrDefault(config.worldObjects[i].x, 0);
        results[i].y = config.y + O.getOrDefault(config.worldObjects[i].y, 0);
        results[i].name = config.prefix + O.getOrDefault(config.worldObjects[i].name, '');
    }
    return results;
}
/// <reference path="./sprite.ts" />
var HumanCharacter = /** @class */ (function (_super) {
    __extends(HumanCharacter, _super);
    function HumanCharacter(config) {
        var _this = _super.call(this, config) || this;
        _this.speed = 60;
        _this.controllerSchema = {
            left: function () { return Input.isDown('left'); },
            right: function () { return Input.isDown('right'); },
            up: function () { return Input.isDown('up'); },
            down: function () { return Input.isDown('down'); },
        };
        _this.direction = Direction2D.LEFT;
        return _this;
    }
    HumanCharacter.prototype.update = function () {
        this.updateFollow();
        var haxis = (this.controller.right ? 1 : 0) - (this.controller.left ? 1 : 0);
        var vaxis = (this.controller.down ? 1 : 0) - (this.controller.up ? 1 : 0);
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
        _super.prototype.update.call(this);
        if (this.isControlled) {
            this.updateInteractions();
        }
        // Handle animation.
        var anim_state = (haxis == 0 && vaxis == 0) ? 'idle' : 'run';
        var anim_dir = this.direction.v == Direction.UP ? 'up' : (this.direction.h == Direction.NONE ? 'down' : 'side');
        this.playAnimation(anim_state + "_" + anim_dir);
    };
    HumanCharacter.prototype.updateInteractions = function () {
        var e_6, _a;
        var interactableObjects = global.theater.interactionManager.getInteractableObjects();
        var interactRadius = 2;
        var highlightedObject = null;
        G.expandRectangle(this.bounds, interactRadius);
        try {
            for (var interactableObjects_1 = __values(interactableObjects), interactableObjects_1_1 = interactableObjects_1.next(); !interactableObjects_1_1.done; interactableObjects_1_1 = interactableObjects_1.next()) {
                var obj = interactableObjects_1_1.value;
                if (this.isOverlapping(global.getWorldObject(obj))) {
                    highlightedObject = obj;
                }
            }
        }
        catch (e_6_1) { e_6 = { error: e_6_1 }; }
        finally {
            try {
                if (interactableObjects_1_1 && !interactableObjects_1_1.done && (_a = interactableObjects_1.return)) _a.call(interactableObjects_1);
            }
            finally { if (e_6) throw e_6.error; }
        }
        G.expandRectangle(this.bounds, -interactRadius);
        global.theater.interactionManager.highlight(highlightedObject);
        if (Input.justDown('interact') && highlightedObject) {
            global.theater.interactionManager.interact(highlightedObject);
        }
    };
    HumanCharacter.prototype.follow = function (thing, maxDistance) {
        if (maxDistance === void 0) { maxDistance = 24; }
        this._follow = new Follow(thing, maxDistance);
    };
    HumanCharacter.prototype.onCollide = function (other) {
        if (other instanceof Warp) {
            other.warp();
        }
    };
    HumanCharacter.prototype.setDirection = function (direction) {
        this.direction.h = direction.h;
        this.direction.v = direction.v;
    };
    HumanCharacter.prototype.updateFollow = function () {
        if (this._follow)
            this._follow.update(this);
    };
    return HumanCharacter;
}(Sprite));
var Input = /** @class */ (function () {
    function Input() {
    }
    Input.setKeys = function (keyCodesByName) {
        var e_7, _a, e_8, _b;
        this.keyCodesByName = _.clone(keyCodesByName);
        this.isDownByKeyCode = {};
        this.keysByKeycode = {};
        for (var name_2 in keyCodesByName) {
            try {
                for (var _c = __values(keyCodesByName[name_2]), _d = _c.next(); !_d.done; _d = _c.next()) {
                    var keyCode = _d.value;
                    this.isDownByKeyCode[keyCode] = false;
                    this.keysByKeycode[keyCode] = this.keysByKeycode[keyCode] || new Input.Key();
                }
            }
            catch (e_7_1) { e_7 = { error: e_7_1 }; }
            finally {
                try {
                    if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
                }
                finally { if (e_7) throw e_7.error; }
            }
        }
        try {
            for (var _e = __values(Input.MOUSE_KEYCODES), _f = _e.next(); !_f.done; _f = _e.next()) {
                var keyCode = _f.value;
                this.isDownByKeyCode[keyCode] = false;
                this.keysByKeycode[keyCode] = new Input.Key();
            }
        }
        catch (e_8_1) { e_8 = { error: e_8_1 }; }
        finally {
            try {
                if (_f && !_f.done && (_b = _e.return)) _b.call(_e);
            }
            finally { if (e_8) throw e_8.error; }
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
            this._mouseX = Math.floor(this._globalMouseX);
            this._mouseY = Math.floor(this._globalMouseY);
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
var InteractionManager = /** @class */ (function () {
    function InteractionManager(config) {
        this.highlightFunction = config.highlightFunction;
        this.resetFunction = config.resetFunction;
        this.highlightedObject = null;
    }
    InteractionManager.prototype.update = function () {
        var e_9, _a;
        try {
            for (var _b = __values(global.world.worldObjects), _c = _b.next(); !_c.done; _c = _b.next()) {
                var obj = _c.value;
                if (obj instanceof Sprite) {
                    if (obj === this.highlightedObject) {
                        this.highlightFunction(obj);
                    }
                    else {
                        this.resetFunction(obj);
                    }
                }
            }
        }
        catch (e_9_1) { e_9 = { error: e_9_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_9) throw e_9.error; }
        }
    };
    InteractionManager.prototype.getInteractableObjects = function () {
        var e_10, _a, e_11, _b;
        var result = new Set();
        var cutscenes = this.getInteractableCutscenes();
        try {
            for (var cutscenes_1 = __values(cutscenes), cutscenes_1_1 = cutscenes_1.next(); !cutscenes_1_1.done; cutscenes_1_1 = cutscenes_1.next()) {
                var cutscene = cutscenes_1_1.value;
                try {
                    for (var _c = __values(global.theater.storyboard[cutscene].playOnInteractWith), _d = _c.next(); !_d.done; _d = _c.next()) {
                        var obj = _d.value;
                        result.add(obj);
                    }
                }
                catch (e_11_1) { e_11 = { error: e_11_1 }; }
                finally {
                    try {
                        if (_d && !_d.done && (_b = _c.return)) _b.call(_c);
                    }
                    finally { if (e_11) throw e_11.error; }
                }
            }
        }
        catch (e_10_1) { e_10 = { error: e_10_1 }; }
        finally {
            try {
                if (cutscenes_1_1 && !cutscenes_1_1.done && (_a = cutscenes_1.return)) _a.call(cutscenes_1);
            }
            finally { if (e_10) throw e_10.error; }
        }
        return result;
    };
    InteractionManager.prototype.highlight = function (obj) {
        if (!obj) {
            this.highlightedObject = null;
            return;
        }
        if (_.isString(obj)) {
            var worldObject = global.world.getWorldObjectByName(obj);
            if (!(worldObject instanceof Sprite))
                return;
            obj = worldObject;
        }
        this.highlightedObject = obj;
    };
    InteractionManager.prototype.interact = function (obj) {
        if (!_.isString(obj)) {
            var objName = global.world.getName(obj);
            if (!objName)
                return;
            obj = objName;
        }
        var cutscenes = this.getCutscenesForInteraction(obj);
        if (_.isEmpty(cutscenes)) {
            debug("No cutscene available to interact with object " + obj);
            return;
        }
        if (cutscenes.length > 1) {
            debug("More than one cutscene available to interact with object " + obj);
            return;
        }
        global.theater.startStoryboardComponentByName(cutscenes[0]);
    };
    InteractionManager.prototype.reset = function () {
        this.highlightedObject = null;
    };
    InteractionManager.prototype.getCutscenesForInteraction = function (objName) {
        return this.getInteractableCutscenes().filter(function (cutscene) {
            var component = global.theater.storyboard[cutscene];
            return component && component.type === 'cutscene' && _.contains(component.playOnInteractWith, objName);
        });
    };
    InteractionManager.prototype.getInteractableCutscenes = function () {
        var result = [];
        for (var key in global.theater.storyboard) {
            var component = global.theater.storyboard[key];
            if (component.type !== 'cutscene')
                continue;
            if (!global.theater.cutsceneManager.canPlayCutscene(key))
                continue;
            if (_.isEmpty(component.playOnInteractWith))
                continue;
            result.push(key);
        }
        return result;
    };
    return InteractionManager;
}());
/// <reference path="./preload.ts" />
function load() {
    PIXI.utils.sayHello(PIXI.utils.isWebGLSupported() ? 'WebGL' : 'Canvas');
    Preload.preload({
        textures: Assets.textures,
        pyxelTilemaps: Assets.pyxelTilemaps,
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
        this.backgroundColor = 0x061639;
        this.renderer = PIXI.autoDetectRenderer({
            width: this.width,
            height: this.height,
            resolution: 4,
            backgroundColor: this.backgroundColor,
        });
        document.body.appendChild(this.renderer.view);
        Input.setKeys({
            'left': ['ArrowLeft'],
            'right': ['ArrowRight'],
            'up': ['ArrowUp'],
            'down': ['ArrowDown'],
            'interact': ['e'],
            'advanceDialog': ['MouseLeft', 'e', ' '],
            'skipCutsceneScript': ['Escape'],
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
        });
        window.addEventListener("keydown", function (event) { return Input.handleKeyDownEvent(event); }, false);
        window.addEventListener("keyup", function (event) { return Input.handleKeyUpEvent(event); }, false);
        window.addEventListener("mousedown", function (event) { return Input.handleMouseDownEvent(event); }, false);
        window.addEventListener("mouseup", function (event) { return Input.handleMouseUpEvent(event); }, false);
        //window.addEventListener("contextmenu", event => event.preventDefault(), false);
        this.theater = new Theater({
            stages: stages,
            stageToLoad: 'main',
            stageEntryPoint: 'entrance',
            storyboard: storyboard,
            storyboardEntry: 'room_intro',
            party: party,
            dialogBox: {
                x: Main.width / 2, y: Main.height - 32,
                texture: 'dialogbox',
                spriteTextFont: Assets.fonts.DELUXE16,
                textAreaFull: { x: -122, y: -27, width: 244, height: 54 },
                textAreaPortrait: { x: -122, y: -27, width: 174, height: 54 },
                portraitPosition: { x: 86, y: 0 },
                advanceKey: 'advanceDialog',
            },
            skipCutsceneScriptKey: 'skipCutsceneScript',
            interactionManager: {
                highlightFunction: function (sprite) {
                    sprite.effects.outline.enabled = true;
                    sprite.effects.outline.color = 0xFFFF00;
                },
                resetFunction: function (sprite) {
                    sprite.effects.outline.enabled = false;
                },
            }
        });
        global.theater = this.theater;
        global.clearStacks();
        global.pushRenderer(this.renderer);
        global.pushRenderTexture(undefined);
        PIXI.Ticker.shared.add(function (frameDelta) {
            _this.delta = frameDelta / 60;
            Input.update();
            global.pushWorld(null);
            global.pushDelta(_this.delta);
            _this.theater.update();
            _this.renderer.render(Utils.NOOP_DISPLAYOBJECT, undefined, true); // Clear the renderer
            _this.theater.render();
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
var Party = /** @class */ (function () {
    function Party(config) {
        this.leader = config.leader;
        this.activeMembers = config.activeMembers;
        this.members = config.members;
    }
    Party.prototype.addMemberToWorld = function (name, world) {
        var member = this.members[name];
        if (!member)
            return;
        return world.addWorldObject(member.worldObject, {
            name: member.config.name,
            layer: member.config.layer,
            // @ts-ignore
            physicsGroup: member.config.physicsGroup,
        });
    };
    Party.prototype.getMember = function (name) {
        var member = this.members[name];
        if (!member) {
            debug("No party member named '" + name + "':", this);
        }
        return member;
    };
    Party.prototype.isMemberActive = function (name) {
        return _.contains(this.activeMembers, name);
    };
    Object.defineProperty(Party.prototype, "leader", {
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
    Party.prototype.load = function () {
        for (var key in this.members) {
            var member = this.members[key];
            member.worldObject = new member.config.constructor(member.config);
            if (key === this.leader) {
                member.worldObject.controllable = true;
            }
        }
    };
    Party.prototype.setMemberActive = function (name) {
        if (this.isMemberActive(name))
            return;
        this.activeMembers.push(name);
    };
    Party.prototype.setMemberInactive = function (name) {
        A.removeAll(this.activeMembers, name);
    };
    return Party;
}());
/// <reference path="./party.ts"/>
var party = new Party({
    leader: 'angie',
    activeMembers: ['angie'],
    members: {
        'angie': {
            config: {
                name: 'angie',
                constructor: HumanCharacter,
                x: 128, y: 108,
                layer: 'main',
                texture: 'angie_sprites_0',
                animations: [
                    Animations.fromTextureList({ name: 'idle_side', texturePrefix: 'angie_sprites_', textures: [0, 1], frameRate: 1, count: -1 }),
                    Animations.fromTextureList({ name: 'idle_down', texturePrefix: 'angie_sprites_', textures: [8, 9], frameRate: 1, count: -1 }),
                    Animations.fromTextureList({ name: 'idle_up', texturePrefix: 'angie_sprites_', textures: [16, 17], frameRate: 1, count: -1 }),
                    Animations.fromTextureList({ name: 'run_side', texturePrefix: 'angie_sprites_', textures: [2, 3], frameRate: 8, count: -1 }),
                    Animations.fromTextureList({ name: 'run_down', texturePrefix: 'angie_sprites_', textures: [10, 11], frameRate: 8, count: -1 }),
                    Animations.fromTextureList({ name: 'run_up', texturePrefix: 'angie_sprites_', textures: [18, 19], frameRate: 8, count: -1 }),
                ],
                physicsGroup: 'player',
                bounds: { x: -5, y: -2, width: 10, height: 2 },
                controllable: true,
            },
        },
        'milo': {
            config: {
                name: 'milo',
                constructor: HumanCharacter,
                x: 128, y: 108,
                layer: 'main',
                texture: 'milo_sprites_0',
                animations: [
                    Animations.fromTextureList({ name: 'idle_side', texturePrefix: 'milo_sprites_', textures: [0, 1], frameRate: 1, count: -1 }),
                    Animations.fromTextureList({ name: 'idle_down', texturePrefix: 'milo_sprites_', textures: [8, 9], frameRate: 1, count: -1 }),
                    Animations.fromTextureList({ name: 'idle_up', texturePrefix: 'milo_sprites_', textures: [16, 17], frameRate: 1, count: -1 }),
                    Animations.fromTextureList({ name: 'run_side', texturePrefix: 'milo_sprites_', textures: [2, 3], frameRate: 8, count: -1 }),
                    Animations.fromTextureList({ name: 'run_down', texturePrefix: 'milo_sprites_', textures: [10, 11], frameRate: 8, count: -1 }),
                    Animations.fromTextureList({ name: 'run_up', texturePrefix: 'milo_sprites_', textures: [18, 19], frameRate: 8, count: -1 }),
                    Animations.fromTextureList({ name: 'flop', texturePrefix: 'milo_sprites_', textures: [4, 5, 6, 7], frameRate: 16, nextFrameRef: 'flop_lay/0', forceRequired: true }),
                    Animations.fromTextureList({ name: 'flop_lay', texturePrefix: 'milo_sprites_', textures: [4], frameRate: 1, count: -1, forceRequired: true }),
                ],
                physicsGroup: 'player',
                bounds: { x: -5, y: -2, width: 10, height: 2 },
            },
        },
    }
});
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
        var e_12, _a;
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
            catch (e_12_1) { e_12 = { error: e_12_1 }; }
            finally {
                try {
                    if (collisions_1_1 && !collisions_1_1.done && (_a = collisions_1.return)) _a.call(collisions_1);
                }
                finally { if (e_12) throw e_12.error; }
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
var Script = /** @class */ (function () {
    function Script(scriptFunction) {
        this.generator = scriptFunction.generator();
        this.endState = scriptFunction.endState;
        this.skippable = O.getOrDefault(scriptFunction.skippable, true);
    }
    Object.defineProperty(Script.prototype, "running", {
        get: function () {
            return !this.paused && !this.done;
        },
        enumerable: true,
        configurable: true
    });
    Script.prototype.update = function () {
        if (!this.running)
            return;
        global.pushScript(this);
        var result = this.generator.next();
        if (result.done) {
            if (this.endState)
                this.endState();
            this.done = true;
        }
        global.popScript();
    };
    Script.prototype.finishImmediately = function (maxIters) {
        if (maxIters === void 0) { maxIters = Script.FINISH_IMMEDIATELY_MAX_ITERS; }
        var result = this.generator.next();
        for (var i = 0; i < maxIters && !result.done; i++) {
            result = this.generator.next();
        }
        if (this.endState)
            this.endState();
        this.done = true;
    };
    Script.FINISH_IMMEDIATELY_MAX_ITERS = 1000000;
    return Script;
}());
var ScriptManager = /** @class */ (function () {
    function ScriptManager() {
        this.activeScripts = [];
    }
    ScriptManager.prototype.update = function () {
        for (var i = this.activeScripts.length - 1; i >= 0; i--) {
            this.activeScripts[i].update();
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
            x: Main.width / 2,
            y: Main.height / 2,
        }) || this;
        _this.timer = new Timer(O.getOrDefault(config.timeToLoad, 0));
        if (config.fadeIn) {
            _this.targetAlpha = _this.alpha;
            _this.alpha = 0;
        }
        _this.fullyLoaded = false;
        return _this;
    }
    Slide.prototype.update = function () {
        _super.prototype.update.call(this);
        if (this.fullyLoaded)
            return;
        this.timer.update();
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
    SpriteText.prototype.update = function () {
        _super.prototype.update.call(this);
    };
    SpriteText.prototype.render = function () {
        var e_13, _a;
        try {
            for (var _b = __values(this.chars), _c = _b.next(); !_c.done; _c = _b.next()) {
                var char = _c.value;
                this.setFontSpriteToCharacter(char);
                this.setStyle(char.style);
                global.renderer.render(this.fontSprite, global.renderTexture, false);
            }
        }
        catch (e_13_1) { e_13 = { error: e_13_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_13) throw e_13.error; }
        }
        _super.prototype.render.call(this);
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
        var e_14, _a;
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
            catch (e_14_1) { e_14 = { error: e_14_1 }; }
            finally {
                try {
                    if (word_1_1 && !word_1_1.done && (_a = word_1.return)) _a.call(word_1);
                }
                finally { if (e_14) throw e_14.error; }
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
var Stage;
(function (Stage) {
    function getEntryPoint(stage, entryPointKey) {
        if (!stage.entryPoints || !stage.entryPoints[entryPointKey]) {
            debug("Stage does not have an entry point named '" + entryPointKey + ":'", stage);
            return undefined;
        }
        return stage.entryPoints[entryPointKey];
    }
    Stage.getEntryPoint = getEntryPoint;
    function resolveStageConfig(config) {
        if (!config.parent)
            return _.clone(config);
        var result = resolveStageConfig(config.parent);
        for (var key in config) {
            if (key === 'parent')
                continue;
            if (!result[key]) {
                result[key] = config[key];
            }
            else if (key === 'worldObjects') {
                result[key] = mergeArray(config[key], result[key], function (e) { return e.name; }, function (e, into) {
                    e = resolveWorldObjectConfig(e);
                    e.parent = into;
                    return resolveWorldObjectConfig(e);
                });
            }
            else if (key === 'entryPoints') {
                result[key] = mergeObject(config[key], result[key]);
            }
            else if (key === 'layers') {
                result[key] = mergeArray(config[key], result[key], function (e) { return e.name; }, function (e, into) {
                    return mergeObject(e, into);
                });
            }
            else {
                result[key] = config[key];
            }
        }
        return result;
    }
    Stage.resolveStageConfig = resolveStageConfig;
    function resolveWorldObjectConfig(config) {
        if (!config.parent)
            return _.clone(config);
        var result = resolveWorldObjectConfig(config.parent);
        for (var key in config) {
            if (key === 'parent')
                continue;
            if (!result[key]) {
                result[key] = config[key];
            }
            else if (key === 'animations') {
                result[key] = mergeArray(config[key], result[key], function (e) { return e.name; });
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
    Stage.resolveWorldObjectConfig = resolveWorldObjectConfig;
    function mergeArray(array, into, key, combine) {
        if (combine === void 0) { combine = (function (e, into) { return e; }); }
        var e_15, _a;
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
        catch (e_15_1) { e_15 = { error: e_15_1 }; }
        finally {
            try {
                if (array_1_1 && !array_1_1.done && (_a = array_1.return)) _a.call(array_1);
            }
            finally { if (e_15) throw e_15.error; }
        }
        return result;
    }
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
})(Stage || (Stage = {}));
var O;
(function (O) {
    function deepOverride(obj, overrides) {
        for (var key in overrides) {
            if (obj[key] && _.isObject(obj[key]) && _.isObject(overrides[key])) {
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
var Transition;
(function (Transition) {
    Transition.INSTANT = { type: 'instant' };
    function FADE(preTime, time, postTime) {
        return {
            type: 'fade', preTime: preTime, time: time, postTime: postTime
        };
    }
    Transition.FADE = FADE;
    var Obj = /** @class */ (function (_super) {
        __extends(Obj, _super);
        function Obj(oldSnapshot, newSnapshot, transition) {
            var _this = _super.call(this, {}) || this;
            _this.oldSprite = new Sprite({ renderTexture: oldSnapshot });
            _this.newSprite = new Sprite({ renderTexture: newSnapshot });
            _this.done = false;
            if (transition.type === 'instant') {
                _this.done = true;
            }
            else if (transition.type === 'fade') {
                _this.oldSprite.alpha = 1;
                _this.newSprite.alpha = 0;
                global.theater.runScript({
                    generator: S.chain(S.wait(transition.preTime), S.doOverTime(transition.time, function (t) {
                        _this.oldSprite.alpha = 1 - t;
                        _this.newSprite.alpha = t;
                    }), S.wait(transition.postTime)).generator,
                    endState: function () { return (_this.done = true); },
                });
            }
            return _this;
        }
        Obj.prototype.update = function () {
            _super.prototype.update.call(this);
        };
        Obj.prototype.render = function () {
            _super.prototype.render.call(this);
            this.newSprite.render();
            this.oldSprite.render();
        };
        return Obj;
    }(WorldObject));
    Transition.Obj = Obj;
})(Transition || (Transition = {}));
var Tilemap = /** @class */ (function (_super) {
    __extends(Tilemap, _super);
    function Tilemap(config) {
        var _this = _super.call(this, config) || this;
        _this.tilemap = Tilemap.cloneTilemap(AssetCache.getTilemap(config.tilemap));
        _this.tilemapLayer = O.getOrDefault(config.tilemapLayer, 0);
        _this.collisionPhysicsGroup = config.collisionPhysicsGroup;
        var tilemapDimens = A.get2DArrayDimensions(_this.currentTilemapLayer);
        _this.numTilesX = tilemapDimens.width;
        _this.numTilesY = tilemapDimens.height;
        _this.renderTexture = new PIXIRenderTextureSprite(_this.numTilesX * _this.tilemap.tileset.tileWidth, _this.numTilesY * _this.tilemap.tileset.tileHeight);
        _this.createCollisionBoxes(O.getOrDefault(config.collisionDebugBounds, false));
        _this.tileSprite = new PIXI.Sprite();
        _this.dirty = true;
        return _this;
    }
    Object.defineProperty(Tilemap.prototype, "currentTilemapLayer", {
        get: function () { return this.tilemap.layers[this.tilemapLayer]; },
        enumerable: true,
        configurable: true
    });
    Tilemap.prototype.onAdd = function () {
        var e_16, _a;
        try {
            for (var _b = __values(this.collisionBoxes), _c = _b.next(); !_c.done; _c = _b.next()) {
                var box = _c.value;
                global.world.addWorldObject(box, {
                    physicsGroup: this.collisionPhysicsGroup
                });
            }
        }
        catch (e_16_1) { e_16 = { error: e_16_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_16) throw e_16.error; }
        }
    };
    Tilemap.prototype.postUpdate = function () {
        var e_17, _a;
        _super.prototype.postUpdate.call(this);
        if (!_.isEmpty(this.collisionBoxes) && (this.collisionBoxes[0].x !== this.x || this.collisionBoxes[0].y !== this.y)) {
            try {
                for (var _b = __values(this.collisionBoxes), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var box = _c.value;
                    box.x = this.x;
                    box.y = this.y;
                }
            }
            catch (e_17_1) { e_17 = { error: e_17_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_17) throw e_17.error; }
            }
        }
    };
    Tilemap.prototype.render = function () {
        if (this.dirty) {
            this.drawRenderTexture();
            this.dirty = false;
        }
        this.renderTexture.x = this.x;
        this.renderTexture.y = this.y;
        global.renderer.render(this.renderTexture, global.renderTexture, false);
        _super.prototype.render.call(this);
    };
    Tilemap.prototype.createCollisionBoxes = function (debugBounds) {
        if (debugBounds === void 0) { debugBounds = false; }
        var e_18, _a;
        this.collisionBoxes = [];
        var collisionRects = Tilemap.getCollisionRects(this.currentTilemapLayer, this.tilemap.tileset);
        Tilemap.optimizeCollisionRects(collisionRects); // Not optimizing entire array first to save some cycles.
        Tilemap.optimizeCollisionRects(collisionRects, Tilemap.OPTIMIZE_ALL);
        try {
            for (var collisionRects_1 = __values(collisionRects), collisionRects_1_1 = collisionRects_1.next(); !collisionRects_1_1.done; collisionRects_1_1 = collisionRects_1.next()) {
                var rect = collisionRects_1_1.value;
                var box = new PhysicsWorldObject({ x: this.x, y: this.y, bounds: rect });
                box.debugBounds = debugBounds;
                this.collisionBoxes.push(box);
            }
        }
        catch (e_18_1) { e_18 = { error: e_18_1 }; }
        finally {
            try {
                if (collisionRects_1_1 && !collisionRects_1_1.done && (_a = collisionRects_1.return)) _a.call(collisionRects_1);
            }
            finally { if (e_18) throw e_18.error; }
        }
    };
    Tilemap.prototype.drawRenderTexture = function () {
        this.renderTexture.clear();
        for (var y = 0; y < this.currentTilemapLayer.length; y++) {
            for (var x = 0; x < this.currentTilemapLayer[y].length; x++) {
                if (!this.currentTilemapLayer[y][x] || this.currentTilemapLayer[y][x].index < 0)
                    continue;
                var tile = this.currentTilemapLayer[y][x];
                var textureKey = this.tilemap.tileset.tiles[tile.index];
                this.tileSprite.texture = AssetCache.getTexture(textureKey);
                this.tileSprite.x = x * this.tilemap.tileset.tileWidth;
                this.tileSprite.y = y * this.tilemap.tileset.tileHeight;
                global.renderer.render(this.tileSprite, this.renderTexture.renderTexture, false);
            }
        }
    };
    Tilemap.prototype.onRemove = function () {
        var e_19, _a;
        try {
            for (var _b = __values(this.collisionBoxes), _c = _b.next(); !_c.done; _c = _b.next()) {
                var box = _c.value;
                global.world.removeWorldObject(box);
            }
        }
        catch (e_19_1) { e_19 = { error: e_19_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_19) throw e_19.error; }
        }
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
        if (G.rectContains(into, rect))
            return true;
        if (G.rectContains(rect, into)) {
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
var Warp = /** @class */ (function (_super) {
    __extends(Warp, _super);
    function Warp(config) {
        var _this = _super.call(this, config) || this;
        _this.stage = config.data.stage;
        _this.entryPoint = config.data.entryPoint;
        _this.transition = O.getOrDefault(config.data.transition, Transition.INSTANT);
        return _this;
    }
    Warp.prototype.warp = function () {
        global.theater.loadStage(this.stage, this.transition, this.entryPoint);
    };
    return Warp;
}(PhysicsWorldObject));
/// <reference path="./backWall.ts" />
/// <reference path="./baseStage.ts" />
/// <reference path="./utils/o_object.ts" />
/// <reference path="./transition.ts" />
/// <reference path="./tilemap.ts" />
/// <reference path="./warp.ts" />
var defaultScreenTransition = Transition.FADE(0.5, 1, 0.5);
var archway = [
    {
        name: 'archway',
        constructor: Sprite,
        texture: 'archway',
        x: 40, y: -119,
        layer: 'main',
        physicsGroup: 'props',
        bounds: { x: -57, y: 64, width: 57, height: 16 },
    },
    {
        name: 'archway_front',
        constructor: Sprite,
        texture: 'archway_front',
        layer: 'main',
        physicsGroup: 'props',
        bounds: { x: -49, y: -7, width: 49, height: 16 },
    },
    {
        name: 'cave_warp',
        constructor: Warp,
        physicsGroup: 'props',
        bounds: { x: -49, y: -55, width: 32, height: 48 },
    },
];
var entrance_frame = [
    {
        name: 'frame',
        constructor: Sprite,
        layer: 'main',
        texture: 'stone_frame',
    },
    {
        name: 'warp',
        constructor: Warp,
        physicsGroup: 'props',
        bounds: { x: 12, y: -20, width: 4, height: 16 },
    },
];
var stages = {
    'main': {
        parent: BASE_STAGE,
        camera: {
            bounds: {
                left: 0,
                top: 0,
                right: 256,
                bottom: 192
            }
        },
        entryPoints: {
            'entrance': { x: 128, y: 96 },
            'exit': { x: -342, y: -416 },
        },
        worldObjects: __spread([
            // ROOM //
            {
                constructor: PhysicsWorldObject,
                bounds: { x: 48, y: -128, width: 16, height: 304 },
                physicsGroup: 'walls',
            },
            {
                constructor: PhysicsWorldObject,
                bounds: { x: 192, y: -128, width: 16, height: 304 },
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
                x: -256, y: -192,
                layer: 'room',
            },
            {
                name: 'backwall',
                constructor: BackWall,
                x: 64, y: 0,
                layer: 'room',
                physicsGroup: 'walls',
            },
            {
                name: 'bed',
                constructor: Sprite,
                texture: 'bed',
                x: 84, y: 158,
                layer: 'main',
                physicsGroup: 'props',
                bounds: { x: -18, y: -20, width: 36, height: 20 },
            },
            {
                name: 'chair',
                constructor: Sprite,
                texture: 'chair',
                x: 172, y: 134,
                layer: 'main',
            },
            {
                name: 'desk',
                constructor: Sprite,
                texture: 'desk',
                x: 172, y: 158,
                layer: 'main',
                physicsGroup: 'props',
                bounds: { x: -18, y: -23, width: 36, height: 23 },
            },
            {
                name: 'door',
                constructor: Sprite,
                texture: 'door_closed',
                x: 84, y: 80,
                layer: 'main',
                offset: { x: 0, y: -36 },
                animations: [
                    { name: 'open', frames: [{ texture: 'door_open' }] },
                    { name: 'closed', frames: [{ texture: 'door_closed' }] },
                ],
                defaultAnimation: 'closed',
            },
            {
                name: 'window',
                constructor: Sprite,
                texture: 'window',
                x: 156, y: 80,
                layer: 'main',
                offset: { x: 0, y: -7 },
                physicsGroup: 'props',
                bounds: { x: -22, y: -3, width: 43, height: 3 },
            },
            // WORLD //
            {
                name: 'tilemap',
                constructor: Tilemap,
                x: -720, y: -768,
                layer: 'bg',
                tilemap: 'mainworld',
                collisionPhysicsGroup: 'walls',
            }
        ], group({
            worldObjects: archway,
            x: -351, y: -393,
            overrides: [
                {
                    name: 'cave_warp',
                    data: {
                        stage: 'connector',
                        entryPoint: 'entrance',
                        transition: defaultScreenTransition,
                    }
                },
            ]
        }))
    },
    'cave': {
        parent: BASE_STAGE,
        entryPoints: {
            'entrance': { x: 656, y: 626 },
            'exit': { x: 656, y: 626 },
        },
        worldObjects: __spread([
            {
                name: 'spotlight',
                constructor: Sprite,
                x: 0, y: 0,
                layer: 'spotlight',
                texture: 'spotlight',
                ignoreCamera: true,
                visible: false,
            },
            {
                name: 'tilemap',
                constructor: Tilemap,
                x: 0, y: 0,
                layer: 'bg',
                tilemap: 'cave',
                tilemapLayer: 1,
                collisionPhysicsGroup: 'walls',
            },
            {
                name: 'tilemap_walls',
                constructor: Tilemap,
                x: 0, y: 0,
                layer: 'fg',
                tilemap: 'cave',
                tilemapLayer: 0,
            }
        ], group({
            prefix: 'entrance_',
            worldObjects: entrance_frame,
            x: 656, y: 636,
            overrides: [
                {
                    name: 'warp',
                    data: {
                        stage: 'main',
                        entryPoint: 'exit',
                        transition: defaultScreenTransition,
                    },
                }
            ]
        }), group({
            prefix: 'exit_',
            worldObjects: entrance_frame,
            x: 656, y: 416,
            overrides: [
                {
                    name: 'warp',
                    data: {
                        stage: 'connector',
                        entryPoint: 'entrance',
                        transition: defaultScreenTransition,
                    }
                },
            ]
        }))
    },
    'connector': {
        parent: BASE_STAGE,
        backgroundColor: 0x000000,
        layers: [
            {
                name: 'bg',
                effects: Effects.partial({
                    silhouette: {
                        color: 0x000000,
                        enabled: true
                    },
                    outline: {
                        color: 0xFFFFFF,
                        enabled: true
                    },
                })
            },
            {
                name: 'main',
                effects: Effects.partial({
                    silhouette: {
                        color: 0x000000,
                        enabled: true
                    },
                    outline: {
                        color: 0xFFFFFF,
                        enabled: true
                    },
                })
            }
        ],
        entryPoints: {
            'entrance': { x: 372, y: 256 },
            'exit': { x: 976, y: 32 },
        },
        camera: {
            bounds: { top: 0 }
        },
        worldObjects: __spread([
            {
                name: 'tilemap',
                constructor: Tilemap,
                x: 0, y: 0,
                layer: 'bg',
                tilemap: 'connector',
                collisionPhysicsGroup: 'walls',
            }
        ], group({
            worldObjects: archway,
            x: 369, y: 280,
            overrides: [
                {
                    name: 'cave_warp',
                    data: {
                        stage: 'cave',
                        entryPoint: 'exit',
                        transition: defaultScreenTransition,
                    }
                },
            ]
        }), [
            {
                constructor: Warp,
                physicsGroup: 'props',
                bounds: { x: 944, y: -16, width: 64, height: 16 },
                data: {
                    stage: 'upper',
                    entryPoint: 'entrance',
                    transition: defaultScreenTransition,
                }
            },
        ])
    },
    'upper': {
        parent: BASE_STAGE,
        entryPoints: {
            'entrance': { x: 224, y: 680 },
        },
        camera: {
            bounds: { bottom: 688 }
        },
        worldObjects: [
            {
                name: 'tilemap',
                constructor: Tilemap,
                x: 0, y: 0,
                layer: 'bg',
                tilemap: 'upper',
                collisionPhysicsGroup: 'walls',
            },
            {
                constructor: Warp,
                physicsGroup: 'props',
                bounds: { x: 192, y: 704, width: 64, height: 16 },
                data: {
                    stage: 'connector',
                    entryPoint: 'exit',
                    transition: defaultScreenTransition,
                }
            },
        ]
    },
};
var S;
(function (S) {
    S.storyboard = {
        'room_intro': {
            type: 'cutscene',
            script: function () {
                var angie;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            DEBUG_SKIP_ALL_CUTSCENE_SCRIPTS = true;
                            S.finishImmediately(S.fadeOut(1));
                            angie = global.getSprite('angie');
                            angie.x = 98;
                            angie.y = 160;
                            angie.offset.y = -19;
                            angie.flipX = true;
                            angie.angle = -90;
                            return [4 /*yield*/, S.fadeSlides(2)];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, S.wait(3)];
                        case 2:
                            _a.sent();
                            return [4 /*yield*/, S.shake(1, 2)];
                        case 3:
                            _a.sent();
                            return [4 /*yield*/, S.wait(3)];
                        case 4:
                            _a.sent();
                            return [4 /*yield*/, S.dialog('angie/happy', "I felt that one.")];
                        case 5:
                            _a.sent();
                            return [4 /*yield*/, S.wait(1)];
                        case 6:
                            _a.sent();
                            return [4 /*yield*/, S.shake(1, 2)];
                        case 7:
                            _a.sent();
                            return [4 /*yield*/, S.wait(2)];
                        case 8:
                            _a.sent();
                            return [4 /*yield*/, S.dialog('angie/happy', "What's that boy up to?")];
                        case 9:
                            _a.sent();
                            return [4 /*yield*/, S.dialog('angie/happy', "I'd better check outside.")];
                        case 10:
                            _a.sent();
                            return [4 /*yield*/, S.wait(0.2)];
                        case 11:
                            _a.sent();
                            angie.angle = 0;
                            angie.x -= 12;
                            return [4 /*yield*/, S.jump(angie, 8, 0.5, true)];
                        case 12:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            },
            after: 'angie_start_gameplay'
        },
        'angie_start_gameplay': {
            type: 'gameplay',
            start: function () { }
        },
        'interact_window': {
            type: 'cutscene',
            playOnlyOnce: true,
            playOnInteractWith: ['window'],
            script: function () {
                var angie, door, milo;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            angie = global.getSprite('angie');
                            door = global.getSprite('door');
                            return [4 /*yield*/, S.dialog('angie/happy', "...")];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, S.dialog('angie/happy', "Oh no...")];
                        case 2:
                            _a.sent();
                            return [4 /*yield*/, [
                                    function () {
                                        return __generator(this, function (_a) {
                                            switch (_a.label) {
                                                case 0:
                                                    door.playAnimation('open');
                                                    return [4 /*yield*/, S.shake(1, 0.1)];
                                                case 1:
                                                    _a.sent();
                                                    return [2 /*return*/];
                                            }
                                        });
                                    },
                                    function () {
                                        return __generator(this, function (_a) {
                                            switch (_a.label) {
                                                case 0:
                                                    global.theater.party.addMemberToWorld('milo', global.world);
                                                    global.theater.party.setMemberActive('milo');
                                                    milo = global.getSprite('milo');
                                                    milo.colliding = false;
                                                    global.world.setLayer(milo, 'room');
                                                    milo.x = 98;
                                                    milo.y = 80;
                                                    milo.playAnimation('flop_lay');
                                                    return [4 /*yield*/, S.tween(milo, 'y', milo.y, milo.y + 52, 0.2, Tween.Easing.InvSquare)];
                                                case 1:
                                                    _a.sent();
                                                    return [2 /*return*/];
                                            }
                                        });
                                    },
                                    function () {
                                        return __generator(this, function (_a) {
                                            switch (_a.label) {
                                                case 0:
                                                    angie.setDirection(Direction2D.DOWN);
                                                    angie.flipX = false;
                                                    return [4 /*yield*/, S.jump(angie, 16, 0.2, true)];
                                                case 1:
                                                    _a.sent();
                                                    return [2 /*return*/];
                                            }
                                        });
                                    }
                                ]];
                        case 3:
                            _a.sent();
                            DEBUG_SKIP_ALL_CUTSCENE_SCRIPTS = false;
                            return [4 /*yield*/, S.dialog('angie/happy', "Milo?")];
                        case 4:
                            _a.sent();
                            return [4 /*yield*/, S.moveTo(angie, 110, 116)];
                        case 5:
                            _a.sent();
                            angie.setDirection(Direction2D.LEFT);
                            return [4 /*yield*/, S.dialog('angie/happy', "Hey, Milo! Come on, get up!")];
                        case 6:
                            _a.sent();
                            return [4 /*yield*/, S.shake(1, 1)];
                        case 7:
                            _a.sent();
                            return [4 /*yield*/, S.dialog('angie/happy', "Shoot!")];
                        case 8:
                            _a.sent();
                            return [4 /*yield*/, S.moveTo(angie, 98, 91)];
                        case 9:
                            _a.sent();
                            door.playAnimation('closed');
                            return [4 /*yield*/, S.moveTo(angie, 129, 143)];
                        case 10:
                            _a.sent();
                            angie.setDirection(Direction2D.UP);
                            return [2 /*return*/];
                    }
                });
            },
            after: 'angie_start_gameplay'
        }
    };
})(S || (S = {}));
var storyboard = S.storyboard;
/// <reference path="./worldObject.ts" />
var World = /** @class */ (function (_super) {
    __extends(World, _super);
    function World(config, defaults) {
        if (defaults === void 0) { defaults = {}; }
        var _this = this;
        config = O.withDefaults(config, defaults);
        _this = _super.call(this, config) || this;
        _this.width = O.getOrDefault(config.width, Main.width);
        _this.height = O.getOrDefault(config.width, Main.height);
        _this.worldObjects = [];
        _this.physicsGroups = _this.createPhysicsGroups(config.physicsGroups);
        _this.collisionOrder = O.getOrDefault(config.collisionOrder, []);
        _this.worldObjectsByName = {};
        _this.layers = _this.createLayers(config.layers);
        _this.backgroundColor = O.getOrDefault(config.backgroundColor, Main.backgroundColor);
        _this.backgroundAlpha = O.getOrDefault(config.backgroundAlpha, 1);
        var cameraConfig = O.getOrDefault(config.camera, {});
        _.defaults(cameraConfig, {
            width: _this.width,
            height: _this.height,
        });
        _this.camera = new Camera(cameraConfig);
        _this.scriptManager = new ScriptManager();
        if (!config.renderDirectly) {
            _this.renderTexture = new PIXIRenderTextureSprite(_this.width, _this.height);
        }
        _this.debugMoveCameraWithArrows = false;
        _this.debugCameraX = 0;
        _this.debugCameraY = 0;
        return _this;
    }
    Object.defineProperty(World.prototype, "renderingDirectly", {
        get: function () { return !this.renderTexture; },
        enumerable: true,
        configurable: true
    });
    World.prototype.update = function () {
        var e_20, _a, e_21, _b, e_22, _c, e_23, _d;
        _super.prototype.update.call(this);
        global.pushWorld(this);
        try {
            for (var _e = __values(this.worldObjects), _f = _e.next(); !_f.done; _f = _e.next()) {
                var worldObject = _f.value;
                worldObject.resetController();
            }
        }
        catch (e_20_1) { e_20 = { error: e_20_1 }; }
        finally {
            try {
                if (_f && !_f.done && (_a = _e.return)) _a.call(_e);
            }
            finally { if (e_20) throw e_20.error; }
        }
        this.scriptManager.update();
        try {
            for (var _g = __values(this.worldObjects), _h = _g.next(); !_h.done; _h = _g.next()) {
                var worldObject = _h.value;
                if (worldObject.active)
                    worldObject.preUpdate();
            }
        }
        catch (e_21_1) { e_21 = { error: e_21_1 }; }
        finally {
            try {
                if (_h && !_h.done && (_b = _g.return)) _b.call(_g);
            }
            finally { if (e_21) throw e_21.error; }
        }
        try {
            for (var _j = __values(this.worldObjects), _k = _j.next(); !_k.done; _k = _j.next()) {
                var worldObject = _k.value;
                if (worldObject.active)
                    worldObject.update();
            }
        }
        catch (e_22_1) { e_22 = { error: e_22_1 }; }
        finally {
            try {
                if (_k && !_k.done && (_c = _j.return)) _c.call(_j);
            }
            finally { if (e_22) throw e_22.error; }
        }
        this.handleCollisions();
        try {
            for (var _l = __values(this.worldObjects), _m = _l.next(); !_m.done; _m = _l.next()) {
                var worldObject = _m.value;
                if (worldObject.active)
                    worldObject.postUpdate();
            }
        }
        catch (e_23_1) { e_23 = { error: e_23_1 }; }
        finally {
            try {
                if (_m && !_m.done && (_d = _l.return)) _d.call(_l);
            }
            finally { if (e_23) throw e_23.error; }
        }
        if (DEBUG_MOVE_CAMERA_WITH_ARROWS && this.debugMoveCameraWithArrows) {
            if (Input.isDown('debugMoveCameraLeft'))
                this.debugCameraX -= 1;
            if (Input.isDown('debugMoveCameraRight'))
                this.debugCameraX += 1;
            if (Input.isDown('debugMoveCameraUp'))
                this.debugCameraY -= 1;
            if (Input.isDown('debugMoveCameraDown'))
                this.debugCameraY += 1;
        }
        this.camera.update();
        global.popWorld();
    };
    World.prototype.render = function () {
        if (this.renderingDirectly) {
            this.renderWorld();
        }
        else {
            this.renderTexture.clear();
            global.pushRenderTexture(this.renderTexture.renderTexture);
            this.renderWorld();
            global.popRenderTexture();
            global.renderer.render(this.renderTexture, global.renderTexture, false);
        }
        _super.prototype.render.call(this);
    };
    World.prototype.renderWorld = function () {
        var e_24, _a;
        var oldCameraX = this.camera.x;
        var oldCameraY = this.camera.y;
        if (DEBUG_MOVE_CAMERA_WITH_ARROWS && this.debugMoveCameraWithArrows) {
            this.camera.x += this.debugCameraX;
            this.camera.y += this.debugCameraY;
        }
        // Render background color.
        Draw.noStroke().fillColor(this.backgroundColor, this.backgroundAlpha)
            .drawRectangle(0, 0, this.width, this.height);
        global.pushWorld(this);
        try {
            for (var _b = __values(this.layers), _c = _b.next(); !_c.done; _c = _b.next()) {
                var layer = _c.value;
                if (layer.renderTexture) {
                    layer.renderTexture.clear();
                    global.pushRenderTexture(layer.renderTexture.renderTexture);
                    this.renderLayer(layer);
                    global.popRenderTexture();
                    layer.renderTextureSprite.render();
                }
                else {
                    this.renderLayer(layer);
                }
            }
        }
        catch (e_24_1) { e_24 = { error: e_24_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_24) throw e_24.error; }
        }
        global.popWorld();
        this.camera.x = oldCameraX;
        this.camera.y = oldCameraY;
    };
    World.prototype.renderLayer = function (layer) {
        var e_25, _a;
        layer.sort();
        try {
            for (var _b = __values(layer.worldObjects), _c = _b.next(); !_c.done; _c = _b.next()) {
                var worldObject = _c.value;
                if (worldObject.visible) {
                    worldObject.fullRender();
                }
            }
        }
        catch (e_25_1) { e_25 = { error: e_25_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_25) throw e_25.error; }
        }
    };
    World.prototype.addWorldObject = function (obj, options) {
        if (!obj)
            return obj;
        this.worldObjects.push(obj);
        if (!options)
            options = {};
        if (options.name) {
            this.setName(obj, options.name);
        }
        if (options.layer) {
            this.setLayer(obj, options.layer);
        }
        else {
            this.setLayer(obj, World.DEFAULT_LAYER);
        }
        if (options.physicsGroup && obj instanceof PhysicsWorldObject) {
            this.setPhysicsGroup(obj, options.physicsGroup);
        }
        global.pushWorld(this);
        obj.onAdd();
        global.popWorld();
        return obj;
    };
    World.prototype.getLayer = function (obj) {
        var e_26, _a;
        if (_.isString(obj))
            obj = this.getWorldObjectByName(obj);
        try {
            for (var _b = __values(this.layers), _c = _b.next(); !_c.done; _c = _b.next()) {
                var layer = _c.value;
                if (_.contains(layer.worldObjects, obj))
                    return layer.name;
            }
        }
        catch (e_26_1) { e_26 = { error: e_26_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_26) throw e_26.error; }
        }
        return undefined;
    };
    World.prototype.getName = function (obj) {
        if (_.isString(obj))
            return obj;
        for (var name_3 in this.worldObjectsByName) {
            if (this.worldObjectsByName[name_3] === obj)
                return name_3;
        }
        return undefined;
    };
    World.prototype.getPhysicsGroup = function (obj) {
        if (_.isString(obj))
            obj = this.getWorldObjectByName(obj);
        for (var name_4 in this.physicsGroups) {
            if (_.contains(this.physicsGroups[name_4].worldObjects, obj))
                return name_4;
        }
        return undefined;
    };
    World.prototype.getWorldMouseX = function () {
        return Input.mouseX + Math.floor(this.camera.x - this.camera.width / 2);
    };
    World.prototype.getWorldMouseY = function () {
        return Input.mouseY + Math.floor(this.camera.y - this.camera.height / 2);
    };
    World.prototype.getWorldObjectByName = function (name) {
        if (!this.worldObjectsByName[name]) {
            debug("No object with name '" + name + "' exists in world", this);
        }
        return this.worldObjectsByName[name];
    };
    World.prototype.handleCollisions = function () {
        var _this = this;
        var e_27, _a, e_28, _b, e_29, _c;
        try {
            for (var _d = __values(this.collisionOrder), _e = _d.next(); !_e.done; _e = _d.next()) {
                var collision = _e.value;
                var move = _.isArray(collision.move) ? collision.move : [collision.move];
                var from = _.isArray(collision.from) ? collision.from : [collision.from];
                var fromObjects = _.flatten(from.map(function (name) { return _this.physicsGroups[name].worldObjects; }));
                try {
                    for (var move_1 = __values(move), move_1_1 = move_1.next(); !move_1_1.done; move_1_1 = move_1.next()) {
                        var moveGroup = move_1_1.value;
                        var group_2 = this.physicsGroups[moveGroup].worldObjects;
                        try {
                            for (var group_1 = __values(group_2), group_1_1 = group_1.next(); !group_1_1.done; group_1_1 = group_1.next()) {
                                var obj = group_1_1.value;
                                Physics.collide(obj, fromObjects, {
                                    callback: collision.callback,
                                    transferMomentum: collision.transferMomentum,
                                });
                            }
                        }
                        catch (e_29_1) { e_29 = { error: e_29_1 }; }
                        finally {
                            try {
                                if (group_1_1 && !group_1_1.done && (_c = group_1.return)) _c.call(group_1);
                            }
                            finally { if (e_29) throw e_29.error; }
                        }
                    }
                }
                catch (e_28_1) { e_28 = { error: e_28_1 }; }
                finally {
                    try {
                        if (move_1_1 && !move_1_1.done && (_b = move_1.return)) _b.call(move_1);
                    }
                    finally { if (e_28) throw e_28.error; }
                }
            }
        }
        catch (e_27_1) { e_27 = { error: e_27_1 }; }
        finally {
            try {
                if (_e && !_e.done && (_a = _d.return)) _a.call(_d);
            }
            finally { if (e_27) throw e_27.error; }
        }
    };
    World.prototype.removeName = function (obj) {
        for (var name_5 in this.worldObjectsByName) {
            if (this.worldObjectsByName[name_5] === obj) {
                delete this.worldObjectsByName[name_5];
            }
        }
    };
    World.prototype.removeFromAllLayers = function (obj) {
        var e_30, _a;
        try {
            for (var _b = __values(this.layers), _c = _b.next(); !_c.done; _c = _b.next()) {
                var layer = _c.value;
                A.removeAll(layer.worldObjects, obj);
            }
        }
        catch (e_30_1) { e_30 = { error: e_30_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_30) throw e_30.error; }
        }
    };
    World.prototype.removeFromAllPhysicsGroups = function (obj) {
        for (var name_6 in this.physicsGroups) {
            A.removeAll(this.physicsGroups[name_6].worldObjects, obj);
        }
    };
    World.prototype.removeWorldObject = function (obj) {
        this.removeFromAllLayers(obj);
        this.removeFromAllPhysicsGroups(obj);
        A.removeAll(this.worldObjects, obj);
        global.pushWorld(this);
        obj.onRemove();
        global.popWorld();
    };
    World.prototype.runScript = function (script) {
        return this.scriptManager.runScript(script);
    };
    World.prototype.setName = function (obj, name) {
        if (this.worldObjectsByName[name] && this.worldObjectsByName[name] !== obj) {
            debug("Cannot name object '" + name + "' as that name aleady exists in world", this);
            return;
        }
        this.removeName(obj);
        this.worldObjectsByName[name] = obj;
    };
    World.prototype.setLayer = function (obj, name) {
        if (name === void 0) { name = World.DEFAULT_LAYER; }
        var e_31, _a;
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
        catch (e_31_1) { e_31 = { error: e_31_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_31) throw e_31.error; }
        }
        debug("Layer '" + name + "' does not exist in world", this);
    };
    World.prototype.setPhysicsGroup = function (obj, name) {
        this.removeFromAllPhysicsGroups(obj);
        var physicsGroup = this.physicsGroups[name];
        if (!physicsGroup) {
            debug("PhysicsGroup '" + name + "' does not exist in world", this);
            return;
        }
        physicsGroup.worldObjects.push(obj);
    };
    World.prototype.takeSnapshot = function () {
        var renderTextureSprite = new PIXIRenderTextureSprite(this.camera.width, this.camera.height);
        global.pushRenderTexture(renderTextureSprite.renderTexture);
        var lastx = this.x;
        var lasty = this.y;
        this.x = 0;
        this.y = 0;
        this.render();
        this.x = lastx;
        this.y = lasty;
        global.popRenderTexture();
        return renderTextureSprite;
    };
    World.prototype.createLayers = function (layers) {
        var e_32, _a;
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
        catch (e_32_1) { e_32 = { error: e_32_1 }; }
        finally {
            try {
                if (layers_1_1 && !layers_1_1.done && (_a = layers_1.return)) _a.call(layers_1);
            }
            finally { if (e_32) throw e_32.error; }
        }
        return result;
    };
    World.prototype.createPhysicsGroups = function (physicsGroups) {
        if (_.isEmpty(physicsGroups))
            return {};
        var result = {};
        for (var name_7 in physicsGroups) {
            _.defaults(physicsGroups[name_7], {
                collidesWith: [],
            });
            result[name_7] = new World.PhysicsGroup(name_7, physicsGroups[name_7]);
        }
        return result;
    };
    World.DEFAULT_LAYER = 'default';
    return World;
}(WorldObject));
(function (World) {
    var Layer = /** @class */ (function () {
        function Layer(name, config, width, height) {
            this.name = name;
            this.worldObjects = [];
            this.sortKey = config.sortKey;
            this.reverseSort = config.reverseSort;
            this.renderTexture = new PIXIRenderTextureSprite(width, height);
            this.renderTextureSprite = new Sprite({ x: 0, y: 0, renderTexture: this.renderTexture, effects: config.effects });
        }
        Object.defineProperty(Layer.prototype, "effects", {
            get: function () { return this.renderTextureSprite.effects; },
            enumerable: true,
            configurable: true
        });
        ;
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
        _this.debugMousePosition = new SpriteText({ font: Assets.fonts.DELUXE16, x: 0, y: 0 });
        _this.stages = config.stages;
        _this.storyboard = config.storyboard;
        _this.party = config.party;
        _this.party.load();
        _this.cutsceneManager = new CutsceneManager();
        _this.skipCutsceneScriptKey = config.skipCutsceneScriptKey;
        _this.stageLoadQueue = null;
        _this.loadDialogBox(config.dialogBox);
        _this.slides = [];
        _this.interactionManager = new InteractionManager(config.interactionManager);
        _this.loadStage(config.stageToLoad, undefined, config.stageEntryPoint, true);
        // Start storyboard entry point
        _this.startStoryboardComponentByName(config.storyboardEntry);
        if (DEBUG_SHOW_MOUSE_POSITION) {
            _this.debugMousePosition = _this.addWorldObject(new SpriteText({ x: 0, y: 0, font: Assets.fonts.DELUXE16 }));
        }
        return _this;
    }
    Object.defineProperty(Theater.prototype, "currentStage", {
        get: function () { return this.stages[this.currentStageName]; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Theater.prototype, "isCutscenePlaying", {
        get: function () { return this.cutsceneManager.isCutscenePlaying; },
        enumerable: true,
        configurable: true
    });
    Theater.prototype.update = function () {
        this.cutsceneManager.update();
        _super.prototype.update.call(this);
        global.pushWorld(this.currentWorld);
        this.interactionManager.update();
        global.popWorld();
        if (this.stageLoadQueue) {
            this.loadStage(this.stageLoadQueue.stage, this.stageLoadQueue.transition, this.stageLoadQueue.entryPoint, true);
            this.stageLoadQueue = null;
        }
        if (DEBUG_SHOW_MOUSE_POSITION) {
            this.debugMousePosition.setText(S.padLeft(this.currentWorld.getWorldMouseX().toString(), 3) + " " + S.padLeft(this.currentWorld.getWorldMouseY().toString(), 3));
        }
    };
    Theater.prototype.addSlideByConfig = function (config) {
        var slide = new Slide(config);
        this.addWorldObject(slide);
        this.setLayer(slide, Theater.LAYER_SLIDES);
        this.slides.push(slide);
        return slide;
    };
    Theater.prototype.clearSlides = function (exceptLast) {
        if (exceptLast === void 0) { exceptLast = 0; }
        var deleteCount = this.slides.length - exceptLast;
        for (var i = 0; i < deleteCount; i++) {
            this.removeWorldObject(this.slides[i]);
        }
        this.slides.splice(0, deleteCount);
    };
    Theater.prototype.getStoryboardComponentByName = function (name) {
        var component = this.storyboard[name];
        if (!component) {
            debug("Component '" + name + "' does not exist in storyboard:", this.storyboard);
        }
        return component;
    };
    Theater.prototype.loadStage = function (name, transition, entryPoint, immediate) {
        if (immediate === void 0) { immediate = false; }
        if (!immediate) {
            this.stageLoadQueue = { stage: name, entryPoint: entryPoint, transition: transition };
            return;
        }
        if (transition) {
            this.loadStageWithTransition(name, transition, entryPoint);
            return;
        }
        if (!this.stages[name]) {
            debug("Stage '" + name + "' does not exist in world.");
            return;
        }
        var stage = Stage.resolveStageConfig(this.stages[name]);
        // Remove old stuff
        if (this.currentWorld) {
            this.removeWorldObject(this.currentWorld);
        }
        this.cutsceneManager.reset();
        this.interactionManager.reset();
        // Create new stuff
        this.currentStageName = name;
        this.setNewWorldFromStage(stage, entryPoint);
        this.currentWorld.debugMoveCameraWithArrows = DEBUG_MOVE_CAMERA_WITH_ARROWS;
        this.addWorldObject(this.currentWorld);
        this.setLayer(this.currentWorld, Theater.LAYER_WORLD);
        if (this.currentStoryboardComponentName) {
            this.startStoryboardComponentByName(this.currentStoryboardComponentName);
        }
    };
    Theater.prototype.loadStageWithTransition = function (name, transition, entryPoint) {
        var _this = this;
        if (!this.currentWorld) {
            this.loadStage(name, undefined, entryPoint, true);
            return;
        }
        var oldSnapshot = this.currentWorld.takeSnapshot();
        this.loadStage(name, undefined, entryPoint, true);
        this.currentWorld.update();
        var newSnapshot = this.currentWorld.takeSnapshot();
        this.currentWorld.active = false;
        this.currentWorld.visible = false;
        var transitionObj = new Transition.Obj(oldSnapshot, newSnapshot, transition);
        this.addWorldObject(transitionObj, { layer: Theater.LAYER_TRANSITION });
        this.runScript({
            generator: function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!!transitionObj.done) return [3 /*break*/, 2];
                            return [4 /*yield*/];
                        case 1:
                            _a.sent();
                            return [3 /*break*/, 0];
                        case 2: return [2 /*return*/];
                    }
                });
            },
            endState: function () {
                _this.removeWorldObject(transitionObj);
                _this.currentWorld.active = true;
                _this.currentWorld.visible = true;
            }
        });
    };
    Theater.prototype.startStoryboardComponentByName = function (name) {
        var component = this.getStoryboardComponentByName(name);
        if (!component)
            return;
        if (component.type === 'cutscene') {
            this.cutsceneManager.playCutscene(name, component, this.currentWorld, this.skipCutsceneScriptKey);
        }
        else if (component.type === 'gameplay') {
            global.pushWorld(this.currentWorld);
            component.start();
            global.popWorld();
        }
        else if (component.type === 'code') {
            global.pushWorld(this.currentWorld);
            component.func();
            global.popWorld();
            if (component.after) {
                return this.startStoryboardComponentByName(component.after);
            }
        }
        this.currentStoryboardComponentName = name;
    };
    Theater.prototype.setNewWorldFromStage = function (stage, entryPoint) {
        if (entryPoint === void 0) { entryPoint = Theater.DEFAULT_ENTRY_POINT; }
        var e_33, _a, e_34, _b;
        var world = new World(stage, {
            renderDirectly: true,
        });
        if (stage.worldObjects) {
            try {
                for (var _c = __values(stage.worldObjects), _d = _c.next(); !_d.done; _d = _c.next()) {
                    var worldObject = _d.value;
                    this.addWorldObjectFromStageConfig(world, worldObject);
                }
            }
            catch (e_33_1) { e_33 = { error: e_33_1 }; }
            finally {
                try {
                    if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
                }
                finally { if (e_33) throw e_33.error; }
            }
        }
        // Resolve entry point.
        if (_.isString(entryPoint)) {
            entryPoint = Stage.getEntryPoint(stage, entryPoint);
        }
        try {
            for (var _e = __values(this.party.activeMembers), _f = _e.next(); !_f.done; _f = _e.next()) {
                var member = _f.value;
                var memberObj = this.party.addMemberToWorld(member, world);
                memberObj.x = entryPoint.x;
                memberObj.y = entryPoint.y;
            }
        }
        catch (e_34_1) { e_34 = { error: e_34_1 }; }
        finally {
            try {
                if (_f && !_f.done && (_b = _e.return)) _b.call(_e);
            }
            finally { if (e_34) throw e_34.error; }
        }
        this.currentWorld = world;
    };
    Theater.prototype.loadDialogBox = function (config) {
        this.dialogBox = new DialogBox(config);
        this.dialogBox.visible = false;
        this.addWorldObject(this.dialogBox);
        this.setLayer(this.dialogBox, Theater.LAYER_DIALOG);
    };
    Theater.prototype.addWorldObjectFromStageConfig = function (world, worldObject) {
        worldObject = Stage.resolveWorldObjectConfig(worldObject);
        if (!worldObject.constructor)
            return null;
        var config = worldObject;
        _.defaults(config, {
            layer: World.DEFAULT_LAYER,
        });
        var obj = new config.constructor(config);
        world.addWorldObject(obj, {
            name: config.name,
            layer: config.layer,
            physicsGroup: config.physicsGroup,
        });
        return obj;
    };
    Theater.LAYER_WORLD = 'world';
    Theater.LAYER_TRANSITION = 'transition';
    Theater.LAYER_SLIDES = 'slides';
    Theater.LAYER_DIALOG = 'dialog';
    Theater.DEFAULT_CAMERA_MODE = { type: 'focus', point: { x: Main.width / 2, y: Main.height / 2 } };
    Theater.DEFAULT_ENTRY_POINT = { x: Main.width / 2, y: Main.height / 2 };
    return Theater;
}(World));
var Timer = /** @class */ (function () {
    function Timer(duration, callback, repeat) {
        if (repeat === void 0) { repeat = false; }
        this.duration = duration;
        this.speed = 1;
        this.time = 0;
        this.callback = callback;
        this.repeat = repeat;
    }
    Object.defineProperty(Timer.prototype, "done", {
        get: function () { return !this.repeat && this.progress >= 1; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Timer.prototype, "progress", {
        get: function () {
            return Math.min(this.time / this.duration, 1);
        },
        enumerable: true,
        configurable: true
    });
    Timer.prototype.update = function () {
        if (!this.done) {
            this.time += global.delta;
            if (this.time >= this.duration) {
                if (this.callback)
                    this.callback();
                if (this.repeat) {
                    while (this.time >= this.duration) {
                        this.time -= this.duration;
                    }
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
    Tween.prototype.update = function () {
        this.timer.update();
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
    function expandRectangle(rect, amount) {
        rect.x -= amount;
        rect.y -= amount;
        rect.width += 2 * amount;
        rect.height += 2 * amount;
    }
    G.expandRectangle = expandRectangle;
    function overlapRectangles(rect1, rect2) {
        return rect1.left < rect2.right && rect1.right > rect2.left && rect1.top < rect2.bottom && rect1.bottom > rect2.top;
    }
    G.overlapRectangles = overlapRectangles;
    function rectContains(rect, contains) {
        return rect.x <= contains.x && rect.x + rect.width >= contains.x + contains.width
            && rect.y <= contains.y && rect.y + rect.height >= contains.y + contains.height;
    }
    G.rectContains = rectContains;
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
    function distance(p1, p2) {
        return Math.sqrt(distanceSq(p1, p2));
    }
    M.distance = distance;
    function distanceSq(p1, p2) {
        var dx = p2.x - p1.x;
        var dy = p2.y - p1.y;
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
var S;
(function (S) {
    function padLeft(text, minLength, padString) {
        if (padString === void 0) { padString = ' '; }
        while (text.length < minLength) {
            text = padString + text;
        }
        return text;
    }
    S.padLeft = padLeft;
    function padRight(text, minLength, padString) {
        if (padString === void 0) { padString = ' '; }
        while (text.length < minLength) {
            text = text + padString;
        }
        return text;
    }
    S.padRight = padRight;
    function replaceAll(str, replace, wiith) {
        if (!str)
            return "";
        return str.split(replace).join(wiith);
    }
    S.replaceAll = replaceAll;
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
