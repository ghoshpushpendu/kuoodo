import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddaccountPage } from './addaccount';

@NgModule({
  declarations: [
    AddaccountPage,
  ],
  imports: [
    IonicPageModule.forChild(AddaccountPage),
  ],
})
export class AddaccountPageModule {}
