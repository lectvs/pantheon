namespace Network {
    export function httpRequest(url: string, data: string, callback: (responseJson: any, error: string) => any) {
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
            callback(undefined, xhr.statusText);
        };
        xhr.send(data);
    }
}
