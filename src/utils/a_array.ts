namespace A {
    export function removeAll<T>(array: T[], obj: T) {
        if (!array) return 0;

        let count = 0;
        for (let i = array.length-1; i >= 0; i--) {
            if (array[i] === obj) {
                array.splice(i, 1);
                count++;
            }
        }

        return count;
    }

    export function repeat<T>(array: T[], count: number) {
        let result: T[] = [];
        for (let i = 0; i < count; i++) {
            result.push(...array);
        }
        return result;
    }
}