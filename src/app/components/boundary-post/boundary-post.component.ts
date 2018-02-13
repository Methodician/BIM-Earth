import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'bim-boundary-post',
  templateUrl: './boundary-post.component.html',
  styleUrls: ['./boundary-post.component.scss']
})
export class BoundaryPostComponent implements OnInit {

  panelOpenState: boolean = false;
  isBoundaryPostOpen = false;


  constructor() { }

  ngOnInit() {
  }  
}