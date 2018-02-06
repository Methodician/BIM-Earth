import { Component, OnInit } from '@angular/core';
import { AuthService } from '@services/auth.service';
import { AuthInfo } from '@models/auth-info';
import { MapService } from '@services/map.service';
import { FormGroup } from '@angular/forms';
import { FormBuilder, Validators } from '@angular/forms';

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
  form: FormGroup;

  constructor(private authSvc: AuthService, private mapSvc: MapService, private fb: FormBuilder) { }

  ngOnInit() {
    this.authSvc.getCurrentUserData().valueChanges().subscribe(data => {
      if(this.form) this.form.patchValue(data);
    })

    this.form = this.fb.group({
      name: ['', Validators.required],
      location: ''
    })

    this.authSvc.authInfo$.subscribe(info => {
      this.authInfo = info;
      this.form.patchValue({ name: info.displayName })
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

  updateProfile() {
    this.form.reset(this.form.value)
    this.authSvc.updateUser(this.form.value);
  }
}
