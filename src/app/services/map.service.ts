import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import * as mapboxgl from 'mapbox-gl';
import { AngularFirestore } from 'angularfire2/firestore';
import * as fb from 'firebase';

@Injectable()
export class MapService {

  constructor(
    private db: AngularFirestore
  ) {
    (mapboxgl as any).accessToken = environment.mapbox.accessToken;
  }

  getPolygons() {
    return this.db.collection('geoPolygons');
    // return this.db.collection('polygons');
  }

  getPolygonById(id: string) {
    return this.getPolygons().doc(id);
  }

  addPolygon(polygon) {
    let id = this.db.createId();
    polygon.id = id;
    console.log(polygon);
    return this.getPolygonById(id).set({ id: id, geometry: JSON.stringify(polygon) });
  }

  updatePolygon(polygon) {
    return this.getPolygonById(polygon.id).update({ geometry: JSON.stringify(polygon) });
  }

  deletePolygon(id: string) {
    return this.getPolygonById(id).delete();
  }

}
