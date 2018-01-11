import { Component, OnInit } from '@angular/core';
import * as Mapbox from 'mapbox-gl';
import * as MapboxDraw from '@mapbox/mapbox-gl-draw';
import { MapService } from '../../services/map.service';
import { RtdbMapService } from '../../services/rtdb-map.service';
import { AngularFirestoreCollection } from 'angularfire2/firestore';
import { GeoJson, FeatureCollection, LayerClass } from '../../models/map';
import { Map } from 'mapbox-gl/dist/mapbox-gl';
import { GeometryObject, Feature } from 'geojson';


@Component({
  selector: 'bim-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {
  map: Map;
  draw: MapboxDraw;
  source: any;
  style = 'mapbox://styles/mapbox/outdoors-v9';
  polygons;

  constructor(private mapSvc: MapService, private rtbdMapSvc: RtdbMapService) {}

  ngOnInit() {
    this.initializeMap();
    this.polygons = this.rtbdMapSvc.getPolygons().valueChanges();
  }

  private initializeMap() {
    this.buildMap();
  }

  buildMap() {
    this.map = new Mapbox.Map({
      container: 'map',
      style: this.style,
      zoom: 13,
      center: [-122.67790267216253, 45.519778580332854]
    });

    this.draw = new MapboxDraw({
      displayControlsDefault: false,
      controls: {
        polygon: true,
        trash: true
      }
    });

    this.map.addControl(this.draw);
    this.map.addControl(new Mapbox.NavigationControl());

    this.map.on('load', e => {
      this.map.addSource('firebase', {
        type: 'geojson', 
        data: {
          type: 'FeatureCollection',
          features: []
        }
      })
      // binding the source to the component context may be unnecessary here. the callback function should have access to the parent scope without help
      this.source = this.map.getSource('firebase');
      this.polygons.subscribe(polygons => {
        let data = new FeatureCollection(polygons)
        this.source.setData(data);
      })

      this.map.addLayer({
        id: 'firebase-polygons',
        source: 'firebase',
        type: 'fill',
        paint: {
          'fill-color': 'rgba(200, 100, 240, 0.4)',
          'fill-outline-color': 'rgba(200, 100, 240, 1)'
        }
      })
    });

    this.map.on('draw.modechange', e => {
      if(e.mode == 'simple_select') this.saveDrawBuffer();
    })

    this.map.on('contextmenu', 'firebase-polygons', e => {
      let feature = e.features[0];
      feature.id = feature.properties.id; // may be unnecessary
      this.draw.add(feature);
      this.draw.changeMode('direct_select', { featureId: feature.id });
      this.map.setFilter('firebase-polygons', ["!=", feature.id, ["get", "id"]])
    })
  }

  // call when feature update/creation has been completed (entering 'simple_select' draw mode)
  saveDrawBuffer() {
    let feature = this.draw.getAll().features[0]; // assumes only one feature is being edited at once
    this.updateLocalFeature(feature); // accounting for any delay between saving to database and subscription trigger
    this.saveFeature(feature);
    this.draw.delete(feature.id);
    this.map.setFilter('firebase-polygons', null);
  }

  // occasional flicker may mean the current search compromise is too slow
  updateLocalFeature(newFeature) {
    // this.map.queryRenderedFeatures({layers: ['firebase-polygons'], filter: ["==", feature.id, ["get", "id"]]})
    this.map.getStyle().sources.firebase.data.features.map(localFeature => {
      if(localFeature.id == newFeature.id) return newFeature;
      return localFeature;
    });
  }

  saveFeature(feature) {
    feature.properties.id = feature.id; // this may only be necessary during feature creation
    this.rtbdMapSvc.savePolygon((feature as GeoJson))
  }

  geolocate(){
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(pos => {
        this.map.flyTo({
          center: [pos.coords.longitude, pos.coords.latitude]
        });
      })
    }
  }
}
