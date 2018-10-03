import { NgModule } from '@angular/core';
import { IonicPageModule, IonicPage } from 'ionic-angular';
import { DriverprofilePage } from './driverprofile';

@IonicPage()
@NgModule({
    declarations: [
        DriverprofilePage,
    ],
    imports: [
        IonicPageModule.forChild(DriverprofilePage),
    ],
})
export class DriverprofilePageModule { }
