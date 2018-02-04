import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormBuilder } from '@angular/forms'
import { Router } from '@angular/router';;
import { Validators } from '@angular/forms';
import { AuthInfo } from '@models/auth-info';
import { AuthService } from '@services/auth.service';

@Component({
  selector: 'bim-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  form: FormGroup;
  authInfo: AuthInfo;

  constructor(
    private fb: FormBuilder,
    private authSvc: AuthService,
    private router: Router,
  ) {
    this.form = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ngOnInit() {
  }

  // isErrorVisible(field: string, error: string) {
  //   let control = this.form.controls[field];
  //   return control.dirty && control.errors && control.errors[error];
  // }
  // isControlDirty(field: string) {
  //   let control = this.form.controls[field];
  //   return control.dirty;
  // }

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

  get invalid() {
    return !this.form.valid;
  }

  get value() {
    return this.form.value;
  }

  clear() {
    this.form.setValue({ email: '', password: '' });
  }

}
