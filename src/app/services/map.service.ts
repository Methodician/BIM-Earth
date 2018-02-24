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
import BBox from "@turf/bbox";

@Injectable()
export class MapService {
  selectedBoundary: GeoJson = null;
  selectedBoundary$: BehaviorSubject<GeoJson> = new BehaviorSubject(null);
  isDeleting: boolean = false;
  isDeleting$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  channelFilterSelection: any[] = [];
  channelFilterSelection$: BehaviorSubject<any[]> = new BehaviorSubject([]);
  authInfo: AuthInfo = AuthService.UNKNOWN_USER;
  cameraBounds$ = new BehaviorSubject(null);

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

  getCountyFeatures() {
    return this.rtdb.list('/staticFeatures');
  }

  getFeatures() {
    return this.rtdb.list('/features');
  }

  getFeatureById(featureId) {
    return this.rtdb.object(`/features/${featureId}`);
  }

  getFeatureIdFromSearchTree(zapID: string) {
    const path = this.idTreePathFromZapId(zapID);
    return this.rtdb.object(`/search/idTree/${path}`);
  }

  getBoundsFromCameraTree(zapID: string) {
    const path = this.idTreePathFromZapId(zapID);
    return this.rtdb.object(`/search/cameraTree/${path}/bounds`);
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
    if (!newFeature) this.updateUserHistory(feature.properties.id, feature.properties.zapId, "edit");
    this.updateEditors(feature.properties.id);
    this.updateHistory(feature);
    this.updateSearchData(feature);
  }

  updateUserHistory(featureId: string, zapId: string, action: string) {
    if (this.authInfo.isLoggedIn()) {
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

  getBoundaryPosts(featureId: string) {
    return this.db.collection(`features/${featureId}/posts`);
  }

  //TODO: add exception to handle no files/images somewhere
  savePost(data) {
    this.db.doc(`features/${data.featureId}/posts/${data.id}`).set({
      title: data.title,
      description: data.description,
      author: data.author,
      timestamp: fb.firestore.FieldValue.serverTimestamp(),
      files: data.files,
      images: data.images
    })
  }

  updatePostFiles(featureId: string, postId: string, fileType: "images" | "files", files) {
    let data = {};
    data[fileType] = files;
    this.db.doc(`features/${featureId}/posts/${postId}`).update(data);
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
    }).then(function () {
      console.log("Features updated.");
    }).catch(function (error) {
      console.log("Transaction failed: ", error);
    });
  }

  getUserBoundaries(userKey: string) {
    return this.db.collection(`features`, ref => ref.where(`editors.${userKey}`, '==', true).limit(20))
  }

  getUserHistory(userKey: string) {
    return this.db.collection(`users/${userKey}/history`, ref => ref.limit(20));
  }

  getSearchData() {
    return this.rtdb.object('search');
  }

  updateSearchData(feature) {
    const zapID = feature.properties.zapId,
      path = this.idTreePathFromZapId(zapID),
      coordinates = feature.geometry.coordinates[0][0],
      bounds = this.getCameraBounds(feature)
    this.rtdb.object(`/search/idTree/${path}`).set(feature.properties.id);
    this.rtdb.object(`/search/cameraTree/${path}`).set({ bounds: bounds });
  }

  getCameraBounds(feature) {
    let bbox = BBox(feature);
    return [[bbox[0], bbox[1]], [bbox[2], bbox[3]]];
  }

  setCameraBounds(cameraBounds) {
    console.log(cameraBounds);
    this.cameraBounds$.next(cameraBounds);
  }

  getCameraTree() {
    return this.rtdb.object('/search/cameraTree')
  }

  idTreePathFromZapId(zapID: string) {
    return `${zapID.slice(0, 2)}/${zapID.slice(3, 5)}/${zapID.slice(6, 9)}/${zapID.slice(10, 12)}/${zapID.slice(13, 18)}`;
  }
}
