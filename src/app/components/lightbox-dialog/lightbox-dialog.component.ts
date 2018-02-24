import { Component, OnInit, Inject, OnChanges, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { SimpleChanges,  } from '@angular/core/src/metadata/lifecycle_hooks';

@Component({
  selector: 'bim-lightbox-dialog',
  templateUrl: './lightbox-dialog.component.html',
  styleUrls: ['./lightbox-dialog.component.scss']
})
export class LightboxDialogComponent implements OnInit, OnChanges, AfterViewChecked {
  public downloaded: boolean = false;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private ref: ChangeDetectorRef) { }

  ngOnInit() {
    console.log('lightbox dialog initialized');
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log('lightbox changes: ', changes)
  }

  ngAfterViewChecked() {
    console.log('lightbox dialog view checked')
  }

  forceClose() {
    console.log('dialog close clicked')
    this.ref.detectChanges();
  }

  markDownload() {
    console.log('download clicked');
    this.ref.detectChanges();
    this.downloaded = true;
  }
}
