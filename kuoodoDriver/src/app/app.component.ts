import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, Events, LoadingController, ToastController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { LocalStorageProvider } from '../app.localStorage';
import { AppService } from './../app.providers';
import { Network } from '@ionic-native/network';

declare var navigator;


@Component({
  templateUrl: 'app.html'
})

export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any;
  id: any;
  pages: Array<{ title: string, component: any }> = [
    { title: 'Profile', component: 'DriverprofilePage' },
    { title: 'Trip History', component: 'TriphistoryPage' },
    { title: 'Car Documents', component: 'DocumentationPage' }
  ];
  public userName = "username";
  public userImage = "https://openclipart.org/image/2400px/svg_to_png/190113/1389952697.png";

  constructor(
    public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    private localStorageProvider: LocalStorageProvider,
    private appService: AppService,
    public events: Events,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    private network: Network) {

    let driverId = localStorage.getItem("driverId");
    console.log(driverId);
    if (driverId) {
      this.rootPage = "DriverdashboardPage";
    } else {
      this.rootPage = "RegistrationPage";
    }

    this.initializeApp();
    let _base = this;
    this.appService.userInfo.subscribe(function (user) {
      if (user) {
        _base.userName = user.firstName + ' ' + user.lastName;
      }
    });
  }

  initializeApp() {
    this.checkInternet();
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.push(page.component);
  }

  logout() {
    // localStorage.removeItem("loginId");
    localStorage.clear();
    this.nav.setRoot("LoginPage");
  }

  showToast(message: string) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: 'bottom'
    });

    toast.present(toast);
  }


  checkInternet() {
    let _base = this;
    let loading: any;

    let disconnectSub = _base.network.onDisconnect().subscribe(() => {
      loading = _base.loadingCtrl.create({
        content: 'Waiting for connection ...'
      });
      loading.present();
    });

    let connectSub = _base.network.onConnect().subscribe(() => {
      if (loading != undefined) {
        loading.dismiss();
      }
      let message = "Connected to network";
      _base.showToast(message);
    });
  }

}
