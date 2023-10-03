class LoaderSystem {
    private loaders: Loader[];

    constructor(loaders: Loader[]) {
        this.loaders = loaders;
    }

    load(progressCallback: (progress: number) => void, callback: () => void) {
        for (let loader of this.loaders) {
            loader.load(() => this.onLoaderLoad(progressCallback, callback));
        }
    }

    private onLoaderLoad(progressCallback: (progress: number) => void, callback: () => void) {
        progressCallback(this.getLoadProgress());
        if (this.isLoadComplete()) {
            callback();
        }
    }

    private getLoadProgress() {
        return A.sum(this.loaders, loader => loader.completionPercent) / this.loaders.length;
    }

    private isLoadComplete() {
        return this.loaders.every(loader => loader.completionPercent >= 1);
    }
}