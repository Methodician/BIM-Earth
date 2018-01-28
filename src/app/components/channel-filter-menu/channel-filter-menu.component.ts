import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Channels } from '@enums/channels.enum';

@Component({
  selector: 'bim-channel-filter-menu',
  templateUrl: './channel-filter-menu.component.html',
  styleUrls: ['./channel-filter-menu.component.scss']
})
export class ChannelFilterMenuComponent implements OnInit {
  form: FormGroup;
  channels;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.buildChannels();

    this.form = this.fb.group({
      channels: this.buildChannelControls()
    });

    this.form.get('channels').valueChanges
      .subscribe(selectionStates => this.updateFilter(selectionStates))
  }
  
  buildChannels() {
    let keys = Object.keys(Channels);
    keys = keys.slice(0, keys.length / 2);
    this.channels = keys.map(channel => {
      return {name: Channels[channel], id: channel}
    });
  }

  buildChannelControls() {
    let controls = [];
    for(let i = 0; i < this.channels.length; i++) {
      controls[i] = this.fb.control(false)
    } 
    return this.fb.array(controls)
  }

  updateFilter(selectionStates: string[]) {
    let selected = selectionStates.reduce((selected, isSelected, i) => {
      if(isSelected) {
        return selected.concat(this.channels[i].id, true)
      } else return selected
    }, [])
    console.log('selected: ', selected)
  }
}