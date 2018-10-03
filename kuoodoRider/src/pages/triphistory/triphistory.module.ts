import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TriphistoryPage } from './triphistory';

@NgModule({
  declarations: [
    TriphistoryPage,
  ],
  imports: [
    IonicPageModule.forChild(TriphistoryPage),
  ],
})
export class TriphistoryPageModule {}
