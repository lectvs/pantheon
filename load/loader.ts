interface Loader {
    readonly completionPercent: number;
    load(callback?: () => void): void;
}