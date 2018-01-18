import { environment } from '../environments/environment';

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';

import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
// test import module to make sure that angular material is working
import {MatIconModule, MatButtonModule, MatMenuModule} from '@angular/material';

import { AppComponent } from './app.component';
import { MapComponent } from './components/map/map.component';
import { NavComponent } from './components/nav/nav.component';

import { NgxMapboxGLModule } from 'ngx-mapbox-gl';

import { MapService } from './services/map.service';
import { UiComponent } from './components/ui/ui.component';
import { AccountBtnsComponent } from './components/account-btns/account-btns.component';


@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    NavComponent,
    UiComponent,
    AccountBtnsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgxMapboxGLModule.forRoot(environment.mapbox),
    AngularFireModule.initializeApp(environment.firebaseConfig, 'bim-earth'),
    AngularFirestoreModule,
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    BrowserAnimationsModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
  ],
  providers: [
    MapService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
