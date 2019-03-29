import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, ToastController, Events, IonicPage } from 'ionic-angular';
import { AppService } from '../../app.providers';
import { HttpService } from '../../app.httpService';
import { LocalStorageProvider } from '../../app.localStorage';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { get } from 'scriptjs';

@IonicPage()
@Component({
  selector: 'page-searchlocation',
  templateUrl: 'searchlocation.html',
  providers: [AppService, HttpService]
})
export class SearchlocationPage {
  loadingMessage: any;
  loader: any;
  passwordVerifiedMessage: string;
  id: any;
  message: any;
  locationMessage: string = '';
  address: any = {

  };
  confirmPasswordMessage: string = '';
  confirmPassword: any;
  passwordMessage: string = '';
  password: any;
  phoneNumberMessage: string = '';
  phoneNumber: any;
  lastName: any;
  firstName: any;
  email: any;
  option: any = "+1";

  public car: any = {
    'carType': 'Economy',
    'carNumber': '',
    'carName': '',
    'userId': ''
  };


  public carTypes: any;

  constructor(public nav: NavController,
    public navCtrl: NavController,
    public navParams: NavParams,
    private httpService: HttpService,
    private appService: AppService,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    private localStorageProvider: LocalStorageProvider,
    public http: Http,
    public events: Events) {

    console.log("Nav Params", this.navParams);

    this.email = this.navParams.get("email");
    this.firstName = this.navParams.get("firstName");
    this.lastName = this.navParams.get("lastName");

    this.fetchCarTypes();

  }

  /*
    Clean message for Phone number
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
     Claen message for Confirm password
   */
  confirmPasswordCleanMessage() {
    if (this.confirmPasswordMessage.length > 0)
      this.confirmPasswordMessage = '';
  }

  /*
    Claen message for Location
  */
  locationCleanMessage() {
    if (this.locationMessage.length > 0)
      this.locationMessage = '';
  }

  /*
    Password Validation
  */
  passwordValidation() {

    if (this.password == this.confirmPassword) {
      this.confirmPasswordMessage = "";
    }
    else if (this.password != this.confirmPassword) {
      this.confirmPasswordMessage = " wrong Password";
    }
  }

  /*
  Registration
*/
  completeRegistration() {

    let _base = this;
    /** driver car info validation **/
    if (this.car.carName.trim() == '') {
      alert('car name can not be empty');
      return;  // code stops execution here
    }

    if (this.car.carNumber.trim() == '') {
      alert('car number can not be empty');
      return; // stops code execution
    }

    if (this.phoneNumber == '' || this.phoneNumber == null) {
      this.phoneNumberMessage = "Please enter your phone number";
    }
    else if (this.password == '' || this.password == null) {
      this.passwordMessage = "Please enter your password";
    } else if (this.confirmPassword == '' || this.confirmPassword == null) {
      this.confirmPasswordMessage = "Please Re-enter your Password";
    }
    else if (this.address.address == '' || this.address.address == null) {
      this.locationMessage = "Please enter your location";
    } else {

      var data = {
        email: this.email,
        firstName: this.firstName,
        lastName: this.lastName,
        phoneNumber: this.appService.countryCode + this.phoneNumber,
        password: this.password,
        address: this.address,
        role: "Driver"
      }
      if (this.password == this.confirmPassword) {

        this.navCtrl.setRoot("DocumentsPage", {
          email: this.email,
          firstName: this.firstName,
          lastName: this.lastName,
          phoneNumber: this.appService.countryCode + this.phoneNumber,
          address: this.address,
          password: this.password,
          car: this.car
        });

      } else {
        this.message = "Please enter the confirm correct password.";
        this.showToast('top');
      }
    }
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

  // fetch car types
  fetchCarTypes() {
    this.loadingMessage = "Fetching car types..";
    this.loading();
    this.loader.present();
    let _base = this;
    this.appService.getCabTypes((error, data) => {
      //Dismiss the loader
      this.loader.dismiss();
      if (error) {
        console.log("Error", error);
      }
      else {
        if (!data.error) {
          console.log("Success", data);
          _base.carTypes = data.results;
        }
      }
    });
  }


}
