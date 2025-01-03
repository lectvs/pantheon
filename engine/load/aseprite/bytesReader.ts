class BytesReader {
    private view: DataView;
    private pos: number;

    constructor(bytes: ArrayBuffer) {
        this.view = new DataView(bytes);
        this.pos = 0;
    }

    getPosition() {
        return this.pos;
    }

    isAtEnd() {
        return this.pos === this.view.byteLength;
    }

    readByte() {
        let value = this.view.getUint8(this.pos);
        this.pos += 1;
        return value;
    }

    readWord() {
        let value = this.view.getUint16(this.pos, true);
        this.pos += 2;
        return value;
    }

    readShort() {
        let value = this.view.getInt16(this.pos, true);
        this.pos += 2;
        return value;
    }

    readDword() {
        let value = this.view.getUint32(this.pos, true);
        this.pos += 4;
        return value;
    }

    readLong() {
        let value = this.view.getInt32(this.pos, true);
        this.pos += 4;
        return value;
    }

    readFixed() {
        return this.readLong() / 65536.0;
    }

    readFloat() {
        let value = this.view.getFloat32(this.pos, true);
        this.pos += 4;
        return value;
    }

    readBytes(n: number) {
        let bytes = new Uint8Array(n);
        for (let i = 0; i < n; i++) {
            bytes[i] = this.readByte();
        }
        return bytes;
    }

    readString() {
        let length = this.readWord();
        return new TextDecoder('utf-8').decode(this.readBytes(length));
    }

    readPixelRGB() {
        let r = this.readByte();
        let g = this.readByte();
        let b = this.readByte();
        return { r, g, b };
    }

    readPixelRGBA() {
        let r = this.readByte();
        let g = this.readByte();
        let b = this.readByte();
        let a = this.readByte();
        return { r, g, b, a };
    }

    readPixelGrayscale() {
        let v = this.readWord();
        let a = this.readWord();
        return { v, a };
    }

    readPixelIndexed() {
        let i = this.readByte();
        return { i };
    }
}