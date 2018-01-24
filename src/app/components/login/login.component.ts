import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { Validators } from '@angular/forms';

@Component({
  selector: 'bim-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  form: FormGroup;

  constructor(
    private fb: FormBuilder
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
