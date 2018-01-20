import { Component, OnInit, ChangeDetectorRef, Input, Output, EventEmitter } from '@angular/core';
import { MapService } from '../../services/map.service';
import { GeoJson } from '../../models/map';

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
  @Output() editFeatureRequest = new EventEmitter();
  editingFeature: boolean = false;

  constructor(
    private mapSvc: MapService,
    private ref: ChangeDetectorRef
  ) { }

  ngOnInit() {}

  saveFeature(properties) {
    this.draw.setFeatureProperty(this.newFeatureId, 'accessLevel', properties.accessLevel);
    this.draw.setFeatureProperty(this.newFeatureId, 'zapId', properties.zapId)
    let feature = this.draw.getAll().features[0];
    this.mapSvc.createFeature(feature);
    this.draw.delete(this.newFeatureId);
    this.map.setFilter('boundaries', null);
    this.requestHideMenu();
  }

  updateFeature(properties) {
    this.editingFeature = false;
    let featureId = this.selectedFeature.properties.id
    this.draw.setFeatureProperty(featureId, 'accessLevel', properties.accessLevel);
    this.draw.setFeatureProperty(featureId, 'zapId', properties.zapId)
    let feature = this.draw.getAll().features[0];
    this.mapSvc.saveFeature(feature);
    this.draw.delete(featureId);
    this.map.setFilter('boundaries', null);
    this.requestHideMenu();
  }

  editFeature() {
    this.editFeatureRequest.emit(this.selectedFeature);
    this.editingFeature = true;
    this.ref.detectChanges()
    // console.log('not yet enabled');
  }

  requestHideMenu() {
    this.hideMenuRequest.emit()
  }
}
