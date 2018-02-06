import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthInfo } from '@models/auth-info';
import { AuthService } from '@services/auth.service';

@Component({
  selector: 'bim-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  form: FormGroup;
  authInfo: AuthInfo;

  constructor(
    private fb: FormBuilder,
    private authSvc: AuthService,
    private router: Router,
  ) {
    this.form = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
      confirmPass: ['', Validators.required],
      name: '',
      location: ''
    });
  }

  ngOnInit() {
  }

  async registerAsync(formVal) {
    try {
      const registerResult = await this.authSvc.register(formVal.email, formVal.password);
      console.log('async registration successful, result:', registerResult);
      //  Currently afAuth.auth.currentUser is null at this point, but not in subscription version...
      this.authSvc.setDisplayName(formVal.alias);
    }
    catch (err) { console.log('Registration failed', err); }
  }

  register(formVal) {
    this.authSvc.register(formVal.email, formVal.password).subscribe(
      res => {
        console.log('registration successful, result:', res);
        this.authSvc.setDisplayName(formVal.alias);
        this.authSvc.sendVerificationEmail();
        console.log('form', this.form.value)
        this.authSvc.saveUser({
          name: this.form.value.name,
          location: this.form.value.location
        });
        // this.authSvc.saveUser()
        // this.router.navigateByUrl('/account');
      },
      err => alert(err)
      );
  }


  // isErrorVisible(field: string, error: string) {
  //   let control = this.form.controls[field];
  //   return control.dirty && control.errors && control.errors[error];
  // }

  // isPasswordMatch() {
  //   const val = this.form.value;
  //   return val.password && val.password == val.confirmPass;
  // }

  // isControlDirty(field: string) {
  //   let control = this.form.controls[field];
  //   return control.dirty;
  // }

  get invalid() {
    return !this.form.valid;
  }

  get value() {
    return this.form.value;
  }

  clear() {
    this.form.setValue({ email: '', password: '', confirmPass: '', alias: '', zipCode: '' });
  }

}
