import { Component, OnInit } from '@angular/core';
import * as Mapbox from 'mapbox-gl';
import * as Draw from '@mapbox/mapbox-gl-draw';
import { MapService } from '../../services/map.service';
import { AngularFirestoreCollection } from 'angularfire2/firestore';
import { FeatureCollection, LayerClass } from '../../models/map';
import { Map } from 'mapbox-gl/dist/mapbox-gl';


@Component({
  selector: 'bim-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {
  map: Map;
  draw: Draw;
  style = 'mapbox://styles/mapbox/outdoors-v9';
  center = [-122.41, 37.75];
  bounds: any;
  source: any = null;

  constructor(private mapSvc: MapService) {}

  ngOnInit() {}

  private mapLoaded(map) {
    this.map = map;
    this.initializeMap();
    this.initializeDrawing();
    this.flyToMe();
  }

  initializeMap() {
    this.mapSvc.getFeatures().subscribe(features => {
      const collection = new FeatureCollection(features);
      this.source = {
        type: 'geojson',
        data: collection
      };
    });

    this.map.addControl(new Mapbox.NavigationControl());
  }

  initializeDrawing() {
    this.draw = new Draw({
      displayControlsDefault: false,
      controls: { polygon: true }
    });

    this.map.addControl(this.draw);

    this.map.on('draw.create', e => {
      this.createGeoPoly(e.features);
    });

    this.map.on('draw.update', e => {
      this.updateGeoPoly(e.features);
    });
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

  boundaryClick(e) {
    console.log('clicked', e.features);
    const featureId = e.features[0].properties.id;
    console.log(featureId);
    let clickedFeature = this.source.data.features.filter(feature => {
      return feature.id == featureId;
    })[0];
    console.log(clickedFeature);
    this.draw.add(clickedFeature);
  }

  createGeoPoly(features) {
    console.log('creating feature', features[0]);
    this.mapSvc.addPolygon(features[0]);
  }

  updateGeoPoly(features) {
    console.log('updating feature', features[0]);
    this.mapSvc.updatePolygon(features[0]);
  }

  decodePolygon(encodedPolygon) {
    let feature = JSON.parse(encodedPolygon.geometry);
    return feature;
  }
}
