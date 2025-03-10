class LoaderSystem {
    private loaders: Loader[];

    constructor(loaders: Loader[]) {
        this.loaders = loaders;
    }

    load(progressCallback: (progress: number) => void, callback: () => void, onError: (message: string) => void) {
        let assetLoaders = this.loaders.filter(loader => !(loader instanceof CustomResourceLoader));
        let customLoaders = this.loaders.filter(loader => loader instanceof CustomResourceLoader);

        this.loadLoaders(assetLoaders, progressCallback, () => {
            this.loadLoaders(customLoaders, progressCallback, () => {
                callback();
            }, onError);
        }, onError);
    }

    private loadLoaders(loaders: Loader[], progressCallback: (progress: number) => void, callback: () => void, onError: (message: string) => void) {
        if (loaders.length === 0) {
            progressCallback(this.getLoadProgress());
            callback();
            return;
        }

        for (let loader of loaders) {
            try {
                loader.load(() => {
                    progressCallback(this.getLoadProgress());
                    if (loaders.every(loader => loader.completionPercent >= 1)) {
                        callback();
                    }
                },
                message => onError(`Failed to load '${loader.getKey()}': ${message}`));
            } catch (e) {
                onError(`Failed to load '${loader.getKey()}': ${e}`);
            }
        }
    }

    private getLoadProgress() {
        if (this.loaders.length === 0) return 1;
        return A.sum(this.loaders, loader => loader.completionPercent) / this.loaders.length;
    }
}