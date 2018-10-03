import { Component } from '@angular/core';
import { NavController,IonicPage, NavParams, ToastController, LoadingController } from 'ionic-angular';
import { AppService } from '../../app.providers';
import { HttpService } from '../../app.httpService';
import { LocalStorageProvider } from '../../app.localStorage';
import { AlertController } from 'ionic-angular';

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
  constructor(public nav: NavController,
    public navCtrl: NavController,
    public navParams: NavParams,
    private httpService: HttpService,
    private appService: AppService,
    public toastCtrl: ToastController,
    private localStorageProvider: LocalStorageProvider,
    public loadingCtrl: LoadingController,
    private alertCtrl: AlertController) {
    this.deviceID = localStorage.getItem("deviceID");
    this.provider = this.navParams.get("provider");
    this.providers = this.navParams.get("providers");
    this.idOne = this.navParams.get("id");
    this.phoneNumber = this.navParams.get("phoneNumber");
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

        //Dismiss the loader
        this.loader.dismiss();

        if (error) {
          console.log(error);
          if (data.error == true) {
            this.message = data.message;
            this.showToast('bottom');
          }
        }
        else {
          if (!data.error) {
            console.log("Otp varified details");
            console.log(data);
            if (data.error == false) {
              this.otpVerified = true;
              this.message = data.message;
              this.showToast('bottom');
              this.navCtrl.setRoot('ProfileInfoPage', {
                phoneNumber: this.phoneNumber,
                provider: "local"
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
      });
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


