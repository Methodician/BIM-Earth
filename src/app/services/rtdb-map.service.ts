import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import * as mapboxgl from 'mapbox-gl';
import { AngularFireDatabase } from 'angularfire2/database';
import * as fb from 'firebase';
import { GeoJson } from '../models/map';


@Injectable()
export class RtdbMapService {

  constructor( private db: AngularFireDatabase) {
    (mapboxgl as any).accessToken = environment.mapbox.accessToken;
  }

  getPolygons() {
    return this.db.list('/polygons')
  }

  savePolygon(data: GeoJson) {
    return this.db.list(`/polygons`).set(`${data.properties.id}`, {
      geometry: data.geometry,
      id: data.properties.id,
      type: data.type,
      properties: data.properties
    });
  }
}
