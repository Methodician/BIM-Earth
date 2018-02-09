import { Component, OnInit } from '@angular/core';
import { counties20m } from './counties';
import { states20m } from './states';
import { labels, labelHeaders } from './labels';

@Component({
  selector: 'bim-boundary-upload',
  templateUrl: './boundary-upload.component.html',
  styleUrls: ['./boundary-upload.component.scss']
})
export class BoundaryUploadComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    console.log('boundary upload')
    let label = labels;
    console.log('label: ', label)
    debugger;
  }

}
