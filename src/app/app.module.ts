import { environment } from '../environments/environment';

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';

import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireDatabaseModule } from 'angularfire2/database';

import { AppComponent } from './app.component';
import { MapComponent } from './components/map/map.component';
import { NavComponent } from './components/nav/nav.component';


import { MapService } from './services/map.service';
import { RtdbMapService } from './services/rtdb-map.service';


@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    NavComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig, 'bim-earth'),
    AngularFirestoreModule,
    AngularFireAuthModule,
    AngularFireDatabaseModule
  ],
  providers: [
    MapService,
    RtdbMapService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
