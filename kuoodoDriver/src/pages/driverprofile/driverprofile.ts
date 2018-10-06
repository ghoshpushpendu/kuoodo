import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController,ActionSheetController, Events, IonicPage } from 'ionic-angular';
import { HttpService } from '../../app.httpService';
import { AppService } from '../../app.providers';
import { LocalStorageProvider } from '../../app.localStorage';


@IonicPage()
@Component({
  selector: 'page-driverprofile',
  templateUrl: 'driverprofile.html',
  providers: [HttpService, AppService]
})
export class DriverprofilePage {
  rate: any = 0;

  // objectKeys = Object.keys;
  // value = { option1: '+91', option2: '+93', option3: '+1' };

  imageId: any;
  public userImage = "https://openclipart.org/image/2400px/svg_to_png/190113/1389952697.png";
  lastName: string;
  firstName: string;
  phoneNumber: any;
  location: any;
  email: any;
  username: string;
  id: any;

  public isUsername: boolean = false;
  public isEmail: boolean = false;
  public isLocation: boolean = false;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private localStorageProvider: LocalStorageProvider,
    private httpService: HttpService,
    private appService: AppService,
    public actionSheetCtrl: ActionSheetController,
    public loadingCtrl: LoadingController,
    public events: Events) {

    /*
    Getting id's after registration or login in driver profile page
    */

    this.id = this.localStorageProvider.getDriverId();
    console.log("Getting Id in Profile page :");
    console.log(this.id);

    /*
    Profile information 
    */

    if (this.id) {
      let loader = this.loadingCtrl.create({
        content: 'Fetching profile... '
      });
      loader.present();
      this.appService.getProfile(this.id, (error, data) => {
        loader.dismiss();
        if (error) {
          console.log("Error in fetching profile :", error);
        } else {
          if (data) {
            console.log("Profile information :");
            console.log(data);
            this.isUsername = true;
            this.isEmail = true;
            this.isLocation = true;

            this.username = data.user.firstName + " " + data.user.lastName;
            this.email = data.user.email;
            this.phoneNumber = data.user.phoneNumber;
            this.location = data.user.location;
            this.imageId = data.user.profileImage;
            this.rate = data.user.rating;
            if (this.imageId) {
              this.userImage = "http://mitapi.memeinfotech.com:5040/user/fileShow?imageId=" + this.imageId;
            }
          }
        }
      });
    }
  }

  /*
    Edit profile 
    */

  editProfile() {
    this.isUsername = false;
    this.isEmail = false;
    this.isLocation = false;
  }

  /*
  Submit data after edit profile
  */

  submit() {
    let _base = this;
    if (this.username) {
      this.firstName = this.username.substr(0, this.username.indexOf(' '));
      this.lastName = this.username.substr(this.username.indexOf(' ') + 1);
    }

    if (this.id) {
      var data = {
        _id: this.id,
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
        location: this.location
      }
      this.appService.UpdateUser(data, (error, data) => {
        if (error) {
          console.log("Update user data error :");
          console.log(error);
        }
        else if (data) {
          console.log("Update user data :");
          console.log(data);

          this.username = data.user.firstName + " " + data.user.lastName;
          this.email = data.user.email;
          this.phoneNumber = data.user.phoneNumber;
          this.location = data.user.location;
          this.imageId = data.user.profileImage;
          this.rate = data.user.rating;
          if (this.imageId) {
            this.userImage = "http://mitapi.memeinfotech.com:5040/user/fileShow?imageId=" + this.imageId;
          }
          // this.appService.updateUser(data.user);
          _base.events.publish('data', data.user);
          this.isUsername = true;
          this.isEmail = true;
          this.isLocation = true;
        }
      });
    }
  }

}
