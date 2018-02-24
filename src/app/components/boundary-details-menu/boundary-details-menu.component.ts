import { Component, OnInit, ChangeDetectorRef, Input, Output, EventEmitter } from '@angular/core';
import { MapService } from '@services/map.service';
import { GeoJson } from '@models/map';
import * as Mapbox from 'mapbox-gl';

@Component({
  selector: 'bim-boundary-details-menu',
  templateUrl: './boundary-details-menu.component.html',
  styleUrls: ['./boundary-details-menu.component.scss']
})
export class BoundaryDetailsMenuComponent implements OnInit {
  @Input() newFeatureId;
  @Input() selectedFeature;
  @Input() draw;
  @Input() map;
  @Output() hideMenuRequest = new EventEmitter<null>();
  editingFeature: boolean = false;
  prefix: string = "";

  constructor(
    private mapSvc: MapService,
    private ref: ChangeDetectorRef
  ) { }

  ngOnInit() { }

  saveFeature(properties) {
    this.draw.setFeatureProperty(this.newFeatureId, 'channel', properties.channel);
    this.draw.setFeatureProperty(this.newFeatureId, 'zapId', properties.zapId)
    let feature = this.draw.getAll().features[0];
    this.mapSvc.createFeature(feature);
    this.draw.delete(this.newFeatureId);
    this.prefix = "";
    this.requestHideMenu();
  }

  getPrefix() {
    if(this.prefix) return this.prefix;
    const coords = this.draw.getAll().features[0].geometry.coordinates[0][0]
    const lngLat = new Mapbox.LngLat(coords[0], coords[1]);
    const point = this.map.project(lngLat);
    const features = this.map.queryRenderedFeatures(point, {
      layers: ['countyFills']
    });
    if(features.length > 0) {
      this.prefix = features[0].properties.zapId.slice(0, 10)
      return this.prefix;
    } else return "US-OR-MLT-"
  }

  clickedOutside() {
    this.editingFeature = false;
  }

  requestHideMenu() {
    this.hideMenuRequest.emit()
  }
}
