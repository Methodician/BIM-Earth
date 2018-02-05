import { Component, OnInit } from '@angular/core';
import { AuthService } from '@services/auth.service';
import { AuthInfo } from '@models/auth-info';
import { MapService } from '@services/map.service';

@Component({
  selector: 'bim-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {
  userBoundaries: {}[];
  userHistory: {}[];
  authInfo: AuthInfo = null;
  accountShowing: boolean = false;

  constructor(private authSvc: AuthService, private mapSvc: MapService) { }

  ngOnInit() {
    
    this.authSvc.authInfo$.subscribe(info => {
      this.authInfo = info;
      this.authSvc.accountShowing$.subscribe(isShowing => {
        this.accountShowing = isShowing;
      });
      if(info.$uid) {
        this.mapSvc.getUserBoundaries(info.$uid).valueChanges().subscribe(boundaries => {
          this.userBoundaries = boundaries;
        });
        this.mapSvc.getUserHistory(info.$uid).valueChanges().subscribe(history => {
          this.userHistory = history;
        });
      }
    })
    
  }

}
