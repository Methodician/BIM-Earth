import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'bim-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {
  public searchBarVisible = false;

  constructor() { }

  ngOnInit() { }
}
