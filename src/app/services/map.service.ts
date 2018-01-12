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

  getFeatures() {
    return this.db.collection('geoPolygons').stateChanges().map(actions => {
      return actions.map(action => {
        const data = action.payload.doc.data()
        let feature = JSON.parse(data.feature);
        if(feature.properties.id) feature.id = feature.properties.id;
        return feature; 
      })
    })
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
    polygon.properties.id = id;
    console.log('adding to db', polygon);
    return this.getPolygonById(id).set({ id: id, feature: JSON.stringify(polygon) });
  }

  updatePolygon(polygon) {
    console.log('updating', polygon);
    return this.getPolygonById(polygon.properties.id).update({ feature: JSON.stringify(polygon) });
  }

  deletePolygon(id: string) {
    return this.getPolygonById(id).delete();
  }

  fixPolygon(polygon) {
    let batch = this.db.firestore.batch();
    let ref = this.getPolygonById(polygon.id)
  }

}
