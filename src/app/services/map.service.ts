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
    polygon.properties.id = id;
    console.log('adding to db', polygon);
    return this.getPolygonById(id).set({ id: id, feature: JSON.stringify(polygon) });
  }

  updatePolygon(polygon) {
    console.log(polygon);
    // should probably remove polygon.id later
    return this.getPolygonById(polygon.properties.id || polygon.id).update({ feature: JSON.stringify(polygon) });
  }

  deletePolygon(id: string) {
    return this.getPolygonById(id).delete();
  }

  fixPolygon(polygon) {
    let batch = this.db.firestore.batch();
    let ref = this.getPolygonById(polygon.id)
  }

}
