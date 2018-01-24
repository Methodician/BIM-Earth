import { Component, OnInit } from '@angular/core';
import { AuthService } from '@services/auth.service';
import { AuthInfo } from '@models/auth-info';

@Component({
  selector: 'bim-account-btns',
  templateUrl: './account-btns.component.html',
  styleUrls: ['./account-btns.component.scss']
})
export class AccountBtnsComponent implements OnInit {

  authInfo: AuthInfo;

  constructor(
    private authSvc: AuthService
  ) {
    this.authSvc.authInfo$.subscribe(info => {
      this.authInfo = info;
    });
  }

  ngOnInit() {
  }

  openSignup() {
    const isOpen = this.authSvc.currentlyRegistering$.value;
    if (!isOpen)
      this.authSvc.currentlyLoggingIn$.next(false);
    this.authSvc.currentlyRegistering$.next(!isOpen);
  }

  openLogin() {
    const isOpen = this.authSvc.currentlyLoggingIn$.value;
    if (!isOpen)
      this.authSvc.currentlyRegistering$.next(false);
    this.authSvc.currentlyLoggingIn$.next(!isOpen);
  }

  signout() {
    this.authSvc.logout();
  }

}
