var DEBUG: boolean = true;
var DEBUG_ALL_PHYSICS_BOUNDS: boolean = false;

function debug(message?: any, ...optionalParams: any[]) {
    if (DEBUG) {
        console.log(message, ...optionalParams);
    }
}