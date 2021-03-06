import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { HttpModule } from '@angular/http';

import { MyApp } from './app.component';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { LocalStorageProvider } from '../app.localStorage';
import { Geolocation } from '@ionic-native/geolocation';
import { Device } from '@ionic-native/device';
import { Network } from '@ionic-native/network';
import { Stripe } from '@ionic-native/stripe';
import { LaunchNavigator, LaunchNavigatorOptions } from '@ionic-native/launch-navigator';


@NgModule({
  declarations: [
    MyApp
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp
  ],
  providers: [
    StatusBar,
    LaunchNavigator,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    LocalStorageProvider,
    Geolocation,
    Network,
    Stripe,
    LocalStorageProvider,
    Device
  ]
})
export class AppModule { }