import { Component } from '@angular/core';
import { NavController, Events, IonicPage, NavParams, ToastController, LoadingController } from 'ionic-angular';
import { AppService } from '../../app.providers';
import { HttpService } from '../../app.httpService';
import { LocalStorageProvider } from '../../app.localStorage';
import { AlertController } from 'ionic-angular';
import { get } from 'scriptjs';

@IonicPage({ name: 'OtpPage' })
@Component({
  selector: 'page-otp',
  templateUrl: 'otp.html',
  providers: [AppService, HttpService]
})
export class OtpPage {
  Otp: any;
  OTPmessage: string = '';
  password: any;
  idThree: any;
  idTwo: any;
  uId: any;
  email: any;
  lastName: any;
  firstName: any;
  providers: any;
  provider: any;
  loader: any;
  loadingMessage: any;
  id: any;
  otp: any;
  phoneNumber: any;
  message: any = '';
  idOne: any;
  public otpVerified: boolean = false;
  public deviceID: any;
  car: any;
  location: any;
  constructor(public nav: NavController,
    public navCtrl: NavController,
    public navParams: NavParams,
    private httpService: HttpService,
    private appService: AppService,
    public toastCtrl: ToastController,
    private localStorageProvider: LocalStorageProvider,
    public loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    public events: Events) {
    this.deviceID = localStorage.getItem("deviceID");
    this.phoneNumber = this.navParams.get("phoneNumber");
    this.firstName = this.navParams.get("firstName");
    this.lastName = this.navParams.get("lastName");
    this.location = this.navParams.get("location");
    this.password = this.navParams.get("password");
    this.car = this.navParams.get("car");
    this.email = this.navParams.get("email");
    console.log(this.deviceID, this.phoneNumber, this.firstName, this.lastName, this.location, this.password, this.car);
  }

  cleanMessage() {
    if (this.OTPmessage.length > 0)
      this.OTPmessage = '';
  }

  /*
    Verify OTP
  */
  verifyOTP() {
    if (this.otp == '' || this.otp == null) {
      this.OTPmessage = "OTP can not be empty";
    } else {
      //Loading message
      this.loadingMessage = "OTP verification..";
      this.loading();
      this.loader.present();
      var data = {
        phoneNumber: this.phoneNumber,
        code: parseInt(this.otp)
      }
      this.appService.verifyOtp(data, (error, data) => {

        if (error) {
          this.loader.dismiss();
          console.log(error);
          if (data.error == true) {
            this.message = data.message;
            this.showToast('bottom');
          }
        }
        else {
          if (!data.error) {
            this.loader.dismiss();
            console.log("Otp varified details");
            console.log(data);
            if (data.error == false) {
              this.otpVerified = true;
              this.message = data.message;
              this.showToast('bottom');

              // prepare registration data

              data = {
                email: this.email,
                firstName: this.firstName,
                lastName: this.lastName,
                phoneNumber: this.phoneNumber,
                password: this.password,
                location: this.location,
                role: "Driver",
                carName: this.car.carName,
                carNumber: this.car.carNumber,
                carType: this.car.carType
              }

              console.log(data);


              this.appService.userRegistration(data, (error, data) => {
                //Dismiss the loader
                if (error) {
                  this.loader.dismiss();
                  this.message = data.message;
                  this.showToast('top');
                }
                else {
                  if (!data.error) {

                    // register car against the driver
                    this.events.publish('data', data.user);
                    this.localStorageProvider.setDriverId(data.user._id);
                    this.id = data.user._id;
                    this.loader.dismiss();
                    this.message = "Car has been added to your profile";
                    this.showToast('bottom');
                    let _base = this;
                    get("https://maps.googleapis.com/maps/api/js?key=AIzaSyCAUo5wLQ1660_fFrymXUmCgPLaTwdXUgY&libraries=drawing,places,geometry,visualization", () => {
                      //Google Maps library has been loaded...
                      console.log("Google maps library has been loaded");
                      sessionStorage.setItem("google", "enabled");
                      _base.navCtrl.setRoot("DriverdashboardPage");
                    });
                  } else {
                    this.loader.dismiss();
                  }
                }
              });

            }
          }
        }
      });
    }
  }

  /*
    Resend OTP
  */
  resendOTP() {
    if (this.otpVerified == false) {

      //Loading message
      this.loadingMessage = "Resend OTP..";
      this.loading();
      this.loader.present();

      var data = {
        phoneNumber: this.phoneNumber
      }
      this.appService.verifyUserAndSendOtp(data, (error, data) => {

        //Dismiss the loader
        this.loader.dismiss();

        if (error) {
          console.log(data);
          // this.message = data.message;          
        }
        else {
          if (!data.error) {
            console.log("Resend OTP");
            console.log(data);
            if (data.error == false) {
              this.message = data.message;
              this.showToast('bottom');
            }
          }
        }
      }); top
    }
    else {
      this.message = "OTP verification completed";
      this.showToast('bottom');
    }
  }

  /*
   Display message
 */
  showToast(position: string) {
    let toast = this.toastCtrl.create({
      message: this.message,
      duration: 3000,
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
  }
}


