interface Loader {
    readonly completionPercent: number;
    load(callback: () => void, onError: (message: string) => void): void;
    getKey(): string;
}