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
var Point = PIXI.Point;
var Rectangle = PIXI.Rectangle;
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
        if (!this.textures[key]) {
            error("Texture '" + key + "' does not exist.");
            return Texture.none();
        }
        return this.textures[key];
    };
    AssetCache.getSoundAsset = function (key) {
        if (!this.sounds[key]) {
            error("Sound '" + key + "' does not exist.");
            return { buffer: new AudioBuffer({ length: 0, sampleRate: 8000 }) };
        }
        return this.sounds[key];
    };
    AssetCache.getTilemap = function (key) {
        if (!this.tilemaps[key]) {
            error("Tilemap '" + key + "' does not exist.");
        }
        return this.tilemaps[key];
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
        this.updateOverlay();
        this.soundManager.volume = this.volume;
        this.soundManager.update(this.delta);
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
            this.overlay.render(screen);
        }
    };
    Game.prototype.loadMainMenu = function () {
        this.menuSystem.loadMenu(this.entryPointMenuClass);
    };
    Game.prototype.loadTheater = function () {
        var _a;
        this.theater = new ((_a = this.theaterConfig.theaterClass) !== null && _a !== void 0 ? _a : Theater)(this.theaterConfig);
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
            return worldObject.name + "." + worldObject.uid;
        }
        return worldObject.uid;
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
            this.isDownByKeyCode[keyCode] = true;
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
        var _a, _b;
        this.code = (_a = config.code) !== null && _a !== void 0 ? _a : '';
        this.vertCode = (_b = config.vertCode) !== null && _b !== void 0 ? _b : '';
        this.uniformCode = this.constructUniformCode(config.uniforms);
        this.uniforms = this.constructUniforms(config.uniforms);
        this.setUniform('posx', 0);
        this.setUniform('posy', 0);
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
    TextureFilter.prototype.getCode = function () {
        return this.code;
    };
    TextureFilter.prototype.getUniform = function (uniform) {
        return this.uniforms[uniform];
    };
    TextureFilter.prototype.getUniformCode = function () {
        return this.uniformCode;
    };
    TextureFilter.prototype.getVertCode = function () {
        return this.vertCode;
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
    TextureFilter.cache = new SingleKeyCache(function (filter) {
        var vert = vertPreUniforms + filter.getUniformCode() + vertStartFunc + filter.getVertCode() + vertEndFunc;
        var frag = fragPreUniforms + filter.getUniformCode() + fragStartFunc + filter.getCode() + fragEndFunc;
        return new PIXI.Filter(vert, frag, {});
    }, function (filter) {
        return filter.getUniformCode() + filter.getVertCode() + filter.getCode();
    });
    var Slice = /** @class */ (function (_super) {
        __extends(Slice, _super);
        function Slice(rect) {
            return _super.call(this, {
                uniforms: {
                    'float sliceX': rect.x,
                    'float sliceY': rect.y,
                    'float sliceWidth': rect.width,
                    'float sliceHeight': rect.height,
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
    var _sliceFilter;
    function SLICE(rect) {
        if (!_sliceFilter) {
            _sliceFilter = new Slice(rect);
        }
        else {
            _sliceFilter.setSlice(rect);
        }
        return _sliceFilter;
    }
    TextureFilter.SLICE = SLICE;
    var vertPreUniforms = "\n        precision highp float;\n        attribute vec2 aVertexPosition;\n        uniform mat3 projectionMatrix;\n        varying vec2 vTextureCoord;\n        uniform vec4 inputSize;\n        uniform vec4 outputFrame;\n\n        uniform float posx;\n        uniform float posy;\n        uniform float t;\n\n        float width;\n        float height;\n    ";
    var vertStartFunc = "\n        vec4 filterVertexPosition(void) {\n            width = inputSize.x;\n            height = inputSize.y;\n            vec2 position = aVertexPosition * max(outputFrame.zw, vec2(0.)) + outputFrame.xy;\n            vec2 inp = position - vec2(posx, posy);\n            vec2 outp = vec2(inp.x, inp.y);\n    ";
    var vertEndFunc = "\n            position = outp + vec2(posx, posy);\n            return vec4((projectionMatrix * vec3(position, 1.0)).xy, 0.0, 1.0);\n        }\n\n        vec2 filterTextureCoord(void) {\n            return aVertexPosition * (outputFrame.zw * inputSize.zw);\n        }\n\n        void main(void) {\n            gl_Position = filterVertexPosition();\n            vTextureCoord = filterTextureCoord();\n        }\n    ";
    var fragPreUniforms = "\n        precision highp float;\n        varying vec2 vTextureCoord;\n        uniform vec4 inputSize;\n        uniform sampler2D uSampler;\n\n        uniform float posx;\n        uniform float posy;\n        uniform float t;\n\n        float width;\n        float height;\n    ";
    var fragStartFunc = "\n        vec4 getColor(float localx, float localy) {\n            float tx = (localx + posx) / width;\n            float ty = (localy + posy) / height;\n            return texture2D(uSampler, vec2(tx, ty));\n        }\n\n        vec4 getWorldColor(float worldx, float worldy) {\n            float tx = worldx / width;\n            float ty = worldy / height;\n            return texture2D(uSampler, vec2(tx, ty));\n        }\n\n        " + Perlin.SHADER_SOURCE + "\n\n        void main(void) {\n            width = inputSize.x;\n            height = inputSize.y;\n            float worldx = vTextureCoord.x * width;\n            float worldy = vTextureCoord.y * height;\n            float x = worldx - posx;\n            float y = worldy - posy;\n            vec4 inp = texture2D(uSampler, vTextureCoord);\n            // Un-premultiply alpha before applying the color matrix. See PIXI issue #3539.\n            if (inp.a > 0.0) {\n                inp.rgb /= inp.a;\n            }\n            vec4 outp = vec4(inp.r, inp.g, inp.b, inp.a);\n    ";
    var fragEndFunc = "\n            // Premultiply alpha again.\n            outp.rgb *= outp.a;\n            gl_FragColor = outp;\n        }\n    ";
})(TextureFilter || (TextureFilter = {}));
/// <reference path="./filter/textureFilter.ts"/>
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
        var allFilters = [];
        if (properties.slice) {
            var sliceFilter = TextureFilter.SLICE(properties.slice);
            var sliceRect = this.getSliceRect(properties);
            // Subtract sliceRect.xy because slice requires the shifted xy of the texture after slice
            Texture.setFilterProperties(sliceFilter, properties.x - sliceRect.x, properties.y - sliceRect.y);
            allFilters.push(sliceFilter);
        }
        if (properties.mask && properties.mask.texture) {
            var maskFilter = Mask.SHARED(properties.mask.texture, 'global', properties.mask.x, properties.mask.y, properties.mask.invert);
            Texture.setFilterProperties(maskFilter, properties.x, properties.y);
            allFilters.push(maskFilter);
        }
        properties.filters.forEach(function (filter) { return filter && Texture.setFilterProperties(filter, properties.x, properties.y); });
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
        var preloadedSound = WebAudio.preloadedSounds[key];
        if (!preloadedSound) {
            error("Failed to preload sound " + key);
            return;
        }
        AssetCache.sounds[key] = {
            buffer: preloadedSound.buffer,
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
var Cheat = /** @class */ (function () {
    function Cheat() {
    }
    Cheat.init = function (config) {
        var _loop_1 = function (cheat) {
            var fn = config[cheat];
            Object.defineProperty(this_1, cheat, {
                get: function () {
                    if (!Debug.CHEATS_ENABLED)
                        return undefined;
                    return fn;
                }
            });
        };
        var this_1 = this;
        for (var cheat in config) {
            _loop_1(cheat);
        }
    };
    return Cheat;
}());
var Debug = /** @class */ (function () {
    function Debug() {
    }
    Debug.init = function (config) {
        Debug.DEBUG = config.debug;
        Debug.FONT = config.font;
        Debug.FONT_STYLE = config.fontStyle;
        Debug.CHEATS_ENABLED = config.cheatsEnabled;
        Debug.ALL_PHYSICS_BOUNDS = config.allPhysicsBounds;
        Debug.MOVE_CAMERA_WITH_ARROWS = config.moveCameraWithArrows;
        Debug.SHOW_OVERLAY = config.showOverlay;
        Debug.SKIP_RATE = config.skipRate;
        Debug.PROGRAMMATIC_INPUT = config.programmaticInput;
        Debug.AUTOPLAY = config.autoplay;
        Debug.SKIP_MAIN_MENU = config.skipMainMenu;
        Debug.FRAME_STEP_ENABLED = config.frameStepEnabled;
        Debug.FRAME_STEP_STEP_KEY = config.frameStepStepKey;
        Debug.FRAME_STEP_RUN_KEY = config.frameStepRunKey;
        Debug.RESET_OPTIONS_AT_START = config.resetOptionsAtStart;
    };
    Object.defineProperty(Debug, "DEBUG", {
        get: function () { return this._DEBUG; },
        set: function (value) { this._DEBUG = value; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Debug, "CHEATS_ENABLED", {
        get: function () { return this.DEBUG && this._CHEATS_ENABLED; },
        set: function (value) { this._CHEATS_ENABLED = value; },
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
    function WorldObject(config, defaults) {
        var _this = this;
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
        config = WorldObject.resolveConfig(config, defaults);
        this.localx = (_a = config.x) !== null && _a !== void 0 ? _a : 0;
        this.localy = (_b = config.y) !== null && _b !== void 0 ? _b : 0;
        this.localz = (_c = config.z) !== null && _c !== void 0 ? _c : 0;
        this.visible = (_d = config.visible) !== null && _d !== void 0 ? _d : true;
        this.active = (_e = config.active) !== null && _e !== void 0 ? _e : true;
        this.life = new Timer((_f = config.life) !== null && _f !== void 0 ? _f : Infinity, function () { return _this.kill(); });
        this.zBehavior = (_g = config.zBehavior) !== null && _g !== void 0 ? _g : WorldObject.DEFAULT_Z_BEHAVIOR;
        this.ignoreCamera = (_h = config.ignoreCamera) !== null && _h !== void 0 ? _h : false;
        this.data = config.data ? _.clone(config.data) : {};
        this.alive = true;
        this.lastx = this.x;
        this.lasty = this.y;
        this.lastz = this.z;
        this.controllable = (_j = config.controllable) !== null && _j !== void 0 ? _j : false;
        this.controller = {};
        this.controllerSchema = {};
        this.uid = WorldObject.UID.generate();
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
        this.debugFollowMouse = (_l = (_k = config.debug) === null || _k === void 0 ? void 0 : _k.followMouse) !== null && _l !== void 0 ? _l : false;
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
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(WorldObject.prototype, "layer", {
        get: function () { return this._layer; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(WorldObject.prototype, "physicsGroup", {
        get: function () { return this._physicsGroup; },
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
        get: function () { return this.world ? this.world.delta : global.game.delta; },
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
    WorldObject.prototype.onAdd = function () { };
    WorldObject.prototype.onRemove = function () { };
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
        if (this.updateCallback)
            this.updateCallback(this);
        this.life.update(this.delta);
        if (this.debugFollowMouse) {
            this.x = this.world.getWorldMouseX();
            this.y = this.world.getWorldMouseY();
        }
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
                result -= this.z;
            }
            return result;
        },
        enumerable: false,
        configurable: true
    });
    WorldObject.prototype.preRender = function () {
    };
    WorldObject.prototype.render = function (screen) {
    };
    WorldObject.prototype.postRender = function () {
    };
    WorldObject.prototype.worldRender = function (screen) {
        this.preRender();
        this.render(screen);
        this.postRender();
    };
    WorldObject.prototype.addChild = function (child) {
        var worldObject = child instanceof WorldObject ? child : WorldObject.fromConfig(child);
        return World.Actions.addChildToParent(worldObject, this);
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
        var worldObjects = _.isEmpty(children) ? [] : children.map(function (child) { return child instanceof WorldObject ? child : WorldObject.fromConfig(child); });
        return World.Actions.addChildrenToParent(worldObjects, this);
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
    function fromConfig(config) {
        config = WorldObject.resolveConfig(config);
        var result = new config.constructor(config);
        if (result === config)
            result = new WorldObject(config); // Default constructor to WorldObject
        return result;
    }
    WorldObject.fromConfig = fromConfig;
    function resolveConfig(config) {
        var e_6, _a;
        var parents = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            parents[_i - 1] = arguments[_i];
        }
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
        catch (e_6_1) { e_6 = { error: e_6_1 }; }
        finally {
            try {
                if (parents_1_1 && !parents_1_1.done && (_a = parents_1.return)) _a.call(parents_1);
            }
            finally { if (e_6) throw e_6.error; }
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
            else if (key === 'children') {
                result[key] = A.mergeArray(config[key], result[key], function (e) { return e.name; }, resolveConfig);
            }
            else {
                result[key] = config[key];
            }
        }
        return result;
    }
    WorldObject.UID = new UIDGenerator();
})(WorldObject || (WorldObject = {}));
/// <reference path="./worldObject.ts" />
var PhysicsWorldObject = /** @class */ (function (_super) {
    __extends(PhysicsWorldObject, _super);
    function PhysicsWorldObject(config, defaults) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
        var _this = this;
        config = WorldObject.resolveConfig(config, defaults);
        _this = _super.call(this, config) || this;
        _this.vx = (_a = config.vx) !== null && _a !== void 0 ? _a : 0;
        _this.vy = (_b = config.vy) !== null && _b !== void 0 ? _b : 0;
        _this.vz = (_c = config.vz) !== null && _c !== void 0 ? _c : 0;
        _this.mass = (_d = config.mass) !== null && _d !== void 0 ? _d : 1;
        _this.gravityx = (_e = config.gravityx) !== null && _e !== void 0 ? _e : 0;
        _this.gravityy = (_f = config.gravityy) !== null && _f !== void 0 ? _f : 0;
        _this.gravityz = (_g = config.gravityz) !== null && _g !== void 0 ? _g : 0;
        _this.bounce = (_h = config.bounce) !== null && _h !== void 0 ? _h : 0;
        _this.bounds = config.bounds ? new RectBounds(config.bounds.x, config.bounds.y, config.bounds.width, config.bounds.height, _this) : new RectBounds(0, 0, 0, 0, _this);
        _this.immovable = (_j = config.immovable) !== null && _j !== void 0 ? _j : false;
        _this.colliding = (_k = config.colliding) !== null && _k !== void 0 ? _k : true;
        _this.debugDrawBounds = (_m = (_l = config.debug) === null || _l === void 0 ? void 0 : _l.drawBounds) !== null && _m !== void 0 ? _m : false;
        _this.simulating = (_o = config.simulating) !== null && _o !== void 0 ? _o : true;
        _this.physicslastx = _this.x;
        _this.physicslasty = _this.y;
        return _this;
    }
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
    PhysicsWorldObject.prototype.render = function (screen) {
        if (Debug.ALL_PHYSICS_BOUNDS || this.debugDrawBounds) {
            var worldBounds = this.bounds.getBoundingBox();
            Draw.brush.color = 0x00FF00;
            Draw.brush.alpha = 1;
            Draw.rectangleOutline(screen, worldBounds.x, worldBounds.y, worldBounds.width, worldBounds.height);
        }
        _super.prototype.render.call(this, screen);
    };
    PhysicsWorldObject.prototype.getWorldBounds = function (newX, newY) {
        if (newX === void 0) { newX = this.x; }
        if (newY === void 0) { newY = this.y; }
        return this.bounds.getBoundingBox(newX, newY);
    };
    PhysicsWorldObject.prototype.isCollidingWith = function (other) {
        return this.isOverlapping(other.bounds);
    };
    PhysicsWorldObject.prototype.isOverlapping = function (bounds) {
        return this.bounds.isOverlapping(bounds);
    };
    PhysicsWorldObject.prototype.onCollide = function (other) {
    };
    PhysicsWorldObject.prototype.teleport = function (x, y) {
        this.x = x;
        this.y = y;
        this.physicslastx = x;
        this.physicslasty = y;
    };
    PhysicsWorldObject.prototype.applyGravity = function () {
        this.vx += this.gravityx * this.delta;
        this.vy += this.gravityy * this.delta;
        this.vz += this.gravityz * this.delta;
    };
    PhysicsWorldObject.prototype.move = function () {
        this.x += this.vx * this.delta;
        this.y += this.vy * this.delta;
        this.z += this.vz * this.delta;
    };
    PhysicsWorldObject.prototype.simulate = function () {
        this.applyGravity();
        this.move();
    };
    return PhysicsWorldObject;
}(WorldObject));
/// <reference path="../physicsWorldObject.ts" />
var Sprite = /** @class */ (function (_super) {
    __extends(Sprite, _super);
    function Sprite(config, defaults) {
        var e_7, _a;
        var _b, _c, _d, _e, _f, _g, _h;
        var _this = this;
        config = WorldObject.resolveConfig(config, defaults);
        _this = _super.call(this, config) || this;
        _this.setTexture(config.texture);
        _this.animationManager = new AnimationManager(_this);
        if (config.animations) {
            try {
                for (var _j = __values(config.animations), _k = _j.next(); !_k.done; _k = _j.next()) {
                    var animation = _k.value;
                    _.defaults(animation, {
                        frames: [],
                    });
                    _this.animationManager.addAnimation(animation.name, animation.frames);
                }
            }
            catch (e_7_1) { e_7 = { error: e_7_1 }; }
            finally {
                try {
                    if (_k && !_k.done && (_a = _j.return)) _a.call(_j);
                }
                finally { if (e_7) throw e_7.error; }
            }
        }
        if (config.defaultAnimation) {
            _this.playAnimation(config.defaultAnimation, 0, true);
        }
        _this.flipX = (_b = config.flipX) !== null && _b !== void 0 ? _b : false;
        _this.flipY = (_c = config.flipY) !== null && _c !== void 0 ? _c : false;
        _this.offset = config.offset || { x: 0, y: 0 };
        _this.angle = (_d = config.angle) !== null && _d !== void 0 ? _d : 0;
        _this.scaleX = (_e = config.scaleX) !== null && _e !== void 0 ? _e : 1;
        _this.scaleY = (_f = config.scaleY) !== null && _f !== void 0 ? _f : 1;
        _this.tint = (_g = config.tint) !== null && _g !== void 0 ? _g : 0xFFFFFF;
        _this.alpha = (_h = config.alpha) !== null && _h !== void 0 ? _h : 1;
        _this.effects = new Effects();
        _this.effects.updateFromConfig(config.effects);
        _this.mask = _.clone(config.mask);
        return _this;
    }
    Sprite.prototype.update = function () {
        _super.prototype.update.call(this);
        this.animationManager.update(this.delta);
        this.effects.updateEffects(this.delta);
    };
    Sprite.prototype.render = function (screen) {
        this.texture.renderTo(screen, {
            x: this.renderScreenX + this.offset.x,
            y: this.renderScreenY + this.offset.y,
            scaleX: (this.flipX ? -1 : 1) * this.scaleX,
            scaleY: (this.flipY ? -1 : 1) * this.scaleY,
            angle: this.angle,
            tint: this.tint,
            alpha: this.alpha,
            filters: this.effects.getFilterList(),
            mask: Mask.getTextureMaskForWorldObject(this.mask, this),
        });
        _super.prototype.render.call(this, screen);
    };
    Sprite.prototype.getCurrentAnimationName = function () {
        return this.animationManager.getCurrentAnimationName();
    };
    Sprite.prototype.getTexture = function () {
        return this.texture;
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
/// <reference path="../worldObject/sprite/sprite.ts" />
/// <reference path="../worldObject/worldObject.ts" />
var World = /** @class */ (function () {
    function World(config, defaults) {
        var e_8, _a;
        var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
        config = WorldObject.resolveConfig(config, defaults);
        this.scriptManager = new ScriptManager();
        this.soundManager = new SoundManager();
        this.volume = (_b = config.volume) !== null && _b !== void 0 ? _b : 1;
        this.width = (_c = config.width) !== null && _c !== void 0 ? _c : global.gameWidth;
        this.height = (_d = config.height) !== null && _d !== void 0 ? _d : global.gameHeight;
        this.worldObjects = [];
        this.physicsGroups = this.createPhysicsGroups(config.physicsGroups);
        this.collisionOrder = (_e = config.collisionOrder) !== null && _e !== void 0 ? _e : [];
        this.collisions = (_f = config.collisions) !== null && _f !== void 0 ? _f : {};
        this.collisionIterations = (_g = config.collisionIterations) !== null && _g !== void 0 ? _g : 1;
        this.worldObjectsByName = {};
        this.layers = this.createLayers(config.layers);
        this.backgroundColor = (_h = config.backgroundColor) !== null && _h !== void 0 ? _h : global.backgroundColor;
        this.backgroundAlpha = (_j = config.backgroundAlpha) !== null && _j !== void 0 ? _j : 1;
        this.screen = new BasicTexture(this.width, this.height);
        this.layerTexture = new BasicTexture(this.width, this.height);
        this.entryPoints = (_k = config.entryPoints) !== null && _k !== void 0 ? _k : {};
        try {
            for (var _m = __values(config.worldObjects || []), _o = _m.next(); !_o.done; _o = _m.next()) {
                var worldObjectConfig = _o.value;
                World.Actions.addWorldObjectToWorld(WorldObject.fromConfig(worldObjectConfig), this);
            }
        }
        catch (e_8_1) { e_8 = { error: e_8_1 }; }
        finally {
            try {
                if (_o && !_o.done && (_a = _m.return)) _a.call(_m);
            }
            finally { if (e_8) throw e_8.error; }
        }
        this.camera = new Camera((_l = config.camera) !== null && _l !== void 0 ? _l : {}, this);
    }
    Object.defineProperty(World.prototype, "delta", {
        get: function () { return global.game.delta; },
        enumerable: false,
        configurable: true
    });
    World.prototype.update = function () {
        var e_9, _a, e_10, _b, e_11, _c;
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
        catch (e_9_1) { e_9 = { error: e_9_1 }; }
        finally {
            try {
                if (_e && !_e.done && (_a = _d.return)) _a.call(_d);
            }
            finally { if (e_9) throw e_9.error; }
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
        catch (e_10_1) { e_10 = { error: e_10_1 }; }
        finally {
            try {
                if (_g && !_g.done && (_b = _f.return)) _b.call(_f);
            }
            finally { if (e_10) throw e_10.error; }
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
        catch (e_11_1) { e_11 = { error: e_11_1 }; }
        finally {
            try {
                if (_j && !_j.done && (_c = _h.return)) _c.call(_h);
            }
            finally { if (e_11) throw e_11.error; }
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
        var e_12, _a, e_13, _b, e_14, _c;
        // Render background color.
        Draw.brush.color = this.backgroundColor;
        Draw.brush.alpha = this.backgroundAlpha;
        Draw.fill(this.screen);
        try {
            for (var _d = __values(this.worldObjects), _e = _d.next(); !_e.done; _e = _d.next()) {
                var worldObject = _e.value;
                if (worldObject.visible) {
                    worldObject.preRender();
                }
            }
        }
        catch (e_12_1) { e_12 = { error: e_12_1 }; }
        finally {
            try {
                if (_e && !_e.done && (_a = _d.return)) _a.call(_d);
            }
            finally { if (e_12) throw e_12.error; }
        }
        try {
            for (var _f = __values(this.layers), _g = _f.next(); !_g.done; _g = _f.next()) {
                var layer = _g.value;
                this.layerTexture.clear();
                this.renderLayer(layer, this.layerTexture, this.screen);
            }
        }
        catch (e_13_1) { e_13 = { error: e_13_1 }; }
        finally {
            try {
                if (_g && !_g.done && (_b = _f.return)) _b.call(_f);
            }
            finally { if (e_13) throw e_13.error; }
        }
        try {
            for (var _h = __values(this.worldObjects), _j = _h.next(); !_j.done; _j = _h.next()) {
                var worldObject = _j.value;
                if (worldObject.visible) {
                    worldObject.postRender();
                }
            }
        }
        catch (e_14_1) { e_14 = { error: e_14_1 }; }
        finally {
            try {
                if (_j && !_j.done && (_c = _h.return)) _c.call(_h);
            }
            finally { if (e_14) throw e_14.error; }
        }
        this.screen.renderTo(screen);
    };
    World.prototype.renderLayer = function (layer, layerTexture, screen) {
        var e_15, _a;
        layer.sort();
        try {
            for (var _b = __values(layer.worldObjects), _c = _b.next(); !_c.done; _c = _b.next()) {
                var worldObject = _c.value;
                if (worldObject.visible) {
                    global.metrics.startSpan(worldObject);
                    worldObject.render(layerTexture);
                    global.metrics.endSpan(worldObject);
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
        layerTexture.renderTo(screen, {
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
            error("World does not have an entry point named '" + entryPointKey + "':", this);
            return undefined;
        }
        return this.entryPoints[entryPointKey];
    };
    World.prototype.getLayerByName = function (name) {
        var e_16, _a;
        try {
            for (var _b = __values(this.layers), _c = _b.next(); !_c.done; _c = _b.next()) {
                var layer = _c.value;
                if (layer.name === name)
                    return layer;
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
    World.prototype.getPhysicsGroupByName = function (name) {
        return this.physicsGroups[name];
    };
    World.prototype.getPhysicsGroupsThatCollideWith = function (physicsGroup) {
        var e_17, _a;
        var _this = this;
        var result = [];
        try {
            for (var _b = __values(this.collisionOrder), _c = _b.next(); !_c.done; _c = _b.next()) {
                var coll = _c.value;
                var move = _.isString(coll.move) ? [coll.move] : coll.move;
                var from = _.isString(coll.from) ? [coll.from] : coll.from;
                if (_.contains(move, physicsGroup)) {
                    result.push.apply(result, __spread(from));
                }
                if (_.contains(from, physicsGroup)) {
                    result.push.apply(result, __spread(move));
                }
            }
        }
        catch (e_17_1) { e_17 = { error: e_17_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_17) throw e_17.error; }
        }
        return A.removeDuplicates(result.filter(function (group) { return _this.physicsGroups[group]; }));
    };
    World.prototype.getPhysicsObjectsThatCollideWith = function (physicsGroup) {
        var _this = this;
        var groups = this.getPhysicsGroupsThatCollideWith(physicsGroup);
        return _.flatten(groups.map(function (group) { return _this.physicsGroups[group].worldObjects; }));
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
    World.prototype.getWorldObjectByName = function (name) {
        var results = this.getWorldObjectsByName(name);
        if (_.isEmpty(results)) {
            error("No object with name " + name + " exists in world", this);
            return undefined;
        }
        if (results.length > 1) {
            debug("Multiple objects with name " + name + " exist in world. Returning one of them. World:", this);
        }
        return results[0];
    };
    World.prototype.getWorldObjectsByName = function (name) {
        return A.clone(this.worldObjectsByName[name]);
    };
    World.prototype.getWorldObjectByType = function (type) {
        var results = this.getWorldObjectsByType(type);
        if (_.isEmpty(results)) {
            error("No object of type " + type.name + " exists in world", this);
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
        if (_.isEmpty(this.collisions))
            return;
        // for (let collision of this.collisionOrder) {
        //     let move = _.isArray(collision.move) ? collision.move : [collision.move];
        //     let from = _.isArray(collision.from) ? collision.from : [collision.from];
        //     let fromObjects = <PhysicsWorldObject[]>_.flatten(from.map(name => this.physicsGroups[name].worldObjects));
        //     for (let moveGroup of move) {
        //         let group = this.physicsGroups[moveGroup].worldObjects;
        //         for (let obj of group) {
        //             Physics.collide(obj, fromObjects, {
        //                 callback: collision.callback,
        //                 transferMomentum: collision.transferMomentum,
        //             });
        //         }
        //     }
        // }
        Physics2.resolveCollisions(this);
    };
    World.prototype.hasWorldObject = function (obj) {
        if (_.isString(obj)) {
            return !_.isEmpty(this.worldObjectsByName[obj]);
        }
        return _.contains(this.worldObjects, obj);
    };
    // Returns a list of all physics objects in the world that overlap the given bounds
    World.prototype.overlap = function (bounds, restrictToPhysicsGroups) {
        var e_18, _a;
        var result = [];
        for (var physicsGroup in this.physicsGroups) {
            if (restrictToPhysicsGroups && !_.contains(restrictToPhysicsGroups, physicsGroup))
                continue;
            try {
                for (var _b = (e_18 = void 0, __values(this.physicsGroups[physicsGroup].worldObjects)), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var obj = _c.value;
                    if (!obj.isOverlapping(bounds))
                        continue;
                    result.push(obj);
                }
            }
            catch (e_18_1) { e_18 = { error: e_18_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_18) throw e_18.error; }
            }
        }
        return result;
    };
    World.prototype.playSound = function (key) {
        return this.soundManager.playSound(key);
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
        var e_19, _a;
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
        catch (e_19_1) { e_19 = { error: e_19_1 }; }
        finally {
            try {
                if (layers_1_1 && !layers_1_1.done && (_a = layers_1.return)) _a.call(layers_1);
            }
            finally { if (e_19) throw e_19.error; }
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
        var e_20, _a;
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
        catch (e_20_1) { e_20 = { error: e_20_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_20) throw e_20.error; }
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
        var e_21, _a;
        try {
            for (var _b = __values(this.layers), _c = _b.next(); !_c.done; _c = _b.next()) {
                var layer = _c.value;
                A.removeAll(layer.worldObjects, obj);
            }
        }
        catch (e_21_1) { e_21 = { error: e_21_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_21) throw e_21.error; }
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
            this.worldObjects.sort(function (a, b) { return r * (_this.sortKey(a) - _this.sortKey(b)); });
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
            var world = obj.world;
            obj.onRemove();
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
        var e_22, _a;
        var parents = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            parents[_i - 1] = arguments[_i];
        }
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
        catch (e_22_1) { e_22 = { error: e_22_1 }; }
        finally {
            try {
                if (parents_2_1 && !parents_2_1.done && (_a = parents_2.return)) _a.call(parents_2);
            }
            finally { if (e_22) throw e_22.error; }
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
/// <reference path="../world/world.ts" />
var DebugOverlay = /** @class */ (function (_super) {
    __extends(DebugOverlay, _super);
    function DebugOverlay() {
        var _this = _super.call(this, {
            backgroundAlpha: 0,
        }) || this;
        _this.addWorldObject({
            name: 'debuginfo',
            constructor: SpriteText,
            x: 0, y: 0,
            font: Debug.FONT,
            style: Debug.FONT_STYLE,
            updateCallback: function (obj, delta) {
                obj.setText(_this.getDebugInfo());
            }
        });
        return _this;
    }
    DebugOverlay.prototype.setCurrentWorldToDebug = function (world) {
        this.currentWorldToDebug = world;
    };
    DebugOverlay.prototype.getDebugInfo = function () {
        if (!this.currentWorldToDebug)
            return "";
        var mousePositionText = "mpos: "
            + St.padLeft(this.currentWorldToDebug.getWorldMouseX().toString(), 3) + " "
            + St.padLeft(this.currentWorldToDebug.getWorldMouseY().toString(), 3);
        var fpsText = "fps: "
            + global.fpsCalculator.fpsAvg.toFixed(0) + " "
            + "(-" + (global.fpsCalculator.fpsAvg - global.fpsCalculator.fpsP).toFixed(0) + ")";
        var recordingText = global.metrics.isRecording ? "\nrecording" : "";
        return mousePositionText + "\n" + fpsText + "\n" + recordingText;
    };
    return DebugOverlay;
}(World));
/// <reference path="../world/world.ts" />
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
var MetricsMenu = /** @class */ (function (_super) {
    __extends(MetricsMenu, _super);
    function MetricsMenu(menuSystem) {
        var _this = _super.call(this, menuSystem, {
            backgroundColor: 0x000000,
            worldObjects: []
        }) || this;
        _this.plot = global.metrics.plotLastRecording();
        _this.addWorldObject({
            constructor: Sprite,
            texture: _this.plot.texture,
        });
        _this.addWorldObject({
            name: 'graphxy',
            constructor: SpriteText,
            font: Assets.fonts.DELUXE16,
            style: { color: 0x00FF00 },
        });
        return _this;
    }
    MetricsMenu.prototype.update = function () {
        _super.prototype.update.call(this);
        if (Input.justDown(Input.GAME_CLOSE_MENU)) {
            Input.consume(Input.GAME_CLOSE_MENU);
            this.menuSystem.game.unpauseGame();
        }
        this.getWorldObjectByName('graphxy')
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
        var _a;
        var _this = _super.call(this, config) || this;
        _this.font = config.font;
        _this.style = O.withDefaults((_a = config.style) !== null && _a !== void 0 ? _a : {}, {
            color: 0xFFFFFF,
            alpha: 1,
            offset: 0,
        });
        _this.setText(config.text);
        _this.fontTexture = AssetCache.getTexture(_this.font.texture);
        _this.mask = config.mask;
        return _this;
    }
    SpriteText.prototype.render = function (screen) {
        var e_23, _a;
        var _b, _c, _d;
        try {
            for (var _e = __values(this.chars), _f = _e.next(); !_f.done; _f = _e.next()) {
                var char = _f.value;
                this.fontTexture.renderTo(screen, {
                    x: this.renderScreenX + char.x,
                    y: this.renderScreenY + char.y + ((_b = char.style.offset) !== null && _b !== void 0 ? _b : this.style.offset),
                    tint: (_c = char.style.color) !== null && _c !== void 0 ? _c : this.style.color,
                    alpha: (_d = char.style.alpha) !== null && _d !== void 0 ? _d : this.style.alpha,
                    slice: {
                        x: SpriteText.charCodes[char.char].x * this.font.charWidth,
                        y: SpriteText.charCodes[char.char].y * this.font.charHeight,
                        width: this.font.charWidth,
                        height: this.font.charHeight
                    },
                    mask: Mask.getTextureMaskForWorldObject(this.mask, this),
                });
            }
        }
        catch (e_23_1) { e_23 = { error: e_23_1 }; }
        finally {
            try {
                if (_f && !_f.done && (_a = _e.return)) _a.call(_e);
            }
            finally { if (e_23) throw e_23.error; }
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
        _this.addChild({
            constructor: MenuTextButton,
            x: 0, y: 0, text: "<",
            font: _this.font, style: _this.style,
            onClick: function () {
                global.game.playSound('click');
                var bars = _this.getFullBarsForValue(_this.getValue());
                if (bars > 0) {
                    var newValue = _this.getValueForFullBars(bars - 1);
                    _this.setValue(newValue);
                }
            },
        });
        _this.addChild({
            constructor: MenuTextButton,
            x: (_this.barLength + 3) * _this.font.charWidth, y: 0, text: ">",
            font: _this.font, style: _this.style,
            onClick: function () {
                global.game.playSound('click');
                var bars = _this.getFullBarsForValue(_this.getValue());
                if (bars < _this.barLength) {
                    var newValue = _this.getValueForFullBars(bars + 1);
                    _this.setValue(newValue);
                }
            },
        });
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
        var e_24, _a;
        var _this = this;
        World.Actions.removeWorldObjectsFromWorld(this.children);
        var controls = Options.getOption('controls');
        var controlBindings = controls[this.controlName];
        var bindingx = 0;
        var text = "";
        var _loop_2 = function (binding) {
            var bindingId = binding;
            var bindingName = this_2.getBindingName(binding);
            this_2.addChild({
                name: this_2.getBindingMappingObjectName(binding),
                constructor: MenuTextButton,
                x: bindingx, y: 0, text: bindingName,
                font: this_2.font, style: this_2.style,
                onClick: function () {
                    global.game.playSound('click');
                    _this.selectBinding(bindingId);
                },
            });
            bindingx += (bindingName.length + 3) * this_2.font.charWidth;
            text += " ".repeat(bindingName.length) + " / ";
        };
        var this_2 = this;
        try {
            for (var controlBindings_1 = __values(controlBindings), controlBindings_1_1 = controlBindings_1.next(); !controlBindings_1_1.done; controlBindings_1_1 = controlBindings_1.next()) {
                var binding = controlBindings_1_1.value;
                _loop_2(binding);
            }
        }
        catch (e_24_1) { e_24 = { error: e_24_1 }; }
        finally {
            try {
                if (controlBindings_1_1 && !controlBindings_1_1.done && (_a = controlBindings_1.return)) _a.call(controlBindings_1);
            }
            finally { if (e_24) throw e_24.error; }
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
            var scriptFunctions_1, scriptFunctions_1_1, scriptFunction, e_25_1;
            var e_25, _a;
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
                        e_25_1 = _b.sent();
                        e_25 = { error: e_25_1 };
                        return [3 /*break*/, 7];
                    case 6:
                        try {
                            if (scriptFunctions_1_1 && !scriptFunctions_1_1.done && (_a = scriptFunctions_1.return)) _a.call(scriptFunctions_1);
                        }
                        finally { if (e_25) throw e_25.error; }
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
        var e_26, _a;
        try {
            for (var _b = __values(this.activeSounds), _c = _b.next(); !_c.done; _c = _b.next()) {
                var sound = _c.value;
                sound.markForDisable();
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
    GlobalSoundManager.prototype.postGameUpdate = function () {
        var e_27, _a;
        try {
            for (var _b = __values(this.activeSounds), _c = _b.next(); !_c.done; _c = _b.next()) {
                var sound = _c.value;
                if (sound.isMarkedForDisable) {
                    this.ensureSoundDisabled(sound);
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
        if (this.webAudioSound.loop !== this.loop)
            this.webAudioSound.loop = this.loop;
    };
    return Sound;
}());
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
        get: function () { return this.gainNode.gain.value; },
        set: function (value) { this.gainNode.gain.value = value; },
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
        debug(this.done);
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
        var e_28, _a;
        if (anchorX === void 0) { anchorX = 0; }
        if (anchorY === void 0) { anchorY = 0; }
        var result = this.baseTexture.subdivide(h, v);
        try {
            for (var result_1 = __values(result), result_1_1 = result_1.next(); !result_1_1.done; result_1_1 = result_1.next()) {
                var subdivision = result_1_1.value;
                subdivision.texture = AnchoredTexture.fromBaseTexture(subdivision.texture, anchorX, anchorY);
            }
        }
        catch (e_28_1) { e_28 = { error: e_28_1 }; }
        finally {
            try {
                if (result_1_1 && !result_1_1.done && (_a = result_1.return)) _a.call(result_1);
            }
            finally { if (e_28) throw e_28.error; }
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
    Draw.pixel = function (texture, x, y, brush) {
        if (brush === void 0) { brush = Draw.brush; }
        Draw.PIXEL_TEXTURE.renderTo(texture, {
            x: x, y: y,
            tint: brush.color,
            alpha: brush.alpha,
        });
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
    function none() {
        return new EmptyTexture();
    }
    Texture.none = none;
    function outlineRect(width, height, outlineColor, outlineAlpha, outlineThickness) {
        if (outlineAlpha === void 0) { outlineAlpha = 1; }
        if (outlineThickness === void 0) { outlineThickness = 1; }
        var result = new BasicTexture(width, height);
        Draw.rectangleOutline(result, 0, 0, width, height, Draw.ALIGNMENT_INNER, { color: outlineColor, alpha: outlineAlpha, thickness: outlineThickness });
        return result;
    }
    Texture.outlineRect = outlineRect;
    function setFilterProperties(filter, posx, posy) {
        filter.setTexturePosition(posx, posy);
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
/// <reference path="../worldObject/sprite/sprite.ts" />
var DialogBox = /** @class */ (function (_super) {
    __extends(DialogBox, _super);
    function DialogBox(config) {
        var _this = _super.call(this, config) || this;
        _this.charQueue = [];
        _this.textAreaFull = config.textAreaFull;
        _this.portraitPosition = config.portraitPosition;
        _this.textAreaPortrait = config.textAreaPortrait;
        _this.textArea = _this.textAreaFull;
        _this.done = true;
        _this.spriteText = new SpriteText({
            font: config.spriteTextFont,
        });
        var textAreaWorldRect = _this.getTextAreaWorldRect();
        _this.spriteText.mask = {
            texture: Texture.filledRect(textAreaWorldRect.width, textAreaWorldRect.height, 0xFFFFFF),
            type: 'world',
            offsetx: textAreaWorldRect.x,
            offsety: textAreaWorldRect.y,
        };
        _this.spriteTextOffset = 0;
        _this.portraitSprite = new Sprite({});
        _this.characterTimer = new Timer(0.05, function () { return _this.advanceCharacter(); }, true);
        return _this;
    }
    DialogBox.prototype.update = function () {
        _super.prototype.update.call(this);
        this.characterTimer.update(this.delta);
        if (this.done) {
            this.visible = false;
        }
        if (Input.justDown(Input.GAME_ADVANCE_DIALOG)) {
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
        var e_29, _a;
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
        catch (e_29_1) { e_29 = { error: e_29_1 }; }
        finally {
            try {
                if (interactableObjects_1_1 && !interactableObjects_1_1.done && (_a = interactableObjects_1.return)) _a.call(interactableObjects_1);
            }
            finally { if (e_29) throw e_29.error; }
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
            worldObject = this.theater.currentWorld.getWorldObjectByName(obj);
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
        var _this = _super.call(this, config, {
            x: global.gameWidth / 2,
            y: global.gameHeight / 2,
        }) || this;
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
        // Remove old stuff
        if (this.currentWorld) {
            World.Actions.removeWorldObjectFromWorld(this.currentWorldAsWorldObject);
        }
        this.theater.interactionManager.reset();
        // Create new stuff
        this.currentStageName = name;
        this.currentWorld = World.fromConfig(this.stages[name]);
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
        Fade.prototype.render = function (screen) {
            _super.prototype.render.call(this, screen);
            this.oldSnapshot.renderTo(screen);
            this.newSnapshot.renderTo(screen, {
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
            ],
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
    Object.defineProperty(Theater.prototype, "currentStage", {
        get: function () { return (this.stageManager && this.stageManager.stages) ? this.stageManager.stages[this.stageManager.currentStageName] : undefined; },
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
(function (Theater) {
    var WorldAsWorldObject = /** @class */ (function (_super) {
        __extends(WorldAsWorldObject, _super);
        function WorldAsWorldObject(containedWorld) {
            var _this = this;
            var texture = new BasicTexture(containedWorld.width, containedWorld.height);
            _this = _super.call(this, { texture: texture }) || this;
            _this.containedWorld = containedWorld;
            _this.worldTexture = texture;
            return _this;
        }
        WorldAsWorldObject.prototype.update = function () {
            _super.prototype.update.call(this);
            this.containedWorld.update();
        };
        WorldAsWorldObject.prototype.render = function (screen) {
            this.worldTexture.clear();
            this.containedWorld.render(this.worldTexture);
            _super.prototype.render.call(this, screen);
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
    function StoryManager(theater, storyboard, storyboardPath, events, storyConfig) {
        var _this = this;
        this.theater = theater;
        this.storyboard = storyboard;
        this.cutsceneManager = new CutsceneManager(theater, storyboard);
        this.eventManager = new StoryEventManager(theater, events);
        this.storyConfig = new StoryConfig(theater, storyConfig);
        this.stateMachine = new StateMachine();
        var _loop_3 = function (storyNodeName) {
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
                if (transition.type === 'instant') {
                    return {
                        type: 'instant',
                        toState: transition.toNode,
                    };
                }
                if (transition.type === 'onCondition') {
                    return {
                        type: 'condition',
                        condition: transition.condition,
                        toState: transition.toNode,
                    };
                }
                if (transition.type === 'onStage') {
                    return {
                        type: 'condition',
                        condition: function () { return _this.theater.currentStageName === transition.stage && !_this.theater.stageManager.transitioning; },
                        toState: transition.toNode,
                    };
                }
                if (transition.type === 'onInteract') {
                    return {
                        type: 'condition',
                        condition: function () {
                            if (_this.theater.interactionManager.interactRequested === transition.with) {
                                _this.theater.interactionManager.consumeInteraction();
                                return true;
                            }
                            return false;
                        },
                        toState: transition.toNode,
                    };
                }
                error("Invalid transition type! Did you forget to add the transition to storyManager?");
                return undefined;
            });
            this_3.stateMachine.addState(storyNodeName, state);
        };
        var this_3 = this;
        for (var storyNodeName in storyboard) {
            _loop_3(storyNodeName);
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
        var e_30, _a;
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
        catch (e_30_1) { e_30 = { error: e_30_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_30) throw e_30.error; }
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
        var e_31, _a, e_32, _b;
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
            catch (e_31_1) { e_31 = { error: e_31_1 }; }
            finally {
                try {
                    if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
                }
                finally { if (e_31) throw e_31.error; }
            }
        }
        if (!_.isEmpty(party.setMembersInactive)) {
            try {
                for (var _e = __values(party.setMembersInactive), _f = _e.next(); !_f.done; _f = _e.next()) {
                    var m = _f.value;
                    this.theater.partyManager.setMemberInactive(m);
                }
            }
            catch (e_32_1) { e_32 = { error: e_32_1 }; }
            finally {
                try {
                    if (_f && !_f.done && (_b = _e.return)) _b.call(_e);
                }
                finally { if (e_32) throw e_32.error; }
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
        var e_33, _a;
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
        catch (e_33_1) { e_33 = { error: e_33_1 }; }
        finally {
            try {
                if (array_1_1 && !array_1_1.done && (_a = array_1.return)) _a.call(array_1);
            }
            finally { if (e_33) throw e_33.error; }
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
    function lerpTime(a, b, speed, delta) {
        // From https://www.gamasutra.com/blogs/ScottLembcke/20180404/316046/Improved_Lerp_Smoothing.php
        return lerp(a, b, Math.pow(2, -speed * delta));
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
var O;
(function (O) {
    function deepClone(obj) {
        return deepCloneInternal(obj);
    }
    O.deepClone = deepClone;
    function deepCloneInternal(obj) {
        var e_34, _a;
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
            catch (e_34_1) { e_34 = { error: e_34_1 }; }
            finally {
                try {
                    if (obj_1_1 && !obj_1_1.done && (_a = obj_1.return)) _a.call(obj_1);
                }
                finally { if (e_34) throw e_34.error; }
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
        var _this = this;
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
        this.script = new Script(S.chain(stateScript, S.loopFor(Infinity, S.chain(S.call(function () {
            var transition = _this.getValidTransition(_this.currentState);
            if (transition) {
                _this.setState(transition.toState);
            }
        }), S.yield()))));
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
        var e_35, _a;
        try {
            for (var _b = __values(state.transitions || []), _c = _b.next(); !_c.done; _c = _b.next()) {
                var transition = _c.value;
                if (transition.type === 'instant') {
                    return transition;
                }
                else if (transition.type === 'condition') {
                    if (transition.condition())
                        return transition;
                }
                else {
                    /// @ts-ignore
                    error("Invalid transition type " + transition.type + " for transition", transition);
                }
            }
        }
        catch (e_35_1) { e_35 = { error: e_35_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_35) throw e_35.error; }
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
                target = world.getWorldObjectByName(target);
            }
            this.moveTowardsPoint(target.x + this.mode.offset.x, target.y + this.mode.offset.y, world.delta);
        }
        else if (this.mode.type === 'focus') {
            this.moveTowardsPoint(this.mode.point.x, this.mode.point.y, world.delta);
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
                target = world.getWorldObjectByName(target);
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
                this.x = M.lerp(this.x, targetx, 0.25);
            }
            if (Math.abs(dy) > hh) {
                var ty = Math.abs(hh / dy);
                var targety = this.y + (1 - ty) * dy;
                this.y = M.lerp(this.y, targety, 0.25);
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
    Camera.prototype.setMovementSmooth = function (deadZoneWidth, deadZoneHeight) {
        if (deadZoneWidth === void 0) { deadZoneWidth = 0; }
        if (deadZoneHeight === void 0) { deadZoneHeight = 0; }
        this.setMovement({
            type: 'smooth',
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
var Physics = /** @class */ (function () {
    function Physics() {
    }
    Physics.collide = function (obj, from, options) {
        var e_36, _a;
        if (options === void 0) { options = {}; }
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
        var collidingWith = from.filter(function (other) { return obj !== other && other.colliding && obj.isCollidingWith(other) && other.isCollidingWith(obj); });
        var iters = 0;
        while (!_.isEmpty(collidingWith) && iters < options.maxIters) {
            var collisions = collidingWith.map(function (other) { return Physics.getCollision(obj, other); });
            collisions.sort(function (a, b) { return a.t - b.t; });
            try {
                for (var collisions_1 = (e_36 = void 0, __values(collisions)), collisions_1_1 = collisions_1.next(); !collisions_1_1.done; collisions_1_1 = collisions_1.next()) {
                    var collision = collisions_1_1.value;
                    var d = Physics.separate(collision);
                    if (d !== 0 && options.transferMomentum) {
                        Physics.transferMomentum(collision);
                    }
                    collision.move.onCollide(collision.from);
                    collision.from.onCollide(collision.move);
                    if (options.callback) {
                        options.callback(collision.move, collision.from);
                    }
                }
            }
            catch (e_36_1) { e_36 = { error: e_36_1 }; }
            finally {
                try {
                    if (collisions_1_1 && !collisions_1_1.done && (_a = collisions_1.return)) _a.call(collisions_1);
                }
                finally { if (e_36) throw e_36.error; }
            }
            collidingWith = collidingWith.filter(function (other) { return obj.isCollidingWith(other); });
            iters++;
        }
        return { x: obj.x - startX, y: obj.y - startY };
    };
    Physics.getCollision = function (obj, from) {
        var _a;
        var dx1 = obj.x - obj.physicslastx;
        var dy1 = obj.y - obj.physicslasty;
        var dx2 = from.x - from.physicslastx;
        var dy2 = from.y - from.physicslasty;
        var b1 = obj.bounds.getBoundingBox(obj.physicslastx, obj.physicslasty);
        var b2 = from.bounds.getBoundingBox(from.physicslastx, from.physicslasty);
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
            error('collision was neither vertical nor horizontal:', result);
        }
        return result;
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
        var objBounds = obj.bounds.getBoundingBox();
        var fromBounds = from.bounds.getBoundingBox();
        if (!G.overlapRectangles(objBounds, fromBounds)) {
            return 0;
        }
        var leftdx = fromBounds.right - objBounds.left;
        var rightdx = fromBounds.left - objBounds.right;
        var relativedx = (obj.x - obj.physicslastx) - (from.x - from.physicslastx);
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
        var objBounds = obj.bounds.getBoundingBox();
        var fromBounds = from.bounds.getBoundingBox();
        if (!G.overlapRectangles(objBounds, fromBounds)) {
            return 0;
        }
        var updy = fromBounds.bottom - objBounds.top;
        var downdy = fromBounds.top - objBounds.bottom;
        var relativedy = (obj.y - obj.physicslasty) - (from.y - from.physicslasty);
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
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Collision.prototype, "isHorizontal", {
            get: function () {
                return this.direction === Collision.Direction.LEFT || this.direction === Collision.Direction.RIGHT;
            },
            enumerable: false,
            configurable: true
        });
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
var Physics2;
(function (Physics2) {
    function resolveCollisions(world) {
        var e_37, _a;
        var iter = 0;
        while (iter < world.collisionIterations) {
            iter++;
            debug("begin iter " + iter);
            var collisions = getRaycastCollisions(world)
                .sort(function (a, b) { return a.collision.t - b.collision.t; });
            debug('collisions:', collisions);
            try {
                for (var collisions_2 = (e_37 = void 0, __values(collisions)), collisions_2_1 = collisions_2.next(); !collisions_2_1.done; collisions_2_1 = collisions_2.next()) {
                    var collision = collisions_2_1.value;
                    resolveCollision(world, collision);
                }
            }
            catch (e_37_1) { e_37 = { error: e_37_1 }; }
            finally {
                try {
                    if (collisions_2_1 && !collisions_2_1.done && (_a = collisions_2.return)) _a.call(collisions_2);
                }
                finally { if (e_37) throw e_37.error; }
            }
            debug("end iter " + iter);
        }
    }
    Physics2.resolveCollisions = resolveCollisions;
    function resolveCollision(world, collision) {
        var displacementCollision = {
            move: collision.move,
            from: collision.from,
            collision: collision.move.bounds.getDisplacementCollision(collision.from.bounds),
        };
        if (!displacementCollision || !displacementCollision.collision)
            return;
        var antiDisplacementCollision = {
            move: displacementCollision.from,
            from: displacementCollision.move,
            collision: {
                bounds1: displacementCollision.from.bounds,
                bounds2: displacementCollision.move.bounds,
                displacementX: -displacementCollision.collision.displacementX,
                displacementY: -displacementCollision.collision.displacementY,
            }
        };
        applyDisplacementForCollision(displacementCollision);
        applyDisplacementForCollision(antiDisplacementCollision);
        applyMomentumTransferForCollision(world.delta, displacementCollision);
        applyMomentumTransferForCollision(world.delta, antiDisplacementCollision);
    }
    function getRaycastCollisions(world) {
        var e_38, _a;
        var raycastCollisions = [];
        for (var moveGroup in world.collisions) {
            try {
                for (var _b = (e_38 = void 0, __values(world.physicsGroups[moveGroup].worldObjects)), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var move = _c.value;
                    raycastCollisions.push.apply(raycastCollisions, __spread(getRaycastCollisionsForMoveObject(world, move)));
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
        return raycastCollisions;
    }
    function getRaycastCollisionsForMoveObject(world, move) {
        var e_39, _a, e_40, _b;
        var raycastCollisions = [];
        try {
            for (var _c = __values(world.collisions[move.physicsGroup]), _d = _c.next(); !_d.done; _d = _c.next()) {
                var collision = _d.value;
                var fromGroup = collision.collidingPhysicsGroup;
                try {
                    for (var _e = (e_40 = void 0, __values(world.physicsGroups[fromGroup].worldObjects)), _f = _e.next(); !_f.done; _f = _e.next()) {
                        var from = _f.value;
                        if (move === from)
                            continue;
                        if (!G.overlapRectangles(move.bounds.getBoundingBox(), from.bounds.getBoundingBox()))
                            continue;
                        raycastCollisions.push({
                            move: move, from: from,
                            collision: move.bounds.getRaycastCollision(move.x - move.physicslastx, move.y - move.physicslasty, from.bounds, from.x - from.physicslastx, from.y - from.physicslasty),
                        });
                    }
                }
                catch (e_40_1) { e_40 = { error: e_40_1 }; }
                finally {
                    try {
                        if (_f && !_f.done && (_b = _e.return)) _b.call(_e);
                    }
                    finally { if (e_40) throw e_40.error; }
                }
            }
        }
        catch (e_39_1) { e_39 = { error: e_39_1 }; }
        finally {
            try {
                if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
            }
            finally { if (e_39) throw e_39.error; }
        }
        return raycastCollisions.filter(function (col) { return col && col.collision; });
    }
    // <---------------------------------------------> //
    function resolveCollisions_old(world) {
        var e_41, _a;
        //debug('start collisions')
        var iter = 0;
        while (iter < world.collisionIterations) {
            iter++;
            var collisions = getCollisions(world);
            if (_.isEmpty(collisions)) {
                break;
            }
            try {
                //debug(collisions);
                for (var collisions_3 = (e_41 = void 0, __values(collisions)), collisions_3_1 = collisions_3.next(); !collisions_3_1.done; collisions_3_1 = collisions_3.next()) {
                    var collision = collisions_3_1.value;
                    applyDisplacementForCollision(collision);
                    applyMomentumTransferForCollision(world.delta, collision);
                }
            }
            catch (e_41_1) { e_41 = { error: e_41_1 }; }
            finally {
                try {
                    if (collisions_3_1 && !collisions_3_1.done && (_a = collisions_3.return)) _a.call(collisions_3);
                }
                finally { if (e_41) throw e_41.error; }
            }
        }
    }
    Physics2.resolveCollisions_old = resolveCollisions_old;
    function getCollisions(world) {
        return _.flatten(_.values(world.physicsGroups).map(function (group) { return group.worldObjects.map(function (obj) { return getCollisionsForObject(obj, world); }); }));
    }
    function getCollisionsForObject(obj, world) {
        var collidingObjs = _.flatten(world.collisions[obj.physicsGroup].map(function (col) { return world.physicsGroups[col.collidingPhysicsGroup].worldObjects; }));
        var possibleCollidingObjs = collidingObjs.filter(function (colObj) { return G.overlapRectangles(obj.bounds.getBoundingBox(), colObj.bounds.getBoundingBox()); });
        var collisions = possibleCollidingObjs
            .map(function (other) { return ({
            move: obj,
            from: other,
            collision: obj.bounds.getRaycastCollision(obj.x - obj.physicslastx, obj.y - obj.physicslasty, other.bounds, other.x - other.physicslastx, other.y - other.physicslasty),
        }); })
            .filter(function (col) { return col.collision; })
            .sort(function (a, b) { return a.collision.t - b.collision.t; });
        if (_.isEmpty(collisions)) {
            return [];
        }
        var origObjX = obj.x;
        var origObjY = obj.y;
        var newCollisions = collisions.map(function (collision) {
            var newCollision = {
                move: collision.move,
                from: collision.from,
                collision: collision.move.bounds.getDisplacementCollision(collision.from.bounds),
            };
            if (newCollision.collision) {
                applyDisplacementForCollision(newCollision);
            }
            return newCollision;
        })
            .filter(function (col) { return col.collision; });
        obj.x = origObjX;
        obj.y = origObjY;
        return newCollisions;
    }
    function applyDisplacementForCollision(collision) {
        if (collision.move.immovable)
            return;
        if (collision.from.immovable) {
            collision.move.x += collision.collision.displacementX;
            collision.move.y += collision.collision.displacementY;
            return;
        }
        var massFactor = (collision.move.mass + collision.from.mass === 0) ? 1 :
            collision.from.mass / (collision.move.mass + collision.from.mass);
        collision.move.x += massFactor * collision.collision.displacementX;
        collision.move.y += massFactor * collision.collision.displacementY;
    }
    function applyMomentumTransferForCollision(delta, collision) {
        if (collision.move.immovable)
            return;
        var fromvx = (collision.from.x - collision.from.physicslastx) / delta;
        var fromvy = (collision.from.y - collision.from.physicslasty) / delta;
        collision.move.vx -= fromvx;
        collision.move.vy -= fromvy;
        zeroVelocityAgainstDisplacementAxis(collision.move, collision.collision.displacementX, collision.collision.displacementY);
        collision.move.vx += fromvx;
        collision.move.vy += fromvy;
    }
    function zeroVelocityAgainstDisplacementAxis(obj, dx, dy) {
        var dot = obj.vx * dx + obj.vy * dy;
        if (dot >= 0)
            return;
        var factor = dot / M.magnitudeSq(dx, dy);
        obj.vx -= factor * dx;
        obj.vy -= factor * dy;
    }
})(Physics2 || (Physics2 = {}));
var RectBounds = /** @class */ (function () {
    function RectBounds(x, y, width, height, parent) {
        this.parent = parent;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.boundingBox = new Rectangle(x, y, width, height);
    }
    RectBounds.prototype.getBoundingBox = function (x, y) {
        x = x !== null && x !== void 0 ? x : (this.parent ? this.parent.x : 0);
        y = y !== null && y !== void 0 ? y : (this.parent ? this.parent.y : 0);
        this.boundingBox.x = x + this.x;
        this.boundingBox.y = y + this.y;
        this.boundingBox.width = this.width;
        this.boundingBox.height = this.height;
        return this.boundingBox;
    };
    RectBounds.prototype.getRaycastCollision = function (dx, dy, other, otherdx, otherdy) {
        if (!this.isOverlapping(other)) {
            return undefined;
        }
        if (!(other instanceof RectBounds))
            return undefined;
        if (this.parent instanceof Box) {
            //debug("d", dx, dy);
        }
        var box = this.getBoundingBox();
        box.x -= dx;
        box.y -= dy;
        var otherbox = other.getBoundingBox();
        otherbox.x -= otherdx;
        otherbox.y -= otherdy;
        var topbot_t = Infinity;
        var bottop_t = Infinity;
        var leftright_t = Infinity;
        var rightleft_t = Infinity;
        if (dy !== otherdy) {
            topbot_t = (box.top - otherbox.bottom) / (otherdy - dy);
            if (box.right + dx * topbot_t <= otherbox.left + otherdx * topbot_t || box.left + dx * topbot_t >= otherbox.right + otherdx * topbot_t) {
                topbot_t = Infinity;
            }
            bottop_t = (box.bottom - otherbox.top) / (otherdy - dy);
            if (box.right + dx * bottop_t <= otherbox.left + otherdx * bottop_t || box.left + dx * bottop_t >= otherbox.right + otherdx * bottop_t) {
                bottop_t = Infinity;
            }
        }
        if (dx !== otherdx) {
            leftright_t = (box.left - otherbox.right) / (otherdx - dx);
            if (box.bottom + dy * leftright_t <= otherbox.top + otherdy * leftright_t || box.top + dy * leftright_t >= otherbox.bottom + otherdy * leftright_t) {
                leftright_t = Infinity;
            }
            rightleft_t = (box.right - otherbox.left) / (otherdx - dx);
            if (box.bottom + dy * rightleft_t <= otherbox.top + otherdy * rightleft_t || box.top + dy * rightleft_t >= otherbox.bottom + otherdy * rightleft_t) {
                rightleft_t = Infinity;
            }
        }
        var min_t = Math.min(topbot_t, bottop_t, leftright_t, rightleft_t);
        if (min_t === Infinity)
            return undefined;
        var displacementX = 0;
        var displacementY = 0;
        var currentBox = this.getBoundingBox();
        var currentOtherBox = other.getBoundingBox();
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
        // if (min_t === topbot_t || min_t === bottop_t) {
        //     displacementY = M.argmin([currentOtherBox.bottom - currentBox.top, currentOtherBox.top - currentBox.bottom], Math.abs);
        // }
        // if (min_t === leftright_t || min_t === rightleft_t) {
        //     displacementX = M.argmin([currentOtherBox.right - currentBox.left, currentOtherBox.left - currentBox.right], Math.abs);
        // }
        if (displacementX !== 0 && displacementY !== 0) {
            error("Warning: rect displacement in both axes");
        }
        if (this.parent instanceof Box) {
            //debug("disp", displacementX, displacementY);
        }
        //debug(min_t);
        return {
            bounds1: this,
            bounds2: other,
            t: min_t,
        };
    };
    RectBounds.prototype.getDisplacementCollision = function (other) {
        if (!this.isOverlapping(other)) {
            return undefined;
        }
        if (!(other instanceof RectBounds))
            return undefined;
        var currentBox = this.getBoundingBox();
        var currentOtherBox = other.getBoundingBox();
        var displacementX = M.argmin([currentOtherBox.right - currentBox.left, currentOtherBox.left - currentBox.right], Math.abs);
        var displacementY = M.argmin([currentOtherBox.bottom - currentBox.top, currentOtherBox.top - currentBox.bottom], Math.abs);
        if (Math.abs(displacementX) < Math.abs(displacementY)) {
            displacementY = 0;
        }
        else {
            displacementX = 0;
        }
        return {
            bounds1: this,
            bounds2: other,
            displacementX: displacementX,
            displacementY: displacementY,
        };
    };
    RectBounds.prototype.isOverlapping = function (other) {
        if (!(other instanceof RectBounds))
            return false;
        return G.overlapRectangles(this.getBoundingBox(), other.getBoundingBox());
    };
    return RectBounds;
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
    Effects.prototype.getFilterList = function () {
        return this.pre.filters.concat(this.effects).concat(this.post.filters);
    };
    Effects.prototype.updateEffects = function (delta) {
        var e_42, _a, e_43, _b;
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
        catch (e_42_1) { e_42 = { error: e_42_1 }; }
        finally {
            try {
                if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
            }
            finally { if (e_42) throw e_42.error; }
        }
        try {
            for (var _e = __values(this.post.filters), _f = _e.next(); !_f.done; _f = _e.next()) {
                var filter = _f.value;
                filter.updateTime(delta);
            }
        }
        catch (e_43_1) { e_43 = { error: e_43_1 }; }
        finally {
            try {
                if (_f && !_f.done && (_b = _e.return)) _b.call(_e);
            }
            finally { if (e_43) throw e_43.error; }
        }
    };
    Effects.prototype.updateFromConfig = function (config) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
        if (!config)
            return;
        if (config.pre) {
            this.pre.filters = (_a = config.pre.filters) !== null && _a !== void 0 ? _a : [];
            this.pre.enabled = (_b = config.pre.enabled) !== null && _b !== void 0 ? _b : true;
        }
        if (config.silhouette) {
            this.silhouette.color = (_c = config.silhouette.color) !== null && _c !== void 0 ? _c : 0x000000;
            this.silhouette.alpha = (_d = config.silhouette.alpha) !== null && _d !== void 0 ? _d : 1;
            this.silhouette.enabled = (_e = config.silhouette.enabled) !== null && _e !== void 0 ? _e : true;
        }
        if (config.outline) {
            this.outline.color = (_f = config.outline.color) !== null && _f !== void 0 ? _f : 0x000000;
            this.outline.alpha = (_g = config.outline.alpha) !== null && _g !== void 0 ? _g : 1;
            this.outline.enabled = (_h = config.outline.enabled) !== null && _h !== void 0 ? _h : true;
        }
        if (config.post) {
            this.post.filters = (_j = config.post.filters) !== null && _j !== void 0 ? _j : [];
            this.post.enabled = (_k = config.post.enabled) !== null && _k !== void 0 ? _k : true;
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
                        "float alpha": 1.0
                    },
                    code: "\n                        if (inp.a > 0.0) {\n                            outp = vec4(color, alpha);\n                        }\n                    "
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
    function Warp(config) {
        var _a;
        var _this = _super.call(this, config) || this;
        _this.stage = _this.data.stage;
        _this.entryPoint = _this.data.entryPoint;
        _this.transition = (_a = _this.data.transition) !== null && _a !== void 0 ? _a : Transition.INSTANT;
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
                texture: (_.isString(textures[i]) || _.isNumber(textures[i])) ? "" + config.texturePrefix + textures[i] : textures[i],
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
        var e_44, _a;
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
            catch (e_44_1) { e_44 = { error: e_44_1 }; }
            finally {
                try {
                    if (word_1_1 && !word_1_1.done && (_a = word_1.return)) _a.call(word_1);
                }
                finally { if (e_44) throw e_44.error; }
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
        var _a, _b, _c, _d;
        var _this = _super.call(this, config) || this;
        _this.tilemap = Tilemap.cloneTilemap(_.isString(config.tilemap) ? AssetCache.getTilemap(config.tilemap) : config.tilemap);
        _this.tilemapLayer = (_a = config.tilemapLayer) !== null && _a !== void 0 ? _a : 0;
        _this.animation = config.animation;
        _this.zMap = (_b = config.zMap) !== null && _b !== void 0 ? _b : {};
        _this.debugDrawBounds = (_d = (_c = config.debug) === null || _c === void 0 ? void 0 : _c.drawBounds) !== null && _d !== void 0 ? _d : false;
        _this.dirty = true;
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
    Tilemap.prototype.createTilemap = function () {
        this.drawRenderTexture();
        this.createCollisionBoxes();
    };
    Tilemap.prototype.getTile = function (x, y) {
        return this.currentTilemapLayer[y][x];
    };
    Tilemap.prototype.setTile = function (x, y, tile) {
        this.currentTilemapLayer[y][x] = O.deepClone(tile);
        this.dirty = true;
    };
    Tilemap.prototype.createCollisionBoxes = function () {
        var e_45, _a;
        World.Actions.removeWorldObjectsFromWorld(this.collisionBoxes);
        this.collisionBoxes = [];
        var collisionRects = Tilemap.getCollisionRects(this.currentTilemapLayer, this.tileset);
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
                    debug: {
                        drawBounds: this.debugDrawBounds,
                    },
                });
                this.collisionBoxes.push(box);
            }
        }
        catch (e_45_1) { e_45 = { error: e_45_1 }; }
        finally {
            try {
                if (collisionRects_1_1 && !collisionRects_1_1.done && (_a = collisionRects_1.return)) _a.call(collisionRects_1);
            }
            finally { if (e_45) throw e_45.error; }
        }
        this.addChildren(this.collisionBoxes);
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
            var zTexture = World.Actions.addChildToParent(new Sprite({
                layer: this.layer,
                x: this.x + texturesByZ[zValue].bounds.x,
                y: this.y + texturesByZ[zValue].bounds.y + zHeight,
                texture: this.animation ? undefined : texturesByZ[zValue].frames[0],
                animations: this.animation ? [
                    Animations.fromTextureList({ name: 'play', textures: texturesByZ[zValue].frames, frameRate: this.animation.frameRate, count: -1 })
                ] : undefined,
                defaultAnimation: this.animation ? 'play' : undefined,
                offset: { x: 0, y: -zHeight },
            }), this);
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
        var _loop_4 = function (zValue) {
            zTextureSlots[zValue].bounds.x = zTextureSlots[zValue].tileBounds.left * tileset.tileWidth;
            zTextureSlots[zValue].bounds.y = zTextureSlots[zValue].tileBounds.top * tileset.tileHeight;
            zTextureSlots[zValue].bounds.width = (zTextureSlots[zValue].tileBounds.right - zTextureSlots[zValue].tileBounds.left + 1) * tileset.tileWidth;
            zTextureSlots[zValue].bounds.height = (zTextureSlots[zValue].tileBounds.bottom - zTextureSlots[zValue].tileBounds.top + 1) * tileset.tileHeight;
            var numFrames = animation ? animation.frames : 1;
            zTextureSlots[zValue].frames = A.range(numFrames).map(function (i) { return new BasicTexture(zTextureSlots[zValue].bounds.width, zTextureSlots[zValue].bounds.height); });
        };
        for (var zValue in zTextureSlots) {
            _loop_4(zValue);
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
        _this.baseTilemap = _this.tilemap;
        _this.smartConfig = config.data.smartConfig;
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
            var e_46, _a;
            var pattern = getTilePattern(tilemap, x, y, config);
            try {
                for (var _b = __values(config.rules), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var rule = _c.value;
                    if (pattern.search(rule.pattern) > -1) {
                        return rule.tile;
                    }
                }
            }
            catch (e_46_1) { e_46 = { error: e_46_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_46) throw e_46.error; }
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
        'none': {},
        'blank': {},
        // Debug
        'debug': {},
        // Fonts
        'deluxe16': {},
        // Tiles
        'tiles': {
            defaultAnchor: Anchor.CENTER,
            spritesheet: { frameWidth: 32, frameHeight: 32 },
        },
        'player': {
            anchor: Anchor.BOTTOM,
        },
        'platform': {},
    };
    Assets.sounds = {
        // Debug
        'debug': {},
        // SFX
        'click': {},
    };
    Assets.tilesets = {
        'tiles': {
            tiles: Preload.allTilesWithPrefix('tiles_'),
            tileWidth: 32,
            tileHeight: 32,
            collisionIndices: [0, 1, 2, 3, 4, 5],
        }
    };
    Assets.pyxelTilemaps = {
        'main_tilemap': {
            tileset: Assets.tilesets['tiles'],
            url: 'assets/tiles.json'
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
    Assets.spriteTextTags = {};
})(Assets || (Assets = {}));
function BASE_STAGE() {
    return {
        constructor: World,
        backgroundColor: 0xFFFFFF,
        layers: [
            { name: 'bg' },
            { name: 'ground' },
            { name: 'main' },
            { name: 'fg' },
            { name: 'above' },
        ],
        physicsGroups: {
            'player': {},
            'boxes': {},
            'walls': {},
        },
        collisions: {
            'boxes': [
                { collidingPhysicsGroup: 'player' },
                { collidingPhysicsGroup: 'walls' },
            ],
            'player': [
                { collidingPhysicsGroup: 'boxes' },
                { collidingPhysicsGroup: 'walls' },
            ],
            'walls': [
                { collidingPhysicsGroup: 'boxes' },
                { collidingPhysicsGroup: 'player' },
            ],
        },
        // collisionOrder: [
        //     { move: ['boxes'], from: ['player'] },
        //     { move: ['boxes'], from: ['walls'] },
        //     { move: ['player'], from: ['boxes'] },
        //     { move: ['player'], from: ['walls'] },
        // ],
        collisionIterations: 2,
    };
}
function MENU_BASE_STAGE() {
    return {
        constructor: World,
        backgroundColor: 0x000000,
        volume: 0,
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
var Box = /** @class */ (function (_super) {
    __extends(Box, _super);
    function Box(config) {
        var _this = _super.call(this, config, {
            texture: 'debug',
            tint: 0x00FF00,
            scaleX: 2,
            scaleY: 2,
            gravityy: 200,
            bounds: { x: 0, y: 0, width: 32, height: 32 },
        }) || this;
        _this.carrierModule = new CarrierModule(_this);
        return _this;
    }
    Box.prototype.update = function () {
        //this.vx *= 0.98;
        _super.prototype.update.call(this);
    };
    Box.prototype.postUpdate = function () {
        _super.prototype.postUpdate.call(this);
        this.carrierModule.postUpdate();
    };
    return Box;
}(Sprite));
var CarrierModule = /** @class */ (function () {
    function CarrierModule(obj) {
        this.riders = [];
        this.obj = obj;
    }
    CarrierModule.prototype.postUpdate = function () {
        var e_47, _a;
        var objBounds = this.obj.bounds.getBoundingBox();
        var checkBounds = new RectBounds(objBounds.x, objBounds.y - 1, objBounds.width, 1);
        try {
            for (var _b = __values(this.obj.world.getPhysicsObjectsThatCollideWith(this.obj.physicsGroup)), _c = _b.next(); !_c.done; _c = _b.next()) {
                var potentialRider = _c.value;
                if (potentialRider instanceof OneWayPlatform || potentialRider instanceof MovingPlatform)
                    continue;
                if (potentialRider.isOverlapping(checkBounds)) {
                    if (_.contains(this.riders, potentialRider))
                        continue;
                    if (potentialRider.parent)
                        continue; // Disallow riding by any child object
                    this.obj.addChildKeepWorldPosition(potentialRider);
                    this.riders.push(potentialRider);
                }
                else {
                    if (!_.contains(this.riders, potentialRider))
                        continue;
                    A.removeAll(this.riders, potentialRider);
                    if (_.contains(this.obj.children, potentialRider)) {
                        this.obj.removeChildKeepWorldPosition(potentialRider);
                    }
                }
            }
        }
        catch (e_47_1) { e_47 = { error: e_47_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_47) throw e_47.error; }
        }
    };
    return CarrierModule;
}());
/// <reference path="../lectvs/debug/cheat.ts" />
Cheat.init({
    'win': function (x) { return x * x; },
});
/// <reference path="../lectvs/menu/menu.ts" />
var MainMenu = /** @class */ (function (_super) {
    __extends(MainMenu, _super);
    function MainMenu(menuSystem) {
        var _this = _super.call(this, menuSystem, {
            parent: MENU_BASE_STAGE(),
            worldObjects: [
                {
                    constructor: SpriteText,
                    x: 20, y: 20, text: "- platformer test -",
                    font: Assets.fonts.DELUXE16, style: { color: 0xFFFFFF },
                },
                {
                    constructor: MenuTextButton,
                    x: 20, y: 50, text: "start",
                    font: Assets.fonts.DELUXE16, style: { color: 0xFFFFFF },
                    onClick: function () {
                        _this.menuSystem.game.playSound('click');
                        menuSystem.game.startGame();
                    },
                },
            ]
        }) || this;
        return _this;
    }
    return MainMenu;
}(Menu));
var PauseMenu = /** @class */ (function (_super) {
    __extends(PauseMenu, _super);
    function PauseMenu(menuSystem) {
        var _this = _super.call(this, menuSystem, {
            parent: MENU_BASE_STAGE(),
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
                    onClick: function () {
                        _this.menuSystem.game.playSound('click');
                        menuSystem.game.unpauseGame();
                    },
                },
                {
                    constructor: MenuTextButton,
                    x: 20, y: 80, text: "options",
                    font: Assets.fonts.DELUXE16, style: { color: 0xFFFFFF },
                    onClick: function () {
                        _this.menuSystem.game.playSound('click');
                        menuSystem.loadMenu(OptionsMenu);
                    },
                },
            ]
        }) || this;
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
            parent: MENU_BASE_STAGE(),
            worldObjects: [
                {
                    constructor: SpriteText,
                    x: 20, y: 20, text: "- options -",
                    font: Assets.fonts.DELUXE16, style: { color: 0xFFFFFF },
                },
                {
                    constructor: SpriteText,
                    x: 20, y: 50, text: "volume:",
                    font: Assets.fonts.DELUXE16, style: { color: 0xFFFFFF },
                },
                {
                    constructor: MenuNumericSelector,
                    x: 84, y: 50,
                    font: Assets.fonts.DELUXE16, style: { color: 0xFFFFFF },
                    barLength: 10,
                    minValue: 0,
                    maxValue: 1,
                    getValue: function () { return Options.getOption('volume'); },
                    setValue: function (v) { return Options.updateOption('volume', v); },
                },
                {
                    constructor: SpriteText,
                    x: 20, y: 80, text: "JUMP:",
                    font: Assets.fonts.DELUXE16, style: { color: 0xFFFFFF },
                },
                {
                    constructor: MenuControlMapper,
                    x: 68, y: 80,
                    font: Assets.fonts.DELUXE16, style: { color: 0xFFFFFF },
                    controlName: 'up',
                },
                {
                    constructor: MenuTextButton,
                    x: 20, y: 110, text: "back",
                    font: Assets.fonts.DELUXE16, style: { color: 0xFFFFFF },
                    onClick: function () {
                        _this.menuSystem.game.playSound('click');
                        menuSystem.back();
                    },
                },
            ]
        }) || this;
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
/// <reference path="./menus.ts"/>
Main.loadConfig({
    gameCodeName: "PlatformerTest",
    gameWidth: 960,
    gameHeight: 800,
    canvasScale: 1,
    backgroundColor: 0x000000,
    preloadBackgroundColor: 0x000000,
    preloadProgressBarColor: 0xFFFFFF,
    textures: Assets.textures,
    sounds: Assets.sounds,
    pyxelTilemaps: Assets.pyxelTilemaps,
    spriteTextTags: Assets.spriteTextTags,
    defaultOptions: {
        volume: 1,
        controls: {
            'left': ['ArrowLeft', 'a'],
            'right': ['ArrowRight', 'd'],
            'up': ['ArrowUp', 'w', ' '],
            'down': ['ArrowDown', 's'],
            'interact': ['e'],
            'placeBlock': ['MouseRight'],
            'destroyBlock': ['MouseLeft'],
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
        }
    },
    game: {
        entryPointMenuClass: MainMenu,
        pauseMenuClass: PauseMenu,
        theaterConfig: {
            getStages: getStages,
            stageToLoad: 'game',
            stageEntryPoint: 'main',
            story: {
                getStoryboard: getStoryboard,
                storyboardPath: ['start'],
                getStoryEvents: getStoryEvents,
                getStoryConfig: getStoryConfig,
            },
            getParty: getParty,
            dialogBox: {
                constructor: DialogBox,
                x: global.gameWidth / 2, y: global.gameHeight - 32,
                texture: 'none',
                spriteTextFont: Assets.fonts.DELUXE16,
                textAreaFull: { x: -114, y: -27, width: 228, height: 54 },
                textAreaPortrait: { x: -114, y: -27, width: 158, height: 54 },
                portraitPosition: { x: 78, y: 0 },
            },
        },
    },
    debug: {
        debug: true,
        font: Assets.fonts.DELUXE16,
        fontStyle: { color: 0x008800 },
        cheatsEnabled: true,
        allPhysicsBounds: true,
        moveCameraWithArrows: true,
        showOverlay: true,
        skipRate: 1,
        programmaticInput: false,
        autoplay: true,
        skipMainMenu: true,
        frameStepEnabled: true,
        frameStepStepKey: '1',
        frameStepRunKey: '2',
        resetOptionsAtStart: true,
    },
});
function get(name) {
    var worldObject = global.game.theater.currentWorld.getWorldObjectByName(name);
    if (worldObject)
        return worldObject;
    return undefined;
}
var MovingPlatform = /** @class */ (function (_super) {
    __extends(MovingPlatform, _super);
    function MovingPlatform(config) {
        var _this = _super.call(this, config) || this;
        _this.pathStart = config.data.pathStart;
        _this.pathEnd = config.data.pathEnd;
        _this.x = _this.pathStart.x;
        _this.y = _this.pathStart.y;
        _this.pathTimer = new Timer(Infinity);
        _this.pathTimer.speed = 2;
        _this.carrierModule = new CarrierModule(_this);
        return _this;
    }
    MovingPlatform.prototype.update = function () {
        _super.prototype.update.call(this);
        this.pathTimer.update(this.delta);
        this.x = M.lerp(this.pathStart.x, this.pathEnd.x, (1 - Math.cos(this.pathTimer.time)) / 2);
        this.y = M.lerp(this.pathStart.y, this.pathEnd.y, (1 - Math.cos(this.pathTimer.time)) / 2);
    };
    MovingPlatform.prototype.postUpdate = function () {
        _super.prototype.postUpdate.call(this);
        this.carrierModule.postUpdate();
    };
    return MovingPlatform;
}(Sprite));
var OneWayPlatform = /** @class */ (function (_super) {
    __extends(OneWayPlatform, _super);
    function OneWayPlatform(config) {
        return _super.call(this, config) || this;
    }
    OneWayPlatform.prototype.isCollidingWith = function (other) {
        if (!_super.prototype.isCollidingWith.call(this, other))
            return false;
        var otherdy = other.y - other.physicslasty;
        if (otherdy < 0)
            return false;
        var thisWorldBounds = this.bounds.getBoundingBox();
        var otherWorldBounds = other.bounds.getBoundingBox();
        if (otherWorldBounds.y + otherWorldBounds.height - otherdy > thisWorldBounds.y + 1)
            return false;
        return true;
    };
    return OneWayPlatform;
}(Sprite));
function getParty() {
    return {
        leader: 'none',
        activeMembers: ['none'],
        members: {}
    };
}
var Player = /** @class */ (function (_super) {
    __extends(Player, _super);
    function Player(config) {
        var _this = _super.call(this, config, {
            texture: 'player',
            tint: 0xFF0000,
            bounds: { x: -16, y: -64, width: 32, height: 64 },
            gravityy: 512,
        }) || this;
        _this.speed = 128;
        _this.jumpForce = 256;
        _this.controllerSchema = {
            left: function () { return Input.isDown('left'); },
            right: function () { return Input.isDown('right'); },
            jump: function () { return Input.justDown('up'); },
            crouch: function () { return Input.isDown('down'); },
            fallThrough: function () { return Input.justDown('down'); },
        };
        _this.ignoreOneWayCollision = false;
        return _this;
    }
    Player.prototype.update = function () {
        var haxis = (this.controller.right ? 1 : 0) - (this.controller.left ? 1 : 0);
        this.updateMovement(haxis);
        this.updateCrouch();
        _super.prototype.update.call(this);
    };
    Player.prototype.updateCrouch = function () {
        var _this = this;
        if (this.controller.crouch && !this.crouched) {
            this.startCrouch();
            this.crouched = true;
        }
        else if (!this.controller.crouch && this.crouched && this.canEndCrouch()) {
            this.endCrouch();
            this.crouched = false;
        }
        if (this.controller.fallThrough) {
            this.ignoreOneWayCollision = true;
            this.runScript(S.callAfterTime(0.05, function () { return _this.ignoreOneWayCollision = false; }));
        }
    };
    Player.prototype.isCollidingWith = function (other) {
        if (!_super.prototype.isCollidingWith.call(this, other))
            return false;
        if ((this.ignoreOneWayCollision || this.crouched) && other instanceof OneWayPlatform)
            return false;
        return true;
    };
    Player.prototype.updateMovement = function (haxis) {
        this.vx = haxis * this.speed;
        if (this.controller.jump) {
            this.vy = -this.jumpForce;
        }
    };
    Player.prototype.startCrouch = function () {
        this.bounds.y += 32;
        this.bounds.height = 32;
        this.scaleY = 0.5;
    };
    Player.prototype.canEndCrouch = function () {
        this.bounds.y -= 32;
        var overlappingWalls = this.world.overlap(this.bounds, this.world.getPhysicsGroupsThatCollideWith(this.physicsGroup))
            .filter(function (obj) { return !(obj instanceof OneWayPlatform); });
        this.bounds.y += 32;
        return _.isEmpty(overlappingWalls);
    };
    Player.prototype.endCrouch = function () {
        this.bounds.y -= 32;
        this.bounds.height = 64;
        this.scaleY = 1;
    };
    return Player;
}(Sprite));
function getStages() {
    return {
        'game': {
            parent: BASE_STAGE(),
            camera: {
                movement: { type: 'snap' },
                mode: Camera.Mode.FOCUS(global.gameWidth / 2, global.gameHeight / 2),
            },
            entryPoints: {
                'main': { x: global.gameWidth / 2, y: global.gameHeight / 2 },
            },
            worldObjects: [
                {
                    name: 'tiles',
                    constructor: SmartTilemap,
                    x: 0, y: 0,
                    tilemap: 'main_tilemap',
                    data: {
                        smartConfig: {
                            rules: SmartTilemap.Rule.oneBitRules({
                                airIndex: -1,
                                solidIndex: 0,
                                edgeUpIndex: 1,
                                cornerTopLeftIndex: 2,
                                inverseCornerTopLeftIndex: 3,
                                doubleEdgeHorizontalIndex: 4,
                                peninsulaUpIndex: 5,
                            }),
                            outsideRule: { type: 'extend' },
                            emptyRule: { type: 'noop' },
                        }
                    },
                    layer: 'main',
                    physicsGroup: 'walls',
                },
                {
                    name: 'player',
                    constructor: Player,
                    x: 180, y: 620,
                    layer: 'main',
                    physicsGroup: 'player',
                    controllable: true,
                },
                {
                    name: 'box',
                    constructor: Box,
                    x: 270, y: 220,
                    layer: 'main',
                    physicsGroup: 'boxes',
                    mass: 1,
                },
                // <Sprite.Config>{
                //     name: 'box2',
                //     constructor: Box,
                //     x: 270, y: 18,
                //     layer: 'main',
                //     physicsGroup: 'boxes',
                // },
                {
                    name: 'platform',
                    constructor: MovingPlatform,
                    texture: 'platform',
                    layer: 'main',
                    physicsGroup: 'walls',
                    bounds: { x: 0, y: 0, width: 128, height: 16 },
                    immovable: true,
                    data: {
                        pathStart: { x: 192, y: 402 },
                        pathEnd: { x: 320, y: 352 },
                    }
                },
                {
                    name: 'oneway',
                    constructor: OneWayPlatform,
                    x: 250, y: 530,
                    texture: 'platform',
                    layer: 'main',
                    physicsGroup: 'walls',
                    bounds: { x: 0, y: 0, width: 128, height: 16 },
                    immovable: true,
                },
                {
                    name: 'tilemapEditor',
                    updateCallback: function (obj) {
                        var tilemap = obj.world.getWorldObjectByType(Tilemap);
                        var mouseX = obj.world.getWorldMouseX() - tilemap.x;
                        var mouseY = obj.world.getWorldMouseY() - tilemap.y;
                        var tileX = Math.floor(mouseX / tilemap.tileset.tileWidth);
                        var tileY = Math.floor(mouseY / tilemap.tileset.tileHeight);
                        if (Input.isDown('placeBlock')) {
                            tilemap.setTile(tileX, tileY, { index: 0, angle: 0, flipX: false });
                        }
                        if (Input.isDown('destroyBlock')) {
                            tilemap.setTile(tileX, tileY, { index: -1, angle: 0, flipX: false });
                        }
                    }
                },
            ]
        },
    };
}
function getStoryConfig() {
    return {
        initialConfig: {},
        executeFn: function (sc) {
        }
    };
}
function getStoryEvents() {
    return {};
}
function getStoryboard() {
    return {
        'start': {
            type: 'start',
            transitions: [{ type: 'onStage', stage: 'game', toNode: 'intro' }]
        },
        'intro': {
            type: 'cutscene',
            script: function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/];
                });
            },
            transitions: [{ type: 'instant', toNode: 'gameplay' }]
        },
        'gameplay': {
            type: 'gameplay',
            transitions: []
        },
    };
}
