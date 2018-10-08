import { NgModule } from '@angular/core';
import { IonicPageModule, IonicPage } from 'ionic-angular';
import { DriverdashboardPage } from './driverdashboard';
import {SlimLoadingBarModule} from 'ng2-slim-loading-bar';

@NgModule({
  declarations: [
    DriverdashboardPage,
  ],
  imports: [
    IonicPageModule.forChild(DriverdashboardPage),
    SlimLoadingBarModule.forRoot()
  ],
})
export class DriverdashboardPageModule {}
