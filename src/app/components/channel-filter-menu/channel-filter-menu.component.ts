import { Component, OnInit } from '@angular/core';
import { Channels } from '@enums/channels.enum';

@Component({
  selector: 'bim-channel-filter-menu',
  templateUrl: './channel-filter-menu.component.html',
  styleUrls: ['./channel-filter-menu.component.scss']
})
export class ChannelFilterMenuComponent implements OnInit {
  channels: Object[];

  constructor() {}

  ngOnInit() {
    this.buildChannels();
    console.log('chanels', this.channels);
  }
  
  buildChannels() {
    let keys = Object.keys(Channels);
    keys = keys.slice(0, keys.length / 2);
    this.channels = keys.map(channel => {
      return {name: Channels[channel], id: channel}
    });
  }
}