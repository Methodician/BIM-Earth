import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MapComponent } from '@components/map/map.component';
import { MainRouteContainerComponent } from '@components/main-route-container/main-route-container.component';

const routes: Routes = [
  { path: ':zapId', component: MainRouteContainerComponent },
  { path: '', component: MainRouteContainerComponent },
  { path: '**', redirectTo: '/' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
