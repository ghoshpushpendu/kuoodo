import { Component } from '@angular/core';
import { NavController, IonicPage, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { HttpService } from '../../app.httpService';
import { AppService } from '../../app.providers';
import { LocalStorageProvider } from '../../app.localStorage';
import { get } from 'scriptjs';
import { strings } from './../../lang';


@IonicPage({ name: 'ProfileInfoPage' })
@Component({
  selector: 'page-profile-info',
  templateUrl: 'profile-info.html',
  providers: [AppService, HttpService]
})
export class ProfileInfoPage {
  public string: any = strings;
  passwordMessage: string = '';
  phoneNumberMessage: string = '';
  emailMessage: string = '';
  lastNameMessage: string = '';
  firstNameMessage: string = '';
  password: any;
  provider: any;
  uId: any;
  providers: any;
  facebookId: any;
  id: any;
  loader: any;
  message: any;
  loadingMessage: string;
  email: any;
  lastName: any;
  firstName: any;
  public address: any = "";
  public country: any = "";
  public zipCode: any = "";
  phoneNumber: string;
  countries: any = [];

  public isValid: boolean = true;
  public isLoggedIn: boolean = true;
  public checkPhoneNumber: boolean = true;

  public deviceID: any;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private httpService: HttpService,
    private appService: AppService,
    public toastCtrl: ToastController,
    private localStorageProvider: LocalStorageProvider,
    public loadingCtrl: LoadingController) {

    this.getCountries();
    //getting providers name for facebook and Google
    this.providers = this.navParams.get("providers");
    
    

    //getting local as a provider name for normal registration
    this.provider = this.navParams.get("provider");
    
    


    // //current device ID
    this.deviceID = localStorage.getItem("deviceID");

    if (this.providers == "facebook") {

      this.firstName = this.navParams.get("firstName");
      this.lastName = this.navParams.get("lastName");
      this.email = this.navParams.get("email");
      this.uId = this.navParams.get("uId");

    } if (this.providers == "google") {

      this.firstName = this.navParams.get("firstName");
      this.lastName = this.navParams.get("lastName");
      this.email = this.navParams.get("email");
      this.uId = this.navParams.get("uId");
    }

    if (this.provider == "local") {
      this.phoneNumber = this.navParams.get("phoneNumber");
    }
  }

  // get country data
  getCountries() {
    let _base = this;
    _base.appService.getCountries((error, data) => {
      //Dismiss the loader after getting response from server
      if (data) {
        
        _base.countries = data;
        // 
      }
    });
  }

  ionViewDidLoad() {
    
    if (this.provider == "local") {
      if (this.checkPhoneNumber == true && this.isValid == true) {
        this.phoneNumber = this.phoneNumber;
      }
    }
    if (this.providers == "facebook" || this.providers == "google") {
      this.isValid = true;
      this.checkPhoneNumber = false;
    }
  }

  /*
    Claen message for First Name
  */
  firstNameCleanMessage() {
    if (this.firstNameMessage.length > 0)
      this.firstNameMessage = '';
  }

  /*
    Claen message for Last Name
  */
  lastNameCleanMessage() {
    if (this.lastNameMessage.length > 0)
      this.lastNameMessage = '';
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
    Email Validation
  */

  emailValidate() {
    var emailPattern = /^[a-z][a-zA-Z0-9_]*(\.[a-zA-Z][a-zA-Z0-9_]*)?@[a-z][a-zA-Z-0-9]*\.[a-z]+(\.[a-z]+)?$/;
    if (isNaN(this.email)) {
      if (!(this.email.match(emailPattern))) {
        this.emailMessage = this.string.validEmail;
        
        return false;
      }
      else {
        this.emailMessage = '';
        
      }
    }
  }

  /*
    Registration
  */
  registration() {
    if (this.provider == "local") {
      if (this.firstName == '' || this.firstName == null) {
        this.firstNameMessage = this.string.enterFName;
      }
      else if (this.lastName == '' || this.lastName == null) {
        this.lastNameMessage = this.string.enterLName;
      } else if (this.email == '' || this.email == null) {
        this.emailMessage = this.string.enterEmail;
      }
      else if (this.password == '' || this.password == null) {
        this.passwordMessage = this.string.enterPassword;
      } else {

        //Loading message
        this.loadingMessage = this.string.pleaseWait;
        this.loading();
        this.loader.present();

        var data = {
          firstName: this.firstName,
          lastName: this.lastName,
          phoneNumber: this.phoneNumber,
          email: this.email,
          password: this.password,
          providers: "local",
          role: "User",
          address: {
            address: this.address.address,
            country: this.address.country,
            zipCode: this.address.zipCode
          },
          deviceId: this.deviceID
        }
        this.appService.userRegistration(data, (error, data) => {
          

          //Dismiss the loader
          this.loader.dismiss();

          if (error) {
            this.message = data.message;
            this.showToast('top');
          }
          else {
            if (!data.error) {
              this.localStorageProvider.profileInformation(data.user._id);
              get("https://maps.googleapis.com/maps/api/js?key=AIzaSyCAUo5wLQ1660_fFrymXUmCgPLaTwdXUgY&libraries=drawing,places,geometry,visualization", () => {
                //Google Maps library has been loaded...
                
                sessionStorage.setItem("google", "enabled");
                this.navCtrl.setRoot("FindcarPage");
              });
            }
          }
        });
      }
    } else if (this.providers == "facebook") {
      if (this.firstName == '' || this.firstName == null) {
        this.firstNameMessage = this.string.enterFName;
      }
      else if (this.lastName == '' || this.lastName == null) {
        this.lastNameMessage = this.string.enterLName;
      } else if (this.email == '' || this.email == null) {
        this.emailMessage = this.string.enterEmail;
      }
      else if (this.password == '' || this.password == null) {
        this.passwordMessage = this.string.enterPassword;
      } else {

        var value = {
          phoneNumber: this.appService.countryCode + this.phoneNumber
        }

        if (this.password.length >= 8) {

          //Loading message
          this.loadingMessage = this.string.pleaseWait;
          this.loading();
          this.loader.present();

          this.appService.verifyUserAndSendOtp(value, (error, data) => {

            //Dismiss the loader
            this.loader.dismiss();

            

            if (error) {
              if (data.error == true) {
                this.message = data.message;
                this.showToast('top');
              }
            }
            else {
              if (!data.error) {
                this.id = data.otpDetails._id
                if (this.id) {
                  this.navCtrl.setRoot("OtpPage", {
                    firstName: this.firstName,
                    lastName: this.lastName,
                    email: this.email,
                    uId: this.uId,
                    phoneNumber: this.appService.countryCode + this.phoneNumber,
                    password: this.password,
                    address: {
                      address: this.address.address,
                      country: this.address.country,
                      zipCode: this.address.zipCode
                    },
                    otp: data.otpDetails.otp,
                    providers: "facebook"
                  })
                }
              }
            }
          });
        }
        else if (this.password.length < 8) {
          this.message = "Password should contain 8 digit..";
          this.showToast('top');
        }
      }
    } else if (this.providers == "google") {
      if (this.firstName == '' || this.firstName == null) {
        this.firstNameMessage = this.string.enterFName;
      }
      else if (this.lastName == '' || this.lastName == null) {
        this.lastNameMessage = this.string.enterLName;
      } else if (this.email == '' || this.email == null) {
        this.emailMessage = this.string.enterEmail;
      }
      else if (this.password == '' || this.password == null) {
        this.passwordMessage = this.string.enterPassword;
      } else {

        var value = {
          phoneNumber: this.appService.countryCode + this.phoneNumber
        }

        if (this.password.length >= 8) {

          //Loading message
          this.loadingMessage = this.string.pleaseWait;
          this.loading();
          this.loader.present();


          this.appService.verifyUserAndSendOtp(value, (error, data) => {

            //Dismiss the loader
            this.loader.dismiss();

            

            if (error) {
              if (data.error == true) {
                this.message = data.message;
                this.showToast('top');
              }
            }
            else {
              if (!data.error) {
                
                
                this.id = data.otpDetails._id
                
                if (this.id) {
                  this.navCtrl.setRoot("OtpPage", {
                    firstName: this.firstName,
                    lastName: this.lastName,
                    email: this.email,
                    uId: this.uId,
                    address: {
                      address: this.address.address,
                      country: this.address.country,
                      zipCode: this.address.zipCode
                    },
                    phoneNumber: this.appService.countryCode + this.phoneNumber,
                    password: this.password,
                    otp: data.otpDetails.otp,
                    providers: "google"
                  })
                }
              }
            }
          });
        }
        else if (this.password.length < 8) {
          this.message = this.string.passwordLength;
          this.showToast('top');
        }
      }
    }
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
