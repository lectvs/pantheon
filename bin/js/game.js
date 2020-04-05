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
//var DEBUG: boolean = true;
var DEBUG_ALL_PHYSICS_BOUNDS = false;
var DEBUG_MOVE_CAMERA_WITH_ARROWS = true;
var DEBUG_SHOW_MOUSE_POSITION = true;
var DEBUG_SKIP_RATE = 1;
var DEBUG_PROGRAMMATIC_INPUT = false;
var DEBUG_AUTOPLAY = true;
var DEBUG_SKIP_MAIN_MENU = true;
var debug = console.info;
// function debug(message?: any, ...optionalParams: any[]) {
//     if (DEBUG) {
//         console.log(message, ...optionalParams);
//     }
// }
function get(name) {
    /// @ts-ignore
    var worldObject = Main.theater.currentWorld.getWorldObjectByName(name);
    if (worldObject)
        return worldObject;
    return undefined;
}
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
        Main.renderer.render(displayObject, this.renderTextureSprite.renderTexture, false);
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
            Main.renderer.render(Utils.NOOP_DISPLAYOBJECT, this._renderTexture, true);
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
        var e_2, _a;
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
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_2) throw e_2.error; }
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
        'dialogbox': {
            anchor: { x: 0.5, y: 0.5 },
        },
        // Debug
        'debug': {},
        // Character sprites
        'generic_sprites': {
            defaultAnchor: { x: 0.5, y: 1 },
            spritesheet: { frameWidth: 32, frameHeight: 36 },
        },
        'generic_sprites_dark': {
            defaultAnchor: { x: 0.5, y: 1 },
            spritesheet: { frameWidth: 32, frameHeight: 36 },
        },
        // Props
        'props': {
            defaultAnchor: { x: 0.5, y: 1 },
            frames: {
                'door_closed': {
                    rect: { x: 0, y: 0, width: 24, height: 36 },
                    anchor: { x: 0, y: 0 },
                },
                'door_open': {
                    rect: { x: 24, y: 0, width: 4, height: 48 },
                    anchor: { x: 0, y: 0 },
                },
                'keypad': {
                    rect: { x: 28, y: 0, width: 9, height: 12 },
                    anchor: { x: 0, y: 0 },
                },
            }
        },
        // Tilesets
        'outside': {
            url: 'assets/tilemap/outside.png',
            spritesheet: { frameWidth: 12, frameHeight: 12 },
        },
        'inside': {
            url: 'assets/tilemap/inside.png',
            spritesheet: { frameWidth: 12, frameHeight: 12 },
        },
        // Portraits
        'portraits/sai': {
            defaultAnchor: { x: 0.5, y: 0.5 },
            frames: {
                'sai/default': {
                    rect: { x: 0 * 74, y: 0 * 54, width: 74, height: 54 },
                },
            }
        },
        'portraits/dad': {
            defaultAnchor: { x: 0.5, y: 0.5 },
            frames: {
                'dad/default': {
                    rect: { x: 0 * 74, y: 0 * 54, width: 74, height: 54 },
                },
            }
        },
        'portraits/demon': {
            defaultAnchor: { x: 0.5, y: 0.5 },
            frames: {
                'demon/default': {
                    rect: { x: 0 * 74, y: 0 * 54, width: 74, height: 54 },
                },
            }
        },
        'portraits/guard1': {
            defaultAnchor: { x: 0.5, y: 0.5 },
            frames: {
                'guard1/default': {
                    rect: { x: 0 * 74, y: 0 * 54, width: 74, height: 54 },
                },
            }
        },
        'portraits/guard2': {
            defaultAnchor: { x: 0.5, y: 0.5 },
            frames: {
                'guard2/default': {
                    rect: { x: 0 * 74, y: 0 * 54, width: 74, height: 54 },
                },
            }
        },
        // Fonts
        'deluxe16': {},
    };
    Assets.tilesets = {
        'outside': {
            tiles: Preload.allTilesWithPrefix('outside_'),
            tileWidth: 12,
            tileHeight: 12,
            collisionIndices: [7, 8, 9, 10, 11, 12, 13, 14, 15],
        },
        'inside': {
            tiles: Preload.allTilesWithPrefix('inside_'),
            tileWidth: 12,
            tileHeight: 12,
            collisionIndices: [-1, 0],
        },
    };
    Assets.pyxelTilemaps = {
        'outside': {
            url: 'assets/tilemap/outside.json',
            tileset: Assets.tilesets.outside,
        },
        'inside': {
            url: 'assets/tilemap/inside.json',
            tileset: Assets.tilesets.inside,
        },
        'hallway': {
            url: 'assets/tilemap/hallway.json',
            tileset: Assets.tilesets.inside,
        },
        'escaperoom': {
            url: 'assets/tilemap/escaperoom.json',
            tileset: Assets.tilesets.inside,
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
        this._world = null;
        this.internalSetNameWorldObject(config.name);
        this.internalSetLayerWorldObject(config.layer);
        this.internalSetPhysicsGroupWorldObject(config.physicsGroup);
        this._children = [];
        this._parent = null;
    }
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
    WorldObject.prototype.preUpdate = function () {
        this.lastx = this.x;
        this.lasty = this.y;
        if (this.isControlled) {
            this.updateControllerFromSchema();
        }
    };
    WorldObject.prototype.update = function (delta) {
    };
    WorldObject.prototype.postUpdate = function () {
        this.resetController();
    };
    WorldObject.prototype.fullUpdate = function (delta) {
        this.preUpdate();
        this.update(delta);
        this.postUpdate();
    };
    WorldObject.prototype.preRender = function (world) {
        this.preRenderStoredX = this.x;
        this.preRenderStoredY = this.y;
        if (!this.ignoreCamera) {
            this.x -= world.camera.worldOffsetX;
            this.y -= world.camera.worldOffsetY;
        }
        this.x = Math.round(this.x);
        this.y = Math.round(this.y);
    };
    WorldObject.prototype.render = function (screen) {
    };
    WorldObject.prototype.postRender = function (world) {
        this.x = this.preRenderStoredX;
        this.y = this.preRenderStoredY;
    };
    WorldObject.prototype.fullRender = function (screen, world) {
        this.preRender(world);
        this.render(screen);
        this.postRender(world);
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
    WorldObject.prototype.onAdd = function (world) {
    };
    WorldObject.prototype.onRemove = function (world) {
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
    WorldObject.prototype.internalAddChildToParentWorldObject = function (child) {
        this._children.push(child);
        child._parent = this;
    };
    WorldObject.prototype.internalRemoveChildFromParentWorldObject = function (child) {
        A.removeAll(this._children, child);
        child._parent = null;
    };
    return WorldObject;
}());
(function (WorldObject) {
    function resolveConfig(config) {
        if (!config.parent)
            return _.clone(config);
        var result = WorldObject.resolveConfig(config.parent);
        for (var key in config) {
            if (key === 'parent')
                continue;
            if (!result[key]) {
                result[key] = config[key];
            }
            else if (key === 'animations') {
                result[key] = A.mergeArray(config[key], result[key], function (e) { return e.name; });
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
    WorldObject.resolveConfig = resolveConfig;
    function fromConfig(config) {
        config = WorldObject.resolveConfig(config);
        if (!config.constructor)
            return null;
        return new config.constructor(config);
    }
    WorldObject.fromConfig = fromConfig;
})(WorldObject || (WorldObject = {}));
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
        if (DEBUG_ALL_PHYSICS_BOUNDS || this.debugBounds) {
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
        var e_3, _a;
        if (defaults === void 0) { defaults = {}; }
        var _this = this;
        config = O.withDefaults(config, defaults);
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
                        duration: 0,
                    });
                    _this.animationManager.addAnimation(animation.name, animation.frames);
                }
            }
            catch (e_3_1) { e_3 = { error: e_3_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_3) throw e_3.error; }
            }
        }
        if (config.defaultAnimation) {
            _this.playAnimation(config.defaultAnimation, 0, true);
        }
        _this.flipX = O.getOrDefault(config.flipX, false);
        _this.flipY = O.getOrDefault(config.flipY, false);
        _this.offset = config.offset || { x: 0, y: 0 };
        _this.angle = O.getOrDefault(config.angle, 0);
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
            scaleX: this.flipX ? -1 : 1,
            scaleY: this.flipY ? -1 : 1,
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
    HumanCharacter.prototype.update = function (delta) {
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
        _super.prototype.update.call(this, delta);
        this.updateInteractions();
        // Handle animation.
        var anim_state = (haxis == 0 && vaxis == 0) ? 'idle' : 'run';
        var anim_dir = this.direction.v == Direction.UP ? 'up' : (this.direction.h == Direction.NONE ? 'down' : 'side');
        this.playAnimation(anim_state + "_" + anim_dir);
    };
    HumanCharacter.prototype.updateInteractions = function () {
        var e_4, _a;
        if (!this.isControlled) {
            return;
        }
        var interactableObjects = global.theater.interactionManager.getInteractableObjects();
        var interactRadius = 2;
        var highlightedObject = null;
        G.expandRectangle(this.bounds, interactRadius);
        try {
            for (var interactableObjects_1 = __values(interactableObjects), interactableObjects_1_1 = interactableObjects_1.next(); !interactableObjects_1_1.done; interactableObjects_1_1 = interactableObjects_1.next()) {
                var obj = interactableObjects_1_1.value;
                if (this.isOverlapping(this.world.getWorldObjectByName(obj))) {
                    highlightedObject = obj;
                }
            }
        }
        catch (e_4_1) { e_4 = { error: e_4_1 }; }
        finally {
            try {
                if (interactableObjects_1_1 && !interactableObjects_1_1.done && (_a = interactableObjects_1.return)) _a.call(interactableObjects_1);
            }
            finally { if (e_4) throw e_4.error; }
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
        if (other instanceof Warp && this.controllable) {
            other.warp();
        }
    };
    HumanCharacter.prototype.setDirection = function (direction) {
        this.direction.h = direction.h;
        this.direction.v = direction.v;
    };
    HumanCharacter.prototype.setSpeed = function (speed) {
        this.speed = speed;
    };
    HumanCharacter.prototype.unfollow = function () {
        this._follow = null;
    };
    HumanCharacter.prototype.updateFollow = function () {
        if (this._follow)
            this._follow.update(this);
    };
    return HumanCharacter;
}(Sprite));
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
/// <reference path="./humanCharacter.ts" />
/// <reference path="./transition.ts" />
var DEFAULT_SCREEN_TRANSITION = Transition.FADE(0.2, 0.5, 0.2);
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
function HUMAN_CHARACTER(texture) {
    return {
        constructor: HumanCharacter,
        layer: 'main',
        physicsGroup: 'player',
        bounds: { x: -5, y: -2, width: 10, height: 2 },
        animations: [
            Animations.fromTextureList({ name: 'idle_side', texturePrefix: texture + '_', textures: [0, 1], frameRate: 1, count: -1 }),
            Animations.fromTextureList({ name: 'idle_down', texturePrefix: texture + '_', textures: [8, 9], frameRate: 1, count: -1 }),
            Animations.fromTextureList({ name: 'idle_up', texturePrefix: texture + '_', textures: [16, 17], frameRate: 1, count: -1 }),
            Animations.fromTextureList({ name: 'run_side', texturePrefix: texture + '_', textures: [2, 3], frameRate: 8, count: -1 }),
            Animations.fromTextureList({ name: 'run_down', texturePrefix: texture + '_', textures: [10, 11], frameRate: 8, count: -1 }),
            Animations.fromTextureList({ name: 'run_up', texturePrefix: texture + '_', textures: [18, 19], frameRate: 8, count: -1 }),
        ],
        defaultAnimation: 'idle_side',
    };
}
function GUARD() {
    return {
        parent: HUMAN_CHARACTER('generic_sprites'),
    };
}
function WORLD_BOUNDS(left, top, right, bottom) {
    var thickness = 12;
    var width = right - left;
    var height = bottom - top;
    return [
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
    ];
}
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
            var e_5, _a, scriptFunctions_1, scriptFunctions_1_1, scriptFunction, e_5_1;
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
                        e_5_1 = _b.sent();
                        e_5 = { error: e_5_1 };
                        return [3 /*break*/, 7];
                    case 6:
                        try {
                            if (scriptFunctions_1_1 && !scriptFunctions_1_1.done && (_a = scriptFunctions_1.return)) _a.call(scriptFunctions_1);
                        }
                        finally { if (e_5) throw e_5.error; }
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
                        scripts = scriptFunctions.map(function (sfn) { return global.script.world.runScript(sfn); });
                        _a.label = 1;
                    case 1:
                        if (!!_.isEmpty(scripts)) return [3 /*break*/, 3];
                        scripts = scripts.filter(function (script) { return !script.done; });
                        return [4 /*yield*/];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 1];
                    case 3: return [2 /*return*/];
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
})(S || (S = {}));
var O;
(function (O) {
    function deepClone(obj) {
        return deepCloneInternal(obj);
    }
    O.deepClone = deepClone;
    function deepCloneInternal(obj) {
        var e_6, _a;
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
            catch (e_6_1) { e_6 = { error: e_6_1 }; }
            finally {
                try {
                    if (obj_1_1 && !obj_1_1.done && (_a = obj_1.return)) _a.call(obj_1);
                }
                finally { if (e_6) throw e_6.error; }
            }
            return result;
        }
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
    Camera.prototype.update = function (world) {
        if (this.mode.type === 'follow') {
            var target = this.mode.target;
            if (_.isString(target)) {
                target = world.getWorldObjectByName(target);
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
                        script.update(global.script.theater, global.script.delta);
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
            this.current.script.update(this.theater, delta);
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
                            global.script.theater.dialogBox.showPortrait(p1);
                            global.script.theater.dialogBox.showDialog(p2);
                        }
                        else {
                            global.script.theater.dialogBox.showDialog(p1);
                        }
                        _a.label = 1;
                    case 1:
                        if (!!global.script.theater.dialogBox.done) return [3 /*break*/, 3];
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
                        if (_.isEmpty(global.script.theater.slides))
                            return [2 /*return*/];
                        slideAlphas = global.script.theater.slides.map(function (slide) { return slide.alpha; });
                        timer = new Timer(duration);
                        _a.label = 1;
                    case 1:
                        if (!!timer.done) return [3 /*break*/, 3];
                        for (i = 0; i < global.script.theater.slides.length; i++) {
                            global.script.theater.slides[i].alpha = slideAlphas[i] * (1 - timer.progress);
                        }
                        timer.update(global.script.delta);
                        return [4 /*yield*/];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 1];
                    case 3:
                        global.script.theater.clearSlides();
                        return [2 /*return*/];
                }
            });
        };
    }
    S.fadeSlides = fadeSlides;
    function fadeOut(duration, tint) {
        if (tint === void 0) { tint = 0x000000; }
        var texture = new Texture(Main.width, Main.height);
        Draw.brush.color = tint;
        Draw.brush.alpha = 1;
        Draw.fill(texture);
        return showSlide({ x: 0, y: 0, texture: texture, timeToLoad: duration, fadeIn: true });
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
                        scr = global.script.theater.currentWorld.runScript(script);
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
                        global.script.world.camera.shakeIntensity += intensity;
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
                        global.script.world.camera.shakeIntensity -= intensity;
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
                        slide = global.script.theater.addSlideByConfig(config);
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
        _this.spriteText.mask = new Texture(Main.width, Main.height);
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
var Effects = /** @class */ (function () {
    function Effects(config) {
        if (config === void 0) { config = {}; }
        this.effects = [undefined, undefined];
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
        return this.effects;
    };
    Effects.prototype.updateFromConfig = function (config) {
        if (!config)
            return;
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
    };
    Effects.SILHOUETTE_I = 0;
    Effects.OUTLINE_I = 1;
    return Effects;
}());
(function (Effects) {
    var Filters;
    (function (Filters) {
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
    })(Filters = Effects.Filters || (Effects.Filters = {}));
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
        this.attemptToResolveTarget(sprite);
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
    Follow.prototype.renderTrail = function (screen) {
        for (var i = 0; i < this.targetHistory.length - 1; i += 2) {
            Draw.brush.color = 0x00FF00;
            Draw.brush.alpha = 1;
            Draw.pixel(screen, this.targetHistory[i], this.targetHistory[i + 1]);
        }
    };
    Follow.prototype.attemptToResolveTarget = function (sprite) {
        if (_.isString(this.target)) {
            this.target = sprite.world.worldObjectsByName[this.target] || this.target;
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
function autoPlayScript(options) {
    return function () {
        var theater, sai, script, optionsMatched;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/];
                case 1:
                    _a.sent();
                    theater = global.theater;
                    sai = theater.partyManager.getMember('sai').worldObject;
                    script = new Script(function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (!(theater.currentStageName !== 'inside')) return [3 /*break*/, 2];
                                    Input.debugKeyJustDown('advanceDialog');
                                    return [4 /*yield*/];
                                case 1:
                                    _a.sent();
                                    return [3 /*break*/, 0];
                                case 2:
                                    if (!(theater.currentStageName !== 'hallway')) return [3 /*break*/, 4];
                                    Input.debugKeyJustDown('advanceDialog');
                                    Input.debugKeyDown('up');
                                    Input.debugKeyDown('right');
                                    return [4 /*yield*/];
                                case 3:
                                    _a.sent();
                                    return [3 /*break*/, 2];
                                case 4:
                                    if (!(sai.x < Main.width / 2)) return [3 /*break*/, 6];
                                    Input.debugKeyJustDown('advanceDialog');
                                    Input.debugKeyDown('up');
                                    Input.debugKeyDown('right');
                                    return [4 /*yield*/];
                                case 5:
                                    _a.sent();
                                    return [3 /*break*/, 4];
                                case 6:
                                    if (!(theater.currentStageName !== 'escaperoom')) return [3 /*break*/, 8];
                                    Input.debugKeyJustDown('advanceDialog');
                                    Input.debugKeyDown('up');
                                    return [4 /*yield*/];
                                case 7:
                                    _a.sent();
                                    return [3 /*break*/, 6];
                                case 8:
                                    if (!(sai.x > 92)) return [3 /*break*/, 10];
                                    Input.debugKeyJustDown('advanceDialog');
                                    Input.debugKeyDown('up');
                                    Input.debugKeyDown('left');
                                    return [4 /*yield*/];
                                case 9:
                                    _a.sent();
                                    return [3 /*break*/, 8];
                                case 10:
                                    if (!(theater.storyManager.currentNodeName !== 'i_keypad')) return [3 /*break*/, 12];
                                    Input.debugKeyJustDown('advanceDialog');
                                    Input.debugKeyDown('up');
                                    Input.debugKeyJustDown('interact');
                                    return [4 /*yield*/];
                                case 11:
                                    _a.sent();
                                    return [3 /*break*/, 10];
                                case 12:
                                    if (!(theater.currentStageName !== 'none')) return [3 /*break*/, 14];
                                    Input.debugKeyJustDown('advanceDialog');
                                    return [4 /*yield*/];
                                case 13:
                                    _a.sent();
                                    return [3 /*break*/, 12];
                                case 14:
                                    if (!theater.stageManager.transitioning) return [3 /*break*/, 16];
                                    return [4 /*yield*/];
                                case 15:
                                    _a.sent();
                                    return [3 /*break*/, 14];
                                case 16: return [2 /*return*/];
                            }
                        });
                    });
                    optionsMatched = function () {
                        if (options.endNode && theater.storyManager.currentNodeName !== options.endNode)
                            return false;
                        if (options.stage && (theater.currentStageName !== options.stage || theater.stageManager.transitioning))
                            return false;
                        return true;
                    };
                    DEBUG_PROGRAMMATIC_INPUT = true;
                    DEBUG_SKIP_RATE = 100;
                    _a.label = 2;
                case 2:
                    if (!(!script.done && !optionsMatched() && DEBUG_SKIP_RATE > 1 && DEBUG_PROGRAMMATIC_INPUT)) return [3 /*break*/, 4];
                    script.update(global.script.world, global.script.delta);
                    return [4 /*yield*/];
                case 3:
                    _a.sent();
                    return [3 /*break*/, 2];
                case 4:
                    DEBUG_PROGRAMMATIC_INPUT = false;
                    DEBUG_SKIP_RATE = 1;
                    return [2 /*return*/];
            }
        });
    };
}
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
        _this.screen = new Texture(_this.width, _this.height);
        _this.layerTexture = new Texture(_this.width, _this.height);
        _this.debugCameraX = 0;
        _this.debugCameraY = 0;
        return _this;
    }
    World.prototype.update = function (delta) {
        var e_7, _a, e_8, _b, e_9, _c;
        _super.prototype.update.call(this, delta);
        this.scriptManager.update(this, delta);
        try {
            for (var _d = __values(this.worldObjects), _e = _d.next(); !_e.done; _e = _d.next()) {
                var worldObject = _e.value;
                if (worldObject.active)
                    worldObject.preUpdate();
            }
        }
        catch (e_7_1) { e_7 = { error: e_7_1 }; }
        finally {
            try {
                if (_e && !_e.done && (_a = _d.return)) _a.call(_d);
            }
            finally { if (e_7) throw e_7.error; }
        }
        try {
            for (var _f = __values(this.worldObjects), _g = _f.next(); !_g.done; _g = _f.next()) {
                var worldObject = _g.value;
                if (worldObject.active)
                    worldObject.update(delta);
            }
        }
        catch (e_8_1) { e_8 = { error: e_8_1 }; }
        finally {
            try {
                if (_g && !_g.done && (_b = _f.return)) _b.call(_f);
            }
            finally { if (e_8) throw e_8.error; }
        }
        this.handleCollisions();
        try {
            for (var _h = __values(this.worldObjects), _j = _h.next(); !_j.done; _j = _h.next()) {
                var worldObject = _j.value;
                if (worldObject.active)
                    worldObject.postUpdate();
            }
        }
        catch (e_9_1) { e_9 = { error: e_9_1 }; }
        finally {
            try {
                if (_j && !_j.done && (_c = _h.return)) _c.call(_h);
            }
            finally { if (e_9) throw e_9.error; }
        }
        if (DEBUG_MOVE_CAMERA_WITH_ARROWS && global.theater && this === global.theater.currentWorld) {
            if (Input.isDown('debugMoveCameraLeft'))
                this.debugCameraX -= 1;
            if (Input.isDown('debugMoveCameraRight'))
                this.debugCameraX += 1;
            if (Input.isDown('debugMoveCameraUp'))
                this.debugCameraY -= 1;
            if (Input.isDown('debugMoveCameraDown'))
                this.debugCameraY += 1;
        }
        this.camera.update(this);
    };
    World.prototype.render = function (screen) {
        var e_10, _a;
        var oldCameraX = this.camera.x;
        var oldCameraY = this.camera.y;
        if (DEBUG_MOVE_CAMERA_WITH_ARROWS && global.theater && this === global.theater.currentWorld) {
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
                this.layerTexture.clear();
                this.renderLayer(layer);
                this.screen.render(this.layerTexture);
            }
        }
        catch (e_10_1) { e_10 = { error: e_10_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_10) throw e_10.error; }
        }
        this.camera.x = oldCameraX;
        this.camera.y = oldCameraY;
        screen.render(this.screen);
        _super.prototype.render.call(this, screen);
    };
    World.prototype.renderLayer = function (layer) {
        var e_11, _a;
        layer.sort();
        try {
            for (var _b = __values(layer.worldObjects), _c = _b.next(); !_c.done; _c = _b.next()) {
                var worldObject = _c.value;
                if (worldObject.visible) {
                    worldObject.fullRender(this.layerTexture, this);
                }
            }
        }
        catch (e_11_1) { e_11 = { error: e_11_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_11) throw e_11.error; }
        }
    };
    World.prototype.containsWorldObject = function (obj) {
        if (_.isString(obj)) {
            return !!this.worldObjectsByName[obj];
        }
        return _.contains(this.worldObjects, obj);
    };
    World.prototype.getLayer = function (obj) {
        var e_12, _a;
        if (_.isString(obj))
            obj = this.getWorldObjectByName(obj);
        try {
            for (var _b = __values(this.layers), _c = _b.next(); !_c.done; _c = _b.next()) {
                var layer = _c.value;
                if (_.contains(layer.worldObjects, obj))
                    return layer.name;
            }
        }
        catch (e_12_1) { e_12 = { error: e_12_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_12) throw e_12.error; }
        }
        return undefined;
    };
    World.prototype.getLayerByName = function (name) {
        var e_13, _a;
        try {
            for (var _b = __values(this.layers), _c = _b.next(); !_c.done; _c = _b.next()) {
                var layer = _c.value;
                if (layer.name === name)
                    return layer;
            }
        }
        catch (e_13_1) { e_13 = { error: e_13_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_13) throw e_13.error; }
        }
        return undefined;
    };
    World.prototype.getName = function (obj) {
        if (_.isString(obj))
            return obj;
        for (var name_2 in this.worldObjectsByName) {
            if (this.worldObjectsByName[name_2] === obj)
                return name_2;
        }
        return undefined;
    };
    World.prototype.getPhysicsGroup = function (obj) {
        if (_.isString(obj))
            obj = this.getWorldObjectByName(obj);
        for (var name_3 in this.physicsGroups) {
            if (_.contains(this.physicsGroups[name_3].worldObjects, obj))
                return name_3;
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
    World.prototype.handleCollisions = function () {
        var _this = this;
        var e_14, _a, e_15, _b, e_16, _c;
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
                        catch (e_16_1) { e_16 = { error: e_16_1 }; }
                        finally {
                            try {
                                if (group_1_1 && !group_1_1.done && (_c = group_1.return)) _c.call(group_1);
                            }
                            finally { if (e_16) throw e_16.error; }
                        }
                    }
                }
                catch (e_15_1) { e_15 = { error: e_15_1 }; }
                finally {
                    try {
                        if (move_1_1 && !move_1_1.done && (_b = move_1.return)) _b.call(move_1);
                    }
                    finally { if (e_15) throw e_15.error; }
                }
            }
        }
        catch (e_14_1) { e_14 = { error: e_14_1 }; }
        finally {
            try {
                if (_e && !_e.done && (_a = _d.return)) _a.call(_d);
            }
            finally { if (e_14) throw e_14.error; }
        }
    };
    World.prototype.runScript = function (script) {
        return this.scriptManager.runScript(script);
    };
    World.prototype.takeSnapshot = function () {
        var screen = new Texture(this.camera.width, this.camera.height);
        var lastx = this.x;
        var lasty = this.y;
        this.x = 0;
        this.y = 0;
        this.render(screen);
        this.x = lastx;
        this.y = lasty;
        return screen;
    };
    World.prototype.createLayers = function (layers) {
        var e_17, _a;
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
        catch (e_17_1) { e_17 = { error: e_17_1 }; }
        finally {
            try {
                if (layers_1_1 && !layers_1_1.done && (_a = layers_1.return)) _a.call(layers_1);
            }
            finally { if (e_17) throw e_17.error; }
        }
        return result;
    };
    World.prototype.createPhysicsGroups = function (physicsGroups) {
        if (_.isEmpty(physicsGroups))
            return {};
        var result = {};
        for (var name_4 in physicsGroups) {
            _.defaults(physicsGroups[name_4], {
                collidesWith: [],
            });
            result[name_4] = new World.PhysicsGroup(name_4, physicsGroups[name_4]);
        }
        return result;
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
        this.removeFromAllLayers(obj);
        this.removeFromAllPhysicsGroups(obj);
        A.removeAll(this.worldObjects, obj);
    };
    // For use with World.Actions.setName
    World.prototype.internalSetNameWorld = function (obj, name) {
        this.removeName(obj);
        this.worldObjectsByName[name] = obj;
    };
    // For use with World.Actions.setLayer
    World.prototype.internalSetLayerWorld = function (obj, layerName) {
        var e_18, _a;
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
        catch (e_18_1) { e_18 = { error: e_18_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_18) throw e_18.error; }
        }
    };
    // For use with World.Actions.setPhysicsGroup
    World.prototype.internalSetPhysicsGroupWorld = function (obj, physicsGroupName) {
        this.removeFromAllPhysicsGroups(obj);
        this.getPhysicsGroupByName(physicsGroupName).worldObjects.push(obj);
    };
    World.prototype.internalAddChildToParentWorld = function (child, obj) {
        World.Actions.addWorldObjectToWorld(child, this);
    };
    World.prototype.internalRemoveChildFromParentWorld = function (child) {
        World.Actions.removeWorldObjectFromWorld(child);
    };
    World.prototype.removeName = function (obj) {
        for (var name_5 in this.worldObjectsByName) {
            if (this.worldObjectsByName[name_5] === obj) {
                delete this.worldObjectsByName[name_5];
            }
        }
    };
    World.prototype.removeFromAllLayers = function (obj) {
        var e_19, _a;
        try {
            for (var _b = __values(this.layers), _c = _b.next(); !_c.done; _c = _b.next()) {
                var layer = _c.value;
                A.removeAll(layer.worldObjects, obj);
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
    World.prototype.removeFromAllPhysicsGroups = function (obj) {
        for (var name_6 in this.physicsGroups) {
            A.removeAll(this.physicsGroups[name_6].worldObjects, obj);
        }
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
        function addWorldObjectToWorld(obj, world) {
            var e_20, _a;
            if (!obj || !world)
                return false;
            if (obj.world) {
                debug("Cannot add object " + obj.name + " to world because it aleady exists in another world! You must remove object from previous world first. World:", world, 'Previous world:', obj.world);
                return false;
            }
            if (obj.name && world.containsWorldObject(obj.name)) {
                debug("Cannot add object " + obj.name + " to world because an object already exists with that name! World:", world);
                return false;
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
            catch (e_20_1) { e_20 = { error: e_20_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_20) throw e_20.error; }
            }
            obj.onAdd(world);
            return true;
        }
        Actions.addWorldObjectToWorld = addWorldObjectToWorld;
        function removeWorldObjectFromWorld(obj) {
            var e_21, _a;
            if (!obj)
                return false;
            if (!obj.world) {
                debug("Cannot remove object " + obj.name + " from world because it does not belong to a world! Object:", obj);
                return false;
            }
            var world = obj.world;
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
            catch (e_21_1) { e_21 = { error: e_21_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_21) throw e_21.error; }
            }
            if (obj.parent) {
                World.Actions.removeChildFromParent(obj);
            }
            obj.onRemove(world);
            return true;
        }
        Actions.removeWorldObjectFromWorld = removeWorldObjectFromWorld;
        function setName(obj, name) {
            if (!obj)
                return false;
            if (obj.world && obj.world.containsWorldObject(name)) {
                debug("Cannot name object '" + name + "' as that name already exists in world!", obj.world);
                return false;
            }
            /// @ts-ignore
            obj.internalSetNameWorldObject(name);
            if (obj.world) {
                /// @ts-ignore
                obj.world.internalSetNameWorld(obj, name);
            }
        }
        Actions.setName = setName;
        function setLayer(obj, layerName) {
            if (!obj)
                return false;
            if (obj.world && !obj.world.getLayerByName(layerName)) {
                debug("Cannot set layer on object '" + obj.name + "' as no layer named " + layerName + " exists in world!", obj.world);
                return false;
            }
            /// @ts-ignore
            obj.internalSetLayerWorldObject(layerName);
            if (obj.world) {
                /// @ts-ignore
                obj.world.internalSetLayerWorld(obj, layerName);
            }
        }
        Actions.setLayer = setLayer;
        function setPhysicsGroup(obj, physicsGroupName) {
            if (!obj)
                return false;
            if (obj.world && !obj.world.getPhysicsGroupByName(physicsGroupName)) {
                debug("Cannot set physicsGroup on object '" + obj.name + "' as no physicsGroup named " + physicsGroupName + " exists in world!", obj.world);
                return false;
            }
            /// @ts-ignore
            obj.internalSetPhysicsGroupWorldObject(physicsGroupName);
            if (obj.world) {
                /// @ts-ignore
                obj.world.internalSetPhysicsGroupWorld(obj, physicsGroupName);
            }
            return true;
        }
        Actions.setPhysicsGroup = setPhysicsGroup;
        function addChildToParent(child, obj) {
            if (!child || !obj)
                return false;
            if (child.world && child.world !== obj.world) {
                debug("Cannot add child " + child.name + " to parent " + obj.name + " becase the child exists in a different world!", child.world);
                return false;
            }
            obj.internalAddChildToParentWorldObject(child);
            if (obj.world) {
                obj.world.internalAddChildToParentWorld(child, obj);
            }
            return true;
        }
        Actions.addChildToParent = addChildToParent;
        function removeChildFromParent(child) {
            if (!child)
                return false;
            if (!child.parent) {
                debug("Cannot remove child " + child.name + " from parent because its parent does not exist! Child:", child);
                return false;
            }
            child.parent.internalRemoveChildFromParentWorldObject(child);
            if (child.world) {
                child.world.internalRemoveChildFromParentWorld(child);
            }
            return true;
        }
        Actions.removeChildFromParent = removeChildFromParent;
    })(Actions = World.Actions || (World.Actions = {}));
})(World || (World = {}));
/// <reference path="./world.ts" />
var Menu = /** @class */ (function (_super) {
    __extends(Menu, _super);
    function Menu(menuSystem, config, items) {
        if (config === void 0) { config = {}; }
        var _this = _super.call(this, config) || this;
        _this.menuSystem = menuSystem;
        _this.addItemsToWorld(items);
        return _this;
    }
    Menu.prototype.addItemsToWorld = function (items) {
        var e_22, _a;
        if (_.isEmpty(items))
            return;
        try {
            for (var items_1 = __values(items), items_1_1 = items_1.next(); !items_1_1.done; items_1_1 = items_1.next()) {
                var item = items_1_1.value;
                World.Actions.addWorldObjectToWorld(item, this);
            }
        }
        catch (e_22_1) { e_22 = { error: e_22_1 }; }
        finally {
            try {
                if (items_1_1 && !items_1_1.done && (_a = items_1.return)) _a.call(items_1);
            }
            finally { if (e_22) throw e_22.error; }
        }
    };
    return Menu;
}(World));
/// <reference path="./menu.ts" />
var MainMenu = /** @class */ (function (_super) {
    __extends(MainMenu, _super);
    function MainMenu(menuSystem) {
        return _super.call(this, menuSystem, {
            backgroundColor: 0x000000,
        }, [
            new MenuTextButton({
                x: 20, y: 20, text: "start game",
                font: Assets.fonts.DELUXE16, style: { color: 0xFFFFFF },
                onClick: function () { return menuSystem.game.startGame(); },
            }),
            new MenuTextButton({
                x: 20, y: 35, text: "options",
                font: Assets.fonts.DELUXE16, style: { color: 0xFFFFFF },
                onClick: function () { return menuSystem.loadMenu(OptionsMenu); },
            }),
        ]) || this;
    }
    return MainMenu;
}(Menu));
var OptionsMenu = /** @class */ (function (_super) {
    __extends(OptionsMenu, _super);
    function OptionsMenu(menuSystem) {
        return _super.call(this, menuSystem, {
            backgroundColor: 0x000000,
        }, [
            new MenuTextButton({
                x: 20, y: 20, text: "back",
                font: Assets.fonts.DELUXE16, style: { color: 0xFFFFFF },
                onClick: function () { return menuSystem.back(); },
            }),
        ]) || this;
    }
    return OptionsMenu;
}(Menu));
var PauseMenu = /** @class */ (function (_super) {
    __extends(PauseMenu, _super);
    function PauseMenu(menuSystem) {
        return _super.call(this, menuSystem, {
            backgroundColor: 0x000000,
        }, [
            new MenuTextButton({
                x: 20, y: 20, text: "resume",
                font: Assets.fonts.DELUXE16, style: { color: 0xFFFFFF },
                onClick: function () { return menuSystem.game.unpauseGame(); },
            }),
        ]) || this;
    }
    return PauseMenu;
}(Menu));
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
/// <reference path="./base.ts"/>
/// <reference path="./partyManager.ts"/>
var party = {
    leader: 'sai',
    activeMembers: ['sai', 'dad'],
    members: {
        'sai': {
            config: {
                name: 'sai',
                parent: HUMAN_CHARACTER('generic_sprites'),
                effects: {
                    outline: {
                        color: 0xFF0000,
                        alpha: 1
                    }
                }
            },
            stage: 'outside',
        },
        'dad': {
            config: {
                name: 'dad',
                parent: HUMAN_CHARACTER('generic_sprites'),
                effects: {
                    outline: {
                        color: 0x0000FF,
                        alpha: 1
                    }
                }
            },
            stage: 'outside',
        },
    }
};
var Raytracer = /** @class */ (function (_super) {
    __extends(Raytracer, _super);
    function Raytracer(config) {
        var _this = _super.call(this, config) || this;
        _this.tex = new Texture(32, 32);
        _this.setTexture(_this.tex);
        _this.camX = 0;
        _this.camY = 0;
        _this.camZ = -2;
        _this.lightX = 2;
        _this.lightY = -2;
        _this.lightZ = -2;
        _this.ar = 0.4;
        _this.ag = 0.1;
        _this.ab = 0.1;
        _this.t = 0;
        _this.draw();
        return _this;
    }
    Raytracer.prototype.update = function (delta) {
        _super.prototype.update.call(this, delta);
        this.t += 4 * delta;
        this.lightX = 2 * Math.cos(this.t);
        this.lightY = -2 * Math.sin(this.t);
    };
    Raytracer.prototype.render = function (screen) {
        this.draw();
        _super.prototype.render.call(this, screen);
    };
    Raytracer.prototype.draw = function () {
        for (var x = 0; x < this.tex.width; x++) {
            for (var y = 0; y < this.tex.height; y++) {
                var ray = this.pixelToRay(x, y);
                Draw.brush.color = this.raycast(ray);
                Draw.brush.alpha = 1;
                Draw.pixel(this.tex, x, y);
            }
        }
    };
    Raytracer.prototype.raycast = function (ray) {
        var i = this.intersect(ray);
        if (isNaN(i)) {
            return 0xFFFFFF;
        }
        var x = ray.x + i * ray.dx;
        var y = ray.y + i * ray.dy;
        var z = ray.z + i * ray.dz;
        var dotp = this.dot(x, y, z, -ray.dx, -ray.dy, -ray.dz);
        var lx = 2 * dotp * x + ray.dx;
        var ly = 2 * dotp * y + ray.dy;
        var lz = 2 * dotp * z + ray.dz;
        var ldx = this.lightX - x;
        var ldy = this.lightY - y;
        var ldz = this.lightZ - z;
        var lightValue = this.ndot(lx, ly, lz, ldx, ldy, ldz);
        lightValue = Math.max(0, lightValue) / (Math.pow(ldx, 2) + Math.pow(ldy, 2) + Math.pow(ldz, 2)) * 4;
        return M.vec3ToColor([Math.min(1, this.ar + lightValue), Math.min(1, this.ag + lightValue), Math.min(1, this.ab + lightValue)]);
    };
    Raytracer.prototype.intersect = function (ray) {
        var a = Math.pow(ray.dx, 2) + Math.pow(ray.dy, 2) + Math.pow(ray.dz, 2);
        var b = 2 * ray.x * ray.dx + 2 * ray.y * ray.dy + 2 * ray.z * ray.dz;
        var c = Math.pow(ray.x, 2) + Math.pow(ray.y, 2) + Math.pow(ray.z, 2) - 1;
        var disc = Math.pow(b, 2) - 4 * a * c;
        if (disc < 0)
            return NaN;
        var t1 = (-b + Math.sqrt(disc)) / 2 / a;
        var t2 = (-b - Math.sqrt(disc)) / 2 / a;
        if (t1 < 0 && t2 < 0)
            return NaN;
        if (t1 < 0)
            return t2;
        if (t2 < 0)
            return t1;
        return Math.min(t1, t2);
    };
    Raytracer.prototype.pixelToRay = function (x, y) {
        return {
            x: this.camX,
            y: this.camY,
            z: this.camZ,
            dx: x - 16,
            dy: y - 16,
            dz: 16
        };
    };
    Raytracer.prototype.dot = function (x1, y1, z1, x2, y2, z2) {
        return x1 * x2 + y1 * y2 + z1 * z2;
    };
    Raytracer.prototype.ndot = function (x1, y1, z1, x2, y2, z2) {
        return (x1 * x2 + y1 * y2 + z1 * z2) / Math.sqrt(Math.pow(x1, 2) + Math.pow(y1, 2) + Math.pow(z1, 2)) / Math.sqrt(Math.pow(x2, 2) + Math.pow(y2, 2) + Math.pow(z2, 2));
    };
    return Raytracer;
}(Sprite));
// TODO: convert this to a sprite?
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
        _this.renderTexture = new Texture(_this.numTilesX * _this.tilemap.tileset.tileWidth, _this.numTilesY * _this.tilemap.tileset.tileHeight);
        _this.createCollisionBoxes(O.getOrDefault(config.collisionDebugBounds, false));
        _this.dirty = true;
        return _this;
    }
    Object.defineProperty(Tilemap.prototype, "currentTilemapLayer", {
        get: function () { return this.tilemap.layers[this.tilemapLayer]; },
        enumerable: true,
        configurable: true
    });
    Tilemap.prototype.onAdd = function (world) {
        var e_23, _a;
        try {
            for (var _b = __values(this.collisionBoxes), _c = _b.next(); !_c.done; _c = _b.next()) {
                var box = _c.value;
                World.Actions.setPhysicsGroup(box, this.collisionPhysicsGroup);
                World.Actions.addWorldObjectToWorld(box, world);
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
    Tilemap.prototype.postUpdate = function () {
        var e_24, _a;
        if (!_.isEmpty(this.collisionBoxes) && (this.collisionBoxes[0].x !== this.x || this.collisionBoxes[0].y !== this.y)) {
            try {
                for (var _b = __values(this.collisionBoxes), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var box = _c.value;
                    box.x = this.x;
                    box.y = this.y;
                }
            }
            catch (e_24_1) { e_24 = { error: e_24_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_24) throw e_24.error; }
            }
        }
        _super.prototype.postUpdate.call(this);
    };
    Tilemap.prototype.render = function (screen) {
        if (this.dirty) {
            this.drawRenderTexture();
            this.dirty = false;
        }
        screen.render(this.renderTexture, { x: this.x, y: this.y });
        _super.prototype.render.call(this, screen);
    };
    Tilemap.prototype.createCollisionBoxes = function (debugBounds) {
        if (debugBounds === void 0) { debugBounds = false; }
        var e_25, _a;
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
        catch (e_25_1) { e_25 = { error: e_25_1 }; }
        finally {
            try {
                if (collisionRects_1_1 && !collisionRects_1_1.done && (_a = collisionRects_1.return)) _a.call(collisionRects_1);
            }
            finally { if (e_25) throw e_25.error; }
        }
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
        this.renderTexture.render(texture, { x: tileX * this.tilemap.tileset.tileWidth, y: tileY * this.tilemap.tileset.tileHeight });
    };
    Tilemap.prototype.onRemove = function (world) {
        var e_26, _a;
        try {
            for (var _b = __values(this.collisionBoxes), _c = _b.next(); !_c.done; _c = _b.next()) {
                var box = _c.value;
                World.Actions.removeWorldObjectFromWorld(box);
            }
        }
        catch (e_26_1) { e_26 = { error: e_26_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_26) throw e_26.error; }
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
/// <reference path="./base.ts" />
/// <reference path="./raytracer.ts" />
/// <reference path="./tilemap.ts" />
/// <reference path="./warp.ts" />
var stages = {
    'outside': {
        parent: BASE_STAGE,
        camera: {
            bounds: { left: 0, top: 0, right: 240, bottom: 180 },
        },
        entryPoints: {
            'main': { x: 120, y: 156 },
        },
        worldObjects: __spread(WORLD_BOUNDS(0, 0, 240, 180), [
            {
                name: 'fort_walls',
                constructor: Tilemap,
                layer: 'main',
                tilemap: 'outside',
                tilemapLayer: 0,
                collisionPhysicsGroup: 'walls',
            },
            {
                name: 'ground',
                constructor: Tilemap,
                layer: 'bg',
                tilemap: 'outside',
                tilemapLayer: 1,
            },
            {
                name: 'warp',
                constructor: Warp,
                physicsGroup: 'props',
                bounds: { x: 108, y: 96, width: 24, height: 2 },
                data: {
                    stage: 'inside',
                    entryPoint: 'main',
                    transition: DEFAULT_SCREEN_TRANSITION
                }
            },
            {
                name: 'guard1',
                parent: GUARD(),
                x: 96, y: 100,
                flipX: true,
            },
            {
                name: 'guard2',
                parent: GUARD(),
                x: 144, y: 100,
            },
        ])
    },
    'inside': {
        parent: BASE_STAGE,
        camera: {
            bounds: { left: 0, top: 0, right: 240, bottom: 360 },
        },
        entryPoints: {
            'main': { x: 120, y: 296 },
        },
        worldObjects: __spread(WORLD_BOUNDS(0, 0, 240, 360), [
            {
                name: 'ground',
                constructor: Tilemap,
                layer: 'main',
                tilemap: 'inside',
                tilemapLayer: 0,
                collisionPhysicsGroup: 'walls',
            },
            {
                name: 'warp',
                constructor: Warp,
                physicsGroup: 'props',
                bounds: { x: 180, y: 84, width: 12, height: 36 },
                data: {
                    stage: 'hallway',
                    entryPoint: 'main',
                    transition: DEFAULT_SCREEN_TRANSITION
                }
            },
        ])
    },
    'hallway': {
        parent: BASE_STAGE,
        camera: {
            bounds: { left: 0, top: 0, right: 240, bottom: 540 },
        },
        entryPoints: {
            'main': { x: 64, y: 438 },
        },
        worldObjects: __spread(WORLD_BOUNDS(0, 0, 240, 540), [
            {
                name: 'ground',
                constructor: Tilemap,
                layer: 'main',
                tilemap: 'hallway',
                tilemapLayer: 0,
                collisionPhysicsGroup: 'walls',
            },
            {
                name: 'demon1',
                parent: HUMAN_CHARACTER('generic_sprites_dark'),
                x: 72, y: 408,
                flipX: true,
                effects: {
                    outline: { color: 0xFFFFFF }
                },
                physicsGroup: 'props',
            },
            {
                name: 'demon2',
                parent: HUMAN_CHARACTER('generic_sprites_dark'),
                x: 168, y: 408,
                flipX: false,
                effects: {
                    outline: { color: 0xFFFFFF }
                },
                physicsGroup: 'props',
            },
            {
                name: 'demon3',
                parent: HUMAN_CHARACTER('generic_sprites_dark'),
                x: 72, y: 300,
                flipX: true,
                effects: {
                    outline: { color: 0xFFFFFF }
                },
                physicsGroup: 'props',
            },
            {
                name: 'demon4',
                parent: HUMAN_CHARACTER('generic_sprites_dark'),
                x: 168, y: 300,
                flipX: false,
                effects: {
                    outline: { color: 0xFFFFFF }
                },
                physicsGroup: 'props',
            },
            {
                name: 'demon5',
                parent: HUMAN_CHARACTER('generic_sprites_dark'),
                x: 72, y: 192,
                flipX: true,
                effects: {
                    outline: { color: 0xFFFFFF }
                },
                physicsGroup: 'props',
            },
            {
                name: 'demon6',
                parent: HUMAN_CHARACTER('generic_sprites_dark'),
                x: 168, y: 192,
                flipX: false,
                effects: {
                    outline: { color: 0xFFFFFF }
                },
                physicsGroup: 'props',
            },
            {
                name: 'demon7',
                parent: HUMAN_CHARACTER('generic_sprites_dark'),
                x: 72, y: 84,
                flipX: true,
                effects: {
                    outline: { color: 0xFFFFFF }
                },
                physicsGroup: 'props',
            },
            {
                name: 'demon8',
                parent: HUMAN_CHARACTER('generic_sprites_dark'),
                x: 168, y: 84,
                flipX: false,
                effects: {
                    outline: { color: 0xFFFFFF }
                },
                physicsGroup: 'props',
            },
            {
                name: 'warp',
                constructor: Warp,
                physicsGroup: 'props',
                bounds: { x: 96, y: 48, width: 48, height: 12 },
                data: {
                    stage: 'escaperoom',
                    entryPoint: 'main',
                    transition: DEFAULT_SCREEN_TRANSITION
                }
            },
        ])
    },
    'escaperoom': {
        parent: BASE_STAGE,
        camera: {
            bounds: { left: 0, top: 0, right: 240, bottom: 180 },
        },
        entryPoints: {
            'main': { x: 120, y: 130 },
        },
        worldObjects: __spread(WORLD_BOUNDS(0, 0, 240, 180), [
            {
                name: 'ground',
                constructor: Tilemap,
                layer: 'main',
                tilemap: 'escaperoom',
                tilemapLayer: 0,
                collisionPhysicsGroup: 'walls',
            },
            {
                name: 'door',
                constructor: Sprite,
                layer: 'main',
                x: 60, y: 12,
                texture: 'door_closed',
            },
            {
                name: 'keypad',
                constructor: Sprite,
                layer: 'main',
                x: 88, y: 48,
                texture: 'keypad',
                offset: { x: 0, y: -23 },
                physicsGroup: 'props',
                bounds: { x: 0, y: 0, width: 9, height: 0 },
            },
            {
                name: 'codedemon',
                parent: HUMAN_CHARACTER('generic_sprites_dark'),
                x: 168, y: 60,
                effects: {
                    outline: { color: 0xFFFFFF }
                },
                physicsGroup: 'props',
            },
        ])
    },
};
/// <reference path="./preload.ts" />
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
        get: function () { return 0x061639; },
        enumerable: true,
        configurable: true
    });
    // no need to modify
    Main.preload = function () {
        PIXI.utils.sayHello(PIXI.utils.isWebGLSupported() ? 'WebGL' : 'Canvas');
        PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
        this.renderer = PIXI.autoDetectRenderer({
            width: this.width,
            height: this.height,
            resolution: 4,
            backgroundColor: this.backgroundColor,
        });
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
        document.body.appendChild(this.renderer.view);
        this.screen = new Texture(this.width, this.height);
        Input.setKeys({
            'left': ['ArrowLeft'],
            'right': ['ArrowRight'],
            'up': ['ArrowUp'],
            'down': ['ArrowDown'],
            'interact': ['e'],
            'advanceDialog': ['MouseLeft', 'e', ' '],
            'pause': ['Escape', 'Backspace'],
            'skipCutsceneScript': ['Space'],
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
        //window.addEventListener("contextmenu", event => event.preventDefault(), false);
        this.game = new Game({
            mainMenuClass: MainMenu,
            pauseMenuClass: PauseMenu,
            // theaterClass: Theater,
            // theaterConfig: {
            //     stages: stages,
            //     stageToLoad: 'outside',
            //     stageEntryPoint: 'main',
            //     story: {
            //         storyboard: storyboard,
            //         storyboardPath: ['start'],
            //         storyEvents: storyEvents,
            //         storyConfig: storyConfig,
            //     },
            //     party: party,
            //     dialogBox: {
            //         x: Main.width/2, y: Main.height - 32,
            //         texture: 'dialogbox',
            //         spriteTextFont: Assets.fonts.DELUXE16,
            //         textAreaFull: { x: -114, y: -27, width: 228, height: 54 },
            //         textAreaPortrait: { x: -114, y: -27, width: 158, height: 54 },
            //         portraitPosition: { x: 78, y: 0 },
            //         advanceKey: 'advanceDialog',
            //     },
            //     skipCutsceneScriptKey: 'skipCutsceneScript',
            //     autoPlayScript: autoPlayScript({ endNode: 'none', stage: 'escaperoom'}),
            // },
            theaterClass: TestTheater,
            theaterConfig: undefined,
        });
        global.game = this.game;
    };
    // no need to modify
    Main.play = function () {
        var _this = this;
        PIXI.Ticker.shared.add(function (frameDelta) {
            _this.delta = frameDelta / 60;
            global.clearStacks();
            for (var i = 0; i < DEBUG_SKIP_RATE; i++) {
                Input.update();
                _this.game.update(_this.delta);
            }
            _this.screen.clear();
            _this.game.render(_this.screen);
            _this.renderer.render(Utils.NOOP_DISPLAYOBJECT, undefined, true); // Clear the renderer
            _this.renderer.render(_this.screen.renderTextureSprite);
        });
    };
    return Main;
}());
// Actually load the game
Main.preload();
/// <reference path="./main.ts"/>
var storyConfig = {
    initialConfig: {
        separated: false,
        cameraMode: Camera.Mode.FOCUS(Main.width / 2, Main.height / 2),
    },
    executeFn: function (sc) {
        // separated
        var sai = sc.theater.partyManager.getMember('sai').worldObject;
        var dad = sc.theater.partyManager.getMember('dad').worldObject;
        sai.unfollow();
        dad.unfollow();
        if (!sc.config.separated) {
            if (sc.config.partyLeader === 'sai') {
                dad.follow('sai');
            }
            else {
                sai.follow('dad');
            }
        }
        // cameraMode
        if (sc.theater.currentWorld) {
            sc.theater.currentWorld.camera.setMode(sc.config.cameraMode);
        }
    }
};
var S;
(function (S) {
    S.storyEvents = {
        'inside_girldemon': {
            stage: 'inside',
            script: function () {
                var girldemon, sai;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            girldemon = WorldObject.fromConfig({
                                name: 'girldemon',
                                parent: HUMAN_CHARACTER('generic_sprites_dark'),
                                x: 120, y: 108,
                            });
                            girldemon.setSpeed(100);
                            World.Actions.addWorldObjectToWorld(girldemon, global.script.theater.currentWorld);
                            sai = global.getWorldObject('sai');
                            _a.label = 1;
                        case 1:
                            if (!(sai.y > 160)) return [3 /*break*/, 3];
                            return [4 /*yield*/];
                        case 2:
                            _a.sent();
                            return [3 /*break*/, 1];
                        case 3:
                            global.script.world.runScript(S.moveToX(girldemon, 180));
                            return [4 /*yield*/, S.waitUntil(function () { return girldemon.x > 150; })];
                        case 4:
                            _a.sent();
                            return [4 /*yield*/, S.doOverTime(0.3, function (t) { return girldemon.alpha = 1 - t; })];
                        case 5:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }
        },
    };
})(S || (S = {}));
var storyEvents = S.storyEvents;
var S;
(function (S) {
    S.storyboard = {
        'start': {
            type: 'start',
            transitions: [
                { toNode: 'outside_party', type: 'instant' }
            ]
        },
        'outside_party': {
            type: 'party',
            setLeader: 'dad',
            transitions: [
                { toNode: 'outside', type: 'onStage', stage: 'outside' }
            ]
        },
        'outside': {
            type: 'cutscene',
            script: function () {
                var sai, dad, guard1, guard2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            sai = global.getWorldObject('sai');
                            dad = global.getWorldObject('dad');
                            guard1 = global.getWorldObject('guard1');
                            guard2 = global.getWorldObject('guard2');
                            return [4 /*yield*/, S.fadeOut(0)];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, S.fadeSlides(1)];
                        case 2:
                            _a.sent();
                            return [4 /*yield*/, S.moveToY(dad, 120)];
                        case 3:
                            _a.sent();
                            return [4 /*yield*/, S.dialog('guard1/default', "Well, well. What do we have here?")];
                        case 4:
                            _a.sent();
                            return [4 /*yield*/, S.dialog('guard2/default', "We're not expecting the mail til this evening.")];
                        case 5:
                            _a.sent();
                            return [4 /*yield*/, S.dialog('dad/default', "Ha ha. I've got a prisoner.")];
                        case 6:
                            _a.sent();
                            return [4 /*yield*/, S.dialog('guard2/default', "A prisoner?")];
                        case 7:
                            _a.sent();
                            return [4 /*yield*/, S.moveToY(guard1, sai.y)];
                        case 8:
                            _a.sent();
                            return [4 /*yield*/, S.moveToX(guard1, guard1.x + 4)];
                        case 9:
                            _a.sent();
                            return [4 /*yield*/, S.moveToY(guard2, sai.y)];
                        case 10:
                            _a.sent();
                            return [4 /*yield*/, S.moveToX(guard2, guard2.x - 4)];
                        case 11:
                            _a.sent();
                            return [4 /*yield*/, S.dialog('sai/default', "...")];
                        case 12:
                            _a.sent();
                            return [4 /*yield*/, S.dialog('guard2/default', "He's a kid. You're bringing a kid in as a prisoner?")];
                        case 13:
                            _a.sent();
                            return [4 /*yield*/, S.dialog('guard1/default', "Jesus... what did you do to him?")];
                        case 14:
                            _a.sent();
                            return [4 /*yield*/, S.dialog('dad/default', "I don't need you to lecture me. I need to take him to the closest cell as soon as possible.")];
                        case 15:
                            _a.sent();
                            return [4 /*yield*/, S.dialog('dad/default', "He's a feisty one. Don't underestimate him.")];
                        case 16:
                            _a.sent();
                            return [4 /*yield*/, S.dialog('guard1/default', "Well, you didn't have to-")];
                        case 17:
                            _a.sent();
                            return [4 /*yield*/, S.dialog('dad/default', "Hey, I'm not getting paid by the hour. Are you going to let me in or not?")];
                        case 18:
                            _a.sent();
                            return [4 /*yield*/, S.dialog('guard1/default', "...")];
                        case 19:
                            _a.sent();
                            return [4 /*yield*/, S.dialog('guard2/default', "...")];
                        case 20:
                            _a.sent();
                            return [4 /*yield*/, S.dialog('guard2/default', "Fine, fine. You don't have to get mad.")];
                        case 21:
                            _a.sent();
                            return [4 /*yield*/, S.moveTo(guard2, 144, 100)];
                        case 22:
                            _a.sent();
                            guard2.setDirection(Direction2D.DOWN);
                            return [4 /*yield*/, S.moveTo(guard1, 96, 100)];
                        case 23:
                            _a.sent();
                            guard1.setDirection(Direction2D.DOWN);
                            return [4 /*yield*/, S.dialog('dad/default', "Thank you. I won't be long.")];
                        case 24:
                            _a.sent();
                            return [4 /*yield*/, S.dialog('dad/default', "Come on, boy. I don't have all day.")];
                        case 25:
                            _a.sent();
                            return [4 /*yield*/, S.dialog('sai/default', "...")];
                        case 26:
                            _a.sent();
                            return [4 /*yield*/, S.moveToY(dad, 96)];
                        case 27:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            },
            transitions: [
                { toNode: 'inside_load', type: 'onStage', stage: 'inside' }
            ]
        },
        'inside_load': {
            type: 'config',
            config: {
                cameraMode: Camera.Mode.FOCUS(120, 270),
            },
            transitions: [
                { toNode: 'inside_talk', type: 'instant' }
            ]
        },
        'inside_talk': {
            type: 'cutscene',
            script: function () {
                var sai, dad;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            sai = global.getWorldObject('sai');
                            dad = global.getWorldObject('dad');
                            return [4 /*yield*/, S.moveToY(dad, dad.y - 64)];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, S.dialog('dad/default', "Let's see, the storage room is probably nearby. It should be right down...")];
                        case 2:
                            _a.sent();
                            return [4 /*yield*/, S.dialog('sai/default', "Are we there yet, dad? Do we have to keep walking?")];
                        case 3:
                            _a.sent();
                            return [4 /*yield*/, S.dialog('dad/default', "...")];
                        case 4:
                            _a.sent();
                            return [4 /*yield*/, S.dialog('dad/default', "Hey, what did I tell you about talking?")];
                        case 5:
                            _a.sent();
                            return [4 /*yield*/, S.dialog('sai/default', "Sorry... my legs hurt...")];
                        case 6:
                            _a.sent();
                            return [4 /*yield*/, S.dialog('dad/default', "(Sigh) ...")];
                        case 7:
                            _a.sent();
                            sai.unfollow();
                            return [4 /*yield*/, S.moveToY(dad, dad.y + 4)];
                        case 8:
                            _a.sent();
                            return [4 /*yield*/, S.dialog('dad/default', "Sai...")];
                        case 9:
                            _a.sent();
                            return [4 /*yield*/, S.dialog('dad/default', "Do you remember what you learned about dealing with pain?")];
                        case 10:
                            _a.sent();
                            return [4 /*yield*/, S.dialog('sai/default', "Take deep breaths...")];
                        case 11:
                            _a.sent();
                            return [4 /*yield*/, S.dialog('dad/default', "That's right. Can you do that for me?")];
                        case 12:
                            _a.sent();
                            return [4 /*yield*/, S.dialog('sai/default', "...")];
                        case 13:
                            _a.sent();
                            return [4 /*yield*/, S.dialog('sai/default', "They still hurt...")];
                        case 14:
                            _a.sent();
                            return [4 /*yield*/, S.dialog('dad/default', "Well, there's nothing we can really do about it right now. You'll just have to hold on, okay?")];
                        case 15:
                            _a.sent();
                            return [4 /*yield*/, S.dialog('dad/default', "You're a powerful weapon, Sai. You know what they'll do if they find you out.")];
                        case 16:
                            _a.sent();
                            return [4 /*yield*/, S.dialog('dad/default', "Come on. We need to keep moving. I think the storage room is down the hall.")];
                        case 17:
                            _a.sent();
                            return [4 /*yield*/, S.dialog('sai/default', "...")];
                        case 18:
                            _a.sent();
                            return [4 /*yield*/, S.moveToY(dad, 120)];
                        case 19:
                            _a.sent();
                            World.Actions.removeWorldObjectFromWorld(dad);
                            global.script.theater.partyManager.moveMemberToStage('dad', 'hallway', 120, 420);
                            return [2 /*return*/];
                    }
                });
            },
            transitions: [
                { toNode: 'inside_pre_gameplay_party', type: 'instant' }
            ]
        },
        'inside_pre_gameplay_party': {
            type: 'party',
            setLeader: 'sai',
            setMembersInactive: ['dad'],
            transitions: [
                { toNode: 'inside_pre_gameplay', type: 'instant' }
            ]
        },
        'inside_pre_gameplay': {
            type: 'config',
            config: {
                separated: true,
                cameraMode: Camera.Mode.FOLLOW('sai', 0, -18),
            },
            transitions: [
                { toNode: 'inside_gameplay', type: 'instant' }
            ]
        },
        'inside_gameplay': {
            type: 'gameplay',
            transitions: [
                { type: 'onStage', stage: 'hallway', toNode: 'hallway_talk' },
            ]
        },
        'hallway_talk': {
            type: 'cutscene',
            script: function () {
                var sai, dad;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            sai = global.getWorldObject('sai');
                            dad = global.getWorldObject('dad');
                            return [4 /*yield*/, S.dialog('dad/default', "Hey, keep up. You don't know if more guards are coming.")];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, S.moveToY(dad, 120)];
                        case 2:
                            _a.sent();
                            World.Actions.removeWorldObjectFromWorld(dad);
                            global.script.theater.partyManager.moveMemberToStage('dad', 'escaperoom', 74, 64);
                            return [2 /*return*/];
                    }
                });
            },
            transitions: [
                { toNode: 'hallway_gameplay', type: 'instant' }
            ]
        },
        'hallway_gameplay': {
            type: 'gameplay',
            transitions: [
                { type: 'onInteract', with: 'demon1', toNode: 'i_demon1' },
                { type: 'onInteract', with: 'demon2', toNode: 'i_demon2' },
                { type: 'onInteract', with: 'demon3', toNode: 'i_demon3' },
                { type: 'onInteract', with: 'demon4', toNode: 'i_demon4' },
                { type: 'onInteract', with: 'demon5', toNode: 'i_demon5' },
                { type: 'onInteract', with: 'demon6', toNode: 'i_demon6' },
                { type: 'onInteract', with: 'demon7', toNode: 'i_demon7' },
                { type: 'onInteract', with: 'demon8', toNode: 'i_demon8' },
                { type: 'onStage', stage: 'escaperoom', toNode: 'escaperoom_talk' },
            ]
        },
        'i_demon1': {
            type: 'cutscene',
            script: function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, S.dialog('demon/default', "Aw, you're all bruised up...")];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, S.dialog('demon/default', "That's dedication to your act.")];
                        case 2:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            },
            transitions: [
                { type: 'instant', toNode: 'inside_gameplay' }
            ]
        },
        'i_demon2': {
            type: 'cutscene',
            script: function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, S.dialog('demon/default', "It... is an act, right?")];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            },
            transitions: [
                { type: 'instant', toNode: 'inside_gameplay' }
            ]
        },
        'i_demon3': {
            type: 'cutscene',
            script: function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, S.dialog('demon/default', "Aw, you're all bruised up...")];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, S.dialog('demon/default', "That's dedication to your act.")];
                        case 2:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            },
            transitions: [
                { type: 'instant', toNode: 'inside_gameplay' }
            ]
        },
        'i_demon4': {
            type: 'cutscene',
            script: function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, S.dialog('demon/default', "It... is an act, right?")];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            },
            transitions: [
                { type: 'instant', toNode: 'inside_gameplay' }
            ]
        },
        'i_demon5': {
            type: 'cutscene',
            script: function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, S.dialog('demon/default', "Aw, you're all bruised up...")];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, S.dialog('demon/default', "That's dedication to your act.")];
                        case 2:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            },
            transitions: [
                { type: 'instant', toNode: 'inside_gameplay' }
            ]
        },
        'i_demon6': {
            type: 'cutscene',
            script: function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, S.dialog('demon/default', "It... is an act, right?")];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            },
            transitions: [
                { type: 'instant', toNode: 'inside_gameplay' }
            ]
        },
        'i_demon7': {
            type: 'cutscene',
            script: function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, S.dialog('demon/default', "Aw, you're all bruised up...")];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, S.dialog('demon/default', "That's dedication to your act.")];
                        case 2:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            },
            transitions: [
                { type: 'instant', toNode: 'inside_gameplay' }
            ]
        },
        'i_demon8': {
            type: 'cutscene',
            script: function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, S.dialog('demon/default', "It... is an act, right?")];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            },
            transitions: [
                { type: 'instant', toNode: 'inside_gameplay' }
            ]
        },
        'escaperoom_talk': {
            type: 'cutscene',
            script: function () {
                var sai, dad;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            sai = global.getWorldObject('sai');
                            dad = global.getWorldObject('dad');
                            return [4 /*yield*/, S.dialog('dad/default', "Here we are. the escape room.")];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            },
            transitions: [
                { toNode: 'escaperoom_gameplay', type: 'instant' }
            ]
        },
        'escaperoom_gameplay': {
            type: 'gameplay',
            transitions: [
                { type: 'onInteract', with: 'codedemon', toNode: 'i_codedemon' },
                { type: 'onInteract', with: 'keypad', toNode: 'i_keypad' },
            ]
        },
        'i_codedemon': {
            type: 'cutscene',
            script: function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, S.dialog('demon/default', "Hey, have you tried 1234?")];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            },
            transitions: [
                { type: 'instant', toNode: 'escaperoom_gameplay' }
            ]
        },
        'i_keypad': {
            type: 'cutscene',
            script: function () {
                var sai, dad, door, entryPoint, guard1, guard2, guard3;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            sai = global.getWorldObject('sai');
                            dad = global.getWorldObject('dad');
                            door = global.getWorldObject('door');
                            return [4 /*yield*/, S.dialog('sai/default', "Click.")];
                        case 1:
                            _a.sent();
                            door.setTexture('door_open');
                            return [4 /*yield*/, S.dialog('sai/default', "They're coming...")];
                        case 2:
                            _a.sent();
                            return [4 /*yield*/, S.dialog('dad/default', "Alright. You stay here and distract them. I'll get the loot.")];
                        case 3:
                            _a.sent();
                            return [4 /*yield*/, S.doOverTime(0.5, function (t) {
                                    dad.alpha = 1 - t;
                                    dad.effects.outline.alpha = 1 - t;
                                })];
                        case 4:
                            _a.sent();
                            World.Actions.removeWorldObjectFromWorld(dad);
                            global.script.theater.partyManager.moveMemberToStage('dad', null, 0, 0);
                            return [4 /*yield*/, S.moveToX(sai, 120)];
                        case 5:
                            _a.sent();
                            entryPoint = global.theater.currentStage.entryPoints['main'];
                            guard1 = WorldObject.fromConfig({
                                name: 'guard1',
                                parent: GUARD(),
                                x: entryPoint.x, y: entryPoint.y,
                                alpha: 0,
                            });
                            guard2 = WorldObject.fromConfig({
                                name: 'guard2',
                                parent: GUARD(),
                                x: entryPoint.x, y: entryPoint.y,
                                alpha: 0,
                            });
                            guard3 = WorldObject.fromConfig({
                                name: 'guard3',
                                parent: GUARD(),
                                x: entryPoint.x, y: entryPoint.y,
                                alpha: 0,
                            });
                            World.Actions.addWorldObjectToWorld(guard1, global.theater.currentWorld);
                            return [4 /*yield*/, S.doOverTime(0.5, function (t) { return guard1.alpha = t; })];
                        case 6:
                            _a.sent();
                            return [4 /*yield*/, S.moveTo(guard1, 100, 100)];
                        case 7:
                            _a.sent();
                            World.Actions.addWorldObjectToWorld(guard2, global.theater.currentWorld);
                            return [4 /*yield*/, S.doOverTime(0.5, function (t) { return guard2.alpha = t; })];
                        case 8:
                            _a.sent();
                            return [4 /*yield*/, S.moveTo(guard2, 120, 105)];
                        case 9:
                            _a.sent();
                            World.Actions.addWorldObjectToWorld(guard3, global.theater.currentWorld);
                            return [4 /*yield*/, S.doOverTime(0.5, function (t) { return guard3.alpha = t; })];
                        case 10:
                            _a.sent();
                            return [4 /*yield*/, S.moveTo(guard3, 140, 100)];
                        case 11:
                            _a.sent();
                            DEBUG_SKIP_RATE = 1;
                            return [4 /*yield*/, S.dialog('sai/default', '...')];
                        case 12:
                            _a.sent();
                            return [4 /*yield*/, S.moveTo(guard2, 120, sai.y + 1)];
                        case 13:
                            _a.sent();
                            return [4 /*yield*/, S.fadeOut(1)];
                        case 14:
                            _a.sent();
                            global.game.menuSystem.loadMenu(MainMenu);
                            return [2 /*return*/];
                    }
                });
            },
            transitions: [
                { type: 'instant', toNode: 'escaperoom_gameplay' }
            ]
        },
    };
})(S || (S = {}));
var storyboard = S.storyboard;
var Game = /** @class */ (function () {
    function Game(config) {
        this.mainMenuClass = config.mainMenuClass;
        this.pauseMenuClass = config.pauseMenuClass;
        this.theaterClass = config.theaterClass;
        this.theaterConfig = config.theaterConfig;
        this.fpsMetricManager = new FPSMetricManager(1);
        this.menuSystem = new MenuSystem(this);
        this.loadMainMenu();
        if (DEBUG_SKIP_MAIN_MENU) {
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
    global.getWorldObject = function (name) {
        return global.theater.currentWorld.getWorldObjectByName(name);
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
    global.scriptStack = [];
    return global;
}());
function group(config) {
    var e_27, _a;
    _.defaults(config, {
        overrides: [],
        x: 0, y: 0,
        prefix: '',
    });
    var results = config.worldObjects.map(function (obj) { return WorldObject.resolveConfig(obj); });
    try {
        for (var _b = __values(config.overrides), _c = _b.next(); !_c.done; _c = _b.next()) {
            var override = _c.value;
            for (var i = 0; i < results.length; i++) {
                if (results[i].name === override.name) {
                    override = WorldObject.resolveConfig(override);
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
    catch (e_27_1) { e_27 = { error: e_27_1 }; }
    finally {
        try {
            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
        }
        finally { if (e_27) throw e_27.error; }
    }
    for (var i = 0; i < results.length; i++) {
        results[i].x = config.x + O.getOrDefault(config.worldObjects[i].x, 0);
        results[i].y = config.y + O.getOrDefault(config.worldObjects[i].y, 0);
        results[i].name = config.prefix + O.getOrDefault(config.worldObjects[i].name, '');
    }
    return results;
}
var Input = /** @class */ (function () {
    function Input() {
    }
    Input.setKeys = function (keyCodesByName) {
        var e_28, _a;
        this.keyCodesByName = _.clone(keyCodesByName);
        this.isDownByKeyCode = {};
        this.keysByKeycode = {};
        for (var name_7 in keyCodesByName) {
            this.keyCodesByName[name_7].push(this.debugKeyCode(name_7));
            try {
                for (var _b = __values(keyCodesByName[name_7]), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var keyCode = _c.value;
                    this.setupKeyCode(keyCode);
                }
            }
            catch (e_28_1) { e_28 = { error: e_28_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_28) throw e_28.error; }
            }
        }
    };
    Input.update = function () {
        if (DEBUG_PROGRAMMATIC_INPUT) {
            this.clearKeys();
        }
        this.updateKeys();
        this.updateMousePosition();
    };
    Input.consume = function (key) {
        var e_29, _a;
        try {
            for (var _b = __values(this.keyCodesByName[key] || []), _c = _b.next(); !_c.done; _c = _b.next()) {
                var keyCode = _c.value;
                this.keysByKeycode[keyCode].consume();
            }
        }
        catch (e_29_1) { e_29 = { error: e_29_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_29) throw e_29.error; }
        }
    };
    Input.debugKeyDown = function (name) {
        if (!DEBUG_PROGRAMMATIC_INPUT)
            return;
        this.keysByKeycode[this.debugKeyCode(name)].setDown();
    };
    Input.debugKeyJustDown = function (name) {
        if (!DEBUG_PROGRAMMATIC_INPUT)
            return;
        this.keysByKeycode[this.debugKeyCode(name)].setJustDown();
    };
    Input.debugKeyUp = function (name) {
        if (!DEBUG_PROGRAMMATIC_INPUT)
            return;
        this.keysByKeycode[this.debugKeyCode(name)].setUp();
    };
    Input.debugKeyJustUp = function (name) {
        if (!DEBUG_PROGRAMMATIC_INPUT)
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
        this._canvasMouseX = Main.renderer.plugins.interaction.mouse.global.x;
        this._canvasMouseY = Main.renderer.plugins.interaction.mouse.global.y;
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
            return 0 <= this.canvasMouseX && this.canvasMouseX < Main.width && 0 <= this.canvasMouseY && this.canvasMouseY < Main.height;
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
        var e_30, _a;
        var interactableObjects = this.theater.storyManager.getInteractableObjects(this.theater.storyManager.currentNode);
        var result = new Set();
        try {
            for (var interactableObjects_2 = __values(interactableObjects), interactableObjects_2_1 = interactableObjects_2.next(); !interactableObjects_2_1.done; interactableObjects_2_1 = interactableObjects_2.next()) {
                var name_8 = interactableObjects_2_1.value;
                if (!this.theater.currentWorld.containsWorldObject(name_8))
                    continue;
                result.add(name_8);
            }
        }
        catch (e_30_1) { e_30 = { error: e_30_1 }; }
        finally {
            try {
                if (interactableObjects_2_1 && !interactableObjects_2_1.done && (_a = interactableObjects_2.return)) _a.call(interactableObjects_2);
            }
            finally { if (e_30) throw e_30.error; }
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
        var e_31, _a;
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
        catch (e_31_1) { e_31 = { error: e_31_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_31) throw e_31.error; }
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
        var e_32, _a;
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
            catch (e_32_1) { e_32 = { error: e_32_1 }; }
            finally {
                try {
                    if (collisions_1_1 && !collisions_1_1.done && (_a = collisions_1.return)) _a.call(collisions_1);
                }
                finally { if (e_32) throw e_32.error; }
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
    Script.prototype.update = function (world, delta) {
        if (!this.running)
            return;
        global.pushScript(this);
        this.world = world;
        this.theater = global.theater;
        this.delta = delta;
        var result = this.iterator.next();
        if (result.done) {
            this.done = true;
        }
        global.popScript();
    };
    Script.prototype.finishImmediately = function (world, maxIters) {
        if (maxIters === void 0) { maxIters = Script.FINISH_IMMEDIATELY_MAX_ITERS; }
        for (var i = 0; i < maxIters && !this.done; i++) {
            this.update(world, 0.01);
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
    ScriptManager.prototype.update = function (world, delta) {
        for (var i = this.activeScripts.length - 1; i >= 0; i--) {
            this.activeScripts[i].update(world, delta);
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
        var e_33, _a;
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
            catch (e_33_1) { e_33 = { error: e_33_1 }; }
            finally {
                try {
                    if (word_1_1 && !word_1_1.done && (_a = word_1.return)) _a.call(word_1);
                }
                finally { if (e_33) throw e_33.error; }
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
    function resolveConfig(config) {
        if (!config.parent)
            return _.clone(config);
        var result = Stage.resolveConfig(config.parent);
        for (var key in config) {
            if (key === 'parent')
                continue;
            if (!result[key]) {
                result[key] = config[key];
            }
            else if (key === 'worldObjects') {
                result[key] = A.mergeArray(config[key], result[key], function (e) { return e.name; }, function (e, into) {
                    e = WorldObject.resolveConfig(e);
                    e.parent = into;
                    return WorldObject.resolveConfig(e);
                });
            }
            else if (key === 'entryPoints') {
                result[key] = O.mergeObject(config[key], result[key]);
            }
            else if (key === 'layers') {
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
    Stage.resolveConfig = resolveConfig;
})(Stage || (Stage = {}));
var StageManager = /** @class */ (function () {
    function StageManager(theater, stages) {
        this.theater = theater;
        this.stages = stages;
        this.currentStageName = null;
        this.currentWorld = null;
        this.stageLoadQueue = null;
    }
    Object.defineProperty(StageManager.prototype, "transitioning", {
        get: function () { return !!this.transition; },
        enumerable: true,
        configurable: true
    });
    StageManager.prototype.loadStage = function (name, transitionConfig, entryPoint) {
        if (!this.stages[name]) {
            debug("Cannot load stage '" + name + "' because it does not exist:", this.stages);
            return;
        }
        if (!this.currentStageName) {
            if (transitionConfig.type !== 'instant')
                debug("Ignoring transition " + transitionConfig.type + " for stage " + name + " because no other stage is loaded");
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
        this.currentWorld.active = false;
        this.currentWorld.visible = false;
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
                        stageManager.currentWorld.active = true;
                        stageManager.currentWorld.visible = true;
                        return [2 /*return*/];
                }
            });
        });
    };
    StageManager.prototype.setStage = function (name, entryPoint) {
        var stage = Stage.resolveConfig(this.stages[name]);
        // Remove old stuff
        if (this.currentWorld) {
            World.Actions.removeWorldObjectFromWorld(this.currentWorld);
        }
        this.theater.interactionManager.reset();
        // Create new stuff
        this.currentStageName = name;
        this.currentWorld = this.newWorldFromStage(stage);
        this.addPartyToWorld(this.theater.currentWorld, name, entryPoint);
        World.Actions.setLayer(this.currentWorld, Theater.LAYER_WORLD);
        World.Actions.addWorldObjectToWorld(this.currentWorld, this.theater);
        this.theater.onStageLoad();
    };
    StageManager.prototype.addPartyToWorld = function (world, stageName, entryPoint) {
        // Resolve entry point.
        if (_.isString(entryPoint)) {
            entryPoint = Stage.getEntryPoint(this.stages[stageName], entryPoint);
        }
        this.theater.partyManager.addMembersToWorld(world, stageName, entryPoint);
    };
    StageManager.prototype.newWorldFromStage = function (stage) {
        var e_34, _a;
        var world = new World(stage);
        if (stage.worldObjects) {
            try {
                for (var _b = __values(stage.worldObjects), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var worldObjectConfig = _c.value;
                    var worldObject = WorldObject.fromConfig(worldObjectConfig);
                    World.Actions.addWorldObjectToWorld(worldObject, world);
                }
            }
            catch (e_34_1) { e_34 = { error: e_34_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_34) throw e_34.error; }
            }
        }
        return world;
    };
    return StageManager;
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
                        script.update(global.script.theater, global.script.delta);
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
        var e_35, _a;
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
        catch (e_35_1) { e_35 = { error: e_35_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_35) throw e_35.error; }
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
        var e_36, _a;
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
            }
        }
        catch (e_36_1) { e_36 = { error: e_36_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_36) throw e_36.error; }
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
        var e_37, _a, e_38, _b;
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
            catch (e_37_1) { e_37 = { error: e_37_1 }; }
            finally {
                try {
                    if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
                }
                finally { if (e_37) throw e_37.error; }
            }
        }
        if (!_.isEmpty(party.setMembersInactive)) {
            try {
                for (var _e = __values(party.setMembersInactive), _f = _e.next(); !_f.done; _f = _e.next()) {
                    var m = _f.value;
                    this.theater.partyManager.setMemberInactive(m);
                }
            }
            catch (e_38_1) { e_38 = { error: e_38_1 }; }
            finally {
                try {
                    if (_f && !_f.done && (_b = _e.return)) _b.call(_e);
                }
                finally { if (e_38) throw e_38.error; }
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
var TestParent = /** @class */ (function (_super) {
    __extends(TestParent, _super);
    function TestParent() {
        return _super.call(this, {
            x: 20, y: 20,
            texture: 'door_closed',
        }) || this;
    }
    return TestParent;
}(Sprite));
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
        _this.loadDialogBox(config.dialogBox);
        _this.partyManager = new PartyManager(_this, config.party);
        _this.storyManager = new StoryManager(_this, config.story.storyboard, config.story.storyboardPath, config.story.storyEvents, config.story.storyConfig);
        _this.stageManager = new StageManager(_this, config.stages);
        _this.interactionManager = new InteractionManager(_this);
        _this.slideManager = new SlideManager(_this);
        _this.stageManager.loadStage(config.stageToLoad, Transition.INSTANT, config.stageEntryPoint);
        if (DEBUG_SHOW_MOUSE_POSITION) {
            _this.debugMousePosition = new SpriteText({ x: 0, y: 0, font: Assets.fonts.DELUXE16 });
            World.Actions.addWorldObjectToWorld(_this.debugMousePosition, _this);
        }
        if (DEBUG_AUTOPLAY && config.autoPlayScript) {
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
        if (DEBUG_SHOW_MOUSE_POSITION) {
            this.debugMousePosition.setText(S.padLeft(this.currentWorld.getWorldMouseX().toString(), 3) + " " + S.padLeft(this.currentWorld.getWorldMouseY().toString(), 3));
        }
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
        if (entryPoint === void 0) { entryPoint = Theater.DEFAULT_ENTRY_POINT; }
        this.stageManager.loadStage(name, transition, entryPoint);
    };
    Theater.prototype.onStageLoad = function () {
        this.storyManager.onStageLoad();
    };
    Theater.prototype.loadDialogBox = function (config) {
        this.dialogBox = new DialogBox(config);
        this.dialogBox.visible = false;
        World.Actions.setLayer(this.dialogBox, Theater.LAYER_DIALOG);
        World.Actions.addWorldObjectToWorld(this.dialogBox, this);
    };
    Theater.LAYER_WORLD = 'world';
    Theater.LAYER_TRANSITION = 'transition';
    Theater.LAYER_SLIDES = 'slides';
    Theater.LAYER_DIALOG = 'dialog';
    Theater.DEFAULT_CAMERA_MODE = { type: 'focus', point: { x: Main.width / 2, y: Main.height / 2 } };
    Theater.DEFAULT_ENTRY_POINT = { x: Main.width / 2, y: Main.height / 2 };
    return Theater;
}(World));
/// <reference path="theater.ts"/>
var TestTheater = /** @class */ (function (_super) {
    __extends(TestTheater, _super);
    function TestTheater(config) {
        var _this = this;
        DEBUG_SHOW_MOUSE_POSITION = false;
        _this = _super.call(this, {
            stages: { 's': { backgroundColor: 0x000066 } },
            stageToLoad: 's',
            story: {
                storyboard: { 's': { type: 'gameplay', transitions: [] } },
                storyboardPath: ['s'],
                storyEvents: {},
                storyConfig: {
                    initialConfig: {},
                    executeFn: function (sc) { return null; },
                }
            },
            party: { leader: undefined, activeMembers: [], members: {} },
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
        }) || this;
        var sprite = new Sprite({ x: 20, y: 20, texture: 'door_closed' });
        var child = new Sprite({ x: 60, y: 60, texture: 'debug' });
        World.Actions.addChildToParent(child, sprite);
        World.Actions.addWorldObjectToWorld(sprite, _this.currentWorld);
        World.Actions.removeWorldObjectFromWorld(child);
        return _this;
    }
    TestTheater.prototype.render = function (screen) {
        _super.prototype.render.call(this, screen);
    };
    return TestTheater;
}(Theater));
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
    Timer.prototype.update = function (delta) {
        if (!this.done) {
            this.time += delta;
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
var Wall = /** @class */ (function (_super) {
    __extends(Wall, _super);
    function Wall(config) {
        return _super.call(this, config, {
            texture: 'debug',
        }) || this;
    }
    return Wall;
}(Sprite));
var ZOrderedTilemap = /** @class */ (function (_super) {
    __extends(ZOrderedTilemap, _super);
    function ZOrderedTilemap(config) {
        var _this = _super.call(this, config) || this;
        _this.zMap = config.zMap;
        return _this;
        //this.zRenderTextures = [];
    }
    ZOrderedTilemap.prototype.drawRenderTexture = function () {
        this.renderTexture.clear();
        for (var y = 0; y < this.currentTilemapLayer.length; y++) {
            for (var x = 0; x < this.currentTilemapLayer[y].length; x++) {
                this.drawTile(this.currentTilemapLayer[y][x], x, y, this.renderTexture);
            }
        }
    };
    return ZOrderedTilemap;
}(Tilemap));
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
    function colorToVec3(color) {
        var r = (color >> 16) & 255;
        var g = (color >> 8) & 255;
        var b = color & 255;
        return [r / 255, g / 255, b / 255];
    }
    M.colorToVec3 = colorToVec3;
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
    function minPowerOf2(num) {
        return Math.pow(2, Math.ceil(Math.log2(num)));
    }
    M.minPowerOf2 = minPowerOf2;
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
