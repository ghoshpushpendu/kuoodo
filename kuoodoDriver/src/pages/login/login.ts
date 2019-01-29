import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, LoadingController, Events, IonicPage } from 'ionic-angular';
import { AppService } from '../../app.providers';
import { HttpService } from '../../app.httpService';
import { LocalStorageProvider } from '../../app.localStorage';
import { get } from 'scriptjs';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
  providers: [AppService, HttpService]
})
export class LoginPage {
  id: any;
  loader: any;
  message: any;
  loadingMessage: any;
  passwordMessage: any = '';
  phoneNumberMessage: any = '';
  password: any;
  phoneNumber: any;
  countrycode: any = "+1";

  constructor(private nav: NavController,
    public navCtrl: NavController,
    public navParams: NavParams,
    private httpService: HttpService,
    private appService: AppService,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    private localStorageProvider: LocalStorageProvider,
    public events: Events) {
  }

  /*
   Claen message for Phone number
 */
  phoneNumberCleanMessage() {
    if (this.phoneNumberMessage.length > 0)
      this.phoneNumberMessage = '';
  }

  /*
    Claen message for Password
  */
  passwordCleanMessage() {
    if (this.passwordMessage.length > 0)
      this.passwordMessage = '';
  }

  /*
  Login
*/
  login() {
    let _base = this;
    if (this.phoneNumber == '' || this.phoneNumber == null) {
      this.phoneNumberMessage = "Please enter your phone number";
    }
    else if (this.password == '' || this.password == null) {
      this.passwordMessage = "Please enter your password";
    }
    else {
      var data = {
        phoneNumber: this.appService.countryCode + this.phoneNumber,
        password: this.password,
        role: "Driver"
      }
      //Loading message
      this.loadingMessage = "Login..";
      this.loading();
      this.loader.present();

      this.appService.login(data, (error, data) => {

        //Dismiss the loader
        this.loader.dismiss();

        console.log(data);

        if (error) {
          this.message = data.message;
          this.showToast('top');
        }
        else {
          if (data) {
            _base.events.publish('data', data.user);
            this.localStorageProvider.setDriverId(data.user._id);
            this.id = data.user._id;
            if (this.id) {
              get("https://maps.googleapis.com/maps/api/js?key=AIzaSyCAUo5wLQ1660_fFrymXUmCgPLaTwdXUgY&libraries=drawing,places,geometry,visualization", () => {
                //Google Maps library has been loaded...
                console.log("Google maps library has been loaded");
                sessionStorage.setItem("google", "enabled");
                _base.navCtrl.setRoot("DriverdashboardPage");
              });
            }
          }
        }
      });
    }
  }

  registerpage() {
    this.navCtrl.push("RegistrationPage");
  }

  forgotpassword() {
    this.navCtrl.push("OtpscreenPage");
  }

  /*
    Loader message
  */
  loading() {
    this.loader = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: this.loadingMessage
    });
  }

  /*
    Display message
  */
  showToast(position: string) {
    let toast = this.toastCtrl.create({
      message: this.message,
      duration: 3000,
      position: 'top'
    });
    toast.present(toast);
  }
}

