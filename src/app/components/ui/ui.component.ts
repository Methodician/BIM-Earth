import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { MapService } from '@services/map.service';

@Component({
  selector: 'bim-ui',
  templateUrl: './ui.component.html',
  styleUrls: ['./ui.component.scss']
})
export class UiComponent implements OnInit {
  isDeleting: boolean = false;
  filterHidden: boolean = true;

  constructor(private mapSvc: MapService, private ref: ChangeDetectorRef) { }

  ngOnInit() {
    this.mapSvc.isDeleting$.subscribe(isDeleting => {
      this.isDeleting = isDeleting;
      this.ref.detectChanges();
    })
  }

  toggleDelete() {
    this.isDeleting = !this.isDeleting;
    this.mapSvc.toggleDelete()
    this.ref.detectChanges()
  }

  toggleFilter() {
    this.filterHidden = !this.filterHidden;
  }
}
