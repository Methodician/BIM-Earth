import { Component, OnInit } from '@angular/core';
import * as mbox from 'mapbox-gl';
import * as mboxDraw from '@mapbox/mapbox-gl-draw';
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
  draw: any;

  lat = 37.75
  lng = -122.41;
  // style = 'mapbox://styles/mapbox/streets-v10';
  style = 'mapbox://styles/mapbox/outdoors-v9';

  polyCollection: AngularFirestoreCollection<any>;

  constructor(private mapSvc: MapService) {
  }

  ngOnInit() {
    this.initializeMap();
    this.polyCollection = this.mapSvc.getPolygons();
  }

  private initializeMap() {
    this.buildMap();
  }

  buildMap() {

    this.map = new mbox.Map({
      container: 'map',
      style: this.style,
      zoom: 13,
      center: [this.lng, this.lat]
    });

    this.draw = new mboxDraw({
      displayControlsDefault: false,
      controls: {
        polygon: true,
        trash: true
      }
    });

    this.map.addControl(this.draw);
    this.map.addControl(new mbox.NavigationControl());



    this.map.on('load', e => {
      console.log('map load:', e);


      this.polyCollection.valueChanges().subscribe(encodedPolygons => {
        let polygons = encodedPolygons.map(poly => {
          let feature = JSON.parse(poly.feature);
          if (feature.properties.id)
            feature.id = feature.properties.id;
          delete feature.id;
          console.log(feature);
          return feature;
        });
        let features = new FeatureCollection(polygons);
        ////  adds clickable layer -- frustrating that click event does not seem to include coords...
        // this.map.addLayer({
        //   id: 'boundaries',
        //   type: 'fill',
        //   source: {
        //     type: 'geojson',
        //     data: features as any
        //   },
        //   paint: {
        //     'fill-color': 'rgba(200, 100, 240, 0.4)',
        //     'fill-outline-color': 'rgba(200, 100, 240, 1)'
        //   }
        // });
        //// adds editable layer
        // let featureIds = this.draw.add(features);
        // console.log(featureIds);
      });

    });

    this.map.on('draw.create', e => {
      this.createGeoPoly(e.features);
    });
    this.map.on('draw.delete', e => {
      console.log('draw delete:', e);
    });
    this.map.on('draw.update', e => {
      this.updateGeoPoly(e.features);
    });

    this.map.on('click', 'boundaries', e => {
      console.log('clicked:', e.features[0]);
    });

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(pos => {
        this.lat = pos.coords.latitude;
        this.lng = pos.coords.longitude;
        this.map.flyTo({
          center: [this.lng, this.lat]
        });
      })
    }
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
