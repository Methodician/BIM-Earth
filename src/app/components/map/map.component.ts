import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import * as Mapbox from 'mapbox-gl';
import * as Draw from '@mapbox/mapbox-gl-draw';
import { MapService } from '@services/map.service';
import { AngularFirestoreCollection } from 'angularfire2/firestore';
import { FeatureCollection, LayerClass } from '@models/map';
import { Map } from 'mapbox-gl/dist/mapbox-gl';
import { GeoJson } from '@models/map';
import { Channels } from '@enums/channels.enum';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'bim-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {
  map: Map;
  draw: Draw;
  style = 'mapbox://styles/mapbox/light-v9';
  center = [-122.6781, 45.4928];
  bounds: any;
  source: any;
  countySource: any;
  newFeatureId: string = "";
  selectedFeature: GeoJson = null;
  isDeleting: boolean = false;
  hoveredCounty: string = "";

  constructor(private mapSvc: MapService, private ref: ChangeDetectorRef, private router: Router, private activeRoute: ActivatedRoute) { }

  ngOnInit() {
    this.mapSvc.isDeleting$.subscribe(value => {
      this.isDeleting = value;
    });

    this.mapSvc.channelFilterSelection$.subscribe(selection => {
      if (this.map && !this.selectedFeature) this.setChannelFilter(selection);
    });

  }

  mapLoaded(map) {
    this.map = map;
    this.initializeMap();
    this.initializeDrawing();
    this.addEventHandlers()
    this.flyToMe();
    this.mapSvc.cameraBounds$.subscribe(bounds => {
      if (bounds) this.map.fitBounds(bounds);
    });

  }

  initializeMap() {
    this.map.addSource('firebase', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: []
      }
    });

    this.map.addSource('countySource', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: []
      }
    });

    this.source = this.map.getSource('firebase');
    this.countySource = this.map.getSource('countySource');

    // unsure if this could ever emit null, if so the observable would need more processing
    // county features are static, and only need to be accessed once
    this.mapSvc.getCountyFeatures().valueChanges().take(1).subscribe(features => {
      const counties = new FeatureCollection((features as GeoJson[]));
      this.countySource.setData(counties);

      this.mapSvc.getFeatures().valueChanges().subscribe(features => {
        const collection = new FeatureCollection((features as GeoJson[]));
        this.source.setData(collection);
      });
    });



    this.map
      .addLayer({
        id: 'boundaries',
        source: 'firebase',
        type: 'fill',
        paint: this.layerPaint
      })
      .addLayer({
        id: 'countyLines',
        source: 'countySource',
        type: 'line',
        paint: { 'line-color': 'rgba(186, 35, 57, 0.5)' }
      })
      .addLayer({
        id: 'countyFills',
        source: 'countySource',
        type: 'fill',
        paint: {
          'fill-opacity': 0
        }
      });

    this.activeRoute.params.subscribe(params => {
      if (!this.selectedFeature && params && params.zapId) {
        this.mapSvc.getFeatureIdFromSearchTree(params.zapId).valueChanges().subscribe(featureId => {
          this.mapSvc.getFeatureById(featureId).valueChanges().subscribe(feature => {
            if (feature) {
              this.setSelectedFeature(feature);
              this.mapSvc.getBoundsFromCameraTree(params.zapId).valueChanges().subscribe(bounds => {
                this.mapSvc.setCameraBounds(bounds);
              });
            }
          });
        });
      }
    });
  }

  // TODO: move to separate file
  layerPaint = {
    'fill-color': [
      'match',
      ['get', 'channel'],
      Channels.Open, 'rgba(81, 66, 81, 0.5)',
      Channels.Transport, 'rgba(47, 40, 76, 0.5)',
      Channels.Camp, 'rgba(224, 11, 11, 0.5)',
      Channels.Climb, 'rgba(186, 35, 57, 0.5)',
      Channels.Dive, 'rgba(255, 17, 65, 0.5)',
      Channels.Vote, 'rgba(229, 43, 2, 0.5)',
      Channels.Protect, 'rgba(204, 60, 16, 0.5)',
      Channels.Rescue, 'rgba(219, 110, 37, 0.5)',
      Channels.Educate, 'rgba(170, 105, 0, 0.5)',
      Channels.Clean, 'rgba(175, 167, 5, 0.5)',
      Channels.Hydrate, 'rgba(176, 191, 9, 0.5)',
      Channels.Flood, 'rgba(195, 224, 8, 0.5)',
      Channels.Energize, 'rgba(195, 224, 8, 0.5)',
      Channels.Grow, 'rgba(58, 224, 7, 0.5)',
      Channels.Harvest, 'rgba(7, 224, 129, 0.5)',
      Channels.Heard, 'rgba(7, 224, 173, 0.5)',
      Channels.Conserve, 'rgba(7, 144, 224, 0.5)',
      Channels.Plat, 'rgba(86, 7, 224, 0.5)',
      Channels.Zone, 'rgba(86, 7, 224, 0.5)',
      Channels.Permit, 'rgba(86, 7, 224, 0.5)',
      Channels.Drill, 'rgba(86, 7, 224, 0.5)',
      Channels.Mine, 'rgba(86, 7, 224, 0.5)',
      Channels.Abate, 'rgba(86, 7, 224, 0.5)',
      Channels.Preserve, 'rgba(86, 7, 224, 0.5)',
      'rgba(81, 66, 81, 0.5)'
    ]
    //  Breaks matching with terrifying "cannot read property 'r' of null" errors...
    // ,
    // 'fill-outline-color': [
    //   'match',
    //   ['get', 'channel'],
    //   0, 'rgba(0, 215, 239, 1)',
    //   1, 'rgba(255, 220, 0, 1)',
    //   2, 'rgba(255, 65, 54, 1)',
    //   31, 'rgba(200, 100, 240, 1)',
    //   11, 'rgba(200, 100, 240, 0.5)',
    //   'rgba(155, 65, 54, 0.5)'
    // ]
  }

  initializeDrawing() {
    this.draw = new Draw({
      displayControlsDefault: false,
      controls: { polygon: true }
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

    this.map.on('touchend', 'boundaries', e => {
      if (!this.newFeatureId) {
        this.setSelectedFeature(e.features[0]);
      }
    })

    this.map.on('click', 'boundaries', e => {
      if (!this.newFeatureId && !this.isDeleting) {
        this.setSelectedFeature(e.features[0]);
      } else if (!this.newFeatureId && this.isDeleting) {
        this.mapSvc.deleteFeature(e.features[0]);
        this.mapSvc.toggleDelete();
        this.ref.detectChanges();
      }
    })

    // TODO: add name and state property to staticFeatures
    this.map.on("mousemove", "countyFills", e => {
      if (this.hoveredCounty != `${e.features[0].properties.countyNameLong}, ${e.features[0].properties.stateCode}`) {
        this.hoveredCounty = `${e.features[0].properties.countyNameLong}, ${e.features[0].properties.stateCode}`;
        this.ref.detectChanges();
      }
    })

    this.map.on("mouseleave", "countyFills", e => {
      this.hoveredCounty = "";
      this.ref.detectChanges();
    })
  }

  setSelectedFeature(feature) {
    this.selectedFeature = feature;
    this.ref.detectChanges();
    this.router.navigate([`/${feature.properties.zapId}`]);
  }

  editFeature() {
    let feature = this.selectedFeature as any;
    feature.id = feature.properties.id;
    this.draw.add(feature);
    this.draw.changeMode('direct_select', { featureId: feature.id });
    this.map.setFilter('boundaries', ["!=", feature.id, ["get", "id"]]);
  }

  saveEdit() {
    let feature = this.draw.getAll().features[0];
    this.mapSvc.saveFeature(feature);
    this.draw.delete(this.selectedFeature.properties.id);
    this.map.setFilter('boundaries', null);
    this.hideMenu();
  }

  cancelEdit() {
    this.draw.delete(this.selectedFeature.properties.id);
    this.map.setFilter('boundaries', null);
    this.hideMenu();
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

  setChannelFilter(selectedChannels) {
    if (selectedChannels.length > 0) {
      let filterExpression = ["match", ["get", "channel"]].concat(selectedChannels, false as any);
      this.map.setFilter('boundaries', filterExpression);
    } else this.map.setFilter('boundaries', null);
    this.ref.detectChanges();
  }

  hideMenu() {
    this.selectedFeature = null;
    this.newFeatureId = "";
    this.ref.detectChanges()
  }

}
