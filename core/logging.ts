function debug(message?: any, ...optionalParams: any[]) {
    if (Debug.DEBUG) {
        console.log(message, ...optionalParams);
    }
}