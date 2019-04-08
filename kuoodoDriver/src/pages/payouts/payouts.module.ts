import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PayoutsPage } from './payouts';

@NgModule({
  declarations: [
    PayoutsPage,
  ],
  imports: [
    IonicPageModule.forChild(PayoutsPage),
  ],
})
export class PayoutsPageModule {}
