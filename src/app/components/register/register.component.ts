import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { Validators } from '@angular/forms';


@Component({
  selector: 'bim-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  form: FormGroup;

  constructor(
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
      confirmPass: ['', Validators.required],
      alias: '',
      zipCode: ''
    });
  }

  ngOnInit() {
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
