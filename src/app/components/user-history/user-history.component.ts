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
    return `${timestamp.getMonth()+1}/${timestamp.getDay()}/${timestamp.getYear() - 100} at ${timestamp.getHours()}:${timestamp.getMinutes()}`;
  }

}
