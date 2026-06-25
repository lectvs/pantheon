namespace Lci {
    export function _fromAsepriteFile(fileKey: string, textureRestrictBounds: Dict<Rectangle | undefined>, useTextures: boolean = true) {
        let asepriteFile = AssetCache.getAsepriteFile(fileKey)!;

        let defaultLayerProperties = getDefaultLayerProperties(asepriteFile);

        let layers: Layer[] = [];

        for (let asepriteLayer of asepriteFile.layers) {
            if (asepriteLayer.type !== 'image') continue;

            let layerName = extractLayerName(asepriteLayer.name);
            let layerTextureKey = useTextures ? Lci.getLayerTextureKey(fileKey, layerName) : undefined;
            let layerProperties = extractLayerProperties(asepriteLayer.name, layerTextureKey, defaultLayerProperties);

            let contentBounds = layerProperties.restrict && layerTextureKey && textureRestrictBounds[layerTextureKey]
                ? textureRestrictBounds[layerTextureKey]!
                : new Rectangle(0, 0, asepriteFile.width, asepriteFile.height);

            let layerOffsetX = contentBounds.x;
            let layerOffsetY = contentBounds.y;
            let layerPosition = vec2(contentBounds);

            if (layerProperties.anchor) {
                // Round anchor to nearest pixel
                layerProperties.anchor.x = Math.floor(contentBounds.width * layerProperties.anchor.x) / contentBounds.width;
                layerProperties.anchor.y = Math.floor(contentBounds.height * layerProperties.anchor.y) / contentBounds.height;

                layerPosition.x += contentBounds.width * layerProperties.anchor.x;
                layerPosition.y += contentBounds.height * layerProperties.anchor.y;
            }
            if (layerProperties.offset != null) {
                layerPosition.x -= layerProperties.offset.x;
                layerPosition.y -= layerProperties.offset.y;
            }

            if (layerProperties.bounds === 'all') {
                let boundsX = layerOffsetX - layerPosition.x;
                let boundsY = layerOffsetY - layerPosition.y;
                let boundsWidth = contentBounds.width;
                let boundsHeight = contentBounds.height;
                layerProperties.bounds = 'rect(' + boundsX + ',' + boundsY + ',' + boundsWidth + ',' + boundsHeight + ')';
            }

            let layer: Layer = {
                name: layerName,
                image: 'FromAsepriteFile',
                isDataLayer: isDataLayer(layerName, layerProperties),
                blendMode: asepriteLayer.blendMode,
                opacity: asepriteLayer.opacity * 255,
                visible: asepriteLayer.visible,
                position: layerPosition,
                properties: layerProperties,
            };

            layers.push(layer);
        }

        let lciDocument: Document = {
            width: asepriteFile.width,
            height: asepriteFile.height,
            layers: layers,
        };

        return lciDocument;
    }

    export function extractLayerName(data: string) {
        let datas = data.split('|');
        return datas[0];
    }

    export function extractLayerProperties(data: string, layerTextureKey: string | undefined, defaults?: Lci.LayerProperties) {
        let layerProperties = defaults
            ? O.deepClone(defaults)
            : {
                anchor: Anchor.TOP_LEFT,
                bounds: null,
                layer: null,
                physicsGroup: null,
                placeholder: null,
                offset: null,
                restrict: false,
                multiBounds: null,
                data: {},
            };

        let isCommentLayer = data.startsWith('//');

        let datas = isCommentLayer ? [data] : data.split('|').map(d => d.trim());

        for (let i = 1; i < datas.length; i++) {
            let kv = datas[i].split('=');

            if (St.isBlank(kv[0])) {
                throw Error("Layer \"" + data + "\" has a blank property section.");
            }

            if (kv.length == 1) kv = [kv[0], "true"];

            if (kv[0] == "restrict") {
                layerProperties.restrict = kv[1] == "true";
            } else if (kv[0] == "layer") {
                layerProperties.layer = kv[1];
            } else if (kv[0] == "anchor") {
                layerProperties.anchor = getAnchorPoint(kv[1]);
            } else if (kv[0] == "offset") {
                layerProperties.offset = getOffsetPoint(kv[1]);
            } else if (kv[0] == "physicsGroup") {
                layerProperties.physicsGroup = kv[1];
            } else if (kv[0] == "bounds") {
                layerProperties.bounds = kv[1];
            } else if (kv[0] == "placeholder") {
                layerProperties.placeholder = kv[1];
            } else if (kv[0] == "multiBounds" || kv[0] == "multibounds") {
                if (kv[1] == "true") {
                    layerProperties.multiBounds = layerTextureKey ? layerToMultiBounds(layerTextureKey) : null;
                }
            } else {
                layerProperties.data[kv[0]] = datas[i].substring(kv[0].length + '='.length);
            }
        }

        return layerProperties;
    }

    function getDefaultLayerProperties(asepriteFile: AsepriteFile) {
        for (let layer of asepriteFile.layers) {
            if (extractLayerName(layer.name) === 'defaults') {
                return extractLayerProperties(layer.name, undefined);
            }
        }
        return undefined;
    }

    function getAnchorPoint(anchor: string) {
        if (anchor.includes(',')) return parsePt(anchor, 'anchor');
        return Anchor.fromName(anchor);
    }

    function getOffsetPoint(offset: string) {
        return parsePt(offset, 'offset');
    }

    function layerToMultiBounds(layerTextureKey: string): Rect[] {
        let rects = getInitialRectsFromBitmapLayer(layerTextureKey);
        optimizeCollisionRects(rects, false);  // Not optimizing entire array first to save some cycles.
        optimizeCollisionRects(rects, true);
        return rects;
    }

    function getInitialRectsFromBitmapLayer(layerTextureKey: string): Rect[] {
        let surface = AssetCache.getTexture(layerTextureKey);

        let rects: Rect[] = [];
        for (let y = 0; y < surface.height; y++) {
            for (let x = 0; x < surface.width; x++) {
                if ((TextureUtils.getPixelARGBRawPos(surface, x, y) & 0xFF000000) != 0) {
                    // Try to create as big of a horizontal line as possible.
                    let r = rect(x, y, 0, 1);
                    while (x < surface.width && (TextureUtils.getPixelARGBRawPos(surface, x, y) & 0xFF000000) != 0) {
                        r.width++;
                        x++;
                    }
                    rects.push(r);
                }
            }
        }
        return rects;
    }

    function optimizeCollisionRects(rects: Rect[], all: boolean) {
        let i = 0;
        while (i < rects.length) {
            let j = i + 1;
            while (j < rects.length) {
                let combined = combineRects(rects[j], rects[i]);
                if (combined) {
                    rects.removeAt(j);
                } else if (all) {
                    j++;
                } else {
                    break;
                }
            }
            i++;
        }
    }

    function combineRects(rect: Rect, into: Rect): boolean {
        if (rectContainsRect(into, rect)) return true;
        if (rectContainsRect(rect, into)) {
            into.x = rect.x;
            into.y = rect.y;
            into.width = rect.width;
            into.height = rect.height;
            return true;
        }
        if (rect.x == into.x && rect.width == into.width) {
            if (rect.y <= into.y + into.height && rect.y + rect.height >= into.y) {
                let newY = Math.min(rect.y, into.y);
                let newH = Math.max(rect.y + rect.height, into.y + into.height) - newY;
                into.y = newY;
                into.height = newH;
                return true;
            }
        }
        if (rect.y == into.y && rect.height == into.height) {
            if (rect.x <= into.x + into.width && rect.x + rect.width >= into.x) {
                let newX = Math.min(rect.x, into.x);
                let newW = Math.max(rect.x + rect.width, into.x + into.width) - newX;
                into.x = newX;
                into.width = newW;
                return true;
            }
        }
        return false;
    }

    function rectContainsRect(rect: Rect, contains: Rect) {
        return rect.x <= contains.x && rect.x + rect.width  >= contains.x + contains.width
            && rect.y <= contains.y && rect.y + rect.height >= contains.y + contains.height;
    }

    export function getRestrictedBounds(layerTextureKey: string): Rectangle {
        let surface = AssetCache.getTexture(layerTextureKey);

        let left = 0;
        while (left < surface.width) {
            let containsOpaquePixel = false;
            for (let y = 0; y < surface.height; y++) {
                if ((TextureUtils.getPixelARGBRawPos(surface, left, y) & 0xFF000000) != 0) {
                    containsOpaquePixel = true;
                    break;
                }
            }
            if (containsOpaquePixel) break;
            left++;
        }

        let right = surface.width;
        while (right > left) {
            let containsOpaquePixel = false;
            for (let y = 0; y < surface.height; y++) {
                if ((TextureUtils.getPixelARGBRawPos(surface, right-1, y) & 0xFF000000) != 0) {
                    containsOpaquePixel = true;
                    break;
                }
            }
            if (containsOpaquePixel) break;
            right--;
        }

        let top = 0;
        while (top < surface.height) {
            let containsOpaquePixel = false;
            for (let x = 0; x < surface.width; x++) {
                if ((TextureUtils.getPixelARGBRawPos(surface, x, top) & 0xFF000000) != 0) {
                    containsOpaquePixel = true;
                    break;
                }
            }
            if (containsOpaquePixel) break;
            top++;
        }

        let bottom = surface.height;
        while (bottom > top) {
            let containsOpaquePixel = false;
            for (let x = 0; x < surface.width; x++) {
                if ((TextureUtils.getPixelARGBRawPos(surface, x, bottom-1) & 0xFF000000) != 0) {
                    containsOpaquePixel = true;
                    break;
                }
            }
            if (containsOpaquePixel) break;
            bottom--;
        }

        let width = right - left;
        let height = bottom - top;

        if (width <= 0 || height <= 0) {
            return new Rectangle(0, 0, 1, 1);
        }

        return new Rectangle(left, top, width, height);
    }

    function isDataLayer(name: string, layer: Lci.LayerProperties) {
        if (name === 'defaults') return true;
        if (name.trim().startsWith('//')) return true;
        if (layer.multiBounds) return true;
        return false;
    }

    function parsePt(pt: string, name: string) {
        let parts = pt.split(',');
        if (parts.length == 2) {
            try {
                return vec2(parseFloat(parts[0]), parseFloat(parts[1]));
            } catch (e) {
                // Pass, exception thrown below.
            }
        }
        
        throw Error("Invalid " + name + ": " + pt);
    }
}