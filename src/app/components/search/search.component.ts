import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { startWith, map } from 'rxjs/operators';
import { MapService } from '@services/map.service';
import { LngLat } from 'mapbox-gl';

@Component({
  selector: 'bim-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  searchControl: FormControl = new FormControl();
  options = ["US"];
  filteredOptions: Observable<string[]>
  searchTree;

  constructor(private mapSvc: MapService) { }

  ngOnInit() {
    this.mapSvc.getSearchTree().valueChanges().subscribe(searchTree => {
      this.searchTree = searchTree;
      this.searchControl.valueChanges.subscribe(currentInput => {
        this.setOptions(currentInput); 
      })
    });
    
    this.filteredOptions = this.searchControl.valueChanges
      .pipe(
        startWith(''),
        map(val => this.filter(val))
      );
  }

  filter(val: string): string[] {
    return this.options.filter(option =>
      option.toLowerCase().indexOf(val.toLowerCase()) === 0);
  }

  getOptionsList(currentValue) {
    let clumps = currentValue.toUpperCase().split('-');
      switch(currentValue.length){
        case 2:
          return this.searchTree[0];
        case 5:
          // this.updateMap(clumps[1]); 
          return this.searchTree[0][clumps[1]];
        case 9:
          // this.updateMap(clumps[1], clumps[2]);
          return this.searchTree[0][clumps[1]][clumps[2]];
        case 12:
          return this.searchTree[0][clumps[1]][clumps[2]][clumps[3]];
        default: return {};
      }
    return {};
  }

  setOptions(currentValue) {
    let length = currentValue.length;
    let validStates = {
      2: true,
      5: true,
      9: true,
      12: true
    }

    if(validStates[length]){
      let optionList = this.getOptionsList(currentValue);
      this.options = Object.keys(optionList).map(option => {
        return `${currentValue.toUpperCase()}-${option}`;
      });
    }
  }

  // cameraSettings = {
  //     OR: {
  //       camera: {center: new LngLat(-121.37276361713657, 44.43370163217466), zoom: 6.305288565354978},
  //       MLT: {center: new LngLat(-122.68110107302624, 45.539207970839755), zoom: 10.65217539816664},
  //     },
  //     CA: {
  //       camera: {center: new LngLat(-123.91465762818035, 40.05286649872119), zoom: 5.077663297653513},
  //       MLT: {center: new LngLat(-122.45030345462033, 37.736104372770384), zoom: 10.863798833636547}
  //     },
  //     WA: {
  //       camera: {center: new LngLat(-121.21793237952636, 47.110869900049266), zoom: 6.811589097399386},
  //       MLT: {center: new LngLat(-122.40006330897717, 47.20801667363452), zoom: 10.572201366683393}
  //     }
  // }

  // updateMap(state, county?) {
  //   let camera;
  //   if(!county) {
  //     let camera = this.cameraSettings[state].camera
  //   } else {
  //     let camera = this.cameraSettings[state][county]
  //   }
  //   this.mapSvc.setCamera(camera);
  // }
}