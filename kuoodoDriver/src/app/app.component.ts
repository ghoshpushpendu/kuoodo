import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, Events, LoadingController, ToastController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { LocalStorageProvider } from '../app.localStorage';
import { AppService } from './../app.providers';
import { Network } from '@ionic-native/network';
import { get } from 'scriptjs';

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
    { title: 'Car Documents', component: 'DocumentationPage' },
    { title: 'Transactions', component: 'TransactionsPage' }
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

    // let internet = (navigator.connection.rtt > 0);
    let _base = this;

    let driverId = localStorage.getItem("driverId");
    _base.id = driverId;


    if (driverId) {
      // _base.rootPage = "FindcarPage";
      if (sessionStorage.getItem("google") == "enabled") {
        _base.rootPage = "FindcarPage"
      } else {
        get("https://maps.googleapis.com/maps/api/js?key=AIzaSyCAUo5wLQ1660_fFrymXUmCgPLaTwdXUgY&libraries=drawing,places,geometry,visualization", () => {
          //Google Maps library has been loaded...
          console.log("Google maps library has been loaded");
          sessionStorage.setItem("google", "enabled");
          _base.rootPage = "FindcarPage"
        });
      }
    } else {
      this.rootPage = "FindcarPage";
    }

    this.initializeApp();
    this.appService.userInfo.subscribe(function (user) {
      if (user) {
        _base.userName = user.firstName + ' ' + user.lastName;

        console.log("USER ---", user, user.profileImage);

        if (user.profileImage) {
          console.log("Getting user profile image");
          _base.userImage = "https://api.kuoodo.com/user/fileShow?imageId=" + user.profileImage;
        }
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


  ngOnInit() {
    this.rootPage = "LoginPage";
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
      _base.rootPage = "NointernetPage"
    });

    let connectSub = _base.network.onConnect().subscribe(() => {
      if (loading != undefined) {
        loading.dismiss();
      }
      let message = "Connected to network";
      _base.showToast(message);

      if (_base.id) {
        // _base.rootPage = "FindcarPage";
        if (sessionStorage.getItem("google") == "enabled") {
          _base.rootPage = "DriverdashboardPage"
        } else {
          get("https://maps.googleapis.com/maps/api/js?key=AIzaSyCAUo5wLQ1660_fFrymXUmCgPLaTwdXUgY&libraries=drawing,places,geometry,visualization", () => {
            //Google Maps library has been loaded...
            console.log("Google maps library has been loaded");
            sessionStorage.setItem("google", "enabled");
            _base.rootPage = "DriverdashboardPage"
          });
        }
      } else {
        _base.rootPage = "RegistrationPage";
      }
    });
  }

}
