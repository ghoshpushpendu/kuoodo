import { NgModule } from '@angular/core';
import { IonicPageModule, IonicPage } from 'ionic-angular';
import { RegistrationPage } from './registration';

@IonicPage()
@NgModule({
    declarations: [
        RegistrationPage,
    ],
    imports: [
        IonicPageModule.forChild(RegistrationPage),
    ],
})
export class RegistrationPageModule { }
