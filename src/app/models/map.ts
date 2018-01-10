import { Layer } from "mapbox-gl/dist/mapbox-gl";



export interface IGeometry {
    type: string;
    coordinates: number[];
}
export interface IGeoJson {
    type: string;
    geometry: IGeometry;
    properties?: any;
    $key?: string;
}
export class GeoJson implements IGeoJson {
    type = 'Feature';
    geometry: IGeometry;
    constructor(type, coordinates, public properties?) {
        this.geometry = {
            type: type,
            coordinates: coordinates
        }
    }
}
export class FeatureCollection {
    type = 'FeatureCollection'
    constructor(public features: Array<GeoJson>) { }
}

export class LayerClass implements Layer {
    id = 'newId';
    type;
    source;
    paint = {};

    constructor(id, type?: string, source?: any, paint?: any) {
        this.id = id;
        this.type = type;
        this.source = source;
        this.paint = paint ? paint : this.paint;
    }
}
