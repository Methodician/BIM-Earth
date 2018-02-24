import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'bim-user-history',
  templateUrl: './user-history.component.html',
  styleUrls: ['./user-history.component.scss']
})
export class UserHistoryComponent implements OnInit {
  @Input() history;

  pastTense = {
    create: "Created",
    edit: "Edited",
    delete: "Deleted"
  }
  
  constructor() { }

  ngOnInit() {}

  friendlyData(timestamp) {
    let minutes = timestamp.getMinutes() > 10 ? timestamp.getMinutes() : `0${timestamp.getMinutes()}`;
    let hours = timestamp.getHours() == 0 ? "00" : timestamp.getHours();
    return `${timestamp.toLocaleDateString()} at ${hours}:${minutes}`;
  }

}
