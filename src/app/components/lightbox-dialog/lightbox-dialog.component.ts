import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'bim-lightbox-dialog',
  templateUrl: './lightbox-dialog.component.html',
  styleUrls: ['./lightbox-dialog.component.scss']
})
export class LightboxDialogComponent implements OnInit {
  public downloaded: boolean = false;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() { }

  markDownload() {
    this.downloaded = true;
  }
}
