import { Component, OnInit } from '@angular/core';
import { AuthService } from '@services/auth.service';
import { AuthInfo } from '@models/auth-info';
import { MatDialog, MatDialogRef } from '@angular/material';

import { AccountComponent } from './../account/account.component';

@Component({
  selector: 'bim-account-btns',
  templateUrl: './account-btns.component.html',
  styleUrls: ['./account-btns.component.scss']
})
export class AccountBtnsComponent implements OnInit {

  public tabletNavDropdownVisable = false;

  authInfo: AuthInfo;
  accountDialogRef: MatDialogRef<AccountComponent>;

  constructor(
    private authSvc: AuthService,
    private dialog: MatDialog,
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

  openAccount() {
    // if(this.authInfo.isLoggedIn()) this.authSvc.toggleShowAccount();
    this.accountDialogRef = this.dialog.open(AccountComponent);
  }

  signout() {
    this.authSvc.logout();
  }
}
