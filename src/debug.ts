//var DEBUG: boolean = true;
var DEBUG_ALL_PHYSICS_BOUNDS: boolean = false;
var DEBUG_MOVE_CAMERA_WITH_ARROWS: boolean = true;
var DEBUG_SHOW_MOUSE_POSITION: boolean = true;
var DEBUG_SKIP_ALL_CUTSCENE_SCRIPTS: boolean = false;

var debug = console.info;
// function debug(message?: any, ...optionalParams: any[]) {
//     if (DEBUG) {
//         console.log(message, ...optionalParams);
//     }
// }

function get(name: string) {
    let worldObject = Main.theater.currentWorld.getWorldObjectByName(name);
    if (worldObject) return worldObject;
    return undefined;
}