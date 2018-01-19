import { Component, OnInit, ChangeDetectorRef, Input } from '@angular/core';
import { MapService } from '@services/map.service';
import { GeoJson } from '@models/map';

@Component({
  selector: 'bim-boundary-details-menu',
  templateUrl: './boundary-details-menu.component.html',
  styleUrls: ['./boundary-details-menu.component.scss']
})
export class BoundaryDetailsMenuComponent implements OnInit {
  @Input() newFeatureId;
  @Input() draw;
  @Input() map;

  constructor(
    private mapSvc: MapService,
    private ref: ChangeDetectorRef
  ) { }

  ngOnInit() { }

  saveFeature(properties) {
    console.log('saving feature with properties: ', properties)
    this.draw.setFeatureProperty(this.newFeatureId, 'channel', properties.channel);
    this.draw.setFeatureProperty(this.newFeatureId, 'zapId', properties.zapId)
    let feature = this.draw.getAll().features[0];
    this.mapSvc.createFeature(feature);
    this.draw.delete(this.newFeatureId);
    this.map.setFilter('boundaries', null);
    this.newFeatureId = "";
  }
}
