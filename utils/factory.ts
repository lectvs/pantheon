type Factory<T> = () => T;
type OrFactory<T> = T | Factory<T>;

namespace OrFactory {
    /** CANNOT RESOLVE FACTORIES OF FUNCTIONS */
    export function resolve<T>(orFactory: OrFactory<Exclude<T, Function>>) {
        if (O.isFunction(orFactory)) {
            return orFactory();
        }
        return orFactory;
    }
}
