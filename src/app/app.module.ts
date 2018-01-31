import { environment } from '@environments/environment';

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';

import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// test import module to make sure that angular material is working
import { MatIconModule, MatButtonModule, MatMenuModule, MatInputModule } from '@angular/material';

import { AppComponent } from './app.component';
import { MapComponent } from '@components/map/map.component';
import { NavComponent } from '@components/nav/nav.component';

import { NgxMapboxGLModule } from 'ngx-mapbox-gl';

import { MapService } from '@services/map.service';
import { UiComponent } from '@components/ui/ui.component';
import { AccountBtnsComponent } from '@components/account-btns/account-btns.component';
import { BoundaryDetailsMenuComponent } from '@components/boundary-details-menu/boundary-details-menu.component';
import { BoundaryFormComponent } from '@components/boundary-form/boundary-form.component';
import { RegisterComponent } from './components/register/register.component';
import { AuthService } from '@services/auth.service';
import { AuthMenuComponent } from './components/auth-menu/auth-menu.component';
import { LoginComponent } from './components/login/login.component';
import { ChannelFilterMenuComponent } from './components/channel-filter-menu/channel-filter-menu.component';
import { AccountComponent } from './components/account/account.component';


@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    NavComponent,
    UiComponent,
    AccountBtnsComponent,
    BoundaryDetailsMenuComponent,
    BoundaryFormComponent,
    RegisterComponent,
    AuthMenuComponent,
    LoginComponent,
    ChannelFilterMenuComponent,
    AccountComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
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
    MatInputModule
  ],
  providers: [
    MapService,
    AuthService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
