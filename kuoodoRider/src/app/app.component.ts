import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, ToastController, AlertController, LoadingController, Select } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { LocalStorageProvider } from '../app.localStorage';
import { AppService } from '../app.providers';
import { HttpService } from '../app.httpService';
import { Device } from '@ionic-native/device';
import { Network } from '@ionic-native/network';
import { MenuController } from 'ionic-angular';
import { get } from 'scriptjs';
import { stringify } from '@angular/core/src/util';
import { strings } from './../lang';

declare var navigator;
declare var google;

@Component({
  templateUrl: 'app.html',
  providers: [AppService, HttpService]
})

export class MyApp {
  public string: any = strings;

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


  rootPage: any;

  pages: Array<{ title: string, component: any, icon: any }>;

  public userImage = "https://www.classifapp.com/wp-content/uploads/2017/09/avatar-placeholder.png";
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
    public network: Network,
    public menuCtrl: MenuController,
    private alertCtrl: AlertController
  ) {


    localStorage.setItem('language', 'english')


    let internet;
    let _base = this;



    //check internet connection
    this.checkInternet();

    this.gettingdeviceId();

    /** get data on user changed **/
    this.appService.userInfo.subscribe(data => {
      if (data) {
        _base.userName = data.firstName + " " + data.lastName;
        if (data.profileImage) {
          _base.userImage = "http://ec2-52-8-64-114.us-west-1.compute.amazonaws.com:5040/user/fileShow?imageId=" + data.profileImage;
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

    console.log("user id", this.userId);
    if (this.userId) {
      console.log("Here");
      // _base.rootPage = "FindcarPage";
      if (sessionStorage.getItem("google") == "enabled") {
        _base.rootPage = "FindcarPage"
      } else {
        console.log("Here also");
        get("https://maps.googleapis.com/maps/api/js?key=AIzaSyCAUo5wLQ1660_fFrymXUmCgPLaTwdXUgY&libraries=drawing,places,geometry,visualization", () => {
          //Google Maps library has been loaded...
          console.log("Google maps library has been loaded");
          sessionStorage.setItem("google", "enabled");
          _base.rootPage = "FindcarPage"
        });
      }

    } else {
      _base.rootPage = "RegistrationPage";
    }


    // used for an example of ngFor and navigation
    this.pages = [
      // { title: _base.string.profile, component: "ProfilePage" },
      { title: _base.string.tripHistory, component: "TriphistoryPage", icon: 'fa fa-clock-o' },
      { title: _base.string.payments, component: "PaymentsPage", icon: "fa fa-credit-card" },
    ];

    if (document.URL.includes('https://') || document.URL.includes('http://')) {
      this.base = "http://127.0.0.1:3001/";
    }
    else {
      this.base = 'https://api.kuoodo.com/';
    }

  }

  chooseLanguage() {
    let _base = this;
    console.log(localStorage.getItem("language"))
    console.log((localStorage.getItem("language").toString() == 'english') ? true : false);
    let prompt = this.alertCtrl.create({
      title: 'Language',
      message: 'Select a language to continue.',
      inputs: [
        {
          type: 'radio',
          label: 'English',
          value: 'english',
          checked: (localStorage.getItem("language") == 'english') ? true : false
        },
        {
          type: 'radio',
          label: 'Español',
          value: 'spanish',
          checked: (localStorage.getItem("language") == 'spanish') ? true : false
        },
        {
          type: 'radio',
          label: '中文',
          value: 'chineese',
          checked: (localStorage.getItem("language") == 'chineese') ? true : false
        }
      ],
      buttons: [
        // {
        //   text: "Cancel",
        //   handler: data => {
        //     console.log("cancel clicked");
        //   }
        // },
        {
          text: "Continue",
          handler: data => {
            localStorage.removeItem("language");
            console.log("search clicked", data);
            localStorage.setItem("language", data);
            strings.setLanguage(data);
            console.log(_base.pages);
            _base.pages = [
              { title: _base.string.tripHistory, component: "TriphistoryPage", icon: 'fa fa-clock-o' },
              { title: _base.string.payments, component: "PaymentsPage", icon: "fa fa-credit-card" },
            ];
          }
        }]
    });
    prompt.present();
  }

  ngOnInit() {
    let _base = this;
    _base.rootPage = "RegistrationPage";
    console.log("language set", this.string);
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      let language = this.platform.lang();
      console.log("Mobile language is set to : ", language);
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.push(page.component);
  }

  logout() {
    // localStorage.removeItem("loginId");
    localStorage.removeItem("userId")
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
      if (loading != undefined) {
        loading.dismiss();
      }
      this.rootPage = "NointernetPage";
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
      if (this.userId) {
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
        this.rootPage = "RegistrationPage";
      }
    });
  }

  showprofile() {
    this.menuCtrl.close();
    this.nav.push("ProfilePage");
  }

}
