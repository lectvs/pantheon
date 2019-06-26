var DEBUG: boolean = true;
var DEBUG_ALL_PHYSICS_BOUNDS: boolean = false;

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