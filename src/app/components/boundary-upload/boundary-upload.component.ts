import { Component, OnInit } from '@angular/core';
import { counties } from './counties';
import { labels, states } from './labels';
import { MapService } from '@services/map.service';
import * as Turf from '@turf/turf'
import { GeoJson } from '@models/map';

@Component({
  selector: 'bim-boundary-upload',
  templateUrl: './boundary-upload.component.html',
  styleUrls: ['./boundary-upload.component.scss']
})
export class BoundaryUploadComponent implements OnInit {
  data = {
    US: {}
  }
  states = {
    "53": "Washington",
    "41": "Oregon",
    "06": "California"
  }

  constructor(private mapSvc: MapService) { }

  ngOnInit() {}

  uploadCameraBounds() {
    this.uploadStateBounds();
    this.uploadCountyBounds()
  }

  uploadStateBounds() {
    (states as GeoJson[]).forEach(state => {
      let bounds = this.getBounds(state);
      this.mapSvc.saveStateBounds(state.properties.NAME, bounds)
      this.data.US[(state as any).properties.NAME] = {bounds: bounds};
    });
  }

  getBounds(feature) {
    let bbox = Turf.bbox(feature);
    return [[bbox[0], bbox[1]], [bbox[2], bbox[3]]]
  }

  uploadCountyBounds() {
    this.mapSvc.getStaticFeatures().valueChanges().subscribe(features => {
      features.forEach(feature => {
        let bounds = this.getBounds(feature);
        let id = (feature as any).properties.zapId.split('-');
        this.mapSvc.saveCountyBounds(id[1], id[2], bounds);
        this.data.US[id[1]][id[2]] = { bounds: bounds };
      });
    })
  }

  uploadCounties() {
    let features = this.getCountyFeatures();
    features.forEach(feature => {
      this.mapSvc.createStaticFeature(feature as any)
    })
  }

  getCountyFeatures() {
    return counties.features.reduce((arr, county) => {
      let label = labels[county.properties.GEO_ID.slice(9)];
      if(label) {
        arr.push({
          type: "Feature",
          geometry: county.geometry,
          properties: {
            author: "6gHVLmVeeqTxnfNxfWTLz1uOeNH2",
            zapId: this.generateZapId(label.prefix, "00"),
            stateCode: label.state_acronym,
            stateName: label.state_name,
            countyName: label.county_name,
            countyNameLong: label.county_name_long
          }
        })
      }
      return arr;
    }, [])
  }

  generateZapId(prefix, channel) {
    let uid = Math.random().toString(36).substr(2, 5).toUpperCase();
    return `${prefix}-${channel}-${uid}`;
  }
}
