declare namespace Zlib {
    class Inflate {
        constructor(data: Uint8Array);
        decompress(): Uint8Array;
    }
}