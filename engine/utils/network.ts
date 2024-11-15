namespace Network {
    export const NAME_NOT_RESOLVED = "Name not resolved";

    export function httpRequest(url: string, data: string | null, callback: (responseJson: any, error: string | undefined) => any) {
        var xhr = new XMLHttpRequest();
        xhr.open(data ? "POST" : "GET", url, true);
        xhr.onload = function () {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    let json = JSON.parse(xhr.responseText);
                    if (!json.error && !json.message) {
                        callback(json, undefined);
                    } else {
                        let error = json.error ?? json.message;
                        callback(undefined, error);
                    }
                } else {
                    callback(undefined, xhr.statusText);
                }
            }
        };
        xhr.onerror = function () {
            if (St.isEmpty(xhr.response) || xhr.status === 0) {
                callback(undefined, NAME_NOT_RESOLVED);
                return;
            }
            callback(undefined, xhr.statusText);
        };
        xhr.send(data);
    }
}
