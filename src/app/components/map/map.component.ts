import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import * as Mapbox from 'mapbox-gl';
import * as Draw from '@mapbox/mapbox-gl-draw';
import { MapService } from '../../services/map.service';
import { AngularFirestoreCollection } from 'angularfire2/firestore';
import { FeatureCollection, LayerClass } from '../../models/map';
import { Map } from 'mapbox-gl/dist/mapbox-gl';
import { GeoJson } from '../../models/map';

@Component({
  selector: 'bim-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {
  map: Map;
  draw: Draw;
  style = 'mapbox://styles/mapbox/outdoors-v9';
  center = [-122.6781, 45.4928];
  bounds: any;
  source: any;
  newFeatureId: string = "";
  selectedFeature: GeoJson = null;

  constructor(private mapSvc: MapService, private ref: ChangeDetectorRef) { }

  ngOnInit() { }

  mapLoaded(map) {
    this.map = map;
    this.initializeMap();
    this.initializeDrawing();
    this.addEventHandlers()
    this.flyToMe();
  }

  initializeMap() {
    this.map.addSource('firebase', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: []
      }
    })

    this.source = this.map.getSource('firebase');

    this.mapSvc.getFeatures().valueChanges().subscribe(features => {
      const collection = new FeatureCollection((features as GeoJson[]));
      this.source.setData(collection);
    });

    this.map.addLayer({
      id: 'boundaries',
      source: 'firebase',
      type: 'fill',
      paint: {
        'fill-color': [
          'match',
          ['get', 'accessLevel'],
          'public', 'rgb(0, 215, 239)',
          'private', 'rgb(255, 220, 0)',
          'locked', 'rgb(255, 65, 54)',
          'rgb(200, 100, 240)'
        ],
        'fill-opacity': 0.6,
      }
    });

  }

  initializeDrawing() {
    this.draw = new Draw({
      displayControlsDefault: false,
      controls: { polygon: true, trash: true }
    });

    this.map.addControl(this.draw);
    this.map.addControl(new Mapbox.NavigationControl());
  }

  addEventHandlers() {
    this.map.on('draw.create', e => {
      this.newFeatureId = e.features[0].id;
      this.ref.detectChanges();
    });

    this.map.on('draw.modechange', e => {
      if (e.mode == 'simple_select') {
        // this.saveDrawBuffer();
      } else if (e.mode == 'draw_polygon') {
        this.selectedFeature = null;
        this.ref.detectChanges();
      }
    });

    this.map.on('click', 'boundaries', e => {
      if(!this.newFeatureId){
        this.selectedFeature = e.features[0];
        this.ref.detectChanges();
      }
    })
  }
 
  editFeature(feature) {
    feature.id = feature.properties.id;
    this.draw.add(feature);
    this.draw.changeMode('direct_select', { featureId: feature.id });
    this.map.setFilter('boundaries', ["!=", feature.id, ["get", "id"]]);
  }

  saveDrawBuffer() {
    let feature = this.draw.getAll().features[0];
    if (feature.properties.newFeature) {
      delete feature.properties.newFeature;
      this.mapSvc.createFeature(feature);
    } else this.mapSvc.saveFeature(feature)
    this.draw.delete(feature.id);
    this.map.setFilter('boundaries', null);
  }

  flyToMe() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(pos => {
        this.center = [pos.coords.longitude, pos.coords.latitude];
        this.map.flyTo({
          center: this.center
        });
      })
    }
  }

  hideMenu() {
    this.selectedFeature = null;
    this.newFeatureId = "";
    this.ref.detectChanges()
  }

  // boundaryClick(e) {
  //   console.log('clicked', e.features);
  //   const featureId = e.features[0].properties.id;
  //   console.log(featureId);
  //   let clickedFeature = this.source.data.features.filter(feature => {
  //     return feature.id == featureId;
  //   })[0];
  //   console.log(clickedFeature);
  //   this.draw.add(clickedFeature);
  // }

  // createGeoPoly(features) {
  //   console.log('creating feature', features[0]);
  //   this.mapSvc.addPolygon(features[0]);
  // }

  // updateGeoPoly(features) {
  //   console.log('updating feature', features[0]);
  //   this.mapSvc.updatePolygon(features[0]);
  // }

  // decodePolygon(encodedPolygon) {
  //   let feature = JSON.parse(encodedPolygon.geometry);
  //   return feature;
  // }
}
