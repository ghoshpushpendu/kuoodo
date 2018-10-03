import { NgModule } from '@angular/core';
import { IonicPageModule, IonicPage } from 'ionic-angular';
import { SearchlocationPage } from './searchlocation';

@IonicPage()
@NgModule({
    declarations: [
        SearchlocationPage,
    ],
    imports: [
        IonicPageModule.forChild(SearchlocationPage),
    ],
})
export class SearchlocationPageModule { }
