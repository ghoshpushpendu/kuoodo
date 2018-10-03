import { Component } from '@angular/core';
import { NavController, NavParams, IonicPage } from 'ionic-angular';

/**
 * Generated class for the RegistrationPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({ name: 'RegistrationPage' })
@Component({
  selector: 'page-registration',
  templateUrl: 'registration.html',
})
export class RegistrationPage {
  emailMessage: any = '';
  lastNameMessage: any = '';
  firstNameMessage: any = '';

  email: any;
  firstName: any;
  lastName: any;
  public deviceID: any;

  constructor(private nav: NavController,
    private navCtrl: NavController,
    private navParams: NavParams) {
    this.deviceID = localStorage.getItem("deviceID");
  }

  /*
    Claen message for Email
  */
  emailCleanMessage() {
    if (this.emailMessage.length > 0)
      this.emailMessage = '';
  }

  loginpage() {
    this.nav.push("LoginPage");
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
    Email Validation
  */

  emailValidate() {
    var emailPattern = /^[a-z][a-zA-Z0-9_]*(\.[a-zA-Z][a-zA-Z0-9_]*)?@[a-z][a-zA-Z-0-9]*\.[a-z]+(\.[a-z]+)?$/;
    if (isNaN(this.email)) {
      if (!(this.email.match(emailPattern))) {
        this.emailMessage = "Please enter a valid email";
        return false;
      }
    }
  }

  registrationStepOne() {
    if (this.email == '' || this.email == null) {
      this.emailMessage = "Please enter your email";
    }
    else if (this.firstName == '' || this.firstName == null) {
      this.firstNameMessage = "Please enter your first name";
    } else if (this.lastName == '' || this.lastName == null) {
      this.lastNameMessage = "Please enter your last name";
    } else {
      this.navCtrl.push("SearchlocationPage", {
        email: this.email,
        firstName: this.firstName,
        lastName: this.lastName
      });
    }
  }
}
