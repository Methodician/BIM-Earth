import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import * as mapboxgl from 'mapbox-gl';
import { AngularFirestore } from 'angularfire2/firestore';
import * as fb from 'firebase';
import { AngularFireDatabase } from 'angularfire2/database';
import { GeoJson } from '@models/map';
import { BehaviorSubject } from 'rxjs/Rx';

@Injectable()
export class MapService {
  selectedBoundary: GeoJson = null;
  selectedBoundary$: BehaviorSubject<GeoJson> = new BehaviorSubject(null);
  isDeleting: boolean = false;
  isDeleting$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  channelFilterSelection: any[] = [];
  channelFilterSelection$: BehaviorSubject<any[]> = new BehaviorSubject([]);

  constructor(private db: AngularFirestore, private rtdb: AngularFireDatabase) {
    (mapboxgl as any).accessToken = environment.mapbox.accessToken;
  }

  getFeatures() {
    return this.rtdb.list('/features');
  }

  createFeature(feature: GeoJson) {
    feature.properties.id = this.db.createId();
    feature.properties.channel = Number(feature.properties.channel);
    this.saveFeature(feature);
  }


  saveFeature(feature: GeoJson) {
    feature.properties.channel = Number(feature.properties.channel) | 0;
    this.rtdb.list(`/features`).set(`${feature.properties.id}`, {
      id: feature.properties.id,
      type: feature.type,
      geometry: feature.geometry,
      properties: feature.properties
    });
    this.updateHistory(feature);
    this.updateSearchTree(feature.properties.id, feature.properties.zapId);
  }

  deleteFeature(feature: GeoJson) {
    this.rtdb.list(`/deletedFeatures`).set(`${feature.properties.id}`, {
      id: feature.properties.id,
      type: feature.type,
      geometry: feature.geometry,
      properties: feature.properties
    });
    this.rtdb.object(`/features/${feature.properties.id}`).set(null);
  }

  updateHistory(feature: GeoJson) {
    this.db.collection('features')
      .doc(feature.properties.id)
      .collection('history')
      .doc(this.db.createId())
      .set({
        timestamp: fb.firestore.FieldValue.serverTimestamp(),
        geometry: JSON.stringify(feature.geometry)
      });
  }

  getFirestoreFeatures() {
    return this.db.collection('geoPolygons').stateChanges().map(actions => {
      return actions.map(action => {
        const data = action.payload.doc.data()
        let feature = JSON.parse(data.feature);
        if (feature.properties.id) feature.id = feature.properties.id;
        return feature;
      })
    })
  }

  setSelectedBoundary(boundary: GeoJson) {
    this.selectedBoundary = boundary;
    this.selectedBoundary$.next(boundary);
  }

  toggleDelete() {
    this.isDeleting = !this.isDeleting;
    this.isDeleting$.next(this.isDeleting);
  }

  setChannelFilterSelection(selection: any[]) {
    this.channelFilterSelection = selection;
    this.channelFilterSelection$.next(selection);
  }

  getSearchTree() {
    return this.rtdb.list('/searchTree');
  }

  updateSearchTree(id, zapId: string) {
    const country = zapId.slice(0,2),
          state = zapId.slice(3,5),
          county = zapId.slice(6,9),
          channel = zapId.slice(10,12),
          uid = zapId.slice(13,18);
    this.rtdb.object(`/searchTree/${country}/${state}/${county}/${channel}/${uid}`).set(id);
  }

  cameraSettings$ = new BehaviorSubject(null);
  setCamera(cameraSettings) {
    this.cameraSettings$.next(cameraSettings);
  }

}
