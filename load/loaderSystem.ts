class LoaderSystem {
    private loaders: Loader[];
    private progressCallback: (progress: number) => void;
    private callback: () => void;

    constructor(loaders: Loader[]) {
        this.loaders = loaders;
    }

    load(progressCallback: (progress: number) => void, callback: () => void) {
        this.progressCallback = progressCallback;
        this.callback = callback;
        for (let loader of this.loaders) {
            loader.load(() => this.onLoaderLoad());
        }
    }

    private onLoaderLoad() {
        this.progressCallback(this.getLoadProgress());
        if (this.isLoadComplete()) {
            this.callback();
        }
    }

    private getLoadProgress() {
        return A.sum(this.loaders, loader => loader.completionPercent) / this.loaders.length;
    }

    private isLoadComplete() {
        return this.loaders.every(loader => loader.completionPercent >= 1);
    }
}