import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import * as mapboxgl from 'mapbox-gl';
import { AngularFirestore } from 'angularfire2/firestore';
import * as fb from 'firebase';
import { AngularFireDatabase } from 'angularfire2/database';
import { GeoJson } from '@models/map';
import { BehaviorSubject } from 'rxjs/Rx';
import { AuthService } from '@services/auth.service';
import { AuthInfo } from '@models/auth-info';

@Injectable()
export class MapService {
  selectedBoundary: GeoJson = null;
  selectedBoundary$: BehaviorSubject<GeoJson> = new BehaviorSubject(null);
  isDeleting: boolean = false;
  isDeleting$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  channelFilterSelection: any[] = [];
  channelFilterSelection$: BehaviorSubject<any[]> = new BehaviorSubject([]);
  authInfo: AuthInfo = AuthService.UNKNOWN_USER;

  constructor(
    private db: AngularFirestore,
    private rtdb: AngularFireDatabase,
    private authSvc: AuthService
  ) {
    (mapboxgl as any).accessToken = environment.mapbox.accessToken;
    this.authSvc.authInfo$.subscribe(authInfo => {
      this.authInfo = authInfo;
    })
  }

  getFeatures() {
    return this.rtdb.list('/features');
  }

  deleteFeature(feature: GeoJson) {
    this.rtdb.list(`/deletedFeatures`).set(`${feature.properties.id}`, {
      id: feature.properties.id,
      type: feature.type,
      geometry: feature.geometry,
      properties: feature.properties
    });
    this.rtdb.object(`/features/${feature.properties.id}`).set(null);
    this.db.doc(`features/${feature.properties.id}`).update({ deleted: fb.firestore.FieldValue.serverTimestamp() });
    this.updateUserHistory(feature.properties.id, feature.properties.zapId, "delete");
  }

  createFeature(feature: GeoJson) {
    feature.properties.id = this.db.createId();
    feature.properties.channel = Number(feature.properties.channel);
    feature.properties.author = this.authInfo.isLoggedIn() ? this.authInfo.$uid : "guest_user";
    this.db.doc(`features/${feature.properties.id}`).set({
      author: feature.properties.author,
      deleted: false
    });
    this.updateUserHistory(feature.properties.id, feature.properties.zapId, "create");
    this.saveFeature(feature, true);
  }

  saveFeature(feature: GeoJson, newFeature: boolean = false) {
    feature.properties.channel = Number(feature.properties.channel) | 0;
    this.rtdb.list(`/features`).set(`${feature.properties.id}`, {
      id: feature.properties.id,
      type: feature.type,
      geometry: feature.geometry,
      properties: feature.properties
    });
    if(!newFeature) this.updateUserHistory(feature.properties.id, feature.properties.zapId, "edit");
    this.updateEditors(feature.properties.id);
    this.updateHistory(feature);
  }

  updateUserHistory(featureId: string, zapId: string, action: string) {
    if(this.authInfo.isLoggedIn()) {
      this.db.collection(`users/${this.authInfo.$uid}/history`)
        .doc(this.db.createId())
        .set({
          featureId: featureId,
          zapId: zapId,
          action: action,
          timestamp: fb.firestore.FieldValue.serverTimestamp()
        })
    }
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

  updateEditors(featureId: string) {
    let editors = {};
    const author = this.authInfo.isLoggedIn() ? this.authInfo.$uid : "guest_user";
    editors[`editors.${author}`] = true;
    this.db.doc(`features/${featureId}`).update(editors);
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

  startUpdateFeatures() {
    this.rtdb.list('features').valueChanges().subscribe(features => {
      features.forEach(feature => {
        this.updateFeatures((feature as any).id)
      })
    })
  }

  updateFeatures(featureKey) {
    var docRef = this.db.firestore.collection("features").doc(featureKey);

     this.db.firestore.runTransaction(transaction => {
        return transaction.get(docRef).then(doc => {
            if (!doc.exists) {
                let data = {
                  author: "guest_user",
                  deleted: false,
                  editors: { "guest_user": true }
                };
                transaction.set(docRef, data)
            } else { transaction.update(docRef, {}); }
        });
    }).then(function() {
        console.log("Features updated.");
    }).catch(function(error) {
        console.log("Transaction failed: ", error);
    });
  }

  getUserBoundaries(userKey: string) {
    return this.db.collection(`features`, ref => ref.where(`editors.${userKey}`, '==', true).limit(20))
  }

  getUserHistory(userKey: string) {
    return this.db.collection(`users/${userKey}/history`, ref => ref.limit(20));
  }
}
