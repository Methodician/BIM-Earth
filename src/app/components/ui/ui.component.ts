import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { MapService } from '@services/map.service';
import { MatDialog, MatDialogRef } from '@angular/material';

import { ChannelFilterMenuComponent } from './../channel-filter-menu/channel-filter-menu.component';

@Component({
  selector: 'bim-ui',
  templateUrl: './ui.component.html',
  styleUrls: ['./ui.component.scss']
})
export class UiComponent implements OnInit {
  isDeleting: boolean = false;
  // filterHidden: boolean = true;

  channelFilterDialogRef : MatDialogRef<ChannelFilterMenuComponent>;

  constructor(private mapSvc: MapService, private ref: ChangeDetectorRef, private dialog: MatDialog) { }

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
    // this.filterHidden = !this.filterHidden;
    this.channelFilterDialogRef = this.dialog.open(ChannelFilterMenuComponent);
  }
}
