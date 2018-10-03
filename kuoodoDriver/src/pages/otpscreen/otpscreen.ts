import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController } from 'ionic-angular';
import { HttpService } from '../../app.httpService';
import { AppService } from '../../app.providers';

@IonicPage({ name: 'OtpscreenPage' })
@Component({
  selector: 'page-otpscreen',
  templateUrl: 'otpscreen.html',
})
export class OtpscreenPage {
  public isPhoneNumber: boolean = true;
  public isCode: boolean = false;

  public phone: string = "";
  public code: string = "";
  public otpmessage: string;
  public loader: any;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public api: HttpService,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    public app: AppService) {

  }

  ionViewDidLoad() {
  }

  sendOTP() {
    let number = {
      phone: this.app.countryCode + this.phone
    }
    let _base = this;
    this.loading();
    this.api.sendFOTP(number).subscribe(data => {
      this.isPhoneNumber = false;
      this.isCode = true;
      _base.loader.dismiss();
    },
      error => {
        console.log(error);
        if (error.error == true) {
          let toast = this.toastCtrl.create({
            message: error.message,
            duration: 3000,
            position: 'bottom'
          });
          toast.present(toast);
          _base.loader.dismiss();
        }
      });
  }

  verifyOTP() {
    if (this.code) {
      let number = {
        phone: this.app.countryCode + this.phone
      }
      let _base = this;
      this.loading();
      this.api.verifyFOTP(number, parseInt(this.code)).subscribe(result => {
        console.log('verify otp result', result)
        _base.loader.dismiss();
        if (result.error == false) {
          this.navCtrl.push("ResetpasswordPage", {
            phoneNumber: number
          });
        }
        else {
          let toast = this.toastCtrl.create({
            message: "Error verifying",
            duration: 3000,
            position: 'bottom'
          });
          toast.present(toast);
        }
      }, error => {
        _base.loader.dismiss();
        let toast = _base.toastCtrl.create({
          message: "Invalid OTP",
          duration: 3000,
          position: 'bottom'
        });
        toast.present(toast);
      });
    }
  }

  /*
  Loader message
*/
  loading() {
    this.loader = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: 'loading...'
    });

    this.loader.present();
  }
}
