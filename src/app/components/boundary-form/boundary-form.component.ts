import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Channels } from '@enums/channels.enum';

@Component({
  selector: 'bim-boundary-form',
  templateUrl: './boundary-form.component.html',
  styleUrls: ['./boundary-form.component.scss']
})
export class BoundaryFormComponent implements OnInit {
  form: FormGroup;
  channels: string[];

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      zapId: ['US-OR-MLT-00-' + this.randomString(), Validators.required],
      channel: [0, Validators.required]
    })
  }

  ngOnInit() {
    this.channels = Object.keys(Channels);
    this.channels = this.channels.slice(0, this.channels.length / 2);
  }

  channelSelect(channelKey: string) {
    if (channelKey.length < 2)
      channelKey = '0'.concat(channelKey);
    let zapId = this.form.controls.zapId.value;
    let zapArray = zapId.split('');
    zapArray.splice(10, 2, channelKey);
    zapId = zapArray.join('');
    this.form.controls.zapId.setValue(zapId);
  }

  channelName(channelKey: number) {
    return Channels[channelKey];
  }

  randomString() {
    return Math.random().toString(36).substr(2, 5).toUpperCase();
  }

  get invalid() {
    return !this.form.valid;
  }

  get value() {
    return this.form.value;
  }

  clear() {
    this.form.setValue({ zapId: "", channel: 0 })
  }
}
