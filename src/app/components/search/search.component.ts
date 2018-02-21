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
      switch(currentValue.length){
        case 2:
          return this.search.idTree[0];
        case 5:
          this.updateMap(clumps[1]); 
          return this.search.idTree[0][clumps[1]];
        case 9:
          this.updateMap(clumps[1], clumps[2]);
          return this.search.idTree[0][clumps[1]][clumps[2]];
        case 12:
          return this.search.idTree[0][clumps[1]][clumps[2]][clumps[3]];
        default: return {};
      }
    return {};
  }

  setOptions(currentValue) {
    if(this.validStates[currentValue.length]){
      let optionList = this.getOptionsList(currentValue);
      if(optionList) {
        this.options = Object.keys(optionList).map(option => {
          return `${currentValue.toUpperCase()}-${option}`;
        });
        this.searchControl.setValue(currentValue + "-");
      }
    }
  }

  updateMap(state: string, county?: string) {
    let camera = county ? this.search.cameraTree['US'][state].counties[county] : this.search.cameraTree['US'][state];
    if(camera){
      this.mapSvc.setCamera({
        center: new LngLat(camera.lng, camera.lat),
        zoom: camera.zoom
      });
    }
  }
}