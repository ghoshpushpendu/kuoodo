import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, ActionSheetController, Events, IonicPage } from 'ionic-angular';
import { HttpService } from '../../app.httpService';
import { AppService } from '../../app.providers';
import { LocalStorageProvider } from '../../app.localStorage';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';


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

  public user: any = {
    address: {},
  };

  imageId: any = "";
  public userImage = "https://via.placeholder.com/150?text=Click+To+Choose+Image";
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
    private http: Http,
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
            this.user = data.user;
            this.imageId = data.user.profileImage;
            if (this.imageId) {
              this.userImage = "https://api.kuoodo.com/user/fileShow?imageId=" + this.imageId;
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

    if (this.id) {

      this.user._id = this.id;
      this.appService.UpdateUser(this.user, (error, data) => {
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
            this.userImage = "https://api.kuoodo.com/user/fileShow?imageId=" + this.imageId;
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

  /*
    Vehicle Insurance Upload
  */
  uploadImage(event) {
    let _base = this;

    let fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      let file: File = fileList[0];
      if (file) {
        var reader = new FileReader();
        reader.onload = (event: any) => {
          this.userImage = event.target.result;
        }
        reader.readAsDataURL(event.target.files[0]);
        let formData: FormData = new FormData();
        formData.append('file', file, file.name);

        let headerOptions = new RequestOptions({
          headers: new Headers({
            'Accept': 'application/json'
          }),
        });
        this.http.post(this.httpService.url + "user/fileUpload", formData, headerOptions)
          .map(res => res.json())
          .catch(error => Observable.throw(error))
          .subscribe(
            data => {
              if (data) {
                console.log(data);
                let imageid = data.upload._id;
                _base.user.profileImage = imageid;
                _base.submit();
              }
            },
            error => {
              if (error) {
                alert("Can not upload image");
              }
            })
      }

    }
  }


}
