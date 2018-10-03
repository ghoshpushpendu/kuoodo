import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FindcarPage } from './findcar';
import { QRCodeModule } from 'angular2-qrcode';

@NgModule({
    declarations: [
        FindcarPage,
    ],
    imports: [
        QRCodeModule,
        IonicPageModule.forChild(FindcarPage),
    ],
})
export class FindcarPageModule { }
