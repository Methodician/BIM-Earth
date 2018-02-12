import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Channels } from '@enums/channels.enum';

@Component({
  selector: 'bim-boundary-form',
  templateUrl: './boundary-form.component.html',
  styleUrls: ['./boundary-form.component.scss']
})
export class BoundaryFormComponent implements OnInit {
  @Input() initialValue;
  @Input() prefix;
  form: FormGroup;
  channels: string[];
  defaultChannel: string = "00-";

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.form = this.fb.group({
      zapId: ["", Validators.required],
      channel: [0, Validators.required]
    })
    this.initializeChannels();
    if(this.prefix) this.setPrefix();
    if(this.initialValue) this.setInitialValue();
    // this.setInitialValue()
  }

  setPrefix() { 
    this.form.patchValue({
      zapId: this.prefix + this.defaultChannel + this.randomString(),
    })
  }

  initializeChannels() {
    this.channels = Object.keys(Channels);
    this.channels = this.channels.slice(0, this.channels.length / 2);
  }

  setInitialValue() {
    if (this.initialValue) {
      this.form.patchValue(this.initialValue)
    }
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
