import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'bim-user-boundaries',
  templateUrl: './user-boundaries.component.html',
  styleUrls: ['./user-boundaries.component.scss']
})
export class UserBoundariesComponent implements OnInit {
  @Input() boundaries;
  constructor() { }

  ngOnInit() {}

  authorName(authorKey: string) {
    return authorKey.slice(0,12) + '...';
  }

}
