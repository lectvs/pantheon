namespace Lci {
    export type Document = {
        width: number;
        height: number;
        layers: Layer[];
    }

    export type Layer = {
        name: string;
        image: string;
        opacity: number;
        visible: boolean;
        blendMode: number;
        position: Pt;
        isDataLayer: boolean;
        properties: LayerProperties;
    }

    export type LayerProperties = {
        layer: string;
        anchor: Pt;
        offset: Pt;
        physicsGroup: string;
        bounds: Rect;
        placeholder: string;
        multiBounds: Rect[];
        data: Dict<string>;
    }

    const HEADER = '.LCI';

    export function parseDocument(lciString: string): Document {
        if (!lciString.startsWith(HEADER)) {
            console.error('Error loading LCI: bad header', lciString);
            return undefined;
        }
        let lciJson = lciString.substr(HEADER.length);
        return JSON.parse(lciJson);
    }

    export function getLayerTextureKey(documentKey: string, layerName: string) {
        return `${documentKey}/${layerName}`;
    }
}