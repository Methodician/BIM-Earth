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

  bounds: any;
  center = [-122.41, 37.75];
  // style = 'mapbox://styles/mapbox/streets-v10';
  style = 'mapbox://styles/mapbox/outdoors-v9';

  polyCollection: AngularFirestoreCollection<any>;
  source: any = null;


  constructor(private mapSvc: MapService) {
  }

  ngOnInit() {
    // this.initializeMap();
    this.polyCollection = this.mapSvc.getPolygons();
  }

  private mapLoaded(map) {
    this.map = map;
    this.flyToMe();
    this.initializeMap(map);
    this.addDrawControls(map);
  }


  initializeMap(map) {
    this.mapSvc.getFeatures().subscribe(features => {
      const collection = new FeatureCollection(features);
      this.source = {
        type: 'geojson',
        data: collection
      };
    })

    // this.polyCollection.valueChanges().subscribe(encodedPolygons => {
    //   let polygons = encodedPolygons.map(poly => {
    //     let feature = JSON.parse(poly.feature);
    //     if (feature.properties.id)
    //       feature.id = feature.properties.id;
    //     return feature;
    //   });
    //   let features = new FeatureCollection(polygons);
    //   this.source = {
    //     type: 'geojson',
    //     data: features
    //   };
      ////  adds clickable layer -- frustrating that click event does not seem to include coords...
      // map.addLayer({
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
    // });

    this.map.on('draw.create', e => {
      this.createGeoPoly(e.features);
    });
    this.map.on('draw.delete', e => {
      console.log('draw delete:', e);
    });
    this.map.on('draw.update', e => {
      this.updateGeoPoly(e.features);
    });

    // this.map.on('click', 'boundaries', e => {
    //   console.log('scripty click:', e.features[0]);
    // });
  }

  addDrawControls(map) {
    this.draw = new Draw({
      displayControlsDefault: false,
      controls: {
        polygon: true,
        trash: true
      }
    });

    map.addControl(this.draw);
    map.addControl(new Mapbox.NavigationControl());
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
