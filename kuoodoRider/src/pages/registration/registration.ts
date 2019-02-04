import { Component } from '@angular/core';
import { NavController, MenuController, NavParams, ToastController, LoadingController, IonicPage } from 'ionic-angular';
import { HttpService } from '../../app.httpService';
import { AppService } from '../../app.providers';
import { LocalStorageProvider } from '../../app.localStorage';
import { get } from 'scriptjs';



@IonicPage({ name: 'RegistrationPage' })
@Component({
  selector: 'page-registration',
  templateUrl: 'registration.html',
  providers: [AppService, HttpService]
})
export class RegistrationPage {

  googleId: any;
  facebookId: any;
  isLoginFb: any;
  loginId: any;
  password: any;
  isUserRegistered: any;
  passwordMessage: string = '';
  phoneNumberMessage: string = '';
  userId: any;
  countries: any = [];
  country: string = "1";

  loader: any;



  // device ID
  public deviceID;


  //Loading messages showing variables
  loadingMessage: any;

  //Showing error messages variables
  message: any = '';

  id: any;
  phoneNumber: any;

  public isPassword: boolean = true;

  constructor(public nav: NavController,
    public navCtrl: NavController,
    public navParams: NavParams,
    private httpService: HttpService,
    private appService: AppService,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    public menuController: MenuController,
    private localStorageProvider: LocalStorageProvider) {


    this.userId = this.localStorageProvider.getUserId();
    this.deviceID = localStorage.getItem("deviceID");

    this.menuController.swipeEnable(false);



  }

  ionViewDidLoad() {
  }

  /*
  Clean phone number message
  */

  cleanPhoneNumberMessage() {
    if (this.phoneNumberMessage.length > 0)
      this.phoneNumberMessage = '';
  }

  /*
  Clean password message
  */

  cleanPasswordMessage() {
    if (this.passwordMessage.length > 0)
      this.passwordMessage = '';
  }

  /*
    Registration with Phone number
    Login with phone number and password
    params : Phone Number 
  */
  registrationAndLogin() {
    if (this.phoneNumber == '' || this.phoneNumber == null) {
      this.message = "Number can not be empty";
      this.showToast('abc');
    } else if (!this.isPassword) {
      let sign = "+";
      var value = {
        phoneNumber: this.appService.countryCode + this.phoneNumber,
        password: this.password,
        role: "User",
        deviceId: this.deviceID
      }
      this.authenticateUser(value);
    }

    /** initially - when the password field is hidden **/
    /**
     * isPassword:boolean 
     * if true , password field hidden
     * else password field available
     * 
     * **/
    else if (this.isPassword == true) {
      this.checkPhoneNumber(this.phoneNumber);
    }
  }

  // initially check phone number , when password is not enabled
  checkPhoneNumber(phone: string) {
    let _base = this;
    let sign = "+";
    var data = {
      phoneNumber: _base.appService.countryCode + phone
    }

    //Loading message
    this.loadingMessage = "Please wait..";
    this.loading();
    this.loader.present();

    this.appService.verifyUserAndSendOtp(data, (error, data) => {
      //Dismiss the loader
      this.loader.dismiss();

      if (error) {
        this.isPassword = false;
      }
      else {
        if (!data.error) {
          this.id = data.otpDetails._id;
          if (this.id) {
            this.navCtrl.push("OtpPage", {
              id: data.otpDetails._id,
              phoneNumber: _base.appService.countryCode + phone,
              otp: data.otpDetails.otp,
              provider: "local"
            });
          }
        }
      }
    });
  }


  // authenticate user
  authenticateUser(authData: any) {
    var value = authData;

    //Loading message
    this.loadingMessage = "please wait..";
    this.loading();
    this.loader.present();

    this.appService.userLogin(value, (error, data) => {
      //Dismiss the loader after getting response from server
      this.loader.dismiss();
      if (error) {
        this.message = "Wrong Credentials.."
        this.showToast('bottom');
      }
      else if (data) {
        let _base = this;

        console.log("login data",data.user)

        if (data.user._id == undefined || data.user._id == null) {
          _base.navCtrl.setRoot("RegistrationPage");
          return;
        }
        this.localStorageProvider.profileInformation(data.user._id);
        get("https://maps.googleapis.com/maps/api/js?key=AIzaSyCAUo5wLQ1660_fFrymXUmCgPLaTwdXUgY&libraries=drawing,places,geometry,visualization", () => {
          //Google Maps library has been loaded...
          console.log("Google maps library has been loaded");
          sessionStorage.setItem("google", "enabled");
          _base.navCtrl.setRoot("FindcarPage", {
            loginId: data.user._id
          });
        });
      }
    });
  }

  //OTPScreen
  otpscreen() {
    this.navCtrl.push("OtpscreenPage");
  }

  /*
    Facebook login
  */
  FBLogin() {
  }

  /*
    Google login
  */
  GLogin() {
    let _base = this;
  }
  /*
    Display message
  */
  showToast(position: string) {
    let toast = this.toastCtrl.create({
      message: this.message,
      duration: 1000,
      position: 'bottom'
    });

    toast.present(toast);
  }

  /*
    Loader message
  */
  loading() {
    this.loader = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: this.loadingMessage
    });

    this.loader.present();
  }
}
