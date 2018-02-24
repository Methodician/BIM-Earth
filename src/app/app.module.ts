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
import { AngularFireStorageModule } from 'angularfire2/storage'
// test import module to make sure that angular material is working
import { MatIconModule, MatButtonModule, MatMenuModule, MatInputModule, MatCheckboxModule, MatDialogModule, MatDialogRef, MatExpansionModule, MatCardModule, MatListModule, MatChipsModule, MatToolbarModule, MatFormFieldModule, MatAutocompleteModule } from '@angular/material';

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
import { LoginComponent } from './components/login/login.component';
import { ChannelFilterMenuComponent } from './components/channel-filter-menu/channel-filter-menu.component';
import { AccountComponent } from './components/account/account.component';
import { UserHistoryComponent } from './components/user-history/user-history.component';
import { UserBoundariesComponent } from './components/user-boundaries/user-boundaries.component';
import { ProfilePictureComponent } from './components/profile-picture/profile-picture.component';
import { UploadComponent } from './components/upload/upload.component'
import { BoundaryPostComponent } from './components/boundary-post/boundary-post.component';
import { PostComponent } from './components/post/post.component';
import { SearchComponent } from './components/search/search.component';

import { ClickOutsideDirective } from './shared/directives/click-outside.directive';


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
    LoginComponent,
    ChannelFilterMenuComponent,
    AccountComponent,
    UserHistoryComponent,
    UserBoundariesComponent,
    ProfilePictureComponent,
    ClickOutsideDirective,
    BoundaryPostComponent,
    PostComponent,
    UploadComponent,
    SearchComponent,
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
    AngularFireStorageModule,
    BrowserAnimationsModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatInputModule,
    MatDialogModule,
    MatCheckboxModule,
    MatExpansionModule,
    MatCardModule,
    MatListModule,
    MatChipsModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatAutocompleteModule,
  ],
  providers: [
    MapService,
    AuthService,
  ],
  entryComponents: [
    ChannelFilterMenuComponent,
    RegisterComponent,
    LoginComponent,
    AccountComponent,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
