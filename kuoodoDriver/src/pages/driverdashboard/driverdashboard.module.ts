import { NgModule } from '@angular/core';
import { IonicPageModule, IonicPage } from 'ionic-angular';
import { DriverdashboardPage } from './driverdashboard';

@NgModule({
  declarations: [
    DriverdashboardPage,
  ],
  imports: [
    IonicPageModule.forChild(DriverdashboardPage),
  ],
})
export class DriverdashboardPageModule {}
