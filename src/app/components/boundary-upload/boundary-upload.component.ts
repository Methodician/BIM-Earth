import { Component, OnInit } from '@angular/core';
import { counties } from './counties';
import { labels } from './labels';
import { MapService } from '@services/map.service';

@Component({
  selector: 'bim-boundary-upload',
  templateUrl: './boundary-upload.component.html',
  styleUrls: ['./boundary-upload.component.scss']
})
export class BoundaryUploadComponent implements OnInit {
  states = {
    "53": "Washington",
    "41": "Oregon",
    "06": "California"
  }

  constructor(private mapSvc: MapService) { }

  ngOnInit() { }

  uploadCounties() {
    let features = this.getCountyFeatures();
    features.forEach(feature => {
      this.mapSvc.createStaticFeature(feature as any)
    })
  }

  getCountyFeatures() {
    return counties.features.reduce((arr, county) => {
      let label = labels.filter(label => {
          return label.state === this.states[county.properties.number] && label.name === county.properties.name
      })[0];
      if(label) {
          arr.push({
              type: "Feature",
              geometry: county.geometry,
              properties: {
                author: "6gHVLmVeeqTxnfNxfWTLz1uOeNH2",
                channel: 0,
                zapId: this.generateZapId(label.prefix, "00")
              }
          });
          return arr;
        } else { return arr };
    }, []);
  }

  generateZapId(prefix, channel) {
    let uid = Math.random().toString(36).substr(2, 5).toUpperCase();
    return `${prefix}-${channel}-${uid}`;
  }
}
