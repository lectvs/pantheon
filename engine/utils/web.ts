namespace WebUtils {
    export function locationContains(sub: string) {
        return window.location.href?.includes(sub) || document.referrer?.includes(sub);
    }
}