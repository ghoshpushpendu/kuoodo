import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController } from 'ionic-angular';
import { HttpService } from '../../app.httpService';
import { strings } from './../../lang';


@IonicPage({ name: 'ResetpasswordPage' })
@Component({
  selector: 'page-resetpassword',
  templateUrl: 'resetpassword.html',
})
export class ResetpasswordPage {
  public confirmPassword: string = '';
  public password: string = '';
  public phoneNumber: any;
  public message: any;
  public loader: any;
  public string: any = strings;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public api: HttpService,
    public toastCtrl: ToastController, public loadingCtrl: LoadingController) {
    // GET PHONENUMBER FROM URL PARAM
    this.phoneNumber = navParams.get('phoneNumber');
    console.log(this.phoneNumber.phone);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ResetpasswordPage');
  }

  // RESET PASSWORD FUNCTION
  resetPassword() {
    let _base = this;
    if (this.confirmPassword == this.password) {
      _base.loading();
      this.api.resetFPassword(this.phoneNumber.phone, this.password).subscribe(data => {
        console.log(data);
        _base.loader.dismiss();
        if (data.error == false) {
          console.log("After reset password :");
          let toast = this.toastCtrl.create({
            message: this.string.passwordSuccess,
            duration: 3000,
            position: 'top'
          });
          toast.present(toast);
          console.log(data);
          this.navCtrl.setRoot("RegistrationPage");
        } else {
          let toast = this.toastCtrl.create({
            message: this.string.passwordMismatch,
            duration: 3000,
            position: 'top'
          });
          toast.present(toast);
        }
      });
    }
    else {
      let toast = this.toastCtrl.create({
        message: this.string.passwordMismatch,
        duration: 3000,
        position: 'top'
      });
      toast.present(toast);
    }
  }

  /*
Loader message
*/
  loading() {
    this.loader = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: this.string.pleasewait
    });

    this.loader.present();
  }

}
