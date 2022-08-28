namespace PageVisibility {
    export const HIDDEN = hiddenKey(document);
    export const VISIBILITY_CHANGE = visibilityChangeKey(document);

    function hiddenKey(document: Document & { msHidden?: boolean, webkitHidden?: boolean }) {
        if (typeof document.hidden !== "undefined") {
            return "hidden";
        } else if (typeof document.msHidden !== "undefined") {
            return "msHidden";
        } else if (typeof document.webkitHidden !== "undefined") {
            return "webkitHidden";
        }
        console.error("Page Visibility API unsupported!");
        return undefined;
    }

    function visibilityChangeKey(document: Document & { msHidden?: boolean, webkitHidden?: boolean }) {
        if (typeof document.hidden !== "undefined") {
            return "visibilitychange";
        } else if (typeof document.msHidden !== "undefined") {
            return "msvisibilitychange";
        } else if (typeof document.webkitHidden !== "undefined") {
            return "webkitvisibilitychange";
        }
        return undefined;
    }
}