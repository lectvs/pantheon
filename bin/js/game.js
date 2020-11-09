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
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var Point = PIXI.Point;
var Rectangle = PIXI.Rectangle;
function pt(x, y) {
    return { x: x, y: y };
}
function rect(x, y, width, height) {
    return { x: x, y: y, width: width, height: height };
}
var Anchor = /** @class */ (function () {
    function Anchor() {
    }
    Object.defineProperty(Anchor, "TOP_LEFT", {
        get: function () { return { x: 0, y: 0 }; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Anchor, "TOP_CENTER", {
        get: function () { return { x: 0.5, y: 0 }; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Anchor, "TOP_RIGHT", {
        get: function () { return { x: 1, y: 0 }; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Anchor, "CENTER_LEFT", {
        get: function () { return { x: 0, y: 0.5 }; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Anchor, "CENTER_CENTER", {
        get: function () { return { x: 0.5, y: 0.5 }; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Anchor, "CENTER_RIGHT", {
        get: function () { return { x: 1, y: 0.5 }; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Anchor, "BOTTOM_LEFT", {
        get: function () { return { x: 0, y: 1 }; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Anchor, "BOTTOM_CENTER", {
        get: function () { return { x: 0.5, y: 1 }; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Anchor, "BOTTOM_RIGHT", {
        get: function () { return { x: 1, y: 1 }; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Anchor, "TOP", {
        get: function () { return this.TOP_CENTER; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Anchor, "CENTER", {
        get: function () { return this.CENTER_CENTER; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Anchor, "BOTTOM", {
        get: function () { return this.BOTTOM_CENTER; },
        enumerable: false,
        configurable: true
    });
    return Anchor;
}());
var Direction2D = /** @class */ (function () {
    function Direction2D() {
    }
    Object.defineProperty(Direction2D, "UP", {
        get: function () { return Direction.TOP_CENTER; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Direction2D, "DOWN", {
        get: function () { return Direction.BOTTOM_CENTER; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Direction2D, "LEFT", {
        get: function () { return Direction.CENTER_LEFT; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Direction2D, "RIGHT", {
        get: function () { return Direction.CENTER_RIGHT; },
        enumerable: false,
        configurable: true
    });
    return Direction2D;
}());
var Direction = /** @class */ (function () {
    function Direction() {
    }
    Object.defineProperty(Direction, "TOP", {
        get: function () { return -1; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Direction, "CENTER", {
        get: function () { return 0; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Direction, "BOTTOM", {
        get: function () { return 1; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Direction, "LEFT", {
        get: function () { return -1; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Direction, "RIGHT", {
        get: function () { return 1; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Direction, "UP", {
        get: function () { return -1; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Direction, "DOWN", {
        get: function () { return 1; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Direction, "NONE", {
        get: function () { return 0; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Direction, "TOP_LEFT", {
        get: function () { return { v: Direction.TOP, h: Direction.LEFT }; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Direction, "TOP_CENTER", {
        get: function () { return { v: Direction.TOP, h: Direction.CENTER }; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Direction, "TOP_RIGHT", {
        get: function () { return { v: Direction.TOP, h: Direction.RIGHT }; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Direction, "CENTER_LEFT", {
        get: function () { return { v: Direction.CENTER, h: Direction.LEFT }; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Direction, "CENTER_CENTER", {
        get: function () { return { v: Direction.CENTER, h: Direction.CENTER }; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Direction, "CENTER_RIGHT", {
        get: function () { return { v: Direction.CENTER, h: Direction.RIGHT }; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Direction, "BOTTOM_LEFT", {
        get: function () { return { v: Direction.BOTTOM, h: Direction.LEFT }; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Direction, "BOTTOM_CENTER", {
        get: function () { return { v: Direction.BOTTOM, h: Direction.CENTER }; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Direction, "BOTTOM_RIGHT", {
        get: function () { return { v: Direction.BOTTOM, h: Direction.RIGHT }; },
        enumerable: false,
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
            return { buffer: new AudioBuffer({ length: 0, sampleRate: 8000 }), volume: 1 };
        }
        return this.sounds[key];
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
    AssetCache.tilemaps = {};
    return AssetCache;
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
        this.isShowingOverlay = true;
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
            error("Tried to start recording " + name + " when recording " + this.currentRecording.name + " was already started.");
            return;
        }
        this.startSpan(recordingName, true);
    };
    Metrics.prototype.endRecording = function () {
        if (!this.isRecording) {
            error("Tried to end recording " + name + " but no recording was happening.");
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
            //metrics: {},
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
        //this.currentSpan.metrics[metric] = value;
        error("Metrics have not been implemented yet! Uncomment the lines in metrics.ts");
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
        get: function () { return this.theater ? this.theater.currentWorld : undefined; },
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
    Input.getEventKey = function () {
        return this.eventKey;
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
            return { x: this.mouseX, y: this.mouseY };
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
            return { x: this.canvasMouseX, y: this.canvasMouseY };
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
        this.eventKey = event.key;
        if (this.isDownByKeyCode[event.key] !== undefined) {
            this.isDownByKeyCode[event.key] = true;
            event.preventDefault();
        }
    };
    Input.handleKeyUpEvent = function (event) {
        if (this.eventKey === event.key)
            this.eventKey = undefined;
        if (this.isDownByKeyCode[event.key] !== undefined) {
            this.isDownByKeyCode[event.key] = false;
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
    Input.GAME_ADVANCE_DIALOG = 'game_advanceDialog';
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
    Perlin.SHADER_SOURCE = "\n        vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}\n        vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}\n        vec3 fade(vec3 t) {return t*t*t*(t*(t*6.0-15.0)+10.0);}\n\n        float cnoise(vec3 P){\n            vec3 Pi0 = floor(P); // Integer part for indexing\n            vec3 Pi1 = Pi0 + vec3(1.0); // Integer part + 1\n            Pi0 = mod(Pi0, 289.0);\n            Pi1 = mod(Pi1, 289.0);\n            vec3 Pf0 = fract(P); // Fractional part for interpolation\n            vec3 Pf1 = Pf0 - vec3(1.0); // Fractional part - 1.0\n            vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);\n            vec4 iy = vec4(Pi0.yy, Pi1.yy);\n            vec4 iz0 = Pi0.zzzz;\n            vec4 iz1 = Pi1.zzzz;\n\n            vec4 ixy = permute(permute(ix) + iy);\n            vec4 ixy0 = permute(ixy + iz0);\n            vec4 ixy1 = permute(ixy + iz1);\n\n            vec4 gx0 = ixy0 / 7.0;\n            vec4 gy0 = fract(floor(gx0) / 7.0) - 0.5;\n            gx0 = fract(gx0);\n            vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);\n            vec4 sz0 = step(gz0, vec4(0.0));\n            gx0 -= sz0 * (step(0.0, gx0) - 0.5);\n            gy0 -= sz0 * (step(0.0, gy0) - 0.5);\n\n            vec4 gx1 = ixy1 / 7.0;\n            vec4 gy1 = fract(floor(gx1) / 7.0) - 0.5;\n            gx1 = fract(gx1);\n            vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);\n            vec4 sz1 = step(gz1, vec4(0.0));\n            gx1 -= sz1 * (step(0.0, gx1) - 0.5);\n            gy1 -= sz1 * (step(0.0, gy1) - 0.5);\n\n            vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);\n            vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);\n            vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);\n            vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);\n            vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);\n            vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);\n            vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);\n            vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);\n\n            vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));\n            g000 *= norm0.x;\n            g010 *= norm0.y;\n            g100 *= norm0.z;\n            g110 *= norm0.w;\n            vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));\n            g001 *= norm1.x;\n            g011 *= norm1.y;\n            g101 *= norm1.z;\n            g111 *= norm1.w;\n\n            float n000 = dot(g000, Pf0);\n            float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));\n            float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));\n            float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));\n            float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));\n            float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));\n            float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));\n            float n111 = dot(g111, Pf1);\n\n            vec3 fade_xyz = fade(Pf0);\n            vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);\n            vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);\n            float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x); \n            return 2.2 * n_xyz;\n        }\n    ";
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
        var angle = M.degToRad((_c = properties.angle) !== null && _c !== void 0 ? _c : 0);
        var width = this.width * scaleX;
        var height = this.height * scaleY;
        if (angle === 0) {
            return rect(0, 0, width, height);
        }
        var v1x = 0;
        var v1y = 0;
        var v2x = width * Math.cos(angle);
        var v2y = width * Math.sin(angle);
        var v3x = -height * Math.sin(angle);
        var v3y = height * Math.cos(angle);
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
            var sliceFilter = BasicTexture.SLICE_FILTER(properties.slice);
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
        this.renderTextureSprite.filters = allFilters.map(function (filter) { return filter.borrowPixiFilter(); });
        this.renderTextureSprite.filterArea = new PIXI.Rectangle(0, 0, destTexture.width, destTexture.height);
        return allFilters;
    };
    return BasicTexture;
}());
(function (BasicTexture) {
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
    BasicTexture.SLICE_FILTER = SLICE_FILTER;
})(BasicTexture || (BasicTexture = {}));
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
        PIXI.Loader.shared.add(key, url, undefined, function () { return _this.onLoadResource(resource); });
    };
    Preload.loadTexture = function (key, texture) {
        var _a;
        var baseTexture = PIXI.utils.TextureCache[key];
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
        var _a;
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
        AssetCache.sounds[key] = {
            buffer: preloadedSound.buffer,
            volume: volume
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
            tileset: tilemap.tileset,
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
            tilemapForCache.layers.push(tilemapLayer);
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
        window.addEventListener("keypress", function (event) {
            WebAudio.start();
        });
        window.addEventListener("keydown", function (event) {
            WebAudio.start();
            Input.handleKeyDownEvent(event);
            if (event.key == 'Tab') {
                event.preventDefault();
            }
        }, false);
        window.addEventListener("keyup", function (event) {
            WebAudio.start();
            Input.handleKeyUpEvent(event);
        }, false);
        window.addEventListener("mousedown", function (event) {
            WebAudio.start();
            Input.handleMouseDownEvent(event);
        }, false);
        window.addEventListener("mouseup", function (event) {
            WebAudio.start();
            Input.handleMouseUpEvent(event);
        }, false);
        window.addEventListener("contextmenu", function (event) {
            WebAudio.start();
            event.preventDefault();
        }, false);
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
            Main.delta = frameDelta / 60;
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
        localStorage.setItem(this.getOptionsLocalStorageName(), JSON.stringify(this.options));
        this.onUpdate();
    };
    Options.loadOptions = function () {
        this.options = JSON.parse(localStorage.getItem(this.getOptionsLocalStorageName()));
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
            error("Cannot play cutscene " + name + " because a cutscene is already playing:", this.current);
            return;
        }
        this.current = {
            name: name,
            script: new Script(this.toScript(cutscene.script))
        };
        this.updateCurrentCutscene();
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
        if (duration === void 0) { duration = 0; }
        if (tint === void 0) { tint = 0x000000; }
        return showSlide(function () {
            var slide = new Slide({ timeToLoad: duration, fadeIn: true });
            slide.setTexture(Texture.filledRect(global.gameWidth, global.gameHeight, tint));
            return slide;
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
                        start = sprite.offsetY;
                        groundDelta = landOnGround ? -start : 0;
                        timer = new Timer(time);
                        _a.label = 1;
                    case 1:
                        if (!!timer.done) return [3 /*break*/, 3];
                        sprite.offsetY = M.jumpParabola(start, -peakDelta, groundDelta, timer.progress);
                        timer.update(global.script.delta);
                        return [4 /*yield*/];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 1];
                    case 3:
                        sprite.offsetY = start + groundDelta;
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
        Debug.FONT = config.font;
        Debug.FONT_STYLE = config.fontStyle;
        Debug.ALL_PHYSICS_BOUNDS = config.allPhysicsBounds;
        Debug.MOVE_CAMERA_WITH_ARROWS = config.moveCameraWithArrows;
        Debug.SHOW_OVERLAY = config.showOverlay;
        Debug.OVERLAY_FEEDS = config.overlayFeeds;
        Debug.SKIP_RATE = config.skipRate;
        Debug.PROGRAMMATIC_INPUT = config.programmaticInput;
        Debug.AUTOPLAY = config.autoplay;
        Debug.SKIP_MAIN_MENU = config.skipMainMenu;
        Debug.FRAME_STEP_ENABLED = config.frameStepEnabled;
        Debug.FRAME_STEP_STEP_KEY = config.frameStepStepKey;
        Debug.FRAME_STEP_RUN_KEY = config.frameStepRunKey;
        Debug.RESET_OPTIONS_AT_START = config.resetOptionsAtStart;
        Debug.EXPERIMENTS = config.experiments;
    };
    Debug.update = function () {
        for (var experiment in Debug.EXPERIMENTS) {
            Debug.EXPERIMENTS[experiment].update();
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
    Object.defineProperty(Debug, "SHOW_OVERLAY", {
        get: function () { return this.DEBUG && this._SHOW_OVERLAY; },
        set: function (value) { this._SHOW_OVERLAY = value; },
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
        return this.FRAME_STEP_ENABLED && !(Input.justDown(this.FRAME_STEP_STEP_KEY) || Input.isDown(this.FRAME_STEP_RUN_KEY));
    };
    Object.defineProperty(Debug, "RESET_OPTIONS_AT_START", {
        get: function () { return this.DEBUG && this._RESET_OPTIONS_AT_START; },
        set: function (value) { this._RESET_OPTIONS_AT_START = value; },
        enumerable: false,
        configurable: true
    });
    return Debug;
}());
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
     * Random point uniformly in a disc.
     */
    RandomNumberGenerator.prototype.inDisc = function (radiusSmall, radiusLarge) {
        var angle = this.float(0, 2 * Math.PI);
        var r = radiusLarge * Math.sqrt(this.float(radiusSmall / radiusLarge, 1));
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
        this.visible = (_d = config.visible) !== null && _d !== void 0 ? _d : true;
        this.active = (_e = config.active) !== null && _e !== void 0 ? _e : true;
        this.life = new Timer((_f = config.life) !== null && _f !== void 0 ? _f : Infinity, function () { return _this.kill(); });
        this.zBehavior = (_g = config.zBehavior) !== null && _g !== void 0 ? _g : WorldObject.DEFAULT_Z_BEHAVIOR;
        this.timeScale = (_h = config.timeScale) !== null && _h !== void 0 ? _h : 1;
        this.data = config.data ? O.deepClone(config.data) : {};
        this.ignoreCamera = (_j = config.ignoreCamera) !== null && _j !== void 0 ? _j : false;
        this.matchParentLayer = (_k = config.matchParentLayer) !== null && _k !== void 0 ? _k : false;
        this.matchParentPhysicsGroup = (_l = config.matchParentPhysicsGroup) !== null && _l !== void 0 ? _l : false;
        this.alive = true;
        this.lastx = this.x;
        this.lasty = this.y;
        this.lastz = this.z;
        this.controllable = (_m = config.controllable) !== null && _m !== void 0 ? _m : false;
        this.controller = {};
        this.controllerSchema = {};
        this.uid = WorldObject.UID.generate();
        this._world = null;
        this._children = [];
        this._parent = null;
        this.internalSetNameWorldObject(config.name);
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
    Object.defineProperty(WorldObject.prototype, "name", {
        get: function () { return this._name; },
        set: function (value) { World.Actions.setName(this, value); },
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
    Object.defineProperty(WorldObject.prototype, "isControlled", {
        get: function () { return this.controllable && !global.theater.isCutscenePlaying; },
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
            this.onAddCallback(this);
    };
    WorldObject.prototype.onRemove = function () {
        if (this.onRemoveCallback)
            this.onRemoveCallback(this);
    };
    WorldObject.prototype.preUpdate = function () {
        this.lastx = this.x;
        this.lasty = this.y;
        this.lastz = this.z;
        if (this.isControlled) {
            this.updateControllerFromSchema();
        }
    };
    WorldObject.prototype.update = function () {
        this.updateScriptManager();
        this.updateStateMachine();
        if (this.debugFollowMouse) {
            this.x = this.world.getWorldMouseX();
            this.y = this.world.getWorldMouseY();
        }
        if (this.updateCallback)
            this.updateCallback(this);
        this.life.update(this.delta);
        if (this.parent && this.ignoreCamera) {
            debug("Warning: ignoraCamera is set to true on a child object. This will be ignored!");
        }
    };
    WorldObject.prototype.updateScriptManager = function () {
        this.scriptManager.update(this.delta);
    };
    WorldObject.prototype.updateStateMachine = function () {
        this.stateMachine.update(this.delta);
    };
    WorldObject.prototype.postUpdate = function () {
        this.resetController();
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
        if (this.renderCallback)
            this.renderCallback(this, texture, x, y);
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
    WorldObject.prototype.getChildByIndex = function (index) {
        if (this.children.length < index) {
            error("Parent has no child at index " + index + ":", this);
            return undefined;
        }
        return this.children[index];
    };
    WorldObject.prototype.getChildByName = function (name) {
        var e_5, _a;
        try {
            for (var _b = __values(this.children), _c = _b.next(); !_c.done; _c = _b.next()) {
                var child = _c.value;
                if (child.name === name)
                    return child;
            }
        }
        catch (e_5_1) { e_5 = { error: e_5_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_5) throw e_5.error; }
        }
        error("Cannot find child named " + name + " on parent:", this);
        return undefined;
    };
    WorldObject.prototype.getVisibleScreenBounds = function () {
        return undefined;
    };
    WorldObject.prototype.isOnScreen = function () {
        var bounds = this.getVisibleScreenBounds();
        if (!bounds)
            return true;
        return bounds.x + bounds.width >= 0
            && bounds.x <= this.world.width
            && bounds.y + bounds.height >= 0
            && bounds.y <= this.world.height;
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
    WorldObject.prototype.shouldIgnoreCamera = function () {
        if (this.ignoreCamera)
            return true;
        if (this.parent)
            return this.parent.shouldIgnoreCamera();
        return false;
    };
    WorldObject.prototype.resolveLayer = function () {
        if (this.matchParentLayer && this.parent && this._layer !== this.parent.layer) {
            this._layer = this.parent.layer;
        }
    };
    WorldObject.prototype.resolvePhysicsGroup = function () {
        if (this.matchParentPhysicsGroup && this.parent && this._physicsGroup !== this.parent.physicsGroup) {
            this._physicsGroup = this.parent.physicsGroup;
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
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
        var _this = _super.call(this, config) || this;
        _this._v = pt((_a = config.vx) !== null && _a !== void 0 ? _a : 0, (_b = config.vy) !== null && _b !== void 0 ? _b : 0);
        _this.vz = (_c = config.vz) !== null && _c !== void 0 ? _c : 0;
        _this.mass = (_d = config.mass) !== null && _d !== void 0 ? _d : 1;
        _this._gravity = pt((_e = config.gravityx) !== null && _e !== void 0 ? _e : 0, (_f = config.gravityy) !== null && _f !== void 0 ? _f : 0);
        _this.gravityz = (_g = config.gravityz) !== null && _g !== void 0 ? _g : 0;
        _this.bounce = (_h = config.bounce) !== null && _h !== void 0 ? _h : 1;
        _this.bounds = (_j = config.bounds) !== null && _j !== void 0 ? _j : new NullBounds();
        _this._immovable = (_k = config.immovable) !== null && _k !== void 0 ? _k : false;
        _this.colliding = (_l = config.colliding) !== null && _l !== void 0 ? _l : true;
        _this.simulating = (_m = config.simulating) !== null && _m !== void 0 ? _m : true;
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
            this.drawBounds(texture, x, y);
        }
        _super.prototype.render.call(this, texture, x, y);
    };
    PhysicsWorldObject.prototype.getSpeed = function () {
        return V.magnitude(this.v);
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
    PhysicsWorldObject.prototype.onCollide = function (other) {
    };
    PhysicsWorldObject.prototype.setImmovable = function (immovable) {
        this._immovable = immovable;
    };
    PhysicsWorldObject.prototype.setSpeed = function (speed) {
        V.setMagnitude(this.v, speed);
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
        this.applyGravity();
        this.move();
    };
    PhysicsWorldObject.prototype.drawBounds = function (texture, x, y) {
        Draw.brush.color = 0x00FF00;
        Draw.brush.alpha = 1;
        if (this.bounds instanceof RectBounds) {
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
        var e_6, _a;
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
        catch (e_6_1) { e_6 = { error: e_6_1 }; }
        finally {
            try {
                if (_o && !_o.done && (_a = _m.return)) _a.call(_m);
            }
            finally { if (e_6) throw e_6.error; }
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
    Sprite.prototype.getVisibleScreenBounds = function () {
        var bounds = this.getTextureLocalBounds();
        bounds.x += this.renderScreenX - this.onScreenPadding;
        bounds.y += this.renderScreenY - this.onScreenPadding;
        bounds.width += 2 * this.onScreenPadding;
        bounds.height += 2 * this.onScreenPadding;
        return bounds;
    };
    Sprite.prototype.playAnimation = function (name, startFrame, force) {
        if (startFrame === void 0) { startFrame = 0; }
        if (force === void 0) { force = false; }
        this.animationManager.playAnimation(name, startFrame, force);
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
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
        this.scriptManager = new ScriptManager();
        this.soundManager = new SoundManager();
        this.select = new WorldSelecter(this);
        this.volume = (_a = config.volume) !== null && _a !== void 0 ? _a : 1;
        this.width = (_b = config.width) !== null && _b !== void 0 ? _b : global.gameWidth;
        this.height = (_c = config.height) !== null && _c !== void 0 ? _c : global.gameHeight;
        this.physicsGroups = this.createPhysicsGroups(config.physicsGroups);
        this.collisions = (_d = config.collisions) !== null && _d !== void 0 ? _d : [];
        this.collisionIterations = (_e = config.collisionIterations) !== null && _e !== void 0 ? _e : 1;
        this.useRaycastDisplacementThreshold = (_f = config.useRaycastDisplacementThreshold) !== null && _f !== void 0 ? _f : 1;
        this.worldObjects = [];
        this.worldObjectsByName = {};
        this.layers = this.createLayers(config.layers);
        this.backgroundColor = (_g = config.backgroundColor) !== null && _g !== void 0 ? _g : global.backgroundColor;
        this.backgroundAlpha = (_h = config.backgroundAlpha) !== null && _h !== void 0 ? _h : 1;
        this.screen = new BasicTexture(this.width, this.height);
        this.layerTexture = new BasicTexture(this.width, this.height);
        this.entryPoints = (_j = config.entryPoints) !== null && _j !== void 0 ? _j : {};
        this.camera = new Camera((_k = config.camera) !== null && _k !== void 0 ? _k : {}, this);
    }
    Object.defineProperty(World.prototype, "delta", {
        get: function () { return global.game.delta; },
        enumerable: false,
        configurable: true
    });
    World.prototype.update = function () {
        var e_7, _a, e_8, _b, e_9, _c;
        this.updateScriptManager();
        global.metrics.startSpan('preUpdate');
        try {
            for (var _d = __values(this.worldObjects), _e = _d.next(); !_e.done; _e = _d.next()) {
                var worldObject = _e.value;
                if (worldObject.active) {
                    global.metrics.startSpan(worldObject);
                    worldObject.preUpdate();
                    global.metrics.endSpan(worldObject);
                }
            }
        }
        catch (e_7_1) { e_7 = { error: e_7_1 }; }
        finally {
            try {
                if (_e && !_e.done && (_a = _d.return)) _a.call(_d);
            }
            finally { if (e_7) throw e_7.error; }
        }
        global.metrics.endSpan('preUpdate');
        global.metrics.startSpan('update');
        try {
            for (var _f = __values(this.worldObjects), _g = _f.next(); !_g.done; _g = _f.next()) {
                var worldObject = _g.value;
                if (worldObject.active) {
                    global.metrics.startSpan(worldObject);
                    worldObject.update();
                    global.metrics.endSpan(worldObject);
                }
            }
        }
        catch (e_8_1) { e_8 = { error: e_8_1 }; }
        finally {
            try {
                if (_g && !_g.done && (_b = _f.return)) _b.call(_f);
            }
            finally { if (e_8) throw e_8.error; }
        }
        global.metrics.endSpan('update');
        global.metrics.startSpan('handleCollisions');
        this.handleCollisions();
        global.metrics.endSpan('handleCollisions');
        global.metrics.startSpan('postUpdate');
        try {
            for (var _h = __values(this.worldObjects), _j = _h.next(); !_j.done; _j = _h.next()) {
                var worldObject = _j.value;
                if (worldObject.active) {
                    global.metrics.startSpan(worldObject);
                    worldObject.postUpdate();
                    global.metrics.endSpan(worldObject);
                }
            }
        }
        catch (e_9_1) { e_9 = { error: e_9_1 }; }
        finally {
            try {
                if (_j && !_j.done && (_c = _h.return)) _c.call(_h);
            }
            finally { if (e_9) throw e_9.error; }
        }
        global.metrics.endSpan('postUpdate');
        this.removeDeadWorldObjects();
        this.camera.update(this);
        this.soundManager.volume = this.volume * global.game.volume;
        this.soundManager.update(this.delta);
    };
    World.prototype.updateScriptManager = function () {
        this.scriptManager.update(this.delta);
    };
    World.prototype.render = function (screen) {
        var e_10, _a;
        // Render background color.
        Draw.brush.color = this.backgroundColor;
        Draw.brush.alpha = this.backgroundAlpha;
        Draw.fill(this.screen);
        try {
            for (var _b = __values(this.layers), _c = _b.next(); !_c.done; _c = _b.next()) {
                var layer = _c.value;
                global.metrics.startSpan("layer_" + layer.name);
                this.layerTexture.clear();
                this.renderLayer(layer, this.layerTexture, this.screen);
                global.metrics.endSpan("layer_" + layer.name);
            }
        }
        catch (e_10_1) { e_10 = { error: e_10_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_10) throw e_10.error; }
        }
        global.metrics.startSpan("screen");
        this.screen.renderTo(screen);
        global.metrics.endSpan("screen");
    };
    World.prototype.renderLayer = function (layer, layerTexture, screen) {
        var e_11, _a;
        layer.sort();
        try {
            for (var _b = __values(layer.worldObjects), _c = _b.next(); !_c.done; _c = _b.next()) {
                var worldObject = _c.value;
                if (worldObject.visible && worldObject.isOnScreen()) {
                    global.metrics.startSpan(worldObject);
                    worldObject.render(layerTexture, worldObject.renderScreenX, worldObject.renderScreenY);
                    global.metrics.endSpan(worldObject);
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
        layerTexture.renderTo(screen, {
            filters: layer.effects.getFilterList()
        });
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
        var e_12, _a;
        try {
            for (var _b = __values(this.layers), _c = _b.next(); !_c.done; _c = _b.next()) {
                var layer = _c.value;
                if (layer.name === name)
                    return layer;
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
    World.prototype.getPhysicsGroupByName = function (name) {
        return this.physicsGroups[name];
    };
    World.prototype.getPhysicsGroupsThatCollideWith = function (physicsGroup) {
        var e_13, _a;
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
        catch (e_13_1) { e_13 = { error: e_13_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_13) throw e_13.error; }
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
        return { x: this.getWorldMouseX(), y: this.getWorldMouseY() };
    };
    World.prototype.handleCollisions = function () {
        if (_.isEmpty(this.collisions))
            return;
        Physics.resolveCollisions(this);
    };
    World.prototype.hasWorldObject = function (obj) {
        if (_.isString(obj)) {
            return !_.isEmpty(this.worldObjectsByName[obj]);
        }
        return _.contains(this.worldObjects, obj);
    };
    World.prototype.playSound = function (key) {
        return this.soundManager.playSound(key);
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
        var e_14, _a;
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
        catch (e_14_1) { e_14 = { error: e_14_1 }; }
        finally {
            try {
                if (layers_1_1 && !layers_1_1.done && (_a = layers_1.return)) _a.call(layers_1);
            }
            finally { if (e_14) throw e_14.error; }
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
            if (!(name in this.worldObjectsByName)) {
                this.worldObjectsByName[name] = [];
            }
            this.worldObjectsByName[name].push(obj);
        }
    };
    // For use with World.Actions.setLayer
    World.prototype.internalSetLayerWorld = function (obj, layerName) {
        var e_15, _a;
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
        catch (e_15_1) { e_15 = { error: e_15_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_15) throw e_15.error; }
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
        for (var name_3 in this.worldObjectsByName) {
            A.removeAll(this.worldObjectsByName[name_3], obj);
            if (_.isEmpty(this.worldObjectsByName[name_3])) {
                delete this.worldObjectsByName[name_3];
            }
        }
    };
    World.prototype.removeFromAllLayers = function (obj) {
        var e_16, _a;
        try {
            for (var _b = __values(this.layers), _c = _b.next(); !_c.done; _c = _b.next()) {
                var layer = _c.value;
                A.removeAll(layer.worldObjects, obj);
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
    World.prototype.removeFromAllPhysicsGroups = function (obj) {
        for (var name_4 in this.physicsGroups) {
            A.removeAll(this.physicsGroups[name_4].worldObjects, obj);
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
         * Sets the name of a WorldObject. Returns the new name of the object.
         */
        function setName(obj, name) {
            if (!obj)
                return undefined;
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
        var debugInfo = _this.addWorldObject(new SpriteText({
            name: 'debuginfo',
            x: 0, y: 0,
            font: Debug.FONT,
            style: Debug.FONT_STYLE,
            effects: { outline: { color: 0x000000 } },
        }));
        debugInfo.updateCallback = function (obj) {
            obj.setText(_this.getDebugInfo());
        };
        return _this;
    }
    DebugOverlay.prototype.setCurrentWorldToDebug = function (world) {
        this.currentWorldToDebug = world;
    };
    DebugOverlay.prototype.getDebugInfo = function () {
        var e_17, _a;
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
        catch (e_17_1) { e_17 = { error: e_17_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_17) throw e_17.error; }
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
    Experiment.prototype.update = function () {
        if (Input.justDown(this.toggleKey)) {
            this.enabled = !this.enabled;
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
    function Menu(menuSystem) {
        var _this = _super.call(this) || this;
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
            name: 'graphxy',
            font: Debug.FONT,
            style: { color: 0x00FF00 },
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
        _this.maxWidth = (_d = config.maxWidth) !== null && _d !== void 0 ? _d : 0;
        _this.anchor = (_e = config.anchor) !== null && _e !== void 0 ? _e : Anchor.TOP_LEFT;
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
        var e_18, _a;
        var _b, _c, _d;
        var textWidth = this.getTextWidth();
        var textHeight = this.getTextHeight();
        this.staticTexture = new BasicTexture(textWidth, textHeight);
        try {
            for (var _e = __values(this.chars), _f = _e.next(); !_f.done; _f = _e.next()) {
                var char = _f.value;
                global.metrics.startSpan("char_" + char.char);
                var char_i = SpriteText.charCodes[char.char].y * 10 + SpriteText.charCodes[char.char].x;
                var charTexture = AssetCache.getTexture(this.font.texturePrefix + "_" + char_i);
                charTexture.renderTo(this.staticTexture, {
                    x: char.x,
                    y: char.y + ((_b = char.style.offset) !== null && _b !== void 0 ? _b : this.style.offset),
                    tint: (_c = char.style.color) !== null && _c !== void 0 ? _c : this.style.color,
                    alpha: (_d = char.style.alpha) !== null && _d !== void 0 ? _d : this.style.alpha,
                });
                global.metrics.endSpan("char_" + char.char);
            }
        }
        catch (e_18_1) { e_18 = { error: e_18_1 }; }
        finally {
            try {
                if (_f && !_f.done && (_a = _e.return)) _a.call(_e);
            }
            finally { if (e_18) throw e_18.error; }
        }
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
    SpriteText.prototype.pushChar = function (char) {
        this.chars.push(char);
        this.dirty = true;
        // Set text to undefined so any text update will not short-circuit.
        this.currentText = undefined;
    };
    SpriteText.prototype.setMaxWidth = function (maxWidth) {
        this.maxWidth = maxWidth;
        this.dirty = true;
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
        var e_19, _a;
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
        catch (e_19_1) { e_19 = { error: e_19_1 }; }
        finally {
            try {
                if (controlBindings_1_1 && !controlBindings_1_1.done && (_a = controlBindings_1.return)) _a.call(controlBindings_1);
            }
            finally { if (e_19) throw e_19.error; }
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
        var e_20, _a;
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
        catch (e_20_1) { e_20 = { error: e_20_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_20) throw e_20.error; }
        }
        return report;
    }
    MetricsReport.generateTimeReportForSpan = generateTimeReportForSpan;
    function filterReport(report, keyFilter) {
        var e_21, _a;
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
        catch (e_21_1) { e_21 = { error: e_21_1 }; }
        finally {
            try {
                if (keyFilter_1_1 && !keyFilter_1_1.done && (_a = keyFilter_1.return)) _a.call(keyFilter_1);
            }
            finally { if (e_21) throw e_21.error; }
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
            var scriptFunctions_1, scriptFunctions_1_1, scriptFunction, e_22_1;
            var e_22, _a;
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
                        e_22_1 = _b.sent();
                        e_22 = { error: e_22_1 };
                        return [3 /*break*/, 7];
                    case 6:
                        try {
                            if (scriptFunctions_1_1 && !scriptFunctions_1_1.done && (_a = scriptFunctions_1.return)) _a.call(scriptFunctions_1);
                        }
                        finally { if (e_22) throw e_22.error; }
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
var Script = /** @class */ (function () {
    function Script(scriptFunction) {
        this.iterator = scriptFunction();
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
        this.done = true;
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
        var e_23, _a;
        try {
            for (var _b = __values(this.activeSounds), _c = _b.next(); !_c.done; _c = _b.next()) {
                var sound = _c.value;
                sound.markForDisable();
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
    GlobalSoundManager.prototype.postGameUpdate = function () {
        var e_24, _a;
        try {
            for (var _b = __values(this.activeSounds), _c = _b.next(); !_c.done; _c = _b.next()) {
                var sound = _c.value;
                if (sound.isMarkedForDisable) {
                    this.ensureSoundDisabled(sound);
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
        var volume = this.volume * (this.controller ? this.controller.volume : 1);
        if (this.webAudioSound.volume !== volume)
            this.webAudioSound.volume = volume;
        if (this.webAudioSound.speed !== this.speed)
            this.webAudioSound.speed = this.speed;
        if (this.webAudioSound.loop !== this.loop)
            this.webAudioSound.loop = this.loop;
    };
    return Sound;
}());
(function (Sound) {
    Sound.MAX_VOLUME = 2;
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
            this._volume = M.clamp(value, 0, Sound.MAX_VOLUME);
            this.gainNode.gain.value = this._volume * this.asset.volume;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(WebAudioSound.prototype, "speed", {
        get: function () {
            return this.sourceNode ? this.sourceNode.playbackRate.value : this._speed;
        },
        set: function (value) {
            this._speed = value;
            if (this.sourceNode)
                this.sourceNode.playbackRate.value = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(WebAudioSound.prototype, "loop", {
        get: function () { return this.sourceNode ? this.sourceNode.loop : this._loop; },
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
        this.pausedPosition = this.context.currentTime - this.startTime;
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
        var e_25, _a;
        if (anchorX === void 0) { anchorX = 0; }
        if (anchorY === void 0) { anchorY = 0; }
        var result = this.baseTexture.subdivide(h, v);
        try {
            for (var result_1 = __values(result), result_1_1 = result_1.next(); !result_1_1.done; result_1_1 = result_1.next()) {
                var subdivision = result_1_1.value;
                subdivision.texture = AnchoredTexture.fromBaseTexture(subdivision.texture, anchorX, anchorY);
            }
        }
        catch (e_25_1) { e_25 = { error: e_25_1 }; }
        finally {
            try {
                if (result_1_1 && !result_1_1.done && (_a = result_1.return)) _a.call(result_1);
            }
            finally { if (e_25) throw e_25.error; }
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
        var rad = M.degToRad(angle);
        var rotatedAndScaled_ax = (-ax) * Math.cos(rad) - (-ay) * Math.sin(rad);
        return rotatedAndScaled_ax;
    };
    AnchoredTexture.prototype.getAdjustmentY = function (angle, scaleX, scaleY) {
        var ax = Math.floor(this.anchorX * this.width) * scaleX;
        var ay = Math.floor(this.anchorY * this.height) * scaleY;
        var rad = M.degToRad(angle);
        var rotatedAndScaled_ay = (-ax) * Math.sin(rad) + (-ay) * Math.cos(rad);
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
"\n\nDraw.pixel(texture, 34, 56, 0xFFF000, 0.5);\n\nDraw.color = 0xFFF000;\nDraw.alpha = 1;\nDraw.pixel(texture, 34, 56);\n\n";
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
/// <reference path="../worldObject/sprite/sprite.ts" />
var DialogBox = /** @class */ (function (_super) {
    __extends(DialogBox, _super);
    function DialogBox(config) {
        var _this = _super.call(this, config) || this;
        _this.charQueue = [];
        _this.textAreaFull = config.textAreaFull;
        _this.textAreaPortrait = config.textAreaPortrait;
        _this.portraitPosition = config.portraitPosition;
        _this.startSound = config.startSound;
        _this.textArea = _this.textAreaFull;
        _this.done = true;
        _this.spriteText = _this.addChild(new SpriteText({ font: config.dialogFont }));
        _this.spriteTextOffset = 0;
        _this.portraitSprite = _this.addChild(new Sprite());
        _this.characterTimer = new Timer(0.05, function () { return _this.advanceCharacter(); }, true);
        return _this;
    }
    DialogBox.prototype.update = function () {
        _super.prototype.update.call(this);
        this.characterTimer.update(this.delta);
        if (this.done) {
            this.visible = false;
            this.spriteText.visible = false;
            this.portraitSprite.visible = false;
        }
        if (Input.justDown(Input.GAME_ADVANCE_DIALOG)) {
            this.advanceDialog();
        }
    };
    DialogBox.prototype.render = function (texture, x, y) {
        _super.prototype.render.call(this, texture, x, y);
        if (this.portraitSprite.visible) {
            this.setPortraitSpriteProperties();
        }
        this.setSpriteTextProperties();
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
            this.spriteText.pushChar(this.charQueue.shift());
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
    DialogBox.prototype.setPortraitSpriteProperties = function () {
        this.portraitSprite.localx = this.portraitPosition.x;
        this.portraitSprite.localy = this.portraitPosition.y;
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
    DialogBox.prototype.showDialog = function (dialogText) {
        // Reset dialog properties.
        this.spriteText.clear();
        this.spriteTextOffset = 0;
        this.visible = true;
        this.spriteText.visible = true;
        this.done = false;
        this.charQueue = SpriteTextConverter.textToCharListWithWordWrap(dialogText, this.spriteText.font, this.textArea.width);
        this.characterTimer.reset();
        this.advanceCharacter(); // Advance character once to start the dialog with one displayed character.
        if (this.startSound) {
            this.world.playSound(this.startSound);
        }
    };
    DialogBox.prototype.showPortrait = function (portrait) {
        if (AssetCache.isNoneTexture(portrait)) {
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
    return DialogBox;
}(Sprite));
var InteractionManager = /** @class */ (function () {
    function InteractionManager(theater) {
        this.theater = theater;
        this.reset();
    }
    Object.defineProperty(InteractionManager.prototype, "interactRequested", {
        get: function () { return this._interactRequested; },
        enumerable: false,
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
        var e_26, _a;
        var interactableObjects = this.theater.storyManager.getCurrentInteractableObjects();
        var result = new Set();
        try {
            for (var interactableObjects_1 = __values(interactableObjects), interactableObjects_1_1 = interactableObjects_1.next(); !interactableObjects_1_1.done; interactableObjects_1_1 = interactableObjects_1.next()) {
                var name_5 = interactableObjects_1_1.value;
                if (!this.theater.currentWorld.hasWorldObject(name_5))
                    continue;
                result.add(name_5);
            }
        }
        catch (e_26_1) { e_26 = { error: e_26_1 }; }
        finally {
            try {
                if (interactableObjects_1_1 && !interactableObjects_1_1.done && (_a = interactableObjects_1.return)) _a.call(interactableObjects_1);
            }
            finally { if (e_26) throw e_26.error; }
        }
        return result;
    };
    InteractionManager.prototype.highlight = function (obj) {
        if (!obj) {
            this.highlightedObject = null;
            return;
        }
        var worldObject;
        if (obj instanceof Sprite) {
            worldObject = obj;
        }
        else {
            worldObject = this.theater.currentWorld.select.name(obj);
            if (!(worldObject instanceof Sprite)) {
                error("Cannot highlight object " + obj + " because it is not a Sprite");
                return;
            }
        }
        this.highlightedObject = worldObject;
    };
    InteractionManager.prototype.interact = function (obj) {
        if (obj === void 0) { obj = this.highlightedObject.name; }
        this._interactRequested = (obj instanceof Sprite) ? obj.name : obj;
    };
    InteractionManager.prototype.reset = function () {
        this.highlightedObject = null;
        this.highlightedObjectOutline = null;
        this._interactRequested = null;
    };
    return InteractionManager;
}());
var Party;
(function (Party) {
    Party.EMPTY = {
        leader: 'none',
        activeMembers: ['none'],
        members: {},
    };
})(Party || (Party = {}));
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
            error("No party member named '" + name + "':", this);
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
        enumerable: false,
        configurable: true
    });
    PartyManager.prototype.load = function () {
        for (var key in this.members) {
            var member = this.members[key];
            member.worldObject = member.newInstance();
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
            error("Cannot move party member " + memberName + " to stage " + stageName + " because the stage does not exist");
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
        enumerable: false,
        configurable: true
    });
    StageManager.prototype.loadStage = function (name, transitionConfig, entryPoint) {
        if (!this.stages[name]) {
            error("Cannot load world '" + name + "' because it does not exist:", this.stages);
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
        this.currentWorld.update();
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
        if (!this.stages[name]) {
            error("Cannot load stage '" + name + "' because it does not exist.", this.stages);
            return;
        }
        // Remove old stuff
        if (this.currentWorld) {
            World.Actions.removeWorldObjectFromWorld(this.currentWorldAsWorldObject);
        }
        this.theater.interactionManager.reset();
        // Create new stuff
        this.currentStageName = name;
        this.currentWorld = this.stages[name]();
        this.currentWorldAsWorldObject = new Theater.WorldAsWorldObject(this.currentWorld);
        this.addPartyToWorld(this.currentWorld, name, entryPoint);
        World.Actions.setName(this.currentWorldAsWorldObject, 'world');
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
        _this.partyManager = new PartyManager(_this, config.getParty());
        _this.storyManager = new StoryManager(_this, config.story.getStoryboard(), config.story.storyboardPath, config.story.getStoryEvents(), config.story.getStoryConfig());
        _this.stageManager = new StageManager(_this, config.getStages());
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
    // Theater cannot have preUpdate or postUpdate because I say so
    Theater.prototype.update = function () {
        this.storyManager.update();
        _super.prototype.update.call(this);
        this.stageManager.loadStageIfQueued();
    };
    // Theater cannot have preRender or postRender because it doesn't have a parent world
    Theater.prototype.render = function (screen) {
        this.interactionManager.preRender();
        _super.prototype.render.call(this, screen);
        this.interactionManager.postRender();
    };
    Theater.prototype.addSlide = function (slide) {
        return this.slideManager.addSlide(slide);
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
    Theater.prototype.loadDialogBox = function (factory) {
        this.dialogBox = this.addWorldObject(factory());
        this.dialogBox.visible = false;
        World.Actions.setLayer(this.dialogBox, Theater.LAYER_DIALOG);
    };
    Theater.LAYER_WORLD = 'world';
    Theater.LAYER_TRANSITION = 'transition';
    Theater.LAYER_SLIDES = 'slides';
    Theater.LAYER_DIALOG = 'dialog';
    return Theater;
}(World));
(function (Theater) {
    var WorldAsWorldObject = /** @class */ (function (_super) {
        __extends(WorldAsWorldObject, _super);
        function WorldAsWorldObject(containedWorld) {
            var _this = _super.call(this) || this;
            _this.containedWorld = containedWorld;
            _this.worldTexture = new BasicTexture(containedWorld.width, containedWorld.height);
            _this.setTexture(_this.worldTexture);
            return _this;
        }
        WorldAsWorldObject.prototype.update = function () {
            _super.prototype.update.call(this);
            this.containedWorld.update();
        };
        WorldAsWorldObject.prototype.render = function (texture, x, y) {
            this.worldTexture.clear();
            this.containedWorld.render(this.worldTexture);
            _super.prototype.render.call(this, texture, x, y);
        };
        return WorldAsWorldObject;
    }(Sprite));
    Theater.WorldAsWorldObject = WorldAsWorldObject;
})(Theater || (Theater = {}));
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
(function (StoryConfig) {
    StoryConfig.EMPTY = {
        initialConfig: {},
        executeFn: function (sc) { return null; },
    };
})(StoryConfig || (StoryConfig = {}));
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
var StoryEvent;
(function (StoryEvent) {
    StoryEvent.EMPTY_MAP = {};
})(StoryEvent || (StoryEvent = {}));
var StoryManager = /** @class */ (function () {
    function StoryManager(theater, storyboard, storyboardPath, events, storyConfig) {
        var _this = this;
        this.theater = theater;
        this.storyboard = storyboard;
        this.cutsceneManager = new CutsceneManager(theater, storyboard);
        this.eventManager = new StoryEventManager(theater, events);
        this.storyConfig = new StoryConfig(theater, storyConfig);
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
            else if (storyNode.type === 'party') {
                var partyNode_1 = storyNode;
                state.callback = function () {
                    _this.updateParty(partyNode_1);
                };
            }
            else if (storyNode.type === 'config') {
                var config_1 = storyNode.config;
                state.callback = function () {
                    _this.storyConfig.updateConfig(config_1);
                    _this.storyConfig.execute();
                };
            }
            state.transitions = storyNode.transitions.map(function (transition) {
                return {
                    toState: transition.toNode,
                    condition: function () {
                        if (transition.condition && !transition.condition())
                            return false;
                        if (transition.onStage && (_this.theater.currentStageName !== transition.onStage || _this.theater.stageManager.transitioning))
                            return false;
                        // All conditions met. Handle interaction.
                        if (transition.onInteract) {
                            if (_this.theater.interactionManager.interactRequested !== transition.onInteract) {
                                return false;
                            }
                            _this.theater.interactionManager.consumeInteraction();
                        }
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
        this.storyConfig.execute();
    };
    StoryManager.prototype.getCurrentInteractableObjects = function (stageName) {
        return this.getInteractableObjectsForNode(this.currentNode, stageName);
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
            else if (node.type === 'party') {
                this.updateParty(node);
            }
            else if (node.type === 'config') {
                this.storyConfig.updateConfig(node.config);
                this.storyConfig.execute();
            }
        }
        this.storyConfig.execute();
        return _.last(path);
    };
    StoryManager.prototype.getInteractableObjectsForNode = function (node, stageName) {
        var e_27, _a;
        var result = new Set();
        if (!node)
            return result;
        try {
            for (var _b = __values(node.transitions), _c = _b.next(); !_c.done; _c = _b.next()) {
                var transition = _c.value;
                if (!transition.onInteract)
                    continue;
                if (stageName && transition.onStage && stageName !== transition.onStage)
                    continue;
                var toNode = this.getNodeByName(transition.toNode);
                if (toNode.type === 'cutscene' && !this.cutsceneManager.canPlayCutscene(transition.toNode))
                    continue;
                result.add(transition.onInteract);
            }
        }
        catch (e_27_1) { e_27 = { error: e_27_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_27) throw e_27.error; }
        }
        return result;
    };
    StoryManager.prototype.getNodeByName = function (name) {
        if (!this.storyboard[name]) {
            error("No storyboard node exists with name " + name);
        }
        return this.storyboard[name];
    };
    StoryManager.prototype.updateParty = function (party) {
        var e_28, _a, e_29, _b;
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
            catch (e_28_1) { e_28 = { error: e_28_1 }; }
            finally {
                try {
                    if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
                }
                finally { if (e_28) throw e_28.error; }
            }
        }
        if (!_.isEmpty(party.setMembersInactive)) {
            try {
                for (var _e = __values(party.setMembersInactive), _f = _e.next(); !_f.done; _f = _e.next()) {
                    var m = _f.value;
                    this.theater.partyManager.setMemberInactive(m);
                }
            }
            catch (e_29_1) { e_29 = { error: e_29_1 }; }
            finally {
                try {
                    if (_f && !_f.done && (_b = _e.return)) _b.call(_e);
                }
                finally { if (e_29) throw e_29.error; }
            }
        }
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
    function radToDeg(rad) {
        return 180 / Math.PI * rad;
    }
    M.radToDeg = radToDeg;
    function vec3ToColor(vec3) {
        return (Math.round(vec3[0] * 255) << 16) + (Math.round(vec3[1] * 255) << 8) + Math.round(vec3[2] * 255);
    }
    M.vec3ToColor = vec3ToColor;
})(M || (M = {}));
var O;
(function (O) {
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
                    case 0: return [5 /*yield**/, __values(stateScript())];
                    case 1:
                        _b.sent();
                        selectedTransition = undefined;
                        _b.label = 2;
                    case 2:
                        if (!!selectedTransition) return [3 /*break*/, 4];
                        selectedTransition = sm.getValidTransition(sm.currentState);
                        return [4 /*yield*/];
                    case 3:
                        _b.sent();
                        return [3 /*break*/, 2];
                    case 4: return [5 /*yield**/, __values(S.wait((_a = selectedTransition.delay) !== null && _a !== void 0 ? _a : 0)())];
                    case 5:
                        _b.sent();
                        sm.setState(selectedTransition.toState);
                        return [2 /*return*/];
                }
            });
        });
        this.script.update(0);
    };
    StateMachine.prototype.update = function (delta) {
        if (this.script)
            this.script.update(delta);
    };
    StateMachine.prototype.getCurrentStateName = function () {
        for (var name_6 in this.states) {
            if (this.states[name_6] === this.currentState) {
                return name_6;
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
        Easing.Linear = (function (t) { return t; });
        Easing.Square = (function (t) { return Math.pow(t, 2); });
        Easing.InvSquare = (function (t) { return 1 - Math.pow((1 - t), 2); });
    })(Easing = Tween.Easing || (Tween.Easing = {}));
})(Tween || (Tween = {}));
var Utils;
(function (Utils) {
    Utils.NOOP = function () { return null; };
    Utils.NOOP_DISPLAYOBJECT = new PIXI.DisplayObject();
    Utils.NOOP_RENDERTEXTURE = PIXI.RenderTexture.create({ width: 0, height: 0 });
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
    function dot(v1, v2) {
        return v1.x * v2.x + v1.y * v2.y;
    }
    V.dot = dot;
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
            return pt(0, 0);
        }
        return pt(vector.x / mag, vector.y / mag);
    }
    V.normalized = normalized;
    function scale(vector, amount) {
        vector.x *= amount;
        vector.y *= amount;
    }
    V.scale = scale;
    function scaled(vector, amount) {
        return pt(vector.x * amount, vector.y * amount);
    }
    V.scaled = scaled;
    function setMagnitude(vector, magnitude) {
        this.normalize(vector);
        this.scale(vector, magnitude);
    }
    V.setMagnitude = setMagnitude;
})(V || (V = {}));
/// <reference path="../utils/o_object.ts"/>
var Camera = /** @class */ (function () {
    function Camera(config, world) {
        _.defaults(config, {
            width: global.gameWidth,
            height: global.gameHeight,
            bounds: { x: -Infinity, y: -Infinity, width: Infinity, height: Infinity },
            movement: { type: 'snap' },
        });
        _.defaults(config, {
            // Needs to use new values for config
            mode: { type: 'focus', point: { x: config.width / 2, y: config.height / 2 } },
        });
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
        this.debugOffsetX = 0;
        this.debugOffsetY = 0;
        this.initPosition(world);
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
    Camera.prototype.update = function (world) {
        if (this.mode.type === 'follow') {
            var target = this.mode.target;
            if (_.isString(target)) {
                target = world.select.name(target);
            }
            this.moveTowardsPoint(target.x + this.mode.offset.x, target.y + this.mode.offset.y, world.delta);
        }
        else if (this.mode.type === 'focus') {
            this.moveTowardsPoint(this.mode.point.x, this.mode.point.y, world.delta);
        }
        if (this.shakeIntensity > 0) {
            var pt_1 = Random.inCircle(this.shakeIntensity);
            this._shakeX = pt_1.x;
            this._shakeY = pt_1.y;
        }
        else {
            this._shakeX = 0;
            this._shakeY = 0;
        }
        this.clampToBounds();
        if (Debug.MOVE_CAMERA_WITH_ARROWS && global.theater && world === global.theater.currentWorld) {
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
    Camera.prototype.initPosition = function (world) {
        if (this.mode.type === 'follow') {
            var target = this.mode.target;
            if (_.isString(target)) {
                target = world.select.name(target);
            }
            this.x = target.x + this.mode.offset.x;
            this.y = target.y + this.mode.offset.y;
        }
        else if (this.mode.type === 'focus') {
            this.x = this.mode.point.x;
            this.y = this.mode.point.y;
        }
    };
    Camera.prototype.moveTowardsPoint = function (x, y, delta) {
        if (this.movement.type === 'snap') {
            this.x = x;
            this.y = y;
        }
        else if (this.movement.type === 'smooth') {
            var hw = this.movement.deadZoneWidth / 2;
            var hh = this.movement.deadZoneHeight / 2;
            var dx = x - this.x;
            var dy = y - this.y;
            if (Math.abs(dx) > hw) {
                var tx = Math.abs(hw / dx);
                var targetx = this.x + (1 - tx) * dx;
                this.x = M.lerpTime(this.x, targetx, this.movement.speed, delta);
            }
            if (Math.abs(dy) > hh) {
                var ty = Math.abs(hh / dy);
                var targety = this.y + (1 - ty) * dy;
                this.y = M.lerpTime(this.y, targety, this.movement.speed, delta);
            }
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
        if (deadZoneWidth === void 0) { deadZoneWidth = 0; }
        if (deadZoneHeight === void 0) { deadZoneHeight = 0; }
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
            if (offsetX === void 0) { offsetX = 0; }
            if (offsetY === void 0) { offsetY = 0; }
            return { type: 'follow', target: target, offset: { x: offsetX, y: offsetY } };
        }
        Mode.FOLLOW = FOLLOW;
        function FOCUS(x, y) {
            return { type: 'focus', point: { x: x, y: y } };
        }
        Mode.FOCUS = FOCUS;
    })(Mode = Camera.Mode || (Camera.Mode = {}));
})(Camera || (Camera = {}));
var Physics;
(function (Physics) {
    function resolveCollisions(world) {
        var resultCollisions = [];
        for (var iter = 0; iter < world.collisionIterations; iter++) {
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
        var e_33, _a;
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
        catch (e_33_1) { e_33 = { error: e_33_1 }; }
        finally {
            try {
                if (collisions_1_1 && !collisions_1_1.done && (_a = collisions_1.return)) _a.call(collisions_1);
            }
            finally { if (e_33) throw e_33.error; }
        }
    }
    function performFinalIteration(world, resultCollisions) {
        var e_34, _a, e_35, _b;
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
        catch (e_34_1) { e_34 = { error: e_34_1 }; }
        finally {
            try {
                if (collisions_2_1 && !collisions_2_1.done && (_a = collisions_2.return)) _a.call(collisions_2);
            }
            finally { if (e_34) throw e_34.error; }
        }
        var doneWithCollisions = false;
        while (!doneWithCollisions) {
            doneWithCollisions = true;
            try {
                for (var collisions_3 = (e_35 = void 0, __values(collisions)), collisions_3_1 = collisions_3.next(); !collisions_3_1.done; collisions_3_1 = collisions_3.next()) {
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
            catch (e_35_1) { e_35 = { error: e_35_1 }; }
            finally {
                try {
                    if (collisions_3_1 && !collisions_3_1.done && (_b = collisions_3.return)) _b.call(collisions_3);
                }
                finally { if (e_35) throw e_35.error; }
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
        var e_36, _a, e_37, _b, e_38, _c;
        var raycastCollisions = [];
        try {
            for (var _d = __values(world.collisions), _e = _d.next(); !_e.done; _e = _d.next()) {
                var collision = _e.value;
                try {
                    for (var _f = (e_37 = void 0, __values(world.physicsGroups[collision.move].worldObjects)), _g = _f.next(); !_g.done; _g = _f.next()) {
                        var move = _g.value;
                        try {
                            for (var _h = (e_38 = void 0, __values(world.physicsGroups[collision.from].worldObjects)), _j = _h.next(); !_j.done; _j = _h.next()) {
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
                        catch (e_38_1) { e_38 = { error: e_38_1 }; }
                        finally {
                            try {
                                if (_j && !_j.done && (_c = _h.return)) _c.call(_h);
                            }
                            finally { if (e_38) throw e_38.error; }
                        }
                    }
                }
                catch (e_37_1) { e_37 = { error: e_37_1 }; }
                finally {
                    try {
                        if (_g && !_g.done && (_b = _f.return)) _b.call(_f);
                    }
                    finally { if (e_37) throw e_37.error; }
                }
            }
        }
        catch (e_36_1) { e_36 = { error: e_36_1 }; }
        finally {
            try {
                if (_e && !_e.done && (_a = _d.return)) _a.call(_d);
            }
            finally { if (e_36) throw e_36.error; }
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
        var e_39, _a, e_40, _b;
        var collisionGroups = [];
        try {
            for (var collisions_4 = __values(collisions), collisions_4_1 = collisions_4.next(); !collisions_4_1.done; collisions_4_1 = collisions_4.next()) {
                var collision = collisions_4_1.value;
                var collisionFoundInList = false;
                try {
                    for (var collisionGroups_1 = (e_40 = void 0, __values(collisionGroups)), collisionGroups_1_1 = collisionGroups_1.next(); !collisionGroups_1_1.done; collisionGroups_1_1 = collisionGroups_1.next()) {
                        var collisionList = collisionGroups_1_1.value;
                        if (collisionList[0].move === collision.move && collisionList[0].from === collision.from) {
                            collisionList.push(collision);
                            collisionFoundInList = true;
                            break;
                        }
                    }
                }
                catch (e_40_1) { e_40 = { error: e_40_1 }; }
                finally {
                    try {
                        if (collisionGroups_1_1 && !collisionGroups_1_1.done && (_b = collisionGroups_1.return)) _b.call(collisionGroups_1);
                    }
                    finally { if (e_40) throw e_40.error; }
                }
                if (!collisionFoundInList) {
                    collisionGroups.push([collision]);
                }
            }
        }
        catch (e_39_1) { e_39 = { error: e_39_1 }; }
        finally {
            try {
                if (collisions_4_1 && !collisions_4_1.done && (_a = collisions_4.return)) _a.call(collisions_4);
            }
            finally { if (e_39) throw e_39.error; }
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
        var e_41, _a;
        try {
            for (var collisions_5 = __values(collisions), collisions_5_1 = collisions_5.next(); !collisions_5_1.done; collisions_5_1 = collisions_5.next()) {
                var collision = collisions_5_1.value;
                applyMomentumTransferForCollision(collision, collision.momentumTransfer, delta);
                if (collision.callback)
                    collision.callback(collision.move, collision.from);
                collision.move.onCollide(collision.from);
                collision.from.onCollide(collision.move);
            }
        }
        catch (e_41_1) { e_41 = { error: e_41_1 }; }
        finally {
            try {
                if (collisions_5_1 && !collisions_5_1.done && (_a = collisions_5.return)) _a.call(collisions_5);
            }
            finally { if (e_41) throw e_41.error; }
        }
    }
    function applyMomentumTransferForCollision(collision, momentumTransferMode, delta) {
        if (momentumTransferMode === 'elastic') {
            if (collision.move.isImmovable() && collision.from.isImmovable())
                return;
            var d = V.normalized({ x: collision.collision.displacementX, y: collision.collision.displacementY });
            var mm = collision.move.mass;
            var mf = collision.from.mass;
            if (mm + mf === 0) {
                // In case of invald masses, set both to the default 1.
                mm = 1;
                mf = 1;
            }
            var vmi_proj = V.dot(collision.move.v, d);
            var vfi_proj = V.dot(collision.from.v, d);
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
                error("No object with name " + name + " exists in world", this);
            return undefined;
        }
        if (results.length > 1) {
            debug("Multiple objects with name " + name + " exist in world. Returning one of them. World:", this);
        }
        return results[0];
    };
    WorldSelecter.prototype.nameAll = function (name) {
        return A.clone(this.world.worldObjectsByName[name] || []);
    };
    WorldSelecter.prototype.overlap = function (bounds, physicsGroups) {
        var e_42, _a;
        var result = [];
        for (var physicsGroup in this.world.physicsGroups) {
            if (!_.contains(physicsGroups, physicsGroup))
                continue;
            try {
                for (var _b = (e_42 = void 0, __values(this.world.physicsGroups[physicsGroup].worldObjects)), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var obj = _c.value;
                    if (!obj.isOverlapping(bounds))
                        continue;
                    result.push(obj);
                }
            }
            catch (e_42_1) { e_42 = { error: e_42_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_42) throw e_42.error; }
            }
        }
        return result;
    };
    WorldSelecter.prototype.raycast = function (x, y, dx, dy, physicsGroups) {
        var e_43, _a;
        var result = [];
        for (var physicsGroup in this.world.physicsGroups) {
            if (!_.contains(physicsGroups, physicsGroup))
                continue;
            try {
                for (var _b = (e_43 = void 0, __values(this.world.physicsGroups[physicsGroup].worldObjects)), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var obj = _c.value;
                    var t = obj.bounds.raycast(x, y, dx, dy);
                    if (!isFinite(t))
                        continue;
                    result.push({ obj: obj, t: t });
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
        return result.sort(function (r1, r2) { return r1.t - r2.t; });
    };
    WorldSelecter.prototype.type = function (type, checked) {
        if (checked === void 0) { checked = true; }
        var results = this.typeAll(type);
        if (_.isEmpty(results)) {
            if (checked)
                error("No object of type " + type.name + " exists in world", this);
            return undefined;
        }
        if (results.length > 1) {
            debug("Multiple objects of type " + type.name + " exist in world. Returning one of them. World:", this);
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
        this.center = { x: x, y: y };
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
                var newX = vx + Math.cos(angle) * move.radius;
                var newY = vy + Math.sin(angle) * move.radius;
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
        function getDisplacementCollisionRectCircle(move, from) {
            return invertDisplacementCollision(getDisplacementCollisionCircleRect(from, move));
        }
        Collision.getDisplacementCollisionRectCircle = getDisplacementCollisionRectCircle;
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
        function getDisplacementCollisionSlopeCircle(move, from) {
            return invertDisplacementCollision(getDisplacementCollisionCircleSlope(from, move));
        }
        Collision.getDisplacementCollisionSlopeCircle = getDisplacementCollisionSlopeCircle;
        function getDisplacementCollisionSlopeRect(move, from) {
            return invertDisplacementCollision(getDisplacementCollisionRectSlope(from, move));
        }
        Collision.getDisplacementCollisionSlopeRect = getDisplacementCollisionSlopeRect;
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
        function getRaycastCollisionRectCircle(move, movedx, movedy, from, fromdx, fromdy) {
            return invertRaycastCollision(getRaycastCollisionCircleRect(from, fromdx, fromdy, move, movedx, movedy));
        }
        Collision.getRaycastCollisionRectCircle = getRaycastCollisionRectCircle;
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
        function getRaycastCollisionSlopeCircle(move, movedx, movedy, from, fromdx, fromdy) {
            return invertRaycastCollision(getRaycastCollisionCircleSlope(from, fromdx, fromdy, move, movedx, movedy));
        }
        Collision.getRaycastCollisionSlopeCircle = getRaycastCollisionSlopeCircle;
        function getRaycastCollisionSlopeRect(move, movedx, movedy, from, fromdx, fromdy) {
            return invertRaycastCollision(getRaycastCollisionRectSlope(from, fromdx, fromdy, move, movedx, movedy));
        }
        Collision.getRaycastCollisionSlopeRect = getRaycastCollisionSlopeRect;
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
            return Math.atan2(dy, dx);
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
var NullBounds = /** @class */ (function () {
    function NullBounds(parent) {
        this.parent = parent;
        this.position = { x: Infinity, y: Infinity };
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
            return Bounds.Collision.getDisplacementCollisionRectCircle(this, other);
        if (other instanceof SlopeBounds)
            return Bounds.Collision.getDisplacementCollisionRectSlope(this, other);
        if (other instanceof NullBounds)
            return undefined;
        error("No collision supported between these bounds", this, other);
        return undefined;
    };
    RectBounds.prototype.getRaycastCollision = function (dx, dy, other, otherdx, otherdy) {
        if (other instanceof RectBounds)
            return Bounds.Collision.getRaycastCollisionRectRect(this, dx, dy, other, otherdx, otherdy);
        if (other instanceof CircleBounds)
            return Bounds.Collision.getRaycastCollisionRectCircle(this, dx, dy, other, otherdx, otherdy);
        if (other instanceof SlopeBounds)
            return Bounds.Collision.getRaycastCollisionRectSlope(this, dx, dy, other, otherdx, otherdy);
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
            return Bounds.Collision.getDisplacementCollisionSlopeRect(this, other);
        if (other instanceof CircleBounds)
            return Bounds.Collision.getDisplacementCollisionSlopeCircle(this, other);
        if (other instanceof NullBounds)
            return undefined;
        error("No collision supported between these bounds", this, other);
        return undefined;
    };
    SlopeBounds.prototype.getRaycastCollision = function (dx, dy, other, otherdx, otherdy) {
        if (other instanceof RectBounds)
            return Bounds.Collision.getRaycastCollisionSlopeRect(this, dx, dy, other, otherdx, otherdy);
        if (other instanceof CircleBounds)
            return Bounds.Collision.getRaycastCollisionSlopeCircle(this, dx, dy, other, otherdx, otherdy);
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
    Effects.prototype.updateEffects = function (delta) {
        var e_44, _a, e_45, _b;
        if (this.effects[Effects.SILHOUETTE_I])
            this.effects[Effects.SILHOUETTE_I].updateTime(delta);
        if (this.effects[Effects.OUTLINE_I])
            this.effects[Effects.OUTLINE_I].updateTime(delta);
        try {
            for (var _c = __values(this.pre.filters), _d = _c.next(); !_d.done; _d = _c.next()) {
                var filter = _d.value;
                filter.updateTime(delta);
            }
        }
        catch (e_44_1) { e_44 = { error: e_44_1 }; }
        finally {
            try {
                if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
            }
            finally { if (e_44) throw e_44.error; }
        }
        try {
            for (var _e = __values(this.post.filters), _f = _e.next(); !_f.done; _f = _e.next()) {
                var filter = _f.value;
                filter.updateTime(delta);
            }
        }
        catch (e_45_1) { e_45 = { error: e_45_1 }; }
        finally {
            try {
                if (_f && !_f.done && (_b = _e.return)) _b.call(_e);
            }
            finally { if (e_45) throw e_45.error; }
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
        for (var name_7 in this.animations) {
            if (_.contains(this.animations[name_7], this.currentFrame)) {
                return name_7;
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
            error("Cannot get frame '" + name + "' on sprite", this.sprite, "as it does not fit the form '[animation]/[frame]'");
            return null;
        }
        var animation = this.animations[parts[0]];
        if (!animation) {
            error("Cannot get frame '" + name + "' on sprite", this.sprite, "as animation '" + parts[0] + "' does not exist");
            return null;
        }
        var frame = parseInt(parts[1]);
        if (!isFinite(frame) || frame < 0 || frame >= animation.length) {
            error("Cannot get frame '" + name + "' on sprite", this.sprite, "as animation '" + parts[0] + " does not have frame '" + parts[1] + "'");
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
                texture: (_.isString(textures[i]) || _.isNumber(textures[i])) ? config.texturePrefix + "_" + textures[i] : textures[i],
                nextFrameRef: config.name + "/" + (i + 1),
                forceRequired: config.forceRequired,
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
        var e_46, _a;
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
            catch (e_46_1) { e_46 = { error: e_46_1 }; }
            finally {
                try {
                    if (word_1_1 && !word_1_1.done && (_a = word_1.return)) _a.call(word_1);
                }
                finally { if (e_46) throw e_46.error; }
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
        var _a, _b;
        var _this = _super.call(this, config) || this;
        _this.tilemap = Tilemap.cloneTilemap(_.isString(config.tilemap) ? AssetCache.getTilemap(config.tilemap) : config.tilemap);
        _this.tilemapLayer = (_a = config.tilemapLayer) !== null && _a !== void 0 ? _a : 0;
        _this.zMap = (_b = config.zMap) !== null && _b !== void 0 ? _b : {};
        _this.animation = config.animation;
        _this.dirty = true;
        _this.debugDrawBounds = false;
        return _this;
    }
    Object.defineProperty(Tilemap.prototype, "currentTilemapLayer", {
        get: function () { return this.tilemap.layers[this.tilemapLayer]; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Tilemap.prototype, "tileset", {
        get: function () { return this.tilemap.tileset; },
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
    Tilemap.prototype.createCollisionBoxes = function () {
        var e_47, _a;
        World.Actions.removeWorldObjectsFromWorld(this.collisionBoxes);
        this.collisionBoxes = [];
        var collisionRects = Tilemap.getCollisionRects(this.currentTilemapLayer, this.tileset);
        Tilemap.optimizeCollisionRects(collisionRects); // Not optimizing entire array first to save some cycles.
        Tilemap.optimizeCollisionRects(collisionRects, Tilemap.OPTIMIZE_ALL);
        try {
            for (var collisionRects_1 = __values(collisionRects), collisionRects_1_1 = collisionRects_1.next(); !collisionRects_1_1.done; collisionRects_1_1 = collisionRects_1.next()) {
                var rect_2 = collisionRects_1_1.value;
                var box = this.addChild(new PhysicsWorldObject());
                box.x = this.x;
                box.y = this.y;
                box.bounds = new RectBounds(rect_2.x, rect_2.y, rect_2.width, rect_2.height);
                box.matchParentPhysicsGroup = true;
                box.setImmovable(true);
                box.debugDrawBounds = this.debugDrawBounds;
                this.collisionBoxes.push(box);
            }
        }
        catch (e_47_1) { e_47 = { error: e_47_1 }; }
        finally {
            try {
                if (collisionRects_1_1 && !collisionRects_1_1.done && (_a = collisionRects_1.return)) _a.call(collisionRects_1);
            }
            finally { if (e_47) throw e_47.error; }
        }
    };
    Tilemap.prototype.createTilemap = function () {
        this.drawRenderTexture();
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
                    var rect_3 = {
                        x: x * tileset.tileWidth,
                        y: y * tileset.tileHeight,
                        width: tileset.tileWidth,
                        height: tileset.tileHeight
                    };
                    result.push(rect_3);
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
var SmartTilemap = /** @class */ (function (_super) {
    __extends(SmartTilemap, _super);
    function SmartTilemap(config) {
        var _this = _super.call(this, config) || this;
        _this.smartConfig = config.smartConfig;
        _this.baseTilemap = _this.tilemap;
        _this.tilemap = SmartTilemap.Util.getSmartTilemap(_this.baseTilemap, _this.smartConfig);
        _this.dirty = true;
        return _this;
    }
    SmartTilemap.prototype.getTile = function (x, y) {
        return this.baseTilemap[y][x];
    };
    SmartTilemap.prototype.setTile = function (x, y, tile) {
        this.baseTilemap.layers[this.tilemapLayer][y][x] = O.deepClone(tile);
        this.tilemap = SmartTilemap.Util.getSmartTilemap(this.baseTilemap, this.smartConfig);
        this.dirty = true;
    };
    return SmartTilemap;
}(Tilemap));
(function (SmartTilemap) {
    var Rule;
    (function (Rule) {
        // Rules for a tilemap with air=empty, solid=non-empty
        function oneBitRules(config) {
            var rules = [];
            if (config.peninsulaUpIndex !== undefined) {
                rules.push({ pattern: /. . \S .../, tile: { index: config.peninsulaUpIndex, angle: 0, flipX: false } }); // Peninsula up
                rules.push({ pattern: /. ..\S . ./, tile: { index: config.peninsulaUpIndex, angle: 90, flipX: false } }); // Peninsula right
                rules.push({ pattern: /... \S . ./, tile: { index: config.peninsulaUpIndex, angle: 180, flipX: false } }); // Peninsula down
                rules.push({ pattern: /. . \S.. ./, tile: { index: config.peninsulaUpIndex, angle: 270, flipX: false } }); // Peninsula left
            }
            if (config.cornerTopLeftIndex !== undefined) {
                rules.push({ pattern: /. . \S..../, tile: { index: config.cornerTopLeftIndex, angle: 0, flipX: false } }); // Corner top-left
                rules.push({ pattern: /. ..\S .../, tile: { index: config.cornerTopLeftIndex, angle: 90, flipX: false } }); // Corner top-right
                rules.push({ pattern: /....\S . ./, tile: { index: config.cornerTopLeftIndex, angle: 180, flipX: false } }); // Corner bottom-right
                rules.push({ pattern: /... \S.. ./, tile: { index: config.cornerTopLeftIndex, angle: 270, flipX: false } }); // Corner bottom-left
            }
            if (config.doubleEdgeHorizontalIndex !== undefined) {
                rules.push({ pattern: /. ..\S.. ./, tile: { index: config.doubleEdgeHorizontalIndex, angle: 0, flipX: false } }); // Double Edge horizontal
                rules.push({ pattern: /... \S .../, tile: { index: config.doubleEdgeHorizontalIndex, angle: 90, flipX: false } }); // Double Edge vertical
            }
            if (config.edgeUpIndex !== undefined) {
                rules.push({ pattern: /. ..\S..../, tile: { index: config.edgeUpIndex, angle: 0, flipX: false } }); // Edge up
                rules.push({ pattern: /....\S .../, tile: { index: config.edgeUpIndex, angle: 90, flipX: false } }); // Edge right
                rules.push({ pattern: /....\S.. ./, tile: { index: config.edgeUpIndex, angle: 180, flipX: false } }); // Edge down
                rules.push({ pattern: /... \S..../, tile: { index: config.edgeUpIndex, angle: 270, flipX: false } }); // Edge left
            }
            if (config.inverseCornerTopLeftIndex !== undefined) {
                rules.push({ pattern: / ...\S..../, tile: { index: config.inverseCornerTopLeftIndex, angle: 0, flipX: false } }); // Inverse Corner top-left
                rules.push({ pattern: /.. .\S..../, tile: { index: config.inverseCornerTopLeftIndex, angle: 90, flipX: false } }); // Inverse Corner top-right
                rules.push({ pattern: /....\S... /, tile: { index: config.inverseCornerTopLeftIndex, angle: 180, flipX: false } }); // Inverse Corner bottom-right
                rules.push({ pattern: /....\S. ../, tile: { index: config.inverseCornerTopLeftIndex, angle: 270, flipX: false } }); // Inverse Corner bottom-left
            }
            rules.push({ pattern: /.... ..../, tile: { index: config.airIndex, angle: 0, flipX: false } }); // Air
            rules.push({ pattern: /....\S..../, tile: { index: config.solidIndex, angle: 0, flipX: false } }); // Solid
            return rules;
        }
        Rule.oneBitRules = oneBitRules;
    })(Rule = SmartTilemap.Rule || (SmartTilemap.Rule = {}));
})(SmartTilemap || (SmartTilemap = {}));
(function (SmartTilemap) {
    var Util;
    (function (Util) {
        function getSmartTilemap(tilemap, config) {
            if (_.isString(tilemap)) {
                tilemap = AssetCache.getTilemap(tilemap);
                if (!tilemap)
                    return;
            }
            return {
                tileset: tilemap.tileset,
                layers: tilemap.layers.map(function (layer) { return getSmartTilemapLayer(layer, config); }),
            };
        }
        Util.getSmartTilemap = getSmartTilemap;
        function getSmartTilemapLayer(tilemap, config) {
            var result = [];
            for (var y = 0; y < tilemap.length; y++) {
                var line = [];
                for (var x = 0; x < tilemap[y].length; x++) {
                    line.push(getSmartTile(tilemap, x, y, config));
                }
                result.push(line);
            }
            return result;
        }
        Util.getSmartTilemapLayer = getSmartTilemapLayer;
        function getSmartTile(tilemap, x, y, config) {
            var e_48, _a;
            var pattern = getTilePattern(tilemap, x, y, config);
            try {
                for (var _b = __values(config.rules), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var rule = _c.value;
                    if (pattern.search(rule.pattern) > -1) {
                        return rule.tile;
                    }
                }
            }
            catch (e_48_1) { e_48 = { error: e_48_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_48) throw e_48.error; }
            }
            return tilemap[y][x];
        }
        Util.getSmartTile = getSmartTile;
        function getTilePattern(tilemap, x, y, config) {
            var pattern = '';
            for (var j = y - 1; j <= y + 1; j++) {
                for (var i = x - 1; i <= x + 1; i++) {
                    var index = getTileIndex(tilemap, i, j, config.outsideRule, config.emptyRule);
                    pattern += index >= 0 ? index : ' ';
                }
            }
            return pattern;
        }
        function getTileIndex(tilemap, x, y, outsideRule, emptyRule) {
            if (0 <= y && y < tilemap.length && 0 <= x && x < tilemap[y].length) {
                if (tilemap[y][x].index >= 0) {
                    return tilemap[y][x].index;
                }
                if (emptyRule.type === 'noop') {
                    return tilemap[y][x].index;
                }
                if (emptyRule.type === 'constant') {
                    return emptyRule.index;
                }
            }
            if (outsideRule.type === 'constant') {
                return outsideRule.index;
            }
            if (outsideRule.type === 'extend') {
                var nearesty = M.clamp(y, 0, tilemap.length - 1);
                var nearestx = M.clamp(x, 0, tilemap[nearesty].length - 1);
                return tilemap[nearesty][nearestx].index;
            }
        }
    })(Util = SmartTilemap.Util || (SmartTilemap.Util = {}));
})(SmartTilemap || (SmartTilemap = {}));
var Assets;
(function (Assets) {
    Assets.textures = {
        'blank': {},
        // Debug
        'debug': {},
        // Fonts
        'deluxe16': {
            spritesheet: { frameWidth: 8, frameHeight: 15 },
        },
        // Game
        'knight': {
            anchor: Anchor.BOTTOM,
            spritesheet: { frameWidth: 16, frameHeight: 24 },
        },
        'hoop': { anchor: Anchor.CENTER },
        'golbin': {
            anchor: Anchor.BOTTOM,
            spritesheet: { frameWidth: 32, frameHeight: 32 },
            frames: {
                'golbin_dead': {
                    anchor: { x: 0.5, y: 28 / 32 },
                    rect: { x: 0, y: 96, width: 32, height: 32 }
                }
            }
        },
        'bullet': { anchor: Anchor.CENTER },
        'enemyknight': {
            anchor: Anchor.BOTTOM,
            spritesheet: { frameWidth: 24, frameHeight: 24 },
            frames: {
                'enemyknight_dead': {
                    anchor: { x: 0.5, y: 21 / 24 },
                    rect: { x: 0, y: 72, width: 24, height: 24 }
                }
            }
        },
        'mage': {
            anchor: Anchor.BOTTOM,
            spritesheet: { frameWidth: 24, frameHeight: 24 },
            frames: {
                'mage_dead': {
                    anchor: { x: 0.5, y: 20 / 24 },
                    rect: { x: 0, y: 72, width: 24, height: 24 }
                }
            }
        },
        'runner': {
            anchor: Anchor.BOTTOM,
            spritesheet: { frameWidth: 24, frameHeight: 24 },
            frames: {
                'runner_dead': {
                    anchor: { x: 0.5, y: 21 / 24 },
                    rect: { x: 0, y: 72, width: 24, height: 24 }
                }
            }
        },
        'floor': {},
        'lights': {},
        'stairs': { anchor: Anchor.BOTTOM },
        'throne': { anchor: Anchor.BOTTOM },
        'king': {
            anchor: Anchor.BOTTOM,
            spritesheet: { frameWidth: 24, frameHeight: 24 },
        },
        'bomb': { anchor: Anchor.BOTTOM },
        'explosion': { anchor: Anchor.CENTER },
        'spawn': { anchor: Anchor.CENTER },
        // UI
        'dialogbox': { anchor: Anchor.CENTER },
        'ui_shield': { anchor: Anchor.CENTER },
        'royalhulatext': {},
        'hoopkingtext': {},
    };
    Assets.sounds = {
        // Debug
        'debug': {},
        // Menu
        'click': {},
        // Game
        'dialogstart': { url: 'assets/click.wav', volume: 0.5 },
        'walk': { volume: 0.5 },
        'swing': { volume: 0.5 },
        'hitenemy': {},
        'hitplayer': {},
        'shoot': {},
        'dash': {},
        'explode': { volume: 0.5 },
        'shake': { volume: 0.5 },
        'land': {},
        'dink': { volume: 0.5 },
        // Music
        'jingle': { volume: 0.5 },
        'music': { volume: 0.5 },
        'musicboss': { volume: 0.5 },
    };
    Assets.tilesets = {};
    Assets.pyxelTilemaps = {};
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
        return fonts;
    }());
    Assets.fonts = fonts;
    Assets.spriteTextTags = {};
})(Assets || (Assets = {}));
var Enemy = /** @class */ (function (_super) {
    __extends(Enemy, _super);
    function Enemy(config) {
        var _a;
        var _this = _super.call(this, config) || this;
        _this.health = config.maxHealth;
        _this.immuneTime = config.immuneTime;
        _this.weight = config.weight;
        _this.speed = config.speed;
        _this.damagableByHoop = (_a = config.damagableByHoop) !== null && _a !== void 0 ? _a : true;
        _this.deadTexture = config.deadTexture;
        _this.immunitySm = new ImmunitySm(_this.immuneTime);
        return _this;
    }
    Object.defineProperty(Enemy.prototype, "immune", {
        get: function () { return this.immunitySm.isImmune(); },
        enumerable: false,
        configurable: true
    });
    Enemy.prototype.update = function () {
        this.immunitySm.update(this.delta);
        _super.prototype.update.call(this);
        this.v.x = M.lerpTime(this.v.x, 0, 10, this.delta);
        this.v.y = M.lerpTime(this.v.y, 0, 10, this.delta);
    };
    Enemy.prototype.postUpdate = function () {
        _super.prototype.postUpdate.call(this);
        var p = 4;
        if (this.x < -p || this.x > 768 + p || this.y < 192 - p || this.y > 768 + p) {
            this.kill();
        }
    };
    Enemy.prototype.damage = function (amount) {
        this.health -= amount;
        if (this.health <= 0) {
            this.kill();
        }
        this.immunitySm.setImmune();
        this.world.playSound('hitenemy');
    };
    Enemy.prototype.kill = function () {
        if (this.deadTexture) {
            this.world.addWorldObject(deadBody(this, this.deadTexture));
        }
        _super.prototype.kill.call(this);
    };
    return Enemy;
}(Sprite));
/// <reference path="./enemy.ts"/>
var Bomb = /** @class */ (function (_super) {
    __extends(Bomb, _super);
    function Bomb(config) {
        var _this = _super.call(this, __assign({ texture: 'bomb', effects: { silhouette: { color: 0xFFFFFF, enabled: false } }, bounds: new CircleBounds(0, -12, 12), gravityz: -100, colliding: false, maxHealth: Infinity, immuneTime: 0.01, weight: 0.3, speed: 0 }, config)) || this;
        _this.runScript(S.chain(S.wait(0.1), S.call(function () { return _this.colliding = true; }), S.loopFor(24, S.chain(S.call(function () { return _this.effects.silhouette.enabled = !_this.effects.silhouette.enabled; }), S.wait(0.25))), S.loopFor(60, S.chain(S.call(function () { return _this.effects.silhouette.enabled = !_this.effects.silhouette.enabled; }), S.wait(0.05))), S.call(function () {
            if (_this.alive)
                _this.explode();
        })));
        return _this;
    }
    Bomb.prototype.update = function () {
        _super.prototype.update.call(this);
        if (this.z < 0) {
            this.z = 0;
            this.vz = -0.5 * this.vz;
        }
    };
    Bomb.prototype.explode = function () {
        this.alive = false;
        this.world.addWorldObject(new Explosion({
            x: this.x,
            y: this.y - 12,
            layer: 'fg'
        }));
    };
    Bomb.prototype.onCollide = function (other) {
        _super.prototype.onCollide.call(this, other);
        if (other instanceof Throne && this.alive) {
            this.explode();
        }
    };
    return Bomb;
}(Enemy));
var Bullet = /** @class */ (function (_super) {
    __extends(Bullet, _super);
    function Bullet(config) {
        if (config === void 0) { config = {}; }
        return _super.call(this, __assign({ texture: 'bullet', bounds: new CircleBounds(0, 0, 4) }, config)) || this;
    }
    Bullet.prototype.onCollide = function (other) {
        _super.prototype.onCollide.call(this, other);
        this.kill();
    };
    return Bullet;
}(Sprite));
var Cheat = {
    'win': function () { return global.world.select.type(Throne).damage(5); },
    'lose': function () { return A.range(5).forEach(function (i) { return global.world.select.type(Player).damage(); }); },
    'killall': function () {
        global.world.select.typeAll(Enemy).filter(function (e) { return !(e instanceof Throne); }).forEach(function (e) { return e.kill(); });
        global.world.select.nameAll('spawn').forEach(function (s) { return s.kill(); });
    },
    'explode': function () {
        global.world.addWorldObject(new Explosion({
            x: 400, y: 400,
        }));
    },
    'skiptofinalwave': function () {
        Cheat['killall']();
        Debug.SKIP_RATE = 1;
        global.theater.storyManager.setNode('spawn_wave_king');
    },
};
function deadBody(parent, texture) {
    return new Sprite({
        name: 'deadbody',
        layer: 'bg',
        physicsGroup: 'deadbodies',
        x: parent.x, y: parent.y,
        vx: parent.v.x, vy: parent.v.y,
        texture: texture,
        flipX: parent.v.x > 0,
        tint: parent.tint === 0xFFFF00 ? 0x888800 : (parent.tint === 0xFF00FF ? 0x880088 : 0x888888),
        effects: {
            silhouette: { color: 0xFFFFFF },
            outline: { color: parent.effects.outline.color === 0xFFFFFF ? 0x555555 : 0x000000 }
        },
        bounds: new CircleBounds(0, -2, 8),
        onAdd: function (obj) {
            obj.runScript(S.chain(S.wait(0.05), S.call(function () { return obj.effects.silhouette.enabled = false; }), S.wait(1), S.call(function () {
                if (obj.world.hasWorldObject('floor')) {
                    obj.render(obj.world.select.name('floor').getTexture(), obj.x, obj.y);
                }
                obj.kill();
            })));
        },
        update: function (obj) {
            obj.v.x = M.lerpTime(obj.v.x, 0, 10, obj.delta);
            obj.v.y = M.lerpTime(obj.v.y, 0, 10, obj.delta);
        }
    });
}
var Explosion = /** @class */ (function (_super) {
    __extends(Explosion, _super);
    function Explosion(config) {
        if (config === void 0) { config = {}; }
        var _this = _super.call(this, __assign({ texture: 'explosion', tint: 0x000000, bounds: new CircleBounds(0, 0, 50) }, config)) || this;
        _this.runScript(S.chain(S.wait(0.05), S.call(function () { return _this.tint = 0xFFFFFF; }), S.wait(0.05), S.call(function () { return _this.kill(); })));
        return _this;
    }
    Explosion.prototype.onAdd = function () {
        var e_49, _a;
        _super.prototype.onAdd.call(this);
        var toDamages = this.world.select.overlap(this.bounds, ['player', 'enemies']);
        try {
            for (var toDamages_1 = __values(toDamages), toDamages_1_1 = toDamages_1.next(); !toDamages_1_1.done; toDamages_1_1 = toDamages_1.next()) {
                var toDamage = toDamages_1_1.value;
                if (toDamage instanceof Player && !toDamage.immune) {
                    toDamage.damage();
                }
                if (toDamage instanceof Enemy && !toDamage.immune) {
                    toDamage.damage(1);
                }
            }
        }
        catch (e_49_1) { e_49 = { error: e_49_1 }; }
        finally {
            try {
                if (toDamages_1_1 && !toDamages_1_1.done && (_a = toDamages_1.return)) _a.call(toDamages_1);
            }
            finally { if (e_49) throw e_49.error; }
        }
        this.world.playSound('explode');
    };
    return Explosion;
}(Sprite));
/// <reference path="./enemy.ts"/>
var Golbin = /** @class */ (function (_super) {
    __extends(Golbin, _super);
    function Golbin(config) {
        var _this = _super.call(this, __assign({ bounds: new CircleBounds(0, -4, 8), animations: [
                Animations.fromTextureList({ name: 'idle', texturePrefix: 'golbin', textures: [0, 1, 2], frameRate: 8, count: -1 }),
                Animations.fromTextureList({ name: 'run', texturePrefix: 'golbin', textures: [4, 5, 6, 7], frameRate: 8, count: -1, overrides: {
                        2: { callback: function () { _this.world.playSound('walk'); } }
                    }
                }),
                Animations.fromTextureList({ name: 'drawback', texturePrefix: 'golbin', textures: [8, 9, 10, 11, 10, 11, 10, 11, 11, 11], frameRate: 6 })
            ], defaultAnimation: 'idle', effects: { outline: { color: 0x000000 } }, maxHealth: 1.2, immuneTime: 0.5, weight: 1, speed: 100, deadTexture: 'golbin_dead' }, config)) || this;
        _this.bulletSpeed = 100;
        _this.willShootNext = true;
        _this.stateMachine.addState('start', {
            script: S.wait(Random.float(0, 1)),
            transitions: [
                { toState: 'idle' },
            ]
        });
        _this.stateMachine.addState('idle', {
            script: S.chain(S.wait(Random.float(0.8, 1.2)), S.call(function () {
                _this.pickNextTargetPos();
                _this.willShootNext = !_this.willShootNext;
            })),
            transitions: [
                { toState: 'shooting', condition: function () { return _this.willShootNext; } },
                { toState: 'walking', condition: function () { return !_this.willShootNext; } },
            ]
        });
        _this.stateMachine.addState('walking', {
            transitions: [
                { toState: 'idle', condition: function () { return M.distance(_this.x, _this.y, _this.targetPos.x, _this.targetPos.y) < 4; } },
            ]
        });
        _this.stateMachine.addState('shooting', {
            script: S.chain(S.playAnimation(_this, 'drawback'), S.call(function () {
                _this.shoot({ x: _this.attacking.x - _this.x, y: _this.attacking.y - _this.y });
            })),
            transitions: [
                { toState: 'idle' },
            ]
        });
        _this.stateMachine.setState('start');
        _this.targetPos = { x: 0, y: 0 };
        return _this;
    }
    Golbin.prototype.update = function () {
        this.ai();
        if (this.state === 'idle') {
            this.playAnimation('idle');
        }
        else if (this.state === 'walking') {
            this.v = { x: this.targetPos.x - this.x, y: this.targetPos.y - this.y };
            this.setSpeed(this.speed);
            if (this.v.x < 0)
                this.flipX = true;
            if (this.v.x > 0)
                this.flipX = false;
            this.playAnimation('run');
        }
        else if (this.state === 'shooting') {
            var player = global.world.select.type(Player);
            if (player.x < this.x)
                this.flipX = true;
            if (player.x > this.x)
                this.flipX = false;
        }
        _super.prototype.update.call(this);
    };
    Golbin.prototype.damage = function (amount) {
        var _this = this;
        _super.prototype.damage.call(this, amount);
        this.setState('idle');
        this.runScript(S.chain(S.call(function () {
            _this.effects.silhouette.color = 0xFFFFFF;
            _this.effects.silhouette.enabled = true;
        }), S.loopFor(8, S.chain(S.wait(this.immuneTime / 8), S.call(function () {
            _this.effects.silhouette.enabled = !_this.effects.silhouette.enabled;
        }))), S.call(function () {
            _this.effects.silhouette.enabled = false;
        })));
    };
    Golbin.prototype.shoot = function (d) {
        var bullet = this.world.addWorldObject(new Bullet({
            x: this.x,
            y: this.y - 4,
            vx: d.x, vy: d.y,
            name: 'bullet',
            layer: this.layer,
            physicsGroup: 'bullets',
        }));
        bullet.setSpeed(this.bulletSpeed);
        this.world.playSound('shoot');
    };
    Golbin.prototype.onCollide = function (other) {
        _super.prototype.onCollide.call(this, other);
        if (other.physicsGroup === 'walls') {
            this.setState('idle');
        }
    };
    Golbin.prototype.ai = function () {
        if (!this.attacking)
            this.attacking = this.world.select.type(Player);
    };
    Golbin.prototype.pickNextTargetPos = function () {
        var _this = this;
        if (this.x < 64 || this.x > 706 || this.y < 338 || this.y > 704) {
            // Too close to edge of room
            var candidates_1 = A.range(20).map(function (i) {
                return { x: Random.float(64, 706), y: Random.float(338, 704) };
            });
            this.targetPos = M.argmin(candidates_1, function (pos) { return M.distance(_this.x, _this.y, pos.x, pos.y); });
            return;
        }
        var candidates = A.range(3).map(function (i) {
            var d = Random.inDisc(50, 100);
            d.x += _this.x;
            d.y += _this.y;
            return d;
        });
        this.targetPos = M.argmin(candidates, function (pos) { return Math.abs(M.distance(_this.attacking.x, _this.attacking.y, pos.x, pos.y) - 150); });
    };
    return Golbin;
}(Enemy));
var Hoop = /** @class */ (function (_super) {
    __extends(Hoop, _super);
    function Hoop(config) {
        var _this = _super.call(this, __assign({ texture: 'hoop', bounds: new CircleBounds(0, 0, 50) }, config)) || this;
        _this.bounceSpeed = 75;
        _this.strengthThreshold = 0.3;
        _this.radius = 47;
        _this.currentAttackStrength = 0;
        return _this;
    }
    Hoop.prototype.update = function () {
        if (!this.swingSound) {
            this.swingSound = this.world.playSound('swing');
            this.swingSound.loop = true;
            this.swingSound.volume = 0;
        }
        _super.prototype.update.call(this);
        var player = this.world.select.type(Player);
        var px = player.x;
        var py = player.y - 4;
        var radius = this.radius - player.radius;
        var d = M.distance(px, py, this.x, this.y);
        if (d > radius) {
            var adx = px - this.x;
            var ady = py - this.y;
            var dx = adx * radius / d;
            var dy = ady * radius / d;
            this.x = px - dx;
            this.y = py - dy;
            this.v.x += (adx - dx) * this.bounceSpeed;
            this.v.y += (ady - dy) * this.bounceSpeed;
        }
        this.v.x = M.lerpTime(this.v.x, 0, 1.2, this.delta);
        this.v.y = M.lerpTime(this.v.y, 0, 1.2, this.delta);
        this.setStrength(player);
        this.mass = M.clamp(this.currentAttackStrength, 0.1, 1);
        var visibleAttackStrength = M.clamp(this.currentAttackStrength, 0, 1);
        this.effects.silhouette.enabled = true;
        this.effects.silhouette.color = 0x00FFFF;
        this.effects.silhouette.amount = M.clamp(Math.pow(visibleAttackStrength, 2), 0, 1);
        this.swingSound.volume = visibleAttackStrength;
        this.swingSound.speed = visibleAttackStrength;
    };
    Hoop.prototype.postUpdate = function () {
        _super.prototype.postUpdate.call(this);
        var player = this.world.select.type(Player);
        if (!isFinite(this.x))
            this.x = player.x;
        if (!isFinite(this.y))
            this.y = player.y;
    };
    Hoop.prototype.isStrongEnoughToDealDamage = function () {
        return this.currentAttackStrength > this.strengthThreshold;
    };
    Hoop.prototype.getPerpendicularSpeed = function (player) {
        var dx = this.x - player.x;
        var dy = this.y - player.y;
        if (dx === 0 && dy === 0) {
            return 0;
        }
        return Math.abs(dx * this.v.y - dy * this.v.x) / M.magnitude(dx, dy);
    };
    Hoop.prototype.setStrength = function (player) {
        var perpendicularStrengthComp = this.getPerpendicularSpeed(player) / 500;
        perpendicularStrengthComp = Math.pow(perpendicularStrengthComp, 4);
        this.currentAttackStrength = M.clamp(perpendicularStrengthComp, 0, 1);
        if (!_.isEmpty(this.world.select.overlap(this.bounds, ['walls']))) {
            this.currentAttackStrength = 0;
        }
    };
    return Hoop;
}(Sprite));
var ImmunitySm = /** @class */ (function (_super) {
    __extends(ImmunitySm, _super);
    function ImmunitySm(immuneTime) {
        var _this = _super.call(this) || this;
        _this.addState('vulnerable', {});
        _this.addState('immune', {
            script: S.wait(immuneTime),
            transitions: [
                { toState: 'vulnerable' },
            ]
        });
        _this.setState('vulnerable');
        return _this;
    }
    ImmunitySm.prototype.isImmune = function () {
        return this.getCurrentStateName() === 'immune';
    };
    ImmunitySm.prototype.setImmune = function () {
        this.setState('immune');
    };
    return ImmunitySm;
}(StateMachine));
/// <reference path="./enemy.ts"/>
var Knight = /** @class */ (function (_super) {
    __extends(Knight, _super);
    function Knight(config) {
        var _this = _super.call(this, __assign({ bounds: new CircleBounds(0, -4, 8), animations: [
                Animations.fromTextureList({ name: 'idle', texturePrefix: 'enemyknight', textures: [0, 1, 2], frameRate: 8, count: -1 }),
                Animations.fromTextureList({ name: 'run', texturePrefix: 'enemyknight', textures: [4, 5, 6, 7], frameRate: 8, count: -1, overrides: {
                        2: { callback: function () { _this.world.playSound('walk'); } }
                    }
                }),
                Animations.fromTextureList({ name: 'windup', texturePrefix: 'enemyknight', textures: [8], frameRate: 4, count: -1 })
            ], defaultAnimation: 'idle', effects: { outline: { color: 0x000000 } }, maxHealth: 1.5, immuneTime: 0.5, weight: 1, speed: 100, deadTexture: 'enemyknight_dead' }, config)) || this;
        var lightTint = _this.tint === 0xFFFFFF ? 0x00FFFF : _this.tint - 0xFF0000;
        var lightTexture = new AnchoredTexture(0, 0, Texture.filledRect(1024, 16, lightTint, 0.5));
        lightTexture.anchorX = 1 / 128;
        lightTexture.anchorY = 1 / 2;
        _this.light = _this.addChild(new Sprite({
            x: 0, y: -4,
            texture: lightTexture,
            alpha: 0,
            layer: 'bg'
        }));
        _this.willDashNext = true;
        _this.stateMachine.addState('start', {
            script: S.wait(Random.float(0, 1)),
            transitions: [
                { toState: 'idle' },
            ]
        });
        _this.stateMachine.addState('idle', {
            callback: function () {
                _this.light.alpha = 0;
            },
            script: S.chain(S.wait(Random.float(0.8, 1.2)), S.call(function () {
                _this.pickNextTargetPos();
                _this.willDashNext = !_this.willDashNext;
            })),
            transitions: [
                { toState: 'dash', condition: function () { return _this.willDashNext; } },
                { toState: 'walking', condition: function () { return !_this.willDashNext; } },
            ]
        });
        _this.stateMachine.addState('walking', {
            transitions: [
                { toState: 'idle', condition: function () { return M.distance(_this.x, _this.y, _this.targetPos.x, _this.targetPos.y) < 4; } },
            ]
        });
        _this.stateMachine.addState('dash', {
            script: S.chain(S.call(function () {
                _this.playAnimation('windup');
            }), S.doOverTime(0.5, function (t) { return _this.z = M.jumpParabola(0, 16, 0, t); }), S.doOverTime(1, function (t) {
                _this.pickNextTargetPosForDash();
                _this.light.angle = M.radToDeg(Math.atan2(_this.targetPos.y - _this.y, _this.targetPos.x - _this.x));
                _this.light.alpha = t;
                _this.flipX = (_this.attacking.x < _this.x);
            }), S.wait(1.5), S.call(function () {
                _this.lastPos.x = _this.x;
                _this.lastPos.y = _this.y;
                _this.light.alpha = 0;
                _this.world.playSound('dash');
            }), S.doOverTime(0.3, function (t) {
                _this.x = M.lerp(_this.lastPos.x, _this.targetPos.x, t);
                _this.y = M.lerp(_this.lastPos.y, _this.targetPos.y, t);
            })),
            transitions: [
                { toState: 'idle' },
            ]
        });
        _this.stateMachine.setState('start');
        _this.lastPos = { x: 0, y: 0 };
        _this.targetPos = { x: 0, y: 0 };
        return _this;
    }
    Knight.prototype.update = function () {
        this.ai();
        if (this.state === 'idle') {
            this.playAnimation('idle');
        }
        else if (this.state === 'walking') {
            this.v = { x: this.targetPos.x - this.x, y: this.targetPos.y - this.y };
            V.setMagnitude(this.v, this.speed);
            if (this.v.x < 0)
                this.flipX = true;
            if (this.v.x > 0)
                this.flipX = false;
            this.playAnimation('run');
        }
        else if (this.state === 'shooting') {
            var player = global.world.select.type(Player);
            if (player.x < this.x)
                this.flipX = true;
            if (player.x > this.x)
                this.flipX = false;
        }
        _super.prototype.update.call(this);
    };
    Knight.prototype.damage = function (amount) {
        var _this = this;
        _super.prototype.damage.call(this, amount);
        this.setState('idle');
        this.runScript(S.chain(S.call(function () {
            _this.effects.silhouette.color = 0xFFFFFF;
            _this.effects.silhouette.enabled = true;
        }), S.loopFor(8, S.chain(S.wait(this.immuneTime / 8), S.call(function () {
            _this.effects.silhouette.enabled = !_this.effects.silhouette.enabled;
        }))), S.call(function () {
            _this.effects.silhouette.enabled = false;
        })));
    };
    Knight.prototype.onCollide = function (other) {
        _super.prototype.onCollide.call(this, other);
        if (other.physicsGroup === 'walls') {
            this.setState('idle');
        }
    };
    Knight.prototype.ai = function () {
        if (!this.attacking)
            this.attacking = this.world.select.type(Player);
    };
    Knight.prototype.pickNextTargetPos = function () {
        var _this = this;
        if (this.x < 64 || this.x > 706 || this.y < 338 || this.y > 704) {
            // Too close to edge of room
            var candidates_2 = A.range(20).map(function (i) {
                return { x: Random.float(64, 706), y: Random.float(338, 704) };
            });
            this.targetPos = M.argmin(candidates_2, function (pos) { return M.distance(_this.x, _this.y, pos.x, pos.y); });
            return;
        }
        var candidates = A.range(3).map(function (i) {
            var d = Random.inDisc(50, 100);
            d.x += _this.x;
            d.y += _this.y;
            return d;
        });
        this.targetPos = M.argmin(candidates, function (pos) { return Math.abs(M.distance(_this.attacking.x, _this.attacking.y, pos.x, pos.y) - 150); });
    };
    Knight.prototype.pickNextTargetPosForDash = function () {
        var d = { x: this.attacking.x - this.x, y: this.attacking.y - this.y };
        if (V.magnitude(d) < 300)
            V.setMagnitude(d, 300);
        this.targetPos.x = this.x + d.x;
        this.targetPos.y = this.y + d.y;
    };
    return Knight;
}(Enemy));
/// <reference path="./enemy.ts"/>
var Mage = /** @class */ (function (_super) {
    __extends(Mage, _super);
    function Mage(config) {
        var _this = _super.call(this, __assign({ bounds: new CircleBounds(0, -4, 8), animations: [
                Animations.fromTextureList({ name: 'idle', texturePrefix: 'mage', textures: [0, 1, 2], frameRate: 8, count: -1 }),
                Animations.fromTextureList({ name: 'run', texturePrefix: 'mage', textures: [4, 5], frameRate: 4, count: -1, overrides: {
                        2: { callback: function () { _this.world.playSound('walk'); } }
                    }
                }),
                Animations.fromTextureList({ name: 'wave', texturePrefix: 'mage', textures: [8, 9], frameRate: 2, count: -1 })
            ], defaultAnimation: 'idle', effects: { outline: { color: 0x000000 } }, maxHealth: 1, immuneTime: 0.5, weight: 1, speed: 70, deadTexture: 'mage_dead' }, config)) || this;
        _this.willSpawnNext = true;
        _this.stateMachine.addState('start', {
            script: S.wait(Random.float(0, 1)),
            transitions: [
                { toState: 'idle' },
            ]
        });
        _this.stateMachine.addState('idle', {
            script: S.chain(S.wait(Random.float(1.4, 2)), S.call(function () {
                _this.pickNextTargetPos();
                _this.willSpawnNext = !_this.willSpawnNext;
                if (_this.world.select.typeAll(Runner).length >= Mage.MAX_RUNNERS) {
                    _this.willSpawnNext = false;
                }
            })),
            transitions: [
                { toState: 'spawn', condition: function () { return _this.willSpawnNext; } },
                { toState: 'walking', condition: function () { return !_this.willSpawnNext; } },
            ]
        });
        _this.stateMachine.addState('walking', {
            transitions: [
                { toState: 'idle', condition: function () { return M.distance(_this.x, _this.y, _this.targetPos.x, _this.targetPos.y) < 4; } },
            ]
        });
        _this.stateMachine.addState('spawn', {
            script: S.chain(S.wait(1), S.call(function () {
                _this.pickNextSpawnTargetPos();
                _this.spawn();
            }), S.doOverTime(1, function (t) { return _this.effects.outline.color = M.vec3ToColor([0, t, t]); }), S.wait(1), S.doOverTime(0.2, function (t) { return _this.effects.outline.color = M.vec3ToColor([0, 1 - t, 1 - t]); })),
            transitions: [
                { toState: 'idle' },
            ]
        });
        _this.stateMachine.setState('start');
        _this.targetPos = { x: 0, y: 0 };
        return _this;
    }
    Mage.prototype.update = function () {
        this.ai();
        if (this.state === 'idle') {
            this.playAnimation('idle');
        }
        else if (this.state === 'walking') {
            this.v = { x: this.targetPos.x - this.x, y: this.targetPos.y - this.y };
            V.setMagnitude(this.v, this.speed);
            if (this.v.x < 0)
                this.flipX = true;
            if (this.v.x > 0)
                this.flipX = false;
            this.playAnimation('run');
        }
        else if (this.state === 'spawn') {
            this.playAnimation('wave');
            var player = global.world.select.type(Player);
            if (player.x < this.x)
                this.flipX = true;
            if (player.x > this.x)
                this.flipX = false;
        }
        _super.prototype.update.call(this);
    };
    Mage.prototype.damage = function (amount) {
        var _this = this;
        _super.prototype.damage.call(this, amount);
        this.setState('idle');
        this.runScript(S.chain(S.call(function () {
            _this.effects.silhouette.color = 0xFFFFFF;
            _this.effects.silhouette.enabled = true;
        }), S.loopFor(8, S.chain(S.wait(this.immuneTime / 8), S.call(function () {
            _this.effects.silhouette.enabled = !_this.effects.silhouette.enabled;
        }))), S.call(function () {
            _this.effects.silhouette.enabled = false;
        })));
    };
    Mage.prototype.spawn = function () {
        this.world.addWorldObject(spawn(new Runner({
            x: this.targetPos.x, y: this.targetPos.y,
            layer: 'main',
            physicsGroup: 'enemies'
        })));
    };
    Mage.prototype.onCollide = function (other) {
        _super.prototype.onCollide.call(this, other);
        if (other.physicsGroup === 'walls') {
            this.setState('idle');
        }
    };
    Mage.prototype.ai = function () {
        if (!this.attacking)
            this.attacking = this.world.select.type(Player);
    };
    Mage.prototype.pickNextTargetPos = function () {
        var _this = this;
        if (this.x < 64 || this.x > 706 || this.y < 338 || this.y > 704) {
            // Too close to edge of room
            var candidates_3 = A.range(20).map(function (i) {
                return { x: Random.float(64, 706), y: Random.float(338, 704) };
            });
            this.targetPos = M.argmin(candidates_3, function (pos) { return M.distance(_this.x, _this.y, pos.x, pos.y); });
            return;
        }
        var candidates = A.range(3).map(function (i) {
            var d = Random.inDisc(50, 100);
            d.x += _this.x;
            d.y += _this.y;
            return d;
        });
        this.targetPos = M.argmin(candidates, function (pos) { return Math.abs(M.distance(_this.attacking.x, _this.attacking.y, pos.x, pos.y) - 150); });
    };
    Mage.prototype.pickNextSpawnTargetPos = function () {
        this.targetPos = Random.inDisc(16, 32);
        this.targetPos.x += this.x;
        this.targetPos.y += this.y;
    };
    Mage.MAX_RUNNERS = 4;
    return Mage;
}(Enemy));
/// <reference path="../lectvs/menu/menu.ts" />
var IntroMenu = /** @class */ (function (_super) {
    __extends(IntroMenu, _super);
    function IntroMenu(menuSystem) {
        var _this = _super.call(this, menuSystem) || this;
        _this.backgroundColor = 0x000000;
        var introtext = _this.addWorldObject(new SpriteText({
            x: global.gameWidth / 2, y: global.gameHeight / 2,
            text: "- a game by hayden mccraw -",
            anchor: Anchor.CENTER
        }));
        _this.runScript(S.chain(S.wait(1.5), S.call(function () { return introtext.setText("- made in 48 hours\n  for ludum dare 47 -"); }), S.wait(1.5), S.call(function () { return menuSystem.loadMenu(MainMenu); })));
        return _this;
    }
    return IntroMenu;
}(Menu));
var MainMenu = /** @class */ (function (_super) {
    __extends(MainMenu, _super);
    function MainMenu(menuSystem) {
        var _this = _super.call(this, menuSystem) || this;
        _this.backgroundColor = 0x000000;
        _this.volume = 0;
        _this.addWorldObject(new SpriteText({
            x: 20, y: 20,
            text: "- HOOP KNIGHT -"
        }));
        _this.addWorldObject(new MenuTextButton({
            x: 20, y: 50,
            text: "play normal mode",
            onClick: function () {
                HARD_DIFFICULTY = false;
                _this.menuSystem.game.playSound('click');
                menuSystem.game.startGame();
            }
        }));
        _this.addWorldObject(new MenuTextButton({
            x: 20, y: 68,
            text: "play hard mode (no health regen)",
            onClick: function () {
                HARD_DIFFICULTY = true;
                _this.menuSystem.game.playSound('click');
                menuSystem.game.startGame();
            }
        }));
        _this.addWorldObject(new MenuTextButton({
            x: 20, y: 100,
            text: "controls",
            onClick: function () {
                _this.menuSystem.game.playSound('click');
                menuSystem.loadMenu(ControlsMenu);
            }
        }));
        _this.addWorldObject(new SpriteText({
            x: 100, y: 100,
            text: "<-- read me!",
            style: { color: 0xFFFF00 }
        }));
        return _this;
    }
    return MainMenu;
}(Menu));
var PauseMenu = /** @class */ (function (_super) {
    __extends(PauseMenu, _super);
    function PauseMenu(menuSystem) {
        var _this = _super.call(this, menuSystem) || this;
        _this.backgroundColor = 0x000000;
        _this.volume = 0;
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
            x: 20, y: 80,
            text: "options",
            onClick: function () {
                _this.menuSystem.game.playSound('click');
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
        var _this = _super.call(this, menuSystem) || this;
        _this.backgroundColor = 0x000000;
        _this.volume = 0;
        _this.addWorldObject(new SpriteText({
            x: 20, y: 20,
            text: "- options -"
        }));
        _this.addWorldObject(new SpriteText({
            x: 20, y: 50,
            text: "volume:"
        }));
        _this.addWorldObject(new MenuNumericSelector({
            x: 84, y: 50,
            barLength: 10,
            minValue: 0,
            maxValue: 1,
            getValue: function () { return Options.getOption('volume'); },
            setValue: function (v) { return Options.updateOption('volume', v); }
        }));
        var backButton = _this.addWorldObject(new MenuTextButton({
            x: 20, y: 110,
            text: "back",
            onClick: function () {
                _this.menuSystem.game.playSound('click');
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
var ControlsMenu = /** @class */ (function (_super) {
    __extends(ControlsMenu, _super);
    function ControlsMenu(menuSystem) {
        var _this = _super.call(this, menuSystem) || this;
        _this.backgroundColor = 0x000000;
        _this.volume = 0;
        _this.addWorldObject(new SpriteText({
            x: 20, y: 15,
            text: "- controls -"
        }));
        _this.addWorldObject(new SpriteText({
            x: 20, y: 42,
            text: "WASD or ARROW KEYS - move\n\nswing the hoop faster to deal more damage!"
        }));
        var player = _this.addWorldObject(new Player({
            x: 250, y: 180,
            effects: { outline: { color: 0xFFFFFF } }
        }));
        _this.addWorldObject(new Hoop({
            x: 240, y: 180
        }));
        _this.addWorldObject(new MenuTextButton({
            x: 20, y: 240,
            text: "back",
            onClick: function () {
                _this.menuSystem.game.playSound('click');
                menuSystem.back();
            }
        }));
        _this.runScript(S.chain(S.loopFor(2, S.chain(S.doOverTime(0.4, function (t) { player.controller.right = true; }), S.doOverTime(0.4, function (t) { player.controller.down = true; }), S.doOverTime(0.4, function (t) { player.controller.left = true; }), S.doOverTime(0.4, function (t) { player.controller.up = true; }))), S.loopFor(Infinity, S.chain(S.doOverTime(0.2, function (t) { player.controller.right = true; }), S.doOverTime(0.2, function (t) { player.controller.down = true; }), S.doOverTime(0.2, function (t) { player.controller.left = true; }), S.doOverTime(0.2, function (t) { player.controller.up = true; })))));
        return _this;
    }
    return ControlsMenu;
}(Menu));
/// <reference path="./menus.ts"/>
Main.loadConfig({
    gameCodeName: "HoopKnight",
    gameWidth: 400,
    gameHeight: 300,
    canvasScale: 2,
    backgroundColor: 0x000000,
    preloadBackgroundColor: 0x000000,
    preloadProgressBarColor: 0xFFFFFF,
    textures: Assets.textures,
    sounds: Assets.sounds,
    pyxelTilemaps: Assets.pyxelTilemaps,
    spriteTextTags: Assets.spriteTextTags,
    defaultZBehavior: 'threequarters',
    defaultSpriteTextFont: Assets.fonts.DELUXE16,
    defaultOptions: {
        volume: 1,
        controls: {
            // Game
            'left': ['ArrowLeft', 'a'],
            'right': ['ArrowRight', 'd'],
            'up': ['ArrowUp', 'w'],
            'down': ['ArrowDown', 's'],
            'interact': ['e'],
            // Presets
            'game_advanceDialog': ['MouseLeft', 'e', ' '],
            'game_pause': ['Escape', 'Backspace'],
            'game_closeMenu': ['Escape', 'Backspace'],
            'game_select': ['MouseLeft'],
            'debug_moveCameraUp': ['i'],
            'debug_moveCameraDown': ['k'],
            'debug_moveCameraLeft': ['j'],
            'debug_moveCameraRight': ['l'],
            'debug_recordMetrics': ['0'],
            'debug_showMetricsMenu': ['9'],
            'debug_toggleOverlay': ['o'],
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
        entryPointMenuClass: IntroMenu,
        pauseMenuClass: PauseMenu,
        theaterConfig: {
            getStages: getStages,
            stageToLoad: 'game',
            stageEntryPoint: 'main',
            story: {
                getStoryboard: getStoryboard,
                storyboardPath: ['start'],
                getStoryEvents: function () { return StoryEvent.EMPTY_MAP; },
                getStoryConfig: function () { return StoryConfig.EMPTY; },
            },
            getParty: function () { return Party.EMPTY; },
            dialogBox: function () { return new DialogBox({
                x: 200, y: 250,
                texture: 'dialogbox',
                dialogFont: Assets.fonts.DELUXE16,
                textAreaFull: { x: -192, y: -42, width: 384, height: 84 },
                textAreaPortrait: { x: -200, y: -50, width: 400, height: 100 },
                portraitPosition: { x: 78, y: 0 },
                startSound: 'click',
            }); },
        },
    },
    debug: {
        debug: true,
        font: Assets.fonts.DELUXE16,
        fontStyle: { color: 0xFFFFFF },
        allPhysicsBounds: false,
        moveCameraWithArrows: true,
        showOverlay: true,
        overlayFeeds: [],
        skipRate: 10,
        programmaticInput: false,
        autoplay: true,
        skipMainMenu: true,
        frameStepEnabled: false,
        frameStepStepKey: '1',
        frameStepRunKey: '2',
        resetOptionsAtStart: true,
        experiments: {},
    },
});
function get(name) {
    var worldObject = global.game.theater.currentWorld.select.name(name);
    if (worldObject)
        return worldObject;
    return undefined;
}
var HARD_DIFFICULTY = false;
var Player = /** @class */ (function (_super) {
    __extends(Player, _super);
    function Player(config) {
        if (config === void 0) { config = {}; }
        var _this = _super.call(this, __assign({ bounds: new CircleBounds(0, -4, 8), animations: [
                Animations.fromTextureList({ name: 'idle', texturePrefix: 'knight', textures: [0, 1, 2], frameRate: 8, count: -1 }),
                Animations.fromTextureList({ name: 'run', texturePrefix: 'knight', textures: [4, 5, 6, 7], frameRate: 12, count: -1, overrides: {
                        2: { callback: function () { _this.world.playSound('walk'); } }
                    }
                }),
            ], defaultAnimation: 'idle', effects: { outline: { color: 0x000000 } } }, config)) || this;
        _this.immuneTime = 1;
        _this.speed = 128;
        _this.radius = 6;
        _this.controllerSchema = {
            left: function () { return Input.isDown('left'); },
            right: function () { return Input.isDown('right'); },
            up: function () { return Input.isDown('up'); },
            down: function () { return Input.isDown('down'); },
        };
        _this.immunitySm = new ImmunitySm(_this.immuneTime);
        _this.health = Player.MAX_HP;
        return _this;
    }
    Object.defineProperty(Player.prototype, "immune", {
        get: function () { return this.immunitySm.isImmune(); },
        enumerable: false,
        configurable: true
    });
    Player.prototype.update = function () {
        var haxis = (this.controller.left ? -1 : 0) + (this.controller.right ? 1 : 0);
        var vaxis = (this.controller.up ? -1 : 0) + (this.controller.down ? 1 : 0);
        this.v.x = haxis * this.speed;
        this.v.y = vaxis * this.speed;
        this.immunitySm.update(this.delta);
        _super.prototype.update.call(this);
        if (haxis < 0)
            this.flipX = true;
        if (haxis > 0)
            this.flipX = false;
        if (haxis === 0 && vaxis == 0) {
            this.playAnimation('idle');
        }
        else {
            this.playAnimation('run');
        }
    };
    Player.prototype.damage = function () {
        var _this = this;
        if (this.health <= 0)
            return;
        this.health -= 1;
        var loops = 8;
        if (this.health <= 0) {
            loops = Infinity;
        }
        this.immunitySm.setImmune();
        this.runScript(S.chain(S.call(function () {
            _this.effects.silhouette.color = 0xFFFFFF;
            _this.effects.silhouette.enabled = true;
        }), S.loopFor(loops, S.chain(S.wait(this.immuneTime / 8), S.call(function () {
            _this.effects.silhouette.enabled = !_this.effects.silhouette.enabled;
        }))), S.call(function () {
            _this.effects.silhouette.enabled = false;
        })));
        this.world.playSound('hitplayer');
    };
    Player.prototype.onCollide = function (other) {
        _super.prototype.onCollide.call(this, other);
        if ((other instanceof Enemy || other instanceof Bullet) && !this.immune) {
            this.damage();
        }
    };
    Player.MAX_HP = 5;
    return Player;
}(Sprite));
/// <reference path="./enemy.ts"/>
var Runner = /** @class */ (function (_super) {
    __extends(Runner, _super);
    function Runner(config) {
        var _this = _super.call(this, __assign({ bounds: new CircleBounds(0, -4, 8), animations: [
                Animations.fromTextureList({ name: 'idle', texturePrefix: 'runner', textures: [0, 1, 2], frameRate: 8, count: -1 }),
                Animations.fromTextureList({ name: 'run', texturePrefix: 'runner', textures: [4, 5, 6, 7], frameRate: 8, count: -1, overrides: {
                        2: { callback: function () { _this.world.playSound('walk'); } }
                    }
                }),
            ], defaultAnimation: 'idle', effects: { outline: { color: 0xFFFFFF } }, maxHealth: 0.5, immuneTime: 0.5, weight: 1, speed: 50, deadTexture: 'runner_dead' }, config)) || this;
        _this.stateMachine.addState("idle", {
            script: S.wait(1),
            transitions: [{ toState: 'running' }],
        });
        _this.stateMachine.addState("running", {});
        _this.setState("idle");
        return _this;
    }
    Runner.prototype.update = function () {
        this.ai();
        if (this.state === 'running') {
            this.v = { x: this.attacking.x - this.x, y: this.attacking.y - this.y };
            V.setMagnitude(this.v, this.speed);
            if (this.v.x < 0)
                this.flipX = true;
            if (this.v.x > 0)
                this.flipX = false;
            this.playAnimation('run');
        }
        else {
            this.playAnimation('idle');
        }
        _super.prototype.update.call(this);
    };
    Runner.prototype.damage = function (amount) {
        var _this = this;
        _super.prototype.damage.call(this, amount);
        this.setState('idle');
        this.runScript(S.chain(S.call(function () {
            _this.effects.silhouette.color = 0xFFFFFF;
            _this.effects.silhouette.enabled = true;
        }), S.loopFor(8, S.chain(S.wait(this.immuneTime / 8), S.call(function () {
            _this.effects.silhouette.enabled = !_this.effects.silhouette.enabled;
        }))), S.call(function () {
            _this.effects.silhouette.enabled = false;
        })));
    };
    Runner.prototype.ai = function () {
        if (!this.attacking)
            this.attacking = this.world.select.type(Player);
    };
    return Runner;
}(Enemy));
function spawn(worldObject) {
    var spawn = new Sprite({
        name: 'spawn',
        layer: 'bg',
        x: worldObject.x, y: worldObject.y,
        texture: 'spawn',
        tint: 0x00FFFF,
        alpha: 0,
        onAdd: function (obj) {
            obj.runScript(S.chain(S.doOverTime(1, function (t) {
                obj.alpha = t;
            }), S.wait(1), S.call(function () {
                obj.world.addWorldObject(worldObject);
                obj.kill();
            })));
        }
    });
    return spawn;
}
function BASE_CAMERA_MOVEMENT() {
    return { type: 'smooth', speed: 10, deadZoneWidth: 40, deadZoneHeight: 30 };
}
function WORLD_BOUNDS(left, top, right, bottom, physicsGroup) {
    var thickness = 40;
    var width = right - left;
    var height = bottom - top;
    var worldBounds = new WorldObject();
    worldBounds.addChild(new PhysicsWorldObject({
        bounds: new RectBounds(left - thickness, top - thickness, thickness, height + 2 * thickness),
        physicsGroup: physicsGroup
    }));
    worldBounds.addChild(new PhysicsWorldObject({
        bounds: new RectBounds(right, top - thickness, thickness, height + 2 * thickness),
        physicsGroup: physicsGroup
    }));
    worldBounds.addChild(new PhysicsWorldObject({
        bounds: new RectBounds(left, top - thickness, width, thickness),
        physicsGroup: physicsGroup
    }));
    worldBounds.addChild(new PhysicsWorldObject({
        bounds: new RectBounds(left, bottom, width, thickness),
        physicsGroup: physicsGroup
    }));
    return worldBounds;
}
function getStages() {
    return {
        'game': function () {
            var world = new World({
                backgroundColor: 0x000000,
                layers: [
                    { name: 'bg' },
                    { name: 'hoop' },
                    { name: 'main', sortKey: function (obj) { return obj.y; } },
                    { name: 'king_shadow_start' },
                    { name: 'king_start' },
                    { name: 'fg' },
                ],
                physicsGroups: {
                    'player': {},
                    'hoop': {},
                    'enemies': {},
                    'bombs': {},
                    'bullets': {},
                    'deadbodies': {},
                    'walls': { immovable: true },
                },
                collisions: [
                    { move: 'player', from: 'enemies' },
                    { move: 'player', from: 'bullets' },
                    { move: 'player', from: 'walls' },
                    { move: 'enemies', from: 'walls' },
                    { move: 'bullets', from: 'walls' },
                    { move: 'bombs', from: 'walls' },
                    { move: 'bombs', from: 'enemies' },
                    { move: 'hoop', from: 'enemies', momentumTransfer: 'elastic', callback: function (hoop, enemy) {
                            if (enemy.damagableByHoop && !enemy.immune && hoop.isStrongEnoughToDealDamage()) {
                                enemy.damage(hoop.currentAttackStrength);
                            }
                        } },
                    { move: 'hoop', from: 'bombs', momentumTransfer: 'elastic', callback: function (hoop, bomb) {
                            if (hoop.isStrongEnoughToDealDamage()) {
                                global.world.playSound('hitenemy');
                            }
                        } },
                    { move: 'deadbodies', from: 'walls' },
                ],
                collisionIterations: 4,
                useRaycastDisplacementThreshold: 4,
            });
            world.camera.setModeFollow('player');
            world.camera.setMovement(BASE_CAMERA_MOVEMENT());
            world.entryPoints['main'] = { x: global.gameWidth / 2, y: global.gameHeight / 2 };
            world.addWorldObject(new UI());
            world.addWorldObject(new WaveController());
            world.addWorldObject(WORLD_BOUNDS(0, 192, 768, 768, 'walls'));
            world.addWorldObject(new Sprite({
                name: 'floor',
                texture: AssetCache.getTexture('floor').clone(),
                layer: 'bg'
            }));
            world.addWorldObject(new Sprite({
                name: 'lights',
                texture: 'lights',
                layer: 'fg'
            }));
            world.addWorldObject(new Sprite({
                x: 384, y: 340,
                name: 'stairs',
                texture: 'stairs',
                layer: 'main',
                bounds: new RectBounds(-78, -112, 156, 112),
                physicsGroup: 'walls'
            }));
            world.addWorldObject(new Throne({
                x: 384, y: 268,
                name: 'throne',
                layer: 'king_start',
                physicsGroup: 'enemies',
                colliding: false
            }));
            world.addWorldObject(new Sprite({
                x: 342, y: 352,
                name: 'guard',
                texture: 'enemyknight_0',
                tint: 0xFFFF00,
                effects: { outline: { color: 0x000000 } },
                animations: [
                    Animations.fromTextureList({ name: 'idle', texturePrefix: 'enemyknight', textures: [0, 1, 2], frameRate: 8, count: -1 })
                ],
                defaultAnimation: 'idle',
            }));
            world.addWorldObject(new Sprite({
                x: 428, y: 352,
                name: 'guard',
                texture: 'enemyknight_0',
                tint: 0xFF00FF,
                flipX: true,
                effects: { outline: { color: 0x000000 } },
                animations: [
                    Animations.fromTextureList({ name: 'idle', texturePrefix: 'enemyknight', textures: [0, 1, 2], frameRate: 8, count: -1 })
                ],
                defaultAnimation: 'idle',
            }));
            world.addWorldObject(new Player({
                x: 384, y: 750,
                name: 'player',
                layer: 'main',
                physicsGroup: 'player',
                controllable: true
            }));
            return world;
        },
    };
}
function getStoryboard() {
    return {
        'start': {
            type: 'start',
            transitions: [{ onStage: 'game', toNode: 'walk_to_throne' }]
        },
        'walk_to_throne': {
            type: 'gameplay',
            transitions: [{ toNode: 'intro', condition: function () {
                        return global.world.select.type(Player).y < 478;
                    } }]
        },
        'intro': {
            type: 'cutscene',
            script: function () {
                var player, hoop, whoosh, text;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, S.wait(0.5)];
                        case 1:
                            _a.sent();
                            global.world.camera.setModeFocus(384, 292);
                            global.world.camera.setMovementSmooth(4);
                            return [4 /*yield*/, S.wait(2)];
                        case 2:
                            _a.sent();
                            return [4 /*yield*/, S.dialog("Welcome, Knight. I have been awaiting you.")];
                        case 3:
                            _a.sent();
                            return [4 /*yield*/, S.dialog("You seek to prove thyself worthy of carrying the [y]ultimate weapon[/y]?")];
                        case 4:
                            _a.sent();
                            return [4 /*yield*/, S.dialog("Verily well. Test your strength in mortal combat!")];
                        case 5:
                            _a.sent();
                            global.world.camera.setModeFollow('player');
                            return [4 /*yield*/, S.wait(2)];
                        case 6:
                            _a.sent();
                            player = global.world.select.type(Player);
                            hoop = global.world.addWorldObject(new Hoop({
                                x: player.x, y: player.y - 32,
                                name: 'hoop',
                                layer: 'hoop',
                                effects: { silhouette: { color: 0x00FFFF, alpha: 0 } },
                                physicsGroup: 'hoop'
                            }));
                            whoosh = global.world.playSound('swing');
                            whoosh.speed = 0.1;
                            return [4 /*yield*/, S.doOverTime(1, function (t) { return hoop.effects.silhouette.alpha = t; })];
                        case 7:
                            _a.sent();
                            return [4 /*yield*/, S.wait(1)];
                        case 8:
                            _a.sent();
                            return [4 /*yield*/, S.doOverTime(1, function (t) {
                                    hoop.effects.silhouette.amount = 1 - t;
                                    hoop.y = M.lerp(player.y - 32, player.y - 4, t);
                                })];
                        case 9:
                            _a.sent();
                            global.world.playSound('walk').volume = 2;
                            return [4 /*yield*/, S.wait(2)];
                        case 10:
                            _a.sent();
                            global.world.playSound('jingle');
                            return [4 /*yield*/, S.simul(S.showSlide(function () { return new Slide({
                                    texture: Texture.filledRect(global.gameWidth, global.gameHeight, 0x000000, 0.8),
                                    timeToLoad: 2,
                                    fadeIn: true
                                }); }), S.showSlide(function () { return new Slide({
                                    texture: 'royalhulatext',
                                    timeToLoad: 2,
                                    fadeIn: true
                                }); }))];
                        case 11:
                            _a.sent();
                            text = global.theater.addWorldObject(new SpriteText({
                                x: global.gameWidth / 2, y: global.gameHeight / 2 + 60,
                                text: "sounds like a lot of HOOPLAH to me",
                                style: { alpha: 0 },
                                anchor: Anchor.TOP_CENTER
                            }));
                            return [4 /*yield*/, S.wait(2)];
                        case 12:
                            _a.sent();
                            return [4 /*yield*/, S.doOverTime(2, function (t) { return text.style.alpha = t; })];
                        case 13:
                            _a.sent();
                            _a.label = 14;
                        case 14:
                            if (!!Input.justDown('game_advanceDialog')) return [3 /*break*/, 16];
                            return [4 /*yield*/];
                        case 15:
                            _a.sent();
                            return [3 /*break*/, 14];
                        case 16: return [4 /*yield*/, S.simul(S.fadeSlides(1), S.doOverTime(1, function (t) { return text.style.alpha = 1 - t; }))];
                        case 17:
                            _a.sent();
                            text.removeFromWorld();
                            Debug.SKIP_RATE = 1;
                            return [2 /*return*/];
                    }
                });
            },
            transitions: [{ toNode: 'spawn_wave_1' }]
        },
        'gameplay': {
            type: 'gameplay',
            transitions: [
                { condition: function () { return global.world.select.type(WaveController).isWaveDefeated(1); }, delay: 0.5, toNode: 'spawn_wave_2' },
                { condition: function () { return global.world.select.type(WaveController).isWaveDefeated(2); }, delay: 0.5, toNode: 'spawn_wave_3' },
                { condition: function () { return global.world.select.type(WaveController).isWaveDefeated(3); }, delay: 0.5, toNode: 'spawn_wave_4' },
                { condition: function () { return global.world.select.type(WaveController).isWaveDefeated(4); }, delay: 0.5, toNode: 'spawn_wave_5' },
                { condition: function () { return global.world.select.type(WaveController).isWaveDefeated(5); }, delay: 0.5, toNode: 'spawn_wave_king' },
                { condition: function () { return global.world.select.type(WaveController).isWaveDefeated(9001); }, toNode: 'win' },
                { condition: function () { return global.world.select.type(Player).health <= 0; }, toNode: 'defeat' },
            ]
        },
        'spawn_wave_1': {
            type: 'cutscene',
            script: function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            global.world.camera.setModeFocus(384, 292);
                            return [4 /*yield*/, S.wait(2)];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, S.dialog("Duel'st in five rounds against my minions, and you may'st keep the [y]royal hula[/y].")];
                        case 2:
                            _a.sent();
                            return [4 /*yield*/, S.dialog("Round one beginneth now.")];
                        case 3:
                            _a.sent();
                            return [4 /*yield*/, S.wait(0.5)];
                        case 4:
                            _a.sent();
                            global.world.camera.setModeFollow('player');
                            return [4 /*yield*/, S.wait(1)];
                        case 5:
                            _a.sent();
                            global.world.camera.setMovement(BASE_CAMERA_MOVEMENT());
                            global.world.select.type(WaveController).spawnWave1();
                            global.world.select.type(WaveController).startMusic();
                            return [2 /*return*/];
                    }
                });
            },
            transitions: [{ toNode: 'gameplay' }]
        },
        'spawn_wave_2': {
            type: 'cutscene',
            script: function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            global.world.select.type(WaveController).stopMusic();
                            return [4 /*yield*/, S.wait(1)];
                        case 1:
                            _a.sent();
                            if (!HARD_DIFFICULTY)
                                global.world.select.type(Player).health = Player.MAX_HP;
                            global.world.camera.setModeFocus(384, 292);
                            return [4 /*yield*/, S.wait(2)];
                        case 2:
                            _a.sent();
                            return [4 /*yield*/, S.dialog("Very good. But this is'st only the beginning.")];
                        case 3:
                            _a.sent();
                            return [4 /*yield*/, S.dialog("Round two beginneth now.")];
                        case 4:
                            _a.sent();
                            return [4 /*yield*/, S.wait(0.5)];
                        case 5:
                            _a.sent();
                            global.world.camera.setModeFollow('player');
                            return [4 /*yield*/, S.wait(1)];
                        case 6:
                            _a.sent();
                            global.world.camera.setMovement(BASE_CAMERA_MOVEMENT());
                            global.world.select.type(WaveController).spawnWave2();
                            global.world.select.type(WaveController).startMusic();
                            return [2 /*return*/];
                    }
                });
            },
            transitions: [{ toNode: 'gameplay' }]
        },
        'spawn_wave_3': {
            type: 'cutscene',
            script: function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            global.world.select.type(WaveController).stopMusic();
                            return [4 /*yield*/, S.wait(1)];
                        case 1:
                            _a.sent();
                            if (!HARD_DIFFICULTY)
                                global.world.select.type(Player).health = Player.MAX_HP;
                            global.world.camera.setModeFocus(384, 292);
                            return [4 /*yield*/, S.wait(2)];
                        case 2:
                            _a.sent();
                            return [4 /*yield*/, S.dialog("I see you are'st very skilled with a hoop. But can thou handle these foes?")];
                        case 3:
                            _a.sent();
                            return [4 /*yield*/, S.dialog("Round three beginneth now.")];
                        case 4:
                            _a.sent();
                            return [4 /*yield*/, S.wait(0.5)];
                        case 5:
                            _a.sent();
                            global.world.camera.setModeFollow('player');
                            return [4 /*yield*/, S.wait(1)];
                        case 6:
                            _a.sent();
                            global.world.camera.setMovement(BASE_CAMERA_MOVEMENT());
                            global.world.select.type(WaveController).spawnWave3();
                            global.world.select.type(WaveController).startMusic();
                            return [2 /*return*/];
                    }
                });
            },
            transitions: [{ toNode: 'gameplay' }]
        },
        'spawn_wave_4': {
            type: 'cutscene',
            script: function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            global.world.select.type(WaveController).stopMusic();
                            return [4 /*yield*/, S.wait(1)];
                        case 1:
                            _a.sent();
                            if (!HARD_DIFFICULTY)
                                global.world.select.type(Player).health = Player.MAX_HP;
                            global.world.camera.setModeFocus(384, 292);
                            return [4 /*yield*/, S.wait(2)];
                        case 2:
                            _a.sent();
                            return [4 /*yield*/, S.dialog("Perhaps I'm going too easy on you.")];
                        case 3:
                            _a.sent();
                            return [4 /*yield*/, S.dialog("Prepare thyself for round four.")];
                        case 4:
                            _a.sent();
                            return [4 /*yield*/, S.wait(0.5)];
                        case 5:
                            _a.sent();
                            global.world.camera.setModeFollow('player');
                            return [4 /*yield*/, S.wait(1)];
                        case 6:
                            _a.sent();
                            global.world.camera.setMovement(BASE_CAMERA_MOVEMENT());
                            global.world.select.type(WaveController).spawnWave4();
                            global.world.select.type(WaveController).startMusic();
                            return [2 /*return*/];
                    }
                });
            },
            transitions: [{ toNode: 'gameplay' }]
        },
        'spawn_wave_5': {
            type: 'cutscene',
            script: function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            global.world.select.type(WaveController).stopMusic();
                            return [4 /*yield*/, S.wait(1)];
                        case 1:
                            _a.sent();
                            if (!HARD_DIFFICULTY)
                                global.world.select.type(Player).health = Player.MAX_HP;
                            global.world.camera.setModeFocus(384, 292);
                            return [4 /*yield*/, S.wait(2)];
                        case 2:
                            _a.sent();
                            return [4 /*yield*/, S.dialog("Impressive! One more round to go'eth, but this will be the hardest.")];
                        case 3:
                            _a.sent();
                            return [4 /*yield*/, S.wait(0.5)];
                        case 4:
                            _a.sent();
                            global.world.camera.setModeFollow('player');
                            return [4 /*yield*/, S.wait(1)];
                        case 5:
                            _a.sent();
                            global.world.camera.setMovement(BASE_CAMERA_MOVEMENT());
                            global.world.select.type(WaveController).spawnWave5();
                            global.world.select.type(WaveController).startMusic();
                            return [2 /*return*/];
                    }
                });
            },
            transitions: [{ toNode: 'gameplay' }]
        },
        'spawn_wave_king': {
            type: 'cutscene',
            script: function () {
                var throne, shakeSound;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            global.world.select.type(WaveController).stopMusic();
                            return [4 /*yield*/, S.wait(1)];
                        case 1:
                            _a.sent();
                            if (!HARD_DIFFICULTY)
                                global.world.select.type(Player).health = Player.MAX_HP;
                            throne = global.world.select.type(Throne);
                            global.world.camera.setModeFollow(throne, 0, -20);
                            global.world.camera.setMovementSmooth(4);
                            return [4 /*yield*/, S.wait(2)];
                        case 2:
                            _a.sent();
                            return [4 /*yield*/, S.dialog("Splendid!")];
                        case 3:
                            _a.sent();
                            return [4 /*yield*/, S.dialog("Thou hast defeated all of mine challenges. I bet you're happy to finally claim the [y]royal hula[/y] for thyself?")];
                        case 4:
                            _a.sent();
                            return [4 /*yield*/, S.dialog("...")];
                        case 5:
                            _a.sent();
                            return [4 /*yield*/, S.dialog("But I don't think I'll be parting with it so soon.")];
                        case 6:
                            _a.sent();
                            return [4 /*yield*/, S.dialog("If thou want'st it so bad... Heh heh heh...")];
                        case 7:
                            _a.sent();
                            return [4 /*yield*/, S.wait(0.5)];
                        case 8:
                            _a.sent();
                            shakeSound = global.world.playSound('shake');
                            shakeSound.loop = true;
                            return [4 /*yield*/, S.simul(S.shake(2, 7), S.chain(S.wait(3), S.call(function () {
                                    throne.setState('jump');
                                })))];
                        case 9:
                            _a.sent();
                            shakeSound.paused = true;
                            return [4 /*yield*/, S.wait(2)];
                        case 10:
                            _a.sent();
                            return [4 /*yield*/, S.dialog("Prove thyself worthy!")];
                        case 11:
                            _a.sent();
                            global.world.camera.setModeFollow('player');
                            return [4 /*yield*/, S.wait(1)];
                        case 12:
                            _a.sent();
                            global.world.camera.setMovement(BASE_CAMERA_MOVEMENT());
                            throne.setState('idle');
                            global.world.runScript(S.chain(S.wait(0.5), S.showSlide(function () { return new Slide({
                                texture: 'hoopkingtext',
                                timeToLoad: 2,
                                fadeIn: true
                            }); }), S.wait(3), S.fadeSlides(2)));
                            global.world.select.type(WaveController).spawnWaveKing();
                            global.world.select.type(WaveController).startMusic();
                            return [2 /*return*/];
                    }
                });
            },
            transitions: [{ toNode: 'gameplay' }]
        },
        'win': {
            type: 'cutscene',
            script: function () {
                var throne, shakeSound, text, text2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            global.world.select.type(WaveController).stopMusic();
                            throne = global.world.select.type(Throne);
                            global.world.camera.setModeFollow(throne, 0, -20);
                            global.world.camera.setMovementSmooth(4);
                            shakeSound = global.world.playSound('shake');
                            shakeSound.loop = true;
                            shakeSound.speed = 0.8;
                            return [4 /*yield*/, S.wait(3)];
                        case 1:
                            _a.sent();
                            if (!(global.world.select.type(Player).health > 0)) return [3 /*break*/, 5];
                            return [4 /*yield*/, S.dialog("Agh... you've done it...")];
                        case 2:
                            _a.sent();
                            return [4 /*yield*/, S.dialog("The hoop... it's yours... take it...")];
                        case 3:
                            _a.sent();
                            return [4 /*yield*/, S.dialog("Don't... bully me... anymore...")];
                        case 4:
                            _a.sent();
                            return [3 /*break*/, 10];
                        case 5: return [4 /*yield*/, S.dialog("But... but how...?")];
                        case 6:
                            _a.sent();
                            return [4 /*yield*/, S.dialog("You're dead too... how...?")];
                        case 7:
                            _a.sent();
                            return [4 /*yield*/, S.dialog("Just... take the hoop then...")];
                        case 8:
                            _a.sent();
                            return [4 /*yield*/, S.dialog("Don't... bully me... anymore...")];
                        case 9:
                            _a.sent();
                            _a.label = 10;
                        case 10: return [4 /*yield*/, S.wait(0.5)];
                        case 11:
                            _a.sent();
                            return [4 /*yield*/, S.simul(S.fadeOut(3, 0xFFFFFF), S.doOverTime(3, function (t) { return global.world.volume = 1 - t; }))];
                        case 12:
                            _a.sent();
                            return [4 /*yield*/, S.wait(1)];
                        case 13:
                            _a.sent();
                            text = global.theater.addWorldObject(new SpriteText({
                                x: global.gameWidth / 2, y: global.gameHeight / 2 - 8,
                                text: "and thus begins the tale of the...",
                                style: { color: 0x000000, alpha: 0 },
                                anchor: Anchor.TOP_CENTER
                            }));
                            return [4 /*yield*/, S.doOverTime(3, function (t) { return text.style.alpha = t; })];
                        case 14:
                            _a.sent();
                            return [4 /*yield*/, S.wait(2)];
                        case 15:
                            _a.sent();
                            text2 = global.theater.addWorldObject(new SpriteText({
                                x: global.gameWidth / 2, y: global.gameHeight / 2 + 8,
                                text: "HOOP KNIGHT",
                                style: { color: 0x000000, alpha: 0 },
                                anchor: Anchor.TOP_CENTER
                            }));
                            return [4 /*yield*/, S.doOverTime(3, function (t) { return text2.style.alpha = t; })];
                        case 16:
                            _a.sent();
                            return [4 /*yield*/, S.wait(5)];
                        case 17:
                            _a.sent();
                            return [4 /*yield*/, S.fadeOut(3)];
                        case 18:
                            _a.sent();
                            return [4 /*yield*/, S.wait(2)];
                        case 19:
                            _a.sent();
                            global.game.loadMainMenu();
                            return [2 /*return*/];
                    }
                });
            },
            transitions: []
        },
        'defeat': {
            type: 'cutscene',
            script: function () {
                var throne;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            throne = global.world.select.type(Throne);
                            throne.setState('passive');
                            return [4 /*yield*/, S.doOverTime(3, function (t) { return global.world.volume = 1 - t; })];
                        case 1:
                            _a.sent();
                            global.world.camera.setModeFollow(throne, 0, -20);
                            global.world.camera.setMovementSmooth(4);
                            return [4 /*yield*/, S.wait(3)];
                        case 2:
                            _a.sent();
                            return [4 /*yield*/, S.dialog("It seems... thou'st not worthy to bear the [y]ultimate weapon[/y].")];
                        case 3:
                            _a.sent();
                            return [4 /*yield*/, S.dialog("Such a shame...")];
                        case 4:
                            _a.sent();
                            return [4 /*yield*/, S.wait(0.5)];
                        case 5:
                            _a.sent();
                            return [4 /*yield*/, S.fadeOut(3)];
                        case 6:
                            _a.sent();
                            return [4 /*yield*/, S.wait(2)];
                        case 7:
                            _a.sent();
                            global.game.loadMainMenu();
                            return [2 /*return*/];
                    }
                });
            },
            transitions: []
        },
    };
}
var Throne = /** @class */ (function (_super) {
    __extends(Throne, _super);
    function Throne(config) {
        var _this = _super.call(this, __assign({ texture: 'throne', bounds: new RectBounds(-15, -24, 30, 24), immovable: true, maxHealth: 1003, immuneTime: 1, weight: 10, speed: 0, damagableByHoop: false }, config)) || this;
        _this.shadow = _this.addChild(new Sprite({
            x: -15, y: -22,
            texture: Texture.filledRect(30, 24, 0x000000, 0.5),
            layer: 'king_shadow_start'
        }));
        var lightTexture = new AnchoredTexture(0, 0, Texture.filledRect(1024, 64, 0xFF0000, 0.5));
        lightTexture.anchorX = 1 / 32;
        lightTexture.anchorY = 1 / 2;
        _this.light = _this.addChild(new Sprite({
            x: 0, y: -12,
            texture: lightTexture,
            alpha: 0,
            layer: 'bg'
        }));
        _this.king = _this.addChild(new Sprite({
            x: 0, y: 0, z: 20,
            animations: [
                Animations.fromTextureList({ name: 'idle', texturePrefix: 'king', textures: [0, 1, 2], frameRate: 4, count: -1 })
            ],
            defaultAnimation: 'idle',
            effects: { outline: { color: 0x000000 } },
            matchParentLayer: true
        }));
        _this.stateMachine = new ThroneBehaviorSm(_this);
        return _this;
    }
    Throne.prototype.update = function () {
        _super.prototype.update.call(this);
        var player = this.world.select.type(Player);
        if (player.x < this.king.x)
            this.king.flipX = true;
        if (player.x > this.king.x)
            this.king.flipX = false;
        this.shadow.z = 0;
        this.king.effects.silhouette.color = this.effects.silhouette.color;
        this.king.effects.silhouette.enabled = this.effects.silhouette.enabled;
        if (this.health === 1001) {
            this.tint = 0xFF0000;
            this.king.tint = 0xFF0000;
            this.timeScale = 2;
        }
        else if (this.health === 1002) {
            this.tint = 0xFF8888;
            this.king.tint = 0xFF8888;
            this.timeScale = 1.5;
        }
        else if (this.health === 1003) {
            this.tint = 0xFFFFFF;
            this.king.tint = 0xFFFFFF;
            this.timeScale = 1;
        }
        else {
            this.timeScale = 1;
        }
    };
    Throne.prototype.damage = function (amount) {
        var _this = this;
        _super.prototype.damage.call(this, amount);
        var loops = 8;
        if (this.health <= 1000) {
            loops = Infinity;
        }
        this.runScript(S.chain(S.call(function () {
            _this.effects.addSilhouette.color = 0xFFFFFF;
        }), S.loopFor(loops, S.chain(S.wait(this.immuneTime / 8), S.call(function () {
            _this.effects.silhouette.enabled = !_this.effects.silhouette.enabled;
        }))), S.call(function () {
            _this.effects.silhouette.enabled = false;
        })));
        if (this.health <= 1000) {
            this.setState('defeat');
        }
        else {
            this.setState('idle');
        }
    };
    Throne.prototype.spawnBomb = function () {
        this.world.addWorldObject(new Bomb({
            x: this.x, y: this.y, z: 50,
            layer: this.layer,
            physicsGroup: 'bombs'
        }));
    };
    Throne.prototype.onCollide = function (other) {
        _super.prototype.onCollide.call(this, other);
        if (other.physicsGroup === 'walls' && this.state === 'dash') {
            this.setState('vulnerable');
        }
        if (other instanceof Hoop && other.isStrongEnoughToDealDamage() && (!this.dinkSound || this.dinkSound.done)) {
            this.dinkSound = this.world.playSound('dink');
            this.dinkSound.volume = other.currentAttackStrength;
        }
    };
    return Throne;
}(Enemy));
var ThroneBehaviorSm = /** @class */ (function (_super) {
    __extends(ThroneBehaviorSm, _super);
    function ThroneBehaviorSm(throne) {
        var _this = _super.call(this) || this;
        _this.throne = throne;
        _this.lastPos = { x: 0, y: 0 };
        _this.targetPos = { x: 0, y: 0 };
        _this.jumpCount = 0;
        _this.addState('passive', {
            callback: function () {
                _this.throne.light.alpha = 0;
            }
        });
        _this.addState('jump', {
            script: S.chain(S.call(function () {
                _this.setLastPos();
                _this.setFirstJumpTargetPos();
                _this.throne.world.playSound('dash').volume = 0.6;
            }), S.doOverTime(1, function (t) { return _this.throne.z = 500 * t; }), S.wait(1), S.doOverTime(1, function (t) {
                _this.throne.x = M.lerp(_this.lastPos.x, _this.targetPos.x, t);
                _this.throne.y = M.lerp(_this.lastPos.y, _this.targetPos.y, t);
            }), S.call(function () {
                _this.throne.layer = 'main';
                _this.throne.king.layer = 'main';
                _this.throne.shadow.layer = 'bg';
            }), S.doOverTime(1, function (t) { return _this.throne.z = 500 - 500 * t; }), S.call(function () {
                _this.throne.world.playSound('land');
                _this.throne.colliding = true;
            })),
        });
        _this.addState('idle', {
            callback: function () {
                _this.jumpCount = 0;
            },
            script: S.wait(3),
            transitions: [
                { toState: 'small_jump' },
            ],
        });
        _this.addState('small_jump', {
            callback: function () {
                _this.jumpCount++;
            },
            script: S.chain(S.call(function () {
                _this.setLastPos();
                _this.setSmallJumpTargetPos();
                _this.throne.world.playSound('dash').volume = 0.4;
                _this.throne.colliding = false;
            }), S.doOverTime(1, function (t) {
                _this.throne.x = M.lerp(_this.lastPos.x, _this.targetPos.x, t);
                _this.throne.y = M.lerp(_this.lastPos.y, _this.targetPos.y, t);
                _this.throne.z = M.jumpParabola(0, 100, 0, t);
            }), S.call(function () {
                var s = _this.throne.world.playSound('land');
                s.speed = 1.5;
                s.volume = 0.7;
                _this.throne.colliding = true;
            }), S.wait(1)),
            transitions: [
                { toState: 'small_jump', condition: function () { return _this.jumpCount < 2; } },
                { toState: 'big_jump', condition: function () { return _this.jumpCount >= 2; } },
            ]
        });
        _this.addState('big_jump', {
            script: S.chain(S.call(function () {
                _this.setLastPos();
                _this.setBigJumpTargetPos();
                _this.throne.world.playSound('dash').volume = 0.6;
                _this.throne.colliding = false;
            }), S.doOverTime(1, function (t) { return _this.throne.z = 500 * t; }), S.doOverTime(1, function (t) {
                _this.throne.x = M.lerp(_this.lastPos.x, _this.targetPos.x, t);
                _this.throne.y = M.lerp(_this.lastPos.y, _this.targetPos.y, t);
            }), S.doOverTime(1, function (t) { return _this.throne.z = 500 - 500 * t; }), S.call(function () {
                _this.throne.world.playSound('land');
                _this.throne.colliding = true;
            }), S.wait(1)),
            transitions: [{ toState: 'dash' }],
        });
        _this.addState('dash', {
            script: S.chain(S.call(function () {
                _this.setLastPos();
            }), S.doOverTime(1, function (t) {
                _this.setDashTargetPos();
                _this.throne.light.alpha = t;
                _this.throne.light.angle = M.radToDeg(Math.atan2(_this.targetPos.y - _this.throne.y, _this.targetPos.x - _this.throne.x));
            }), S.wait(1), S.call(function () {
                _this.throne.light.alpha = 0;
                _this.throne.world.playSound('dash');
            }), S.simul(S.doOverTime(0.1, function (t) {
                _this.throne.x = M.lerp(_this.lastPos.x, _this.targetPos.x, t);
                _this.throne.y = M.lerp(_this.lastPos.y, _this.targetPos.y, t);
            }), S.chain(S.wait(0.05), S.call(function () {
                _this.throne.spawnBomb();
            })))),
            transitions: [{ toState: 'vulnerable' }],
        });
        _this.addState('vulnerable', {
            script: S.waitUntil(function () { return _.isEmpty(_this.throne.world.select.typeAll(Bomb)); }),
            transitions: [{ toState: 'idle' }],
        });
        _this.addState('defeat', {});
        return _this;
    }
    ThroneBehaviorSm.prototype.setLastPos = function () {
        this.lastPos.x = this.throne.x;
        this.lastPos.y = this.throne.y;
    };
    ThroneBehaviorSm.prototype.setFirstJumpTargetPos = function () {
        var player = this.throne.world.select.type(Player);
        if (M.distance(player.x, player.y, 384, 480) > 36) {
            this.targetPos.x = 384;
            this.targetPos.y = 480;
        }
        else {
            this.targetPos.x = 384;
            this.targetPos.y = 440;
        }
    };
    ThroneBehaviorSm.prototype.setSmallJumpTargetPos = function () {
        var _this = this;
        var candidates = A.range(20).map(function (i) {
            var d = Random.inDisc(64, 128);
            d.x += _this.throne.x;
            d.y += _this.throne.y;
            return d;
        }).filter(function (pos) { return 64 <= pos.x && pos.x <= 706 && 338 <= pos.y && pos.y <= 704; });
        if (_.isEmpty(candidates)) {
            this.targetPos.x = 384;
            this.targetPos.y = 480;
        }
        else {
            this.targetPos = Random.element(candidates);
        }
    };
    ThroneBehaviorSm.prototype.setBigJumpTargetPos = function () {
        this.targetPos.x = Random.float(64, 706);
        this.targetPos.y = Random.float(338, 704);
    };
    ThroneBehaviorSm.prototype.setDashTargetPos = function () {
        var player = this.throne.world.select.type(Player);
        var d = { x: player.x - this.throne.x, y: player.y - this.throne.y };
        if (V.magnitude(d) < 200)
            V.setMagnitude(d, 200);
        this.targetPos.x = this.throne.x + d.x;
        this.targetPos.y = this.throne.y + d.y;
    };
    return ThroneBehaviorSm;
}(StateMachine));
var UI = /** @class */ (function (_super) {
    __extends(UI, _super);
    function UI() {
        var _this = _super.call(this) || this;
        _this.ignoreCamera = true;
        _this.shields = [];
        return _this;
    }
    UI.prototype.update = function () {
        _super.prototype.update.call(this);
        this.updateHealth();
    };
    UI.prototype.updateHealth = function () {
        var _this = this;
        var player = this.world.select.type(Player);
        if (player.health > this.shields.length) {
            var _loop_4 = function (i) {
                var shield = this_3.addChild(new Sprite({
                    x: 20 + 36 * this_3.shields.length,
                    y: 20,
                    texture: 'ui_shield',
                    effects: { silhouette: { color: 0x00FFFF, alpha: 0 } },
                    layer: this_3.layer
                }));
                this_3.shields.push(shield);
                this_3.world.runScript(S.chain(S.doOverTime(0.3, function (t) { return shield.effects.silhouette.alpha = t; }), S.doOverTime(0.3, function (t) { return shield.effects.silhouette.amount = 1 - t; })));
            };
            var this_3 = this;
            for (var i = 0; i < player.health - this.shields.length; i++) {
                _loop_4(i);
            }
        }
        if (player.health < this.shields.length) {
            var _loop_5 = function (i) {
                var shield = this_4.shields.pop();
                shield.getTexture().subdivide(4, 4).forEach(function (subdivision) {
                    var shard = _this.addChild(new Sprite({
                        x: shield.localx - 16 + subdivision.x,
                        y: shield.localy - 16 + subdivision.y,
                        texture: subdivision.texture,
                        gravityy: 200,
                        vangle: Random.sign() * Random.float(1, 2) * 360,
                        life: 1,
                    }));
                    shard.v = Random.inCircle(80);
                    shard.updateCallback = function (obj) {
                        obj.alpha = 1 - Math.pow(obj.life.progress, 2);
                    };
                });
                shield.removeFromWorld();
            };
            var this_4 = this;
            for (var i = 0; i < this.shields.length - player.health; i++) {
                _loop_5(i);
            }
        }
    };
    return UI;
}(WorldObject));
var WaveController = /** @class */ (function (_super) {
    __extends(WaveController, _super);
    function WaveController() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.currentWave = 0;
        return _this;
    }
    WaveController.prototype.isWaveDefeated = function (wave) {
        if (wave === 9001) {
            return this.world.select.type(Throne).health <= 1000 && this.currentWave === wave;
        }
        return this.world.select.nameAll('spawn').length <= 0 && this.world.select.typeAll(Enemy).length <= 1 && this.currentWave === wave;
    };
    WaveController.prototype.spawnWave1 = function () {
        this.currentWave = 1;
        this.world.addWorldObjects([
            this.enemySpawn(Golbin, 220, 476),
            this.enemySpawn(Golbin, 548, 476),
        ]);
    };
    WaveController.prototype.spawnWave2 = function () {
        this.currentWave = 2;
        this.world.addWorldObjects([
            this.enemySpawn(Knight, 220, 400),
            this.enemySpawn(Knight, 220, 552),
            this.enemySpawn(Knight, 548, 400),
            this.enemySpawn(Knight, 548, 552),
        ]);
    };
    WaveController.prototype.spawnWave3 = function () {
        this.currentWave = 3;
        this.world.addWorldObjects([
            this.enemySpawn(Golbin, 220, 400),
            this.enemySpawn(Mage, 220, 552),
            this.enemySpawn(Mage, 548, 400),
            this.enemySpawn(Golbin, 548, 552),
        ]);
    };
    WaveController.prototype.spawnWave4 = function () {
        this.currentWave = 4;
        this.world.addWorldObjects([
            this.enemySpawn(Golbin, 220, 400),
            this.enemySpawn(Golbin, 220, 552),
            this.enemySpawn(Knight, 160, 476),
            this.enemySpawn(Golbin, 548, 400),
            this.enemySpawn(Golbin, 548, 552),
            this.enemySpawn(Knight, 608, 476),
        ]);
    };
    WaveController.prototype.spawnWave5 = function () {
        this.currentWave = 5;
        this.world.addWorldObjects([
            this.enemySpawn(Golbin, 220, 400),
            this.enemySpawn(Knight, 220, 552),
            this.enemySpawn(Knight, 160, 476),
            this.enemySpawn(Mage, 100, 476),
            this.enemySpawn(Knight, 548, 400),
            this.enemySpawn(Golbin, 548, 552),
            this.enemySpawn(Golbin, 608, 476),
            this.enemySpawn(Mage, 668, 476),
        ]);
    };
    WaveController.prototype.spawnWaveKing = function () {
        var e_50, _a;
        this.currentWave = 9001;
        var guards = this.world.select.nameAll('guard');
        try {
            for (var guards_1 = __values(guards), guards_1_1 = guards_1.next(); !guards_1_1.done; guards_1_1 = guards_1.next()) {
                var guard = guards_1_1.value;
                var newGuard = this.world.addWorldObject(new Knight({
                    x: guard.x, y: guard.y,
                    tint: guard.tint,
                    layer: 'main',
                    flipX: guard.flipX,
                    physicsGroup: 'enemies'
                }));
                newGuard.health = 2;
                guard.removeFromWorld();
            }
        }
        catch (e_50_1) { e_50 = { error: e_50_1 }; }
        finally {
            try {
                if (guards_1_1 && !guards_1_1.done && (_a = guards_1.return)) _a.call(guards_1);
            }
            finally { if (e_50) throw e_50.error; }
        }
    };
    WaveController.prototype.startMusic = function () {
        this.music = this.world.playSound(this.currentWave === 9001 ? 'musicboss' : 'music');
        this.music.loop = true;
    };
    WaveController.prototype.stopMusic = function () {
        if (this.music) {
            var music_1 = this.music;
            this.world.runScript(S.chain(S.doOverTime(3, function (t) { return music_1.volume = 0.5 * (1 - t); })));
        }
    };
    WaveController.prototype.enemySpawn = function (constructor, x, y) {
        return spawn(new constructor({
            x: x, y: y,
            layer: 'main',
            physicsGroup: 'enemies'
        }));
    };
    return WaveController;
}(WorldObject));
