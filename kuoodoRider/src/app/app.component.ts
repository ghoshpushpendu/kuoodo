import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, ToastController, LoadingController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { LocalStorageProvider } from '../app.localStorage';
import { AppService } from '../app.providers';
import { HttpService } from '../app.httpService';
import { Device } from '@ionic-native/device';
import { Network } from '@ionic-native/network';

declare var navigator;
declare var google;

@Component({
  templateUrl: 'app.html',
  providers: [AppService, HttpService]
})

export class MyApp {
  gId: string;
  fbId: string;
  loginId: string;
  googleId: any;
  facebookId: any;
  gUid: string;
  fbUid: string;
  userId: any;
  online: boolean;
  message: any;
  base: string;
  paymentInfo: any;

  @ViewChild(Nav) nav: Nav;


  rootPage: any = "RegistrationPage";

  pages: Array<{ title: string, component: any }>;

  public userImage = "https://openclipart.org/image/2400px/svg_to_png/190113/1389952697.png";
  public userName = "";
  public deviceRegId: any;
  public bookingDetails: any;
  constructor(public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    public toastCtrl: ToastController,
    private localStorageProvider: LocalStorageProvider,
    private httpService: HttpService,
    private appService: AppService,
    private device: Device,
    public loadingCtrl: LoadingController,
    public network: Network
  ) {

    let _base = this;

    //check internet connection
    this.checkInternet();

    this.gettingdeviceId();

    /** get data on user changed **/
    this.appService.userInfo.subscribe(data => {
      if (data) {
        _base.userName = data.firstName + " " + data.lastName;
        if (data.profileImage) {
          _base.userImage = "http://mitapi.memeinfotech.com:5040/user/fileShow?imageId=" + data.profileImage;
        }
      }
    });

    this.appService.bookingInfo
      .subscribe(function (success) {
        if (success) {
          console.log("driver detailas from shared service :", success)
          _base.bookingDetails = success;
          console.log(_base.bookingDetails);
        }
      }, function (error) {

      });



    // rating status
    _base.appService.ratingStatus
      .subscribe(function (data) {
        if (data) {
          let length = Object.keys(data).length;
          if (length != 0) {
            if (data.status == 'success') {
              _base.nav.setRoot("FindcarPage");
            }
          }
        }
      }, function (error) {
        console.log('Error getting rating status', error);
      });

    this.initializeApp();

    this.userId = this.localStorageProvider.getUserId();

    if (this.userId) {
      // _base.rootPage = "FindcarPage";
      _base.rootPage = "PaymentPage"
    }


    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Profile', component: "ProfilePage" },
      { title: 'Trip History', component: "TriphistoryPage" },
      { title: 'Payments', component: "PaymentsPage" },
    ];

    if (document.URL.includes('https://') || document.URL.includes('http://')) {
      this.base = "http://127.0.0.1:3001/";
    }
    else {
      this.base = 'http://mitapi.memeinfotech.com:5040/';
    }

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
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
    this.nav.setRoot("RegistrationPage");
  }

  //Getting  Device Id
  gettingdeviceId() {
    let _base = this;
    if (_base.device.uuid) {
      console.log('Device UUID is: ' + _base.device.uuid);
      localStorage.setItem("deviceID", _base.device.uuid);
    }
    else {
      _base.platform.exitApp();
    }
  }

  /*
    Display message
  */
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
