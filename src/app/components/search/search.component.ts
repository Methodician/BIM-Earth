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
  search;
  validStates = {
    2: true,
    5: true,
    9: true,
    12: true
  };

  constructor(private mapSvc: MapService) { }

  ngOnInit() {
    this.mapSvc.getSearchData().valueChanges().subscribe(searchData => {
      this.search = searchData;
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
    try {
      switch(currentValue.length){
        case 2:
          return this.search.idTree[clumps[0]];
        case 5:
          this.updateMap(clumps[1]); 
          return this.search.idTree[clumps[0]][clumps[1]];
        case 9:
          this.updateMap(clumps[1], clumps[2]);
          return this.search.idTree[clumps[0]][clumps[1]][clumps[2]];
        case 12:
          return this.search.idTree[clumps[0]][clumps[1]][clumps[2]][clumps[3]];
        default: return {};
      }
    } catch (error) {
      console.warn('[Input error] Please enter a valid Zap ID. (example US-CA-SFS-22-MAA2S)');
    }
  }

  setOptions(currentValue) {
    if(this.validStates[currentValue.length]){
      let optionList = this.getOptionsList(currentValue);
      if(optionList) {
        this.options = Object.keys(optionList).map(option => {
          return `${currentValue.toUpperCase()}-${option}`;
        });
      }
      this.searchControl.setValue(currentValue + "-");
    }
    if(currentValue.length === 18) this.selectFoundFeature(currentValue);
  }

  selectFoundFeature(zapId) {
    let clumps = zapId.toUpperCase().split('-');
    let current = this.search.cameraTree['US'];
    for(let i = 1; i < 5; i++) {
      current = current[clumps[i]];
      if(!current) {
        current = {};
        return;
      };
    }
    if(current) this.mapSvc.setCameraBounds(current.bounds);
  }

  updateMap(state: string, county?: string) {
    let camera = county ? this.search.cameraTree['US'][state][county] : this.search.cameraTree['US'][state];
    if(camera && camera.bounds){ //validation no longer necessary
      this.mapSvc.setCameraBounds(camera.bounds);
    }
  }
}