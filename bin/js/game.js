var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
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
    };
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
var Vector2 = /** @class */ (function () {
    function Vector2(x, y) {
        this.x = x;
        this.y = y;
    }
    Object.defineProperty(Vector2.prototype, "angle", {
        get: function () {
            var angle = M.atan2(this.y, this.x);
            if (angle < 0) {
                angle += 360;
            }
            return angle;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Vector2.prototype, "magnitude", {
        get: function () {
            return Math.sqrt(this.x * this.x + this.y * this.y);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Vector2.prototype, "magnitudeSq", {
        get: function () {
            return this.x * this.x + this.y * this.y;
        },
        enumerable: false,
        configurable: true
    });
    Vector2.prototype.clampMagnitude = function (maxMagnitude) {
        if (maxMagnitude < 0) {
            error('Tried to clamp vector magnitude with negative maxMagnitude');
            return;
        }
        if (this.magnitude > maxMagnitude) {
            this.setMagnitude(maxMagnitude);
        }
    };
    Vector2.prototype.clone = function () {
        return new Vector2(this.x, this.y);
    };
    Vector2.prototype.isZero = function () {
        return this.x === 0 && this.y === 0;
    };
    Vector2.prototype.normalize = function () {
        var mag = this.magnitude;
        if (mag !== 0) {
            this.x /= mag;
            this.y /= mag;
        }
    };
    Vector2.prototype.normalized = function () {
        var copy = this.clone();
        copy.normalize();
        return copy;
    };
    Vector2.prototype.projectOnto = function (other) {
        var factor = G.dot(this, other) / other.magnitudeSq;
        this.x = other.x * factor;
        this.y = other.y * factor;
    };
    Vector2.prototype.projectedOnto = function (other) {
        var copy = this.clone();
        copy.projectOnto(other);
        return copy;
    };
    Vector2.prototype.rotate = function (angle) {
        var sin = M.sin(angle);
        var cos = M.cos(angle);
        var x = this.x;
        var y = this.y;
        this.x = cos * x - sin * y;
        this.y = sin * x + cos * y;
    };
    Vector2.prototype.rotated = function (angle) {
        var copy = this.clone();
        copy.rotate(angle);
        return copy;
    };
    Vector2.prototype.scale = function (amount) {
        this.x *= amount;
        this.y *= amount;
    };
    Vector2.prototype.scaled = function (amount) {
        var copy = this.clone();
        copy.scale(amount);
        return copy;
    };
    Vector2.prototype.setMagnitude = function (magnitude) {
        this.normalize();
        this.scale(magnitude);
    };
    Vector2.prototype.withMagnitude = function (magnitude) {
        var copy = this.clone();
        copy.setMagnitude(magnitude);
        return copy;
    };
    Object.defineProperty(Vector2, "UP_LEFT", {
        // Directions
        get: function () { return new Vector2(-1, -1); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Vector2, "UP", {
        get: function () { return new Vector2(0, -1); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Vector2, "UP_RIGHT", {
        get: function () { return new Vector2(1, -1); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Vector2, "LEFT", {
        get: function () { return new Vector2(-1, 0); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Vector2, "NONE", {
        get: function () { return new Vector2(0, 0); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Vector2, "RIGHT", {
        get: function () { return new Vector2(1, 0); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Vector2, "DOWN_LEFT", {
        get: function () { return new Vector2(-1, 1); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Vector2, "DOWN", {
        get: function () { return new Vector2(0, 1); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Vector2, "DOWN_RIGHT", {
        get: function () { return new Vector2(1, 1); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Vector2, "TOP_LEFT", {
        // Anchors
        get: function () { return new Vector2(0, 0); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Vector2, "TOP_CENTER", {
        get: function () { return new Vector2(0.5, 0); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Vector2, "TOP_RIGHT", {
        get: function () { return new Vector2(1, 0); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Vector2, "CENTER_LEFT", {
        get: function () { return new Vector2(0, 0.5); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Vector2, "CENTER_CENTER", {
        get: function () { return new Vector2(0.5, 0.5); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Vector2, "CENTER_RIGHT", {
        get: function () { return new Vector2(1, 0.5); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Vector2, "BOTTOM_LEFT", {
        get: function () { return new Vector2(0, 1); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Vector2, "BOTTOM_CENTER", {
        get: function () { return new Vector2(0.5, 1); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Vector2, "BOTTOM_RIGHT", {
        get: function () { return new Vector2(1, 1); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Vector2, "TOP", {
        get: function () { return new Vector2(0.5, 0); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Vector2, "CENTER", {
        get: function () { return new Vector2(0.5, 0.5); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Vector2, "BOTTOM", {
        get: function () { return new Vector2(0.5, 1); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Vector2, "ZERO", {
        // Misc
        get: function () { return new Vector2(0, 0); },
        enumerable: false,
        configurable: true
    });
    return Vector2;
}());
/// <reference path="../utils/vector.ts"/>
var Point = PIXI.Point;
var Rectangle = PIXI.Rectangle;
function vec2(x, y) {
    if (typeof (x) === 'number')
        return new Vector2(x, y);
    return new Vector2(x.x, x.y);
}
function rect(x, y, width, height) {
    return { x: x, y: y, width: width, height: height };
}
// Only meant to be populated by Preload
var AssetCache = /** @class */ (function () {
    function AssetCache() {
    }
    AssetCache.getPixiTexture = function (key) {
        if (!this.pixiTextures[key]) {
            error("Texture '" + key + "' does not exist.");
        }
        return this.pixiTextures[key];
    };
    AssetCache.getTexture = function (key) {
        if (this.isNoneTexture(key)) {
            return Texture.NONE;
        }
        if (!this.textures[key]) {
            error("Texture '" + key + "' does not exist.");
            return Texture.NONE;
        }
        return this.textures[key];
    };
    AssetCache.getSoundAsset = function (key) {
        if (!this.sounds[key]) {
            error("Sound '" + key + "' does not exist.");
            return { buffer: new AudioBuffer({ length: 0, sampleRate: 8000 }), volume: 1, speed: 1 };
        }
        return this.sounds[key];
    };
    AssetCache.getTileset = function (key) {
        if (!this.tilesets[key]) {
            error("Tileset '" + key + "' does not exist.");
        }
        return this.tilesets[key];
    };
    AssetCache.getTilemap = function (key) {
        if (!this.tilemaps[key]) {
            error("Tilemap '" + key + "' does not exist.");
        }
        return this.tilemaps[key];
    };
    AssetCache.isNoneTexture = function (key) {
        return !key || key === 'none' || key.startsWith('none_');
    };
    AssetCache.pixiTextures = {};
    AssetCache.textures = {};
    AssetCache.sounds = {};
    AssetCache.tilesets = {};
    AssetCache.tilemaps = {};
    return AssetCache;
}());
var Fullscreen = /** @class */ (function () {
    function Fullscreen() {
    }
    Object.defineProperty(Fullscreen, "supported", {
        get: function () { return document.fullscreenEnabled; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Fullscreen, "enabled", {
        get: function () { return !!document.fullscreenElement; },
        enumerable: false,
        configurable: true
    });
    Fullscreen.toggleFullscreen = function () {
        if (!this.supported)
            return;
        if (this.enabled) {
            this.stopFullscreen();
        }
        else {
            this.startFullscreen();
        }
    };
    Fullscreen.startFullscreen = function () {
        if (!this.supported || this.enabled)
            return;
        Main.renderer.view.requestFullscreen();
    };
    Fullscreen.stopFullscreen = function () {
        if (!this.supported || !this.enabled)
            return;
        document.exitFullscreen();
    };
    return Fullscreen;
}());
var Game = /** @class */ (function () {
    function Game(config) {
        this.entryPointMenuClass = config.entryPointMenuClass;
        this.pauseMenuClass = config.pauseMenuClass;
        this.theaterConfig = config.theaterConfig;
        this.soundManager = new SoundManager();
        this.menuSystem = new MenuSystem(this);
        this.loadMainMenu();
        this.overlay = new DebugOverlay();
        this.isShowingOverlay = false;
        if (Debug.SKIP_MAIN_MENU) {
            this.startGame();
        }
    }
    Object.defineProperty(Game.prototype, "volume", {
        get: function () { return Options.volume; },
        enumerable: false,
        configurable: true
    });
    ;
    Object.defineProperty(Game.prototype, "delta", {
        get: function () { return Main.delta; },
        enumerable: false,
        configurable: true
    });
    Game.prototype.update = function () {
        this.updatePause();
        this.updateMetrics();
        if (this.menuSystem.inMenu) {
            global.metrics.startSpan('menu');
            this.menuSystem.update();
            global.metrics.endSpan('menu');
        }
        else {
            global.metrics.startSpan('theater');
            this.theater.isSkippingCutscene = false; // Safeguard
            this.theater.update();
            global.metrics.endSpan('theater');
        }
        global.metrics.startSpan('debugOverlay');
        this.updateOverlay();
        global.metrics.endSpan('debugOverlay');
        global.metrics.startSpan('soundManager');
        this.soundManager.volume = this.volume;
        this.soundManager.update(this.delta);
        global.metrics.endSpan('soundManager');
    };
    Game.prototype.updatePause = function () {
        if (Input.justDown(Input.GAME_PAUSE) && !this.menuSystem.inMenu) {
            Input.consume(Input.GAME_PAUSE);
            this.pauseGame();
        }
    };
    Game.prototype.updateMetrics = function () {
        if (Debug.DEBUG && Input.justDown(Input.DEBUG_SHOW_METRICS_MENU)) {
            global.game.menuSystem.loadMenu(MetricsMenu);
        }
    };
    Game.prototype.updateOverlay = function () {
        var _a;
        if (Input.justDown(Input.DEBUG_TOGGLE_OVERLAY)) {
            this.isShowingOverlay = !this.isShowingOverlay;
        }
        if (this.isShowingOverlay && Debug.SHOW_OVERLAY) {
            this.overlay.setCurrentWorldToDebug(this.menuSystem.inMenu ? this.menuSystem.currentMenu : (_a = this.theater) === null || _a === void 0 ? void 0 : _a.currentWorld);
            this.overlay.update();
        }
    };
    Game.prototype.render = function (screen) {
        if (this.menuSystem.inMenu) {
            global.metrics.startSpan('menu');
            this.menuSystem.render(screen);
            global.metrics.endSpan('menu');
        }
        else {
            global.metrics.startSpan('theater');
            this.theater.render(screen);
            global.metrics.endSpan('theater');
        }
        if (this.isShowingOverlay && Debug.SHOW_OVERLAY) {
            global.metrics.startSpan('debugOverlay');
            this.overlay.render(screen);
            global.metrics.endSpan('debugOverlay');
        }
    };
    Game.prototype.loadMainMenu = function () {
        this.menuSystem.loadMenu(this.entryPointMenuClass);
    };
    Game.prototype.loadTheater = function () {
        this.theater = new Theater(this.theaterConfig);
    };
    Game.prototype.pauseGame = function () {
        this.menuSystem.loadMenu(this.pauseMenuClass);
    };
    Game.prototype.playSound = function (key) {
        return this.soundManager.playSound(key);
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
        A.sort(this.points, function (point) { return point; });
        for (var i = this.points.length - count; i < this.points.length; i++) {
            sum += this.points[i];
        }
        return sum / count;
    };
    Monitor.prototype.getQ = function (q) {
        var count = (q === 0) ? 1 : Math.ceil(this.points.length * q / 100);
        var sum = 0;
        A.sort(this.points, function (point) { return point; });
        for (var i = 0; i < count; i++) {
            sum += this.points[i];
        }
        return sum / count;
    };
    Monitor.prototype.isEmpty = function () {
        return _.isEmpty(this.points);
    };
    return Monitor;
}());
/// <reference path="./monitor.ts"/>
var FPSCalculator = /** @class */ (function () {
    function FPSCalculator(timePerReport) {
        this.monitor = new Monitor();
        this.timePerReport = timePerReport;
        this.fpsAvg = 0;
        this.fpsP = 0;
        this.startFrameTime = 0;
        this.totalTime = 0;
    }
    FPSCalculator.prototype.update = function () {
        var currentTime = performance.now();
        var delta = (currentTime - this.startFrameTime) / 1000;
        this.monitor.addPoint(delta);
        this.totalTime += delta;
        if (this.totalTime >= this.timePerReport) {
            this.fpsAvg = 1 / this.monitor.getAvg();
            this.fpsP = 1 / this.monitor.getP(95);
            this.monitor.clear();
            this.totalTime = 0;
        }
        this.startFrameTime = currentTime;
    };
    return FPSCalculator;
}());
var Metrics = /** @class */ (function () {
    function Metrics() {
        this.reset();
    }
    Object.defineProperty(Metrics.prototype, "isRecording", {
        get: function () { return !_.isEmpty(this.spanStack); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Metrics.prototype, "currentRecording", {
        get: function () { return this.spanStack[0]; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Metrics.prototype, "currentSpan", {
        get: function () { return _.last(this.spanStack); },
        enumerable: false,
        configurable: true
    });
    Metrics.prototype.reset = function () {
        this.recordings = [];
        this.spanStack = [];
    };
    Metrics.prototype.startRecording = function (recordingName) {
        if (this.isRecording) {
            error("Tried to start recording " + recordingName + " when recording " + this.currentRecording.name + " was already started.");
            return;
        }
        this.startSpan(recordingName, true);
    };
    Metrics.prototype.endRecording = function () {
        if (!this.isRecording) {
            error("Tried to end recording but no recording was happening.");
            return;
        }
        this.recordings.push(this.currentRecording);
        this.endSpan(this.currentRecording.name, true);
    };
    Metrics.prototype.startSpan = function (name, force) {
        if (force === void 0) { force = false; }
        if (!this.isRecording && !force)
            return;
        if (name instanceof WorldObject) {
            name = this.getWorldObjectSpanName(name);
        }
        var span = {
            name: name,
            start: this.getCurrentTimeMilliseconds(),
            end: undefined,
            time: undefined,
            metrics: {},
            subspans: [],
        };
        if (this.currentSpan) {
            this.currentSpan.subspans.push(span);
        }
        this.spanStack.push(span);
    };
    Metrics.prototype.endSpan = function (name, force) {
        if (force === void 0) { force = false; }
        if (!this.isRecording && !force)
            return;
        if (name instanceof WorldObject) {
            name = this.getWorldObjectSpanName(name);
        }
        if (!this.currentSpan) {
            error("Tried to end span " + name + " but there was no span to end! Span stack:", this.spanStack);
            return;
        }
        if (this.currentSpan.name !== name) {
            error("Tried to end span " + name + " but the current span is named " + this.currentSpan.name + "! Span stack:", this.spanStack);
            return;
        }
        this.currentSpan.end = this.getCurrentTimeMilliseconds();
        this.currentSpan.time = this.currentSpan.end - this.currentSpan.start;
        this.spanStack.pop();
    };
    Metrics.prototype.recordMetric = function (metric, value) {
        if (!this.isRecording)
            return;
        this.currentSpan.metrics[metric] = value;
    };
    Metrics.prototype.getLastRecording = function () {
        return _.last(this.recordings);
    };
    Metrics.prototype.getReportForLastRecording = function () {
        return MetricsReport.generateTimeReportForSpan(this.getLastRecording());
    };
    Metrics.prototype.plotLastRecording = function (width, height) {
        if (width === void 0) { width = global.gameWidth; }
        if (height === void 0) { height = global.gameHeight; }
        return MetricsPlot.plotRecording(this.getLastRecording(), width, height);
    };
    Metrics.prototype.getCurrentTimeMilliseconds = function () {
        return performance.now();
    };
    Metrics.prototype.getWorldObjectSpanName = function (worldObject) {
        if (worldObject.name) {
            return worldObject.name + "." + worldObject.constructor.name + "." + worldObject.uid;
        }
        return worldObject.constructor.name + "." + worldObject.uid;
    };
    return Metrics;
}());
/// <reference path="../metrics/fps.ts"/>
/// <reference path="../metrics/metrics.ts"/>
var global = /** @class */ (function () {
    function global() {
    }
    global.clearStacks = function () {
        this.scriptStack = [];
    };
    Object.defineProperty(global, "script", {
        // Update options
        get: function () { return this.scriptStack[this.scriptStack.length - 1]; },
        enumerable: false,
        configurable: true
    });
    ;
    global.pushScript = function (script) { this.scriptStack.push(script); };
    global.popScript = function () { return this.scriptStack.pop(); };
    Object.defineProperty(global, "game", {
        get: function () { return Main.game; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(global, "theater", {
        get: function () { return this.game.theater; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(global, "world", {
        get: function () { var _a; return (_a = this.theater) === null || _a === void 0 ? void 0 : _a.currentWorld; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(global, "skippingCutscene", {
        get: function () { var _a; return (_a = this.theater) === null || _a === void 0 ? void 0 : _a.isSkippingCutscene; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(global, "renderer", {
        get: function () { return Main.renderer; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(global, "soundManager", {
        get: function () { return Main.soundManager; },
        enumerable: false,
        configurable: true
    });
    global.scriptStack = [];
    global.metrics = new Metrics();
    global.fpsCalculator = new FPSCalculator(1);
    return global;
}());
var Input = /** @class */ (function () {
    function Input() {
    }
    Input.init = function () {
        var e_1, _a;
        this.keyCodesByName = O.deepClone(Options.getOption('controls'));
        this.isDownByKeyCode = {};
        this.keysByKeycode = {};
        for (var name_1 in this.keyCodesByName) {
            this.keyCodesByName[name_1].push(this.debugKeyCode(name_1));
            try {
                for (var _b = (e_1 = void 0, __values(this.keyCodesByName[name_1])), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var keyCode = _c.value;
                    this.setupKeyCode(keyCode);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_1) throw e_1.error; }
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
        var e_2, _a;
        try {
            for (var _b = __values(this.keyCodesByName[key] || []), _c = _b.next(); !_c.done; _c = _b.next()) {
                var keyCode = _c.value;
                this.keysByKeycode[keyCode].consume();
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
    Input.reset = function () {
        for (var key in this.isDownByKeyCode) {
            this.isDownByKeyCode[key] = false;
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
    Input.addControlBinding = function (controlName, keyCode) {
        var controls = Options.getOption('controls');
        var controlBindings = controls[controlName];
        if (!controlBindings) {
            error("Cannot add control binding for '" + controlName + "' since the control does not exist");
            return;
        }
        if (!_.contains(controlBindings, keyCode)) {
            controlBindings.push(keyCode);
        }
        Options.saveOptions();
        this.init();
    };
    Input.removeControlBinding = function (controlName, keyCode) {
        var controls = Options.getOption('controls');
        var controlBindings = controls[controlName];
        if (!controlBindings) {
            error("Cannot remove control binding for '" + controlName + "' since the control does not exist");
            return;
        }
        A.removeAll(controlBindings, keyCode);
        Options.saveOptions();
        this.init();
    };
    Input.updateControlBinding = function (controlName, oldKeyCode, newKeyCode) {
        var controls = Options.getOption('controls');
        var controlBindings = controls[controlName];
        if (!controlBindings) {
            error("Cannot update control binding for '" + controlName + "' since the control does not exist");
            return;
        }
        if (!_.contains(controlBindings, oldKeyCode)) {
            error("Cannot update control binding '" + oldKeyCode + "' for '" + controlName + "' since that key is not bound to that control");
            return;
        }
        for (var i = 0; i < controlBindings.length; i++) {
            if (controlBindings[i] === oldKeyCode) {
                controlBindings[i] = newKeyCode;
                break;
            }
        }
        Options.saveOptions();
        this.init();
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
        if (Fullscreen.enabled) {
            var cw = global.renderer.width / global.renderer.resolution;
            var ch = global.renderer.height / global.renderer.resolution;
            var iw = window.innerWidth;
            var ih = window.innerHeight;
            var ratioW = iw / cw;
            var ratioH = ih / ch;
            if (ratioW < ratioH) {
                var h = ch * ch * ratioW / ih;
                var y1 = (ch - h) / 2;
                this._canvasMouseY = ch * (this._canvasMouseY - y1) / h;
            }
            else if (ratioW > ratioH) {
                var w = cw * cw * ratioH / iw;
                var x1 = (cw - w) / 2;
                this._canvasMouseX = cw * (this._canvasMouseX - x1) / w;
            }
        }
        if (this.isMouseOnCanvas) {
            this._mouseX = Math.floor(this._canvasMouseX);
            this._mouseY = Math.floor(this._canvasMouseY);
        }
    };
    Input.setupKeyCode = function (keyCode) {
        this.isDownByKeyCode[keyCode] = false;
        this.keysByKeycode[keyCode] = this.keysByKeycode[keyCode] || new Input.Key();
    };
    Input.consumeEventKey = function () {
        this.eventKey = undefined;
    };
    /**
     * Used to detect keypress when updating key binds.
     */
    Input.getEventKey = function () {
        return this.eventKey;
    };
    Input.isDown = function (key) {
        var _this = this;
        if (key === Input.GAME_ADVANCE_CUTSCENE && global.skippingCutscene)
            return true;
        return this.keyCodesByName[key] && this.keyCodesByName[key].some(function (keyCode) { return _this.keysByKeycode[keyCode].isDown; });
    };
    Input.isUp = function (key) {
        var _this = this;
        return this.keyCodesByName[key] && this.keyCodesByName[key].every(function (keyCode) { return _this.keysByKeycode[keyCode].isUp; });
    };
    Input.justDown = function (key) {
        var _this = this;
        if (key === Input.GAME_ADVANCE_CUTSCENE && global.skippingCutscene)
            return true;
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
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Input, "mouseY", {
        get: function () {
            return this._mouseY;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Input, "mousePosition", {
        get: function () {
            return new Vector2(this.mouseX, this.mouseY);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Input, "canvasMouseX", {
        get: function () {
            return this._canvasMouseX;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Input, "canvasMouseY", {
        get: function () {
            return this._canvasMouseY;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Input, "canvasMousePosition", {
        get: function () {
            return new Vector2(this.canvasMouseX, this.canvasMouseY);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Input, "isMouseOnCanvas", {
        get: function () {
            return 0 <= this.canvasMouseX && this.canvasMouseX < global.gameWidth && 0 <= this.canvasMouseY && this.canvasMouseY < global.gameHeight;
        },
        enumerable: false,
        configurable: true
    });
    Input.handleKeyDownEvent = function (event) {
        var keyCode = Input.getKeyFromEventKey(event.key);
        this.eventKey = keyCode;
        if (this.isDownByKeyCode[keyCode] !== undefined) {
            this.isDownByKeyCode[keyCode] = true;
            event.preventDefault();
        }
        // Handle fullscreen toggle
        if (_.contains(this.keyCodesByName[Input.FULLSCREEN], keyCode)) {
            Fullscreen.toggleFullscreen();
        }
    };
    Input.handleKeyUpEvent = function (event) {
        var keyCode = Input.getKeyFromEventKey(event.key);
        if (this.eventKey === keyCode)
            this.eventKey = undefined;
        if (this.isDownByKeyCode[keyCode] !== undefined) {
            this.isDownByKeyCode[keyCode] = false;
            event.preventDefault();
        }
    };
    Input.handleMouseDownEvent = function (event) {
        var keyCode = this.MOUSE_KEYCODES[event.button];
        this.eventKey = keyCode;
        if (keyCode && this.isDownByKeyCode[keyCode] !== undefined) {
            if (this.isMouseOnCanvas) {
                // Prevent game-clicks outside the canvas
                this.isDownByKeyCode[keyCode] = true;
            }
            event.preventDefault();
        }
    };
    Input.handleMouseUpEvent = function (event) {
        var keyCode = this.MOUSE_KEYCODES[event.button];
        if (this.eventKey === keyCode)
            this.eventKey = undefined;
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
    Input.FULLSCREEN = 'fullscreen';
    Input.GAME_ADVANCE_CUTSCENE = 'game_advanceCutscene';
    Input.GAME_PAUSE = 'game_pause';
    Input.GAME_CLOSE_MENU = 'game_closeMenu';
    Input.GAME_SELECT = 'game_select';
    Input.DEBUG_MOVE_CAMERA_UP = 'debug_moveCameraUp';
    Input.DEBUG_MOVE_CAMERA_DOWN = 'debug_moveCameraDown';
    Input.DEBUG_MOVE_CAMERA_LEFT = 'debug_moveCameraLeft';
    Input.DEBUG_MOVE_CAMERA_RIGHT = 'debug_moveCameraRight';
    Input.DEBUG_RECORD_METRICS = 'debug_recordMetrics';
    Input.DEBUG_SHOW_METRICS_MENU = 'debug_showMetricsMenu';
    Input.DEBUG_TOGGLE_OVERLAY = 'debug_toggleOverlay';
    Input.DEBUG_FRAME_SKIP_STEP = 'debug_frameSkipStep';
    Input.DEBUG_FRAME_SKIP_RUN = 'debug_frameSkipRun';
    var Key = /** @class */ (function () {
        function Key() {
            this._isDown = false;
        }
        Object.defineProperty(Key.prototype, "isDown", {
            get: function () { return this._isDown; },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Key.prototype, "isUp", {
            get: function () { return !this._isDown; },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Key.prototype, "justDown", {
            get: function () { return this._isDown && !this._lastDown; },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Key.prototype, "justUp", {
            get: function () { return !this._isDown && this._lastDown; },
            enumerable: false,
            configurable: true
        });
        Key.prototype.update = function (isDown) {
            this._lastDown = this._isDown;
            this._isDown = isDown;
        };
        Key.prototype.consume = function () {
            this._lastDown = this._isDown;
        };
        Key.prototype.reset = function () {
            this.setUp();
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
    /**
     * Translate possible capital letters/symbols to their lowercase key form.
     */
    function getKeyFromEventKey(key) {
        if (!key)
            return key;
        if (key.length === 1 && 'A' <= key && key <= 'Z')
            return key.toLowerCase();
        if (key in CAPS_TO_KEYS)
            return CAPS_TO_KEYS[key];
        return key;
    }
    Input.getKeyFromEventKey = getKeyFromEventKey;
    var CAPS_TO_KEYS = {
        '~': '`', '!': '1', '@': '2', '#': '3', '$': '4', '%': '5', '^': '6', '&': '7', '*': '8', '(': '9', ')': '0',
        '_': '-', '+': '=', '{': '[', '}': ']', '|': '\\', ':': ';', '"': '\'', '<': ',', '>': '.', '?': '/',
    };
})(Input || (Input = {}));
function debug(message) {
    var optionalParams = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        optionalParams[_i - 1] = arguments[_i];
    }
    if (Debug.DEBUG) {
        console.log.apply(console, __spread([message], optionalParams));
    }
}
function error(message) {
    var optionalParams = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        optionalParams[_i - 1] = arguments[_i];
    }
    console.error.apply(console, __spread([message], optionalParams));
}
var SingleKeyCache = /** @class */ (function () {
    function SingleKeyCache(factory, keyToStringFn) {
        this.factory = factory;
        this.keyToStringFn = keyToStringFn;
        this.cache = {};
    }
    SingleKeyCache.prototype.borrow = function (key) {
        var factoryArgs = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            factoryArgs[_i - 1] = arguments[_i];
        }
        var keyString = this.keyToStringFn(key);
        if (_.isEmpty(this.cache[keyString])) {
            return this.factory.apply(this, __spread(factoryArgs));
        }
        return this.cache[keyString].pop();
    };
    SingleKeyCache.prototype.return = function (key, value) {
        var keyString = this.keyToStringFn(key);
        if (!(keyString in this.cache)) {
            this.cache[keyString] = [];
        }
        this.cache[keyString].push(value);
    };
    return SingleKeyCache;
}());
var Perlin = /** @class */ (function () {
    function Perlin(seed) {
        this.random = new RandomNumberGenerator(seed);
    }
    // Algorithm taken from https://adrianb.io/2014/08/09/perlinnoise.html
    Perlin.prototype.get = function (x, y, z) {
        if (y === void 0) { y = 0; }
        if (z === void 0) { z = 0; }
        var xi = Math.floor(x) & 255;
        var yi = Math.floor(y) & 255;
        var zi = Math.floor(z) & 255;
        var xf = x - Math.floor(x);
        var yf = y - Math.floor(y);
        var zf = z - Math.floor(z);
        var u = this.fade(xf);
        var v = this.fade(yf);
        var w = this.fade(zf);
        var aaa = this.hash(xi, yi, zi);
        var aba = this.hash(xi, yi + 1, zi);
        var aab = this.hash(xi, yi, zi + 1);
        var abb = this.hash(xi, yi + 1, zi + 1);
        var baa = this.hash(xi + 1, yi, zi);
        var bba = this.hash(xi + 1, yi + 1, zi);
        var bab = this.hash(xi + 1, yi, zi + 1);
        var bbb = this.hash(xi + 1, yi + 1, zi + 1);
        var x11 = M.lerp(this.grad(aaa, xf, yf, zf), this.grad(baa, xf - 1, yf, zf), u);
        var x12 = M.lerp(this.grad(aba, xf, yf - 1, zf), this.grad(bba, xf - 1, yf - 1, zf), u);
        var x21 = M.lerp(this.grad(aab, xf, yf, zf - 1), this.grad(bab, xf - 1, yf, zf - 1), u);
        var x22 = M.lerp(this.grad(abb, xf, yf - 1, zf - 1), this.grad(bbb, xf - 1, yf - 1, zf - 1), u);
        var y1 = M.lerp(x11, x12, v);
        var y2 = M.lerp(x21, x22, v);
        return (M.lerp(y1, y2, w) + 1) / 2;
    };
    Perlin.prototype.seed = function (seed) {
        this.random.seed(seed);
    };
    Perlin.prototype.fade = function (t) {
        // 6t^5 - 15t^4 + 10t^3
        return t * t * t * (t * (t * 6 - 15) + 10);
    };
    Perlin.prototype.grad = function (hash, x, y, z) {
        switch (hash & 0xF) {
            case 0x0: return x + y;
            case 0x1: return -x + y;
            case 0x2: return x - y;
            case 0x3: return -x - y;
            case 0x4: return x + z;
            case 0x5: return -x + z;
            case 0x6: return x - z;
            case 0x7: return -x - z;
            case 0x8: return y + z;
            case 0x9: return -y + z;
            case 0xA: return y - z;
            case 0xB: return -y - z;
            case 0xC: return y + x;
            case 0xD: return -y + z;
            case 0xE: return y - x;
            case 0xF: return -y - z;
            default: return 0;
        }
    };
    Perlin.prototype.hash = function (x, y, z) {
        return Perlin.PERMUTATION[Perlin.PERMUTATION[Perlin.PERMUTATION[x] + y] + z];
    };
    // Hash lookup table as defined by Ken Perlin.  This is a randomly
    // arranged array of all numbers from 0-255 inclusive.
    // TODO: get rid of the repeat
    Perlin.PERMUTATION = [151, 160, 137, 91, 90, 15,
        131, 13, 201, 95, 96, 53, 194, 233, 7, 225, 140, 36, 103, 30, 69, 142, 8, 99, 37, 240, 21, 10, 23,
        190, 6, 148, 247, 120, 234, 75, 0, 26, 197, 62, 94, 252, 219, 203, 117, 35, 11, 32, 57, 177, 33,
        88, 237, 149, 56, 87, 174, 20, 125, 136, 171, 168, 68, 175, 74, 165, 71, 134, 139, 48, 27, 166,
        77, 146, 158, 231, 83, 111, 229, 122, 60, 211, 133, 230, 220, 105, 92, 41, 55, 46, 245, 40, 244,
        102, 143, 54, 65, 25, 63, 161, 1, 216, 80, 73, 209, 76, 132, 187, 208, 89, 18, 169, 200, 196,
        135, 130, 116, 188, 159, 86, 164, 100, 109, 198, 173, 186, 3, 64, 52, 217, 226, 250, 124, 123,
        5, 202, 38, 147, 118, 126, 255, 82, 85, 212, 207, 206, 59, 227, 47, 16, 58, 17, 182, 189, 28, 42,
        223, 183, 170, 213, 119, 248, 152, 2, 44, 154, 163, 70, 221, 153, 101, 155, 167, 43, 172, 9,
        129, 22, 39, 253, 19, 98, 108, 110, 79, 113, 224, 232, 178, 185, 112, 104, 218, 246, 97, 228,
        251, 34, 242, 193, 238, 210, 144, 12, 191, 179, 162, 241, 81, 51, 145, 235, 249, 14, 239, 107,
        49, 192, 214, 31, 181, 199, 106, 157, 184, 84, 204, 176, 115, 121, 50, 45, 127, 4, 150, 254,
        138, 236, 205, 93, 222, 114, 67, 29, 24, 72, 243, 141, 128, 195, 78, 66, 215, 61, 156, 180,
        151, 160, 137, 91, 90, 15,
        131, 13, 201, 95, 96, 53, 194, 233, 7, 225, 140, 36, 103, 30, 69, 142, 8, 99, 37, 240, 21, 10, 23,
        190, 6, 148, 247, 120, 234, 75, 0, 26, 197, 62, 94, 252, 219, 203, 117, 35, 11, 32, 57, 177, 33,
        88, 237, 149, 56, 87, 174, 20, 125, 136, 171, 168, 68, 175, 74, 165, 71, 134, 139, 48, 27, 166,
        77, 146, 158, 231, 83, 111, 229, 122, 60, 211, 133, 230, 220, 105, 92, 41, 55, 46, 245, 40, 244,
        102, 143, 54, 65, 25, 63, 161, 1, 216, 80, 73, 209, 76, 132, 187, 208, 89, 18, 169, 200, 196,
        135, 130, 116, 188, 159, 86, 164, 100, 109, 198, 173, 186, 3, 64, 52, 217, 226, 250, 124, 123,
        5, 202, 38, 147, 118, 126, 255, 82, 85, 212, 207, 206, 59, 227, 47, 16, 58, 17, 182, 189, 28, 42,
        223, 183, 170, 213, 119, 248, 152, 2, 44, 154, 163, 70, 221, 153, 101, 155, 167, 43, 172, 9,
        129, 22, 39, 253, 19, 98, 108, 110, 79, 113, 224, 232, 178, 185, 112, 104, 218, 246, 97, 228,
        251, 34, 242, 193, 238, 210, 144, 12, 191, 179, 162, 241, 81, 51, 145, 235, 249, 14, 239, 107,
        49, 192, 214, 31, 181, 199, 106, 157, 184, 84, 204, 176, 115, 121, 50, 45, 127, 4, 150, 254,
        138, 236, 205, 93, 222, 114, 67, 29, 24, 72, 243, 141, 128, 195, 78, 66, 215, 61, 156, 180
    ];
    // From https://gist.github.com/patriciogonzalezvivo/670c22f3966e662d2f83
    // Normalized to (-1, 1)
    Perlin.SHADER_SOURCE = "\n        vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}\n        vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}\n        vec3 fade(vec3 t) {return t*t*t*(t*(t*6.0-15.0)+10.0);}\n\n        // Normalized to (-1, 1)\n        float cnoise(vec3 P){\n            vec3 Pi0 = floor(P); // Integer part for indexing\n            vec3 Pi1 = Pi0 + vec3(1.0); // Integer part + 1\n            Pi0 = mod(Pi0, 289.0);\n            Pi1 = mod(Pi1, 289.0);\n            vec3 Pf0 = fract(P); // Fractional part for interpolation\n            vec3 Pf1 = Pf0 - vec3(1.0); // Fractional part - 1.0\n            vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);\n            vec4 iy = vec4(Pi0.yy, Pi1.yy);\n            vec4 iz0 = Pi0.zzzz;\n            vec4 iz1 = Pi1.zzzz;\n\n            vec4 ixy = permute(permute(ix) + iy);\n            vec4 ixy0 = permute(ixy + iz0);\n            vec4 ixy1 = permute(ixy + iz1);\n\n            vec4 gx0 = ixy0 / 7.0;\n            vec4 gy0 = fract(floor(gx0) / 7.0) - 0.5;\n            gx0 = fract(gx0);\n            vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);\n            vec4 sz0 = step(gz0, vec4(0.0));\n            gx0 -= sz0 * (step(0.0, gx0) - 0.5);\n            gy0 -= sz0 * (step(0.0, gy0) - 0.5);\n\n            vec4 gx1 = ixy1 / 7.0;\n            vec4 gy1 = fract(floor(gx1) / 7.0) - 0.5;\n            gx1 = fract(gx1);\n            vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);\n            vec4 sz1 = step(gz1, vec4(0.0));\n            gx1 -= sz1 * (step(0.0, gx1) - 0.5);\n            gy1 -= sz1 * (step(0.0, gy1) - 0.5);\n\n            vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);\n            vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);\n            vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);\n            vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);\n            vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);\n            vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);\n            vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);\n            vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);\n\n            vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));\n            g000 *= norm0.x;\n            g010 *= norm0.y;\n            g100 *= norm0.z;\n            g110 *= norm0.w;\n            vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));\n            g001 *= norm1.x;\n            g011 *= norm1.y;\n            g101 *= norm1.z;\n            g111 *= norm1.w;\n\n            float n000 = dot(g000, Pf0);\n            float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));\n            float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));\n            float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));\n            float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));\n            float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));\n            float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));\n            float n111 = dot(g111, Pf1);\n\n            vec3 fade_xyz = fade(Pf0);\n            vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);\n            vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);\n            float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x);\n            return 2.2 * n_xyz;\n        }\n    ";
    return Perlin;
}());
///<reference path="../../utils/cache.ts"/>
///<reference path="../../utils/perlin.ts"/>
var TextureFilter = /** @class */ (function () {
    function TextureFilter(config) {
        var _a;
        this.code = (_a = config.code) !== null && _a !== void 0 ? _a : '';
        this.uniformCode = this.constructUniformCode(config.uniforms);
        this.uniforms = this.constructUniforms(config.uniforms);
        this.setUniform('posx', 0);
        this.setUniform('posy', 0);
        this.setUniform('dimx', 0);
        this.setUniform('dimy', 0);
        this.setUniform('t', 0);
        this.enabled = true;
        this.borrowedPixiFilter = null;
    }
    TextureFilter.prototype.borrowPixiFilter = function () {
        this.borrowedPixiFilter = TextureFilter.cache.borrow(this, this);
        for (var uniform in this.uniforms) {
            this.borrowedPixiFilter.uniforms[uniform] = this.uniforms[uniform];
        }
        return this.borrowedPixiFilter;
    };
    TextureFilter.prototype.returnPixiFilter = function () {
        if (!this.borrowedPixiFilter)
            return;
        TextureFilter.cache.return(this, this.borrowedPixiFilter);
        this.borrowedPixiFilter = null;
    };
    TextureFilter.prototype.constructPixiFilter = function () {
        return new PIXI.Filter(PIXI.Filter.defaultVertexSrc, TextureFilter.constructFragCode(this.uniformCode, this.code), {});
    };
    TextureFilter.prototype.getCacheCode = function () {
        return "TextureFilter:" + this.uniformCode + this.code;
    };
    TextureFilter.prototype.getUniform = function (uniform) {
        return this.uniforms[uniform];
    };
    TextureFilter.prototype.getUniformCode = function () {
        return this.uniformCode;
    };
    TextureFilter.prototype.setTextureDimensions = function (dimx, dimy) {
        this.uniforms['dimx'] = dimx;
        this.uniforms['dimy'] = dimy;
    };
    TextureFilter.prototype.setTexturePosition = function (posx, posy) {
        this.uniforms['posx'] = posx;
        this.uniforms['posy'] = posy;
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
    TextureFilter.prototype.update = function () {
    };
    TextureFilter.prototype.updateTime = function (delta) {
        this.setUniform('t', this.getUniform('t') + delta);
    };
    TextureFilter.prototype.constructUniformCode = function (uniformDeclarations) {
        if (_.isEmpty(uniformDeclarations))
            return '';
        var uniformCode = '';
        for (var decl in uniformDeclarations) {
            uniformCode += "uniform " + decl + ";";
        }
        return uniformCode;
    };
    TextureFilter.prototype.constructUniforms = function (uniformDeclarations) {
        if (_.isEmpty(uniformDeclarations))
            return {};
        var uniformMap = {};
        for (var decl in uniformDeclarations) {
            var uniformName = decl.trim().substring(decl.lastIndexOf(' ') + 1);
            uniformMap[uniformName] = uniformDeclarations[decl];
        }
        return uniformMap;
    };
    return TextureFilter;
}());
(function (TextureFilter) {
    TextureFilter.cache = new SingleKeyCache(function (filter) { return filter.constructPixiFilter(); }, function (filter) { return filter.getCacheCode(); });
    function constructFragCode(uniformCode, code) {
        return fragPreUniforms + uniformCode + fragStartFunc + code + fragEndFunc;
    }
    TextureFilter.constructFragCode = constructFragCode;
    var fragPreUniforms = "\n        precision highp float;\n        varying vec2 vTextureCoord;\n        uniform vec4 inputSize;\n        uniform sampler2D uSampler;\n\n        uniform float posx;\n        uniform float posy;\n        uniform float dimx;\n        uniform float dimy;\n        uniform float t;\n\n        float width;\n        float height;\n        float destWidth;\n        float destHeight;\n    ";
    var fragStartFunc = "\n        vec4 getColor(float localx, float localy) {\n            float tx = (localx + posx) / destWidth;\n            float ty = (localy + posy) / destHeight;\n            return texture2D(uSampler, vec2(tx, ty));\n        }\n\n        vec4 getDestColor(float destx, float desty) {\n            float tx = destx / destWidth;\n            float ty = desty / destHeight;\n            return texture2D(uSampler, vec2(tx, ty));\n        }\n\n        " + Perlin.SHADER_SOURCE + "\n\n        void main(void) {\n            width = dimx;\n            height = dimy;\n            destWidth = inputSize.x;\n            destHeight = inputSize.y;\n            float destx = vTextureCoord.x * destWidth;\n            float desty = vTextureCoord.y * destHeight;\n            float x = destx - posx;\n            float y = desty - posy;\n            vec4 inp = texture2D(uSampler, vTextureCoord);\n            // Un-premultiply alpha before applying the color matrix. See PIXI issue #3539.\n            if (inp.a > 0.0) {\n                inp.rgb /= inp.a;\n            }\n            vec4 outp = vec4(inp.r, inp.g, inp.b, inp.a);\n    ";
    var fragEndFunc = "\n            // Premultiply alpha again.\n            outp.rgb *= outp.a;\n            gl_FragColor = outp;\n        }\n    ";
    var _sliceFilter;
    function SLICE_FILTER(rect) {
        if (!_sliceFilter) {
            _sliceFilter = new SliceFilter(rect);
        }
        else {
            _sliceFilter.setSlice(rect);
        }
        return _sliceFilter;
    }
    TextureFilter.SLICE_FILTER = SLICE_FILTER;
})(TextureFilter || (TextureFilter = {}));
/// <reference path="./textureFilter.ts"/>
var SliceFilter = /** @class */ (function (_super) {
    __extends(SliceFilter, _super);
    function SliceFilter(rect) {
        return _super.call(this, {
            uniforms: {
                'float sliceX': rect.x,
                'float sliceY': rect.y,
                'float sliceWidth': rect.width,
                'float sliceHeight': rect.height,
            },
            code: "\n                if (x < sliceX || x >= sliceX + sliceWidth || y < sliceY || y >= sliceY + sliceHeight) {\n                    outp.a = 0.0;\n                }\n            "
        }) || this;
    }
    SliceFilter.prototype.setSlice = function (rect) {
        this.setUniforms({
            'sliceX': rect.x,
            'sliceY': rect.y,
            'sliceWidth': rect.width,
            'sliceHeight': rect.height,
        });
    };
    return SliceFilter;
}(TextureFilter));
/// <reference path="./filter/textureFilter.ts"/>
/// <reference path="./filter/slice.ts"/>
var BasicTexture = /** @class */ (function () {
    function BasicTexture(width, height, immutable) {
        if (immutable === void 0) { immutable = false; }
        this.renderTextureSprite = new Texture.PIXIRenderTextureSprite(width, height);
        this.immutable = immutable;
    }
    Object.defineProperty(BasicTexture.prototype, "width", {
        get: function () { return this.renderTextureSprite._renderTexture.width; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BasicTexture.prototype, "height", {
        get: function () { return this.renderTextureSprite._renderTexture.height; },
        enumerable: false,
        configurable: true
    });
    BasicTexture.prototype.clear = function () {
        if (this.immutable) {
            error('Cannot clear immutable texture!');
            return;
        }
        this.renderTextureSprite.clear();
    };
    BasicTexture.prototype.clone = function () {
        return this.transform();
    };
    BasicTexture.prototype.free = function () {
        this.renderTextureSprite.renderTexture.destroy(true);
    };
    BasicTexture.prototype.getLocalBounds = function (properties) {
        var _a, _b, _c;
        var scaleX = (_a = properties.scaleX) !== null && _a !== void 0 ? _a : 1;
        var scaleY = (_b = properties.scaleY) !== null && _b !== void 0 ? _b : 1;
        var angle = (_c = properties.angle) !== null && _c !== void 0 ? _c : 0;
        var width = this.width * scaleX;
        var height = this.height * scaleY;
        if (angle === 0) {
            return rect(0, 0, width, height);
        }
        var v1x = 0;
        var v1y = 0;
        var v2x = width * M.cos(angle);
        var v2y = width * M.sin(angle);
        var v3x = -height * M.sin(angle);
        var v3y = height * M.cos(angle);
        var v4x = v2x + v3x;
        var v4y = v2y + v3y;
        var minx = Math.min(v1x, v2x, v3x, v4x);
        var maxx = Math.max(v1x, v2x, v3x, v4x);
        var miny = Math.min(v1y, v2y, v3y, v4y);
        var maxy = Math.max(v1y, v2y, v3y, v4y);
        return {
            x: minx,
            y: miny,
            width: maxx - minx,
            height: maxy - miny,
        };
    };
    BasicTexture.prototype.renderTo = function (texture, properties) {
        if (!texture)
            return;
        if (texture.immutable) {
            error('Cannot render to immutable texture!');
            return;
        }
        properties = this.setRenderTextureSpriteProperties(properties);
        var allFilters = this.setRenderTextureSpriteFilters(texture, properties);
        texture.renderPIXIDisplayObject(this.renderTextureSprite);
        this.returnTextureFilters(allFilters);
    };
    BasicTexture.prototype.renderPIXIDisplayObject = function (displayObject) {
        if (this.immutable) {
            error('Cannot render to immutable texture!');
            return;
        }
        global.renderer.render(displayObject, this.renderTextureSprite.renderTexture, false);
    };
    BasicTexture.prototype.subdivide = function (h, v) {
        if (h <= 0 || v <= 0)
            return [];
        var result = [];
        var framew = Math.floor(this.width / h);
        var frameh = Math.floor(this.height / v);
        var lastframew = this.width - (h - 1) * framew;
        var lastframeh = this.height - (v - 1) * frameh;
        for (var y = 0; y < v; y++) {
            for (var x = 0; x < h; x++) {
                var tx = x * framew;
                var ty = y * frameh;
                var tw = x === h - 1 ? lastframew : framew;
                var th = y === v - 1 ? lastframeh : frameh;
                var texture = new BasicTexture(tw, th);
                this.renderTo(texture, {
                    x: -tx,
                    y: -ty,
                });
                result.push({
                    x: tx, y: ty,
                    texture: texture
                });
            }
        }
        return result;
    };
    BasicTexture.prototype.toMask = function () {
        return {
            renderTexture: this.renderTextureSprite.renderTexture,
            offsetx: 0, offsety: 0,
        };
    };
    /**
     * Returns a NEW texture which is transformed from the original.
     */
    BasicTexture.prototype.transform = function (properties) {
        if (properties === void 0) { properties = {}; }
        _.defaults(properties, {
            scaleX: 1,
            scaleY: 1,
            tint: 0xFFFFFF,
            alpha: 1,
            filters: [],
        });
        var result = new BasicTexture(this.width * Math.abs(properties.scaleX), this.height * Math.abs(properties.scaleY));
        this.renderTo(result, {
            x: this.width / 2 * (Math.abs(properties.scaleX) - properties.scaleX),
            y: this.height / 2 * (Math.abs(properties.scaleY) - properties.scaleY),
            scaleX: properties.scaleX,
            scaleY: properties.scaleY,
            tint: properties.tint,
            alpha: properties.alpha,
            filters: properties.filters,
        });
        return result;
    };
    BasicTexture.prototype.getAllTextureFilters = function (properties) {
        var _this = this;
        var allFilters = [];
        if (properties.slice) {
            var sliceFilter = TextureFilter.SLICE_FILTER(properties.slice);
            var sliceRect = this.getSliceRect(properties);
            // Subtract sliceRect.xy because slice requires the shifted xy of the texture after slice
            Texture.setFilterProperties(sliceFilter, properties.x - sliceRect.x, properties.y - sliceRect.y, sliceRect.width, sliceRect.height);
            allFilters.push(sliceFilter);
        }
        if (properties.mask && properties.mask.texture) {
            var maskFilter = Mask.SHARED(properties.mask.texture, 'global', properties.mask.x, properties.mask.y, properties.mask.invert);
            Texture.setFilterProperties(maskFilter, properties.x, properties.y, this.width, this.height);
            allFilters.push(maskFilter);
        }
        properties.filters.forEach(function (filter) { return filter && Texture.setFilterProperties(filter, properties.x, properties.y, _this.width, _this.height); });
        allFilters.push.apply(allFilters, __spread(properties.filters));
        return allFilters.filter(function (filter) { return filter && filter.enabled; });
    };
    BasicTexture.prototype.getSliceRect = function (properties) {
        var _a;
        return (_a = properties.slice) !== null && _a !== void 0 ? _a : { x: 0, y: 0, width: this.width, height: this.height };
    };
    BasicTexture.prototype.returnTextureFilters = function (allFilters) {
        allFilters.forEach(function (filter) { return filter.returnPixiFilter(); });
    };
    BasicTexture.prototype.setRenderTextureSpriteProperties = function (properties) {
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
        var sliceRect = this.getSliceRect(properties);
        // Position
        this.renderTextureSprite.x = properties.x - sliceRect.x;
        this.renderTextureSprite.y = properties.y - sliceRect.y;
        // Other values
        this.renderTextureSprite.scale.x = properties.scaleX;
        this.renderTextureSprite.scale.y = properties.scaleY;
        this.renderTextureSprite.angle = properties.angle;
        this.renderTextureSprite.tint = properties.tint;
        this.renderTextureSprite.alpha = properties.alpha;
        return properties;
    };
    BasicTexture.prototype.setRenderTextureSpriteFilters = function (destTexture, properties) {
        var allFilters = this.getAllTextureFilters(properties);
        allFilters.forEach(function (filter) { return filter.update(); });
        this.renderTextureSprite.filters = allFilters.map(function (filter) { return filter.borrowPixiFilter(); });
        this.renderTextureSprite.filterArea = new PIXI.Rectangle(0, 0, destTexture.width, destTexture.height);
        return allFilters;
    };
    return BasicTexture;
}());
/// <reference path="../texture/basicTexture.ts"/>
var Preload = /** @class */ (function () {
    function Preload() {
    }
    Preload.preload = function (options) {
        this.preloadOptions = options;
        this.resources = [];
        if (options.textures) {
            for (var key in options.textures) {
                this.preloadTexture(key, options.textures[key]);
            }
        }
        if (options.sounds) {
            for (var key in options.sounds) {
                this.preloadSound(key, options.sounds[key]);
            }
        }
        if (options.tilesets) {
            for (var key in options.tilesets) {
                this.preloadTileset(key, options.tilesets[key]);
            }
        }
        if (options.pyxelTilemaps) {
            for (var key in options.pyxelTilemaps) {
                this.preloadPyxelTilemap(key, options.pyxelTilemaps[key]);
            }
        }
        PIXI.Loader.shared.load();
    };
    Preload.load = function (options) {
        if (options.textures) {
            for (var key in options.textures) {
                this.loadTexture(key, options.textures[key]);
            }
        }
        if (options.sounds) {
            for (var key in options.sounds) {
                this.loadSound(key, options.sounds[key]);
            }
        }
        if (options.tilesets) {
            for (var key in options.tilesets) {
                this.loadTileset(key, options.tilesets[key]);
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
        var _this = this;
        var url = texture.url || "assets/" + key + ".png";
        var resource = {
            name: key,
            src: url,
            done: false
        };
        this.resources.push(resource);
        PIXI.Loader.shared.add(key + this.TEXTURE_KEY_SUFFIX, url, undefined, function () { return _this.onLoadResource(resource); });
    };
    Preload.loadTexture = function (key, texture) {
        var _a;
        var baseTexture = PIXI.utils.TextureCache[key + this.TEXTURE_KEY_SUFFIX];
        if (!baseTexture) {
            error("Failed to preload texture " + key);
            return;
        }
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
                    var frameKeyPrefix = (_a = texture.spritesheet.prefix) !== null && _a !== void 0 ? _a : key + "_";
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
            var anchor_1 = frames[frame].anchor || texture.anchor;
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
    Preload.preloadSound = function (key, sound) {
        var _this = this;
        var url = sound.url || "assets/" + key + ".wav";
        var resource = {
            name: key,
            src: url,
            done: false
        };
        this.resources.push(resource);
        WebAudio.preloadSound(key, url, function () { return _this.onLoadResource(resource); });
    };
    Preload.loadSound = function (key, sound) {
        var _a, _b;
        var preloadedSound = WebAudio.preloadedSounds[key];
        if (!preloadedSound) {
            error("Failed to preload sound " + key);
            return;
        }
        var volume = (_a = sound.volume) !== null && _a !== void 0 ? _a : 1;
        if (volume < 0 || volume > Sound.MAX_VOLUME) {
            error("Sound " + key + " has invalid volume:", sound);
            volume = M.clamp(volume, 0, Sound.MAX_VOLUME);
        }
        var speed = (_b = sound.speed) !== null && _b !== void 0 ? _b : 1;
        if (speed < 0 || speed > Sound.MAX_SPEED) {
            error("Sound " + key + " has invalid speed:", sound);
            speed = M.clamp(speed, 0, Sound.MAX_SPEED);
        }
        AssetCache.sounds[key] = {
            buffer: preloadedSound.buffer,
            volume: volume,
            speed: speed
        };
    };
    Preload.preloadTileset = function (key, tileset) {
        var _this = this;
        var url = tileset.url || "assets/" + key + ".png";
        var resource = {
            name: key,
            src: url,
            done: false
        };
        this.resources.push(resource);
        PIXI.Loader.shared.add(key + this.TILESET_KEY_SUFFIX, url, function () { return _this.onLoadResource(resource); });
    };
    Preload.loadTileset = function (key, tileset) {
        var baseTexture = PIXI.utils.TextureCache[key + this.TILESET_KEY_SUFFIX];
        if (!baseTexture) {
            error("Failed to preload tileset " + key);
            return;
        }
        var frames = {};
        var tiles = [];
        var numFramesX = Math.floor(baseTexture.width / tileset.tileWidth);
        var numFramesY = Math.floor(baseTexture.height / tileset.tileHeight);
        for (var y = 0; y < numFramesY; y++) {
            for (var x = 0; x < numFramesX; x++) {
                var frameKeyPrefix = key + "_";
                var frameKey = "" + frameKeyPrefix + (x + y * numFramesX);
                frames[frameKey] = {
                    rect: {
                        x: x * tileset.tileWidth,
                        y: y * tileset.tileHeight,
                        width: tileset.tileWidth,
                        height: tileset.tileHeight
                    },
                    anchor: Vector2.CENTER,
                };
                tiles.push(frameKey);
            }
        }
        for (var frame in frames) {
            var frameTexture = new PIXI.Texture(baseTexture);
            var rect_2 = frames[frame].rect;
            var anchor = frames[frame].anchor;
            frameTexture.frame = new Rectangle(rect_2.x, rect_2.y, rect_2.width, rect_2.height);
            frameTexture.defaultAnchor = new Point(anchor.x, anchor.y);
            AssetCache.pixiTextures[frame] = frameTexture;
            AssetCache.textures[frame] = Texture.fromPixiTexture(frameTexture);
        }
        AssetCache.tilesets[key] = {
            tileWidth: tileset.tileWidth,
            tileHeight: tileset.tileHeight,
            tiles: tiles,
            collisionIndices: tileset.collisionIndices,
        };
    };
    Preload.preloadPyxelTilemap = function (key, tilemap) {
        var _this = this;
        var url = tilemap.url || "assets/" + key + ".json";
        var resource = {
            name: key,
            src: url,
            done: false
        };
        this.resources.push(resource);
        PIXI.Loader.shared.add(key + this.TILEMAP_KEY_SUFFIX, url, function () { return _this.onLoadResource(resource); });
    };
    Preload.loadPyxelTilemap = function (key, tilemap) {
        var e_3, _a;
        var tilemapResource = PIXI.Loader.shared.resources[key + this.TILEMAP_KEY_SUFFIX];
        if (!tilemapResource || !tilemapResource.data) {
            error("Failed to preload PyxelTilemap " + key);
            return;
        }
        var tilemapJson = PIXI.Loader.shared.resources[key + this.TILEMAP_KEY_SUFFIX].data;
        var tilemapForCache = {
            layers: [],
        };
        for (var i = 0; i < tilemapJson.layers.length; i++) {
            var tilemapLayer = A.filledArray2D(tilemapJson.tileshigh, tilemapJson.tileswide);
            try {
                for (var _b = (e_3 = void 0, __values(tilemapJson.layers[i].tiles)), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var tile = _c.value;
                    tilemapLayer[tile.y][tile.x] = {
                        index: Math.max(tile.tile, -1),
                        angle: tile.rot * 90,
                        flipX: tile.flipX,
                    };
                }
            }
            catch (e_3_1) { e_3 = { error: e_3_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_3) throw e_3.error; }
            }
            tilemapForCache.layers.unshift(tilemapLayer);
        }
        AssetCache.tilemaps[key] = tilemapForCache;
    };
    Preload.onLoadResource = function (resource) {
        resource.done = true;
        if (this.preloadOptions.progressCallback) {
            this.preloadOptions.progressCallback(this.getPreloadProgress());
        }
        if (this.resources.every(function (r) { return r.done; })) {
            this.load(this.preloadOptions);
        }
    };
    Preload.getPreloadProgress = function () {
        return this.resources.filter(function (r) { return r.done; }).length / this.resources.length;
    };
    Preload.TEXTURE_KEY_SUFFIX = '_texture_';
    Preload.TILESET_KEY_SUFFIX = '_tileset_';
    Preload.TILEMAP_KEY_SUFFIX = '_tilemap_';
    return Preload;
}());
(function (Preload) {
    function allTilesWithPrefix(prefix, count) {
        if (count === void 0) { count = 1000; }
        var result = [];
        for (var i = 0; i < count; i++) {
            result.push("" + prefix + i);
        }
        return result;
    }
    Preload.allTilesWithPrefix = allTilesWithPrefix;
})(Preload || (Preload = {}));
/// <reference path="../core/preload.ts" />
var Main = /** @class */ (function () {
    function Main() {
    }
    Main.loadConfig = function (config) {
        this.config = config;
    };
    Main.start = function () {
        if (!this.config) {
            error('No main config loaded! Must load config by calling `Main.loadConfig(config);`');
            return;
        }
        this.preload();
    };
    Main.preload = function () {
        var _this = this;
        var _a, _b;
        PIXI.utils.sayHello(PIXI.utils.isWebGLSupported() ? 'WebGL' : 'Canvas');
        PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
        Debug.init(this.config.debug);
        global.gameCodeName = this.config.gameCodeName;
        global.gameWidth = this.config.gameWidth;
        global.gameHeight = this.config.gameHeight;
        global.backgroundColor = this.config.backgroundColor;
        WorldObject.DEFAULT_Z_BEHAVIOR = (_a = this.config.defaultZBehavior) !== null && _a !== void 0 ? _a : 'noop';
        SpriteText.addTags((_b = this.config.spriteTextTags) !== null && _b !== void 0 ? _b : {});
        SpriteText.DEFAULT_FONT = this.config.defaultSpriteTextFont;
        Main.renderer = PIXI.autoDetectRenderer({
            width: global.gameWidth,
            height: global.gameHeight,
            resolution: this.config.canvasScale,
            backgroundColor: global.backgroundColor,
        });
        document.body.appendChild(Main.renderer.view);
        Main.renderer.view.style.setProperty('image-rendering', 'pixelated'); // Chrome
        Main.renderer.view.style.setProperty('image-rendering', 'crisp-edges'); // Firefox
        // AccessibilityManager causes game to crash when Tab is pressed.
        // Deleting it as per https://github.com/pixijs/pixi.js/issues/5111#issuecomment-420047824
        Main.renderer.plugins.accessibility.destroy();
        delete Main.renderer.plugins.accessibility;
        Main.screen = new BasicTexture(global.gameWidth, global.gameHeight);
        this.soundManager = new GlobalSoundManager();
        WebAudio.initContext();
        Preload.preload({
            textures: this.config.textures,
            sounds: this.config.sounds,
            tilesets: this.config.tilesets,
            pyxelTilemaps: this.config.pyxelTilemaps,
            progressCallback: function (progress) { return _this.renderPreloadProgress(progress); },
            onLoad: function () {
                Main.load();
                Main.play();
            }
        });
    };
    Main.load = function () {
        Options.updateCallbacks.push(function () { return Input.init(); });
        Options.init(global.gameCodeName, this.config.defaultOptions);
        this.initEvents();
        this.metricsManager = new MetricsManager();
        this.delta = 0;
        this.game = new Game(this.config.game);
        this.game.update(); // Update game once just to make sure everything is set up correctly.
    };
    Main.play = function () {
        var _this = this;
        PIXI.Ticker.shared.add(function (frameDelta) {
            _this.metricsManager.update();
            global.metrics.startSpan('frame');
            global.fpsCalculator.update();
            Main.delta = M.clamp(frameDelta / 60, 0, 1 / _this.config.fpsLimit);
            global.clearStacks();
            global.metrics.startSpan('update');
            for (var i = 0; i < Debug.SKIP_RATE; i++) {
                Input.update();
                Debug.update();
                if (Debug.frameStepSkipFrame())
                    break;
                Main.soundManager.preGameUpdate();
                global.metrics.startSpan('game');
                Main.game.update();
                global.metrics.endSpan('game');
                Main.soundManager.postGameUpdate();
            }
            global.metrics.endSpan('update');
            global.metrics.startSpan('render');
            Main.screen.clear();
            global.metrics.startSpan('game');
            Main.game.render(Main.screen);
            global.metrics.endSpan('game');
            Main.renderScreenToCanvas();
            global.metrics.endSpan('render');
            global.metrics.endSpan('frame');
        });
    };
    Main.renderScreenToCanvas = function () {
        Main.renderer.render(Utils.NOOP_DISPLAYOBJECT, undefined, true); // Clear the renderer
        Main.renderer.render(Main.screen.renderTextureSprite);
    };
    // For use in preload.
    Main.renderPreloadProgress = function (progress) {
        Main.screen.clear();
        Draw.brush.color = this.config.preloadBackgroundColor;
        Draw.brush.alpha = 1;
        Draw.fill(Main.screen);
        var barw = global.gameWidth / 2;
        var barh = 16;
        var barx = global.gameWidth / 2 - barw / 2;
        var bary = global.gameHeight / 2 - barh / 2;
        Draw.brush.color = this.config.preloadProgressBarColor;
        Draw.brush.thickness = 1;
        Draw.rectangleSolid(Main.screen, barx, bary, barw * progress, barh);
        Draw.rectangleOutline(Main.screen, barx, bary, barw, barh, Draw.ALIGNMENT_INNER);
        Main.renderScreenToCanvas();
    };
    Main.initEvents = function () {
        window.addEventListener("keypress", function (event) {
            WebAudio.start();
        });
        window.addEventListener("keydown", function (event) {
            WebAudio.start();
            Input.handleKeyDownEvent(event);
            if (event.key === 'Tab') {
                event.preventDefault();
            }
        });
        window.addEventListener("keyup", function (event) {
            WebAudio.start();
            Input.handleKeyUpEvent(event);
        });
        window.addEventListener("mousedown", function (event) {
            WebAudio.start();
            Input.handleMouseDownEvent(event);
        });
        window.addEventListener("mouseup", function (event) {
            WebAudio.start();
            Input.handleMouseUpEvent(event);
        });
        window.addEventListener("contextmenu", function (event) {
            WebAudio.start();
            event.preventDefault();
        });
        window.addEventListener("blur", function (event) {
            Input.reset();
        });
    };
    return Main;
}());
var Options = /** @class */ (function () {
    function Options() {
    }
    Object.defineProperty(Options, "volume", {
        get: function () { return this.getOption('volume'); },
        set: function (value) { this.updateOption('volume', value); },
        enumerable: false,
        configurable: true
    });
    Options.init = function (name, defaultOptions) {
        this.optionsName = name;
        this.defaultOptions = defaultOptions;
        this.loadOptions();
        if (Debug.RESET_OPTIONS_AT_START) {
            this.resetOptions();
        }
    };
    Options.getOption = function (option) {
        return this.options[option];
    };
    Options.updateOption = function (option, value) {
        this.options[option] = value;
        this.saveOptions();
    };
    Options.resetOption = function (option) {
        this.options[option] = O.deepClone(this.defaultOptions[option]);
        this.saveOptions();
    };
    Options.resetOptions = function () {
        this.options = O.deepClone(this.defaultOptions);
        this.saveOptions();
    };
    Options.saveOptions = function () {
        LocalStorage.setJson(this.getOptionsLocalStorageName(), this.options);
        this.onUpdate();
    };
    Options.loadOptions = function () {
        this.options = LocalStorage.getJson(this.getOptionsLocalStorageName());
        if (_.isEmpty(this.options)) {
            this.resetOptions();
        }
        else {
            this.onUpdate();
        }
    };
    Options.onUpdate = function () {
        var e_4, _a;
        try {
            for (var _b = __values(this.updateCallbacks), _c = _b.next(); !_c.done; _c = _b.next()) {
                var callback = _c.value;
                callback();
            }
        }
        catch (e_4_1) { e_4 = { error: e_4_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_4) throw e_4.error; }
        }
    };
    Options.getOptionsLocalStorageName = function () {
        return this.optionsName + "_options";
    };
    Options.updateCallbacks = [];
    return Options;
}());
var CutsceneManager = /** @class */ (function () {
    function CutsceneManager(theater, storyboard) {
        this.theater = theater;
        this.storyboard = storyboard;
        this.current = null;
        this.playedCutscenes = new Set();
    }
    Object.defineProperty(CutsceneManager.prototype, "isCutscenePlaying", {
        get: function () { return !!this.current; },
        enumerable: false,
        configurable: true
    });
    CutsceneManager.prototype.update = function () {
        this.updateCurrentCutscene();
    };
    CutsceneManager.prototype.updateCurrentCutscene = function () {
        if (this.current) {
            this.current.script.update(this.theater.delta);
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
    CutsceneManager.prototype.canSkipCurrentCutscene = function () {
        return this.current && this.current.node.skippable;
    };
    CutsceneManager.prototype.fastForwardCutscene = function (name) {
        this.playCutscene(name);
        this.finishCurrentCutscene();
    };
    CutsceneManager.prototype.playCutscene = function (name) {
        var cutscene = this.getCutsceneByName(name);
        if (!cutscene)
            return;
        if (this.current) {
            error("Cannot play cutscene " + name + " because a cutscene is already playing:", this.current);
            return;
        }
        this.current = {
            name: name,
            node: cutscene,
            script: new Script(cutscene.script),
        };
        this.updateCurrentCutscene();
    };
    CutsceneManager.prototype.reset = function () {
        if (this.current) {
            this.current.script.done = true;
        }
        this.current = null;
    };
    CutsceneManager.prototype.onStageLoad = function () {
        this.finishCurrentCutscene();
    };
    CutsceneManager.prototype.finishCurrentCutscene = function () {
        if (!this.isCutscenePlaying)
            return;
        var completed = this.current;
        this.current = null;
        this.playedCutscenes.add(completed.name);
        this.theater.dialogBox.complete();
        this.theater.clearSlides();
    };
    CutsceneManager.prototype.getCutsceneByName = function (name) {
        var node = this.storyboard[name];
        if (!node) {
            error("Cannot get cutscene " + name + " because it does not exist on storyboard:", this.storyboard);
            return undefined;
        }
        if (node.type !== 'cutscene') {
            error("Tried to play node " + name + " as a cutscene when it is not one", node);
            return undefined;
        }
        return node;
    };
    return CutsceneManager;
}());
var S;
(function (S) {
    function cameraTransition(duration, toMode, toMovement, easingFunction) {
        if (easingFunction === void 0) { easingFunction = Tween.Easing.OutExp; }
        return function () {
            var camera, cameraPoint, startPoint;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        camera = global.world.camera;
                        if (!toMovement)
                            toMovement = camera.movement;
                        cameraPoint = vec2(camera.x, camera.y);
                        camera.setModeFollow(cameraPoint);
                        camera.setMovementSnap();
                        startPoint = vec2(cameraPoint.x, cameraPoint.y);
                        return [4 /*yield*/, S.doOverTime(duration, function (t) {
                                var toPoint = toMode.getTargetPt(camera);
                                cameraPoint.x = M.lerp(startPoint.x, toPoint.x, easingFunction(t));
                                cameraPoint.y = M.lerp(startPoint.y, toPoint.y, easingFunction(t));
                                camera.snapPosition();
                            })];
                    case 1:
                        _a.sent();
                        camera.setMode(toMode);
                        camera.setMovement(toMovement);
                        return [2 /*return*/];
                }
            });
        };
    }
    S.cameraTransition = cameraTransition;
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
    function dialogAdd(text) {
        return function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        global.theater.dialogBox.addToDialog(text);
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
    S.dialogAdd = dialogAdd;
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
        if (duration === void 0) { duration = 0; }
        if (tint === void 0) { tint = 0x000000; }
        return showSlide(function () {
            var slide = new Slide({ timeToLoad: duration, fadeIn: true });
            slide.setTexture(Texture.filledRect(global.gameWidth, global.gameHeight, tint));
            return slide;
        });
    }
    S.fadeOut = fadeOut;
    function jumpZ(sprite, peakDelta, time, landOnGround) {
        if (landOnGround === void 0) { landOnGround = false; }
        return function () {
            var start, groundDelta;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        start = sprite.z;
                        groundDelta = landOnGround ? start : 0;
                        return [4 /*yield*/, S.doOverTime(time, function (t) {
                                sprite.z = M.jumpParabola(start, peakDelta, groundDelta, t);
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        };
    }
    S.jumpZ = jumpZ;
    function moveTo(worldObject, x, y, maxTime) {
        if (maxTime === void 0) { maxTime = 10; }
        return S.simul(moveToX(worldObject, x, maxTime), moveToY(worldObject, y, maxTime));
    }
    S.moveTo = moveTo;
    function moveToX(worldObject, x, maxTime) {
        if (maxTime === void 0) { maxTime = 10; }
        return function () {
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
        };
    }
    S.moveToX = moveToX;
    function moveToY(worldObject, y, maxTime) {
        if (maxTime === void 0) { maxTime = 10; }
        return function () {
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
        };
    }
    S.moveToY = moveToY;
    function playAnimation(sprite, animationName, force, waitForCompletion) {
        if (force === void 0) { force = true; }
        if (waitForCompletion === void 0) { waitForCompletion = true; }
        return function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        sprite.playAnimation(animationName, force);
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
        };
    }
    S.playAnimation = playAnimation;
    function shake(intensity, time) {
        return function () {
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
        };
    }
    S.shake = shake;
    function showSlide(factory, waitForCompletion) {
        if (waitForCompletion === void 0) { waitForCompletion = true; }
        var slide;
        return function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        slide = global.theater.addSlide(factory());
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
var Debug = /** @class */ (function () {
    function Debug() {
    }
    Debug.init = function (config) {
        Debug.DEBUG = config.debug;
        Debug.DEBUG_TOGGLE_ENABLED = Debug.DEBUG;
        Debug.FONT = config.font;
        Debug.FONT_STYLE = config.fontStyle;
        Debug.ALL_PHYSICS_BOUNDS = config.allPhysicsBounds;
        Debug.MOVE_CAMERA_WITH_ARROWS = config.moveCameraWithArrows;
        Debug.SHOW_OVERLAY = Debug.DEBUG && config.showOverlay;
        Debug.OVERLAY_FEEDS = config.overlayFeeds;
        Debug.SKIP_RATE = config.skipRate;
        Debug.PROGRAMMATIC_INPUT = config.programmaticInput;
        Debug.AUTOPLAY = config.autoplay;
        Debug.SKIP_MAIN_MENU = config.skipMainMenu;
        Debug.FRAME_STEP_ENABLED = config.frameStepEnabled;
        Debug.RESET_OPTIONS_AT_START = config.resetOptionsAtStart;
        Debug.EXPERIMENTS = config.experiments;
    };
    Debug.update = function () {
        for (var experiment in Debug.EXPERIMENTS) {
            Debug.EXPERIMENTS[experiment].update(experiment);
        }
    };
    Object.defineProperty(Debug, "DEBUG", {
        get: function () { return this._DEBUG; },
        set: function (value) { this._DEBUG = value; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Debug, "ALL_PHYSICS_BOUNDS", {
        get: function () { return this.DEBUG && this._ALL_PHYSICS_BOUNDS; },
        set: function (value) { this._ALL_PHYSICS_BOUNDS = value; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Debug, "MOVE_CAMERA_WITH_ARROWS", {
        get: function () { return this.DEBUG && this._MOVE_CAMERA_WITH_ARROWS; },
        set: function (value) { this._MOVE_CAMERA_WITH_ARROWS = value; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Debug, "SKIP_RATE", {
        get: function () { return this.DEBUG ? this._SKIP_RATE : 1; },
        set: function (value) { this._SKIP_RATE = value; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Debug, "PROGRAMMATIC_INPUT", {
        get: function () { return this.DEBUG && this._PROGRAMMATIC_INPUT; },
        set: function (value) { this._PROGRAMMATIC_INPUT = value; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Debug, "AUTOPLAY", {
        get: function () { return this.DEBUG && this._AUTOPLAY; },
        set: function (value) { this._AUTOPLAY = value; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Debug, "SKIP_MAIN_MENU", {
        get: function () { return this.DEBUG && this._SKIP_MAIN_MENU; },
        set: function (value) { this._SKIP_MAIN_MENU = value; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Debug, "FRAME_STEP_ENABLED", {
        get: function () { return this.DEBUG && this._FRAME_STEP_ENABLED; },
        set: function (value) { this._FRAME_STEP_ENABLED = value; },
        enumerable: false,
        configurable: true
    });
    Debug.frameStepSkipFrame = function () {
        return this.FRAME_STEP_ENABLED && !(Input.justDown(Input.DEBUG_FRAME_SKIP_STEP) || Input.isDown(Input.DEBUG_FRAME_SKIP_RUN));
    };
    Object.defineProperty(Debug, "RESET_OPTIONS_AT_START", {
        get: function () { return this.DEBUG && this._RESET_OPTIONS_AT_START; },
        set: function (value) { this._RESET_OPTIONS_AT_START = value; },
        enumerable: false,
        configurable: true
    });
    return Debug;
}());
function get(name) {
    var worldObject = global.game.theater.currentWorld.select.name(name);
    if (worldObject)
        return worldObject;
    return undefined;
}
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
        enumerable: false,
        configurable: true
    });
    /**
     * Random angle from 0 to 360.
     */
    RandomNumberGenerator.prototype.angle = function () {
        return this.float(0, 360);
    };
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
     * Random Vector2 uniformly in a unit circle.
     * @param radius Default: 1
     */
    RandomNumberGenerator.prototype.inCircle = function (radius) {
        if (radius === void 0) { radius = 1; }
        var angle = this.float(0, 360);
        var r = radius * Math.sqrt(this.value);
        return new Vector2(r * M.cos(angle), r * M.sin(angle));
    };
    /**
     * Random Vector2 uniformly in a disc.
     */
    RandomNumberGenerator.prototype.inDisc = function (radiusSmall, radiusLarge) {
        var angle = this.float(0, 360);
        var r = radiusLarge * Math.sqrt(this.float(radiusSmall / radiusLarge, 1));
        return new Vector2(r * M.cos(angle), r * M.sin(angle));
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
     * Random Vector2 on a unit circle.
     * @param radius Default: 1
     */
    RandomNumberGenerator.prototype.onCircle = function (radius) {
        if (radius === void 0) { radius = 1; }
        var angle = this.float(0, 360);
        return new Vector2(radius * M.cos(angle), radius * M.sin(angle));
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
        // seeded random generator from seedrandom.min.js
        // @ts-ignore
        this.generate = new Math.seedrandom(seed);
    };
    return RandomNumberGenerator;
}());
var Random = new RandomNumberGenerator();
/// <reference path="random.ts" />
var UIDGenerator = /** @class */ (function () {
    function UIDGenerator() {
        this.rng = new RandomNumberGenerator();
        this.tick = 0;
    }
    UIDGenerator.prototype.generate = function () {
        this.rng.seed(this.tick);
        this.tick++;
        return this.generateUid();
    };
    UIDGenerator.prototype.generateUid = function () {
        var result = '';
        for (var i = 0; i < UIDGenerator.UID_LENGTH; i++) {
            result += this.rng.element(UIDGenerator.VALID_CHARS);
        }
        return result;
    };
    UIDGenerator.UID_LENGTH = 8;
    UIDGenerator.VALID_CHARS = [
        'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J',
        'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T',
        'U', 'V', 'W', 'X', 'Y', 'Z', 'a', 'b', 'c', 'd',
        'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n',
        'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x',
        'y', 'z', '0', '1', '2', '3', '4', '5', '6', '7',
        '8', '9'
    ];
    return UIDGenerator;
}());
/// <reference path="../utils/uid.ts" />
var WorldObject = /** @class */ (function () {
    function WorldObject(config) {
        var _this = this;
        if (config === void 0) { config = {}; }
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
        this.localx = (_a = config.x) !== null && _a !== void 0 ? _a : 0;
        this.localy = (_b = config.y) !== null && _b !== void 0 ? _b : 0;
        this.localz = (_c = config.z) !== null && _c !== void 0 ? _c : 0;
        this.activeOutsideWorldBoundsBuffer = (_d = config.activeOutsideWorldBoundsBuffer) !== null && _d !== void 0 ? _d : Infinity;
        this.life = new Timer((_e = config.life) !== null && _e !== void 0 ? _e : Infinity, function () { return _this.kill(); });
        this.zBehavior = (_f = config.zBehavior) !== null && _f !== void 0 ? _f : WorldObject.DEFAULT_Z_BEHAVIOR;
        this.timeScale = (_g = config.timeScale) !== null && _g !== void 0 ? _g : 1;
        this.data = config.data ? O.deepClone(config.data) : {};
        this.setVisible((_h = config.visible) !== null && _h !== void 0 ? _h : true);
        this.setActive((_j = config.active) !== null && _j !== void 0 ? _j : true);
        this.ignoreCamera = (_k = config.ignoreCamera) !== null && _k !== void 0 ? _k : false;
        this.matchParentLayer = (_l = config.matchParentLayer) !== null && _l !== void 0 ? _l : false;
        this.matchParentPhysicsGroup = (_m = config.matchParentPhysicsGroup) !== null && _m !== void 0 ? _m : false;
        this.alive = true;
        this.name = config.name;
        this.tags = config.tags ? A.clone(config.tags) : [];
        this.lastx = this.x;
        this.lasty = this.y;
        this.lastz = this.z;
        this._isInsideWorldBoundsBufferThisFrame = false;
        this.controller = new Controller();
        this.behavior = new NullBehavior();
        this.modules = [];
        this.uid = WorldObject.UID.generate();
        this._world = null;
        this._children = [];
        this._parent = null;
        this.internalSetLayerWorldObject(config.layer);
        this.internalSetPhysicsGroupWorldObject(config.physicsGroup);
        this.scriptManager = new ScriptManager();
        this.stateMachine = new StateMachine();
        this.onAddCallback = config.onAdd;
        this.onRemoveCallback = config.onRemove;
        this.updateCallback = config.update;
        this.renderCallback = config.render;
        this.debugFollowMouse = false;
    }
    Object.defineProperty(WorldObject.prototype, "x", {
        get: function () { return this.localx + (this.parent ? this.parent.x : 0); },
        set: function (value) { this.localx = value - (this.parent ? this.parent.x : 0); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(WorldObject.prototype, "y", {
        get: function () { return this.localy + (this.parent ? this.parent.y : 0); },
        set: function (value) { this.localy = value - (this.parent ? this.parent.y : 0); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(WorldObject.prototype, "z", {
        get: function () { return this.localz + (this.parent ? this.parent.z : 0); },
        set: function (value) { this.localz = value - (this.parent ? this.parent.z : 0); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(WorldObject.prototype, "world", {
        get: function () { return this._world; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(WorldObject.prototype, "layer", {
        get: function () {
            this.resolveLayer();
            return this._layer;
        },
        set: function (value) { World.Actions.setLayer(this, value); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(WorldObject.prototype, "physicsGroup", {
        get: function () {
            this.resolvePhysicsGroup();
            return this._physicsGroup;
        },
        set: function (value) { World.Actions.setPhysicsGroup(this, value); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(WorldObject.prototype, "children", {
        get: function () { return this._children; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(WorldObject.prototype, "parent", {
        get: function () { return this._parent; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(WorldObject.prototype, "delta", {
        //
        get: function () { return (this.world ? this.world.delta : global.game.delta) * this.timeScale; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(WorldObject.prototype, "state", {
        get: function () { return this.stateMachine.getCurrentStateName(); },
        enumerable: false,
        configurable: true
    });
    WorldObject.prototype.onAdd = function () {
        if (this.onAddCallback)
            this.onAddCallback();
    };
    WorldObject.prototype.onRemove = function () {
        if (this.onRemoveCallback)
            this.onRemoveCallback();
    };
    WorldObject.prototype.preUpdate = function () {
        this.lastx = this.x;
        this.lasty = this.y;
        this.lastz = this.z;
        this.behavior.update(this.delta);
        this.updateController();
    };
    WorldObject.prototype.update = function () {
        var e_5, _a;
        this.scriptManager.update(this.delta);
        this.stateMachine.update(this.delta);
        if (this.debugFollowMouse) {
            this.x = this.world.getWorldMouseX();
            this.y = this.world.getWorldMouseY();
        }
        if (this.updateCallback)
            this.updateCallback();
        try {
            for (var _b = __values(this.modules), _c = _b.next(); !_c.done; _c = _b.next()) {
                var module = _c.value;
                module.update();
            }
        }
        catch (e_5_1) { e_5 = { error: e_5_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_5) throw e_5.error; }
        }
        this.life.update(this.delta);
        if (this.parent && this.ignoreCamera) {
            debug("Warning: ignoreCamera is set to true on a child object. This will be ignored!");
        }
    };
    WorldObject.prototype.postUpdate = function () {
        this.controller.reset();
        this.resolveLayer();
        this.resolvePhysicsGroup();
    };
    WorldObject.prototype.fullUpdate = function () {
        this.preUpdate();
        this.update();
        this.postUpdate();
    };
    Object.defineProperty(WorldObject.prototype, "renderScreenX", {
        get: function () {
            var result;
            if (this.parent) {
                result = this.parent.renderScreenX;
            }
            else {
                result = this.shouldIgnoreCamera() ? 0 : -Math.round(this.world.camera.worldOffsetX);
            }
            result += Math.round(this.localx);
            return result;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(WorldObject.prototype, "renderScreenY", {
        get: function () {
            var result;
            if (this.parent) {
                result = this.parent.renderScreenY;
            }
            else {
                result = this.shouldIgnoreCamera() ? 0 : -Math.round(this.world.camera.worldOffsetY);
            }
            result += Math.round(this.localy);
            if (this.zBehavior === 'threequarters') {
                var parentz = this.parent ? this.parent.z : 0;
                result += parentz - this.z;
            }
            return result;
        },
        enumerable: false,
        configurable: true
    });
    WorldObject.prototype.render = function (texture, x, y) {
        var e_6, _a;
        if (this.renderCallback)
            this.renderCallback(texture, x, y);
        try {
            for (var _b = __values(this.modules), _c = _b.next(); !_c.done; _c = _b.next()) {
                var module = _c.value;
                module.render(texture, x, y);
            }
        }
        catch (e_6_1) { e_6 = { error: e_6_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_6) throw e_6.error; }
        }
    };
    WorldObject.prototype.addChild = function (child) {
        return World.Actions.addChildToParent(child, this);
    };
    WorldObject.prototype.addChildKeepWorldPosition = function (child) {
        var x = child.x;
        var y = child.y;
        var z = child.z;
        var result = this.addChild(child);
        child.x = x;
        child.y = y;
        child.z = z;
        return result;
    };
    WorldObject.prototype.addChildren = function (children) {
        return World.Actions.addChildrenToParent(children, this);
    };
    WorldObject.prototype.addModule = function (module) {
        this.modules.push(module);
        module.init(this);
    };
    WorldObject.prototype.addTag = function (tag) {
        if (!_.contains(this.tags, tag)) {
            this.tags.push(tag);
        }
    };
    WorldObject.prototype.getChildByIndex = function (index) {
        if (this.children.length < index) {
            error("Parent has no child at index " + index + ":", this);
            return undefined;
        }
        return this.children[index];
    };
    WorldObject.prototype.getChildByName = function (name) {
        var e_7, _a;
        try {
            for (var _b = __values(this.children), _c = _b.next(); !_c.done; _c = _b.next()) {
                var child = _c.value;
                if (child.name === name)
                    return child;
            }
        }
        catch (e_7_1) { e_7 = { error: e_7_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_7) throw e_7.error; }
        }
        error("Cannot find child named " + name + " on parent:", this);
        return undefined;
    };
    WorldObject.prototype.getModule = function (type) {
        var e_8, _a;
        try {
            for (var _b = __values(this.modules), _c = _b.next(); !_c.done; _c = _b.next()) {
                var module = _c.value;
                if (module instanceof type)
                    return module;
            }
        }
        catch (e_8_1) { e_8 = { error: e_8_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_8) throw e_8.error; }
        }
        return undefined;
    };
    WorldObject.prototype.getVisibleScreenBounds = function () {
        return undefined;
    };
    WorldObject.prototype.hasTag = function (tag) {
        return _.contains(this.tags, tag);
    };
    WorldObject.prototype.isActive = function () {
        return this._active && (!this.parent || this.parent.isActive());
    };
    WorldObject.prototype.isControlRevoked = function () {
        var _a;
        return (_a = global.theater) === null || _a === void 0 ? void 0 : _a.isCutscenePlaying;
    };
    WorldObject.prototype.isOnScreen = function (buffer) {
        if (buffer === void 0) { buffer = 0; }
        var bounds = this.getVisibleScreenBounds();
        if (!bounds)
            return true;
        return bounds.x + bounds.width >= -buffer
            && bounds.x <= this.world.width + buffer
            && bounds.y + bounds.height >= -buffer
            && bounds.y <= this.world.height + buffer;
    };
    WorldObject.prototype.isVisible = function () {
        return this._visible && (!this.parent || this.parent.isVisible());
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
                return undefined;
        }
        if (child.parent !== this) {
            error("Cannot remove child " + child.name + " from parent " + this.name + ", but no such relationship exists");
            return undefined;
        }
        return World.Actions.removeChildFromParent(child);
    };
    WorldObject.prototype.removeChildKeepWorldPosition = function (child) {
        var x = child.x;
        var y = child.y;
        var z = child.z;
        var result = this.removeChild(child);
        child.x = x;
        child.y = y;
        child.z = z;
        return result;
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
    WorldObject.prototype.removeTag = function (tag) {
        A.removeAll(this.tags, tag);
    };
    WorldObject.prototype.runScript = function (script) {
        return this.scriptManager.runScript(script);
    };
    WorldObject.prototype.setActive = function (active) {
        this._active = active;
    };
    WorldObject.prototype.setIsInsideWorldBoundsBufferThisFrame = function () {
        this._isInsideWorldBoundsBufferThisFrame = isFinite(this.activeOutsideWorldBoundsBuffer)
            ? this.isOnScreen(this.activeOutsideWorldBoundsBuffer)
            : true;
    };
    WorldObject.prototype.setState = function (state) {
        this.stateMachine.setState(state);
    };
    WorldObject.prototype.setVisible = function (visible) {
        this._visible = visible;
    };
    WorldObject.prototype.shouldIgnoreCamera = function () {
        if (this.ignoreCamera)
            return true;
        if (this.parent)
            return this.parent.shouldIgnoreCamera();
        return false;
    };
    WorldObject.prototype.resolveLayer = function () {
        if (this.matchParentLayer && this.parent && this._layer !== this.parent.layer) {
            this.layer = this.parent.layer;
        }
    };
    WorldObject.prototype.resolvePhysicsGroup = function () {
        if (this.matchParentPhysicsGroup && this.parent && this._physicsGroup !== this.parent.physicsGroup) {
            this.physicsGroup = this.parent.physicsGroup;
        }
    };
    WorldObject.prototype.updateController = function () {
        if (this.isControlRevoked())
            return;
        this.controller.updateFromBehavior(this.behavior);
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
    WorldObject.DEFAULT_Z_BEHAVIOR = 'noop';
    return WorldObject;
}());
(function (WorldObject) {
    WorldObject.UID = new UIDGenerator();
})(WorldObject || (WorldObject = {}));
/// <reference path="./worldObject.ts" />
var PhysicsWorldObject = /** @class */ (function (_super) {
    __extends(PhysicsWorldObject, _super);
    function PhysicsWorldObject(config) {
        if (config === void 0) { config = {}; }
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
        var _this = _super.call(this, config) || this;
        _this._v = config.v ? vec2(config.v.x, config.v.y) : vec2((_a = config.vx) !== null && _a !== void 0 ? _a : 0, (_b = config.vy) !== null && _b !== void 0 ? _b : 0);
        _this.vz = (_c = config.vz) !== null && _c !== void 0 ? _c : 0;
        _this.mass = (_d = config.mass) !== null && _d !== void 0 ? _d : 1;
        _this._gravity = vec2((_e = config.gravityx) !== null && _e !== void 0 ? _e : 0, (_f = config.gravityy) !== null && _f !== void 0 ? _f : 0);
        _this.gravityz = (_g = config.gravityz) !== null && _g !== void 0 ? _g : 0;
        _this.affectedByGravity = (_h = config.affectedByGravity) !== null && _h !== void 0 ? _h : true;
        _this.bounce = (_j = config.bounce) !== null && _j !== void 0 ? _j : 1;
        _this.bounds = (_k = config.bounds) !== null && _k !== void 0 ? _k : new NullBounds();
        _this._immovable = (_l = config.immovable) !== null && _l !== void 0 ? _l : false;
        _this.colliding = (_m = config.colliding) !== null && _m !== void 0 ? _m : true;
        _this.simulating = (_o = config.simulating) !== null && _o !== void 0 ? _o : true;
        _this.physicslastx = _this.x;
        _this.physicslasty = _this.y;
        _this.debugDrawBounds = false;
        return _this;
    }
    Object.defineProperty(PhysicsWorldObject.prototype, "v", {
        get: function () { return this._v; },
        set: function (value) {
            this._v.x = value.x;
            this._v.y = value.y;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PhysicsWorldObject.prototype, "gravity", {
        get: function () { return this._gravity; },
        set: function (value) {
            this._gravity.x = value.x;
            this._gravity.y = value.y;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PhysicsWorldObject.prototype, "bounds", {
        get: function () { return this._bounds; },
        set: function (value) {
            this._bounds = value;
            this._bounds.parent = this;
        },
        enumerable: false,
        configurable: true
    });
    PhysicsWorldObject.prototype.preUpdate = function () {
        _super.prototype.preUpdate.call(this);
        this.physicslastx = this.x;
        this.physicslasty = this.y;
    };
    PhysicsWorldObject.prototype.update = function () {
        _super.prototype.update.call(this);
        if (this.simulating) {
            this.simulate();
        }
    };
    PhysicsWorldObject.prototype.postUpdate = function () {
        _super.prototype.postUpdate.call(this);
        if (!isFinite(this.v.x) || !isFinite(this.v.y)) {
            error("Non-finite velocity " + this.v + " on object", this);
            if (!isFinite(this.v.x))
                this.v.x = 0;
            if (!isFinite(this.v.y))
                this.v.y = 0;
        }
    };
    PhysicsWorldObject.prototype.render = function (texture, x, y) {
        if (Debug.ALL_PHYSICS_BOUNDS || this.debugDrawBounds) {
            var zoffset = 0; // offset to cancel out the z-factor when drawing bounds
            if (this.zBehavior === 'threequarters') {
                var parentz = this.parent ? this.parent.z : 0;
                zoffset = parentz - this.z;
            }
            this.drawBounds(texture, x, y - zoffset);
        }
        _super.prototype.render.call(this, texture, x, y);
    };
    PhysicsWorldObject.prototype.getSpeed = function () {
        return this.v.magnitude;
    };
    PhysicsWorldObject.prototype.getWorldBounds = function (newX, newY) {
        if (newX === void 0) { newX = this.x; }
        if (newY === void 0) { newY = this.y; }
        return this.bounds.getBoundingBox(newX, newY);
    };
    PhysicsWorldObject.prototype.isCollidingWith = function (other) {
        return this.isOverlapping(other.bounds);
    };
    PhysicsWorldObject.prototype.isImmovable = function () {
        return this._immovable || (this.world && this.world.getPhysicsGroupByName(this.physicsGroup).immovable);
    };
    PhysicsWorldObject.prototype.isOverlapping = function (bounds) {
        return this.bounds.isOverlapping(bounds);
    };
    PhysicsWorldObject.prototype.onCollide = function (collision) {
    };
    PhysicsWorldObject.prototype.setImmovable = function (immovable) {
        this._immovable = immovable;
    };
    PhysicsWorldObject.prototype.setSpeed = function (speed) {
        this.v.setMagnitude(speed);
    };
    PhysicsWorldObject.prototype.teleport = function (x, y) {
        this.x = x;
        this.y = y;
        this.physicslastx = x;
        this.physicslasty = y;
    };
    PhysicsWorldObject.prototype.applyGravity = function () {
        this.v.x += this.gravity.x * this.delta;
        this.v.y += this.gravity.y * this.delta;
        this.vz += this.gravityz * this.delta;
    };
    PhysicsWorldObject.prototype.move = function () {
        this.x += this.v.x * this.delta;
        this.y += this.v.y * this.delta;
        this.z += this.vz * this.delta;
    };
    PhysicsWorldObject.prototype.simulate = function () {
        if (this.affectedByGravity)
            this.applyGravity();
        this.move();
    };
    PhysicsWorldObject.prototype.drawBounds = function (texture, x, y) {
        Draw.brush.color = 0x00FF00;
        Draw.brush.alpha = 1;
        if (this.bounds instanceof RectBounds || this.bounds instanceof InvertedRectBounds) {
            var box = this.bounds.getBoundingBox();
            box.x += x - this.x;
            box.y += y - this.y;
            Draw.rectangleOutline(texture, box.x, box.y, box.width, box.height);
        }
        else if (this.bounds instanceof CircleBounds) {
            var center = this.bounds.getCenter();
            center.x += x - this.x;
            center.y += y - this.y;
            Draw.circleOutline(texture, center.x, center.y, this.bounds.radius);
        }
        else if (this.bounds instanceof SlopeBounds) {
            var box = this.bounds.getBoundingBox();
            box.x += x - this.x;
            box.y += y - this.y;
            if (this.bounds.direction === 'upleft') {
                Draw.line(texture, box.left, box.bottom, box.right, box.bottom);
                Draw.line(texture, box.right, box.bottom, box.right, box.top);
                Draw.line(texture, box.right, box.top, box.left, box.bottom);
            }
            else if (this.bounds.direction === 'upright') {
                Draw.line(texture, box.left, box.bottom, box.right, box.bottom);
                Draw.line(texture, box.left, box.bottom, box.left, box.top);
                Draw.line(texture, box.left, box.top, box.right, box.bottom);
            }
            else if (this.bounds.direction === 'downright') {
                Draw.line(texture, box.left, box.bottom, box.left, box.top);
                Draw.line(texture, box.left, box.top, box.right, box.top);
                Draw.line(texture, box.right, box.top, box.left, box.bottom);
            }
            else {
                Draw.line(texture, box.left, box.top, box.right, box.top);
                Draw.line(texture, box.right, box.top, box.right, box.bottom);
                Draw.line(texture, box.right, box.bottom, box.left, box.top);
            }
        }
    };
    return PhysicsWorldObject;
}(WorldObject));
/// <reference path="../physicsWorldObject.ts" />
var Sprite = /** @class */ (function (_super) {
    __extends(Sprite, _super);
    function Sprite(config) {
        var e_9, _a;
        if (config === void 0) { config = {}; }
        var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
        var _this = _super.call(this, config) || this;
        _this.setTexture(config.texture);
        _this.animationManager = new AnimationManager(_this);
        try {
            for (var _m = __values(config.animations || []), _o = _m.next(); !_o.done; _o = _m.next()) {
                var animation = _o.value;
                _this.addAnimation(animation);
            }
        }
        catch (e_9_1) { e_9 = { error: e_9_1 }; }
        finally {
            try {
                if (_o && !_o.done && (_a = _m.return)) _a.call(_m);
            }
            finally { if (e_9) throw e_9.error; }
        }
        if (config.defaultAnimation)
            _this.playAnimation(config.defaultAnimation);
        _this.flipX = (_b = config.flipX) !== null && _b !== void 0 ? _b : false;
        _this.flipY = (_c = config.flipY) !== null && _c !== void 0 ? _c : false;
        _this.offsetX = (_d = config.offsetX) !== null && _d !== void 0 ? _d : 0;
        _this.offsetY = (_e = config.offsetY) !== null && _e !== void 0 ? _e : 0;
        _this.angle = (_f = config.angle) !== null && _f !== void 0 ? _f : 0;
        _this.vangle = (_g = config.vangle) !== null && _g !== void 0 ? _g : 0;
        _this.scaleX = (_h = config.scaleX) !== null && _h !== void 0 ? _h : 1;
        _this.scaleY = (_j = config.scaleY) !== null && _j !== void 0 ? _j : 1;
        _this.tint = (_k = config.tint) !== null && _k !== void 0 ? _k : 0xFFFFFF;
        _this.alpha = (_l = config.alpha) !== null && _l !== void 0 ? _l : 1;
        _this.effects = new Effects();
        _this.effects.updateFromConfig(config.effects);
        _this.mask = config.mask;
        _this.onScreenPadding = 1;
        return _this;
    }
    Sprite.prototype.update = function () {
        _super.prototype.update.call(this);
        this.animationManager.update(this.delta);
        this.effects.updateEffects(this.delta);
        this.angle += this.vangle * this.delta;
    };
    Sprite.prototype.render = function (texture, x, y) {
        this.texture.renderTo(texture, {
            x: x + this.offsetX,
            y: y + this.offsetY,
            scaleX: (this.flipX ? -1 : 1) * this.scaleX,
            scaleY: (this.flipY ? -1 : 1) * this.scaleY,
            angle: this.angle,
            tint: this.tint,
            alpha: this.alpha,
            filters: this.effects.getFilterList(),
            mask: Mask.getTextureMaskForWorldObject(this.mask, this),
        });
        _super.prototype.render.call(this, texture, x, y);
    };
    Sprite.prototype.addAnimation = function (animation) {
        this.animationManager.addAnimation(animation.name, animation.frames);
    };
    Sprite.prototype.getCurrentAnimationName = function () {
        return this.animationManager.getCurrentAnimationName();
    };
    Sprite.prototype.getTexture = function () {
        return this.texture;
    };
    Sprite.prototype.getTextureWorldBounds = function () {
        var bounds = this.getTextureLocalBounds();
        bounds.x += this.x + this.offsetX;
        bounds.y += this.y + this.offsetY;
        return bounds;
    };
    Sprite.prototype.getVisibleScreenBounds = function () {
        var bounds = this.getTextureLocalBounds();
        bounds.x += this.renderScreenX + this.offsetX - this.onScreenPadding;
        bounds.y += this.renderScreenY + this.offsetY - this.onScreenPadding;
        bounds.width += 2 * this.onScreenPadding;
        bounds.height += 2 * this.onScreenPadding;
        return bounds;
    };
    Sprite.prototype.playAnimation = function (name, force) {
        if (force === void 0) { force = false; }
        this.animationManager.playAnimation(name, force);
    };
    Sprite.prototype.setTexture = function (key) {
        if (!key) {
            this.texture = Texture.NONE;
            return;
        }
        if (_.isString(key))
            key = AssetCache.getTexture(key);
        this.texture = key;
    };
    Sprite.prototype.getTextureLocalBounds = function () {
        if (!this.texture)
            return rect(0, 0, 0, 0);
        return this.texture.getLocalBounds({
            angle: this.angle,
            scaleX: this.scaleX,
            scaleY: this.scaleY,
        });
    };
    return Sprite;
}(PhysicsWorldObject));
/// <reference path="../worldObject/sprite/sprite.ts" />
/// <reference path="../worldObject/worldObject.ts" />
var World = /** @class */ (function () {
    function World(config) {
        if (config === void 0) { config = {}; }
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
        this.scriptManager = new ScriptManager();
        this.soundManager = new SoundManager();
        this.select = new WorldSelecter(this);
        this.volume = (_a = config.volume) !== null && _a !== void 0 ? _a : 1;
        this.globalSoundHumanizePercent = (_b = config.globalSoundHumanizePercent) !== null && _b !== void 0 ? _b : 0;
        this.width = (_c = config.width) !== null && _c !== void 0 ? _c : global.gameWidth;
        this.height = (_d = config.height) !== null && _d !== void 0 ? _d : global.gameHeight;
        this.time = 0;
        this.physicsGroups = this.createPhysicsGroups(config.physicsGroups);
        this.collisions = (_e = config.collisions) !== null && _e !== void 0 ? _e : [];
        this.collisionIterations = (_f = config.collisionIterations) !== null && _f !== void 0 ? _f : 1;
        this.useRaycastDisplacementThreshold = (_g = config.useRaycastDisplacementThreshold) !== null && _g !== void 0 ? _g : 1;
        this.maxDistancePerCollisionStep = (_h = config.maxDistancePerCollisionStep) !== null && _h !== void 0 ? _h : Infinity;
        this.worldObjects = [];
        this.layers = this.createLayers(config.layers);
        this.backgroundColor = (_j = config.backgroundColor) !== null && _j !== void 0 ? _j : global.backgroundColor;
        this.backgroundAlpha = (_k = config.backgroundAlpha) !== null && _k !== void 0 ? _k : 1;
        this.layerTexture = new BasicTexture(this.width, this.height);
        this.entryPoints = {};
        for (var key in (_l = config.entryPoints) !== null && _l !== void 0 ? _l : {}) {
            this.entryPoints[key] = vec2(config.entryPoints[key]);
        }
        this.camera = new Camera((_m = config.camera) !== null && _m !== void 0 ? _m : {}, this);
    }
    Object.defineProperty(World.prototype, "delta", {
        get: function () {
            if (global.skippingCutscene)
                return Theater.SKIP_CUTSCENE_DELTA;
            return global.game.delta;
        },
        enumerable: false,
        configurable: true
    });
    World.prototype.update = function () {
        var e_10, _a, e_11, _b, e_12, _c;
        this.updateScriptManager();
        global.metrics.startSpan('preUpdate');
        try {
            for (var _d = __values(this.worldObjects), _e = _d.next(); !_e.done; _e = _d.next()) {
                var worldObject = _e.value;
                worldObject.setIsInsideWorldBoundsBufferThisFrame();
                if (worldObject.isActive() && worldObject._isInsideWorldBoundsBufferThisFrame) {
                    global.metrics.startSpan(worldObject);
                    worldObject.preUpdate();
                    global.metrics.endSpan(worldObject);
                }
            }
        }
        catch (e_10_1) { e_10 = { error: e_10_1 }; }
        finally {
            try {
                if (_e && !_e.done && (_a = _d.return)) _a.call(_d);
            }
            finally { if (e_10) throw e_10.error; }
        }
        global.metrics.endSpan('preUpdate');
        global.metrics.startSpan('update');
        try {
            for (var _f = __values(this.worldObjects), _g = _f.next(); !_g.done; _g = _f.next()) {
                var worldObject = _g.value;
                if (worldObject.isActive() && worldObject._isInsideWorldBoundsBufferThisFrame) {
                    global.metrics.startSpan(worldObject);
                    worldObject.update();
                    global.metrics.endSpan(worldObject);
                }
            }
        }
        catch (e_11_1) { e_11 = { error: e_11_1 }; }
        finally {
            try {
                if (_g && !_g.done && (_b = _f.return)) _b.call(_f);
            }
            finally { if (e_11) throw e_11.error; }
        }
        global.metrics.endSpan('update');
        global.metrics.startSpan('handleCollisions');
        this.handleCollisions();
        global.metrics.endSpan('handleCollisions');
        global.metrics.startSpan('postUpdate');
        try {
            for (var _h = __values(this.worldObjects), _j = _h.next(); !_j.done; _j = _h.next()) {
                var worldObject = _j.value;
                if (worldObject.isActive() && worldObject._isInsideWorldBoundsBufferThisFrame) {
                    global.metrics.startSpan(worldObject);
                    worldObject.postUpdate();
                    global.metrics.endSpan(worldObject);
                }
            }
        }
        catch (e_12_1) { e_12 = { error: e_12_1 }; }
        finally {
            try {
                if (_j && !_j.done && (_c = _h.return)) _c.call(_h);
            }
            finally { if (e_12) throw e_12.error; }
        }
        global.metrics.endSpan('postUpdate');
        this.removeDeadWorldObjects();
        this.camera.update();
        this.soundManager.volume = this.volume * global.game.volume;
        this.soundManager.update(this.delta);
        this.time += this.delta;
    };
    World.prototype.updateScriptManager = function () {
        this.scriptManager.update(this.delta);
    };
    World.prototype.render = function (screen) {
        var e_13, _a;
        // Render background color.
        Draw.brush.color = this.backgroundColor;
        Draw.brush.alpha = this.backgroundAlpha;
        Draw.rectangleSolid(screen, 0, 0, screen.width, screen.height);
        try {
            for (var _b = __values(this.layers), _c = _b.next(); !_c.done; _c = _b.next()) {
                var layer = _c.value;
                global.metrics.startSpan("layer_" + layer.name);
                global.metrics.recordMetric('renderToOwnLayer', layer.shouldRenderToOwnLayer ? 0 : 1);
                if (layer.shouldRenderToOwnLayer) {
                    this.layerTexture.clear();
                    this.renderLayerToTexture(layer, this.layerTexture);
                    this.layerTexture.renderTo(screen, {
                        filters: layer.effects.getFilterList()
                    });
                }
                else {
                    this.renderLayerToTexture(layer, screen);
                }
                global.metrics.endSpan("layer_" + layer.name);
            }
        }
        catch (e_13_1) { e_13 = { error: e_13_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_13) throw e_13.error; }
        }
    };
    World.prototype.renderLayerToTexture = function (layer, texture) {
        var e_14, _a;
        layer.sort();
        try {
            for (var _b = __values(layer.worldObjects), _c = _b.next(); !_c.done; _c = _b.next()) {
                var worldObject = _c.value;
                if (worldObject.isVisible() && worldObject.isOnScreen()) {
                    global.metrics.startSpan(worldObject);
                    worldObject.render(texture, worldObject.renderScreenX, worldObject.renderScreenY);
                    global.metrics.endSpan(worldObject);
                }
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
    World.prototype.addWorldObject = function (obj) {
        return World.Actions.addWorldObjectToWorld(obj, this);
    };
    World.prototype.addWorldObjects = function (objs) {
        return World.Actions.addWorldObjectsToWorld(objs, this);
    };
    World.prototype.getDeadWorldObjects = function () {
        return this.worldObjects.filter(function (obj) { return !obj.alive; });
    };
    World.prototype.getEntryPoint = function (entryPointKey) {
        if (!this.entryPoints || !this.entryPoints[entryPointKey]) {
            error("World does not have an entry point named '" + entryPointKey + "':", this);
            return undefined;
        }
        return this.entryPoints[entryPointKey];
    };
    World.prototype.getLayerByName = function (name) {
        var e_15, _a;
        try {
            for (var _b = __values(this.layers), _c = _b.next(); !_c.done; _c = _b.next()) {
                var layer = _c.value;
                if (layer.name === name)
                    return layer;
            }
        }
        catch (e_15_1) { e_15 = { error: e_15_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_15) throw e_15.error; }
        }
        return undefined;
    };
    World.prototype.getPhysicsGroupByName = function (name) {
        return this.physicsGroups[name];
    };
    World.prototype.getPhysicsGroupsThatCollideWith = function (physicsGroup) {
        var e_16, _a;
        var result = [];
        try {
            for (var _b = __values(this.collisions), _c = _b.next(); !_c.done; _c = _b.next()) {
                var collision = _c.value;
                if (collision.move === physicsGroup) {
                    result.push(collision.from);
                }
                else if (collision.from === physicsGroup) {
                    result.push(collision.move);
                }
            }
        }
        catch (e_16_1) { e_16 = { error: e_16_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_16) throw e_16.error; }
        }
        return A.removeDuplicates(result);
    };
    World.prototype.getWorldMouseX = function () {
        return Input.mouseX + Math.floor(this.camera.worldOffsetX);
    };
    World.prototype.getWorldMouseY = function () {
        return Input.mouseY + Math.floor(this.camera.worldOffsetY);
    };
    World.prototype.getWorldMousePosition = function () {
        return new Vector2(this.getWorldMouseX(), this.getWorldMouseY());
    };
    World.prototype.handleCollisions = function () {
        if (_.isEmpty(this.collisions))
            return;
        Physics.resolveCollisions(this);
    };
    /**
     * By default, sounds are:
     *   - Humanized (if set globally)
     */
    World.prototype.playSound = function (key, config) {
        var _a, _b;
        var humanized = (_a = config === null || config === void 0 ? void 0 : config.humanized) !== null && _a !== void 0 ? _a : true;
        var limit = (_b = config === null || config === void 0 ? void 0 : config.limit) !== null && _b !== void 0 ? _b : Infinity;
        // Check limit
        if (this.soundManager.getSoundsByKey(key).length >= limit) {
            return new Sound(key);
        }
        var sound = this.soundManager.playSound(key);
        if (humanized && this.globalSoundHumanizePercent > 0) {
            sound.humanize(this.globalSoundHumanizePercent);
        }
        return sound;
    };
    World.prototype.removeWorldObject = function (obj) {
        if (!obj)
            return undefined;
        if (_.isString(obj)) {
            obj = this.select.name(obj);
            if (!obj)
                return;
        }
        if (obj.world !== this) {
            error("Cannot remove object " + obj.name + " from world because it does not exist in the world. World:", this);
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
        var screen = new BasicTexture(this.camera.width, this.camera.height);
        this.render(screen);
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
                result.push(new World.Layer(layer.name, layer));
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
        for (var name_2 in physicsGroups) {
            _.defaults(physicsGroups[name_2], {
                collidesWith: [],
            });
            result[name_2] = new World.PhysicsGroup(name_2, physicsGroups[name_2]);
        }
        return result;
    };
    World.prototype.removeDeadWorldObjects = function () {
        this.removeWorldObjects(this.getDeadWorldObjects());
    };
    // For use with World.Actions.addWorldObjectToWorld
    World.prototype.internalAddWorldObjectToWorldWorld = function (obj) {
        this.worldObjects.push(obj);
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
        for (var name_3 in this.physicsGroups) {
            A.removeAll(this.physicsGroups[name_3].worldObjects, obj);
        }
    };
    World.DEFAULT_LAYER = 'default';
    return World;
}());
(function (World) {
    var Layer = /** @class */ (function () {
        function Layer(name, config) {
            var _a;
            this.name = name;
            this.worldObjects = [];
            this.sortKey = config.sortKey;
            this.reverseSort = (_a = config.reverseSort) !== null && _a !== void 0 ? _a : false;
            this.effects = new Effects(config.effects);
        }
        Object.defineProperty(Layer.prototype, "shouldRenderToOwnLayer", {
            get: function () {
                return this.effects.hasEffects();
            },
            enumerable: false,
            configurable: true
        });
        Layer.prototype.sort = function () {
            var _this = this;
            if (!this.sortKey)
                return;
            var r = this.reverseSort ? -1 : 1;
            this.worldObjects.sort(function (a, b) { return r * (_this.sortKey(a) - _this.sortKey(b)); });
        };
        return Layer;
    }());
    World.Layer = Layer;
    var PhysicsGroup = /** @class */ (function () {
        function PhysicsGroup(name, config) {
            var _a;
            this.name = name;
            this.immovable = (_a = config.immovable) !== null && _a !== void 0 ? _a : false;
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
            if (!obj || !world)
                return obj;
            if (obj.world) {
                error("Cannot add object " + obj.name + " to world because it aleady exists in another world! You must remove object from previous world first. World:", world, 'Previous world:', obj.world);
                return undefined;
            }
            /// @ts-ignore
            obj.internalAddWorldObjectToWorldWorldObject(world);
            /// @ts-ignore
            world.internalAddWorldObjectToWorldWorld(obj);
            World.Actions.addWorldObjectsToWorld(obj.children, world);
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
            if (!obj)
                return obj;
            if (!obj.world) {
                return obj;
            }
            obj.onRemove();
            var world = obj.world;
            /// @ts-ignore
            obj.internalRemoveWorldObjectFromWorldWorldObject(world);
            /// @ts-ignore
            world.internalRemoveWorldObjectFromWorldWorld(obj);
            World.Actions.removeWorldObjectsFromWorld(obj.children);
            /* No longer unlinking child from parent due to self-mutating iterator issue*/
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
            return A.clone(objs).filter(function (obj) { return removeWorldObjectFromWorld(obj); });
        }
        Actions.removeWorldObjectsFromWorld = removeWorldObjectsFromWorld;
        /**
         * Sets the layer of a WorldObject. Returns the new layer name of the object.
         */
        function setLayer(obj, layerName) {
            if (!obj)
                return undefined;
            if (obj.world && !obj.world.getLayerByName(layerName)) {
                error("Cannot set layer on object '" + obj.name + "' as no layer named " + layerName + " exists in world!", obj.world);
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
                error("Cannot set physicsGroup on object '" + obj.name + "' as no physicsGroup named " + physicsGroupName + " exists in world!", obj.world);
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
                error("Cannot add child " + child.name + " to parent " + obj.name + " becase the child is already the child of another parent!", child.parent);
                return undefined;
            }
            if (child.world && child.world !== obj.world) {
                error("Cannot add child " + child.name + " to parent " + obj.name + " becase the child exists in a different world!", child.world);
                return undefined;
            }
            var cyclicCheckParent = obj.parent;
            while (cyclicCheckParent) {
                if (cyclicCheckParent === child) {
                    error("Cannot add child " + child.name + " to parent " + obj.name + " because this would result in a cyclic hierarchy");
                    return undefined;
                }
                cyclicCheckParent = cyclicCheckParent.parent;
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
            return A.clone(children).filter(function (child) { return removeChildFromParent(child); });
        }
        Actions.removeChildrenFromParent = removeChildrenFromParent;
    })(Actions = World.Actions || (World.Actions = {}));
})(World || (World = {}));
/// <reference path="../world/world.ts" />
var DebugOverlay = /** @class */ (function (_super) {
    __extends(DebugOverlay, _super);
    function DebugOverlay() {
        var _this = _super.call(this) || this;
        _this.backgroundAlpha = 0;
        var debugOverlay = _this;
        _this.addWorldObject(new SpriteText({
            name: 'debuginfo',
            x: 0, y: 0,
            font: Debug.FONT,
            style: Debug.FONT_STYLE,
            effects: { outline: { color: 0x000000 } },
            update: function () {
                this.setText(debugOverlay.getDebugInfo());
            }
        }));
        return _this;
    }
    DebugOverlay.prototype.setCurrentWorldToDebug = function (world) {
        this.currentWorldToDebug = world;
    };
    DebugOverlay.prototype.getDebugInfo = function () {
        var e_20, _a;
        if (!this.currentWorldToDebug)
            return "";
        var mousePositionText = "mpos: "
            + St.padLeft(this.currentWorldToDebug.getWorldMouseX().toString(), 3) + " "
            + St.padLeft(this.currentWorldToDebug.getWorldMouseY().toString(), 3);
        var fpsText = "fps: "
            + global.fpsCalculator.fpsAvg.toFixed(0) + " "
            + "(-" + (global.fpsCalculator.fpsAvg - global.fpsCalculator.fpsP).toFixed(0) + ")";
        var recordingText = global.metrics.isRecording ? "\nrecording" : "";
        var feedText = "";
        try {
            for (var _b = __values(Debug.OVERLAY_FEEDS), _c = _b.next(); !_c.done; _c = _b.next()) {
                var feed = _c.value;
                feedText += feed(this.currentWorldToDebug) + "\n";
            }
        }
        catch (e_20_1) { e_20 = { error: e_20_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_20) throw e_20.error; }
        }
        return mousePositionText + "\n" + fpsText + "\n" + recordingText + "\n" + feedText;
    };
    return DebugOverlay;
}(World));
var Experiment = /** @class */ (function () {
    function Experiment(toggleKey) {
        this.toggleKey = toggleKey;
        this.enabled = false;
    }
    Experiment.prototype.update = function (name) {
        if (Input.justDown(this.toggleKey)) {
            this.enabled = !this.enabled;
            debug("Experiment '" + name + "' turned " + (this.enabled ? 'on' : 'off'));
        }
    };
    Experiment.prototype.isEnabled = function () {
        return Debug.DEBUG && this.enabled;
    };
    return Experiment;
}());
/// <reference path="../world/world.ts" />
var Menu = /** @class */ (function (_super) {
    __extends(Menu, _super);
    function Menu(menuSystem, config) {
        if (config === void 0) { config = {}; }
        var _this = _super.call(this, config) || this;
        _this.menuSystem = menuSystem;
        return _this;
    }
    return Menu;
}(World));
var MetricsMenu = /** @class */ (function (_super) {
    __extends(MetricsMenu, _super);
    function MetricsMenu(menuSystem) {
        var _this = _super.call(this, menuSystem) || this;
        _this.backgroundColor = 0x000000;
        _this.plot = global.metrics.plotLastRecording();
        var plotSprite = _this.addWorldObject(new Sprite());
        plotSprite.setTexture(_this.plot.texture);
        _this.addWorldObject(new SpriteText({
            x: 0, y: global.gameHeight,
            name: 'graphxy',
            font: Debug.FONT,
            style: { color: 0x00FF00 },
            anchor: Vector2.BOTTOM_LEFT,
        }));
        return _this;
    }
    MetricsMenu.prototype.update = function () {
        _super.prototype.update.call(this);
        if (Input.justDown(Input.GAME_CLOSE_MENU)) {
            Input.consume(Input.GAME_CLOSE_MENU);
            this.menuSystem.game.unpauseGame();
        }
        this.select.name('graphxy')
            .setText(this.getPlotY().toFixed(2) + " ms");
    };
    MetricsMenu.prototype.getPlotX = function () {
        return this.plot.graphBounds.left + Input.mouseX / global.gameWidth * (this.plot.graphBounds.right - this.plot.graphBounds.left);
    };
    MetricsMenu.prototype.getPlotY = function () {
        return this.plot.graphBounds.bottom + (1 - Input.mouseY / global.gameHeight) * (this.plot.graphBounds.top - this.plot.graphBounds.bottom);
    };
    return MetricsMenu;
}(Menu));
/// <reference path="../worldObject.ts" />
var SpriteText = /** @class */ (function (_super) {
    __extends(SpriteText, _super);
    function SpriteText(config) {
        var _a, _b, _c, _d, _e, _f;
        var _this = _super.call(this, config) || this;
        if (!config.font && !SpriteText.DEFAULT_FONT) {
            error("SpriteText must have a font provided, or a default font set");
        }
        _this._font = (_b = (_a = config.font) !== null && _a !== void 0 ? _a : SpriteText.DEFAULT_FONT) !== null && _b !== void 0 ? _b : {
            texturePrefix: 'none',
            charWidth: 0,
            charHeight: 0,
            spaceWidth: 0,
            newlineHeight: 0
        };
        _this._style = _.defaults(O.deepClone((_c = config.style) !== null && _c !== void 0 ? _c : {}), {
            color: 0xFFFFFF,
            alpha: 1,
            offset: 0,
        });
        _this.lastStyle = O.deepClone(_this.style);
        _this.visibleCharCount = Infinity;
        _this.maxWidth = (_d = config.maxWidth) !== null && _d !== void 0 ? _d : Infinity;
        _this.anchor = (_e = config.anchor) !== null && _e !== void 0 ? _e : Vector2.TOP_LEFT;
        _this.effects = new Effects();
        _this.effects.updateFromConfig(config.effects);
        _this.mask = config.mask;
        _this.setText((_f = config.text) !== null && _f !== void 0 ? _f : "");
        _this.dirty = true;
        return _this;
    }
    Object.defineProperty(SpriteText.prototype, "font", {
        get: function () { return this._font; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SpriteText.prototype, "style", {
        get: function () { return this._style; },
        set: function (value) {
            this._style.alpha = value.alpha;
            this._style.color = value.color;
            this._style.offset = value.offset;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SpriteText.prototype, "maxWidth", {
        get: function () { return this._maxWidth; },
        set: function (value) {
            this._maxWidth = value;
            this.dirty = true;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SpriteText.prototype, "visibleCharCount", {
        get: function () { return this._visibleCharCount; },
        set: function (value) {
            this._visibleCharCount = value;
            this.dirty = true;
        },
        enumerable: false,
        configurable: true
    });
    SpriteText.prototype.update = function () {
        _super.prototype.update.call(this);
        this.effects.updateEffects(this.delta);
        if (!_.isEqual(this.lastStyle, this.style)) {
            this.lastStyle = O.deepClone(this.style);
            this.dirty = true;
        }
    };
    SpriteText.prototype.render = function (texture, x, y) {
        var textWidth = this.getTextWidth();
        var textHeight = this.getTextHeight();
        if (this.dirty) {
            this.renderSpriteText();
            this.dirty = false;
        }
        this.staticTexture.renderTo(texture, {
            x: x - this.anchor.x * textWidth,
            y: y - this.anchor.y * textHeight,
            filters: this.effects.getFilterList(),
            mask: Mask.getTextureMaskForWorldObject(this.mask, this),
        });
        _super.prototype.render.call(this, texture, x, y);
    };
    SpriteText.prototype.renderSpriteText = function () {
        var _a, _b, _c;
        var textWidth = this.getTextWidth();
        var textHeight = this.getTextHeight();
        this.staticTexture = new BasicTexture(textWidth, textHeight);
        var charCount = Math.min(this.visibleCharCount, this.chars.length);
        for (var i = 0; i < charCount; i++) {
            var char = this.chars[i];
            global.metrics.startSpan("char_" + char.char);
            var char_i = SpriteText.charCodes[char.char].y * 10 + SpriteText.charCodes[char.char].x;
            var charTexture = AssetCache.getTexture(this.font.texturePrefix + "_" + char_i);
            charTexture.renderTo(this.staticTexture, {
                x: char.x,
                y: char.y + ((_a = char.style.offset) !== null && _a !== void 0 ? _a : this.style.offset),
                tint: (_b = char.style.color) !== null && _b !== void 0 ? _b : this.style.color,
                alpha: (_c = char.style.alpha) !== null && _c !== void 0 ? _c : this.style.alpha,
            });
            global.metrics.endSpan("char_" + char.char);
        }
    };
    SpriteText.prototype.clear = function () {
        this.setText("");
    };
    SpriteText.prototype.getCharList = function () {
        return this.chars;
    };
    SpriteText.prototype.getCurrentText = function () {
        return this.currentText;
    };
    SpriteText.prototype.getTextWidth = function () {
        return SpriteText.getWidthOfCharList(this.chars, this.visibleCharCount);
    };
    SpriteText.prototype.getTextHeight = function () {
        return SpriteText.getHeightOfCharList(this.chars, this.visibleCharCount);
    };
    SpriteText.prototype.getTextWorldBounds = function () {
        var textWidth = this.getTextWidth();
        var textHeight = this.getTextHeight();
        return {
            x: this.x - this.anchor.x * textWidth,
            y: this.y - this.anchor.y * textHeight,
            width: textWidth,
            height: textHeight,
        };
    };
    SpriteText.prototype.getVisibleScreenBounds = function () {
        var bounds = this.getTextWorldBounds();
        bounds.x += this.renderScreenX - this.x;
        bounds.y += this.renderScreenY - this.y;
        return bounds;
    };
    SpriteText.prototype.setText = function (text) {
        if (text === this.currentText)
            return;
        this.chars = SpriteTextConverter.textToCharListWithWordWrap(text, this.font, this.maxWidth);
        this.currentText = text;
        this.dirty = true;
    };
    SpriteText.DEFAULT_FONT = null;
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
                result[spriteFontCharList[y][x]] = vec2(x, y);
            }
        }
        result[' '] = new Vector2(-1, -1);
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
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Character.prototype, "height", {
            get: function () {
                return this.font.charHeight;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Character.prototype, "left", {
            get: function () {
                return this.x;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Character.prototype, "right", {
            get: function () {
                return this.x + this.width;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Character.prototype, "top", {
            get: function () {
                return this.y;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Character.prototype, "bottom", {
            get: function () {
                return this.y + this.height;
            },
            enumerable: false,
            configurable: true
        });
        return Character;
    }());
    SpriteText.Character = Character;
    function addTags(tags) {
        for (var key in tags) {
            if (key in SpriteText.TAGS) {
                debug("A SpriteText tag already exists with name " + key + ":", SpriteText.TAGS[key]);
            }
            SpriteText.TAGS[key] = tags[key];
        }
    }
    SpriteText.addTags = addTags;
    function getWidthOfCharList(list, charCount) {
        if (_.isEmpty(list))
            return 0;
        charCount = Math.min(charCount !== null && charCount !== void 0 ? charCount : list.length, list.length);
        var result = 0;
        for (var i = 0; i < charCount; i++) {
            if (list[i].right > result)
                result = list[i].right;
        }
        return result;
    }
    SpriteText.getWidthOfCharList = getWidthOfCharList;
    function getHeightOfCharList(list, charCount) {
        if (_.isEmpty(list))
            return 0;
        charCount = Math.min(charCount !== null && charCount !== void 0 ? charCount : list.length, list.length);
        var result = 0;
        for (var i = 0; i < charCount; i++) {
            if (list[i].bottom > result)
                result = list[i].bottom;
        }
        return result;
    }
    SpriteText.getHeightOfCharList = getHeightOfCharList;
    SpriteText.NOOP_TAG = 'noop';
    SpriteText.TAGS = (_a = {},
        _a[SpriteText.NOOP_TAG] = function (params) {
            return {};
        },
        _a['y'] = function (params) {
            return { color: 0xFFFF00 };
        },
        _a['color'] = function (params) {
            return { color: getInt(params[0], undefined) };
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
/// <reference path="../worldObject/spriteText/spriteText.ts" />
var MenuTextButton = /** @class */ (function (_super) {
    __extends(MenuTextButton, _super);
    function MenuTextButton(config) {
        var _a;
        var _this = _super.call(this, config) || this;
        _this.onClick = (_a = config.onClick) !== null && _a !== void 0 ? _a : Utils.NOOP;
        return _this;
    }
    MenuTextButton.prototype.update = function () {
        _super.prototype.update.call(this);
        if (this.isHovered()) {
            this.style.alpha = 0.5;
            if (Input.justDown(Input.GAME_SELECT)) {
                Input.consume(Input.GAME_SELECT);
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
var MenuNumericSelector = /** @class */ (function (_super) {
    __extends(MenuNumericSelector, _super);
    function MenuNumericSelector(config) {
        var _this = _super.call(this, config) || this;
        _this.barLength = config.barLength;
        _this.minValue = config.minValue;
        _this.maxValue = config.maxValue;
        _this.getValue = config.getValue;
        _this.setValue = config.setValue;
        var leftButton = _this.addChild(new MenuTextButton({
            font: _this.font,
            text: "<",
            onClick: function () {
                global.game.playSound('click');
                var bars = _this.getFullBarsForValue(_this.getValue());
                if (bars > 0) {
                    var newValue = _this.getValueForFullBars(bars - 1);
                    _this.setValue(newValue);
                }
            }
        }));
        leftButton.style = _this.style;
        var rightButton = _this.addChild(new MenuTextButton({
            font: _this.font,
            text: ">",
            onClick: function () {
                global.game.playSound('click');
                var bars = _this.getFullBarsForValue(_this.getValue());
                if (bars < _this.barLength) {
                    var newValue = _this.getValueForFullBars(bars + 1);
                    _this.setValue(newValue);
                }
            }
        }));
        rightButton.localx = (_this.barLength + 3) * _this.font.charWidth;
        rightButton.style = _this.style;
        return _this;
    }
    MenuNumericSelector.prototype.update = function () {
        _super.prototype.update.call(this);
        var fullBars = this.getFullBarsForValue(this.getValue());
        var text = "  " + "[color 0xCCCCCC]|[/color]".repeat(fullBars) + "[color 0x444444]|[/color]".repeat(this.barLength - fullBars);
        this.setText(text);
    };
    MenuNumericSelector.prototype.getFullBarsForValue = function (value) {
        var valueNormalized = M.clamp((value - this.minValue) / (this.maxValue - this.minValue), 0, 1);
        return Math.floor(valueNormalized * this.barLength);
    };
    MenuNumericSelector.prototype.getValueForFullBars = function (fullBars) {
        var fullBarsNormalized = fullBars / this.barLength;
        return this.minValue + (this.maxValue - this.minValue) * fullBarsNormalized;
    };
    return MenuNumericSelector;
}(SpriteText));
var MenuControlMapper = /** @class */ (function (_super) {
    __extends(MenuControlMapper, _super);
    function MenuControlMapper(config) {
        var _this = _super.call(this, config) || this;
        _this.controlName = config.controlName;
        _this.selectedBinding = undefined;
        _this.setBindings();
        return _this;
    }
    MenuControlMapper.prototype.update = function () {
        _super.prototype.update.call(this);
        if (this.selectedBinding && Input.justDown(Input.GAME_CLOSE_MENU)) {
            Input.consume(Input.GAME_CLOSE_MENU);
            this.unselectBinding();
        }
        if (this.selectedBinding) {
            var pressedKey = Input.getEventKey();
            if (pressedKey) {
                var controls = Options.getOption('controls');
                var pressedKeyAlreadyBound = _.contains(controls[this.controlName], pressedKey);
                var pressedKeyIsSelect = _.contains(controls[Input.GAME_SELECT], pressedKey);
                if (pressedKeyAlreadyBound) {
                    Input.consumeEventKey();
                }
                else if (pressedKeyIsSelect && this.children.some(function (button) { return button.isHovered(); })) {
                    // No-op, will fall through and select the other key
                }
                else {
                    Input.updateControlBinding(this.controlName, this.selectedBinding, pressedKey);
                    this.setBindings();
                }
            }
        }
    };
    MenuControlMapper.prototype.setBindings = function () {
        var e_21, _a;
        var _this = this;
        World.Actions.removeWorldObjectsFromWorld(this.children);
        var controls = Options.getOption('controls');
        var controlBindings = controls[this.controlName];
        var bindingx = 0;
        var text = "";
        var _loop_1 = function (binding) {
            var bindingId = binding;
            var bindingName = this_1.getBindingName(binding);
            var bindingButton = this_1.addChild(new MenuTextButton({
                name: this_1.getBindingMappingObjectName(binding),
                font: this_1.font,
                text: bindingName,
                onClick: function () {
                    global.game.playSound('click');
                    _this.selectBinding(bindingId);
                }
            }));
            bindingButton.localx = bindingx;
            bindingButton.style = this_1.style;
            bindingx += (bindingName.length + 3) * this_1.font.charWidth;
            text += " ".repeat(bindingName.length) + " / ";
        };
        var this_1 = this;
        try {
            for (var controlBindings_1 = __values(controlBindings), controlBindings_1_1 = controlBindings_1.next(); !controlBindings_1_1.done; controlBindings_1_1 = controlBindings_1.next()) {
                var binding = controlBindings_1_1.value;
                _loop_1(binding);
            }
        }
        catch (e_21_1) { e_21 = { error: e_21_1 }; }
        finally {
            try {
                if (controlBindings_1_1 && !controlBindings_1_1.done && (_a = controlBindings_1.return)) _a.call(controlBindings_1);
            }
            finally { if (e_21) throw e_21.error; }
        }
        this.setText(text.substr(0, text.length - 3));
        this.selectedBinding = undefined;
    };
    MenuControlMapper.prototype.selectBinding = function (binding) {
        if (this.selectedBinding)
            this.unselectBinding();
        this.selectedBinding = binding;
        var bindingObject = this.getChildByName(this.getBindingMappingObjectName(binding));
        bindingObject.style.color = 0xFFFF00;
        Input.consumeEventKey();
    };
    MenuControlMapper.prototype.unselectBinding = function () {
        var bindingObject = this.getChildByName(this.getBindingMappingObjectName(this.selectedBinding));
        bindingObject.style.color = this.style.color;
        this.selectedBinding = undefined;
    };
    MenuControlMapper.prototype.getBindingName = function (binding) {
        if (_.isEmpty(binding))
            return 'Empty';
        if (binding === ' ')
            return 'Space';
        if (binding.length === 1)
            return binding.toUpperCase();
        return binding;
    };
    MenuControlMapper.prototype.getBindingMappingObjectName = function (binding) {
        return "binding::" + this.controlName + "::" + binding;
    };
    return MenuControlMapper;
}(SpriteText));
var MenuSystem = /** @class */ (function () {
    function MenuSystem(game) {
        this.game = game;
        this.menuStack = [];
    }
    Object.defineProperty(MenuSystem.prototype, "currentMenu", {
        get: function () { return _.last(this.menuStack); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MenuSystem.prototype, "inMenu", {
        get: function () { return !!this.currentMenu; },
        enumerable: false,
        configurable: true
    });
    MenuSystem.prototype.update = function () {
        if (this.inMenu) {
            this.currentMenu.update();
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
var MetricsManager = /** @class */ (function () {
    function MetricsManager() {
    }
    MetricsManager.prototype.update = function () {
        if (Debug.DEBUG && Input.justDown(Input.DEBUG_RECORD_METRICS)) {
            if (!global.metrics.isRecording) {
                global.metrics.startRecording('recording');
                debug("Started recording");
            }
            else {
                global.metrics.endRecording();
                debug("Ended recording (" + global.metrics.getLastRecording().time.toFixed(0) + " ms)");
            }
        }
    };
    return MetricsManager;
}());
var MetricsPlot;
(function (MetricsPlot) {
    function plotRecording(recording, width, height) {
        var plot = {
            texture: Texture.filledRect(width, height, 0xFFFFFF),
            dataPoints: {},
            graphBounds: { left: 0, right: width, bottom: 0, top: height },
        };
        if (!recording || _.isEmpty(recording.subspans))
            return plot;
        var frames = recording.subspans;
        var monitor = new Monitor();
        plot.graphBounds = { left: Infinity, right: -Infinity, bottom: Infinity, top: -Infinity };
        for (var x = 0; x < width; x++) {
            var percentLow = x / width;
            var percentHigh = (x + 1) / width;
            for (var frame_i = 0; frame_i < frames.length; frame_i++) {
                var framePercent = frame_i / frames.length;
                if (percentLow <= framePercent && framePercent < percentHigh) {
                    monitor.addPoint(frames[frame_i].time);
                }
            }
            if (monitor.isEmpty())
                continue;
            var y = monitor.getAvg();
            plot.dataPoints[x] = { x: x, y: y };
            plot.graphBounds.left = Math.min(plot.graphBounds.left, x);
            plot.graphBounds.right = Math.max(plot.graphBounds.right, x);
            plot.graphBounds.bottom = Math.min(plot.graphBounds.bottom, y);
            plot.graphBounds.top = Math.max(plot.graphBounds.top, y);
        }
        plot.graphBounds.top = Math.max(plot.graphBounds.top, 11);
        plot.graphBounds.bottom = Math.min(plot.graphBounds.bottom, -1);
        Draw.brush.color = 0xFF0000;
        Draw.brush.alpha = 1;
        for (var x in plot.dataPoints) {
            var dataPoint = plot.dataPoints[x];
            Draw.pixel(plot.texture, getPlotPixelX(plot, dataPoint.x), getPlotPixelY(plot, dataPoint.y));
        }
        Draw.brush.color = 0x000000;
        Draw.rectangleSolid(plot.texture, 0, getPlotPixelY(plot, 0), width, 1);
        Draw.rectangleSolid(plot.texture, 0, getPlotPixelY(plot, 10), width, 1);
        return plot;
    }
    MetricsPlot.plotRecording = plotRecording;
    function getPlotPixelX(plot, x) {
        return plot.texture.width * (x - plot.graphBounds.left) / (plot.graphBounds.right - plot.graphBounds.left);
    }
    function getPlotPixelY(plot, y) {
        return plot.texture.height - plot.texture.height * (y - plot.graphBounds.bottom) / (plot.graphBounds.top - plot.graphBounds.bottom);
    }
})(MetricsPlot || (MetricsPlot = {}));
var MetricsReport;
(function (MetricsReport) {
    function generateTimeReportForSpan(recording) {
        var e_22, _a;
        var report = {
            time: recording.time,
        };
        var num = 0;
        try {
            for (var _b = __values(recording.subspans || []), _c = _b.next(); !_c.done; _c = _b.next()) {
                var subspan = _c.value;
                report[num + "_" + subspan.name] = generateTimeReportForSpan(subspan);
                num++;
            }
        }
        catch (e_22_1) { e_22 = { error: e_22_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_22) throw e_22.error; }
        }
        return report;
    }
    MetricsReport.generateTimeReportForSpan = generateTimeReportForSpan;
    function filterReport(report, keyFilter) {
        var e_23, _a;
        if (_.isString(keyFilter))
            keyFilter = [keyFilter];
        try {
            for (var keyFilter_1 = __values(keyFilter), keyFilter_1_1 = keyFilter_1.next(); !keyFilter_1_1.done; keyFilter_1_1 = keyFilter_1.next()) {
                var keyFilterString = keyFilter_1_1.value;
                var result = {};
                for (var key in report) {
                    var filtered = filterReportSpanForKey(report[key], keyFilterString);
                    if (filtered) {
                        for (var key2 in filtered) {
                            result[key + "_" + key2] = filtered[key2];
                        }
                    }
                }
                report = result;
            }
        }
        catch (e_23_1) { e_23 = { error: e_23_1 }; }
        finally {
            try {
                if (keyFilter_1_1 && !keyFilter_1_1.done && (_a = keyFilter_1.return)) _a.call(keyFilter_1);
            }
            finally { if (e_23) throw e_23.error; }
        }
        return report;
    }
    MetricsReport.filterReport = filterReport;
    function filterReportSpanForKey(reportSpan, keyFilter) {
        var _a;
        if (_.isEmpty(reportSpan))
            return undefined;
        if (_.isNumber(reportSpan) || _.isString(reportSpan))
            return undefined;
        for (var key in reportSpan) {
            if (key.indexOf(keyFilter) > -1)
                return _a = {}, _a[key] = reportSpan[key], _a;
        }
        for (var key in reportSpan) {
            var filtered = filterReportSpanForKey(reportSpan[key], keyFilter);
            if (filtered)
                return filtered;
        }
        return undefined;
    }
})(MetricsReport || (MetricsReport = {}));
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
    function callAfterTime(time, func) {
        return S.chain(S.wait(time), S.call(func));
    }
    S.callAfterTime = callAfterTime;
    function chain() {
        var scriptFunctions = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            scriptFunctions[_i] = arguments[_i];
        }
        return function () {
            var scriptFunctions_1, scriptFunctions_1_1, scriptFunction, e_24_1;
            var e_24, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 5, 6, 7]);
                        scriptFunctions_1 = __values(scriptFunctions), scriptFunctions_1_1 = scriptFunctions_1.next();
                        _b.label = 1;
                    case 1:
                        if (!!scriptFunctions_1_1.done) return [3 /*break*/, 4];
                        scriptFunction = scriptFunctions_1_1.value;
                        return [4 /*yield*/, scriptFunction];
                    case 2:
                        _b.sent();
                        _b.label = 3;
                    case 3:
                        scriptFunctions_1_1 = scriptFunctions_1.next();
                        return [3 /*break*/, 1];
                    case 4: return [3 /*break*/, 7];
                    case 5:
                        e_24_1 = _b.sent();
                        e_24 = { error: e_24_1 };
                        return [3 /*break*/, 7];
                    case 6:
                        try {
                            if (scriptFunctions_1_1 && !scriptFunctions_1_1.done && (_a = scriptFunctions_1.return)) _a.call(scriptFunctions_1);
                        }
                        finally { if (e_24) throw e_24.error; }
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
                        t = new Timer(OrFactory.resolve(time));
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
                        return [4 /*yield*/, scriptFunction];
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
                        return [4 /*yield*/, scriptFunction];
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
    function setData(prop, value) {
        return function () {
            return __generator(this, function (_a) {
                global.script.data[prop] = value;
                return [2 /*return*/];
            });
        };
    }
    S.setData = setData;
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
    function tween(duration, obj, prop, start, end, easingFunction) {
        if (easingFunction === void 0) { easingFunction = Tween.Easing.Linear; }
        return function () {
            var tween;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        tween = new Tween(start, end, OrFactory.resolve(duration), easingFunction);
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
    function tweenPt(duration, pt, start, end, easingFunction) {
        if (easingFunction === void 0) { easingFunction = Tween.Easing.Linear; }
        var startx = start.x;
        var starty = start.y;
        var endx = end.x;
        var endy = end.y;
        return S.simul(S.tween(duration, pt, 'x', startx, endx, easingFunction), S.tween(duration, pt, 'y', starty, endy, easingFunction));
    }
    S.tweenPt = tweenPt;
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
var Script = /** @class */ (function () {
    function Script(scriptFunction) {
        this.iterator = this.buildIterator(scriptFunction)();
        this.data = {};
    }
    Object.defineProperty(Script.prototype, "running", {
        get: function () {
            return !this.paused && !this.done;
        },
        enumerable: false,
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
            this.update(0.1);
        }
        if (!this.done) {
            error('Warning: script finishImmediately exceeded max iters!', this);
            this.done = true;
        }
    };
    Script.prototype.stop = function () {
        this.done = true;
    };
    Script.prototype.buildIterator = function (scriptFunction) {
        var s = this;
        return function () {
            var iterator, result, script;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        iterator = scriptFunction();
                        _a.label = 1;
                    case 1:
                        if (!true) return [3 /*break*/, 8];
                        result = iterator.next();
                        if (!result.value) return [3 /*break*/, 5];
                        if (_.isArray(result.value)) {
                            result.value = S.simul.apply(S, __spread(result.value.map(function (scr) { return s.buildIterator(scr); })));
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
    Script.FINISH_IMMEDIATELY_MAX_ITERS = 1000000;
    return Script;
}());
(function (Script) {
    function instant(scriptFunction, maxIters) {
        new Script(scriptFunction).finishImmediately(maxIters);
    }
    Script.instant = instant;
})(Script || (Script = {}));
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
var GlobalSoundManager = /** @class */ (function () {
    function GlobalSoundManager() {
        this.activeSounds = [];
    }
    GlobalSoundManager.prototype.preGameUpdate = function () {
        var e_25, _a;
        try {
            for (var _b = __values(this.activeSounds), _c = _b.next(); !_c.done; _c = _b.next()) {
                var sound = _c.value;
                sound.markForDisable();
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
    GlobalSoundManager.prototype.postGameUpdate = function () {
        var e_26, _a;
        try {
            for (var _b = __values(this.activeSounds), _c = _b.next(); !_c.done; _c = _b.next()) {
                var sound = _c.value;
                if (sound.isMarkedForDisable) {
                    this.ensureSoundDisabled(sound);
                }
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
    GlobalSoundManager.prototype.ensureSoundDisabled = function (sound) {
        sound.ensureDisabled();
        A.removeAll(this.activeSounds, sound);
    };
    GlobalSoundManager.prototype.ensureSoundEnabled = function (sound) {
        if (!_.contains(this.activeSounds, sound)) {
            this.activeSounds.push(sound);
        }
        sound.unmarkForDisable();
        sound.ensureEnabled();
    };
    return GlobalSoundManager;
}());
var MusicManager = /** @class */ (function () {
    function MusicManager() {
        this.musics = [];
        this.paused = false;
        this.volume = 1;
    }
    Object.defineProperty(MusicManager.prototype, "currentMusic", {
        get: function () { return _.last(this.musics); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MusicManager.prototype, "currentMusicKey", {
        get: function () { var _a; return (_a = this.currentMusic) === null || _a === void 0 ? void 0 : _a.key; },
        enumerable: false,
        configurable: true
    });
    MusicManager.prototype.update = function (delta) {
        if (this.transitionScript) {
            this.transitionScript.update(delta);
            if (this.transitionScript.done) {
                this.transitionScript = null;
            }
        }
        for (var i = this.musics.length - 1; i >= 0; i--) {
            if (!this.paused && !this.musics[i].paused) {
                this.musics[i].update(delta);
            }
            if (this.musics[i].done) {
                this.musics.splice(i, 1);
            }
        }
    };
    MusicManager.prototype.pauseMusic = function () {
        this.paused = true;
    };
    MusicManager.prototype.playMusic = function (key, fadeTime) {
        var _this = this;
        if (fadeTime === void 0) { fadeTime = 0; }
        if (this.currentMusicKey === key && !this.transitionScript) {
            return this.currentMusic;
        }
        var music = new Sound(key, this);
        music.loop = true;
        if (fadeTime <= 0) {
            this.musics = [music];
            this.transitionScript = null;
        }
        else {
            this.musics.push(music);
            music.volume = 0;
            var startVolumes_1 = this.musics.map(function (m) { return m.volume; });
            this.transitionScript = new Script(S.chain(S.doOverTime(fadeTime, function (t) {
                for (var i = 0; i < _this.musics.length - 1; i++) {
                    _this.musics[i].volume = startVolumes_1[i] * (1 - t);
                }
                music.volume = t;
            }), S.call(function () {
                _this.musics = [music];
            })));
        }
        return music;
    };
    MusicManager.prototype.stopMusic = function (fadeTime) {
        var _this = this;
        if (fadeTime === void 0) { fadeTime = 0; }
        if (fadeTime <= 0) {
            this.musics = [];
            this.transitionScript = null;
        }
        else {
            var startVolumes_2 = this.musics.map(function (m) { return m.volume; });
            this.transitionScript = new Script(S.chain(S.doOverTime(fadeTime, function (t) {
                for (var i = 0; i < _this.musics.length; i++) {
                    _this.musics[i].volume = startVolumes_2[i] * (1 - t);
                }
            }), S.call(function () {
                _this.musics = [];
            })));
        }
    };
    MusicManager.prototype.unpauseMusic = function () {
        this.paused = false;
    };
    return MusicManager;
}());
var Sound = /** @class */ (function () {
    function Sound(key, controller) {
        var asset = AssetCache.getSoundAsset(key);
        if (WebAudio.started) {
            this.webAudioSound = new WebAudioSound(asset);
        }
        else {
            this.webAudioSound = new WebAudioSoundDummy(asset);
        }
        this.webAudioSound.pause(); // Start paused to avoid playing for one frame when not updating
        this.markedForDisable = false;
        this.key = key;
        this.paused = false;
        this.pos = 0;
        this.volume = 1;
        this.speed = 1;
        this.loop = false;
        this.controller = controller;
    }
    Object.defineProperty(Sound.prototype, "soundManager", {
        get: function () { return global.soundManager; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Sound.prototype, "isMarkedForDisable", {
        get: function () { return this.markedForDisable; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Sound.prototype, "done", {
        get: function () { return this.webAudioSound.done; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Sound.prototype, "duration", {
        get: function () { return this.webAudioSound.duration; },
        enumerable: false,
        configurable: true
    });
    Sound.prototype.markForDisable = function () {
        this.markedForDisable = true;
    };
    Sound.prototype.unmarkForDisable = function () {
        this.markedForDisable = false;
    };
    Sound.prototype.ensureDisabled = function () {
        this.webAudioSound.pause();
    };
    Sound.prototype.ensureEnabled = function () {
        this.webAudioSound.unpause();
    };
    Sound.prototype.update = function (delta) {
        this.soundManager.ensureSoundEnabled(this);
        this.pos += delta;
        if (WebAudio.started && this.webAudioSound instanceof WebAudioSoundDummy) {
            if (this.pos < this.duration) {
                // Generate WebAudioSound from dummy
                this.webAudioSound = this.webAudioSound.toWebAudioSound();
            }
            this.webAudioSound.seek(this.pos);
        }
        this.volume = M.clamp(this.volume, 0, Sound.MAX_VOLUME);
        this.speed = M.clamp(this.speed, 0, Sound.MAX_SPEED);
        var volume = this.volume * (this.controller ? this.controller.volume : 1);
        if (this.webAudioSound.volume !== volume)
            this.webAudioSound.volume = volume;
        if (this.webAudioSound.speed !== this.speed)
            this.webAudioSound.speed = this.speed;
        if (this.webAudioSound.loop !== this.loop)
            this.webAudioSound.loop = this.loop;
    };
    Sound.prototype.humanize = function (percent) {
        if (percent === void 0) { percent = 0.05; }
        this.speed *= Random.float(1 - percent, 1 + percent);
    };
    return Sound;
}());
(function (Sound) {
    Sound.MAX_VOLUME = 2;
    Sound.MAX_SPEED = 100;
})(Sound || (Sound = {}));
var SoundManager = /** @class */ (function () {
    function SoundManager() {
        this.sounds = [];
        this.volume = 1;
    }
    SoundManager.prototype.update = function (delta) {
        for (var i = this.sounds.length - 1; i >= 0; i--) {
            if (!this.sounds[i].paused) {
                this.sounds[i].update(delta);
            }
            if (this.sounds[i].done) {
                this.sounds.splice(i, 1);
            }
        }
    };
    SoundManager.prototype.playSound = function (key) {
        var sound = new Sound(key, this);
        this.sounds.push(sound);
        return sound;
    };
    SoundManager.prototype.getSoundsByKey = function (key) {
        return this.sounds.filter(function (sound) { return sound.key === key; });
    };
    return SoundManager;
}());
var WebAudio = /** @class */ (function () {
    function WebAudio() {
    }
    Object.defineProperty(WebAudio, "started", {
        get: function () { return this.context && this.context.state === 'running'; },
        enumerable: false,
        configurable: true
    });
    WebAudio.start = function () {
        this.context.resume();
    };
    WebAudio.initContext = function () {
        try {
            // @ts-ignore
            window.AudioContext = window.AudioContext || window.webkitAudioContext;
            this.context = new AudioContext();
        }
        catch (e) {
            error('Web Audio API is not supported in this browser. Sounds will not be able to play.');
        }
    };
    WebAudio.preloadSound = function (key, url, cb) {
        var request = new XMLHttpRequest();
        request.open('GET', url, true);
        request.responseType = 'arraybuffer';
        request.onload = function () {
            WebAudio.context.decodeAudioData(request.response, function (buffer) {
                WebAudio.preloadedSounds[key] = {
                    buffer: buffer,
                };
                if (cb)
                    cb();
            }, function (e) {
                error("Could not decode sound " + key + ":", e);
            });
        };
        request.send();
    };
    WebAudio.preloadedSounds = {};
    return WebAudio;
}());
var WebAudioSound = /** @class */ (function () {
    function WebAudioSound(asset) {
        this.asset = asset;
        this.gainNode = this.context.createGain();
        this.gainNode.connect(this.context.destination);
        this._volume = 1;
        this._speed = 1;
        this._loop = false;
        this.start();
    }
    Object.defineProperty(WebAudioSound.prototype, "context", {
        get: function () { return WebAudio.context; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(WebAudioSound.prototype, "volume", {
        get: function () {
            return this._volume;
        },
        set: function (value) {
            this._volume = this.asset.volume === 0 ? value : M.clamp(value, 0, Sound.MAX_VOLUME / this.asset.volume);
            this.gainNode.gain.value = this._volume * this.asset.volume;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(WebAudioSound.prototype, "speed", {
        get: function () {
            return this._speed;
        },
        set: function (value) {
            this._speed = this.asset.speed === 0 ? value : M.clamp(value, 0, Sound.MAX_SPEED / this.asset.speed);
            if (this.sourceNode)
                this.sourceNode.playbackRate.value = this._speed * this.asset.speed;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(WebAudioSound.prototype, "loop", {
        get: function () { return this._loop; },
        set: function (value) {
            this._loop = value;
            if (this.sourceNode)
                this.sourceNode.loop = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(WebAudioSound.prototype, "duration", {
        get: function () { return this.sourceNode ? this.sourceNode.buffer.duration : 0; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(WebAudioSound.prototype, "done", {
        get: function () { return this._done; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(WebAudioSound.prototype, "paused", {
        get: function () { return this.pausedPosition !== undefined; },
        set: function (value) { value ? this.pause() : this.unpause(); },
        enumerable: false,
        configurable: true
    });
    ;
    WebAudioSound.prototype.pause = function () {
        if (this.paused)
            return;
        this.pausedPosition = M.mod(this.context.currentTime - this.startTime, this.duration);
        this.sourceNode.onended = undefined;
        this.sourceNode.stop();
    };
    WebAudioSound.prototype.unpause = function () {
        if (!this.paused || this.done)
            return;
        this.start(this.pausedPosition);
    };
    WebAudioSound.prototype.seek = function (pos) {
        if (pos >= this.duration) {
            this.stop();
            return;
        }
        if (this.paused) {
            this.pausedPosition = pos;
        }
        else {
            this.sourceNode.onended = undefined;
            this.sourceNode.stop();
            this.start(pos);
        }
    };
    WebAudioSound.prototype.stop = function () {
        this.sourceNode.stop();
    };
    WebAudioSound.prototype.start = function (offset) {
        var _this = this;
        if (offset === void 0) { offset = 0; }
        this.sourceNode = this.context.createBufferSource();
        this.sourceNode.buffer = this.asset.buffer;
        this.sourceNode.connect(this.gainNode);
        this.sourceNode.onended = function () {
            _this._done = true;
        };
        this.sourceNode.playbackRate.value = this._speed;
        this.sourceNode.loop = this._loop;
        this.sourceNode.start(0, offset);
        this.startTime = this.context.currentTime - offset;
        this.pausedPosition = undefined;
        this._done = false;
    };
    return WebAudioSound;
}());
var WebAudioSoundDummy = /** @class */ (function () {
    function WebAudioSoundDummy(asset) {
        this.asset = asset;
        this.volume = 1;
        this.speed = 1;
        this.loop = false;
        this.duration = asset.buffer.duration;
        this.done = false;
        this.paused = false;
    }
    WebAudioSoundDummy.prototype.pause = function () {
        this.paused = true;
    };
    WebAudioSoundDummy.prototype.unpause = function () {
        this.paused = false;
    };
    WebAudioSoundDummy.prototype.seek = function (pos) {
        if (pos >= this.duration) {
            this.stop();
            return;
        }
    };
    WebAudioSoundDummy.prototype.stop = function () {
        this.done = true;
    };
    WebAudioSoundDummy.prototype.toWebAudioSound = function () {
        var sound = new WebAudioSound(this.asset);
        sound.volume = this.volume;
        sound.speed = this.speed;
        sound.loop = this.loop;
        sound.paused = this.paused;
        return sound;
    };
    return WebAudioSoundDummy;
}());
var AnchoredTexture = /** @class */ (function () {
    function AnchoredTexture(width, height, baseTexture) {
        this.baseTexture = baseTexture !== null && baseTexture !== void 0 ? baseTexture : new BasicTexture(width, height);
        this.anchorX = 0;
        this.anchorY = 0;
    }
    Object.defineProperty(AnchoredTexture.prototype, "width", {
        get: function () { return this.baseTexture.width; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AnchoredTexture.prototype, "height", {
        get: function () { return this.baseTexture.height; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AnchoredTexture.prototype, "immutable", {
        get: function () { return this.baseTexture.immutable; },
        set: function (value) { this.baseTexture.immutable = value; },
        enumerable: false,
        configurable: true
    });
    AnchoredTexture.prototype.clear = function () {
        this.baseTexture.clear();
    };
    AnchoredTexture.prototype.clone = function () {
        return AnchoredTexture.fromBaseTexture(this.baseTexture.clone(), this.anchorX, this.anchorY);
    };
    AnchoredTexture.prototype.free = function () {
        this.baseTexture.free();
    };
    AnchoredTexture.prototype.getLocalBounds = function (properties) {
        var _a, _b, _c, _d, _e, _f;
        var baseBounds = this.baseTexture.getLocalBounds(properties);
        baseBounds.x += this.getAdjustmentX((_a = properties.angle) !== null && _a !== void 0 ? _a : 0, (_b = properties.scaleX) !== null && _b !== void 0 ? _b : 1, (_c = properties.scaleY) !== null && _c !== void 0 ? _c : 1);
        baseBounds.y += this.getAdjustmentY((_d = properties.angle) !== null && _d !== void 0 ? _d : 0, (_e = properties.scaleX) !== null && _e !== void 0 ? _e : 1, (_f = properties.scaleY) !== null && _f !== void 0 ? _f : 1);
        return baseBounds;
    };
    AnchoredTexture.prototype.renderTo = function (texture, properties) {
        var _a, _b, _c, _d, _e;
        if (properties === void 0) { properties = {}; }
        properties.x = (_a = properties.x) !== null && _a !== void 0 ? _a : 0;
        properties.y = (_b = properties.y) !== null && _b !== void 0 ? _b : 0;
        properties.angle = (_c = properties.angle) !== null && _c !== void 0 ? _c : 0;
        properties.scaleX = (_d = properties.scaleX) !== null && _d !== void 0 ? _d : 1;
        properties.scaleY = (_e = properties.scaleY) !== null && _e !== void 0 ? _e : 1;
        var adjustmentX = this.getAdjustmentX(properties.angle, properties.scaleX, properties.scaleY);
        var adjustmentY = this.getAdjustmentY(properties.angle, properties.scaleX, properties.scaleY);
        properties.x += adjustmentX;
        properties.y += adjustmentY;
        this.baseTexture.renderTo(texture, properties);
    };
    AnchoredTexture.prototype.renderPIXIDisplayObject = function (displayObject) {
        this.baseTexture.renderPIXIDisplayObject(displayObject);
    };
    AnchoredTexture.prototype.subdivide = function (h, v, anchorX, anchorY) {
        var e_27, _a;
        if (anchorX === void 0) { anchorX = 0; }
        if (anchorY === void 0) { anchorY = 0; }
        var result = this.baseTexture.subdivide(h, v);
        try {
            for (var result_1 = __values(result), result_1_1 = result_1.next(); !result_1_1.done; result_1_1 = result_1.next()) {
                var subdivision = result_1_1.value;
                subdivision.texture = AnchoredTexture.fromBaseTexture(subdivision.texture, anchorX, anchorY);
            }
        }
        catch (e_27_1) { e_27 = { error: e_27_1 }; }
        finally {
            try {
                if (result_1_1 && !result_1_1.done && (_a = result_1.return)) _a.call(result_1);
            }
            finally { if (e_27) throw e_27.error; }
        }
        return result;
    };
    AnchoredTexture.prototype.toMask = function () {
        var mask = this.baseTexture.toMask();
        mask.offsetx = -Math.floor(this.anchorX * this.width);
        mask.offsety = -Math.floor(this.anchorY * this.height);
        return mask;
    };
    AnchoredTexture.prototype.transform = function (properties) {
        var transformedBaseTexture = this.baseTexture.transform(properties);
        return AnchoredTexture.fromBaseTexture(transformedBaseTexture, this.anchorX, this.anchorY);
    };
    AnchoredTexture.prototype.getAdjustmentX = function (angle, scaleX, scaleY) {
        var ax = Math.floor(this.anchorX * this.width) * scaleX;
        var ay = Math.floor(this.anchorY * this.height) * scaleY;
        var rotatedAndScaled_ax = (-ax) * M.cos(angle) - (-ay) * M.sin(angle);
        return rotatedAndScaled_ax;
    };
    AnchoredTexture.prototype.getAdjustmentY = function (angle, scaleX, scaleY) {
        var ax = Math.floor(this.anchorX * this.width) * scaleX;
        var ay = Math.floor(this.anchorY * this.height) * scaleY;
        var rotatedAndScaled_ay = (-ax) * M.sin(angle) + (-ay) * M.cos(angle);
        return rotatedAndScaled_ay;
    };
    return AnchoredTexture;
}());
(function (AnchoredTexture) {
    function fromBaseTexture(baseTexture, anchorX, anchorY) {
        if (anchorX === void 0) { anchorX = 0; }
        if (anchorY === void 0) { anchorY = 0; }
        var result = new AnchoredTexture(0, 0, baseTexture);
        result.anchorX = anchorX;
        result.anchorY = anchorY;
        return result;
    }
    AnchoredTexture.fromBaseTexture = fromBaseTexture;
})(AnchoredTexture || (AnchoredTexture = {}));
/// <reference path="./basicTexture.ts"/>
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
        texture.renderPIXIDisplayObject(this.graphics);
    };
    Draw.eraseRect = function (texture, x, y, width, height) {
        var newTexture = texture.clone();
        var maskTexture = Texture.filledRect(width, height, 0xFFFFFF);
        var mask = new MaskFilter({
            type: 'local',
            mask: maskTexture,
            offsetX: x, offsetY: y,
            invert: true,
        });
        texture.clear();
        newTexture.renderTo(texture, {
            x: 0, y: 0,
            filters: [mask],
        });
    };
    Draw.circleOutline = function (texture, x, y, radius, alignment, brush) {
        if (alignment === void 0) { alignment = this.ALIGNMENT_INNER; }
        if (brush === void 0) { brush = Draw.brush; }
        this.graphics.lineStyle(brush.thickness, brush.color, brush.alpha, alignment);
        this.graphics.clear();
        this.graphics.beginFill(0, 0);
        this.graphics.drawCircle(x, y, radius);
        this.graphics.endFill();
        texture.renderPIXIDisplayObject(this.graphics);
    };
    Draw.circleSolid = function (texture, x, y, radius, brush) {
        if (brush === void 0) { brush = Draw.brush; }
        this.graphics.lineStyle(0, 0, 0);
        this.graphics.clear();
        this.graphics.beginFill(brush.color, brush.alpha);
        this.graphics.drawCircle(x, y, radius);
        this.graphics.endFill();
        texture.renderPIXIDisplayObject(this.graphics);
    };
    Draw.pixel = function (texture, x, y, brush) {
        if (brush === void 0) { brush = Draw.brush; }
        Draw.PIXEL_TEXTURE.renderTo(texture, {
            x: x, y: y,
            tint: brush.color,
            alpha: brush.alpha,
        });
    };
    Draw.line = function (texture, x1, y1, x2, y2, brush) {
        if (brush === void 0) { brush = Draw.brush; }
        this.graphics.lineStyle(brush.thickness, brush.color, brush.alpha, this.ALIGNMENT_MIDDLE);
        this.graphics.clear();
        this.graphics.moveTo(x1, y1);
        this.graphics.lineTo(x2, y2);
        texture.renderPIXIDisplayObject(this.graphics);
    };
    Draw.rectangleOutline = function (texture, x, y, width, height, alignment, brush) {
        if (alignment === void 0) { alignment = this.ALIGNMENT_INNER; }
        if (brush === void 0) { brush = Draw.brush; }
        this.graphics.lineStyle(brush.thickness, brush.color, brush.alpha, alignment);
        this.graphics.clear();
        this.graphics.beginFill(0, 0);
        this.graphics.drawRect(x, y, width, height);
        this.graphics.endFill();
        texture.renderPIXIDisplayObject(this.graphics);
    };
    Draw.rectangleSolid = function (texture, x, y, width, height, brush) {
        if (brush === void 0) { brush = Draw.brush; }
        this.graphics.lineStyle(0, 0, 0);
        this.graphics.clear();
        this.graphics.beginFill(brush.color, brush.alpha);
        this.graphics.drawRect(x, y, width, height);
        this.graphics.endFill();
        texture.renderPIXIDisplayObject(this.graphics);
    };
    Object.defineProperty(Draw, "PIXEL_TEXTURE", {
        get: function () {
            if (!this._PIXEL_TEXTURE)
                this._PIXEL_TEXTURE = Texture.filledRect(1, 1, 0xFFFFFF);
            return this._PIXEL_TEXTURE;
        },
        enumerable: false,
        configurable: true
    });
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
var EmptyTexture = /** @class */ (function () {
    function EmptyTexture() {
    }
    Object.defineProperty(EmptyTexture.prototype, "width", {
        get: function () { return 0; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(EmptyTexture.prototype, "height", {
        get: function () { return 0; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(EmptyTexture.prototype, "immutable", {
        get: function () { return true; },
        enumerable: false,
        configurable: true
    });
    EmptyTexture.prototype.clear = function () { };
    EmptyTexture.prototype.clone = function () {
        return new EmptyTexture();
    };
    EmptyTexture.prototype.free = function () { };
    EmptyTexture.prototype.getLocalBounds = function (properties) {
        return rect(0, 0, 0, 0);
    };
    EmptyTexture.prototype.renderTo = function (texture, properties) {
        if (properties === void 0) { properties = {}; }
    };
    EmptyTexture.prototype.renderPIXIDisplayObject = function (displayObject) { };
    EmptyTexture.prototype.subdivide = function (h, v) {
        var result = [];
        for (var i = 0; i < h * v; i++) {
            result.push({
                texture: new EmptyTexture(),
                x: 0, y: 0,
            });
        }
        return result;
    };
    EmptyTexture.prototype.toMask = function () {
        return {
            renderTexture: Utils.NOOP_RENDERTEXTURE,
            offsetx: 0, offsety: 0,
        };
    };
    EmptyTexture.prototype.transform = function (properties) {
        return new EmptyTexture();
    };
    return EmptyTexture;
}());
var Texture;
(function (Texture) {
    function filledCircle(radius, fillColor, fillAlpha) {
        if (fillAlpha === void 0) { fillAlpha = 1; }
        var result = new BasicTexture(radius * 2, radius * 2);
        Draw.circleSolid(result, radius, radius, radius, { color: fillColor, alpha: fillAlpha, thickness: 0 });
        return result;
    }
    Texture.filledCircle = filledCircle;
    function filledRect(width, height, fillColor, fillAlpha) {
        if (fillAlpha === void 0) { fillAlpha = 1; }
        var result = new BasicTexture(width, height);
        Draw.fill(result, { color: fillColor, alpha: fillAlpha, thickness: 0 });
        return result;
    }
    Texture.filledRect = filledRect;
    function fromPixiTexture(pixiTexture) {
        var sprite = new PIXI.Sprite(pixiTexture);
        var texture = new AnchoredTexture(pixiTexture.width, pixiTexture.height);
        texture.anchorX = pixiTexture.defaultAnchor.x;
        texture.anchorY = pixiTexture.defaultAnchor.y;
        sprite.x = texture.anchorX * texture.width;
        sprite.y = texture.anchorY * texture.height;
        texture.renderPIXIDisplayObject(sprite);
        texture.immutable = true;
        return texture;
    }
    Texture.fromPixiTexture = fromPixiTexture;
    Texture.NONE = new EmptyTexture();
    function outlineRect(width, height, outlineColor, outlineAlpha, outlineThickness) {
        if (outlineAlpha === void 0) { outlineAlpha = 1; }
        if (outlineThickness === void 0) { outlineThickness = 1; }
        var result = new BasicTexture(width, height);
        Draw.rectangleOutline(result, 0, 0, width, height, Draw.ALIGNMENT_INNER, { color: outlineColor, alpha: outlineAlpha, thickness: outlineThickness });
        return result;
    }
    Texture.outlineRect = outlineRect;
    function setFilterProperties(filter, posx, posy, dimx, dimy) {
        filter.setTexturePosition(posx, posy);
        filter.setTextureDimensions(dimx, dimy);
    }
    Texture.setFilterProperties = setFilterProperties;
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
            enumerable: false,
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
/// <reference path="./textureFilter.ts" />
var MaskFilter = /** @class */ (function (_super) {
    __extends(MaskFilter, _super);
    function MaskFilter(config) {
        var _a, _b, _c;
        var _this = _super.call(this, {
            uniforms: {
                "sampler2D mask": undefined,
                "float maskWidth": 0,
                "float maskHeight": 0,
                "float maskX": 0,
                "float maskY": 0,
                "bool invert": false
            },
            code: "\n                vec2 vTextureCoordMask = vTextureCoord * inputSize.xy / vec2(maskWidth, maskHeight) - vec2(maskX, maskY) / vec2(maskWidth, maskHeight);\n                if (vTextureCoordMask.x >= 0.0 && vTextureCoordMask.x < 1.0 && vTextureCoordMask.y >= 0.0 && vTextureCoordMask.y < 1.0) {\n                    float a = texture2D(mask, vTextureCoordMask).a;\n                    outp *= invert ? 1.0-a : a;\n                } else {\n                    outp.a = invert ? inp.a : 0.0;\n                }\n            "
        }) || this;
        _this.type = config.type;
        _this.offsetX = (_a = config.offsetX) !== null && _a !== void 0 ? _a : 0;
        _this.offsetY = (_b = config.offsetY) !== null && _b !== void 0 ? _b : 0;
        _this.invert = (_c = config.invert) !== null && _c !== void 0 ? _c : false;
        _this.setMask(config.mask);
        return _this;
    }
    Object.defineProperty(MaskFilter.prototype, "invert", {
        get: function () { return this.getUniform('invert'); },
        set: function (value) { this.setUniform('invert', value); },
        enumerable: false,
        configurable: true
    });
    MaskFilter.prototype.setMask = function (texture) {
        var mask = texture.toMask();
        this.setUniform('mask', mask.renderTexture);
        this.setUniform('maskWidth', mask.renderTexture.width);
        this.setUniform('maskHeight', mask.renderTexture.height);
        this.maskOffsetX = mask.offsetx;
        this.maskOffsetY = mask.offsety;
    };
    // Used by Texture in render
    MaskFilter.prototype.setTexturePosition = function (posx, posy) {
        _super.prototype.setTexturePosition.call(this, posx, posy);
        this.setMaskPosition(posx, posy);
    };
    MaskFilter.prototype.setMaskPosition = function (textureX, textureY) {
        var totalOffsetX = this.offsetX + this.maskOffsetX;
        var totalOffsetY = this.offsetY + this.maskOffsetY;
        if (this.type === 'global') {
            this.setUniform('maskX', totalOffsetX);
            this.setUniform('maskY', totalOffsetY);
        }
        else if (this.type === 'local') {
            this.setUniform('maskX', textureX + totalOffsetX);
            this.setUniform('maskY', textureY + totalOffsetY);
        }
    };
    return MaskFilter;
}(TextureFilter));
var Mask;
(function (Mask) {
    var _maskFilter;
    function SHARED(mask, type, offsetX, offsetY, invert) {
        if (type === void 0) { type = 'global'; }
        if (offsetX === void 0) { offsetX = 0; }
        if (offsetY === void 0) { offsetY = 0; }
        if (invert === void 0) { invert = false; }
        if (!_maskFilter) {
            _maskFilter = new MaskFilter({ mask: mask, type: type, offsetX: offsetX, offsetY: offsetY, invert: invert });
        }
        else {
            _maskFilter.setMask(mask);
            _maskFilter.type = type;
            _maskFilter.offsetX = offsetX;
            _maskFilter.offsetY = offsetY;
            _maskFilter.invert = invert;
        }
        return _maskFilter;
    }
    Mask.SHARED = SHARED;
    function getTextureMaskForWorldObject(mask, worldObject) {
        var _a;
        if (!mask || !mask.texture)
            return undefined;
        var x = 0;
        var y = 0;
        if (mask.type === 'screen') {
            x = mask.offsetx;
            y = mask.offsety;
        }
        else if (mask.type === 'local') {
            x = worldObject.renderScreenX + mask.offsetx;
            y = worldObject.renderScreenY + mask.offsety;
        }
        else if (mask.type === 'world') {
            var worldx = worldObject.world ? -Math.round(worldObject.world.camera.worldOffsetX) : 0;
            var worldy = worldObject.world ? -Math.round(worldObject.world.camera.worldOffsetY) : 0;
            x = worldx + mask.offsetx;
            y = worldy + mask.offsety;
        }
        return {
            texture: mask.texture,
            x: x, y: y,
            invert: (_a = mask.invert) !== null && _a !== void 0 ? _a : false,
        };
    }
    Mask.getTextureMaskForWorldObject = getTextureMaskForWorldObject;
})(Mask || (Mask = {}));
// Unused for now
var shaderMatrixMethods = "\n    float determinant(float m) {\n        return m;\n    }\n\n    float determinant(mat2 m) {\n        return m[0][0] * m[1][1] - m[0][1] * m[1][0]; \n    }\n\n    float determinant(mat3 m) {\n        return m[0][0] * (m[2][2]*m[1][1] - m[1][2]*m[2][1])\n            + m[0][1] * (m[1][2]*m[2][0] - m[2][2]*m[1][0])\n            + m[0][2] * (m[2][1]*m[1][0] - m[1][1]*m[2][0]);\n    }\n\n    float determinant(mat4 m) {\n        float\n            b00 = m[0][0] * m[1][1] - m[0][1] * m[1][0],\n            b01 = m[0][0] * m[1][2] - m[0][2] * m[1][0],\n            b02 = m[0][0] * m[1][3] - m[0][3] * m[1][0],\n            b03 = m[0][1] * m[1][2] - m[0][2] * m[1][1],\n            b04 = m[0][1] * m[1][3] - m[0][3] * m[1][1],\n            b05 = m[0][2] * m[1][3] - m[0][3] * m[1][2],\n            b06 = m[2][0] * m[3][1] - m[2][1] * m[3][0],\n            b07 = m[2][0] * m[3][2] - m[2][2] * m[3][0],\n            b08 = m[2][0] * m[3][3] - m[2][3] * m[3][0],\n            b09 = m[2][1] * m[3][2] - m[2][2] * m[3][1],\n            b10 = m[2][1] * m[3][3] - m[2][3] * m[3][1],\n            b11 = m[2][2] * m[3][3] - m[2][3] * m[3][2];\n        return b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;\n    }\n\n    mat4 transpose(mat4 m) {\n        return mat4(\n            m[0][0], m[1][0], m[2][0], m[3][0],\n            m[0][1], m[1][1], m[2][1], m[3][1],\n            m[0][2], m[1][2], m[2][2], m[3][2],\n            m[0][3], m[1][3], m[2][3], m[3][3]\n        );\n    }\n\n    mat4 inverse(mat4 inp) {\n        mat4 cofactors = mat4(\n            determinant(mat3( inp[1].yzw, inp[2].yzw, inp[3].yzw)), \n            -determinant(mat3(inp[1].xzw, inp[2].xzw, inp[3].xzw)),\n            determinant(mat3( inp[1].xyw, inp[2].xyw, inp[3].xyw)),\n            -determinant(mat3(inp[1].xyz, inp[2].xyz, inp[3].xyz)),\n            \n            -determinant(mat3(inp[0].yzw, inp[2].yzw, inp[3].yzw)),\n            determinant(mat3( inp[0].xzw, inp[2].xzw, inp[3].xzw)),\n            -determinant(mat3(inp[0].xyw, inp[2].xyw, inp[3].xyw)),\n            determinant(mat3( inp[0].xyz, inp[2].xyz, inp[3].xyz)),\n            \n            determinant(mat3( inp[0].yzw, inp[1].yzw, inp[3].yzw)),\n            -determinant(mat3(inp[0].xzw, inp[1].xzw, inp[3].xzw)),\n            determinant(mat3( inp[0].xyw, inp[1].xyw, inp[3].xyw)),\n            -determinant(mat3(inp[0].xyz, inp[1].xyz, inp[3].xyz)),\n\n            -determinant(mat3(inp[0].yzw, inp[1].yzw, inp[2].yzw)),\n            determinant(mat3( inp[0].xzw, inp[1].xzw, inp[2].xzw)),\n            -determinant(mat3(inp[0].xyw, inp[1].xyw, inp[2].xyw)),\n            determinant(mat3( inp[0].xyz, inp[1].xyz, inp[2].xyz))\n        );\n        return transpose(cofactors) / determinant(inp);\n    }\n";
/// <reference path="./textureFilter.ts"/>
var WarpFilter = /** @class */ (function (_super) {
    __extends(WarpFilter, _super);
    function WarpFilter() {
        return _super.call(this, {
            uniforms: {
                'float x1': 0,
                'float y1': 0,
                'float x2': 1,
                'float y2': 0,
                'float x3': 0,
                'float y3': 1,
                'float x4': 1,
                'float y4': 1,
            },
            code: "\n                float a1 = width * (x1);\n                float b1 = width * (x2 - x1);\n                float c1 = width * (x3 - x1);\n                float d1 = width * (x1 + x4 - x2 - x3);\n                float a2 = height * (y1);\n                float b2 = height * (y2 - y1);\n                float c2 = height * (y3 - y1);\n                float d2 = height * (y1 + y4 - y2 - y3);\n\n                float a = c2*d1 - c1*d2;\n                float b = a2*d1 - a1*d2 + b1*c2 - b2*c1 + x*d2 - y*d1;\n                float c = a2*b1 - a1*b2 + x*b2 - y*b1;\n                float disc = b*b - 4.0*a*c;\n\n                float py = -1.0;\n                if ((a == 0.0 && b == 0.0) || disc < 0.0) {\n                    outp.a = 0.0;\n                } else if (a == 0.0) {\n                    py = -c/b;\n                } else {\n                    float pos = (-b + sqrt(disc)) / (2.0 * a);\n                    float neg = (-b - sqrt(disc)) / (2.0 * a);\n                    if (0.0 <= pos && pos <= 1.0) {\n                        py = pos;\n                    } else if (0.0 <= neg && neg <= 1.0) {\n                        py = neg; //-0.02\n                    }\n                }\n\n                float denom = b1 + d1*py;\n                if (py < 0.0 || 1.0 < py || denom == 0.0) {\n                    outp.a = 0.0;\n                } else {\n                    float px = (x - a1 - c1*py) / denom;\n                    if (px < 0.0 || 1.0 < px) { \n                        outp.a = 0.0;\n                    } else {\n                        outp = getColor(px*84.0, py*64.0);\n                    }\n                }\n            "
        }) || this;
    }
    WarpFilter.prototype.setVertex1 = function (x, y) {
        this.setUniform('x1', x);
        this.setUniform('y1', y);
    };
    WarpFilter.prototype.setVertex2 = function (x, y) {
        this.setUniform('x2', x);
        this.setUniform('y2', y);
    };
    WarpFilter.prototype.setVertex3 = function (x, y) {
        this.setUniform('x3', x);
        this.setUniform('y3', y);
    };
    WarpFilter.prototype.setVertex4 = function (x, y) {
        this.setUniform('x4', x);
        this.setUniform('y4', y);
    };
    return WarpFilter;
}(TextureFilter));
var SB;
(function (SB) {
    var Node = /** @class */ (function () {
        function Node() {
        }
        Node.prototype.build = function () {
            error('Tried to build base Node class. Did you override build()?');
            return undefined;
        };
        Node.prototype.getUniforms = function () {
            return {};
        };
        return Node;
    }());
    SB.Node = Node;
    var Statement = /** @class */ (function (_super) {
        __extends(Statement, _super);
        function Statement() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return Statement;
    }(Node));
    SB.Statement = Statement;
    var Expression = /** @class */ (function (_super) {
        __extends(Expression, _super);
        function Expression(type) {
            var _this = _super.call(this) || this;
            _this.type = type;
            return _this;
        }
        return Expression;
    }(Node));
    SB.Expression = Expression;
    var FloatNode = /** @class */ (function (_super) {
        __extends(FloatNode, _super);
        function FloatNode(value) {
            var _this = _super.call(this, 'float') || this;
            _this.value = value;
            return _this;
        }
        FloatNode.prototype.build = function () {
            if (Math.floor(this.value) === this.value) {
                return this.value + ".0";
            }
            return "" + this.value;
        };
        return FloatNode;
    }(Expression));
    SB.FloatNode = FloatNode;
    var UniformNode = /** @class */ (function (_super) {
        __extends(UniformNode, _super);
        function UniformNode(type, name) {
            var _this = _super.call(this, type) || this;
            _this.name = name;
            return _this;
        }
        UniformNode.prototype.build = function () {
            return this.name;
        };
        UniformNode.prototype.getUniforms = function () {
            var _a;
            return _a = {},
                _a[this.name] = this.type,
                _a;
        };
        return UniformNode;
    }(Expression));
    SB.UniformNode = UniformNode;
    function uniform(type, name) {
        return new UniformNode(type, name);
    }
    SB.uniform = uniform;
    function float(nameOrValue) {
        if (_.isNumber(nameOrValue)) {
            return new FloatNode(nameOrValue);
        }
        return new UniformNode('float', nameOrValue);
    }
    SB.float = float;
    var AddNode = /** @class */ (function (_super) {
        __extends(AddNode, _super);
        function AddNode(type, expr1, expr2) {
            var _this = _super.call(this, type) || this;
            _this.expr1 = expr1;
            _this.expr2 = expr2;
            return _this;
        }
        AddNode.prototype.build = function () {
            return "(" + this.expr1.build() + " + " + this.expr2.build() + ")";
        };
        AddNode.prototype.getUniforms = function () {
            return combineUniformTypeDicts(this.expr1.getUniforms(), this.expr2.getUniforms());
        };
        return AddNode;
    }(Expression));
    SB.AddNode = AddNode;
    function add(expr1, expr2) {
        return new AddNode(expr1.type, expr1, expr2);
    }
    SB.add = add;
    var SubtractNode = /** @class */ (function (_super) {
        __extends(SubtractNode, _super);
        function SubtractNode(type, expr1, expr2) {
            var _this = _super.call(this, type) || this;
            _this.expr1 = expr1;
            _this.expr2 = expr2;
            return _this;
        }
        SubtractNode.prototype.build = function () {
            return "(" + this.expr1.build() + " - " + this.expr2.build() + ")";
        };
        SubtractNode.prototype.getUniforms = function () {
            return combineUniformTypeDicts(this.expr1.getUniforms(), this.expr2.getUniforms());
        };
        return SubtractNode;
    }(Expression));
    SB.SubtractNode = SubtractNode;
    function subtract(expr1, expr2) {
        return new SubtractNode(expr1.type, expr1, expr2);
    }
    SB.subtract = subtract;
    var MultiplyNode = /** @class */ (function (_super) {
        __extends(MultiplyNode, _super);
        function MultiplyNode(type, expr1, expr2) {
            var _this = _super.call(this, type) || this;
            _this.expr1 = expr1;
            _this.expr2 = expr2;
            return _this;
        }
        MultiplyNode.prototype.build = function () {
            return "(" + this.expr1.build() + " * " + this.expr2.build() + ")";
        };
        MultiplyNode.prototype.getUniforms = function () {
            return combineUniformTypeDicts(this.expr1.getUniforms(), this.expr2.getUniforms());
        };
        return MultiplyNode;
    }(Expression));
    SB.MultiplyNode = MultiplyNode;
    function multiply(expr1, expr2) {
        if (expr1.type === 'float' && expr2.type === 'float') {
            return new MultiplyNode('float', expr1, expr2);
        }
        return new MultiplyNode('vec4', expr1, expr2);
    }
    SB.multiply = multiply;
    var DivideNode = /** @class */ (function (_super) {
        __extends(DivideNode, _super);
        function DivideNode(type, expr1, expr2) {
            var _this = _super.call(this, type) || this;
            _this.expr1 = expr1;
            _this.expr2 = expr2;
            return _this;
        }
        DivideNode.prototype.build = function () {
            return "(" + this.expr1.build() + " / " + this.expr2.build() + ")";
        };
        DivideNode.prototype.getUniforms = function () {
            return combineUniformTypeDicts(this.expr1.getUniforms(), this.expr2.getUniforms());
        };
        return DivideNode;
    }(Expression));
    SB.DivideNode = DivideNode;
    function divide(expr1, expr2) {
        if (expr1.type === 'float' && expr2.type === 'float') {
            return new DivideNode('float', expr1, expr2);
        }
        return new DivideNode('vec4', expr1, expr2);
    }
    SB.divide = divide;
    var LessThanNode = /** @class */ (function (_super) {
        __extends(LessThanNode, _super);
        function LessThanNode(expr1, expr2) {
            var _this = _super.call(this, 'bool') || this;
            _this.expr1 = expr1;
            _this.expr2 = expr2;
            return _this;
        }
        LessThanNode.prototype.build = function () {
            return "(" + this.expr1.build() + " < " + this.expr2.build() + ")";
        };
        LessThanNode.prototype.getUniforms = function () {
            return combineUniformTypeDicts(this.expr1.getUniforms(), this.expr2.getUniforms());
        };
        return LessThanNode;
    }(Expression));
    SB.LessThanNode = LessThanNode;
    function lessThan(expr1, expr2) {
        return new LessThanNode(expr1, expr2);
    }
    SB.lessThan = lessThan;
    var GreaterThanNode = /** @class */ (function (_super) {
        __extends(GreaterThanNode, _super);
        function GreaterThanNode(expr1, expr2) {
            var _this = _super.call(this, 'bool') || this;
            _this.expr1 = expr1;
            _this.expr2 = expr2;
            return _this;
        }
        GreaterThanNode.prototype.build = function () {
            return "(" + this.expr1.build() + " > " + this.expr2.build() + ")";
        };
        GreaterThanNode.prototype.getUniforms = function () {
            return combineUniformTypeDicts(this.expr1.getUniforms(), this.expr2.getUniforms());
        };
        return GreaterThanNode;
    }(Expression));
    SB.GreaterThanNode = GreaterThanNode;
    function greaterThan(expr1, expr2) {
        return new GreaterThanNode(expr1, expr2);
    }
    SB.greaterThan = greaterThan;
    var IfNode = /** @class */ (function (_super) {
        __extends(IfNode, _super);
        function IfNode(condition, trueStatements, falseStatements) {
            var _this = _super.call(this) || this;
            _this.condition = condition;
            _this.trueStatements = trueStatements;
            _this.falseStatements = falseStatements;
            return _this;
        }
        IfNode.prototype.build = function () {
            var result = "if (" + this.condition.build() + ") {\n                " + this.trueStatements.map(function (s) { return s.build(); }).join('\n') + "\n            }";
            if (!_.isEmpty(this.falseStatements)) {
                result += " else {\n                    " + this.falseStatements.map(function (s) { return s.build(); }).join('\n') + "\n                }";
            }
            return result;
        };
        IfNode.prototype.getUniforms = function () {
            var _a;
            return combineUniformTypeDicts.apply(void 0, __spread([this.condition.getUniforms()], this.trueStatements.map(function (s) { return s.getUniforms(); }), ((_a = this.falseStatements) !== null && _a !== void 0 ? _a : []).map(function (s) { return s.getUniforms(); })));
        };
        return IfNode;
    }(Statement));
    SB.IfNode = IfNode;
    function ifThen(condition, trueStatements, falseStatements) {
        return new IfNode(condition, trueStatements, falseStatements);
    }
    SB.ifThen = ifThen;
    var InputColorNode = /** @class */ (function (_super) {
        __extends(InputColorNode, _super);
        function InputColorNode() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        InputColorNode.prototype.build = function () {
            return "inp";
        };
        return InputColorNode;
    }(Expression));
    SB.InputColorNode = InputColorNode;
    function inputColor() {
        return new InputColorNode('vec4');
    }
    SB.inputColor = inputColor;
    var SetOutputColorNode = /** @class */ (function (_super) {
        __extends(SetOutputColorNode, _super);
        function SetOutputColorNode(expr) {
            var _this = _super.call(this) || this;
            _this.expr = expr;
            return _this;
        }
        SetOutputColorNode.prototype.build = function () {
            return "outp = " + this.expr.build() + ";";
        };
        SetOutputColorNode.prototype.getUniforms = function () {
            return this.expr.getUniforms();
        };
        return SetOutputColorNode;
    }(Statement));
    SB.SetOutputColorNode = SetOutputColorNode;
    function setOutputColor(expr) {
        return new SetOutputColorNode(expr);
    }
    SB.setOutputColor = setOutputColor;
    function combineUniformTypeDicts(uniformTypes) {
        var e_28, _a;
        var uniformTypesToAdd = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            uniformTypesToAdd[_i - 1] = arguments[_i];
        }
        var result = _.clone(uniformTypes);
        try {
            for (var uniformTypesToAdd_1 = __values(uniformTypesToAdd), uniformTypesToAdd_1_1 = uniformTypesToAdd_1.next(); !uniformTypesToAdd_1_1.done; uniformTypesToAdd_1_1 = uniformTypesToAdd_1.next()) {
                var uniformTypesList = uniformTypesToAdd_1_1.value;
                for (var uniform_1 in uniformTypesList) {
                    if (uniform_1 in result && result[uniform_1] !== uniformTypesList[uniform_1]) {
                        error('Multiple uniforms defined with conflicting types:', uniform_1, result[uniform_1], uniformTypesList[uniform_1]);
                        return undefined;
                    }
                    result[uniform_1] = uniformTypesList[uniform_1];
                }
            }
        }
        catch (e_28_1) { e_28 = { error: e_28_1 }; }
        finally {
            try {
                if (uniformTypesToAdd_1_1 && !uniformTypesToAdd_1_1.done && (_a = uniformTypesToAdd_1.return)) _a.call(uniformTypesToAdd_1);
            }
            finally { if (e_28) throw e_28.error; }
        }
        return result;
    }
    SB.combineUniformTypeDicts = combineUniformTypeDicts;
})(SB || (SB = {}));
/// <reference path="./node.ts" />
var ShaderBuilder = /** @class */ (function () {
    function ShaderBuilder() {
    }
    ShaderBuilder.build = function (rootNode, uniformDefaultsByName) {
        var rootNodeList = _.isArray(rootNode) ? rootNode : [rootNode];
        var uniforms = {};
        var uniformTypes = this.getUniformTypes(rootNodeList);
        for (var name_4 in uniformTypes) {
            var type = uniformTypes[name_4];
            var value = uniformDefaultsByName[name_4];
            if (value === undefined)
                continue;
            if (!this.typeCheck(type, value)) {
                error('Shader failed type-checking type', type, 'against default value', value);
                return undefined;
            }
            uniforms[type + " " + name_4] = uniformDefaultsByName[name_4];
        }
        return new TextureFilter({
            code: rootNodeList.map(function (rootNode) { return rootNode.build(); }).join('\n'),
            uniforms: uniforms
        });
    };
    ShaderBuilder.getUniformTypes = function (rootNodeList) {
        var e_29, _a;
        var result = {};
        try {
            for (var rootNodeList_1 = __values(rootNodeList), rootNodeList_1_1 = rootNodeList_1.next(); !rootNodeList_1_1.done; rootNodeList_1_1 = rootNodeList_1.next()) {
                var rootNode = rootNodeList_1_1.value;
                result = SB.combineUniformTypeDicts(result, rootNode.getUniforms());
            }
        }
        catch (e_29_1) { e_29 = { error: e_29_1 }; }
        finally {
            try {
                if (rootNodeList_1_1 && !rootNodeList_1_1.done && (_a = rootNodeList_1.return)) _a.call(rootNodeList_1);
            }
            finally { if (e_29) throw e_29.error; }
        }
        return result;
    };
    ShaderBuilder.typeCheck = function (type, value) {
        if (type === 'float')
            return _.isNumber(value) && isFinite(value);
        if (type === 'vec4')
            return _.isArray(value) && value.length === 4;
        return false;
    };
    return ShaderBuilder;
}());
var filter;
var SB;
(function (SB) {
    var ast = SB.setOutputColor(SB.multiply(SB.inputColor(), SB.float('amount')));
    filter = ShaderBuilder.build(ast, { amount: 0 });
})(SB || (SB = {}));
function testSB() {
    global.game.menuSystem.currentMenu.addWorldObject(new Sprite({
        texture: 'player',
        x: global.gameWidth / 2,
        y: global.gameHeight / 2,
        effects: { post: { filters: [filter] } }
    }));
}
/// <reference path="../worldObject/sprite/sprite.ts" />
var DialogBox = /** @class */ (function (_super) {
    __extends(DialogBox, _super);
    function DialogBox(config) {
        var _this = _super.call(this, config) || this;
        _this.textAreaFull = config.textAreaFull;
        _this.textAreaPortrait = config.textAreaPortrait;
        _this.portraitPosition = vec2(config.portraitPosition);
        _this.startSound = config.startSound;
        _this.speakSound = config.speakSound;
        if (config.nameProps) {
            _this.nameTexture = config.nameProps.texture;
            _this.namePosition = vec2(config.nameProps.position);
            _this.nameTextOffset = vec2(config.nameProps.textOffset);
        }
        _this.isShowingPortrait = false;
        _this.isShowingName = false;
        _this.done = true;
        _this.spriteText = _this.addChild(new SpriteText({ font: config.dialogFont }));
        _this.spriteTextOffset = 0;
        _this.portraitSprite = _this.addChild(new Sprite());
        _this.showPortrait('none');
        _this.nameSprite = _this.addChild(new Sprite({ texture: _this.nameTexture }));
        _this.nameText = _this.nameSprite.addChild(new SpriteText({ font: config.dialogFont, anchor: Vector2.CENTER }));
        _this.showName(undefined);
        _this.characterTimer = new Timer(0.05, function () { return _this.advanceCharacter(); }, true);
        _this.speakSoundTimer = new Timer(0.05, function () {
            var p = _this.getDialogProgression() < 0.9 ? 0.85 : 1; // 85% normally, but 100% if dialog is close to ending
            if (_this.speakSound && Debug.SKIP_RATE < 2 && !_this.isPageComplete() && Random.boolean(p)) {
                var sound = _this.world.playSound(_this.speakSound);
                sound.speed = Random.float(0.95, 1.05);
            }
        }, true);
        return _this;
    }
    Object.defineProperty(DialogBox.prototype, "textArea", {
        get: function () { return this.isShowingPortrait ? this.textAreaPortrait : this.textAreaFull; },
        enumerable: false,
        configurable: true
    });
    DialogBox.prototype.update = function () {
        _super.prototype.update.call(this);
        // Visibility must be set before dialog progression to avoid a 1-frame flicker.
        this.setVisible(!this.done);
        this.spriteText.setVisible(!this.done);
        this.portraitSprite.setVisible(!this.done && this.isShowingPortrait);
        this.nameSprite.setVisible(!this.done && this.isShowingName);
        if (!this.done) {
            this.updateDialogProgression();
            this.speakSoundTimer.update(this.delta);
        }
    };
    DialogBox.prototype.updateDialogProgression = function () {
        this.characterTimer.update(this.delta);
        if (Input.justDown(Input.GAME_ADVANCE_CUTSCENE)) {
            Input.consume(Input.GAME_ADVANCE_CUTSCENE);
            this.advanceDialog();
        }
    };
    DialogBox.prototype.render = function (texture, x, y) {
        _super.prototype.render.call(this, texture, x, y);
        if (this.portraitSprite.isVisible()) {
            this.setPortraitSpriteProperties();
        }
        if (this.nameSprite.isVisible()) {
            this.setNameSpriteProperties();
        }
        this.setSpriteTextProperties();
    };
    DialogBox.prototype.advanceDialog = function () {
        if (this.isPageComplete()) {
            this.advancePage();
        }
        else {
            this.completePage();
        }
    };
    DialogBox.prototype.showDialog = function (dialogText) {
        this.spriteText.clear();
        this.spriteTextOffset = 0;
        this.done = false;
        this.spriteText.setText(dialogText);
        this.spriteText.visibleCharCount = 0;
        this.spriteTextOffset = 0;
        this.characterTimer.reset();
        this.advanceCharacter(); // Advance character once to start the dialog with one displayed character.
        if (this.startSound) {
            this.world.playSound(this.startSound);
        }
    };
    DialogBox.prototype.addToDialog = function (additionalText) {
        this.done = false;
        var newCurrentText = this.spriteText.getCurrentText() + additionalText;
        var newVisibleCharCount = this.spriteText.visibleCharCount;
        this.spriteText.setText(newCurrentText);
        this.spriteText.visibleCharCount = newVisibleCharCount;
        this.characterTimer.reset();
        this.advanceCharacter(); // Advance character once to start the dialog with one displayed character.
        if (this.startSound) {
            this.world.playSound(this.startSound);
        }
    };
    DialogBox.prototype.showPortrait = function (portrait) {
        this.portraitSprite.setTexture(portrait);
        this.isShowingPortrait = !AssetCache.isNoneTexture(portrait);
        this.spriteText.maxWidth = this.textArea.width;
    };
    DialogBox.prototype.showName = function (name) {
        if (!name) {
            this.isShowingName = false;
            return;
        }
        this.isShowingName = true;
        this.nameText.setText(name);
    };
    DialogBox.prototype.setSpeakSound = function (key) {
        this.speakSound = key;
    };
    DialogBox.prototype.complete = function () {
        while (!this.done) {
            this.completePage();
            this.advancePage();
        }
    };
    DialogBox.prototype.advanceCharacter = function () {
        if (!this.isPageComplete()) {
            this.spriteText.visibleCharCount++;
        }
    };
    DialogBox.prototype.advancePage = function () {
        if (this.isDialogComplete()) {
            this.done = true;
        }
        else {
            this.spriteTextOffset = this.spriteText.getTextHeight();
        }
    };
    DialogBox.prototype.completePage = function () {
        var iters = 0;
        while (!this.isPageComplete() && iters < DialogBox.MAX_COMPLETE_PAGE_ITERS) {
            this.advanceCharacter();
            iters++;
        }
        if (!this.isPageComplete()) {
            this.advancePage();
        }
    };
    DialogBox.prototype.setPortraitSpriteProperties = function () {
        this.portraitSprite.localx = this.portraitPosition.x;
        this.portraitSprite.localy = this.portraitPosition.y;
    };
    DialogBox.prototype.setNameSpriteProperties = function () {
        this.nameSprite.localx = this.namePosition.x;
        this.nameSprite.localy = this.namePosition.y;
        this.nameText.localx = this.nameTextOffset.x;
        this.nameText.localy = this.nameTextOffset.y;
    };
    DialogBox.prototype.setSpriteTextProperties = function () {
        this.spriteText.localx = this.textArea.x;
        this.spriteText.localy = this.textArea.y - this.spriteTextOffset;
        this.spriteText.mask = {
            type: 'world',
            texture: Texture.filledRect(this.textArea.width, this.textArea.height, 0xFFFFFF),
            offsetx: this.x + this.textArea.x,
            offsety: this.y + this.textArea.y,
        };
    };
    DialogBox.prototype.isDialogComplete = function () {
        return this.getDialogProgression() >= 1;
    };
    DialogBox.prototype.getDialogProgression = function () {
        return this.spriteText.visibleCharCount / this.spriteText.getCharList().length;
    };
    DialogBox.prototype.isPageComplete = function () {
        if (this.isDialogComplete())
            return true;
        var nextHeight = SpriteText.getHeightOfCharList(this.spriteText.getCharList(), this.spriteText.visibleCharCount + 1);
        return nextHeight > this.textArea.height + this.spriteTextOffset;
    };
    DialogBox.MAX_COMPLETE_PAGE_ITERS = 10000;
    return DialogBox;
}(Sprite));
/// <reference path="../worldObject/sprite/sprite.ts"/>
var Slide = /** @class */ (function (_super) {
    __extends(Slide, _super);
    function Slide(config) {
        var _a;
        var _this = _super.call(this, config) || this;
        var timeToLoad = (_a = config.timeToLoad) !== null && _a !== void 0 ? _a : 0;
        _this.timer = new Timer(timeToLoad);
        if (config.fadeIn) {
            _this.targetAlpha = _this.alpha;
            _this.alpha = 0;
        }
        _this.fullyLoaded = false;
        if (timeToLoad === 0) {
            _this.finishLoading();
        }
        return _this;
    }
    Slide.prototype.update = function () {
        _super.prototype.update.call(this);
        this.updateLoading();
    };
    Slide.prototype.updateLoading = function () {
        if (this.fullyLoaded)
            return;
        this.timer.update(this.delta);
        if (this.targetAlpha !== undefined) {
            this.alpha = this.targetAlpha * this.timer.progress;
        }
        if (this.timer.done) {
            this.fullyLoaded = true;
        }
    };
    Slide.prototype.finishLoading = function () {
        this.timer.finish();
        this.updateLoading();
    };
    return Slide;
}(Sprite));
var SlideManager = /** @class */ (function () {
    function SlideManager(theater) {
        this.theater = theater;
        this.slides = [];
    }
    SlideManager.prototype.addSlide = function (slide) {
        slide.layer = Theater.LAYER_SLIDES;
        World.Actions.setLayer(slide, Theater.LAYER_SLIDES);
        this.theater.addWorldObject(slide);
        this.slides.push(slide);
        return slide;
    };
    SlideManager.prototype.clearSlides = function (exceptLast) {
        if (exceptLast === void 0) { exceptLast = 0; }
        var deleteCount = this.slides.length - exceptLast;
        for (var i = 0; i < deleteCount; i++) {
            this.slides[i].removeFromWorld();
        }
        this.slides.splice(0, deleteCount);
    };
    return SlideManager;
}());
var StageManager = /** @class */ (function () {
    function StageManager(theater, stages) {
        this.theater = theater;
        this.stages = stages;
        this.currentStageName = null;
        this.currentWorld = null;
        this.currentWorldAsWorldObject = null;
    }
    Object.defineProperty(StageManager.prototype, "transitioning", {
        get: function () { return !!this.transition; },
        enumerable: false,
        configurable: true
    });
    /**
     * Loads a stage immediately. If you are calling from inside your game, you probably want to call Theater.loadStage
     */
    StageManager.prototype.internalLoadStage = function (name, transitionConfig, entryPoint) {
        if (!this.stages[name]) {
            error("Cannot load world '" + name + "' because it does not exist:", this.stages);
            return;
        }
        if (!entryPoint)
            entryPoint = { x: this.theater.width / 2, y: this.theater.height / 2 };
        var oldSnapshot = this.currentWorld ? this.currentWorld.takeSnapshot() : Texture.filledRect(global.gameWidth, global.gameHeight, global.backgroundColor);
        // Remove old stuff
        if (this.currentWorld) {
            World.Actions.removeWorldObjectFromWorld(this.currentWorldAsWorldObject);
        }
        // Create new stuff
        this.currentStageName = name;
        this.currentWorld = this.stages[name]();
        this.currentWorldAsWorldObject = new Theater.WorldAsWorldObject(this.currentWorld);
        this.currentWorldAsWorldObject.name = 'world';
        this.currentWorldAsWorldObject.layer = Theater.LAYER_WORLD;
        this.theater.addWorldObject(this.currentWorldAsWorldObject);
        this.theater.onStageLoad();
        this.currentWorld.update();
        var newSnapshot = this.currentWorld.takeSnapshot();
        this.currentWorldAsWorldObject.setActive(false);
        this.currentWorldAsWorldObject.setVisible(false);
        // this is outside the script to avoid 1-frame flicker
        this.transition = Transition.fromConfigAndSnapshots(transitionConfig, oldSnapshot, newSnapshot);
        this.transition.layer = Theater.LAYER_TRANSITION;
        this.theater.addWorldObject(this.transition);
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
                        stageManager.currentWorldAsWorldObject.setActive(true);
                        stageManager.currentWorldAsWorldObject.setVisible(true);
                        return [2 /*return*/];
                }
            });
        });
    };
    return StageManager;
}());
/// <reference path="../worldObject/worldObject.ts"/>
var Transition = /** @class */ (function (_super) {
    __extends(Transition, _super);
    function Transition() {
        var _this = _super.call(this) || this;
        _this.done = false;
        return _this;
    }
    return Transition;
}(WorldObject));
(function (Transition) {
    Transition.INSTANT = { type: 'instant' };
    function FADE(preTime, time, postTime) {
        return {
            type: 'fade',
            preTime: preTime, time: time, postTime: postTime
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
        error("Transition type " + config.type + " not found.");
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
        Fade.prototype.render = function (texture, x, y) {
            _super.prototype.render.call(this, texture, x, y);
            this.oldSnapshot.renderTo(texture);
            this.newSnapshot.renderTo(texture, {
                alpha: this.newAlpha
            });
        };
        return Fade;
    }(Transition));
})(Transition || (Transition = {}));
/// <reference path="./transition.ts"/>
/// <reference path="../world/world.ts"/>
var Theater = /** @class */ (function (_super) {
    __extends(Theater, _super);
    function Theater(config) {
        var _this = _super.call(this, {
            layers: [
                { name: Theater.LAYER_WORLD },
                { name: Theater.LAYER_TRANSITION },
                { name: Theater.LAYER_SLIDES },
                { name: Theater.LAYER_DIALOG },
            ]
        }) || this;
        _this.loadDialogBox(config.dialogBox);
        _this.storyManager = new StoryManager(_this, config.story.storyboard, config.story.storyboardPath, config.story.storyEvents);
        _this.stageManager = new StageManager(_this, config.stages);
        _this.slideManager = new SlideManager(_this);
        _this.musicManager = new MusicManager();
        _this.endOfFrameQueue = [];
        _this.isSkippingCutscene = false;
        _this.loadStage(config.stageToLoad, Transition.INSTANT, config.stageEntryPoint);
        if (Debug.AUTOPLAY && config.autoPlayScript) {
            _this.runScript(config.autoPlayScript);
        }
        return _this;
    }
    Object.defineProperty(Theater.prototype, "currentStageName", {
        get: function () { return this.stageManager ? this.stageManager.currentStageName : undefined; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Theater.prototype, "currentWorld", {
        get: function () { return this.stageManager ? this.stageManager.currentWorld : undefined; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Theater.prototype, "isCutscenePlaying", {
        get: function () { return this.storyManager ? this.storyManager.cutsceneManager.isCutscenePlaying : false; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Theater.prototype, "slides", {
        get: function () { return this.slideManager ? this.slideManager.slides : []; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Theater.prototype, "currentMusicKey", {
        get: function () { return this.musicManager ? this.musicManager.currentMusicKey : undefined; },
        enumerable: false,
        configurable: true
    });
    Theater.prototype.update = function () {
        this.storyManager.update();
        _super.prototype.update.call(this);
        while (!_.isEmpty(this.endOfFrameQueue)) {
            this.endOfFrameQueue.shift()();
        }
        this.musicManager.volume = this.volume * global.game.volume;
        this.musicManager.update(this.delta);
    };
    Theater.prototype.addSlide = function (slide) {
        return this.slideManager.addSlide(slide);
    };
    Theater.prototype.clearSlides = function (exceptLast) {
        if (exceptLast === void 0) { exceptLast = 0; }
        this.slideManager.clearSlides(exceptLast);
    };
    Theater.prototype.loadStage = function (name, transition, entryPoint) {
        var _this = this;
        if (transition === void 0) { transition = Transition.INSTANT; }
        this.runAtEndOfFrame(function () { return _this.stageManager.internalLoadStage(name, transition, entryPoint); });
    };
    Theater.prototype.pauseMusic = function () {
        this.musicManager.pauseMusic();
    };
    Theater.prototype.playMusic = function (key, fadeTime) {
        if (fadeTime === void 0) { fadeTime = 0; }
        this.musicManager.playMusic(key, fadeTime);
    };
    Theater.prototype.runAtEndOfFrame = function (fn) {
        this.endOfFrameQueue.push(fn);
    };
    // Rapidly update theater until cutscene is completed.
    Theater.prototype.skipCurrentCutscene = function () {
        var _this = this;
        if (this.storyManager.cutsceneManager.canSkipCurrentCutscene()) {
            var currentCutscene_1 = this.storyManager.cutsceneManager.current.name;
            var cutsceneFinished = function () { return !_this.storyManager.cutsceneManager.current || _this.storyManager.cutsceneManager.current.name !== currentCutscene_1; };
            this.isSkippingCutscene = true;
            var iters = 0;
            while (iters < Theater.SKIP_CUTSCENE_MAX_FRAMES && !cutsceneFinished()) {
                this.update();
                iters++;
            }
            this.isSkippingCutscene = false;
            if (iters >= Theater.SKIP_CUTSCENE_MAX_FRAMES) {
                error('Cutscene skip exceeded max frames!');
            }
        }
    };
    Theater.prototype.stopMusic = function (fadeTime) {
        if (fadeTime === void 0) { fadeTime = 0; }
        this.musicManager.stopMusic(fadeTime);
    };
    Theater.prototype.unpauseMusic = function () {
        this.musicManager.unpauseMusic();
    };
    Theater.prototype.onStageLoad = function () {
        this.storyManager.onStageLoad();
    };
    Theater.prototype.loadDialogBox = function (factory) {
        this.dialogBox = this.addWorldObject(factory());
        this.dialogBox.setVisible(false);
        World.Actions.setLayer(this.dialogBox, Theater.LAYER_DIALOG);
    };
    Theater.LAYER_WORLD = 'world';
    Theater.LAYER_TRANSITION = 'transition';
    Theater.LAYER_SLIDES = 'slides';
    Theater.LAYER_DIALOG = 'dialog';
    Theater.SKIP_CUTSCENE_DELTA = 0.1;
    Theater.SKIP_CUTSCENE_MAX_FRAMES = 10000;
    return Theater;
}(World));
(function (Theater) {
    var WorldAsWorldObject = /** @class */ (function (_super) {
        __extends(WorldAsWorldObject, _super);
        function WorldAsWorldObject(containedWorld) {
            var _this = _super.call(this) || this;
            _this.containedWorld = containedWorld;
            return _this;
        }
        WorldAsWorldObject.prototype.update = function () {
            _super.prototype.update.call(this);
            this.containedWorld.update();
        };
        WorldAsWorldObject.prototype.render = function (texture, x, y) {
            this.containedWorld.render(texture);
            _super.prototype.render.call(this, texture, x, y);
        };
        return WorldAsWorldObject;
    }(WorldObject));
    Theater.WorldAsWorldObject = WorldAsWorldObject;
})(Theater || (Theater = {}));
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
            error("Cannot get event " + name + " because it does not exist:", this.storyEvents);
            return undefined;
        }
        return event;
    };
    return StoryEventManager;
}());
var StoryManager = /** @class */ (function () {
    function StoryManager(theater, storyboard, storyboardPath, events) {
        var _this = this;
        this.theater = theater;
        this.storyboard = storyboard;
        this.cutsceneManager = new CutsceneManager(theater, storyboard);
        this.eventManager = new StoryEventManager(theater, events);
        this.stateMachine = new StateMachine();
        var _loop_2 = function (storyNodeName) {
            var storyNode = storyboard[storyNodeName];
            var state = {};
            if (storyNode.type === 'cutscene') {
                var cutsceneName_1 = storyNodeName;
                state.callback = function () {
                    _this.cutsceneManager.playCutscene(cutsceneName_1);
                };
                state.script = S.waitUntil(function () { return !_this.cutsceneManager.isCutscenePlaying; });
            }
            else if (storyNode.type === 'transition') {
                state.script = S.wait(storyNode.delay);
            }
            state.transitions = storyNode.transitions.map(function (transition) {
                return {
                    toState: transition.toNode,
                    condition: function () {
                        if (transition.condition && !transition.condition())
                            return false;
                        if (transition.onStage && (_this.theater.currentStageName !== transition.onStage || _this.theater.stageManager.transitioning))
                            return false;
                        return true;
                    },
                    delay: transition.delay,
                };
            });
            this_2.stateMachine.addState(storyNodeName, state);
        };
        var this_2 = this;
        for (var storyNodeName in storyboard) {
            _loop_2(storyNodeName);
        }
        var nodeToStartOn = this.fastForward(storyboardPath);
        this.stateMachine.setState(nodeToStartOn);
    }
    Object.defineProperty(StoryManager.prototype, "currentNodeName", {
        get: function () { return this.stateMachine.getCurrentStateName(); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(StoryManager.prototype, "currentNode", {
        get: function () { return this.getNodeByName(this.currentNodeName); },
        enumerable: false,
        configurable: true
    });
    StoryManager.prototype.update = function () {
        this.cutsceneManager.update();
        this.stateMachine.update(this.theater.delta);
    };
    StoryManager.prototype.onStageLoad = function () {
        this.cutsceneManager.onStageLoad();
        this.eventManager.onStageLoad();
    };
    StoryManager.prototype.setNode = function (node) {
        if (!this.getNodeByName(node))
            return;
        if (this.storyboard[node].type === 'cutscene' && !this.cutsceneManager.canPlayCutscene(node))
            return;
        this.stateMachine.setState(node);
    };
    StoryManager.prototype.fastForward = function (path) {
        for (var i = 0; i < path.length - 1; i++) {
            var node = this.getNodeByName(path[i]);
            if (!node)
                continue;
            if (node.type === 'cutscene') {
                this.cutsceneManager.fastForwardCutscene(path[i]);
            }
        }
        return _.last(path);
    };
    StoryManager.prototype.getNodeByName = function (name) {
        if (!this.storyboard[name]) {
            error("No storyboard node exists with name " + name);
        }
        return this.storyboard[name];
    };
    return StoryManager;
}());
var Storyboard;
(function (Storyboard) {
    function arbitraryPathToNode(storyboard, endNode) {
        if (!storyboard[endNode]) {
            error("Cannot make path to end node " + endNode + " since it doesn't exist in storyboard", storyboard);
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
                error("Could not find a path to " + endNode + " in storyboard", storyboard);
                return [];
            }
        }
        return result;
    }
    Storyboard.arbitraryPathToNode = arbitraryPathToNode;
})(Storyboard || (Storyboard = {}));
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
    function emptyArray(n) {
        return filledArray(n);
    }
    A.emptyArray = emptyArray;
    function filledArray(n, fillWith) {
        var result = [];
        for (var i = 0; i < n; i++) {
            result.push(fillWith);
        }
        return result;
    }
    A.filledArray = filledArray;
    function filledArray2D(rows, cols, fillWith) {
        var result = [];
        for (var i = 0; i < rows; i++) {
            var line = [];
            for (var j = 0; j < cols; j++) {
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
        var e_30, _a;
        if (combine === void 0) { combine = (function (e, into) { return e; }); }
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
        catch (e_30_1) { e_30 = { error: e_30_1 }; }
        finally {
            try {
                if (array_1_1 && !array_1_1.done && (_a = array_1.return)) _a.call(array_1);
            }
            finally { if (e_30) throw e_30.error; }
        }
        return result;
    }
    A.mergeArray = mergeArray;
    function range(n) {
        return __spread(Array(n).keys());
    }
    A.range = range;
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
    /**
     * Sorts in ascending order by default.
     */
    function sort(array, key, reverse) {
        if (reverse === void 0) { reverse = false; }
        var r = reverse ? -1 : 1;
        return array.sort(function (a, b) { return r * (key(a) - key(b)); });
    }
    A.sort = sort;
    /**
     * Sorts in ascending order by default.
     */
    function sorted(array, key, reverse) {
        if (reverse === void 0) { reverse = false; }
        return A.sort(A.clone(array), key, reverse);
    }
    A.sorted = sorted;
    function sum(array, key) {
        if (key === void 0) { key = (function (e) { return e; }); }
        if (_.isEmpty(array))
            return 0;
        var result = 0;
        for (var i = 0; i < array.length; i++) {
            result += key(array[i]);
        }
        return result;
    }
    A.sum = sum;
})(A || (A = {}));
var OrFactory;
(function (OrFactory) {
    /** CANNOT RESOLVE FACTORIES OF FUNCTIONS */
    function resolve(orFactory) {
        if (_.isFunction(orFactory)) {
            return orFactory();
        }
        return orFactory;
    }
    OrFactory.resolve = resolve;
})(OrFactory || (OrFactory = {}));
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
    function distancePointToLine(px, py, lx1, ly1, lx2, ly2) {
        var dx = px - lx1;
        var dy = py - ly1;
        var ldx = lx2 - lx1;
        var ldy = ly2 - ly1;
        return Math.abs(dy * ldx - dx * ldy) / (ldx * ldx + ldy * ldy);
    }
    G.distancePointToLine = distancePointToLine;
    function dot(v1, v2) {
        return v1.x * v2.x + v1.y * v2.y;
    }
    G.dot = dot;
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
var LocalStorage = /** @class */ (function () {
    function LocalStorage() {
    }
    LocalStorage.getJson = function (key) {
        var str = this.getString(key);
        return _.isEmpty(str) ? undefined : JSON.parse(str);
    };
    LocalStorage.getString = function (key) {
        try {
            return localStorage.getItem(key);
        }
        catch (e) {
            error('Unable to get localStorage:', e);
        }
        return undefined;
    };
    LocalStorage.setJson = function (key, value) {
        this.setString(key, JSON.stringify(value));
    };
    LocalStorage.setString = function (key, value) {
        try {
            localStorage.setItem(key, value);
        }
        catch (e) {
            error('Unable to set localStorage:', e);
        }
    };
    return LocalStorage;
}());
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
    /**
     * Calculates the height of a parabola that starts at startHeight, increases to startHeight + peakDelta, then falls to startHeight + groundDelta.
     * 0 <= t <= 1 is the percent completion of the jump.
     */
    function jumpParabola(startHeight, peakDelta, groundDelta, t) {
        var a = 2 * groundDelta - 4 * peakDelta;
        var b = 4 * peakDelta - groundDelta;
        return a * t * t + b * t + startHeight;
    }
    M.jumpParabola = jumpParabola;
    function jumpVelocityForHeight(height, gravity) {
        return Math.sqrt(2 * height * Math.abs(gravity));
    }
    M.jumpVelocityForHeight = jumpVelocityForHeight;
    function lerp(a, b, t) {
        return a * (1 - t) + b * t;
    }
    M.lerp = lerp;
    function lerpTime(a, b, speed, delta) {
        // From https://www.gamasutra.com/blogs/ScottLembcke/20180404/316046/Improved_Lerp_Smoothing.php
        return lerp(a, b, 1 - Math.pow(2, -speed * delta));
    }
    M.lerpTime = lerpTime;
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
        if (_.isEmpty(array))
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
    function mod(num, mod) {
        mod = Math.abs(mod);
        return num - Math.floor(num / mod) * mod;
    }
    M.mod = mod;
    function radToDeg(rad) {
        return 180 / Math.PI * rad;
    }
    M.radToDeg = radToDeg;
    function vec3ToColor(vec3) {
        return (Math.round(vec3[0] * 255) << 16) + (Math.round(vec3[1] * 255) << 8) + Math.round(vec3[2] * 255);
    }
    M.vec3ToColor = vec3ToColor;
    // Degree-based Trig
    function cos(angle) {
        return Math.cos(degToRad(angle));
    }
    M.cos = cos;
    function sin(angle) {
        return Math.sin(degToRad(angle));
    }
    M.sin = sin;
    function tan(angle) {
        return Math.tan(degToRad(angle));
    }
    M.tan = tan;
    function asin(sin) {
        return radToDeg(Math.asin(sin));
    }
    M.asin = asin;
    function acos(cos) {
        return radToDeg(Math.acos(cos));
    }
    M.acos = acos;
    function atan(tan) {
        return radToDeg(Math.atan(tan));
    }
    M.atan = atan;
    function atan2(tany, tanx) {
        return radToDeg(Math.atan2(tany, tanx));
    }
    M.atan2 = atan2;
})(M || (M = {}));
var O;
(function (O) {
    /** Warning: make sure your object has no reference loops! */
    function deepClone(obj) {
        return deepCloneInternal(obj);
    }
    O.deepClone = deepClone;
    function deepCloneInternal(obj) {
        var e_31, _a;
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
            catch (e_31_1) { e_31 = { error: e_31_1 }; }
            finally {
                try {
                    if (obj_1_1 && !obj_1_1.done && (_a = obj_1.return)) _a.call(obj_1);
                }
                finally { if (e_31) throw e_31.error; }
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
    function getClass(obj) {
        return obj.constructor;
    }
    O.getClass = getClass;
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
var StateMachine = /** @class */ (function () {
    function StateMachine() {
        this.states = {};
    }
    StateMachine.prototype.addState = function (name, state) {
        this.states[name] = state;
    };
    StateMachine.prototype.setState = function (name) {
        var _a;
        if (this.script)
            this.script.done = true;
        var state = this.getState(name);
        if (!state)
            return;
        this.currentState = state;
        if (state.callback)
            state.callback();
        var stateScript = (_a = state.script) !== null && _a !== void 0 ? _a : S.noop();
        var sm = this;
        this.script = new Script(function () {
            var selectedTransition;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, stateScript];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/];
                    case 2:
                        _b.sent(); // Yield one more time so we don't immediately transition to next state.
                        selectedTransition = undefined;
                        _b.label = 3;
                    case 3:
                        selectedTransition = sm.getValidTransition(sm.currentState);
                        if (!!selectedTransition) return [3 /*break*/, 5];
                        return [4 /*yield*/];
                    case 4:
                        _b.sent();
                        _b.label = 5;
                    case 5:
                        if (!selectedTransition) return [3 /*break*/, 3];
                        _b.label = 6;
                    case 6: return [4 /*yield*/, S.wait((_a = selectedTransition.delay) !== null && _a !== void 0 ? _a : 0)];
                    case 7:
                        _b.sent();
                        sm.setState(selectedTransition.toState);
                        return [2 /*return*/];
                }
            });
        });
        this.script.update(0);
    };
    StateMachine.prototype.update = function (delta) {
        var _a;
        if (this.script)
            this.script.update(delta);
        if ((_a = this.currentState) === null || _a === void 0 ? void 0 : _a.update)
            this.currentState.update();
    };
    StateMachine.prototype.getCurrentStateName = function () {
        for (var name_5 in this.states) {
            if (this.states[name_5] === this.currentState) {
                return name_5;
            }
        }
        return undefined;
    };
    StateMachine.prototype.getState = function (name) {
        if (!this.states[name]) {
            error("No state named " + name + " exists on state machine", this);
        }
        return this.states[name];
    };
    StateMachine.prototype.getValidTransition = function (state) {
        var e_32, _a;
        try {
            for (var _b = __values(state.transitions || []), _c = _b.next(); !_c.done; _c = _b.next()) {
                var transition = _c.value;
                if (transition.condition && !transition.condition())
                    continue;
                return transition;
            }
        }
        catch (e_32_1) { e_32 = { error: e_32_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_32) throw e_32.error; }
        }
        return undefined;
    };
    return StateMachine;
}());
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
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Timer.prototype, "done", {
        get: function () { return !this.repeat && this.progress >= 1; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Timer.prototype, "progress", {
        get: function () {
            if (this.duration === 0)
                return 1;
            return Math.min(this.time / this.duration, 1);
        },
        enumerable: false,
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
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Tween.prototype, "value", {
        get: function () { return this.start + (this.end - this.start) * this.easingFunction(this.timer.progress); },
        enumerable: false,
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
        function outFromIn(inFn) {
            return function (t) { return 1 - inFn(1 - t); };
        }
        Easing.outFromIn = outFromIn;
        function inOutFromIn(inFn) {
            return function (t) { return t <= 0.5 ? inFn(2 * t) / 2 : 1 - inFn(2 * (1 - t)) / 2; };
        }
        Easing.inOutFromIn = inOutFromIn;
        /* Easing Functions */
        Easing.Linear = function (t) { return t; };
        Easing.InPow = function (pow) { return (function (t) { return Math.pow(t, pow); }); };
        Easing.OutPow = function (pow) { return outFromIn(Easing.InPow(pow)); };
        Easing.InOutPow = function (pow) { return inOutFromIn(Easing.InPow(pow)); };
        Easing.InQuad = Easing.InPow(2);
        Easing.OutQuad = Easing.OutPow(2);
        Easing.InOutQuad = Easing.InOutPow(2);
        Easing.InCubic = Easing.InPow(3);
        Easing.OutCubic = Easing.OutPow(3);
        Easing.InOutCubic = Easing.InOutPow(3);
        Easing.InExpPow = function (pow) { return function (t) { return t * Math.pow(2, (8.25 * pow * (t - 1))); }; };
        Easing.OutExpPow = function (pow) { return outFromIn(Easing.InExpPow(pow)); };
        Easing.InOutExpPow = function (pow) { return inOutFromIn(Easing.InExpPow(pow)); };
        Easing.InExp = Easing.InExpPow(1);
        Easing.OutExp = Easing.OutExpPow(1);
        Easing.InOutExp = Easing.InOutExpPow(1);
    })(Easing = Tween.Easing || (Tween.Easing = {}));
})(Tween || (Tween = {}));
var Utils;
(function (Utils) {
    Utils.NOOP = function () { return null; };
    Utils.NOOP_DISPLAYOBJECT = new PIXI.DisplayObject();
    Utils.NOOP_RENDERTEXTURE = PIXI.RenderTexture.create({ width: 0, height: 0 });
    Utils.UID = new UIDGenerator();
})(Utils || (Utils = {}));
/// <reference path="../utils/o_object.ts"/>
var Camera = /** @class */ (function () {
    function Camera(config, world) {
        var _a, _b, _c, _d, _e;
        this.world = world;
        this.width = (_a = config.width) !== null && _a !== void 0 ? _a : global.gameWidth;
        this.height = (_b = config.height) !== null && _b !== void 0 ? _b : global.gameHeight;
        this.bounds = O.withDefaults((_c = config.bounds) !== null && _c !== void 0 ? _c : {}, {
            top: -Infinity,
            bottom: Infinity,
            left: -Infinity,
            right: Infinity,
        });
        this.mode = (_d = _.clone(config.mode)) !== null && _d !== void 0 ? _d : Camera.Mode.FOCUS(this.width / 2, this.height / 2);
        this.movement = (_e = _.clone(config.movement)) !== null && _e !== void 0 ? _e : Camera.Movement.SNAP();
        this.shakeIntensity = 0;
        this._shakeX = 0;
        this._shakeY = 0;
        this.debugOffsetX = 0;
        this.debugOffsetY = 0;
        this.snapPosition();
    }
    Object.defineProperty(Camera.prototype, "worldOffsetX", {
        get: function () { return this.x - this.width / 2 + this._shakeX + this.debugOffsetX; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Camera.prototype, "worldOffsetY", {
        get: function () { return this.y - this.height / 2 + this._shakeY + this.debugOffsetY; },
        enumerable: false,
        configurable: true
    });
    Camera.prototype.update = function () {
        var target = this.mode.getTargetPt(this);
        this.moveTowardsPoint(target.x, target.y);
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
        if (Debug.MOVE_CAMERA_WITH_ARROWS && global.theater && this.world === global.theater.currentWorld) {
            if (Input.isDown(Input.DEBUG_MOVE_CAMERA_LEFT))
                this.debugOffsetX -= 1;
            if (Input.isDown(Input.DEBUG_MOVE_CAMERA_RIGHT))
                this.debugOffsetX += 1;
            if (Input.isDown(Input.DEBUG_MOVE_CAMERA_UP))
                this.debugOffsetY -= 1;
            if (Input.isDown(Input.DEBUG_MOVE_CAMERA_DOWN))
                this.debugOffsetY += 1;
        }
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
        var hw = this.movement.deadZoneWidth / 2;
        var hh = this.movement.deadZoneHeight / 2;
        var dx = x - this.x;
        var dy = y - this.y;
        if (Math.abs(dx) > hw) {
            var tx = Math.abs(hw / dx);
            var targetx = this.x + (1 - tx) * dx;
            if (this.movement.speed === Infinity) {
                this.x = targetx;
            }
            else {
                this.x = M.lerpTime(this.x, targetx, this.movement.speed, this.world.delta);
            }
        }
        if (Math.abs(dy) > hh) {
            var ty = Math.abs(hh / dy);
            var targety = this.y + (1 - ty) * dy;
            if (this.movement.speed === Infinity) {
                this.y = targety;
            }
            else {
                this.y = M.lerpTime(this.y, targety, this.movement.speed, this.world.delta);
            }
        }
    };
    Camera.prototype.snapPosition = function () {
        var target = this.mode.getTargetPt(this);
        this.x = target.x;
        this.y = target.y;
    };
    Camera.prototype.setMode = function (mode) {
        this.mode = mode;
    };
    Camera.prototype.setModeFocus = function (x, y) {
        this.setMode(Camera.Mode.FOCUS(x, y));
    };
    Camera.prototype.setModeFollow = function (target, offsetX, offsetY) {
        if (offsetX === void 0) { offsetX = 0; }
        if (offsetY === void 0) { offsetY = 0; }
        this.setMode(Camera.Mode.FOLLOW(target, offsetX, offsetY));
    };
    Camera.prototype.setMovement = function (movement) {
        this.movement = movement;
    };
    Camera.prototype.setMovementSnap = function () {
        this.setMovement(Camera.Movement.SNAP());
    };
    Camera.prototype.setMovementSmooth = function (speed, deadZoneWidth, deadZoneHeight) {
        if (deadZoneWidth === void 0) { deadZoneWidth = 0; }
        if (deadZoneHeight === void 0) { deadZoneHeight = 0; }
        this.setMovement(Camera.Movement.SMOOTH(speed, deadZoneWidth, deadZoneHeight));
    };
    return Camera;
}());
(function (Camera) {
    var Mode;
    (function (Mode) {
        function FOLLOW(target, offsetX, offsetY) {
            if (offsetX === void 0) { offsetX = 0; }
            if (offsetY === void 0) { offsetY = 0; }
            return {
                getTargetPt: function (camera) {
                    if (_.isString(target)) {
                        var worldObject = camera.world.select.name(target, false);
                        return worldObject ? vec2(worldObject.x + offsetX, worldObject.y + offsetY) : vec2(camera.x, camera.y);
                    }
                    return vec2(target.x + offsetX, target.y + offsetY);
                },
            };
        }
        Mode.FOLLOW = FOLLOW;
        function FOCUS(x, y) {
            var focusPt = vec2(x, y);
            return {
                getTargetPt: function (camera) { return focusPt; },
            };
        }
        Mode.FOCUS = FOCUS;
    })(Mode = Camera.Mode || (Camera.Mode = {}));
    var Movement;
    (function (Movement) {
        function SNAP() {
            return {
                speed: Infinity,
                deadZoneWidth: 0,
                deadZoneHeight: 0,
            };
        }
        Movement.SNAP = SNAP;
        function SMOOTH(speed, deadZoneWidth, deadZoneHeight) {
            if (deadZoneWidth === void 0) { deadZoneWidth = 0; }
            if (deadZoneHeight === void 0) { deadZoneHeight = 0; }
            return {
                speed: speed,
                deadZoneWidth: deadZoneWidth,
                deadZoneHeight: deadZoneHeight,
            };
        }
        Movement.SMOOTH = SMOOTH;
    })(Movement = Camera.Movement || (Camera.Movement = {}));
})(Camera || (Camera = {}));
var Physics;
(function (Physics) {
    function resolveCollisions(world) {
        var e_33, _a;
        var dpos = [];
        try {
            for (var _b = __values(world.worldObjects), _c = _b.next(); !_c.done; _c = _b.next()) {
                var worldObject = _c.value;
                var d = worldObject instanceof PhysicsWorldObject
                    ? vec2(worldObject.x - worldObject.physicslastx, worldObject.y - worldObject.physicslasty)
                    : vec2(worldObject.x - worldObject.lastx, worldObject.y - worldObject.lasty);
                dpos.push(d);
                worldObject.x -= d.x;
                worldObject.y -= d.y;
            }
        }
        catch (e_33_1) { e_33 = { error: e_33_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_33) throw e_33.error; }
        }
        var resultCollisions = [];
        var iters = Math.max(1, M.max(dpos, function (d) { return Math.ceil(d.magnitude / world.maxDistancePerCollisionStep); }));
        for (var iter = 0; iter < iters; iter++) {
            for (var i = 0; i < world.worldObjects.length; i++) {
                world.worldObjects[i].x += dpos[i].x / iters;
                world.worldObjects[i].y += dpos[i].y / iters;
            }
            performNormalIteration(world, resultCollisions);
        }
        for (var iter = 0; iter < world.collisionIterations - iters; iter++) {
            performNormalIteration(world, resultCollisions);
        }
        performFinalIteration(world, resultCollisions);
        // Collect any duplicate collisions for the same entities.
        var collectedCollisions = collectCollisions(resultCollisions);
        // Apply momentum transfer/callbacks
        applyCollisionEffects(collectedCollisions, world.delta);
    }
    Physics.resolveCollisions = resolveCollisions;
    function performNormalIteration(world, resultCollisions) {
        var e_34, _a;
        var collisions = getRaycastCollisions(world)
            .sort(function (a, b) { return a.collision.t - b.collision.t; });
        try {
            for (var collisions_1 = __values(collisions), collisions_1_1 = collisions_1.next(); !collisions_1_1.done; collisions_1_1 = collisions_1.next()) {
                var collision = collisions_1_1.value;
                var success = resolveCollision(world, collision);
                if (success)
                    resultCollisions.push(collision);
            }
        }
        catch (e_34_1) { e_34 = { error: e_34_1 }; }
        finally {
            try {
                if (collisions_1_1 && !collisions_1_1.done && (_a = collisions_1.return)) _a.call(collisions_1);
            }
            finally { if (e_34) throw e_34.error; }
        }
    }
    function performFinalIteration(world, resultCollisions) {
        var e_35, _a, e_36, _b;
        var collisions = getRaycastCollisions(world);
        var currentSet = new Set();
        try {
            for (var collisions_2 = __values(collisions), collisions_2_1 = collisions_2.next(); !collisions_2_1.done; collisions_2_1 = collisions_2.next()) {
                var collision = collisions_2_1.value;
                if (collision.move.isImmovable())
                    currentSet.add(collision.move);
                if (collision.from.isImmovable())
                    currentSet.add(collision.from);
            }
        }
        catch (e_35_1) { e_35 = { error: e_35_1 }; }
        finally {
            try {
                if (collisions_2_1 && !collisions_2_1.done && (_a = collisions_2.return)) _a.call(collisions_2);
            }
            finally { if (e_35) throw e_35.error; }
        }
        var doneWithCollisions = false;
        while (!doneWithCollisions) {
            doneWithCollisions = true;
            try {
                for (var collisions_3 = (e_36 = void 0, __values(collisions)), collisions_3_1 = collisions_3.next(); !collisions_3_1.done; collisions_3_1 = collisions_3.next()) {
                    var collision = collisions_3_1.value;
                    var hasMove = currentSet.has(collision.move);
                    var hasFrom = currentSet.has(collision.from);
                    if (hasMove && !hasFrom) {
                        var success = resolveCollision(world, collision, collision.move);
                        if (success)
                            resultCollisions.push(collision);
                        currentSet.add(collision.from);
                        doneWithCollisions = false;
                    }
                    if (hasFrom && !hasMove) {
                        var success = resolveCollision(world, collision, collision.from);
                        if (success)
                            resultCollisions.push(collision);
                        currentSet.add(collision.move);
                        doneWithCollisions = false;
                    }
                }
            }
            catch (e_36_1) { e_36 = { error: e_36_1 }; }
            finally {
                try {
                    if (collisions_3_1 && !collisions_3_1.done && (_b = collisions_3.return)) _b.call(collisions_3);
                }
                finally { if (e_36) throw e_36.error; }
            }
        }
    }
    // Return true iff the collision actually happened.
    function resolveCollision(world, collision, forceImmovable) {
        var raycastCollision = {
            move: collision.move,
            from: collision.from,
            collision: collision.move.bounds.getRaycastCollision(collision.move.x - collision.move.physicslastx, collision.move.y - collision.move.physicslasty, collision.from.bounds, collision.from.x - collision.from.physicslastx, collision.from.y - collision.from.physicslasty),
        };
        if (!raycastCollision.collision)
            return false;
        var displacementCollision = {
            move: raycastCollision.move,
            from: raycastCollision.from,
            collision: undefined
        };
        // Use raycast collision displacement if applicable.
        if (M.magnitude(raycastCollision.collision.displacementX, raycastCollision.collision.displacementY) <= world.useRaycastDisplacementThreshold) {
            displacementCollision.collision = {
                bounds1: raycastCollision.move.bounds,
                bounds2: raycastCollision.from.bounds,
                displacementX: raycastCollision.collision.displacementX,
                displacementY: raycastCollision.collision.displacementY,
            };
        }
        else {
            displacementCollision.collision = raycastCollision.move.bounds.getDisplacementCollision(raycastCollision.from.bounds);
        }
        if (!displacementCollision.collision)
            return false;
        applyDisplacementForCollision(displacementCollision, forceImmovable);
        return true;
    }
    function getRaycastCollisions(world) {
        var e_37, _a, e_38, _b, e_39, _c;
        var raycastCollisions = [];
        try {
            for (var _d = __values(world.collisions), _e = _d.next(); !_e.done; _e = _d.next()) {
                var collision = _e.value;
                try {
                    for (var _f = (e_38 = void 0, __values(world.physicsGroups[collision.move].worldObjects)), _g = _f.next(); !_g.done; _g = _f.next()) {
                        var move = _g.value;
                        try {
                            for (var _h = (e_39 = void 0, __values(world.physicsGroups[collision.from].worldObjects)), _j = _h.next(); !_j.done; _j = _h.next()) {
                                var from = _j.value;
                                if (move === from)
                                    continue;
                                if (!G.overlapRectangles(move.bounds.getBoundingBox(), from.bounds.getBoundingBox()))
                                    continue;
                                if (!move.colliding || !from.colliding)
                                    continue;
                                if (!move.isCollidingWith(from) || !from.isCollidingWith(move))
                                    continue;
                                var raycastCollision = move.bounds.getRaycastCollision(move.x - move.physicslastx, move.y - move.physicslasty, from.bounds, from.x - from.physicslastx, from.y - from.physicslasty);
                                if (!raycastCollision)
                                    continue;
                                raycastCollisions.push({
                                    move: move, from: from,
                                    collision: raycastCollision,
                                    callback: collision.callback,
                                    momentumTransfer: collision.momentumTransfer,
                                });
                            }
                        }
                        catch (e_39_1) { e_39 = { error: e_39_1 }; }
                        finally {
                            try {
                                if (_j && !_j.done && (_c = _h.return)) _c.call(_h);
                            }
                            finally { if (e_39) throw e_39.error; }
                        }
                    }
                }
                catch (e_38_1) { e_38 = { error: e_38_1 }; }
                finally {
                    try {
                        if (_g && !_g.done && (_b = _f.return)) _b.call(_f);
                    }
                    finally { if (e_38) throw e_38.error; }
                }
            }
        }
        catch (e_37_1) { e_37 = { error: e_37_1 }; }
        finally {
            try {
                if (_e && !_e.done && (_a = _d.return)) _a.call(_d);
            }
            finally { if (e_37) throw e_37.error; }
        }
        return raycastCollisions;
    }
    function applyDisplacementForCollision(collision, forceImmovable) {
        var moveImmovable = collision.move.isImmovable() || collision.move === forceImmovable;
        var fromImmovable = collision.from.isImmovable() || collision.from === forceImmovable;
        if (moveImmovable && fromImmovable)
            return;
        if (moveImmovable) {
            collision.from.x -= collision.collision.displacementX;
            collision.from.y -= collision.collision.displacementY;
            return;
        }
        if (fromImmovable) {
            collision.move.x += collision.collision.displacementX;
            collision.move.y += collision.collision.displacementY;
            return;
        }
        var massFactor = (collision.move.mass + collision.from.mass === 0) ? 0.5 :
            collision.from.mass / (collision.move.mass + collision.from.mass);
        collision.move.x += massFactor * collision.collision.displacementX;
        collision.move.y += massFactor * collision.collision.displacementY;
        collision.from.x -= (1 - massFactor) * collision.collision.displacementX;
        collision.from.y -= (1 - massFactor) * collision.collision.displacementY;
    }
    function collectCollisions(collisions) {
        var e_40, _a, e_41, _b;
        var collisionGroups = [];
        try {
            for (var collisions_4 = __values(collisions), collisions_4_1 = collisions_4.next(); !collisions_4_1.done; collisions_4_1 = collisions_4.next()) {
                var collision = collisions_4_1.value;
                var collisionFoundInList = false;
                try {
                    for (var collisionGroups_1 = (e_41 = void 0, __values(collisionGroups)), collisionGroups_1_1 = collisionGroups_1.next(); !collisionGroups_1_1.done; collisionGroups_1_1 = collisionGroups_1.next()) {
                        var collisionList = collisionGroups_1_1.value;
                        if (collisionList[0].move === collision.move && collisionList[0].from === collision.from) {
                            collisionList.push(collision);
                            collisionFoundInList = true;
                            break;
                        }
                    }
                }
                catch (e_41_1) { e_41 = { error: e_41_1 }; }
                finally {
                    try {
                        if (collisionGroups_1_1 && !collisionGroups_1_1.done && (_b = collisionGroups_1.return)) _b.call(collisionGroups_1);
                    }
                    finally { if (e_41) throw e_41.error; }
                }
                if (!collisionFoundInList) {
                    collisionGroups.push([collision]);
                }
            }
        }
        catch (e_40_1) { e_40 = { error: e_40_1 }; }
        finally {
            try {
                if (collisions_4_1 && !collisions_4_1.done && (_a = collisions_4.return)) _a.call(collisions_4);
            }
            finally { if (e_40) throw e_40.error; }
        }
        return collisionGroups.map(function (collisionList) {
            return {
                move: collisionList[0].move,
                from: collisionList[0].from,
                callback: collisionList[0].callback,
                momentumTransfer: collisionList[0].momentumTransfer,
                collision: {
                    bounds1: collisionList[0].move.bounds,
                    bounds2: collisionList[0].from.bounds,
                    displacementX: A.sum(collisionList, function (collision) { return collision.collision.displacementX; }),
                    displacementY: A.sum(collisionList, function (collision) { return collision.collision.displacementY; }),
                    t: M.min(collisionList, function (collision) { return collision.collision.t; }),
                }
            };
        });
    }
    function applyCollisionEffects(collisions, delta) {
        var e_42, _a;
        try {
            for (var collisions_5 = __values(collisions), collisions_5_1 = collisions_5.next(); !collisions_5_1.done; collisions_5_1 = collisions_5.next()) {
                var collision = collisions_5_1.value;
                var moveCollisionInfo = {
                    self: {
                        obj: collision.move,
                        vx: collision.move.v.x,
                        vy: collision.move.v.y,
                    },
                    other: {
                        obj: collision.from,
                        vx: collision.from.v.x,
                        vy: collision.from.v.y,
                    }
                };
                var fromCollisionInfo = {
                    self: moveCollisionInfo.other,
                    other: moveCollisionInfo.self
                };
                applyMomentumTransferForCollision(collision, collision.momentumTransfer, delta);
                if (collision.callback)
                    collision.callback(moveCollisionInfo);
                collision.move.onCollide(moveCollisionInfo);
                collision.from.onCollide(fromCollisionInfo);
            }
        }
        catch (e_42_1) { e_42 = { error: e_42_1 }; }
        finally {
            try {
                if (collisions_5_1 && !collisions_5_1.done && (_a = collisions_5.return)) _a.call(collisions_5);
            }
            finally { if (e_42) throw e_42.error; }
        }
    }
    function applyMomentumTransferForCollision(collision, momentumTransferMode, delta) {
        if (momentumTransferMode === 'elastic') {
            if (collision.move.isImmovable() && collision.from.isImmovable())
                return;
            var d = new Vector2(collision.collision.displacementX, collision.collision.displacementY).normalized();
            var mm = collision.move.mass;
            var mf = collision.from.mass;
            if (mm + mf === 0) {
                // In case of invald masses, set both to the default 1.
                mm = 1;
                mf = 1;
            }
            var vmi_proj = G.dot(collision.move.v, d);
            var vfi_proj = G.dot(collision.from.v, d);
            var mass_factor = (collision.move.mass + collision.from.mass === 0) ? 0.5 :
                collision.from.mass / (collision.move.mass + collision.from.mass);
            var elastic_factor_m = collision.move.isImmovable() ? 0 : collision.from.isImmovable() ? 1 : mass_factor;
            var elastic_factor_f = 1 - elastic_factor_m;
            var dvmf_proj = 2 * (vfi_proj - vmi_proj) * elastic_factor_m;
            var dvff_proj = 2 * (vmi_proj - vfi_proj) * elastic_factor_f;
            collision.move.v.x += dvmf_proj * collision.move.bounce * d.x;
            collision.move.v.y += dvmf_proj * collision.move.bounce * d.y;
            collision.from.v.x += dvff_proj * collision.from.bounce * d.x;
            collision.from.v.y += dvff_proj * collision.from.bounce * d.y;
        }
        else if (momentumTransferMode === 'zero_velocity_local') {
            if (!collision.move.isImmovable()) {
                var fromvx = delta === 0 ? 0 : (collision.from.x - collision.from.physicslastx) / delta;
                var fromvy = delta === 0 ? 0 : (collision.from.y - collision.from.physicslasty) / delta;
                collision.move.v.x -= fromvx;
                collision.move.v.y -= fromvy;
                zeroVelocityAgainstDisplacement(collision.move, collision.collision.displacementX, collision.collision.displacementY);
                collision.move.v.x += fromvx;
                collision.move.v.y += fromvy;
            }
            if (!collision.from.isImmovable()) {
                var movevx = delta === 0 ? 0 : (collision.move.x - collision.move.physicslastx) / delta;
                var movevy = delta === 0 ? 0 : (collision.move.y - collision.move.physicslasty) / delta;
                collision.move.v.x -= movevx;
                collision.move.v.y -= movevy;
                zeroVelocityAgainstDisplacement(collision.from, -collision.collision.displacementX, -collision.collision.displacementY);
                collision.move.v.x += movevx;
                collision.move.v.y += movevy;
            }
        }
        else { // zero_velocity_global
            if (!collision.move.isImmovable()) {
                zeroVelocityAgainstDisplacement(collision.move, collision.collision.displacementX, collision.collision.displacementY);
            }
            if (!collision.from.isImmovable()) {
                zeroVelocityAgainstDisplacement(collision.from, -collision.collision.displacementX, -collision.collision.displacementY);
            }
        }
    }
    function zeroVelocityAgainstDisplacement(obj, dx, dy) {
        var dot = obj.v.x * dx + obj.v.y * dy;
        if (dot >= 0)
            return;
        var factor = dot / M.magnitudeSq(dx, dy);
        obj.v.x -= factor * dx;
        obj.v.y -= factor * dy;
    }
})(Physics || (Physics = {}));
var WorldSelecter = /** @class */ (function () {
    function WorldSelecter(world) {
        this.world = world;
    }
    WorldSelecter.prototype.collidesWith = function (physicsGroup) {
        var _this = this;
        var groups = this.world.getPhysicsGroupsThatCollideWith(physicsGroup);
        return _.flatten(groups.map(function (group) { return _this.world.physicsGroups[group].worldObjects; }));
    };
    WorldSelecter.prototype.name = function (name, checked) {
        if (checked === void 0) { checked = true; }
        var results = this.nameAll(name);
        if (_.isEmpty(results)) {
            if (checked)
                error("No object with name " + name + " exists in world:", this.world);
            return undefined;
        }
        if (results.length > 1) {
            error("Multiple objects with name " + name + " exist in world. Returning one of them. World:", this.world);
        }
        return results[0];
    };
    WorldSelecter.prototype.nameAll = function (name) {
        if (!name)
            return [];
        return this.world.worldObjects.filter(function (obj) { return obj.name === name; });
    };
    WorldSelecter.prototype.overlap = function (bounds, physicsGroups) {
        var e_43, _a;
        var result = [];
        for (var physicsGroup in this.world.physicsGroups) {
            if (!_.contains(physicsGroups, physicsGroup))
                continue;
            try {
                for (var _b = (e_43 = void 0, __values(this.world.physicsGroups[physicsGroup].worldObjects)), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var obj = _c.value;
                    if (!obj.isOverlapping(bounds))
                        continue;
                    result.push(obj);
                }
            }
            catch (e_43_1) { e_43 = { error: e_43_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_43) throw e_43.error; }
            }
        }
        return result;
    };
    WorldSelecter.prototype.raycast = function (x, y, dx, dy, physicsGroups) {
        var e_44, _a;
        var result = [];
        for (var physicsGroup in this.world.physicsGroups) {
            if (!_.contains(physicsGroups, physicsGroup))
                continue;
            try {
                for (var _b = (e_44 = void 0, __values(this.world.physicsGroups[physicsGroup].worldObjects)), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var obj = _c.value;
                    var t = obj.bounds.raycast(x, y, dx, dy);
                    if (!isFinite(t))
                        continue;
                    result.push({ obj: obj, t: t });
                }
            }
            catch (e_44_1) { e_44 = { error: e_44_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_44) throw e_44.error; }
            }
        }
        return result.sort(function (r1, r2) { return r1.t - r2.t; });
    };
    WorldSelecter.prototype.tag = function (tag) {
        return this.world.worldObjects.filter(function (obj) { return _.contains(obj.tags, tag); });
    };
    WorldSelecter.prototype.type = function (type, checked) {
        if (checked === void 0) { checked = true; }
        var results = this.typeAll(type);
        if (_.isEmpty(results)) {
            if (checked)
                error("No object of type " + type.name + " exists in world:", this.world);
            return undefined;
        }
        if (results.length > 1) {
            error("Multiple objects of type " + type.name + " exist in world. Returning one of them. World:", this.world);
        }
        return results[0];
    };
    WorldSelecter.prototype.typeAll = function (type) {
        return this.world.worldObjects.filter(function (obj) { return obj instanceof type; });
    };
    return WorldSelecter;
}());
var CircleBounds = /** @class */ (function () {
    function CircleBounds(x, y, radius, parent) {
        this.parent = parent;
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.center = new Vector2(x, y);
        this.boundingBox = new Rectangle(0, 0, 0, 0);
    }
    CircleBounds.prototype.clone = function () {
        return new CircleBounds(this.x, this.y, this.radius, this.parent);
    };
    CircleBounds.prototype.getCenter = function () {
        var x = this.parent ? this.parent.x : 0;
        var y = this.parent ? this.parent.y : 0;
        this.center.x = x + this.x;
        this.center.y = y + this.y;
        return this.center;
    };
    CircleBounds.prototype.getBoundingBox = function (x, y) {
        x = x !== null && x !== void 0 ? x : (this.parent ? this.parent.x : 0);
        y = y !== null && y !== void 0 ? y : (this.parent ? this.parent.y : 0);
        this.boundingBox.x = x + this.x - this.radius;
        this.boundingBox.y = y + this.y - this.radius;
        this.boundingBox.width = this.radius * 2;
        this.boundingBox.height = this.radius * 2;
        return this.boundingBox;
    };
    CircleBounds.prototype.getDisplacementCollision = function (other) {
        if (other instanceof RectBounds)
            return Bounds.Collision.getDisplacementCollisionCircleRect(this, other);
        if (other instanceof CircleBounds)
            return Bounds.Collision.getDisplacementCollisionCircleCircle(this, other);
        if (other instanceof SlopeBounds)
            return Bounds.Collision.getDisplacementCollisionCircleSlope(this, other);
        if (other instanceof InvertedRectBounds)
            return Bounds.Collision.getDisplacementCollisionCircleInvertedRect(this, other);
        if (other instanceof NullBounds)
            return undefined;
        error("No collision supported between these bounds", this, other);
        return undefined;
    };
    CircleBounds.prototype.getRaycastCollision = function (dx, dy, other, otherdx, otherdy) {
        if (other instanceof RectBounds)
            return Bounds.Collision.getRaycastCollisionCircleRect(this, dx, dy, other, otherdx, otherdy);
        if (other instanceof CircleBounds)
            return Bounds.Collision.getRaycastCollisionCircleCircle(this, dx, dy, other, otherdx, otherdy);
        if (other instanceof SlopeBounds)
            return Bounds.Collision.getRaycastCollisionCircleSlope(this, dx, dy, other, otherdx, otherdy);
        if (other instanceof InvertedRectBounds)
            return Bounds.Collision.getRaycastCollisionCircleInvertedRect(this, dx, dy, other, otherdx, otherdy);
        if (other instanceof NullBounds)
            return undefined;
        error("No collision supported between these bounds", this, other);
        return undefined;
    };
    CircleBounds.prototype.isOverlapping = function (other) {
        if (other instanceof RectBounds)
            return Bounds.Collision.isOverlappingCircleRect(this, other);
        if (other instanceof CircleBounds)
            return Bounds.Collision.isOverlappingCircleCircle(this, other);
        if (other instanceof SlopeBounds)
            return Bounds.Collision.isOverlappingCircleSlope(this, other);
        if (other instanceof InvertedRectBounds)
            return Bounds.Collision.isOverlappingCircleInvertedRect(this, other);
        if (other instanceof NullBounds)
            return undefined;
        error("No overlap supported between these bounds", this, other);
        return false;
    };
    CircleBounds.prototype.raycast = function (x, y, dx, dy) {
        var center = this.getCenter();
        var a = Math.pow(dx, 2) + Math.pow(dy, 2);
        var b = 2 * ((x - center.x) * dx + (y - center.y) * dy);
        var c = Math.pow((x - center.x), 2) + Math.pow((y - center.y), 2) - Math.pow(this.radius, 2);
        var disc = Math.pow(b, 2) - 4 * a * c;
        if (disc < 0)
            return Infinity;
        var small_t = (-b - Math.sqrt(disc)) / (2 * a);
        var large_t = (-b + Math.sqrt(disc)) / (2 * a);
        var t = small_t >= 0 ? small_t : large_t;
        if (t < 0)
            return Infinity;
        return t;
    };
    return CircleBounds;
}());
var Bounds;
(function (Bounds) {
    var Collision;
    (function (Collision) {
        var OVERLAP_EPSILON = 0.000001;
        function getDisplacementCollisionCircleCircle(move, from) {
            if (!move.isOverlapping(from))
                return undefined;
            var movePos = move.getCenter();
            var fromPos = from.getCenter();
            var distance = M.distance(movePos.x, movePos.y, fromPos.x, fromPos.y);
            var dx = 0;
            var dy = move.radius + from.radius;
            if (distance !== 0) {
                var dradius = (move.radius + from.radius) - distance;
                dx = (movePos.x - fromPos.x) * dradius / distance;
                dy = (movePos.y - fromPos.y) * dradius / distance;
            }
            return {
                bounds1: move,
                bounds2: from,
                displacementX: dx,
                displacementY: dy,
            };
        }
        Collision.getDisplacementCollisionCircleCircle = getDisplacementCollisionCircleCircle;
        function getDisplacementCollisionCircleRect(move, from) {
            if (!move.isOverlapping(from))
                return undefined;
            var movePos = move.getCenter();
            var fromBox = from.getBoundingBox();
            var checkTop = movePos.y <= fromBox.top + fromBox.height / 2;
            var checkLeft = movePos.x <= fromBox.left + fromBox.width / 2;
            var displacementXs = [];
            var displacementYs = [];
            if (checkTop) {
                displacementXs.push(0);
                displacementYs.push(fromBox.top - move.radius - movePos.y);
            }
            else {
                displacementXs.push(0);
                displacementYs.push(fromBox.bottom + move.radius - movePos.y);
            }
            if (checkLeft) {
                displacementXs.push(fromBox.left - move.radius - movePos.x);
                displacementYs.push(0);
            }
            else {
                displacementXs.push(fromBox.right + move.radius - movePos.x);
                displacementYs.push(0);
            }
            if (checkTop && checkLeft) {
                if (movePos.x === fromBox.left && movePos.y === fromBox.top) {
                    displacementXs.push(-move.radius * Math.SQRT2);
                    displacementYs.push(-move.radius * Math.SQRT2);
                }
                else if (movePos.x < fromBox.left && movePos.y < fromBox.top) {
                    var srcd = M.distance(movePos.x, movePos.y, fromBox.left, fromBox.top);
                    var dstd = move.radius - srcd;
                    displacementXs.push((movePos.x - fromBox.left) * dstd / srcd);
                    displacementYs.push((movePos.y - fromBox.top) * dstd / srcd);
                }
                else if (movePos.x > fromBox.left && movePos.y > fromBox.top) {
                    var srcd = M.distance(movePos.x, movePos.y, fromBox.left, fromBox.top);
                    var dstd = move.radius + srcd;
                    displacementXs.push((movePos.x - fromBox.left) * dstd / srcd);
                    displacementYs.push((movePos.y - fromBox.top) * dstd / srcd);
                }
            }
            else if (checkTop && !checkLeft) {
                if (movePos.x === fromBox.right && movePos.y === fromBox.top) {
                    displacementXs.push(move.radius * Math.SQRT2);
                    displacementYs.push(-move.radius * Math.SQRT2);
                }
                else if (movePos.x > fromBox.right && movePos.y < fromBox.top) {
                    var srcd = M.distance(movePos.x, movePos.y, fromBox.right, fromBox.top);
                    var dstd = move.radius - srcd;
                    displacementXs.push((movePos.x - fromBox.right) * dstd / srcd);
                    displacementYs.push((movePos.y - fromBox.top) * dstd / srcd);
                }
                else if (movePos.x < fromBox.right && movePos.y > fromBox.top) {
                    var srcd = M.distance(movePos.x, movePos.y, fromBox.right, fromBox.top);
                    var dstd = move.radius + srcd;
                    displacementXs.push((movePos.x - fromBox.right) * dstd / srcd);
                    displacementYs.push((movePos.y - fromBox.top) * dstd / srcd);
                }
            }
            else if (!checkTop && !checkLeft) {
                if (movePos.x === fromBox.right && movePos.y === fromBox.bottom) {
                    displacementXs.push(move.radius * Math.SQRT2);
                    displacementYs.push(move.radius * Math.SQRT2);
                }
                else if (movePos.x > fromBox.right && movePos.y > fromBox.bottom) {
                    var srcd = M.distance(movePos.x, movePos.y, fromBox.right, fromBox.bottom);
                    var dstd = move.radius - srcd;
                    displacementXs.push((movePos.x - fromBox.right) * dstd / srcd);
                    displacementYs.push((movePos.y - fromBox.bottom) * dstd / srcd);
                }
                else if (movePos.x < fromBox.right && movePos.y < fromBox.bottom) {
                    var srcd = M.distance(movePos.x, movePos.y, fromBox.right, fromBox.bottom);
                    var dstd = move.radius + srcd;
                    displacementXs.push((movePos.x - fromBox.right) * dstd / srcd);
                    displacementYs.push((movePos.y - fromBox.bottom) * dstd / srcd);
                }
            }
            else if (!checkTop && checkLeft) {
                if (movePos.x === fromBox.left && movePos.y === fromBox.bottom) {
                    displacementXs.push(-move.radius * Math.SQRT2);
                    displacementYs.push(move.radius * Math.SQRT2);
                }
                else if (movePos.x < fromBox.left && movePos.y > fromBox.bottom) {
                    var srcd = M.distance(movePos.x, movePos.y, fromBox.left, fromBox.bottom);
                    var dstd = move.radius - srcd;
                    displacementXs.push((movePos.x - fromBox.left) * dstd / srcd);
                    displacementYs.push((movePos.y - fromBox.bottom) * dstd / srcd);
                }
                else if (movePos.x > fromBox.left && movePos.y < fromBox.bottom) {
                    var srcd = M.distance(movePos.x, movePos.y, fromBox.left, fromBox.bottom);
                    var dstd = move.radius + srcd;
                    displacementXs.push((movePos.x - fromBox.left) * dstd / srcd);
                    displacementYs.push((movePos.y - fromBox.bottom) * dstd / srcd);
                }
            }
            if (displacementXs.length === 0)
                return undefined;
            var i = M.argmin(A.range(displacementXs.length), function (i) { return M.magnitude(displacementXs[i], displacementYs[i]); });
            return {
                bounds1: move,
                bounds2: from,
                displacementX: displacementXs[i],
                displacementY: displacementYs[i],
            };
        }
        Collision.getDisplacementCollisionCircleRect = getDisplacementCollisionCircleRect;
        function getDisplacementCollisionCircleSlope(move, from) {
            if (!move.isOverlapping(from))
                return undefined;
            var movePos = move.getCenter();
            var fromBox = from.getBoundingBox();
            var newXs = [];
            var newYs = [];
            // Right edge
            if (from.direction !== 'upright' && from.direction !== 'downright') {
                var t_1 = closestPointOnLine_t(movePos.x, movePos.y, fromBox.right + move.radius, fromBox.top, fromBox.right + move.radius, fromBox.bottom);
                if (0 <= t_1 && t_1 <= 1) {
                    newXs.push(fromBox.right + move.radius);
                    newYs.push(fromBox.top * (1 - t_1) + fromBox.bottom * t_1);
                }
            }
            // Left edge
            if (from.direction !== 'upleft' && from.direction !== 'downleft') {
                var t_2 = closestPointOnLine_t(movePos.x, movePos.y, fromBox.left - move.radius, fromBox.top, fromBox.left - move.radius, fromBox.bottom);
                if (0 <= t_2 && t_2 <= 1) {
                    newXs.push(fromBox.left - move.radius);
                    newYs.push(fromBox.top * (1 - t_2) + fromBox.bottom * t_2);
                }
            }
            // Top edge
            if (from.direction !== 'upleft' && from.direction !== 'upright') {
                var t_3 = closestPointOnLine_t(movePos.x, movePos.y, fromBox.left, fromBox.top - move.radius, fromBox.right, fromBox.top - move.radius);
                if (0 <= t_3 && t_3 <= 1) {
                    newXs.push(fromBox.left * (1 - t_3) + fromBox.right * t_3);
                    newYs.push(fromBox.top - move.radius);
                }
            }
            // Bottom edge
            if (from.direction !== 'downleft' && from.direction !== 'downright') {
                var t_4 = closestPointOnLine_t(movePos.x, movePos.y, fromBox.left, fromBox.bottom + move.radius, fromBox.right, fromBox.bottom + move.radius);
                if (0 <= t_4 && t_4 <= 1) {
                    newXs.push(fromBox.left * (1 - t_4) + fromBox.right * t_4);
                    newYs.push(fromBox.bottom + move.radius);
                }
            }
            // Diagonal edges
            var dfactor = move.radius / M.magnitude(fromBox.width, fromBox.height);
            var rx = fromBox.height * dfactor;
            var ry = fromBox.width * dfactor;
            var lx1, ly1, lx2, ly2;
            if (from.direction === 'upleft') {
                lx1 = fromBox.left - rx;
                ly1 = fromBox.bottom - ry;
                lx2 = fromBox.right - rx;
                ly2 = fromBox.top - ry;
            }
            else if (from.direction === 'upright') {
                lx1 = fromBox.left + rx;
                ly1 = fromBox.top - ry;
                lx2 = fromBox.right + rx;
                ly2 = fromBox.bottom - ry;
            }
            else if (from.direction === 'downleft') {
                lx1 = fromBox.left - rx;
                ly1 = fromBox.top + ry;
                lx2 = fromBox.right - rx;
                ly2 = fromBox.bottom + ry;
            }
            else {
                lx1 = fromBox.left + rx;
                ly1 = fromBox.bottom + ry;
                lx2 = fromBox.right + rx;
                ly2 = fromBox.top + ry;
            }
            var t = closestPointOnLine_t(movePos.x, movePos.y, lx1, ly1, lx2, ly2);
            if (0 <= t && t <= 1) {
                newXs.push(lx1 * (1 - t) + lx2 * t);
                newYs.push(ly1 * (1 - t) + ly2 * t);
            }
            // Vertices
            function addVertexPos(vx, vy, ldx1, ldy1, ldx2, ldy2) {
                var angle = closestPointOnCircle_angle(movePos.x, movePos.y, vx, vy);
                var newX = vx + M.cos(angle) * move.radius;
                var newY = vy + M.sin(angle) * move.radius;
                if (vectorBetweenVectors(newX - vx, newY - vy, ldx1, ldy1, ldx2, ldy2)) {
                    newXs.push(newX);
                    newYs.push(newY);
                }
            }
            if (from.direction === 'upleft') {
                addVertexPos(fromBox.right, fromBox.bottom, 1, 0, 0, 1);
                addVertexPos(fromBox.right, fromBox.top, 1, 0, -fromBox.height, -fromBox.width);
                addVertexPos(fromBox.left, fromBox.bottom, 0, 1, -fromBox.height, -fromBox.width);
            }
            else if (from.direction === 'upright') {
                addVertexPos(fromBox.left, fromBox.bottom, -1, 0, 0, 1);
                addVertexPos(fromBox.left, fromBox.top, -1, 0, fromBox.height, -fromBox.width);
                addVertexPos(fromBox.right, fromBox.bottom, 0, 1, fromBox.height, -fromBox.width);
            }
            else if (from.direction === 'downright') {
                addVertexPos(fromBox.left, fromBox.top, -1, 0, 0, -1);
                addVertexPos(fromBox.left, fromBox.bottom, -1, 0, fromBox.height, fromBox.width);
                addVertexPos(fromBox.right, fromBox.top, 0, -1, fromBox.height, fromBox.width);
            }
            else {
                addVertexPos(fromBox.right, fromBox.top, 1, 0, 0, -1);
                addVertexPos(fromBox.right, fromBox.bottom, 1, 0, -fromBox.height, fromBox.width);
                addVertexPos(fromBox.left, fromBox.top, 0, -1, -fromBox.height, fromBox.width);
            }
            if (newXs.length === 0)
                return undefined;
            var i = M.argmin(A.range(newXs.length), function (i) { return M.distanceSq(movePos.x, movePos.y, newXs[i], newYs[i]); });
            var displacementX = newXs[i] - movePos.x;
            var displacementY = newYs[i] - movePos.y;
            return {
                bounds1: move,
                bounds2: from,
                displacementX: displacementX,
                displacementY: displacementY,
            };
        }
        Collision.getDisplacementCollisionCircleSlope = getDisplacementCollisionCircleSlope;
        function getDisplacementCollisionCircleInvertedRect(move, from) {
            if (!move.isOverlapping(from))
                return undefined;
            var movePos = move.getCenter();
            var fromBox = from.getBoundingBox();
            var displacementX = 0;
            if (movePos.x - move.radius < fromBox.left)
                displacementX = fromBox.left - (movePos.x - move.radius);
            if (movePos.x + move.radius > fromBox.right)
                displacementX = fromBox.right - (movePos.x + move.radius);
            var displacementY = 0;
            if (movePos.y - move.radius < fromBox.top)
                displacementY = fromBox.top - (movePos.y - move.radius);
            if (movePos.y + move.radius > fromBox.bottom)
                displacementY = fromBox.bottom - (movePos.y + move.radius);
            return {
                bounds1: move,
                bounds2: from,
                displacementX: displacementX,
                displacementY: displacementY,
            };
        }
        Collision.getDisplacementCollisionCircleInvertedRect = getDisplacementCollisionCircleInvertedRect;
        function getDisplacementCollisionRectRect(move, from) {
            if (!move.isOverlapping(from))
                return undefined;
            var currentBox = move.getBoundingBox();
            var currentOtherBox = from.getBoundingBox();
            var displacementX = M.argmin([currentOtherBox.right - currentBox.left, currentOtherBox.left - currentBox.right], Math.abs);
            var displacementY = M.argmin([currentOtherBox.bottom - currentBox.top, currentOtherBox.top - currentBox.bottom], Math.abs);
            if (Math.abs(displacementX) < Math.abs(displacementY)) {
                displacementY = 0;
            }
            else {
                displacementX = 0;
            }
            return {
                bounds1: move,
                bounds2: from,
                displacementX: displacementX,
                displacementY: displacementY,
            };
        }
        Collision.getDisplacementCollisionRectRect = getDisplacementCollisionRectRect;
        function getDisplacementCollisionRectSlope(move, from) {
            if (!move.isOverlapping(from))
                return undefined;
            var moveBox = move.getBoundingBox();
            var fromBox = from.getBoundingBox();
            var newXs = [];
            var newYs = [];
            // Left Edge + vertex
            if (from.direction === 'upright' || from.direction === 'downright'
                || (from.direction === 'upleft' && moveBox.top < fromBox.bottom && fromBox.bottom < moveBox.bottom)
                || (from.direction === 'downleft' && moveBox.top < fromBox.top && fromBox.top < moveBox.bottom)) {
                newXs.push(fromBox.left - moveBox.width);
                newYs.push(moveBox.top);
            }
            // Right Edge + vertex
            if (from.direction === 'upleft' || from.direction === 'downleft'
                || (from.direction === 'upright' && moveBox.top < fromBox.bottom && fromBox.bottom < moveBox.bottom)
                || (from.direction === 'downright' && moveBox.top < fromBox.top && fromBox.top < moveBox.bottom)) {
                newXs.push(fromBox.right);
                newYs.push(moveBox.top);
            }
            // Top Edge + vertex
            if (from.direction === 'downleft' || from.direction === 'downright'
                || (from.direction === 'upleft' && moveBox.left < fromBox.right && fromBox.right < moveBox.right)
                || (from.direction === 'upright' && moveBox.left < fromBox.left && fromBox.left < moveBox.right)) {
                newXs.push(moveBox.left);
                newYs.push(fromBox.top - moveBox.height);
            }
            // Bottom Edge + vertex
            if (from.direction === 'upleft' || from.direction === 'upright'
                || (from.direction === 'downleft' && moveBox.left < fromBox.right && fromBox.right < moveBox.right)
                || (from.direction === 'downright' && moveBox.left < fromBox.left && fromBox.left < moveBox.right)) {
                newXs.push(moveBox.left);
                newYs.push(fromBox.bottom);
            }
            var ww = fromBox.width * fromBox.width;
            var hh = fromBox.height * fromBox.height;
            var wh = fromBox.width * fromBox.height;
            // Up-left edge
            if (from.direction === 'upleft') {
                var xi = (ww * moveBox.right + hh * fromBox.left + wh * fromBox.bottom - wh * moveBox.bottom) / (ww + hh);
                var yi = fromBox.width / fromBox.height * (xi - moveBox.right) + moveBox.bottom;
                newXs.push(xi - moveBox.width);
                newYs.push(yi - moveBox.height);
            }
            // Up-right edge
            if (from.direction === 'upright') {
                var xi = (ww * moveBox.left + hh * fromBox.left - wh * fromBox.top + wh * moveBox.bottom) / (ww + hh);
                var yi = -fromBox.width / fromBox.height * (xi - moveBox.left) + moveBox.bottom;
                newXs.push(xi);
                newYs.push(yi - moveBox.height);
            }
            // Down-right edge
            if (from.direction === 'downright') {
                var xi = (ww * moveBox.left + hh * fromBox.left + wh * fromBox.bottom - wh * moveBox.top) / (ww + hh);
                var yi = fromBox.width / fromBox.height * (xi - moveBox.left) + moveBox.top;
                newXs.push(xi);
                newYs.push(yi);
            }
            // Down-left edge
            if (from.direction === 'downleft') {
                var xi = (ww * moveBox.right + hh * fromBox.left - wh * fromBox.top + wh * moveBox.top) / (ww + hh);
                var yi = -fromBox.width / fromBox.height * (xi - moveBox.right) + moveBox.top;
                newXs.push(xi - moveBox.width);
                newYs.push(yi);
            }
            if (newXs.length === 0)
                return undefined;
            var i = M.argmin(A.range(newXs.length), function (i) { return M.distanceSq(moveBox.left, moveBox.top, newXs[i], newYs[i]); });
            var displacementX = newXs[i] - moveBox.left;
            var displacementY = newYs[i] - moveBox.top;
            return {
                bounds1: move,
                bounds2: from,
                displacementX: displacementX,
                displacementY: displacementY,
            };
        }
        Collision.getDisplacementCollisionRectSlope = getDisplacementCollisionRectSlope;
        function getDisplacementCollisionRectInvertedRect(move, from) {
            if (!move.isOverlapping(from))
                return undefined;
            var moveBox = move.getBoundingBox();
            var fromBox = from.getBoundingBox();
            var displacementX = 0;
            if (moveBox.left < fromBox.left)
                displacementX = fromBox.left - moveBox.left;
            if (moveBox.right > fromBox.right)
                displacementX = fromBox.right - moveBox.right;
            var displacementY = 0;
            if (moveBox.top < fromBox.top)
                displacementY = fromBox.top - moveBox.top;
            if (moveBox.bottom > fromBox.bottom)
                displacementY = fromBox.bottom - moveBox.bottom;
            return {
                bounds1: move,
                bounds2: from,
                displacementX: displacementX,
                displacementY: displacementY,
            };
        }
        Collision.getDisplacementCollisionRectInvertedRect = getDisplacementCollisionRectInvertedRect;
        function getRaycastCollisionCircleCircle(move, movedx, movedy, from, fromdx, fromdy) {
            if (!move.isOverlapping(from))
                return undefined;
            var movePos = move.getCenter();
            movePos.x -= movedx;
            movePos.y -= movedy;
            var fromPos = from.getCenter();
            fromPos.x -= fromdx;
            fromPos.y -= fromdy;
            var t = raycastTimeCircleCircle(movePos.x - fromPos.x, movePos.y - fromPos.y, movedx - fromdx, movedy - fromdy, move.radius + from.radius);
            var result = getDisplacementCollisionCircleCircle(move, from);
            result.t = t;
            return result;
        }
        Collision.getRaycastCollisionCircleCircle = getRaycastCollisionCircleCircle;
        function getRaycastCollisionCircleRect(move, movedx, movedy, from, fromdx, fromdy) {
            if (!move.isOverlapping(from))
                return undefined;
            var movePos = move.getCenter();
            movePos.x -= movedx;
            movePos.y -= movedy;
            var fromBox = from.getBoundingBox();
            fromBox.x -= fromdx;
            fromBox.y -= fromdy;
            var topleft_t = raycastTimeCircleCircle(movePos.x - fromBox.left, movePos.y - fromBox.top, movedx - fromdx, movedy - fromdy, move.radius);
            var topright_t = raycastTimeCircleCircle(movePos.x - fromBox.right, movePos.y - fromBox.top, movedx - fromdx, movedy - fromdy, move.radius);
            var bottomright_t = raycastTimeCircleCircle(movePos.x - fromBox.right, movePos.y - fromBox.bottom, movedx - fromdx, movedy - fromdy, move.radius);
            var bottomleft_t = raycastTimeCircleCircle(movePos.x - fromBox.left, movePos.y - fromBox.bottom, movedx - fromdx, movedy - fromdy, move.radius);
            var left_t = raycastTimeCircleSegment(movePos.x - fromBox.left, movePos.y - fromBox.top, movedx - fromdx, movedy - fromdy, move.radius, 0, fromBox.height);
            var right_t = raycastTimeCircleSegment(movePos.x - fromBox.right, movePos.y - fromBox.top, movedx - fromdx, movedy - fromdy, move.radius, 0, fromBox.height);
            var top_t = raycastTimeCircleSegment(movePos.x - fromBox.left, movePos.y - fromBox.top, movedx - fromdx, movedy - fromdy, move.radius, fromBox.width, 0);
            var bottom_t = raycastTimeCircleSegment(movePos.x - fromBox.left, movePos.y - fromBox.bottom, movedx - fromdx, movedy - fromdy, move.radius, fromBox.width, 0);
            var t = Math.min(topleft_t, topright_t, bottomright_t, bottomleft_t, left_t, right_t, top_t, bottom_t);
            var result = getDisplacementCollisionCircleRect(move, from);
            result.t = t;
            return result;
        }
        Collision.getRaycastCollisionCircleRect = getRaycastCollisionCircleRect;
        function getRaycastCollisionCircleSlope(move, movedx, movedy, from, fromdx, fromdy) {
            if (!move.isOverlapping(from))
                return undefined;
            var movePos = move.getCenter();
            movePos.x -= movedx;
            movePos.y -= movedy;
            var fromBox = from.getBoundingBox();
            fromBox.x -= fromdx;
            fromBox.y -= fromdy;
            var topleft_t = from.direction === 'upleft' ? Infinity : raycastTimeCircleCircle(movePos.x - fromBox.left, movePos.y - fromBox.top, movedx - fromdx, movedy - fromdy, move.radius);
            var topright_t = from.direction === 'upright' ? Infinity : raycastTimeCircleCircle(movePos.x - fromBox.right, movePos.y - fromBox.top, movedx - fromdx, movedy - fromdy, move.radius);
            var bottomright_t = from.direction === 'downright' ? Infinity : raycastTimeCircleCircle(movePos.x - fromBox.right, movePos.y - fromBox.bottom, movedx - fromdx, movedy - fromdy, move.radius);
            var bottomleft_t = from.direction === 'downleft' ? Infinity : raycastTimeCircleCircle(movePos.x - fromBox.left, movePos.y - fromBox.bottom, movedx - fromdx, movedy - fromdy, move.radius);
            var line1_t, line2_t, line3_t;
            if (from.direction === 'upleft') {
                line1_t = raycastTimeCircleSegment(movePos.x - fromBox.right, movePos.y - fromBox.top, movedx - fromdx, movedy - fromdy, move.radius, 0, fromBox.height);
                line2_t = raycastTimeCircleSegment(movePos.x - fromBox.left, movePos.y - fromBox.bottom, movedx - fromdx, movedy - fromdy, move.radius, fromBox.width, 0);
                line3_t = raycastTimeCircleSegment(movePos.x - fromBox.left, movePos.y - fromBox.bottom, movedx - fromdx, movedy - fromdy, move.radius, fromBox.width, -fromBox.height);
            }
            else if (from.direction === 'upright') {
                line1_t = raycastTimeCircleSegment(movePos.x - fromBox.left, movePos.y - fromBox.top, movedx - fromdx, movedy - fromdy, move.radius, 0, fromBox.height);
                line2_t = raycastTimeCircleSegment(movePos.x - fromBox.left, movePos.y - fromBox.bottom, movedx - fromdx, movedy - fromdy, move.radius, fromBox.width, 0);
                line3_t = raycastTimeCircleSegment(movePos.x - fromBox.left, movePos.y - fromBox.top, movedx - fromdx, movedy - fromdy, move.radius, fromBox.width, fromBox.height);
            }
            else if (from.direction === 'downright') {
                line1_t = raycastTimeCircleSegment(movePos.x - fromBox.left, movePos.y - fromBox.top, movedx - fromdx, movedy - fromdy, move.radius, 0, fromBox.height);
                line2_t = raycastTimeCircleSegment(movePos.x - fromBox.left, movePos.y - fromBox.top, movedx - fromdx, movedy - fromdy, move.radius, fromBox.width, 0);
                line3_t = raycastTimeCircleSegment(movePos.x - fromBox.left, movePos.y - fromBox.bottom, movedx - fromdx, movedy - fromdy, move.radius, fromBox.width, -fromBox.height);
            }
            else {
                line1_t = raycastTimeCircleSegment(movePos.x - fromBox.right, movePos.y - fromBox.top, movedx - fromdx, movedy - fromdy, move.radius, 0, fromBox.height);
                line2_t = raycastTimeCircleSegment(movePos.x - fromBox.left, movePos.y - fromBox.top, movedx - fromdx, movedy - fromdy, move.radius, fromBox.width, 0);
                line3_t = raycastTimeCircleSegment(movePos.x - fromBox.left, movePos.y - fromBox.top, movedx - fromdx, movedy - fromdy, move.radius, fromBox.width, fromBox.height);
            }
            var t = Math.min(topleft_t, topright_t, bottomright_t, bottomleft_t, line1_t, line2_t, line3_t);
            var result = getDisplacementCollisionCircleSlope(move, from);
            result.t = t;
            return result;
        }
        Collision.getRaycastCollisionCircleSlope = getRaycastCollisionCircleSlope;
        function getRaycastCollisionCircleInvertedRect(move, movedx, movedy, from, fromdx, fromdy) {
            if (!move.isOverlapping(from))
                return undefined;
            var movePos = move.getCenter();
            movePos.x -= movedx;
            movePos.y -= movedy;
            var fromBox = from.getBoundingBox();
            fromBox.x -= fromdx;
            fromBox.y -= fromdy;
            var left_t = movePos.x - move.radius + movedx < fromBox.left ? (movePos.x - move.radius - fromBox.left) / (fromdx - movedx) : Infinity;
            var right_t = movePos.x + move.radius + movedx > fromBox.right ? (movePos.x + move.radius - fromBox.right) / (fromdx - movedx) : Infinity;
            var top_t = movePos.y - move.radius + movedy < fromBox.top ? (movePos.y - move.radius - fromBox.top) / (fromdy - movedy) : Infinity;
            var bottom_t = movePos.y + move.radius + movedy > fromBox.bottom ? (movePos.y + move.radius - fromBox.bottom) / (fromdy - movedy) : Infinity;
            var t = Math.min(left_t, right_t, top_t, bottom_t);
            if (!isFinite(t)) {
                error("Failed to detect time of collision between circle and inverted rect:", move.parent, { x: movePos.x, y: movePos.y, radius: move.radius }, movedx, movedy, from.parent, fromBox, fromdx, fromdy);
            }
            var result = getDisplacementCollisionCircleInvertedRect(move, from);
            result.t = t;
            return result;
        }
        Collision.getRaycastCollisionCircleInvertedRect = getRaycastCollisionCircleInvertedRect;
        function getRaycastCollisionRectRect(move, movedx, movedy, from, fromdx, fromdy) {
            if (!move.isOverlapping(from))
                return undefined;
            var box = move.getBoundingBox();
            box.x -= movedx;
            box.y -= movedy;
            var otherbox = from.getBoundingBox();
            otherbox.x -= fromdx;
            otherbox.y -= fromdy;
            var topbot_t = Infinity;
            var bottop_t = Infinity;
            var leftright_t = Infinity;
            var rightleft_t = Infinity;
            if (movedy !== fromdy) {
                topbot_t = (box.top - otherbox.bottom) / (fromdy - movedy);
                if (box.right + movedx * topbot_t <= otherbox.left + fromdx * topbot_t || box.left + movedx * topbot_t >= otherbox.right + fromdx * topbot_t) {
                    topbot_t = Infinity;
                }
                bottop_t = (box.bottom - otherbox.top) / (fromdy - movedy);
                if (box.right + movedx * bottop_t <= otherbox.left + fromdx * bottop_t || box.left + movedx * bottop_t >= otherbox.right + fromdx * bottop_t) {
                    bottop_t = Infinity;
                }
            }
            if (movedx !== fromdx) {
                leftright_t = (box.left - otherbox.right) / (fromdx - movedx);
                if (box.bottom + movedy * leftright_t <= otherbox.top + fromdy * leftright_t || box.top + movedy * leftright_t >= otherbox.bottom + fromdy * leftright_t) {
                    leftright_t = Infinity;
                }
                rightleft_t = (box.right - otherbox.left) / (fromdx - movedx);
                if (box.bottom + movedy * rightleft_t <= otherbox.top + fromdy * rightleft_t || box.top + movedy * rightleft_t >= otherbox.bottom + fromdy * rightleft_t) {
                    rightleft_t = Infinity;
                }
            }
            var min_t = Math.min(topbot_t, bottop_t, leftright_t, rightleft_t);
            if (min_t === Infinity)
                return undefined;
            var displacementX = 0;
            var displacementY = 0;
            var currentBox = move.getBoundingBox();
            var currentOtherBox = from.getBoundingBox();
            if (min_t === topbot_t) {
                displacementY = currentOtherBox.bottom - currentBox.top;
            }
            else if (min_t === bottop_t) {
                displacementY = currentOtherBox.top - currentBox.bottom;
            }
            else if (min_t === leftright_t) {
                displacementX = currentOtherBox.right - currentBox.left;
            }
            else if (min_t === rightleft_t) {
                displacementX = currentOtherBox.left - currentBox.right;
            }
            if (displacementX !== 0 && displacementY !== 0) {
                error("Warning: rect displacement in both axes");
            }
            return {
                bounds1: move,
                bounds2: from,
                t: min_t,
                displacementX: displacementX,
                displacementY: displacementY,
            };
        }
        Collision.getRaycastCollisionRectRect = getRaycastCollisionRectRect;
        function getRaycastCollisionRectSlope(move, movedx, movedy, from, fromdx, fromdy) {
            if (!move.isOverlapping(from))
                return undefined;
            var moveBox = move.getBoundingBox();
            moveBox.x -= movedx;
            moveBox.y -= movedy;
            var fromBox = from.getBoundingBox();
            fromBox.x -= fromdx;
            fromBox.y -= fromdy;
            var left_t = Infinity;
            var right_t = Infinity;
            var top_t = Infinity;
            var bottom_t = Infinity;
            if (movedx !== fromdx) {
                left_t = (fromBox.left - moveBox.right) / (movedx - fromdx);
                if (moveBox.top + movedy * left_t >= fromBox.bottom + fromdy * left_t || fromBox.top + fromdy * left_t >= moveBox.bottom + movedy * left_t)
                    left_t = Infinity;
                if (from.direction === 'upleft' && (moveBox.top + movedy * left_t >= fromBox.bottom + fromdy * left_t || fromBox.bottom + fromdy * left_t >= moveBox.bottom + movedy * left_t))
                    left_t = Infinity;
                if (from.direction === 'downleft' && (moveBox.top + movedy * left_t >= fromBox.top + fromdy * left_t || fromBox.top + fromdy * left_t >= moveBox.bottom + movedy * left_t))
                    left_t = Infinity;
                right_t = (fromBox.right - moveBox.left) / (movedx - fromdx);
                if (moveBox.top + movedy * right_t >= fromBox.bottom + fromdy * right_t || fromBox.top + fromdy * right_t >= moveBox.bottom + movedy * right_t)
                    right_t = Infinity;
                if (from.direction === 'upright' && (moveBox.top + movedy * right_t >= fromBox.bottom + fromdy * right_t || fromBox.bottom + fromdy * right_t >= moveBox.bottom + movedy * right_t))
                    right_t = Infinity;
                if (from.direction === 'downright' && (moveBox.top + movedy * right_t >= fromBox.top + fromdy * right_t || fromBox.top + fromdy * right_t >= moveBox.bottom + movedy * right_t))
                    right_t = Infinity;
            }
            if (movedy !== fromdy) {
                top_t = (fromBox.top - moveBox.bottom) / (movedy - fromdy);
                if (moveBox.left + movedx * top_t >= fromBox.right + fromdx * top_t || fromBox.left + fromdx * top_t >= moveBox.right + movedx * top_t)
                    top_t = Infinity;
                if (from.direction === 'upleft' && (moveBox.left + movedx * top_t >= fromBox.right + fromdx * top_t || fromBox.right + fromdx * top_t >= moveBox.right + movedx * top_t))
                    top_t = Infinity;
                if (from.direction === 'upright' && (moveBox.left + movedx * top_t >= fromBox.left + fromdx * top_t || fromBox.left + fromdx * top_t >= moveBox.right + movedx * top_t))
                    top_t = Infinity;
                bottom_t = (fromBox.bottom - moveBox.top) / (movedy - fromdy);
                if (moveBox.left + movedx * bottom_t >= fromBox.right + fromdx * bottom_t || fromBox.left + fromdx * bottom_t >= moveBox.right + movedx * bottom_t)
                    bottom_t = Infinity;
                if (from.direction === 'downleft' && (moveBox.left + movedx * bottom_t >= fromBox.right + fromdx * bottom_t || fromBox.right + fromdx * bottom_t >= moveBox.right + movedx * bottom_t))
                    bottom_t = Infinity;
                if (from.direction === 'downright' && (moveBox.left + movedx * bottom_t >= fromBox.left + fromdx * bottom_t || fromBox.left + fromdx * bottom_t >= moveBox.right + movedx * bottom_t))
                    bottom_t = Infinity;
            }
            var topleft_t = from.direction !== 'upleft' ? Infinity : raycastTimePointSegment(moveBox.right - fromBox.left, moveBox.bottom - fromBox.bottom, movedx - fromdx, movedy - fromdy, fromBox.width, -fromBox.height);
            var topright_t = from.direction !== 'upright' ? Infinity : raycastTimePointSegment(moveBox.left - fromBox.left, moveBox.bottom - fromBox.top, movedx - fromdx, movedy - fromdy, fromBox.width, fromBox.height);
            var bottomleft_t = from.direction !== 'downleft' ? Infinity : raycastTimePointSegment(moveBox.right - fromBox.left, moveBox.top - fromBox.top, movedx - fromdx, movedy - fromdy, fromBox.width, fromBox.height);
            var bottomright_t = from.direction !== 'downright' ? Infinity : raycastTimePointSegment(moveBox.left - fromBox.left, moveBox.top - fromBox.bottom, movedx - fromdx, movedy - fromdy, fromBox.width, -fromBox.height);
            var t = Math.min(left_t, right_t, top_t, bottom_t, topleft_t, topright_t, bottomleft_t, bottomright_t);
            if (!isFinite(t))
                return undefined;
            moveBox = move.getBoundingBox();
            fromBox = from.getBoundingBox();
            var ww = fromBox.width * fromBox.width;
            var hh = fromBox.height * fromBox.height;
            var wh = fromBox.width * fromBox.height;
            var newX, newY;
            if (t === left_t) {
                newX = fromBox.left - moveBox.width;
                newY = moveBox.top;
            }
            else if (t === right_t) {
                newX = fromBox.right;
                newY = moveBox.top;
            }
            else if (t === top_t) {
                newX = moveBox.left;
                newY = fromBox.top - moveBox.height;
            }
            else if (t === bottom_t) {
                newX = moveBox.left;
                newY = fromBox.bottom;
            }
            else if (t === topleft_t) {
                var xi = (ww * moveBox.right + hh * fromBox.left + wh * fromBox.bottom - wh * moveBox.bottom) / (ww + hh);
                var yi = fromBox.width / fromBox.height * (xi - moveBox.right) + moveBox.bottom;
                newX = xi - moveBox.width;
                newY = yi - moveBox.height;
            }
            else if (t === topright_t) {
                var xi = (ww * moveBox.left + hh * fromBox.left - wh * fromBox.top + wh * moveBox.bottom) / (ww + hh);
                var yi = -fromBox.width / fromBox.height * (xi - moveBox.left) + moveBox.bottom;
                newX = xi;
                newY = yi - moveBox.height;
            }
            else if (t === bottomright_t) {
                var xi = (ww * moveBox.left + hh * fromBox.left + wh * fromBox.bottom - wh * moveBox.top) / (ww + hh);
                var yi = fromBox.width / fromBox.height * (xi - moveBox.left) + moveBox.top;
                newX = xi;
                newY = yi;
            }
            else {
                var xi = (ww * moveBox.right + hh * fromBox.left - wh * fromBox.top + wh * moveBox.top) / (ww + hh);
                var yi = -fromBox.width / fromBox.height * (xi - moveBox.right) + moveBox.top;
                newX = xi - moveBox.width;
                newY = yi;
            }
            return {
                bounds1: move,
                bounds2: from,
                t: t,
                displacementX: newX - moveBox.left,
                displacementY: newY - moveBox.top
            };
        }
        Collision.getRaycastCollisionRectSlope = getRaycastCollisionRectSlope;
        function getRaycastCollisionRectInvertedRect(move, movedx, movedy, from, fromdx, fromdy) {
            if (!move.isOverlapping(from))
                return undefined;
            var moveBox = move.getBoundingBox();
            moveBox.x -= movedx;
            moveBox.y -= movedy;
            var fromBox = from.getBoundingBox();
            fromBox.x -= fromdx;
            fromBox.y -= fromdy;
            var left_t = moveBox.left + movedx < fromBox.left ? (moveBox.left - fromBox.left) / (fromdx - movedx) : Infinity;
            var right_t = moveBox.right + movedx > fromBox.right ? (moveBox.right - fromBox.right) / (fromdx - movedx) : Infinity;
            var top_t = moveBox.top + movedy < fromBox.top ? (moveBox.top - fromBox.top) / (fromdy - movedy) : Infinity;
            var bottom_t = moveBox.bottom + movedy > fromBox.bottom ? (moveBox.bottom - fromBox.bottom) / (fromdy - movedy) : Infinity;
            var t = Math.min(left_t, right_t, top_t, bottom_t);
            if (!isFinite(t)) {
                error("Failed to detect time of collision between rect and inverted rect:", move.parent, moveBox, movedx, movedy, from.parent, fromBox, fromdx, fromdy);
            }
            var result = getDisplacementCollisionRectInvertedRect(move, from);
            result.t = t;
            return result;
        }
        Collision.getRaycastCollisionRectInvertedRect = getRaycastCollisionRectInvertedRect;
        function isOverlappingCircleCircle(move, from) {
            var movePosition = move.getCenter();
            var fromPosition = from.getCenter();
            return M.distance(movePosition.x, movePosition.y, fromPosition.x, fromPosition.y) < move.radius + from.radius - OVERLAP_EPSILON;
        }
        Collision.isOverlappingCircleCircle = isOverlappingCircleCircle;
        function isOverlappingCircleRect(move, from) {
            var movePosition = move.getCenter();
            var fromBox = from.getBoundingBox();
            // Tall rect
            if (fromBox.left < movePosition.x && movePosition.x < fromBox.right && fromBox.top - move.radius < movePosition.y && movePosition.y < fromBox.bottom + move.radius) {
                return true;
            }
            // Long rect
            if (fromBox.left - move.radius < movePosition.x && movePosition.x < fromBox.right + move.radius && fromBox.top < movePosition.y && movePosition.y < fromBox.bottom) {
                return true;
            }
            // Vertices
            if (M.distanceSq(movePosition.x, movePosition.y, fromBox.left, fromBox.top) < move.radius * move.radius - OVERLAP_EPSILON) {
                return true;
            }
            if (M.distanceSq(movePosition.x, movePosition.y, fromBox.left, fromBox.bottom) < move.radius * move.radius - OVERLAP_EPSILON) {
                return true;
            }
            if (M.distanceSq(movePosition.x, movePosition.y, fromBox.right, fromBox.bottom) < move.radius * move.radius - OVERLAP_EPSILON) {
                return true;
            }
            if (M.distanceSq(movePosition.x, movePosition.y, fromBox.right, fromBox.top) < move.radius * move.radius - OVERLAP_EPSILON) {
                return true;
            }
            return false;
        }
        Collision.isOverlappingCircleRect = isOverlappingCircleRect;
        function isOverlappingCircleSlope(move, from) {
            var movePos = move.getCenter();
            var fromBox = from.getBoundingBox();
            var centerInBox = fromBox.contains(movePos.x, movePos.y);
            var centerInSlope = (from.direction === 'upright' && movePos.y > fromBox.height / fromBox.width * (movePos.x - fromBox.left) + fromBox.top)
                || (from.direction === 'upleft' && movePos.y > -fromBox.height / fromBox.width * (movePos.x - fromBox.left) + fromBox.bottom)
                || (from.direction === 'downleft' && movePos.y < fromBox.height / fromBox.width * (movePos.x - fromBox.left) + fromBox.top)
                || (from.direction === 'downright' && movePos.y < -fromBox.height / fromBox.width * (movePos.x - fromBox.left) + fromBox.bottom);
            if (centerInBox && centerInSlope) {
                return true;
            }
            // Top edge
            if (from.direction !== 'upleft' && from.direction !== 'upright' && fromBox.left < movePos.x && movePos.x < fromBox.right && fromBox.top - move.radius < movePos.y && movePos.y <= fromBox.top) {
                return true;
            }
            // Bottom edge
            if (from.direction !== 'downleft' && from.direction !== 'downright' && fromBox.left < movePos.x && movePos.x < fromBox.right && fromBox.bottom <= movePos.y && movePos.y < fromBox.bottom + move.radius) {
                return true;
            }
            // Left edge
            if (from.direction !== 'upleft' && from.direction !== 'downleft' && fromBox.left - move.radius < movePos.x && movePos.x <= fromBox.left && fromBox.top < movePos.y && movePos.y < fromBox.bottom) {
                return true;
            }
            // Right edge
            if (from.direction !== 'upright' && from.direction !== 'downright' && fromBox.right <= movePos.x && movePos.x < fromBox.right + move.radius && fromBox.top < movePos.y && movePos.y < fromBox.bottom) {
                return true;
            }
            // Top-left vertex
            if (from.direction !== 'upleft' && M.distanceSq(movePos.x, movePos.y, fromBox.left, fromBox.top) < move.radius * move.radius - OVERLAP_EPSILON) {
                return true;
            }
            // Top-right vertex
            if (from.direction !== 'upright' && M.distanceSq(movePos.x, movePos.y, fromBox.right, fromBox.top) < move.radius * move.radius - OVERLAP_EPSILON) {
                return true;
            }
            // Bottom-right vertex
            if (from.direction !== 'downright' && M.distanceSq(movePos.x, movePos.y, fromBox.right, fromBox.bottom) < move.radius * move.radius - OVERLAP_EPSILON) {
                return true;
            }
            // Bottom-left vertex
            if (from.direction !== 'downleft' && M.distanceSq(movePos.x, movePos.y, fromBox.left, fromBox.bottom) < move.radius * move.radius - OVERLAP_EPSILON) {
                return true;
            }
            // sloped edge /
            if (from.direction !== 'upright' && from.direction !== 'downleft' && circleIntersectsSegment(movePos.x, movePos.y, move.radius, fromBox.left, fromBox.bottom, fromBox.right, fromBox.top)) {
                return true;
            }
            // sloped edge \
            if (from.direction !== 'upleft' && from.direction !== 'downright' && circleIntersectsSegment(movePos.x, movePos.y, move.radius, fromBox.left, fromBox.top, fromBox.right, fromBox.bottom)) {
                return true;
            }
            return false;
        }
        Collision.isOverlappingCircleSlope = isOverlappingCircleSlope;
        function isOverlappingCircleInvertedRect(move, from) {
            var movePos = move.getCenter();
            var fromBox = from.getBoundingBox();
            if (movePos.x - move.radius < fromBox.left)
                return true;
            if (movePos.x + move.radius > fromBox.right)
                return true;
            if (movePos.y - move.radius < fromBox.top)
                return true;
            if (movePos.y + move.radius > fromBox.bottom)
                return true;
            return false;
        }
        Collision.isOverlappingCircleInvertedRect = isOverlappingCircleInvertedRect;
        function isOverlappingRectRect(move, from) {
            return G.overlapRectangles(move.getBoundingBox(), from.getBoundingBox());
        }
        Collision.isOverlappingRectRect = isOverlappingRectRect;
        function isOverlappingRectSlope(move, from) {
            var moveBox = move.getBoundingBox();
            var fromBox = from.getBoundingBox();
            if (!G.overlapRectangles(moveBox, fromBox))
                return false;
            if (from.direction === 'upleft' && moveBox.bottom <= -fromBox.height / fromBox.width * (moveBox.right - fromBox.left) + fromBox.bottom)
                return false;
            if (from.direction === 'upright' && moveBox.bottom <= fromBox.height / fromBox.width * (moveBox.left - fromBox.left) + fromBox.top)
                return false;
            if (from.direction === 'downright' && moveBox.top >= -fromBox.height / fromBox.width * (moveBox.left - fromBox.left) + fromBox.bottom)
                return false;
            if (from.direction === 'downleft' && moveBox.top >= fromBox.height / fromBox.width * (moveBox.right - fromBox.left) + fromBox.top)
                return false;
            return true;
        }
        Collision.isOverlappingRectSlope = isOverlappingRectSlope;
        function isOverlappingRectInvertedRect(move, from) {
            var moveBox = move.getBoundingBox();
            var fromBox = from.getBoundingBox();
            if (moveBox.left < fromBox.left)
                return true;
            if (moveBox.right > fromBox.right)
                return true;
            if (moveBox.top < fromBox.top)
                return true;
            if (moveBox.bottom > fromBox.bottom)
                return true;
            return false;
        }
        Collision.isOverlappingRectInvertedRect = isOverlappingRectInvertedRect;
        function invertDisplacementCollision(collision) {
            if (collision) {
                var temp = collision.bounds1;
                collision.bounds1 = collision.bounds2;
                collision.bounds2 = temp;
                collision.displacementX *= -1;
                collision.displacementY *= -1;
            }
            return collision;
        }
        Collision.invertDisplacementCollision = invertDisplacementCollision;
        function invertRaycastCollision(collision) {
            if (collision) {
                var temp = collision.bounds1;
                collision.bounds1 = collision.bounds2;
                collision.bounds2 = temp;
                collision.displacementX *= -1;
                collision.displacementY *= -1;
            }
            return collision;
        }
        Collision.invertRaycastCollision = invertRaycastCollision;
        function circleIntersectsSegment(cx, cy, r, lx1, ly1, lx2, ly2) {
            var dx = cx - lx1;
            var dy = cy - ly1;
            var ldx = lx2 - lx1;
            var ldy = ly2 - ly1;
            var t = (dx * ldx + dy * ldy) / (ldx * ldx + ldy * ldy);
            if (M.distanceSq(dx, dy, ldx * t, ldy * t) > r * r)
                return false;
            var tInRange = 0 < t && t < 1;
            var intersectsVertex1 = M.distanceSq(0, 0, dx, dy) < r * r;
            var intersectsVertex2 = M.distanceSq(ldx, ldy, dx, dy) < r * r;
            return tInRange || intersectsVertex1 || intersectsVertex2;
        }
        function closestPointOnCircle_angle(px, py, cx, cy) {
            var dx = px - cx;
            var dy = py - cy;
            return M.atan2(dy, dx);
        }
        function closestPointOnLine_t(px, py, lx1, ly1, lx2, ly2) {
            var dx = px - lx1;
            var dy = py - ly1;
            var ldx = lx2 - lx1;
            var ldy = ly2 - ly1;
            var t = (dx * ldx + dy * ldy) / (ldx * ldx + ldy * ldy);
            return t;
        }
        function raycastTimeCircleCircle(dx, dy, ddx, ddy, R) {
            var a = ddx * ddx + ddy * ddy;
            var b = 2 * dx * ddx + 2 * dy * ddy;
            var c = dx * dx + dy * dy - R * R;
            var disc = b * b - 4 * a * c;
            if (disc < 0)
                return Infinity;
            return (-b - Math.sqrt(disc)) / (2 * a);
        }
        function raycastTimeCircleSegment(dx, dy, ddx, ddy, r, linedx, linedy) {
            var L = M.magnitude(linedx, linedy);
            var denom = linedx * ddy - linedy * ddx;
            var t1 = (r * L + linedy * dx - linedx * dy) / denom;
            var t2 = (-r * L + linedy * dx - linedx * dy) / denom;
            var t = Math.min(t1, t2);
            var newx = dx + ddx * t;
            var newy = dy + ddy * t;
            var comp = linedx * newx + linedy * newy;
            if (comp < 0 || L * L < comp)
                return Infinity;
            return t;
        }
        function raycastTimePointSegment(dpx, dpy, ddx, ddy, linedx, linedy) {
            var t = (linedy * dpx - linedx * dpy) / (linedx * ddy - linedy * ddx);
            var s = linedx !== 0 ? (dpx + ddx * t) / linedx : (dpy + ddy * t) / linedy;
            if (s < 0 || 1 < s)
                return Infinity;
            return t;
        }
        function vectorBetweenVectors(vx, vy, x1, y1, x2, y2) {
            var cross1xV = x1 * vy - y1 * vx;
            var cross1x2 = x1 * y2 - y1 * x2;
            var cross2xV = x2 * vy - y2 * vx;
            var cross2x1 = x2 * y1 - y2 * x1;
            return cross1xV * cross1x2 >= 0 && cross2xV * cross2x1 >= 0;
        }
    })(Collision = Bounds.Collision || (Bounds.Collision = {}));
})(Bounds || (Bounds = {}));
var InvertedRectBounds = /** @class */ (function () {
    function InvertedRectBounds(x, y, width, height, parent) {
        this.parent = parent;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.boundingBox = new Rectangle(0, 0, 0, 0);
    }
    InvertedRectBounds.prototype.clone = function () {
        return new InvertedRectBounds(this.x, this.y, this.width, this.height, this.parent);
    };
    InvertedRectBounds.prototype.getBoundingBox = function (x, y) {
        x = x !== null && x !== void 0 ? x : (this.parent ? this.parent.x : 0);
        y = y !== null && y !== void 0 ? y : (this.parent ? this.parent.y : 0);
        this.boundingBox.x = x + this.x;
        this.boundingBox.y = y + this.y;
        this.boundingBox.width = this.width;
        this.boundingBox.height = this.height;
        return this.boundingBox;
    };
    InvertedRectBounds.prototype.getDisplacementCollision = function (other) {
        if (other instanceof RectBounds)
            return Bounds.Collision.invertDisplacementCollision(Bounds.Collision.getDisplacementCollisionRectInvertedRect(other, this));
        if (other instanceof CircleBounds)
            return Bounds.Collision.invertDisplacementCollision(Bounds.Collision.getDisplacementCollisionCircleInvertedRect(other, this));
        if (other instanceof NullBounds)
            return undefined;
        error("No collision supported between these bounds", this, other);
        return undefined;
    };
    InvertedRectBounds.prototype.getRaycastCollision = function (dx, dy, other, otherdx, otherdy) {
        if (other instanceof RectBounds)
            return Bounds.Collision.invertRaycastCollision(Bounds.Collision.getRaycastCollisionRectInvertedRect(other, otherdx, otherdy, this, dx, dy));
        if (other instanceof CircleBounds)
            return Bounds.Collision.invertRaycastCollision(Bounds.Collision.getRaycastCollisionCircleInvertedRect(other, otherdx, otherdy, this, dx, dy));
        if (other instanceof NullBounds)
            return undefined;
        error("No collision supported between these bounds", this, other);
        return undefined;
    };
    InvertedRectBounds.prototype.isOverlapping = function (other) {
        if (other instanceof RectBounds)
            return Bounds.Collision.isOverlappingRectInvertedRect(other, this);
        if (other instanceof CircleBounds)
            return Bounds.Collision.isOverlappingCircleInvertedRect(other, this);
        if (other instanceof NullBounds)
            return undefined;
        error("No overlap supported between these bounds", this, other);
        return false;
    };
    InvertedRectBounds.prototype.raycast = function (x, y, dx, dy) {
        var box = this.getBoundingBox();
        if (dx === 0 && dy === 0) {
            return box.contains(x, y) ? Infinity : 0;
        }
        var left_t = dx < 0 && x >= box.left ? (box.left - x) / dx : Infinity;
        var right_t = dx > 0 && x <= box.right ? (box.right - x) / dx : Infinity;
        var top_t = dy < 0 && y >= box.top ? (box.top - y) / dy : Infinity;
        var bottom_t = dy > 0 && y <= box.bottom ? (box.bottom - y) / dy : Infinity;
        var t = Math.min(left_t, right_t, top_t, bottom_t);
        return t;
    };
    return InvertedRectBounds;
}());
var NullBounds = /** @class */ (function () {
    function NullBounds(parent) {
        this.parent = parent;
        this.position = new Vector2(Infinity, Infinity);
        this.boundingBox = new Rectangle(Infinity, Infinity, 0, 0);
    }
    NullBounds.prototype.clone = function () {
        return new NullBounds();
    };
    NullBounds.prototype.getPosition = function (x, y) {
        return this.position;
    };
    NullBounds.prototype.getBoundingBox = function (x, y) {
        return this.boundingBox;
    };
    NullBounds.prototype.getDisplacementCollision = function (other) {
        return undefined;
    };
    NullBounds.prototype.getRaycastCollision = function (dx, dy, other, otherdx, otherdy) {
        return undefined;
    };
    NullBounds.prototype.isOverlapping = function (other) {
        return false;
    };
    NullBounds.prototype.raycast = function (x, y, dx, dy) {
        return Infinity;
    };
    return NullBounds;
}());
var PhysicsUtils = /** @class */ (function () {
    function PhysicsUtils() {
    }
    PhysicsUtils.applyFriction = function (v, fx, fy, delta) {
        if (v.x > 0)
            v.x = Math.max(v.x - fx * delta, 0);
        if (v.x < 0)
            v.x = Math.min(v.x + fx * delta, 0);
        if (v.y > 0)
            v.y = Math.max(v.y - fy * delta, 0);
        if (v.y < 0)
            v.y = Math.min(v.y + fy * delta, 0);
    };
    PhysicsUtils.smartAccelerate = function (v, ax, ay, delta, maxSpeed) {
        var oldMagnitude = v.magnitude;
        v.x += ax * delta;
        v.y += ay * delta;
        if (v.magnitude > maxSpeed) {
            v.clampMagnitude(oldMagnitude);
        }
    };
    PhysicsUtils.smartAccelerate1d = function (v, a, delta, maxSpeed) {
        var vv = vec2(v, 0);
        this.smartAccelerate(vv, a, 0, delta, maxSpeed);
        return vv.x;
    };
    return PhysicsUtils;
}());
var RectBounds = /** @class */ (function () {
    function RectBounds(x, y, width, height, parent) {
        this.parent = parent;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.boundingBox = new Rectangle(0, 0, 0, 0);
    }
    RectBounds.prototype.clone = function () {
        return new RectBounds(this.x, this.y, this.width, this.height, this.parent);
    };
    RectBounds.prototype.getBoundingBox = function (x, y) {
        x = x !== null && x !== void 0 ? x : (this.parent ? this.parent.x : 0);
        y = y !== null && y !== void 0 ? y : (this.parent ? this.parent.y : 0);
        this.boundingBox.x = x + this.x;
        this.boundingBox.y = y + this.y;
        this.boundingBox.width = this.width;
        this.boundingBox.height = this.height;
        return this.boundingBox;
    };
    RectBounds.prototype.getDisplacementCollision = function (other) {
        if (other instanceof RectBounds)
            return Bounds.Collision.getDisplacementCollisionRectRect(this, other);
        if (other instanceof CircleBounds)
            return Bounds.Collision.invertDisplacementCollision(Bounds.Collision.getDisplacementCollisionCircleRect(other, this));
        if (other instanceof SlopeBounds)
            return Bounds.Collision.getDisplacementCollisionRectSlope(this, other);
        if (other instanceof InvertedRectBounds)
            return Bounds.Collision.getDisplacementCollisionRectInvertedRect(this, other);
        if (other instanceof NullBounds)
            return undefined;
        error("No collision supported between these bounds", this, other);
        return undefined;
    };
    RectBounds.prototype.getRaycastCollision = function (dx, dy, other, otherdx, otherdy) {
        if (other instanceof RectBounds)
            return Bounds.Collision.getRaycastCollisionRectRect(this, dx, dy, other, otherdx, otherdy);
        if (other instanceof CircleBounds)
            return Bounds.Collision.invertRaycastCollision(Bounds.Collision.getRaycastCollisionCircleRect(other, otherdx, otherdy, this, dx, dy));
        if (other instanceof SlopeBounds)
            return Bounds.Collision.getRaycastCollisionRectSlope(this, dx, dy, other, otherdx, otherdy);
        if (other instanceof InvertedRectBounds)
            return Bounds.Collision.getRaycastCollisionRectInvertedRect(this, dx, dy, other, otherdx, otherdy);
        if (other instanceof NullBounds)
            return undefined;
        error("No collision supported between these bounds", this, other);
        return undefined;
    };
    RectBounds.prototype.isOverlapping = function (other) {
        if (other instanceof RectBounds)
            return Bounds.Collision.isOverlappingRectRect(this, other);
        if (other instanceof CircleBounds)
            return Bounds.Collision.isOverlappingCircleRect(other, this);
        if (other instanceof SlopeBounds)
            return Bounds.Collision.isOverlappingRectSlope(this, other);
        if (other instanceof InvertedRectBounds)
            return Bounds.Collision.isOverlappingRectInvertedRect(this, other);
        if (other instanceof NullBounds)
            return undefined;
        error("No overlap supported between these bounds", this, other);
        return false;
    };
    RectBounds.prototype.raycast = function (x, y, dx, dy) {
        var box = this.getBoundingBox();
        var top_t = Infinity;
        var bottom_t = Infinity;
        var left_t = Infinity;
        var right_t = Infinity;
        if (dy !== 0) {
            top_t = (box.top - y) / dy;
            if (x + dx * top_t < box.left || x + dx * top_t > box.right)
                top_t = Infinity;
            bottom_t = (box.bottom - y) / dy;
            if (x + dx * bottom_t < box.left || x + dx * bottom_t > box.right)
                bottom_t = Infinity;
        }
        if (dx !== 0) {
            left_t = (box.left - x) / dx;
            if (y + dy * left_t < box.top || y + dy * left_t > box.bottom)
                left_t = Infinity;
            right_t = (box.right - x) / dx;
            if (y + dy * right_t < box.top || y + dy * right_t > box.bottom)
                right_t = Infinity;
        }
        var horiz_small_t = Math.min(left_t, right_t);
        var horiz_large_t = Math.max(left_t, right_t);
        var horiz_t = horiz_small_t >= 0 ? horiz_small_t : horiz_large_t;
        var vert_small_t = Math.min(top_t, bottom_t);
        var vert_large_t = Math.max(top_t, bottom_t);
        var vert_t = vert_small_t >= 0 ? vert_small_t : vert_large_t;
        var small_t = Math.min(horiz_t, vert_t);
        var large_t = Math.max(horiz_t, vert_t);
        var t = small_t >= 0 ? small_t : large_t;
        if (t < 0)
            return Infinity;
        return t;
    };
    return RectBounds;
}());
var SlopeBounds = /** @class */ (function () {
    function SlopeBounds(x, y, width, height, direction, parent) {
        this.parent = parent;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.direction = direction;
        this.boundingBox = new Rectangle(0, 0, 0, 0);
    }
    SlopeBounds.prototype.clone = function () {
        return new SlopeBounds(this.x, this.y, this.width, this.height, this.direction, this.parent);
    };
    SlopeBounds.prototype.getBoundingBox = function (x, y) {
        x = x !== null && x !== void 0 ? x : (this.parent ? this.parent.x : 0);
        y = y !== null && y !== void 0 ? y : (this.parent ? this.parent.y : 0);
        this.boundingBox.x = x + this.x;
        this.boundingBox.y = y + this.y;
        this.boundingBox.width = this.width;
        this.boundingBox.height = this.height;
        return this.boundingBox;
    };
    SlopeBounds.prototype.getDisplacementCollision = function (other) {
        if (other instanceof RectBounds)
            return Bounds.Collision.invertDisplacementCollision(Bounds.Collision.getDisplacementCollisionRectSlope(other, this));
        if (other instanceof CircleBounds)
            return Bounds.Collision.invertDisplacementCollision(Bounds.Collision.getDisplacementCollisionCircleSlope(other, this));
        if (other instanceof NullBounds)
            return undefined;
        error("No collision supported between these bounds", this, other);
        return undefined;
    };
    SlopeBounds.prototype.getRaycastCollision = function (dx, dy, other, otherdx, otherdy) {
        if (other instanceof RectBounds)
            return Bounds.Collision.invertRaycastCollision(Bounds.Collision.getRaycastCollisionRectSlope(other, otherdx, otherdy, this, dx, dy));
        if (other instanceof CircleBounds)
            return Bounds.Collision.invertRaycastCollision(Bounds.Collision.getRaycastCollisionCircleSlope(other, otherdx, otherdy, this, dx, dy));
        if (other instanceof NullBounds)
            return undefined;
        error("No collision supported between these bounds", this, other);
        return undefined;
    };
    SlopeBounds.prototype.isOverlapping = function (other) {
        if (other instanceof RectBounds)
            return Bounds.Collision.isOverlappingRectSlope(other, this);
        if (other instanceof CircleBounds)
            return Bounds.Collision.isOverlappingCircleSlope(other, this);
        if (other instanceof NullBounds)
            return undefined;
        error("No overlap supported between these bounds", this, other);
        return false;
    };
    SlopeBounds.prototype.raycast = function (x, y, dx, dy) {
        var box = this.getBoundingBox();
        var top_t = Infinity;
        var bottom_t = Infinity;
        var left_t = Infinity;
        var right_t = Infinity;
        var slash_t = Infinity;
        var backslash_t = Infinity;
        if (dy !== 0) {
            top_t = (box.top - y) / dy;
            if (x + dx * top_t < box.left || x + dx * top_t > box.right)
                top_t = Infinity;
            bottom_t = (box.bottom - y) / dy;
            if (x + dx * bottom_t < box.left || x + dx * bottom_t > box.right)
                bottom_t = Infinity;
        }
        if (dx !== 0) {
            left_t = (box.left - x) / dx;
            if (y + dy * left_t < box.top || y + dy * left_t > box.bottom)
                left_t = Infinity;
            right_t = (box.right - x) / dx;
            if (y + dy * right_t < box.top || y + dy * right_t > box.bottom)
                right_t = Infinity;
        }
        if (dx * box.height + dy * box.width !== 0) {
            slash_t = ((box.left - x) * box.height + (box.bottom - y) * box.width) / (dx * box.height + dy * box.width);
            if (x + dx * slash_t < box.left || x + dx * slash_t > box.right)
                slash_t = Infinity;
        }
        if (dx * box.height - dy * box.width !== 0) {
            backslash_t = ((box.left - x) * box.height - (box.top - y) * box.width) / (dx * box.height - dy * box.width);
            if (x + dx * backslash_t < box.left || x + dx * backslash_t > box.right)
                backslash_t = Infinity;
        }
        var t1, t2, t3;
        if (this.direction === 'upleft') {
            t1 = right_t;
            t2 = bottom_t;
            t3 = slash_t;
        }
        else if (this.direction === 'upright') {
            t1 = left_t;
            t2 = bottom_t;
            t3 = backslash_t;
        }
        else if (this.direction === 'downright') {
            t1 = left_t;
            t2 = top_t;
            t3 = slash_t;
        }
        else {
            t1 = right_t;
            t2 = top_t;
            t3 = backslash_t;
        }
        var small_t12 = Math.min(t1, t2);
        var large_t12 = Math.max(t1, t2);
        var t12 = small_t12 >= 0 ? small_t12 : large_t12;
        var small_t = Math.min(t12, t3);
        var large_t = Math.max(t12, t3);
        var t = small_t >= 0 ? small_t : large_t;
        if (t < 0)
            return Infinity;
        return t;
    };
    return SlopeBounds;
}());
/// <reference path="../texture/filter/textureFilter.ts" />
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
        enumerable: false,
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
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Effects.prototype, "addSilhouette", {
        get: function () {
            this.silhouette.enabled = true;
            return this.silhouette;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Effects.prototype, "addOutline", {
        get: function () {
            this.outline.enabled = true;
            return this.outline;
        },
        enumerable: false,
        configurable: true
    });
    Effects.prototype.getFilterList = function () {
        return this.pre.filters.concat(this.effects).concat(this.post.filters);
    };
    Effects.prototype.hasEffects = function () {
        if (this.effects.some(function (effect) { return effect && effect.enabled; }))
            return true;
        if (this.pre.enabled && this.pre.filters.some(function (filter) { return filter && filter.enabled; }))
            return true;
        if (this.post.enabled && this.post.filters.some(function (filter) { return filter && filter.enabled; }))
            return true;
        return false;
    };
    Effects.prototype.updateEffects = function (delta) {
        var e_45, _a, e_46, _b;
        if (this.effects[Effects.SILHOUETTE_I])
            this.effects[Effects.SILHOUETTE_I].updateTime(delta);
        if (this.effects[Effects.OUTLINE_I])
            this.effects[Effects.OUTLINE_I].updateTime(delta);
        try {
            for (var _c = __values(this.pre.filters), _d = _c.next(); !_d.done; _d = _c.next()) {
                var filter_1 = _d.value;
                filter_1.updateTime(delta);
            }
        }
        catch (e_45_1) { e_45 = { error: e_45_1 }; }
        finally {
            try {
                if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
            }
            finally { if (e_45) throw e_45.error; }
        }
        try {
            for (var _e = __values(this.post.filters), _f = _e.next(); !_f.done; _f = _e.next()) {
                var filter_2 = _f.value;
                filter_2.updateTime(delta);
            }
        }
        catch (e_46_1) { e_46 = { error: e_46_1 }; }
        finally {
            try {
                if (_f && !_f.done && (_b = _e.return)) _b.call(_e);
            }
            finally { if (e_46) throw e_46.error; }
        }
    };
    Effects.prototype.updateFromConfig = function (config) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
        if (!config)
            return;
        if (config.pre) {
            this.pre.filters = (_a = config.pre.filters) !== null && _a !== void 0 ? _a : [];
            this.pre.enabled = (_b = config.pre.enabled) !== null && _b !== void 0 ? _b : true;
        }
        if (config.silhouette) {
            this.silhouette.color = (_c = config.silhouette.color) !== null && _c !== void 0 ? _c : 0x000000;
            this.silhouette.alpha = (_d = config.silhouette.alpha) !== null && _d !== void 0 ? _d : 1;
            this.silhouette.amount = (_e = config.silhouette.amount) !== null && _e !== void 0 ? _e : 1;
            this.silhouette.enabled = (_f = config.silhouette.enabled) !== null && _f !== void 0 ? _f : true;
        }
        if (config.outline) {
            this.outline.color = (_g = config.outline.color) !== null && _g !== void 0 ? _g : 0x000000;
            this.outline.alpha = (_h = config.outline.alpha) !== null && _h !== void 0 ? _h : 1;
            this.outline.enabled = (_j = config.outline.enabled) !== null && _j !== void 0 ? _j : true;
        }
        if (config.post) {
            this.post.filters = (_k = config.post.filters) !== null && _k !== void 0 ? _k : [];
            this.post.enabled = (_l = config.post.enabled) !== null && _l !== void 0 ? _l : true;
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
                    uniforms: {
                        "vec3 color": M.colorToVec3(0x000000),
                        "float alpha": 1.0,
                        "float amount": 1.0
                    },
                    code: "\n                        if (inp.a > 0.0) {\n                            outp = inp * (1.0 - amount) + vec4(color, alpha) * amount;\n                        }\n                    "
                }) || this;
                _this.color = color;
                _this.alpha = alpha;
                return _this;
            }
            Object.defineProperty(Silhouette.prototype, "color", {
                get: function () { return M.vec3ToColor(this.getUniform('color')); },
                set: function (value) { this.setUniform('color', M.colorToVec3(value)); },
                enumerable: false,
                configurable: true
            });
            Object.defineProperty(Silhouette.prototype, "alpha", {
                get: function () { return this.getUniform('alpha'); },
                set: function (value) { this.setUniform('alpha', value); },
                enumerable: false,
                configurable: true
            });
            Object.defineProperty(Silhouette.prototype, "amount", {
                get: function () { return this.getUniform('amount'); },
                set: function (value) { this.setUniform('amount', value); },
                enumerable: false,
                configurable: true
            });
            return Silhouette;
        }(TextureFilter));
        Filters.Silhouette = Silhouette;
        var Outline = /** @class */ (function (_super) {
            __extends(Outline, _super);
            function Outline(color, alpha) {
                var _this = _super.call(this, {
                    uniforms: {
                        "vec3 color": M.colorToVec3(0x000000),
                        "float alpha": 1.0
                    },
                    code: "\n                        if (inp.a == 0.0 && (getColor(x-1.0, y).a > 0.0 || getColor(x+1.0, y).a > 0.0 || getColor(x, y-1.0).a > 0.0 || getColor(x, y+1.0).a > 0.0)) {\n                            outp = vec4(color, alpha);\n                        }\n                    "
                }) || this;
                _this.color = color;
                _this.alpha = alpha;
                return _this;
            }
            Object.defineProperty(Outline.prototype, "color", {
                get: function () { return M.vec3ToColor(this.getUniform('color')); },
                set: function (value) { this.setUniform('color', M.colorToVec3(value)); },
                enumerable: false,
                configurable: true
            });
            Object.defineProperty(Outline.prototype, "alpha", {
                get: function () { return this.getUniform('alpha'); },
                set: function (value) { this.setUniform('alpha', value); },
                enumerable: false,
                configurable: true
            });
            return Outline;
        }(TextureFilter));
        Filters.Outline = Outline;
    })(Filters = Effects.Filters || (Effects.Filters = {}));
})(Effects || (Effects = {}));
var Module = /** @class */ (function () {
    function Module(type) {
        this.type = type;
    }
    Module.prototype.init = function (worldObject) {
        if (!(worldObject instanceof this.type)) {
            error("Tried to add Module<" + this.type.name + "> to a world object of incompatible type:", worldObject);
            return;
        }
        this.worldObject = worldObject;
    };
    Module.prototype.update = function () { };
    Module.prototype.render = function (texture, x, y) { };
    return Module;
}());
var Warp = /** @class */ (function (_super) {
    __extends(Warp, _super);
    function Warp(stage, entryPoint, transition) {
        if (transition === void 0) { transition = Transition.INSTANT; }
        var _this = _super.call(this) || this;
        _this.stage = stage;
        _this.entryPoint = entryPoint;
        _this.transition = transition;
        return _this;
    }
    Warp.prototype.warp = function () {
        global.theater.loadStage(this.stage, this.transition, this.entryPoint);
    };
    return Warp;
}(PhysicsWorldObject));
var ActionBehavior = /** @class */ (function () {
    function ActionBehavior(startAction, startWait) {
        this.controller = new Controller();
        this.stateMachine = new StateMachine();
        this.actions = {};
        this.addAction(ActionBehavior.START_ACTION, {
            wait: startWait,
            nextAction: startAction,
        });
    }
    Object.defineProperty(ActionBehavior.prototype, "currentAction", {
        get: function () { return this.actions[this.currentActionName]; },
        enumerable: false,
        configurable: true
    });
    ActionBehavior.prototype.update = function (delta) {
        this.stateMachine.update(delta);
        if (!this.currentAction) {
            this.stateMachine.setState(ActionBehavior.START_ACTION);
        }
    };
    ActionBehavior.prototype.addAction = function (name, action) {
        var b = this;
        if (action.wait) {
            var waitActionName = "wait_after_" + name;
            this.addAction(name, {
                script: action.script,
                interrupt: action.interrupt,
                nextAction: waitActionName,
            });
            this.addAction(waitActionName, {
                script: function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, S.wait(action.wait)];
                            case 1:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                },
                nextAction: action.nextAction,
            });
            return;
        }
        this.stateMachine.addState(name, {
            script: function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!action.script) return [3 /*break*/, 2];
                            return [4 /*yield*/, action.script];
                        case 1:
                            _a.sent();
                            _a.label = 2;
                        case 2: return [4 /*yield*/];
                        case 3:
                            _a.sent(); // Yield once before doing the next action to let final controller inputs go through.
                            b.doAction(b.getNextAction(action.nextAction));
                            return [2 /*return*/];
                    }
                });
            }
        });
        this.actions[name] = action;
    };
    ActionBehavior.prototype.interrupt = function (action) {
        if (!this.currentAction)
            return;
        if (action && action !== this.currentActionName)
            return;
        if (!this.canInterrupt(this.currentAction.interrupt))
            return;
        var interruptAction = this.getInterruptAction(this.currentAction);
        this.doAction(interruptAction);
    };
    ActionBehavior.prototype.doAction = function (name) {
        this.controller.reset();
        this.currentActionName = name;
        this.stateMachine.setState(name);
    };
    ActionBehavior.prototype.canInterrupt = function (interrupt) {
        return !!interrupt;
    };
    ActionBehavior.prototype.getNextAction = function (nextAction) {
        if (_.isString(nextAction))
            return nextAction;
        return nextAction.call(this);
    };
    ActionBehavior.prototype.getInterruptAction = function (action) {
        if (_.isString(action.interrupt))
            return action.interrupt;
        return this.getNextAction(action.nextAction);
    };
    ActionBehavior.START_ACTION = 'start';
    return ActionBehavior;
}());
var Controller = /** @class */ (function () {
    function Controller() {
        this.moveDirection = vec2(0, 0);
        this.aimDirection = vec2(0, 0);
        this.keys = {};
    }
    Object.defineProperty(Controller.prototype, "left", {
        get: function () { return this.keys.left; },
        set: function (value) { this.keys.left = value; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Controller.prototype, "right", {
        get: function () { return this.keys.right; },
        set: function (value) { this.keys.right = value; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Controller.prototype, "up", {
        get: function () { return this.keys.up; },
        set: function (value) { this.keys.up = value; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Controller.prototype, "down", {
        get: function () { return this.keys.down; },
        set: function (value) { this.keys.down = value; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Controller.prototype, "jump", {
        get: function () { return this.keys.jump; },
        set: function (value) { this.keys.jump = value; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Controller.prototype, "attack", {
        get: function () { return this.keys.attack; },
        set: function (value) { this.keys.attack = value; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Controller.prototype, "interact", {
        get: function () { return this.keys.interact; },
        set: function (value) { this.keys.interact = value; },
        enumerable: false,
        configurable: true
    });
    Controller.prototype.updateFromBehavior = function (behavior) {
        if (behavior instanceof NullBehavior)
            return;
        this.moveDirection.x = behavior.controller.moveDirection.x;
        this.moveDirection.y = behavior.controller.moveDirection.y;
        this.aimDirection.x = behavior.controller.aimDirection.x;
        this.aimDirection.y = behavior.controller.aimDirection.y;
        for (var key in behavior.controller.keys) {
            this.keys[key] = behavior.controller.keys[key];
        }
    };
    Controller.prototype.reset = function () {
        this.moveDirection.x = 0;
        this.moveDirection.y = 0;
        this.aimDirection.x = 0;
        this.aimDirection.y = 0;
        for (var key in this.keys) {
            this.keys[key] = false;
        }
    };
    return Controller;
}());
/// <reference path="../controller/controller.ts" />
var ControllerBehavior = /** @class */ (function () {
    function ControllerBehavior(update) {
        this.controller = new Controller();
        this.updateCallback = update;
    }
    ControllerBehavior.prototype.update = function (delta) {
        this.controller.reset();
        this.updateCallback();
    };
    ControllerBehavior.prototype.interrupt = function () { };
    return ControllerBehavior;
}());
var NullBehavior = /** @class */ (function () {
    function NullBehavior() {
        this.controller = new Controller();
    }
    NullBehavior.prototype.update = function (delta) { };
    NullBehavior.prototype.interrupt = function () { };
    return NullBehavior;
}());
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
            error("Cannot add animation '" + name + "' to sprite", this.sprite, "since it already exists");
            return;
        }
        this.animations[name] = _.defaults(frames, {
            duration: 0,
            forceRequired: false,
        });
    };
    Object.defineProperty(AnimationManager.prototype, "forceRequired", {
        get: function () {
            return this.currentFrame && this.currentFrame.forceRequired;
        },
        enumerable: false,
        configurable: true
    });
    AnimationManager.prototype.getCurrentAnimationName = function () {
        for (var name_6 in this.animations) {
            if (_.contains(this.animations[name_6], this.currentFrame)) {
                return name_6;
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
            error("Cannot get frame '" + ref + "' on sprite", this.sprite, "as it does not fit the form '[animation]/[frame]'");
            return null;
        }
        var animation = this.animations[parts[0]];
        if (!animation) {
            error("Cannot get frame '" + ref + "' on sprite", this.sprite, "as animation '" + parts[0] + "' does not exist");
            return null;
        }
        var frame = parseInt(parts[1]);
        if (!isFinite(frame) || frame < 0 || frame >= animation.length) {
            error("Cannot get frame '" + ref + "' on sprite", this.sprite, "as animation '" + parts[0] + " does not have frame '" + parts[1] + "'");
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
        enumerable: false,
        configurable: true
    });
    AnimationManager.prototype.playAnimation = function (name, force) {
        if (force === void 0) { force = false; }
        if (!force && (this.forceRequired || this.getCurrentAnimationName() == name)) {
            return;
        }
        if (this.hasAnimation(name) && this.isAnimationEmpty(name)) {
            this.setCurrentFrame(null, true, force);
            return;
        }
        this.setCurrentFrame(name + "/0", true, force);
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
        // Call the callback
        if (this.currentFrame.callback) {
            this.currentFrame.callback();
        }
    };
    AnimationManager.prototype.stop = function () {
        this.setCurrentFrame(null, true, true);
    };
    return AnimationManager;
}());
/// <reference path="../../utils/a_array.ts" />
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
        if (config.count < 0 || !isFinite(config.count)) {
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
        var texturePrefix = !config.texturePrefix ? "" : config.texturePrefix + "_";
        for (var i = 0; i < textures.length; i++) {
            var animationFrame = {
                duration: frameDuration,
                texture: (_.isString(textures[i]) || _.isNumber(textures[i])) ? "" + texturePrefix + textures[i] : textures[i],
                nextFrameRef: config.name + "/" + (i + 1),
                forceRequired: config.oneOff,
            };
            result.frames.push(animationFrame);
        }
        result.frames[result.frames.length - 1].nextFrameRef = config.nextFrameRef;
        if (config.overrides) {
            for (var key in config.overrides) {
                var frame = key;
                result.frames[frame] = this.overrideFrame(result.frames[frame], config.overrides[key]);
            }
        }
        return result;
    };
    Animations.overrideFrame = function (frame, override) {
        return O.withOverrides(frame, override);
    };
    return Animations;
}());
var SpriteTextConverter = /** @class */ (function () {
    function SpriteTextConverter() {
    }
    SpriteTextConverter.textToCharListWithWordWrap = function (text, font, maxWidth) {
        if (!text)
            return [];
        var result = [];
        var word = [];
        var nextCharPosition = new Vector2(0, 0);
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
                    error("Text '" + text + "' has an unclosed tag bracket.");
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
        var tagFunction = SpriteText.TAGS[tag] || SpriteText.TAGS[SpriteText.NOOP_TAG];
        return tagFunction(params);
    };
    SpriteTextConverter.parseTag = function (tag) {
        var result = St.splitOnWhitespace(tag);
        if (_.isEmpty(result)) {
            error("Tag " + tag + " must have the tag part specified.");
            return [SpriteText.NOOP_TAG];
        }
        return result;
    };
    SpriteTextConverter.pushWord = function (word, result, position, maxWidth) {
        var e_47, _a;
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
            catch (e_47_1) { e_47 = { error: e_47_1 }; }
            finally {
                try {
                    if (word_1_1 && !word_1_1.done && (_a = word_1.return)) _a.call(word_1);
                }
                finally { if (e_47) throw e_47.error; }
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
var Tilemap = /** @class */ (function (_super) {
    __extends(Tilemap, _super);
    function Tilemap(config) {
        var _a, _b, _c;
        var _this = _super.call(this, config) || this;
        _this.tilemap = Tilemap.cloneTilemap(_.isString(config.tilemap) ? AssetCache.getTilemap(config.tilemap) : config.tilemap);
        _this.scrubTilemapEntities(config.entities);
        _this.tilemapLayer = (_a = config.tilemapLayer) !== null && _a !== void 0 ? _a : 0;
        _this.tileset = AssetCache.getTileset(config.tileset);
        _this.zMap = (_b = config.zMap) !== null && _b !== void 0 ? _b : {};
        _this.animation = config.animation;
        _this.collisionOnly = (_c = config.collisionOnly) !== null && _c !== void 0 ? _c : false;
        _this.createTilemap();
        _this.dirty = false;
        _this.debugDrawBounds = false;
        return _this;
    }
    Object.defineProperty(Tilemap.prototype, "currentTilemapLayer", {
        get: function () { return this.tilemap.layers[this.tilemapLayer]; },
        enumerable: false,
        configurable: true
    });
    Tilemap.prototype.update = function () {
        if (this.dirty) {
            this.createTilemap();
            this.dirty = false;
        }
    };
    Tilemap.prototype.getTile = function (x, y) {
        return this.currentTilemapLayer[y][x];
    };
    Tilemap.prototype.setTile = function (x, y, tile) {
        this.currentTilemapLayer[y][x] = O.deepClone(tile);
        this.dirty = true;
    };
    Object.defineProperty(Tilemap.prototype, "width", {
        get: function () {
            return this.widthInTiles * this.tileset.tileWidth;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Tilemap.prototype, "height", {
        get: function () {
            return this.heightInTiles * this.tileset.tileHeight;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Tilemap.prototype, "widthInTiles", {
        get: function () {
            return this.tilemap.layers[this.tilemapLayer][0].length;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Tilemap.prototype, "heightInTiles", {
        get: function () {
            return this.tilemap.layers[this.tilemapLayer].length;
        },
        enumerable: false,
        configurable: true
    });
    Tilemap.prototype.createCollisionBoxes = function () {
        var e_48, _a;
        World.Actions.removeWorldObjectsFromWorld(this.collisionBoxes);
        this.collisionBoxes = [];
        var collisionRects = Tilemap.getCollisionRects(this.currentTilemapLayer, this.tileset);
        Tilemap.optimizeCollisionRects(collisionRects); // Not optimizing entire array first to save some cycles.
        Tilemap.optimizeCollisionRects(collisionRects, Tilemap.OPTIMIZE_ALL);
        try {
            for (var collisionRects_1 = __values(collisionRects), collisionRects_1_1 = collisionRects_1.next(); !collisionRects_1_1.done; collisionRects_1_1 = collisionRects_1.next()) {
                var rect_3 = collisionRects_1_1.value;
                var box = this.addChild(new PhysicsWorldObject());
                box.x = this.x;
                box.y = this.y;
                box.bounds = new RectBounds(rect_3.x, rect_3.y, rect_3.width, rect_3.height);
                box.matchParentPhysicsGroup = true;
                box.setImmovable(true);
                box.debugDrawBounds = this.debugDrawBounds;
                this.collisionBoxes.push(box);
            }
        }
        catch (e_48_1) { e_48 = { error: e_48_1 }; }
        finally {
            try {
                if (collisionRects_1_1 && !collisionRects_1_1.done && (_a = collisionRects_1.return)) _a.call(collisionRects_1);
            }
            finally { if (e_48) throw e_48.error; }
        }
    };
    Tilemap.prototype.createTilemap = function () {
        if (!this.collisionOnly) {
            this.drawRenderTexture();
        }
        this.createCollisionBoxes();
    };
    Tilemap.prototype.drawRenderTexture = function () {
        this.clearZTextures();
        var zTileIndices = Tilemap.createZTileIndicies(this.currentTilemapLayer, this.zMap);
        var zTextures = this.createZTextures(zTileIndices);
        for (var y = 0; y < this.currentTilemapLayer.length; y++) {
            for (var x = 0; x < this.currentTilemapLayer[y].length; x++) {
                var zValue = Tilemap.getZValue(zTileIndices, y, x);
                if (!zTextures[zValue])
                    continue;
                this.drawTile(this.currentTilemapLayer[y][x], x - zTextures[zValue].tileBounds.left, y - zTextures[zValue].tileBounds.top, zTextures[zValue].frames);
            }
        }
    };
    Tilemap.prototype.drawTile = function (tile, tileX, tileY, renderTextures) {
        if (!tile || tile.index < 0)
            return;
        for (var i = 0; i < renderTextures.length; i++) {
            var textureKeyIndex = this.animation ? i * this.animation.tilesPerFrame + tile.index : tile.index;
            var textureKey = this.tileset.tiles[textureKeyIndex];
            var texture = AssetCache.getTexture(textureKey);
            texture.renderTo(renderTextures[i], {
                x: (tileX + 0.5) * this.tileset.tileWidth,
                y: (tileY + 0.5) * this.tileset.tileHeight,
                angle: tile.angle,
                scaleX: tile.flipX ? -1 : 1,
            });
        }
    };
    Tilemap.prototype.createZTextures = function (zTileIndices) {
        var texturesByZ = Tilemap.createEmptyZTextures(zTileIndices, this.tileset, this.animation);
        for (var zValue in texturesByZ) {
            var zHeight = texturesByZ[zValue].zHeight * this.tileset.tileHeight;
            var zTexture = this.addChild(new Sprite());
            zTexture.x = this.x + texturesByZ[zValue].bounds.x;
            zTexture.y = this.y + texturesByZ[zValue].bounds.y + zHeight;
            zTexture.matchParentLayer = true;
            zTexture.offsetY = -zHeight;
            zTexture.setTexture(this.animation ? undefined : texturesByZ[zValue].frames[0]);
            if (this.animation) {
                zTexture.addAnimation(Animations.fromTextureList({ name: 'play', textures: texturesByZ[zValue].frames, frameRate: this.animation.frameRate, count: -1 }));
                zTexture.playAnimation('play');
            }
            this.zTextures.push(zTexture);
        }
        return texturesByZ;
    };
    Tilemap.prototype.clearZTextures = function () {
        World.Actions.removeWorldObjectsFromWorld(this.zTextures);
        this.zTextures = [];
    };
    Tilemap.prototype.scrubTilemapEntities = function (entities) {
        if (_.isEmpty(entities))
            return;
        for (var layer = 0; layer < this.tilemap.layers.length; layer++) {
            for (var y = 0; y < this.tilemap.layers[layer].length; y++) {
                for (var x = 0; x < this.tilemap.layers[layer][y].length; x++) {
                    if (this.tilemap.layers[layer][y][x].index in entities) {
                        this.tilemap.layers[layer][y][x].index = -1;
                    }
                }
            }
        }
    };
    return Tilemap;
}(WorldObject));
(function (Tilemap) {
    function cloneTilemap(tilemap) {
        var result = {
            layers: [],
        };
        for (var i = 0; i < tilemap.layers.length; i++) {
            result.layers.push(O.deepClone(tilemap.layers[i]));
        }
        return result;
    }
    Tilemap.cloneTilemap = cloneTilemap;
    function createZTileIndicies(layer, zMap) {
        var zTileIndices = getInitialZTileIndicies(layer, zMap);
        fillZTileIndicies(zTileIndices);
        return zTileIndices;
    }
    Tilemap.createZTileIndicies = createZTileIndicies;
    function createEmptyZTextures(zTileIndices, tileset, animation) {
        var zTextureSlots = {};
        for (var y = 0; y < zTileIndices.length; y++) {
            for (var x = 0; x < zTileIndices[y].length; x++) {
                if (isFinite(zTileIndices[y][x])) {
                    var zValue = getZValue(zTileIndices, y, x);
                    if (!zTextureSlots[zValue])
                        zTextureSlots[zValue] = {
                            frames: null,
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
        var _loop_3 = function (zValue) {
            zTextureSlots[zValue].bounds.x = zTextureSlots[zValue].tileBounds.left * tileset.tileWidth;
            zTextureSlots[zValue].bounds.y = zTextureSlots[zValue].tileBounds.top * tileset.tileHeight;
            zTextureSlots[zValue].bounds.width = (zTextureSlots[zValue].tileBounds.right - zTextureSlots[zValue].tileBounds.left + 1) * tileset.tileWidth;
            zTextureSlots[zValue].bounds.height = (zTextureSlots[zValue].tileBounds.bottom - zTextureSlots[zValue].tileBounds.top + 1) * tileset.tileHeight;
            var numFrames = animation ? animation.frames : 1;
            zTextureSlots[zValue].frames = A.range(numFrames).map(function (i) { return new BasicTexture(zTextureSlots[zValue].bounds.width, zTextureSlots[zValue].bounds.height); });
        };
        for (var zValue in zTextureSlots) {
            _loop_3(zValue);
        }
        return zTextureSlots;
    }
    Tilemap.createEmptyZTextures = createEmptyZTextures;
    function getCollisionRects(tilemapLayer, tileset) {
        if (_.isEmpty(tileset.collisionIndices))
            return [];
        var result = [];
        for (var y = 0; y < tilemapLayer.length; y++) {
            for (var x = 0; x < tilemapLayer[y].length; x++) {
                var tile = tilemapLayer[y][x];
                if (_.contains(tileset.collisionIndices, tile.index)) {
                    var rect_4 = {
                        x: x * tileset.tileWidth,
                        y: y * tileset.tileHeight,
                        width: tileset.tileWidth,
                        height: tileset.tileHeight
                    };
                    result.push(rect_4);
                }
            }
        }
        return result;
    }
    Tilemap.getCollisionRects = getCollisionRects;
    function getZValue(zTileIndices, y, x) {
        return y + zTileIndices[y][x];
    }
    Tilemap.getZValue = getZValue;
    function lookupZMapValue(tile, zMap) {
        return zMap[tile.index];
    }
    Tilemap.lookupZMapValue = lookupZMapValue;
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
    function getInitialZTileIndicies(layer, zMap) {
        var zTileIndices = A.filledArray2D(layer.length, layer[0].length, undefined);
        if (_.isEmpty(zMap)) {
            for (var x = 0; x < layer[0].length; x++) {
                zTileIndices[0][x] = 0;
            }
            return zTileIndices;
        }
        for (var y = 0; y < layer.length; y++) {
            for (var x = 0; x < layer[y].length; x++) {
                var tile = layer[y][x];
                zTileIndices[y][x] = tile.index === -1 ? -Infinity : lookupZMapValue(tile, zMap);
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
})(Tilemap || (Tilemap = {}));
/// <reference path="./tilemap.ts" />
var SmartTilemap;
(function (SmartTilemap) {
    function sortedRules(rules) {
        return A.sort(rules, function (rule) { return getPatternSpecificity(rule.pattern); }, true);
    }
    SmartTilemap.sortedRules = sortedRules;
    function getSmartTilemap(tilemap, config) {
        if (_.isString(tilemap)) {
            tilemap = AssetCache.getTilemap(tilemap);
            if (!tilemap)
                return;
        }
        return {
            layers: tilemap.layers.map(function (layer) { return getSmartTilemapLayer(layer, config); }),
        };
    }
    SmartTilemap.getSmartTilemap = getSmartTilemap;
    function getSmartTilemapLayer(tilemapLayer, config) {
        var result = [];
        for (var y = 0; y < tilemapLayer.length; y++) {
            var line = [];
            for (var x = 0; x < tilemapLayer[y].length; x++) {
                line.push(getSmartTile(tilemapLayer, x, y, config));
            }
            result.push(line);
        }
        return result;
    }
    SmartTilemap.getSmartTilemapLayer = getSmartTilemapLayer;
    function getSmartTile(tilemap, x, y, config) {
        var e_49, _a;
        try {
            for (var _b = __values(config.rules), _c = _b.next(); !_c.done; _c = _b.next()) {
                var rule = _c.value;
                if (matchTilePattern(tilemap, x, y, config, rule.pattern)) {
                    return _.isNumber(rule.tile) ? { index: rule.tile, angle: 0, flipX: false } : rule.tile;
                }
            }
        }
        catch (e_49_1) { e_49 = { error: e_49_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_49) throw e_49.error; }
        }
        return tilemap[y][x];
    }
    function matchTilePattern(tilemap, x, y, config, pattern) {
        return matchTilePatternTile(pattern.tile, getTileIndex(tilemap, x, y, config))
            && matchTilePatternTile(pattern.above, getTileIndex(tilemap, x, y - 1, config))
            && matchTilePatternTile(pattern.below, getTileIndex(tilemap, x, y + 1, config))
            && matchTilePatternTile(pattern.left, getTileIndex(tilemap, x - 1, y, config))
            && matchTilePatternTile(pattern.right, getTileIndex(tilemap, x + 1, y, config))
            && matchTilePatternTile(pattern.aboveLeft, getTileIndex(tilemap, x - 1, y - 1, config))
            && matchTilePatternTile(pattern.aboveRight, getTileIndex(tilemap, x + 1, y - 1, config))
            && matchTilePatternTile(pattern.belowLeft, getTileIndex(tilemap, x - 1, y + 1, config))
            && matchTilePatternTile(pattern.belowRight, getTileIndex(tilemap, x + 1, y + 1, config));
    }
    function matchTilePatternTile(patternTile, tileIndex) {
        if (patternTile === undefined)
            return true;
        if (_.isNumber(patternTile))
            return patternTile === tileIndex;
        if (patternTile.type === 'is')
            return patternTile.index === tileIndex;
        if (patternTile.type === 'not')
            return patternTile.index !== tileIndex;
        return false;
    }
    function getPatternSpecificity(pattern) {
        return getPatternTileSpecificity(pattern.tile)
            + getPatternTileSpecificity(pattern.above)
            + getPatternTileSpecificity(pattern.below)
            + getPatternTileSpecificity(pattern.left)
            + getPatternTileSpecificity(pattern.right)
            + getPatternTileSpecificity(pattern.aboveLeft)
            + getPatternTileSpecificity(pattern.aboveRight)
            + getPatternTileSpecificity(pattern.belowLeft)
            + getPatternTileSpecificity(pattern.belowRight);
    }
    function getPatternTileSpecificity(patternTile) {
        if (patternTile === undefined)
            return 0;
        return 1;
    }
    function getTileIndex(tilemap, x, y, config) {
        if (0 <= y && y < tilemap.length && 0 <= x && x < tilemap[y].length) {
            if (tilemap[y][x].index >= 0) {
                return tilemap[y][x].index;
            }
            if (!config.emptyRule || config.emptyRule.type === 'noop') {
                return tilemap[y][x].index;
            }
            if (config.emptyRule.type === 'constant') {
                return config.emptyRule.index;
            }
        }
        if (config.outsideRule.type === 'constant') {
            return config.outsideRule.index;
        }
        if (config.outsideRule.type === 'extend') {
            var nearesty = M.clamp(y, 0, tilemap.length - 1);
            var nearestx = M.clamp(x, 0, tilemap[nearesty].length - 1);
            return tilemap[nearesty][nearestx].index;
        }
    }
})(SmartTilemap || (SmartTilemap = {}));
var TilemapEntities = /** @class */ (function () {
    function TilemapEntities() {
    }
    TilemapEntities.getEntities = function (config) {
        var _a, _b;
        var tilemap = _.isString(config.tilemap) ? AssetCache.getTilemap(config.tilemap) : config.tilemap;
        var tilemapLayer = config.tilemapLayer;
        var tileset = AssetCache.getTileset(config.tileset);
        var entities = config.entities;
        var offsetX = (_a = config.offsetX) !== null && _a !== void 0 ? _a : 0;
        var offsetY = (_b = config.offsetY) !== null && _b !== void 0 ? _b : 0;
        var layer = tilemap.layers[tilemapLayer];
        var result = [];
        for (var y = 0; y < layer.length; y++) {
            for (var x = 0; x < layer[y].length; x++) {
                var tile = layer[y][x];
                if (!entities[tile.index])
                    continue;
                var entity = entities[tile.index](offsetX + x * tileset.tileWidth, offsetY + y * tileset.tileHeight, tile);
                result.push(entity);
            }
        }
        return result;
    };
    return TilemapEntities;
}());
var Assets;
(function (Assets) {
    Assets.textures = {
        'blank': {},
        // Debug
        'debug': {},
        // Fonts
        'deluxe16': { spritesheet: { frameWidth: 8, frameHeight: 15 } },
        'andrfw': { spritesheet: { frameWidth: 8, frameHeight: 19 } },
        // Menus
        'titlescreen': {},
        // Game
        'mirigram': {
            anchor: Vector2.BOTTOM,
            spritesheet: { frameWidth: 40, frameHeight: 40 },
            frames: {
                'spin': { rect: rect(80, 80, 40, 40), anchor: Vector2.CENTER },
            }
        },
        'diggur': {
            anchor: Vector2.CENTER,
            spritesheet: { frameWidth: 40, frameHeight: 40 },
        },
        'scammir': {
            anchor: Vector2.CENTER,
            spritesheet: { frameWidth: 40, frameHeight: 40 },
        },
        'gobbor': {
            anchor: Vector2.CENTER,
            spritesheet: { frameWidth: 40, frameHeight: 40 },
        },
        'world_bg': {},
        'doors': {
            anchor: Vector2.CENTER,
            frames: {
                'reddoor': { rect: rect(0, 0, 16, 32) },
                'blackdoor': { rect: rect(16, 0, 16, 32) },
                'wooddoor': { rect: rect(32, 0, 16, 32) },
                'wooddoor_side': { rect: rect(0, 32, 48, 16) },
                'movabledoor': { rect: rect(48, 0, 16, 32) },
            }
        },
        'lever': { anchor: Vector2.BOTTOM },
        'glass': {},
        'crackedwall': {},
        'smoke': {
            anchor: Vector2.CENTER,
            frames: {
                'smoke1': { rect: rect(0, 0, 112, 71) },
                'smoke2': { rect: rect(112, 0, 95, 77) },
                'smoke3': { rect: rect(0, 71, 76, 36) },
            }
        },
        'orb': { anchor: Vector2.CENTER },
        'lgdoor_open': {},
        'chest': {
            anchor: Vector2.BOTTOM,
            frames: {
                'chest_closed': { rect: rect(0, 0, 56, 72) },
                'chest_open': { rect: rect(56, 0, 56, 72) },
            }
        },
        'prank': { anchor: Vector2.BOTTOM },
        'note': { anchor: Vector2.CENTER },
        // Cutscene
        'THE': { anchor: Vector2.CENTER },
        'UNDERMINE': { anchor: Vector2.CENTER },
        // UI
        'dialogbox': { anchor: Vector2.CENTER },
        'dialogbox_name': { anchor: Vector2.CENTER },
        'itemboxes': {},
        'itemicons': {
            anchor: Vector2.CENTER,
            frames: {
                'cane': { rect: rect(0, 0, 16, 16) },
                'wad': { rect: rect(16, 0, 16, 16) },
                'redkey': { rect: rect(32, 0, 16, 16) },
                'blackkey': { rect: rect(48, 0, 16, 16) },
                'blackkey_upsidedown': { rect: rect(0, 16, 16, 16) },
                'string': { rect: rect(16, 16, 16, 16) },
                'nickel': { rect: rect(32, 16, 16, 16) },
            }
        },
        'pressx': { anchor: Vector2.CENTER },
        'pressright': { anchor: Vector2.CENTER },
    };
    Assets.sounds = {
        // Debug
        'debug': {},
        // Menu
        'click': {},
        // Game
        'dialogstart': { url: 'assets/click.wav', volume: 0.5 },
        'dialogspeak': { url: 'assets/non_npc_text_blip_sound.ogg', volume: 2, speed: 1.5 },
        'dialogspeak_diggur': { url: 'assets/npc_talk_sound.ogg', volume: 2 },
        'dialogspeak_scammir': { url: 'assets/npc_talk_sound.ogg', volume: 2, speed: 1.25 },
        'jump': { url: 'assets/newjump_sound.ogg', volume: 0.7 },
        'walk': { url: 'assets/smaller_tap_sound.ogg', volume: 0.3 },
        'land': { url: 'assets/medium_crush_sound.ogg', volume: 0.4 },
        'door': { url: 'assets/door_shuffle.ogg', volume: 1 },
        'crush': { url: 'assets/crush_sound.ogg', volume: 1 },
        'theundermine': { url: 'assets/fwhaaaaah.ogg', volume: 1 },
        'item_get': { url: 'assets/item_get.ogg', volume: 0.5 },
        'menu_blip': { url: 'assets/menu_blip_sound.ogg', volume: 0.5 },
        'trip': { url: 'assets/newjump_sound.ogg', volume: 1 },
        'hjonk': { url: 'assets/hjonk.ogg', volume: 0.75 },
        // Music
        'house': { url: 'assets/Barry_s_Bungalow.ogg', volume: 0.3 },
        'caverns': { url: 'assets/main_cavern_bgm.ogg', volume: 0.75 },
        'credits': { url: 'assets/factsetc.ogg', volume: 0.75 },
    };
    Assets.tilesets = {
        'tiles': {
            tileWidth: 16,
            tileHeight: 16,
            collisionIndices: [1],
        },
    };
    Assets.pyxelTilemaps = {
        'world': { tileset: 'tiles' },
    };
    var fonts = /** @class */ (function () {
        function fonts() {
        }
        fonts.DELUXE16 = {
            texturePrefix: 'deluxe16',
            charWidth: 8,
            charHeight: 15,
            spaceWidth: 8,
            newlineHeight: 15,
        };
        fonts.ANDRFW = {
            texturePrefix: 'andrfw',
            charWidth: 8,
            charHeight: 19,
            spaceWidth: 8,
            newlineHeight: 16,
        };
        return fonts;
    }());
    Assets.fonts = fonts;
    Assets.spriteTextTags = {
        'g': function (args) { return ({ color: 0x00FF00 }); },
    };
})(Assets || (Assets = {}));
var CameraController = /** @class */ (function (_super) {
    __extends(CameraController, _super);
    function CameraController(target) {
        var _this = _super.call(this) || this;
        _this.target = target;
        return _this;
    }
    CameraController.prototype.onAdd = function () {
        this.sectorOffset = new Vector2(1, 0);
        this.sector = this.getTargetSector();
    };
    CameraController.prototype.postUpdate = function () {
        _super.prototype.postUpdate.call(this);
        var newSector = this.getTargetSector();
        var needToReposition = TransitionScripts.executeTransition(this.world, this.sector, newSector);
        if (needToReposition)
            newSector = this.getTargetSector();
        this.sector = newSector;
        this.world.camera.setModeFocus((this.sector.x + this.sectorOffset.x + 0.5) * this.world.width, (this.sector.y + this.sectorOffset.y + 0.5) * this.world.height);
    };
    CameraController.prototype.getTargetSector = function () {
        return new Vector2(Math.floor(this.target.x / this.world.width) - this.sectorOffset.x, Math.floor(this.target.y / this.world.height) - this.sectorOffset.y);
    };
    return CameraController;
}(WorldObject));
var Cheat = {};
var Chest = /** @class */ (function (_super) {
    __extends(Chest, _super);
    function Chest(x, y) {
        var _this = _super.call(this, {
            name: 'chest',
            x: x, y: y,
            animations: [
                Animations.fromTextureList({ name: 'closed', textures: ['chest_closed'], frameRate: 1, count: Infinity }),
                Animations.fromTextureList({ name: 'open', textures: ['chest_open'], frameRate: 1, count: Infinity }),
            ],
            defaultAnimation: 'closed',
            layer: 'bg',
        }) || this;
        _this.addChild(new CutsceneInteractable(0, -32, 'i_chest')).setBoundsSize(64, 64);
        return _this;
    }
    Chest.prototype.open = function () {
        this.playAnimation('open');
        this.world.playSound('crush');
    };
    Chest.prototype.close = function () {
        this.playAnimation('closed');
        this.world.playSound('crush');
    };
    return Chest;
}(Sprite));
var CrackedWall = /** @class */ (function (_super) {
    __extends(CrackedWall, _super);
    function CrackedWall(x, y) {
        var _this = _super.call(this, {
            x: x, y: y,
            texture: 'crackedwall',
            layer: 'doors',
            physicsGroup: 'walls',
            bounds: new RectBounds(0, 0, 32, 64),
            immovable: true
        }) || this;
        _this.addChild(new CutsceneInteractable(0, 48, 'i_crackedwall'));
        return _this;
    }
    return CrackedWall;
}(Sprite));
var Interactable = /** @class */ (function (_super) {
    __extends(Interactable, _super);
    function Interactable(config) {
        var _this = _super.call(this, config) || this;
        _this.pressTexture = 'pressx';
        return _this;
    }
    Interactable.prototype.interact = function () {
        if (this.onInteract)
            this.onInteract();
    };
    return Interactable;
}(PhysicsWorldObject));
/// <reference path="./interactable.ts" />
var CutsceneInteractable = /** @class */ (function (_super) {
    __extends(CutsceneInteractable, _super);
    function CutsceneInteractable(x, y, cutscene) {
        var _this = _super.call(this, {
            name: "ci_" + cutscene,
            x: x, y: y,
            bounds: new RectBounds(-8, -8, 16, 16),
        }) || this;
        _this.cutscene = cutscene;
        return _this;
    }
    CutsceneInteractable.prototype.interact = function () {
        if (this.pressTexture === 'pressx') {
            global.theater.storyManager.cutsceneManager.playCutscene(this.cutscene);
        }
    };
    CutsceneInteractable.prototype.setBoundsSize = function (w, h) {
        this.bounds = new RectBounds(-w / 2, -h / 2, w, h);
    };
    return CutsceneInteractable;
}(Interactable));
var Diggur = /** @class */ (function (_super) {
    __extends(Diggur, _super);
    function Diggur(x, y) {
        var _this = _super.call(this, {
            name: 'diggur',
            x: x, y: y,
            animations: [
                Animations.fromTextureList({ name: 'idle', texturePrefix: 'diggur', textures: [0, 1], frameRate: 2.2, count: Infinity }),
                Animations.fromTextureList({ name: 'run', texturePrefix: 'diggur', textures: [4, 5, 6], frameRate: 4, count: Infinity, overrides: {
                        0: { callback: function () { _this.world.playSound('walk'); } },
                        1: { callback: function () { _this.world.playSound('walk'); } },
                        2: { callback: function () { _this.world.playSound('walk'); } },
                    } }),
                Animations.fromTextureList({ name: 'spin', texturePrefix: 'diggur', textures: [8], frameRate: 1, count: Infinity }),
                Animations.fromTextureList({ name: 'laying', texturePrefix: 'diggur', textures: [9], frameRate: 1, count: Infinity }),
            ],
            defaultAnimation: 'idle',
            layer: 'main',
            physicsGroup: 'npcs',
            bounds: new RectBounds(-12, -4, 24, 24),
            gravityy: 400,
        }) || this;
        _this.MAX_SPEED = 100;
        _this.spinning = false;
        _this.laying = false;
        return _this;
    }
    Diggur.prototype.update = function () {
        var grounded = this.isGrounded();
        var haxis = (this.controller.left ? -1 : 0) + (this.controller.right ? 1 : 0);
        this.v.x = haxis * this.MAX_SPEED;
        if (this.spinning) {
            this.angle += 720 * this.delta;
            if (grounded) {
                this.spinning = false;
                this.laying = true;
                this.angle = 0;
            }
        }
        _super.prototype.update.call(this);
        if (haxis < 0) {
            this.flipX = true;
        }
        else {
            this.flipX = false;
        }
        if (this.laying) {
            this.playAnimation('laying');
        }
        else if (this.spinning) {
            this.playAnimation('spin');
        }
        else if (haxis === 0) {
            this.playAnimation('idle');
        }
        else {
            this.playAnimation('run');
        }
    };
    Diggur.prototype.onCollide = function (collison) {
        _super.prototype.onCollide.call(this, collison);
        if (collison.other.obj instanceof CrackedWall) {
            collison.other.obj.removeFromWorld();
            global.theater.runScript(S.loopFor(3, S.chain(S.call(function () { return global.world.playSound('crush'); }), S.wait(0.15))));
            global.theater.runScript(S.chain(S.fadeOut(0, 0xFFFFFF), S.call(function () {
                global.world.addWorldObject(new Sprite({ x: 3567, y: 1152, texture: 'smoke1', life: 2, update: function () { this.alpha = 0.8 * (1 - this.life.progress); }, vx: -10, vy: -10 }));
                global.world.addWorldObject(new Sprite({ x: 3567, y: 1152, texture: 'smoke2', life: 2, update: function () { this.alpha = 0.8 * (1 - this.life.progress); }, vx: 10, vy: 0 }));
                global.world.addWorldObject(new Sprite({ x: 3567, y: 1152, texture: 'smoke3', life: 2, update: function () { this.alpha = 0.8 * (1 - this.life.progress); }, vx: -20, vy: 20 }));
            }), S.wait(0.2), S.fadeSlides(0), S.shake(4, 1)));
        }
    };
    Diggur.prototype.isGrounded = function () {
        this.bounds.y++;
        var ground = this.world.select.overlap(this.bounds, ['walls']);
        this.bounds.y--;
        return !_.isEmpty(ground);
    };
    return Diggur;
}(Sprite));
/// <reference path="./interactable.ts" />
var Door = /** @class */ (function (_super) {
    __extends(Door, _super);
    function Door(x, y, toX, toY) {
        var _this = _super.call(this, {
            x: x, y: y,
            bounds: new RectBounds(-8, -8, 16, 16),
        }) || this;
        _this.toX = toX;
        _this.toY = toY;
        return _this;
    }
    Door.prototype.interact = function () {
        _super.prototype.interact.call(this);
        var player = this.world.select.type(Player);
        player.teleport(this.toX, this.toY);
        global.world.playSound('door');
    };
    return Door;
}(Interactable));
var Gobbor = /** @class */ (function (_super) {
    __extends(Gobbor, _super);
    function Gobbor(x, y) {
        return _super.call(this, {
            name: 'gobbor',
            x: x, y: y,
            animations: [
                Animations.fromTextureList({ name: 'idle', texturePrefix: 'gobbor', textures: [0, 1], frameRate: 3, count: Infinity }),
            ],
            defaultAnimation: 'idle',
            layer: 'main',
            physicsGroup: 'npcs',
            bounds: new RectBounds(-12, -4, 24, 24),
            gravityy: 400,
        }) || this;
    }
    return Gobbor;
}(Sprite));
var ITEMS = {
    'cane': { icon: 'cane', name: "Valiant Cane", description: "Your knees just don't work like they used to. This cane helps you jump six tiles into the air, like the good ole days." },
    'wad': { icon: 'wad', name: "Crumpled Wad", description: "it's funny" },
    'redkey': { icon: 'redkey', name: "Red Key", description: "Can be used to open the Red Door." },
    'blackkey': { icon: 'blackkey', name: "Black Key", description: "If it were any more black, you wouldn't be able to see it against the background." },
    'blackkey_upsidedown': { icon: 'blackkey_upsidedown', name: "Black Key (upside down)", description: "It's been turned upside down, and should now be able to open the Black Door with ease." },
    'blackkey_rightsideup': { icon: 'blackkey', name: "Black Key (rightside up)", description: "It's been turned upside down, then upside down again, rendering it identical to its previous orientation." },
    'string': { icon: 'string', name: "String", description: "Reminds you of the days before string cheese and string theory. String was just string, and that was good enough for you." },
    'nickel': { icon: 'nickel', name: "Shiny Nickel", description: "A shiny nickel worth $5. This makes sense because of inflation." },
};
var INVENTORY = ['cane', 'wad', 'nickel'];
function GIVE_ITEM(item) {
    INVENTORY.push(item);
}
function CONSUME_ITEM(item) {
    INVENTORY.splice(INVENTORY.lastIndexOf(item), 1);
}
function REPLACE_ITEM(item, newItem) {
    INVENTORY[INVENTORY.lastIndexOf(item)] = newItem;
}
var InventorySelect = /** @class */ (function (_super) {
    __extends(InventorySelect, _super);
    function InventorySelect(message) {
        var _this = _super.call(this, {
            texture: 'itemboxes',
            layer: Theater.LAYER_DIALOG,
        }) || this;
        _this.ITEMS_START = vec2(48, 34);
        _this.ITEM_NAME_DX = 20;
        _this.ITEM_DY = 24;
        _this.DESCRIPTION_POS = vec2(218, 53);
        _this.DESCRIPTION_WIDTH = 148;
        _this.MESSAGE_POS = vec2(12, 248);
        _this.index = 0;
        _this.selectedItem = undefined;
        _this.message = message;
        _this.inventory = A.clone(INVENTORY);
        return _this;
    }
    Object.defineProperty(InventorySelect.prototype, "hasSelected", {
        get: function () { return this.selectedItem !== undefined; },
        enumerable: false,
        configurable: true
    });
    InventorySelect.prototype.onAdd = function () {
        for (var i = 0; i < this.inventory.length; i++) {
            var id = this.inventory[i];
            var item = ITEMS[id];
            this.addChild(new Sprite({ x: this.ITEMS_START.x, y: this.ITEMS_START.y + i * this.ITEM_DY, texture: item.icon, matchParentLayer: true }));
            this.addChild(new SpriteText({ x: this.ITEMS_START.x + this.ITEM_NAME_DX, y: this.ITEMS_START.y + i * this.ITEM_DY - 6, text: item.name, matchParentLayer: true }));
        }
        this.description = this.addChild(new SpriteText({ x: this.DESCRIPTION_POS.x, y: this.DESCRIPTION_POS.y, text: this.message, maxWidth: this.DESCRIPTION_WIDTH, matchParentLayer: true }));
        this.addChild(new SpriteText({ x: this.MESSAGE_POS.x, y: this.MESSAGE_POS.y, text: this.message, matchParentLayer: true }));
        var selectionTexture = AnchoredTexture.fromBaseTexture(Texture.outlineRect(20, 20, 0xFFFFFF, 1, 1), 0.5, 0.5);
        this.selection = this.addChild(new Sprite({ texture: selectionTexture, matchParentLayer: true }));
    };
    InventorySelect.prototype.update = function () {
        _super.prototype.update.call(this);
        if (Input.justDown('up')) {
            this.index = M.mod(this.index - 1, this.inventory.length);
            this.world.playSound('menu_blip');
        }
        if (Input.justDown('down')) {
            this.index = M.mod(this.index + 1, this.inventory.length);
            this.world.playSound('menu_blip');
        }
        this.selection.x = this.ITEMS_START.x;
        this.selection.y = this.ITEMS_START.y + this.index * this.ITEM_DY;
        this.description.setText(ITEMS[this.inventory[this.index]].description);
        if (Input.justDown('game_advanceCutscene')) {
            Input.consume('game_advanceCutscene');
            this.selectedItem = this.inventory[this.index];
            this.world.playSound('menu_blip');
        }
    };
    return InventorySelect;
}(Sprite));
var S;
(function (S) {
    function chooseItem(message, result) {
        return function () {
            var selector;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        selector = global.theater.addWorldObject(new InventorySelect(message));
                        _a.label = 1;
                    case 1:
                        if (!!selector.hasSelected) return [3 /*break*/, 3];
                        return [4 /*yield*/];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 1];
                    case 3:
                        result.item = selector.selectedItem;
                        selector.removeFromWorld();
                        return [2 /*return*/];
                }
            });
        };
    }
    S.chooseItem = chooseItem;
})(S || (S = {}));
var Item = /** @class */ (function (_super) {
    __extends(Item, _super);
    function Item(x, y, name) {
        var _this = _super.call(this, {
            name: name,
            x: x, y: y,
            texture: name,
            layer: 'items',
        }) || this;
        _this.addChild(new CutsceneInteractable(0, 0, "item_" + name));
        return _this;
    }
    return Item;
}(Sprite));
var JaggyRemoverFilter = /** @class */ (function (_super) {
    __extends(JaggyRemoverFilter, _super);
    function JaggyRemoverFilter() {
        return _super.call(this, {
            code: "\n                vec4 gcxp = getColor(x + 1.0, y);\n                vec4 gcxn = getColor(x - 1.0, y);\n                vec4 gcyp = getColor(x, y + 1.0);\n                vec4 gcyn = getColor(x, y - 1.0);\n                if (gcxp.a == 0.0 && gcxn.a == 0.0) {\n                    outp.a = 0.0;\n                }\n                if (gcyp.a == 0.0 && gcyn.a == 0.0) {\n                    outp.a = 0.0;\n                }\n            ",
        }) || this;
    }
    return JaggyRemoverFilter;
}(TextureFilter));
var Lever = /** @class */ (function (_super) {
    __extends(Lever, _super);
    function Lever(x, y, cutscene) {
        var _this = _super.call(this, {
            x: x, y: y,
            texture: 'lever',
        }) || this;
        var i = _this.addChild(new Interactable({ x: 0, y: -8, bounds: new RectBounds(-1, -8, 2, 16) }));
        i.onInteract = function () {
            _this.flip();
        };
        _this.cutscene = cutscene;
        return _this;
    }
    Lever.prototype.flip = function () {
        this.flipX = true;
        if (this.flipX) {
            global.theater.storyManager.cutsceneManager.playCutscene(this.cutscene);
        }
        this.world.playSound('crush');
        global.theater.runScript(S.shake(2, 0.3));
    };
    return Lever;
}(Sprite));
var LockedDoor = /** @class */ (function (_super) {
    __extends(LockedDoor, _super);
    function LockedDoor(x, y, name, movable) {
        var _this = _super.call(this, {
            name: name,
            x: x, y: y,
            texture: name,
            layer: 'doors',
            physicsGroup: 'walls',
            bounds: new RectBounds(-8, -16, 16, 32),
            immovable: !movable,
        }) || this;
        var i = _this.addChild(new CutsceneInteractable(0, 0, "i_" + name));
        i.setBoundsSize(24, 24);
        if (movable) {
            i.pressTexture = 'pressright';
        }
        return _this;
    }
    return LockedDoor;
}(Sprite));
/// <reference path="../lectvs/menu/menu.ts" />
var MainMenu = /** @class */ (function (_super) {
    __extends(MainMenu, _super);
    function MainMenu(menuSystem) {
        var _this = _super.call(this, menuSystem, {
            backgroundColor: 0x000000,
            volume: 0,
        }) || this;
        _this.addWorldObject(new Sprite({
            texture: 'titlescreen',
        }));
        var title = new BasicTexture(200, 160);
        new SpriteText({
            text: 'On\nUndermining.',
        }).render(title, 15, 40);
        _this.addWorldObject(new Sprite({
            texture: title,
            scaleX: 2,
            scaleY: 2,
        }));
        _this.addWorldObject(new SpriteText({
            x: 30, y: 160,
            text: 'A Sequel to a Game by Andrfw',
        }));
        _this.addWorldObject(new SpriteText({
            x: 30, y: 184,
            text: 'By lectvs',
        }));
        _this.addWorldObject(new SpriteText({
            x: 30, y: 240,
            text: 'Click to Start',
        }));
        return _this;
    }
    MainMenu.prototype.update = function () {
        _super.prototype.update.call(this);
        if (Input.justDown('game_select')) {
            Input.consume('game_select');
            this.menuSystem.game.startGame();
        }
    };
    return MainMenu;
}(Menu));
var PauseMenu = /** @class */ (function (_super) {
    __extends(PauseMenu, _super);
    function PauseMenu(menuSystem) {
        var _this = _super.call(this, menuSystem, {
            backgroundColor: 0x000000,
            volume: 0,
        }) || this;
        _this.addWorldObject(new SpriteText({
            x: 20, y: 20,
            text: "- paused -"
        }));
        _this.addWorldObject(new MenuTextButton({
            x: 20, y: 50,
            text: "resume",
            onClick: function () {
                _this.menuSystem.game.playSound('click');
                menuSystem.game.unpauseGame();
            }
        }));
        _this.addWorldObject(new MenuTextButton({
            x: 20, y: 70,
            text: "main menu",
            onClick: function () {
                _this.menuSystem.game.playSound('click');
                menuSystem.game.menuSystem.loadMenu(MainMenu);
            }
        }));
        // this.addWorldObject(new MenuTextButton({
        //     x: 20, y: 80,
        //     text: "skip current cutscene",
        //     onClick: () => {
        //         this.menuSystem.game.playSound('click');
        //         menuSystem.game.unpauseGame();
        //         global.theater.skipCurrentCutscene();
        //     }
        // }));
        _this.addWorldObject(new MenuTextButton({
            x: 20, y: 110,
            text: "options",
            onClick: function () {
                menuSystem.game.playSound('click');
                menuSystem.loadMenu(OptionsMenu);
            }
        }));
        return _this;
    }
    PauseMenu.prototype.update = function () {
        _super.prototype.update.call(this);
        if (Input.justDown(Input.GAME_PAUSE)) {
            Input.consume(Input.GAME_PAUSE);
            this.menuSystem.game.unpauseGame();
        }
    };
    return PauseMenu;
}(Menu));
var OptionsMenu = /** @class */ (function (_super) {
    __extends(OptionsMenu, _super);
    function OptionsMenu(menuSystem) {
        var _this = _super.call(this, menuSystem, {
            backgroundColor: 0x000000,
            volume: 0,
        }) || this;
        _this.addWorldObject(new SpriteText({
            x: 20, y: 20,
            text: "- options -"
        }));
        _this.addWorldObject(new SpriteText({
            x: 20, y: 50,
            text: "volume:"
        }));
        _this.addWorldObject(new MenuNumericSelector({
            x: 20, y: 66,
            barLength: 10,
            minValue: 0,
            maxValue: 1,
            getValue: function () { return Options.getOption('volume'); },
            setValue: function (v) { return Options.updateOption('volume', v); }
        }));
        _this.addWorldObject(new SpriteText({
            x: 20, y: 90,
            text: "toggle fullscreen\n with F"
        }));
        _this.addWorldObject(new MenuTextButton({
            x: 20, y: 130,
            text: "debug",
            onClick: function () {
                menuSystem.game.playSound('click');
                menuSystem.loadMenu(DebugOptionsMenu);
            }
        }));
        _this.addWorldObject(new MenuTextButton({
            x: 20, y: 170,
            text: "back",
            onClick: function () {
                menuSystem.game.playSound('click');
                menuSystem.back();
            }
        }));
        return _this;
    }
    OptionsMenu.prototype.update = function () {
        _super.prototype.update.call(this);
        if (Input.justDown(Input.GAME_CLOSE_MENU)) {
            Input.consume(Input.GAME_CLOSE_MENU);
            this.menuSystem.back();
        }
    };
    return OptionsMenu;
}(Menu));
var DebugOptionsMenu = /** @class */ (function (_super) {
    __extends(DebugOptionsMenu, _super);
    function DebugOptionsMenu(menuSystem) {
        var _this = _super.call(this, menuSystem, {
            backgroundColor: 0x000000,
            volume: 0,
        }) || this;
        _this.addWorldObject(new SpriteText({
            x: 20, y: 20,
            text: "- debug options -"
        }));
        var getDebugText = function () { return "debug overlay: " + (Debug.SHOW_OVERLAY ? "ON" : "OFF"); };
        var debugOverlayButton = _this.addWorldObject(new MenuTextButton({
            x: 20, y: 50,
            text: getDebugText(),
            onClick: function () {
                Debug.SHOW_OVERLAY = !Debug.SHOW_OVERLAY;
                debugOverlayButton.setText(getDebugText());
            }
        }));
        _this.addWorldObject(new MenuTextButton({
            x: 20, y: 110,
            text: "back",
            onClick: function () {
                menuSystem.game.playSound('click');
                menuSystem.back();
            }
        }));
        return _this;
    }
    DebugOptionsMenu.prototype.update = function () {
        _super.prototype.update.call(this);
        if (Input.justDown(Input.GAME_CLOSE_MENU)) {
            Input.consume(Input.GAME_CLOSE_MENU);
            this.menuSystem.back();
        }
    };
    return DebugOptionsMenu;
}(Menu));
var stages = {
    'game': function () {
        var world = new World({
            backgroundColor: 0x62ADBB,
            camera: {
                movement: Camera.Movement.SNAP()
            },
            layers: [
                { name: 'bg' },
                { name: 'doors' },
                { name: 'walls', effects: { post: { filters: [new WallFilter(), new JaggyRemoverFilter()] } } },
                { name: 'main' },
                { name: 'items' },
                { name: 'pressx' },
                { name: 'player' },
                { name: 'fg' },
            ],
            physicsGroups: {
                'player': {},
                'npcs': {},
                'walls': {},
            },
            collisions: [
                { move: 'player', from: 'walls' },
                { move: 'npcs', from: 'walls' },
            ],
            collisionIterations: 4,
            // TODO: rethink this? does it actually help?
            useRaycastDisplacementThreshold: Infinity,
            maxDistancePerCollisionStep: 8,
            globalSoundHumanizePercent: 0.1,
        });
        world.addWorldObject(new Tilemap({
            tileset: 'tiles',
            tilemap: 'world',
            layer: 'walls',
            physicsGroup: 'walls',
        }));
        world.addWorldObject(new Sprite({ texture: 'world_bg', layer: 'bg' }));
        // Tutorials
        world.addWorldObject(new Tutorial(600, 292, 0, 0, "Press the arrow keys to move"));
        world.addWorldObject(new Tutorial(1000, 292, 1, 0, "Press Z to jump, hold it to jump higher"));
        // NPCs
        var diggur = world.addWorldObject(new Diggur(2127, 255));
        diggur.addChild(new CutsceneInteractable(0, 0, 'i_diggur_surface')).setBoundsSize(32, 32);
        var scammir = world.addWorldObject(new Scammir(2330, 255));
        scammir.flipX = true;
        scammir.addChild(new CutsceneInteractable(0, 0, 'i_scammir_surface')).setBoundsSize(32, 32);
        var gobbor = world.addWorldObject(new Gobbor(120, 224));
        gobbor.addChild(new CutsceneInteractable(0, 0, 'i_gobbor_surface')).setBoundsSize(32, 32);
        var scammir_tele = world.addWorldObject(new Scammir(3664, 1471));
        scammir_tele.name = "scammir_tele";
        scammir_tele.flipX = true;
        scammir_tele.addChild(new CutsceneInteractable(0, 0, 'i_scammir_tele')).setBoundsSize(32, 32);
        // Doors
        world.addWorldObject(new Door(570, 240, 266, 224));
        world.addWorldObject(new Door(278, 207, 579, 256));
        // Locked Doors
        world.addWorldObject(new LockedDoor(1800, 880, 'reddoor', false));
        world.addWorldObject(new LockedDoor(2538, 1184, 'blackdoor', false));
        world.addWorldObject(new Sprite({ x: 3144, y: 1520, name: 'pitdoor1', texture: 'wooddoor', layer: 'doors', physicsGroup: 'walls', bounds: new RectBounds(-8, -16, 16, 32), immovable: true }));
        world.addWorldObject(new Sprite({ x: 3000, y: 1512, name: 'pitdoor2', texture: 'wooddoor_side', layer: 'doors', physicsGroup: 'walls', bounds: new RectBounds(-24, -8, 48, 16), immovable: true }));
        var movableDoor = world.addWorldObject(new LockedDoor(1800, 880, 'movabledoor', true));
        movableDoor.setVisible(false);
        movableDoor.physicsGroup = undefined;
        // Levers
        world.addWorldObject(new Lever(3000, 1504, 'lever_pit'));
        // Items
        world.addWorldObject(new Item(2600, 728, 'redkey'));
        world.addWorldObject(new Item(4180, 728, 'redkey'));
        world.addWorldObject(new Item(3412, 1456, 'blackkey'));
        world.addWorldObject(new Item(2183, 1475, 'string'));
        // Signs
        world.addWorldObject(new CutsceneInteractable(644, 244, 'i_mgsign'));
        world.addWorldObject(new CutsceneInteractable(1774, 244, 'i_jdsign'));
        world.addWorldObject(new CutsceneInteractable(1832, 182, 'i_ssign'));
        world.addWorldObject(new CutsceneInteractable(2177, 211, 'i_umsign'));
        world.addWorldObject(new CutsceneInteractable(2460, 243, 'i_hsign'));
        world.addWorldObject(new CutsceneInteractable(2890, 1555, 'i_leversign'));
        // Door Cutscenes
        world.addWorldObject(new CutsceneInteractable(1680, 240, 'i_jdhouse'));
        world.addWorldObject(new CutsceneInteractable(1910, 178, 'i_shouse'));
        world.addWorldObject(new CutsceneInteractable(2550, 240, 'i_hhouse'));
        world.addWorldObject(new CutsceneInteractable(2172, 1215, 'i_loominggate')).setBoundsSize(64, 64);
        // Etc.
        world.addWorldObject(new Sprite({ x: 3744, y: 1408, texture: 'glass', physicsGroup: 'walls', bounds: new RectBounds(0, 0, 16, 64), immovable: true }));
        world.addWorldObject(new CutsceneInteractable(3696, 1456, 'i_telescope')).setBoundsSize(64, 64);
        world.addWorldObject(new CutsceneInteractable(3400, 1172, 'i_grass')).setBoundsSize(64, 64);
        world.addWorldObject(new CrackedWall(3568, 1120));
        world.addWorldObject(new Chest(200, 512));
        world.addWorldObject(new Note(1900, 888)).setVisible(false);
        // Orbs
        world.addWorldObject(new Orb(2119, 1157, 'orb1_final', 0.45, 'bg'));
        world.addWorldObject(new Orb(2172, 1144, 'orb2_final', 0.45, 'bg'));
        world.addWorldObject(new Orb(2225, 1156, 'orb3_final', 0.45, 'fg')).setVisible(false);
        world.addWorldObject(new Orb(3808, 1056, 'orb3', 0.5, 'fg'));
        var player = world.addWorldObject(new Player(692, 255)); // Start
        //let player = world.addWorldObject(new Player(2094, 255));  // Pit
        //let player = world.addWorldObject(new Player(2273, 920));  // Start of UM
        //let player = world.addWorldObject(new Player(2374, 1135)); // Orbs
        //let player = world.addWorldObject(new Player(2848, 1567)); // Lever
        //let player = world.addWorldObject(new Player(2480, 1567)); // String
        //let player = world.addWorldObject(new Player(3296, 1183)); GIVE_ITEM('string'); // Grass
        //let player = world.addWorldObject(new Player(290, 524));   // Chest
        world.addWorldObject(new PressX(player));
        world.addWorldObject(new CameraController(player));
        return world;
    },
};
function isOnSector(x, y) {
    var cc = global.world.select.type(CameraController);
    if (!cc)
        return false;
    return cc.sector.x === x && cc.sector.y === y;
}
var isResult = {};
var scammirDoorInteractions = 0;
var hasFallen = false;
var storyboard = {
    'start': {
        type: 'start',
        transitions: [{ onStage: 'game', toNode: 'gameplay' }]
    },
    'gameplay': {
        type: 'gameplay',
        transitions: []
    },
    'intro_undermine': {
        type: 'cutscene',
        script: function () {
            var player, waitTime, THE, UNDERMINE;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        player = global.world.select.type(Player);
                        return [4 /*yield*/, S.waitUntil(function () { return player.isGrounded(); })];
                    case 1:
                        _a.sent();
                        global.world.playSound('crush');
                        global.theater.runScript(S.shake(4, 0.5));
                        waitTime = hasFallen ? 3 : 2;
                        return [4 /*yield*/, S.wait(waitTime)];
                    case 2:
                        _a.sent();
                        THE = global.theater.addWorldObject(new Sprite({
                            x: global.gameWidth / 2,
                            y: global.gameHeight / 2 - 40,
                            texture: 'THE',
                            alpha: 0,
                        }));
                        UNDERMINE = global.theater.addWorldObject(new Sprite({
                            x: global.gameWidth / 2,
                            y: global.gameHeight / 2,
                            texture: 'UNDERMINE',
                            alpha: 0,
                            scaleX: 2,
                            scaleY: 4,
                        }));
                        global.world.playSound('theundermine', { humanized: false });
                        return [4 /*yield*/, S.simul(S.doOverTime(1, function (t) {
                                THE.alpha = t;
                                UNDERMINE.alpha = t;
                            }), S.doOverTime(4, function (t) {
                                UNDERMINE.scaleX = 2 + 2 * Tween.Easing.OutCubic(t);
                            }))];
                    case 3:
                        _a.sent();
                        //yield S.wait(2);
                        return [4 /*yield*/, S.doOverTime(1, function (t) {
                                THE.alpha = 1 - t;
                                UNDERMINE.alpha = 1 - t;
                            })];
                    case 4:
                        //yield S.wait(2);
                        _a.sent();
                        THE.removeFromWorld();
                        UNDERMINE.removeFromWorld();
                        global.theater.playMusic('caverns');
                        return [2 /*return*/];
                }
            });
        },
        transitions: [{ toNode: 'gameplay' }]
    },
    /* Items */
    'item_redkey': {
        type: 'cutscene',
        script: function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        GIVE_ITEM('redkey');
                        global.world.select.nameAll('redkey').forEach(function (key) { return key.removeFromWorld(); });
                        global.world.playSound('item_get');
                        return [4 /*yield*/, S.dialog("Feeling moderately bamboozled, you pick up the Red Key.")];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, S.dialog("It can be used to open the Red Door.")];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        },
        transitions: [{ toNode: 'gameplay' }]
    },
    'item_blackkey': {
        type: 'cutscene',
        script: function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        GIVE_ITEM('blackkey');
                        global.world.select.nameAll('blackkey').forEach(function (key) { return key.removeFromWorld(); });
                        global.world.playSound('item_get');
                        return [4 /*yield*/, S.dialog("After a long trek back through the Undermine, there's nothing more refreshing than an ice-cold Black Key.")];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        },
        transitions: [{ toNode: 'gameplay' }]
    },
    'item_string': {
        type: 'cutscene',
        script: function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        GIVE_ITEM('string');
                        global.world.select.nameAll('string').forEach(function (key) { return key.removeFromWorld(); });
                        global.world.playSound('item_get');
                        return [4 /*yield*/, S.dialog("String!! Ha ha. This used to make you laugh so hard back in the day.")];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, S.dialog("Pocketed the string for later use.")];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        },
        transitions: [{ toNode: 'gameplay' }]
    },
    /* Locked Doors */
    'i_reddoor': {
        type: 'cutscene',
        script: function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, S.chooseItem("Which item?", isResult)];
                    case 1:
                        _b.sent();
                        if (!(isResult.item === 'redkey')) return [3 /*break*/, 4];
                        return [4 /*yield*/, S.dialog("The Red Key slides snugly into the keyhole.")];
                    case 2:
                        _b.sent();
                        (_a = global.world.select.name('reddoor')) === null || _a === void 0 ? void 0 : _a.removeFromWorld();
                        global.world.playSound('crush');
                        global.theater.runScript(S.shake(2, 0.3));
                        return [4 /*yield*/, S.dialog("This sure was a hassle to unlock. You can't believe you have to do this every time you come down here.")];
                    case 3:
                        _b.sent();
                        return [3 /*break*/, 8];
                    case 4:
                        if (!(isResult.item === 'cane')) return [3 /*break*/, 6];
                        return [4 /*yield*/, S.dialog("Let's not resort to this just yet.")];
                    case 5:
                        _b.sent();
                        return [3 /*break*/, 8];
                    case 6: return [4 /*yield*/, S.dialog("That doesn't really strike you as a \"door opening item\".")];
                    case 7:
                        _b.sent();
                        _b.label = 8;
                    case 8: return [2 /*return*/];
                }
            });
        },
        transitions: [{ toNode: 'gameplay' }]
    },
    'i_blackdoor': {
        type: 'cutscene',
        script: function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, S.chooseItem("Which item?", isResult)];
                    case 1:
                        _b.sent();
                        if (!(isResult.item === 'blackkey')) return [3 /*break*/, 5];
                        return [4 /*yield*/, S.dialog("You insert the Black Key, but it doesn't turn.")];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, S.dialog("Upon closer inspection, it appears the keyhole on this door is upside down.")];
                    case 3:
                        _b.sent();
                        return [4 /*yield*/, S.dialog("Try using the key upside down.")];
                    case 4:
                        _b.sent();
                        REPLACE_ITEM('blackkey', 'blackkey_upsidedown');
                        return [3 /*break*/, 21];
                    case 5:
                        if (!(isResult.item === 'blackkey_upsidedown')) return [3 /*break*/, 10];
                        return [4 /*yield*/, S.dialog("You insert the Black Key upside down")];
                    case 6:
                        _b.sent();
                        return [4 /*yield*/, S.dialog("but it still doesn't turn.")];
                    case 7:
                        _b.sent();
                        return [4 /*yield*/, S.dialog("this is peculiar.")];
                    case 8:
                        _b.sent();
                        return [4 /*yield*/, S.dialog("Hold on, try inserting the key rightside up again...")];
                    case 9:
                        _b.sent();
                        REPLACE_ITEM('blackkey_upsidedown', 'blackkey_rightsideup');
                        return [3 /*break*/, 21];
                    case 10:
                        if (!(isResult.item === 'blackkey_rightsideup')) return [3 /*break*/, 13];
                        (_a = global.world.select.name('blackdoor')) === null || _a === void 0 ? void 0 : _a.removeFromWorld();
                        global.world.playSound('crush');
                        global.theater.runScript(S.shake(2, 0.3));
                        return [4 /*yield*/, S.dialog("That's the ticket! The door unlocks.")];
                    case 11:
                        _b.sent();
                        return [4 /*yield*/, S.dialog("Unfortunately, so much reorientation in such a small amount of time has caused the key to disintegrate.")];
                    case 12:
                        _b.sent();
                        CONSUME_ITEM('blackkey_rightsideup');
                        return [3 /*break*/, 21];
                    case 13:
                        if (!(isResult.item === 'redkey')) return [3 /*break*/, 17];
                        return [4 /*yield*/, S.dialog("The Red Key slides snugly into the keyhole.")];
                    case 14:
                        _b.sent();
                        return [4 /*yield*/, S.dialog(".................................")];
                    case 15:
                        _b.sent();
                        return [4 /*yield*/, S.dialog("... just kidding.")];
                    case 16:
                        _b.sent();
                        return [3 /*break*/, 21];
                    case 17:
                        if (!(isResult.item === 'cane')) return [3 /*break*/, 19];
                        return [4 /*yield*/, S.dialog("Let's not resort to this just yet.")];
                    case 18:
                        _b.sent();
                        return [3 /*break*/, 21];
                    case 19: return [4 /*yield*/, S.dialog("That doesn't really strike you as a \"door opening item\".")];
                    case 20:
                        _b.sent();
                        _b.label = 21;
                    case 21: return [2 /*return*/];
                }
            });
        },
        transitions: [{ toNode: 'gameplay' }]
    },
    /* Levers */
    'lever_pit': {
        type: 'cutscene',
        script: function () {
            var _a, _b;
            return __generator(this, function (_c) {
                (_a = global.world.select.name('pitdoor1', false)) === null || _a === void 0 ? void 0 : _a.removeFromWorld();
                (_b = global.world.select.name('pitdoor2', false)) === null || _b === void 0 ? void 0 : _b.removeFromWorld();
                return [2 /*return*/];
            });
        },
        transitions: [{ toNode: 'gameplay' }]
    },
    /* Interactions */
    'i_mgsign': {
        type: 'cutscene',
        script: function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, S.dialog("Mirigram and Gobbor's House")];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        },
        transitions: [{ toNode: 'gameplay' }]
    },
    'i_jdsign': {
        type: 'cutscene',
        script: function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, S.dialog("Jergol and Diggur's Cool Science House")];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        },
        transitions: [{ toNode: 'gameplay' }]
    },
    'i_jdhouse': {
        type: 'cutscene',
        script: function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, S.dialog("It's locked.")];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        },
        transitions: [{ toNode: 'gameplay' }]
    },
    'i_ssign': {
        type: 'cutscene',
        script: function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, S.dialog("Scammir's House")];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, S.dialog("A note scrawled on the sign in nearly illegible handwriting reads: \"Come on in! Door's unlocked :)\".")];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        },
        transitions: [{ toNode: 'gameplay' }]
    },
    'i_shouse': {
        type: 'cutscene',
        script: function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        scammirDoorInteractions++;
                        if (!(scammirDoorInteractions <= 1)) return [3 /*break*/, 3];
                        global.theater.runScript(S.shake(2, 0.3));
                        global.world.playSound('crush');
                        global.theater.dialogBox.setSpeakSound(undefined);
                        return [4 /*yield*/, S.dialog("YEOWCH!!")];
                    case 1:
                        _a.sent();
                        global.theater.dialogBox.setSpeakSound('dialogspeak');
                        return [4 /*yield*/, S.dialog("... the handle shocked you. Kids these days and their electronic devices...")];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 9];
                    case 3:
                        if (!(scammirDoorInteractions === 2)) return [3 /*break*/, 6];
                        global.theater.runScript(S.shake(2, 0.3));
                        global.world.playSound('crush');
                        global.theater.dialogBox.setSpeakSound(undefined);
                        return [4 /*yield*/, S.dialog("YEOWCH!!")];
                    case 4:
                        _a.sent();
                        global.theater.dialogBox.setSpeakSound('dialogspeak');
                        return [4 /*yield*/, S.dialog("The electric shock resonating through your body makes you inexplicably feel 20 years younger.")];
                    case 5:
                        _a.sent();
                        return [3 /*break*/, 9];
                    case 6: return [4 /*yield*/, S.dialog("...........................")];
                    case 7:
                        _a.sent();
                        return [4 /*yield*/, S.dialog("... the handle has run out of battery.")];
                    case 8:
                        _a.sent();
                        _a.label = 9;
                    case 9: return [2 /*return*/];
                }
            });
        },
        transitions: [{ toNode: 'gameplay' }]
    },
    'i_umsign': {
        type: 'cutscene',
        script: function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, S.dialog("The Undermine: Adventurers only beyond this point!")];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        },
        transitions: [{ toNode: 'gameplay' }]
    },
    'i_hsign': {
        type: 'cutscene',
        script: function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, S.dialog("Huntar's House")];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        },
        transitions: [{ toNode: 'gameplay' }]
    },
    'i_hhouse': {
        type: 'cutscene',
        script: function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, S.dialog("It's locked.")];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        },
        transitions: [{ toNode: 'gameplay' }]
    },
    'i_diggur_surface': {
        type: 'cutscene',
        script: function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        global.theater.dialogBox.showName('Diggur');
                        global.theater.dialogBox.setSpeakSound('dialogspeak_diggur');
                        return [4 /*yield*/, S.dialog("Another day, another quest... I wonder, what adventures await us today?")];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, S.dialog("Are you coming down too, Mrs M? What a pleasant surprise.")];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, S.dialog("Perhaps our paths may cross down below.")];
                    case 3:
                        _a.sent();
                        global.theater.dialogBox.showName(undefined);
                        global.theater.dialogBox.setSpeakSound('dialogspeak');
                        return [2 /*return*/];
                }
            });
        },
        transitions: [{ toNode: 'gameplay' }]
    },
    'i_scammir_surface': {
        type: 'cutscene',
        script: function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        global.theater.dialogBox.showName('Scammir');
                        global.theater.dialogBox.setSpeakSound('dialogspeak_scammir');
                        return [4 /*yield*/, S.dialog("pssst")];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, S.dialog("fancy a lil scam~?")];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, S.dialog("first ones on the house")];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, S.dialogAdd(" ... not!! psyche!")];
                    case 4:
                        _a.sent();
                        global.theater.dialogBox.showName(undefined);
                        global.theater.dialogBox.setSpeakSound('dialogspeak');
                        return [2 /*return*/];
                }
            });
        },
        transitions: [{ toNode: 'gameplay' }]
    },
    'i_gobbor_surface': {
        type: 'cutscene',
        script: function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        global.theater.dialogBox.showName('Gobbor');
                        global.theater.dialogBox.setSpeakSound(undefined);
                        return [4 /*yield*/, S.dialog(".....................")];
                    case 1:
                        _a.sent();
                        global.theater.dialogBox.showName(undefined);
                        global.theater.dialogBox.setSpeakSound('dialogspeak');
                        return [4 /*yield*/, S.dialog("Gobbor doesn't say anything, being the silent protagonist he is.")];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, S.dialog("Such a polite young man.")];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        },
        transitions: [{ toNode: 'gameplay' }]
    },
    'i_leversign': {
        type: 'cutscene',
        script: function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, S.dialog("The sign reads: \"the door ahead is locked!! quick, pull the lever to unlock it!!\"")];
                    case 1:
                        _a.sent();
                        if (!hasFallen) return [3 /*break*/, 6];
                        return [4 /*yield*/, S.dialog("...........................")];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, S.dialog("... you can't believe you actually pulled that lever.")];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, S.dialog("But you can't be too mad about it, as your attention shifts toward the lever, now floating inexplicably in mid air.")];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, S.dialog("Truly, we are living in the future.")];
                    case 5:
                        _a.sent();
                        return [3 /*break*/, 8];
                    case 6: return [4 /*yield*/, S.dialog("... the prank is so obvious. no one would ever pull that lever.")];
                    case 7:
                        _a.sent();
                        _a.label = 8;
                    case 8: return [2 /*return*/];
                }
            });
        },
        transitions: [{ toNode: 'gameplay' }]
    },
    'i_note': {
        type: 'cutscene',
        script: function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, S.dialog("get scammed ~")];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        },
        transitions: [{ toNode: 'gameplay' }]
    },
    'i_scammir_tele': {
        type: 'cutscene',
        script: function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        global.theater.dialogBox.showName('Scammir');
                        global.theater.dialogBox.setSpeakSound('dialogspeak_scammir');
                        return [4 /*yield*/, S.dialog("teehee")];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, S.dialog("free telescope viewings, just $5 per view ~")];
                    case 2:
                        _a.sent();
                        global.theater.dialogBox.showName('Scammir');
                        global.theater.dialogBox.setSpeakSound('dialogspeak');
                        return [2 /*return*/];
                }
            });
        },
        transitions: [{ toNode: 'gameplay' }]
    },
    'i_telescope': {
        type: 'cutscene',
        script: function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, S.chooseItem("Which item?", isResult)];
                    case 1:
                        _a.sent();
                        if (!(isResult.item === 'nickel')) return [3 /*break*/, 5];
                        return [4 /*yield*/, S.dialog("Using the nickel, you peer into the telescope, and are offered the sight of new areas far and wide...")];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, S.dialog("... a glimpse of jokes that have not been and would never be...")];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, S.dialog("... you can even see part of the subworld sticking out.")];
                    case 4:
                        _a.sent();
                        CONSUME_ITEM('nickel');
                        return [3 /*break*/, 8];
                    case 5:
                        global.theater.dialogBox.showName('Scammir');
                        global.theater.dialogBox.setSpeakSound('dialogspeak_scammir');
                        return [4 /*yield*/, S.dialog("i dont know what that is")];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, S.dialog("sounds like a scam to me")];
                    case 7:
                        _a.sent();
                        global.theater.dialogBox.showName(undefined);
                        global.theater.dialogBox.setSpeakSound('dialogspeak');
                        _a.label = 8;
                    case 8: return [2 /*return*/];
                }
            });
        },
        transitions: [{ toNode: 'gameplay' }]
    },
    'i_grass': {
        type: 'cutscene',
        script: function () {
            var player_1;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, S.dialog("A discreet patch of grass, rife with humorous potential.")];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, S.dialog("If only you had some String...")];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, S.chooseItem("Which item?", isResult)];
                    case 3:
                        _b.sent();
                        if (!(isResult.item === 'string')) return [3 /*break*/, 5];
                        global.world.addWorldObject(new Sprite({
                            x: 3383, y: 1175,
                            texture: Texture.filledRect(35, 1, 0xFFFFFF, 1),
                            layer: 'bg',
                        }));
                        (_a = global.world.select.name('ci_i_grass')) === null || _a === void 0 ? void 0 : _a.removeFromWorld();
                        CONSUME_ITEM('string');
                        return [4 /*yield*/, S.dialog("You tie the string to each post. The grass does a bad job of hiding it, but you'd be surprised what people fall for these days.")];
                    case 4:
                        _b.sent();
                        player_1 = global.world.select.type(Player);
                        global.theater.runScript(S.chain(S.waitUntil(function () { return player_1.x < 3272; }), S.call(function () { return global.theater.storyManager.cutsceneManager.playCutscene('diggur_trip'); })));
                        return [3 /*break*/, 7];
                    case 5: return [4 /*yield*/, S.dialog("That is not string. How foolish of you to even consider it.")];
                    case 6:
                        _b.sent();
                        _b.label = 7;
                    case 7: return [2 /*return*/];
                }
            });
        },
        transitions: [{ toNode: 'gameplay' }]
    },
    'i_crackedwall': {
        type: 'cutscene',
        script: function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, S.dialog("This section of wall appears cracked. You wonder what could be on the other side?")];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, S.dialog("Unfortunately, it would take a considerable amount of force to destroy it.")];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        },
        transitions: [{ toNode: 'gameplay' }]
    },
    'i_diggur_fall': {
        type: 'cutscene',
        script: function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        global.theater.dialogBox.showName('Diggur');
                        global.theater.dialogBox.setSpeakSound('dialogspeak_diggur');
                        return [4 /*yield*/, S.dialog("Oof... Mrs M... help...")];
                    case 1:
                        _a.sent();
                        global.theater.dialogBox.showName(undefined);
                        global.theater.dialogBox.setSpeakSound('dialogspeak');
                        return [2 /*return*/];
                }
            });
        },
        transitions: [{ toNode: 'gameplay' }]
    },
    'i_loominggate': {
        type: 'cutscene',
        script: function () {
            var loomingGateOpen, player;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        loomingGateOpen = global.world.select.name('orb3_final').isVisible();
                        if (!loomingGateOpen) return [3 /*break*/, 1];
                        player = global.world.select.type(Player);
                        player.teleport(248, 1567);
                        return [3 /*break*/, 4];
                    case 1: return [4 /*yield*/, S.dialog("The looming Gate is closed.")];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, S.dialog("Luckily, two of the orbs happen to be inserted already.")];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        },
        transitions: [{ toNode: 'gameplay' }]
    },
    'i_chest': {
        type: 'cutscene',
        script: function () {
            var player, chest, prank;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        player = global.world.select.type(Player);
                        chest = global.world.select.type(Chest);
                        chest.open();
                        return [4 /*yield*/, S.wait(2)];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        if (!(player.x > 166)) return [3 /*break*/, 4];
                        player.controller.left = true;
                        return [4 /*yield*/];
                    case 3:
                        _a.sent();
                        return [3 /*break*/, 2];
                    case 4: return [4 /*yield*/, S.wait(1)];
                    case 5:
                        _a.sent();
                        player.flipX = false;
                        return [4 /*yield*/, S.wait(0.5)];
                    case 6:
                        _a.sent();
                        player.flipX = true;
                        return [4 /*yield*/, S.wait(0.5)];
                    case 7:
                        _a.sent();
                        player.flipX = false;
                        return [4 /*yield*/, S.wait(1)];
                    case 8:
                        _a.sent();
                        return [4 /*yield*/, S.playAnimation(player, 'grab', true, true)];
                    case 9:
                        _a.sent();
                        prank = global.world.addWorldObject(new Sprite({
                            x: player.x,
                            y: player.y - 5,
                            texture: 'prank',
                            layer: 'fg',
                            scaleX: 0,
                            scaleY: 0,
                        }));
                        global.world.playSound('hjonk');
                        player.playAnimation('hold', true);
                        return [4 /*yield*/, S.simul(S.tweenPt(0.5, prank, vec2(prank.x, prank.y), vec2(player.x, player.y - 32), Tween.Easing.OutCubic), S.tween(0.5, prank, 'scaleX', 0, 1), S.tween(0.5, prank, 'scaleY', 0, 1))];
                    case 10:
                        _a.sent();
                        return [4 /*yield*/, S.wait(1)];
                    case 11:
                        _a.sent();
                        player.playAnimation('slam', true);
                        return [4 /*yield*/, S.simul(S.tweenPt(0.3, prank, vec2(prank.x, prank.y), vec2(chest.x, chest.y - 20), Tween.Easing.OutCubic), S.tween(0.3, prank, 'scaleX', 1, 0), S.tween(0.3, prank, 'scaleY', 1, 0), S.wait(0.5))];
                    case 12:
                        _a.sent();
                        player.playAnimation('idle', true);
                        return [4 /*yield*/, S.wait(1)];
                    case 13:
                        _a.sent();
                        player.playAnimation('slam', true);
                        chest.close();
                        return [4 /*yield*/, S.wait(0.5)];
                    case 14:
                        _a.sent();
                        player.playAnimation('idle', true);
                        return [4 /*yield*/, S.wait(1)];
                    case 15:
                        _a.sent();
                        global.theater.addWorldObject(new Sprite({ texture: Texture.filledRect(global.gameWidth, global.gameHeight, 0x000000), layer: Theater.LAYER_SLIDES }));
                        global.theater.runScript(function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/];
                                    case 1:
                                        _a.sent();
                                        global.theater.storyManager.cutsceneManager.playCutscene('credits');
                                        return [2 /*return*/];
                                }
                            });
                        });
                        return [2 /*return*/];
                }
            });
        },
        transitions: [{ toNode: 'credits' }]
    },
    'diggur_trip': {
        type: 'cutscene',
        script: function () {
            var player, diggur, startx, endx, basey;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        global.theater.musicManager.stopMusic(0.5);
                        global.world.select.typeAll(Diggur).forEach(function (diggur) { return diggur.removeFromWorld(); });
                        player = global.world.select.type(Player);
                        diggur = global.world.addWorldObject(new Diggur(3120, 1150));
                        return [4 /*yield*/, S.loopUntil(function () { return diggur.x > 3392; }, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            diggur.controller.right = true;
                                            if (diggur.x > player.x) {
                                                player.flipX = false;
                                            }
                                            return [4 /*yield*/];
                                        case 1:
                                            _a.sent();
                                            return [2 /*return*/];
                                    }
                                });
                            })];
                    case 1:
                        _a.sent();
                        diggur.y -= 5;
                        diggur.v.y = -300;
                        diggur.spinning = true;
                        startx = diggur.x;
                        endx = 3576;
                        basey = diggur.y;
                        global.world.playSound('trip');
                        return [4 /*yield*/, S.doOverTime(1, function (t) {
                                diggur.x = M.lerp(startx, endx, t);
                                diggur.y = basey + M.jumpParabola(0, -80, 0, t);
                            })];
                    case 2:
                        _a.sent();
                        diggur.addChild(new CutsceneInteractable(-16, 0, 'i_diggur_fall')).setBoundsSize(32, 32);
                        return [4 /*yield*/, S.wait(2.5)];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, S.dialog("Ha ha")];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, S.dialog("Always good for a laugh.")];
                    case 5:
                        _a.sent();
                        global.theater.musicManager.playMusic('caverns', 0.5);
                        return [2 /*return*/];
                }
            });
        },
        transitions: [{ toNode: 'gameplay' }]
    },
    'collect_orb': {
        type: 'cutscene',
        script: function () {
            var orb, player, orbfinal;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        orb = global.world.select.name('orb3');
                        player = global.world.select.type(Player);
                        global.world.playSound('theundermine', { humanized: false });
                        orb.shaking = true;
                        return [4 /*yield*/, S.doOverTime(2, function (t) {
                                orb.scaleX = 0.5 - 0.25 * Tween.Easing.OutCubic(t);
                                orb.scaleY = 0.5 - 0.25 * Tween.Easing.OutCubic(t);
                            })];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, S.wait(1)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, S.doOverTime(2, function (t) {
                                orb.scaleX = 0.25 + 40 * t;
                                orb.scaleY = 0.25 + 40 * t;
                            })];
                    case 3:
                        _a.sent();
                        player.x = 2166;
                        player.y = 1247;
                        orb.removeFromWorld();
                        global.theater.playMusic('caverns');
                        orbfinal = global.world.select.name('orb3_final');
                        orbfinal.setVisible(true);
                        orbfinal.scaleX = 50;
                        orbfinal.scaleY = 50;
                        return [4 /*yield*/, S.doOverTime(2, function (t) {
                                orbfinal.scaleX = 0.45 + 50 * (1 - t);
                                orbfinal.scaleY = 0.45 + 50 * (1 - t);
                            })];
                    case 4:
                        _a.sent();
                        orbfinal.layer = 'bg';
                        return [4 /*yield*/, S.wait(1)];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, S.dialog("You obtained the Orb of Craftsmanship.")];
                    case 6:
                        _a.sent();
                        global.world.addWorldObject(new Sprite({
                            x: 2134,
                            y: 1179,
                            texture: 'lgdoor_open',
                            layer: 'bg',
                        }));
                        global.world.playSound('crush');
                        global.theater.runScript(S.shake(2, 0.3));
                        return [2 /*return*/];
                }
            });
        },
        transitions: [{ toNode: 'gameplay' }]
    },
    'credits': {
        type: 'cutscene',
        script: function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        global.theater.playMusic('credits');
                        return [4 /*yield*/, S.fadeOut(0, 0x000000)];
                    case 1:
                        _a.sent();
                        global.theater.addWorldObject(new SpriteText({ x: global.gameWidth / 2, y: 24, text: 'On Undermining.', anchor: Vector2.TOP_CENTER, layer: Theater.LAYER_SLIDES }));
                        return [4 /*yield*/, S.wait(2)];
                    case 2:
                        _a.sent();
                        global.theater.addWorldObject(new SpriteText({ x: global.gameWidth / 2, y: 56, text: 'A Game by Hayden "lectvs" McCraw', anchor: Vector2.TOP_CENTER, layer: Theater.LAYER_SLIDES }));
                        return [4 /*yield*/, S.wait(2)];
                    case 3:
                        _a.sent();
                        global.theater.addWorldObject(new SpriteText({ x: global.gameWidth / 2, y: 88, text: 'Based on the "On Being Undermined."\ncinematic universe created by Andrfw', anchor: Vector2.TOP_CENTER, layer: Theater.LAYER_SLIDES }));
                        return [4 /*yield*/, S.wait(2)];
                    case 4:
                        _a.sent();
                        global.theater.addWorldObject(new SpriteText({ x: global.gameWidth / 2, y: 152, text: 'Special Thanks:', anchor: Vector2.TOP_CENTER, layer: Theater.LAYER_SLIDES }));
                        return [4 /*yield*/, S.wait(2)];
                    case 5:
                        _a.sent();
                        global.theater.addWorldObject(new SpriteText({ x: global.gameWidth / 2, y: 184, text: 'Andrew Murray           Original Game\n                             + Assets', anchor: Vector2.TOP_CENTER, layer: Theater.LAYER_SLIDES }));
                        return [4 /*yield*/, S.wait(2)];
                    case 6:
                        _a.sent();
                        global.theater.addWorldObject(new SpriteText({ x: global.gameWidth / 2, y: 232, text: 'Andrew Murray             Playtesting', anchor: Vector2.TOP_CENTER, layer: Theater.LAYER_SLIDES }));
                        return [4 /*yield*/, S.wait(2)];
                    case 7:
                        _a.sent();
                        global.theater.addWorldObject(new SpriteText({ x: global.gameWidth / 2, y: 272, text: 'Thanks for Playing!', anchor: Vector2.TOP_CENTER, layer: Theater.LAYER_SLIDES }));
                        _a.label = 8;
                    case 8:
                        if (!true) return [3 /*break*/, 10];
                        return [4 /*yield*/];
                    case 9:
                        _a.sent();
                        return [3 /*break*/, 8];
                    case 10: return [2 /*return*/];
                }
            });
        },
        transitions: []
    }
};
/// <reference path="./menus.ts"/>
/// <reference path="./stages.ts"/>
/// <reference path="./storyboard.ts"/>
Main.loadConfig({
    gameCodeName: "mirigram",
    gameWidth: 400,
    gameHeight: 320,
    canvasScale: 2,
    backgroundColor: 0x000000,
    fpsLimit: 30,
    preloadBackgroundColor: 0x000000,
    preloadProgressBarColor: 0xFFFFFF,
    textures: Assets.textures,
    sounds: Assets.sounds,
    tilesets: Assets.tilesets,
    pyxelTilemaps: Assets.pyxelTilemaps,
    spriteTextTags: Assets.spriteTextTags,
    defaultZBehavior: 'noop',
    defaultSpriteTextFont: Assets.fonts.ANDRFW,
    defaultOptions: {
        volume: 0.5,
        controls: {
            // General
            'fullscreen': ['f'],
            // Game
            'left': ['ArrowLeft'],
            'right': ['ArrowRight'],
            'up': ['ArrowUp'],
            'down': ['ArrowDown'],
            'jump': ['z'],
            'interact': ['x'],
            // Presets
            'game_advanceCutscene': ['x', 'z'],
            'game_pause': [],
            'game_closeMenu': ['Escape', 'Backspace'],
            'game_select': ['MouseLeft'],
            'debug_moveCameraUp': ['i'],
            'debug_moveCameraDown': ['k'],
            'debug_moveCameraLeft': ['j'],
            'debug_moveCameraRight': ['l'],
            'debug_recordMetrics': ['0'],
            'debug_showMetricsMenu': ['9'],
            'debug_toggleOverlay': ['o'],
            'debug_frameSkipStep': ['1'],
            'debug_frameSkipRun': ['2'],
            // Debug
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
            'rmb': ['MouseRight'],
        }
    },
    game: {
        entryPointMenuClass: MainMenu,
        pauseMenuClass: PauseMenu,
        theaterConfig: {
            stages: stages,
            stageToLoad: 'game',
            stageEntryPoint: 'main',
            story: {
                storyboard: storyboard,
                storyboardPath: ['start'],
                storyEvents: {},
            },
            dialogBox: function () { return new DialogBox({
                x: 200, y: 280,
                texture: 'dialogbox',
                dialogFont: Assets.fonts.ANDRFW,
                textAreaFull: { x: -186, y: -30, width: 372, height: 64 },
                textAreaPortrait: { x: -70, y: -42, width: 140, height: 84 },
                portraitPosition: { x: 78, y: 0 },
                //startSound: 'click',
                speakSound: 'dialogspeak',
                nameProps: {
                    texture: 'dialogbox_name',
                    position: { x: -150, y: -40 },
                    textOffset: { x: 0, y: -2 },
                }
            }); },
        },
    },
    debug: {
        debug: false,
        font: Assets.fonts.ANDRFW,
        fontStyle: { color: 0xFFFFFF },
        allPhysicsBounds: false,
        moveCameraWithArrows: true,
        showOverlay: true,
        overlayFeeds: [
            function (world) {
                var cc = world.select.type(CameraController, false);
                if (!cc)
                    return '';
                return "sec: " + cc.sector.x + " " + cc.sector.y;
            },
        ],
        skipRate: 1,
        programmaticInput: false,
        autoplay: true,
        skipMainMenu: true,
        frameStepEnabled: false,
        resetOptionsAtStart: true,
        experiments: {},
    },
});
var Note = /** @class */ (function (_super) {
    __extends(Note, _super);
    function Note(x, y) {
        var _this = _super.call(this, {
            name: 'note',
            x: x, y: y,
            texture: 'note',
            layer: 'bg',
        }) || this;
        _this.addChild(new CutsceneInteractable(0, 0, 'i_note'));
        return _this;
    }
    return Note;
}(Sprite));
var Orb = /** @class */ (function (_super) {
    __extends(Orb, _super);
    function Orb(x, y, name, scale, layer) {
        var _this = _super.call(this, {
            name: name,
            x: x, y: y,
            texture: 'orb',
            layer: layer,
            scaleX: scale,
            scaleY: scale,
        }) || this;
        _this.shaking = false;
        _this.twitchTimer = new Timer(0.2, function () { return _this.angle = Random.int(0, 3) * 90; }, true);
        return _this;
    }
    Orb.prototype.update = function () {
        _super.prototype.update.call(this);
        this.twitchTimer.update(this.delta);
        if (this.shaking) {
            this.offsetX = Random.int(-5, 5) * (1 - this.scaleX);
            this.offsetY = Random.int(-5, 5) * (1 - this.scaleY);
        }
    };
    return Orb;
}(Sprite));
var Player = /** @class */ (function (_super) {
    __extends(Player, _super);
    function Player(x, y) {
        var _this = _super.call(this, {
            x: x, y: y,
            animations: [
                Animations.fromTextureList({ name: 'idle', texturePrefix: 'mirigram', textures: [0, 1], frameRate: 2, count: Infinity }),
                Animations.fromTextureList({ name: 'run', texturePrefix: 'mirigram', textures: [4, 5], frameRate: 4, count: Infinity, overrides: {
                        0: { callback: function () { return _this.world.playSound('walk'); } },
                        1: { callback: function () { return _this.world.playSound('walk'); } },
                    } }),
                Animations.fromTextureList({ name: 'jump', texturePrefix: 'mirigram', textures: [8], frameRate: 1, count: Infinity }),
                Animations.fromTextureList({ name: 'fall', texturePrefix: 'mirigram', textures: [9], frameRate: 1, count: Infinity }),
                Animations.fromTextureList({ name: 'spin', textures: ['spin'], frameRate: 1, count: Infinity }),
                Animations.fromTextureList({ name: 'laying', texturePrefix: 'mirigram', textures: [11], frameRate: 1, count: Infinity }),
                Animations.fromTextureList({ name: 'grab', texturePrefix: 'mirigram', textures: [12, 12, 12, 12, 12, 13, 12, 13, 12, 13, 12, 13], frameRate: 4, count: 1, oneOff: true, overrides: {
                        5: { callback: function () { return _this.world.playSound('land'); } },
                        6: { callback: function () { return _this.world.playSound('land').volume = 0.5; } },
                        7: { callback: function () { return _this.world.playSound('land'); } },
                        8: { callback: function () { return _this.world.playSound('land').volume = 0.5; } },
                        9: { callback: function () { return _this.world.playSound('land'); } },
                        10: { callback: function () { return _this.world.playSound('land').volume = 0.5; } },
                        11: { callback: function () { return _this.world.playSound('land'); } },
                    } }),
                Animations.fromTextureList({ name: 'hold', texturePrefix: 'mirigram', textures: [14], frameRate: 1, count: Infinity, oneOff: true }),
                Animations.fromTextureList({ name: 'slam', texturePrefix: 'mirigram', textures: [15], frameRate: 1, count: Infinity, oneOff: true }),
            ],
            defaultAnimation: 'idle',
            layer: 'player',
            physicsGroup: 'player',
            bounds: new RectBounds(-8, -24, 16, 24),
        }) || this;
        _this.MAX_SPEED = 150;
        _this.JUMP_FORCE = 440;
        _this.GRAVITY_NORMAL = 800;
        _this.GRAVITY_SPIN = 400;
        _this.lastGrounded = true;
        _this.midjump = false;
        _this.spinning = false;
        _this.laying = false;
        _this.vylimit = Infinity;
        _this.behavior = new ControllerBehavior(function () {
            this.controller.left = Input.isDown('left');
            this.controller.right = Input.isDown('right');
            this.controller.jump = Input.justDown('jump');
            this.controller.keys.holdingJump = Input.isDown('jump');
            this.controller.interact = Input.justDown('interact');
        });
        return _this;
    }
    Player.prototype.update = function () {
        var haxis = (this.controller.left ? -1 : 0) + (this.controller.right ? 1 : 0);
        var grounded = this.isGrounded();
        this.v.x = haxis * this.MAX_SPEED;
        if (grounded) {
            if (!this.lastGrounded)
                this.world.playSound('land');
            this.midjump = false;
        }
        if (this.controller.jump && grounded) {
            this.v.y = -this.JUMP_FORCE;
            this.midjump = true;
            this.world.playSound('jump');
        }
        if (this.midjump && this.v.y < 0 && !this.controller.keys.holdingJump) {
            this.v.y /= 2;
            this.midjump = false;
        }
        if (this.spinning) {
            this.angle += 720 * this.delta;
            if (grounded) {
                this.spinning = false;
                this.laying = true;
                this.angle = 0;
            }
        }
        if (this.laying && haxis !== 0) {
            this.laying = false;
        }
        this.gravity.y = this.spinning ? this.GRAVITY_SPIN : this.GRAVITY_NORMAL;
        if (this.v.y > this.vylimit) {
            this.v.y = this.vylimit;
        }
        _super.prototype.update.call(this);
        this.updateInteract(grounded);
        this.updateAnimation(haxis, grounded);
        this.updateOrb();
        this.lastGrounded = grounded;
    };
    Player.prototype.isControlRevoked = function () {
        if (this.spinning)
            return true;
        return _super.prototype.isControlRevoked.call(this);
    };
    Player.prototype.updateInteract = function (grounded) {
        var _this = this;
        if (grounded) {
            var interactables = this.world
                .select.typeAll(Interactable)
                .filter(function (i) { return i.isVisible() && _this.bounds.isOverlapping(i.bounds); });
            this.closestInteractable = M.argmin(interactables, function (i) { return G.distance(_this, i); });
        }
        else {
            this.closestInteractable = undefined;
        }
        if (this.controller.interact && this.closestInteractable) {
            this.controller.interact = false;
            this.closestInteractable.interact();
        }
    };
    Player.prototype.updateAnimation = function (haxis, grounded) {
        if (haxis < 0) {
            this.flipX = true;
        }
        else if (haxis > 0) {
            this.flipX = false;
        }
        var vscale = M.clamp(this.v.y / this.JUMP_FORCE, -1, 1);
        if (vscale < 0)
            vscale *= 2;
        this.scaleX = 1 + 0.2 * vscale;
        if (this.spinning) {
            this.playAnimation('spin');
        }
        else if (this.laying) {
            this.playAnimation('laying');
        }
        else if (!grounded) {
            if (this.v.y < 0) {
                this.playAnimation('jump');
            }
            else {
                this.playAnimation('fall');
            }
        }
        else if (haxis === 0) {
            this.playAnimation('idle');
        }
        else {
            this.playAnimation('run');
        }
    };
    Player.prototype.updateOrb = function () {
        if (this.isControlRevoked())
            return;
        if (global.world.select.name('orb3_final').isVisible())
            return;
        var cc = this.world.select.type(CameraController);
        if (cc.sector.x === 8 && cc.sector.y === 3 && this.x > 3808) {
            global.theater.storyManager.cutsceneManager.playCutscene('collect_orb');
        }
    };
    Player.prototype.isGrounded = function () {
        this.bounds.y++;
        var ground = this.world.select.overlap(this.bounds, ['walls']);
        this.bounds.y--;
        return !_.isEmpty(ground);
    };
    return Player;
}(Sprite));
var PressX = /** @class */ (function (_super) {
    __extends(PressX, _super);
    function PressX(player) {
        var _this = _super.call(this, {
            texture: 'pressx',
            layer: 'pressx',
            visible: false,
        }) || this;
        _this.player = player;
        _this.currentTextureKey = 'pressx';
        return _this;
    }
    PressX.prototype.update = function () {
        _super.prototype.update.call(this);
        if (this.player.closestInteractable && !global.theater.isCutscenePlaying) {
            this.teleport(this.player.closestInteractable.x, this.player.closestInteractable.y - 40);
            this.setVisible(true);
            if (this.player.closestInteractable.pressTexture !== this.currentTextureKey) {
                this.setTexture(this.player.closestInteractable.pressTexture);
                this.currentTextureKey = this.player.closestInteractable.pressTexture;
            }
        }
        else {
            this.setVisible(false);
        }
    };
    return PressX;
}(Sprite));
var Scammir = /** @class */ (function (_super) {
    __extends(Scammir, _super);
    function Scammir(x, y) {
        return _super.call(this, {
            name: 'scammir',
            x: x, y: y,
            animations: [
                Animations.fromTextureList({ name: 'idle', texturePrefix: 'scammir', textures: [0, 1], frameRate: 2.5, count: Infinity }),
            ],
            defaultAnimation: 'idle',
            layer: 'main',
            physicsGroup: 'npcs',
            bounds: new RectBounds(-12, -4, 24, 24),
            gravityy: 400,
        }) || this;
    }
    return Scammir;
}(Sprite));
var TransitionScripts;
(function (TransitionScripts) {
    var startFallingTime = undefined;
    function executeTransition(world, oldSector, newSector) {
        var _a;
        var player = world.select.type(Player);
        if (oldSector.x === 0 && oldSector.y === 0 && newSector.x === -1 && newSector.y === 0) {
            global.theater.playMusic('house', 0.5);
            return false;
        }
        if (oldSector.x === -1 && oldSector.y === 0 && newSector.x === 0 && newSector.y === 0) {
            global.theater.stopMusic(0.5);
            return false;
        }
        if (oldSector.x === 4 && oldSector.y === 0 && newSector.x === 4 && newSector.y === 1) {
            player.spinning = true;
            return false;
        }
        if (oldSector.x === 4 && oldSector.y === 1 && newSector.x === 4 && newSector.y > 1) {
            if (startFallingTime === undefined) {
                startFallingTime = world.time;
            }
            if (world.time > startFallingTime + 5) {
                player.v.y = Math.min(player.v.y, 800);
                player.vylimit = Infinity;
                global.theater.storyManager.cutsceneManager.playCutscene('intro_undermine');
                return false;
            }
            player.teleport(player.x, player.y - world.height * (newSector.y - oldSector.y));
            return true;
        }
        if (oldSector.x === 6 && oldSector.y === 1 && newSector.x === 6 && newSector.y === 2) {
            player.teleport(player.x + 2 * world.width, player.y);
            return true;
        }
        if (oldSector.x === 8 && oldSector.y === 2 && newSector.x === 7 && newSector.y === 2) {
            player.teleport(player.x - 2 * world.width, player.y);
            return true;
        }
        if (oldSector.x === 8 && oldSector.y === 2 && newSector.x === 9 && newSector.y === 2) {
            if (player.y > 777) { // Lucky??
                player.teleport(player.x - 2 * world.width, player.y);
                return true;
            }
        }
        if (oldSector.x === 6 && oldSector.y === 4 && newSector.x === 6 && newSector.y === 5) {
            player.spinning = true;
            player.vylimit = 400;
            return false;
        }
        if (oldSector.x === 6 && oldSector.y === 5 && newSector.x === 6 && newSector.y === 6) {
            global.theater.stopMusic(0.3);
            return false;
        }
        if (oldSector.x === 6 && oldSector.y === 6 && newSector.x === 6 && newSector.y > 6) {
            // :)
            player.teleport(2215, -318);
            hasFallen = true;
            (_a = global.world.select.name('scammir', false)) === null || _a === void 0 ? void 0 : _a.removeFromWorld();
            var movabledoor = global.world.select.name('movabledoor');
            movabledoor.setVisible(true);
            movabledoor.physicsGroup = 'walls';
            global.world.select.name('note').setVisible(true);
            return true;
        }
        if (oldSector.x === 7 && oldSector.y === 3 && newSector.x === 8 && newSector.y === 3) {
            global.theater.stopMusic(0.5);
            return false;
        }
        if (oldSector.x === 8 && oldSector.y === 3 && newSector.x === 7 && newSector.y === 3) {
            global.theater.playMusic('caverns', 0.5);
            return false;
        }
        if (oldSector.x === 4 && oldSector.y === 3 && newSector.x === -1 && newSector.y === 4) {
            global.theater.stopMusic(0.5);
            return false;
        }
        return false;
    }
    TransitionScripts.executeTransition = executeTransition;
})(TransitionScripts || (TransitionScripts = {}));
var Tutorial = /** @class */ (function (_super) {
    __extends(Tutorial, _super);
    function Tutorial(x, y, sectorx, sectory, text) {
        var _this = _super.call(this, {
            x: x, y: y, text: text,
            style: { alpha: 0 },
            anchor: Vector2.TOP_CENTER,
        }) || this;
        _this.sectorx = sectorx;
        _this.sectory = sectory;
        return _this;
    }
    Tutorial.prototype.update = function () {
        _super.prototype.update.call(this);
        var visible = true;
        var cc = global.world.select.type(CameraController);
        if (cc.sector.x !== this.sectorx || cc.sector.y !== this.sectory) {
            visible = false;
        }
        if (visible) {
            this.style.alpha = Math.min(this.style.alpha + 2 * this.delta, 1);
        }
        else {
            this.style.alpha = 0;
        }
    };
    return Tutorial;
}(SpriteText));
var WallFilter = /** @class */ (function (_super) {
    __extends(WallFilter, _super);
    function WallFilter() {
        return _super.call(this, {
            uniforms: {
                'float camx': 0,
                'float camy': 0,
                'float camox': 0,
                'float camoy': 0,
            },
            code: "\n                float n = cnoise(vec3((camx + camox + x)/8.0, (camy + camoy + y)/8.0, 0.0));\n                if (n >= 0.0) {\n                    vec4 gcxp = getColor(x + 1.0, y);\n                    vec4 gcxn = getColor(x - 1.0, y);\n                    vec4 gcyp = getColor(x, y + 1.0);\n                    vec4 gcyn = getColor(x, y - 1.0);\n                    if (gcxp.a > 0.0) {\n                        outp = gcxp;\n                    } else if (gcxn.a > 0.0) {\n                        outp = gcxn;\n                    } else if (gcyp.a > 0.0) {\n                        outp = gcyp;\n                    } else if (gcyn.a > 0.0) {\n                        outp = gcyn;\n                    }\n                }\n            ",
        }) || this;
    }
    WallFilter.prototype.update = function () {
        var cc = global.world.select.type(CameraController, false);
        if (!cc)
            return;
        this.setUniform('camx', cc.sector.x * global.gameWidth);
        this.setUniform('camy', cc.sector.y * global.gameHeight);
        this.setUniform('camox', global.world.camera.worldOffsetX - global.world.camera.x);
        this.setUniform('camoy', global.world.camera.worldOffsetY - global.world.camera.y);
    };
    return WallFilter;
}(TextureFilter));
