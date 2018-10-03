import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DriverRidePage } from './driver-ride';

@NgModule({
  declarations: [
    DriverRidePage,
  ],
  imports: [
    IonicPageModule.forChild(DriverRidePage),
  ],
})
export class DriverRidePageModule {}
