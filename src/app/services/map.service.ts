import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import * as mapboxgl from 'mapbox-gl';
import { AngularFirestore } from 'angularfire2/firestore';
import * as fb from 'firebase';
import { AngularFireDatabase } from 'angularfire2/database';
import { GeoJson } from '../models/map';

@Injectable()
export class MapService {

  constructor(private db: AngularFirestore, private rtdb: AngularFireDatabase) {
    (mapboxgl as any).accessToken = environment.mapbox.accessToken;
  }

  getFirestoreFeatures() {
    return this.db.collection('geoPolygons').stateChanges().map(actions => {
      return actions.map(action => {
        const data = action.payload.doc.data()
        let feature = JSON.parse(data.feature);
        if(feature.properties.id) feature.id = feature.properties.id;
        return feature; 
      })
    })
  }

  saveFeature(feature: GeoJson) {
    feature.properties.id = this.db.createId();
    this.rtdb.list(`/features`).set(`${feature.properties.id}`, {
      id: feature.properties.id,
      type: feature.type,
      geometry: feature.geometry,
      properties: feature.properties
    });
  }

  getFeatures() {
    return this.rtdb.list('/features');
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
