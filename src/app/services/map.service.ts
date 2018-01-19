import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import * as mapboxgl from 'mapbox-gl';
import { AngularFirestore } from 'angularfire2/firestore';
import * as fb from 'firebase';
import { AngularFireDatabase } from 'angularfire2/database';
import { GeoJson } from '../models/map';
import { BehaviorSubject } from 'rxjs/Rx';

@Injectable()
export class MapService {
  selectedBoundary: GeoJson = null;
  selectedBoundary$: BehaviorSubject<GeoJson> = new BehaviorSubject(null);

  constructor(private db: AngularFirestore, private rtdb: AngularFireDatabase) {
    (mapboxgl as any).accessToken = environment.mapbox.accessToken;
  }

  getFeatures() {
    return this.rtdb.list('/features');
  }

  createFeature(feature: GeoJson) {
    feature.properties.id = this.db.createId();
    // feature.properties.accessLevel = feature.properties.accessLevel;
    // feature.zapId = 
    this.saveFeature(feature);
  }

  randomAccess() {
    switch (Math.floor(Math.random() * 3)) {
      case 0: return "public";
      case 1: return "private";
      case 2: return "locked";
    }
  }

  saveFeature(feature: GeoJson) {
    this.rtdb.list(`/features`).set(`${feature.properties.id}`, {
      id: feature.properties.id,
      type: feature.type,
      geometry: feature.geometry,
      properties: feature.properties
    });
    this.updateHistory(feature);
  }

  updateHistory(feature: GeoJson) {
    this.db.collection('features')
      .doc(feature.properties.id)
      .collection('history')
      .doc(this.db.createId())
      .set({
        timestamp: fb.firestore.FieldValue.serverTimestamp(),
        geometry: JSON.stringify(feature.geometry)
      })  
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

  setSelectedBoundary(boundary: GeoJson) {
    this.selectedBoundary = boundary;
    this.selectedBoundary$.next(boundary);
  }

  // getPolygons() {
  //   return this.db.collection('geoPolygons');
  //   // return this.db.collection('polygons');
  // }

  // getPolygonById(id: string) {
  //   return this.getPolygons().doc(id);
  // }

  // addPolygon(polygon) {
  //   let id = this.db.createId();
  //   polygon.properties.id = id;
  //   console.log('adding to db', polygon);
  //   return this.getPolygonById(id).set({ id: id, feature: JSON.stringify(polygon) });
  // }

  // updatePolygon(polygon) {
  //   console.log('updating', polygon);
  //   return this.getPolygonById(polygon.properties.id).update({ feature: JSON.stringify(polygon) });
  // }

  // deletePolygon(id: string) {
  //   return this.getPolygonById(id).delete();
  // }

  // fixPolygon(polygon) {
  //   let batch = this.db.firestore.batch();
  //   let ref = this.getPolygonById(polygon.id)
  // }

}
