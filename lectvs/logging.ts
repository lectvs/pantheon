function debug(message?: any, ...optionalParams: any[]) {
    if (Debug.DEBUG) {
        console.log(message, ...optionalParams);
    }
}

function error(message?: any, ...optionalParams: any[]) {
    console.error(message, ...optionalParams);
}