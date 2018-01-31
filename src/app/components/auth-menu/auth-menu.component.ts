import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthInfo } from '@models/auth-info';
import { AuthService } from '@services/auth.service';

@Component({
  selector: 'bim-auth-menu',
  templateUrl: './auth-menu.component.html',
  styleUrls: ['./auth-menu.component.scss']
})
export class AuthMenuComponent implements OnInit {
  authInfo: AuthInfo;

  isRegistering = false;
  isLoggingIn = false;

  constructor(
    private authSvc: AuthService,
    private router: Router

  ) { }

  ngOnInit() {
    this.authSvc.currentlyRegistering$.subscribe(registering => {
      this.isRegistering = registering;
    });
    this.authSvc.currentlyLoggingIn$.subscribe(loggingIn => {
      this.isLoggingIn = loggingIn;
    });

    // this.authSvc.authInfo$.subscribe(info => {
    //   console.log('auth info in auth menu', info);
    // });
    // this.authSvc.user$.subscribe(user => {
    //   console.log('user from auth menu', user);
    // });
  }

  outsideRegisterClicked(e) {
    const mobileBtn = document.getElementById('signup-btn-mobile');
    const button = document.getElementById('signup-btn');
    const signupButtonClicked = (e === button || e.parentElement === button || e === mobileBtn || e.parentElement == mobileBtn);
    // console.log('signupButtonClicked:', signupButtonClicked);
    if (!signupButtonClicked)
      this.authSvc.currentlyRegistering$.next(false);
  }

  async registerAsync(formVal) {
    try {
      const registerResult = await this.authSvc.register(formVal.email, formVal.password);
      console.log('registration successful, result:', registerResult)
      //  Currently afAuth.auth.currentUser is null at this point, but not in subscription version...
      this.authSvc.setDisplayName(formVal.alias);
    }
    catch (err) { console.log('Registration failed', err); }
  }

  register(formVal) {
    this.authSvc.register(formVal.email, formVal.password)
      .subscribe(
      res => {
        console.log('registration successful, result:', res)
        this.authSvc.setDisplayName(formVal.alias);
        this.authSvc.sendVerificationEmail();
        // this.router.navigateByUrl('/account');
      },
      err => alert(err)
      );
  }

  async login(formVal) {
    try {
      const loginResult = await this.authSvc.login(formVal.email, formVal.password);
      console.log('logged in', loginResult);
      this.authSvc.currentlyLoggingIn$.next(false);
    }
    catch (err) {
      console.log("couldn't log in", err);
    }
  }

}
