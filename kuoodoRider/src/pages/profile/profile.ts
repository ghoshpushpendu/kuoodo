import { Component } from '@angular/core';
import { NavController, IonicPage, NavParams, ActionSheetController, LoadingController, Loading } from 'ionic-angular';
import { LocalStorageProvider } from '../../app.localStorage';
import { AppService } from '../../app.providers';
import { HttpService } from '../../app.httpService';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { strings } from './../../lang';

@IonicPage({ name: 'ProfilePage' })
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
  providers: [HttpService, AppService]
})
export class ProfilePage {
  imageId: any;
  image: void;
  fileInfo: any;
  url: any;
  lastName: any;
  firstName: any;
  userID: any;

  phoneNumber: any;
  email: any;
  username: any;

  LoginId: any;
  gId: any;
  fbId: any;
  id: any;
  public string: any = strings;

  public isUsername: boolean = false;
  public isEmail: boolean = false;

  public userImage = "https://openclipart.org/image/2400px/svg_to_png/190113/1389952697.png";

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private localStorageProvider: LocalStorageProvider,
    private httpService: HttpService,
    private appService: AppService,
    public actionSheetCtrl: ActionSheetController,
    private http: Http,
    public loader: LoadingController) {

    /*
  getting id's after completing registration
  */

    this.id = this.localStorageProvider.getUserId();


    /*
    Profile information 
    */

    if (this.id) {
      let loading = this.loader.create({
        content: this.string.fetchingProfile + " ..."
      });
      loading.present();
      this.appService.getProfile(this.id, (error, data) => {
        loading.dismiss()
        if (error) {
          console.log("Error in fetching profile :", error);
        } else {
          if (data) {
            console.log("Profile information :");
            console.log(data);
            this.isUsername = true;
            this.isEmail = true;

            this.username = data.user.firstName + " " + data.user.lastName;
            this.email = data.user.email;
            this.phoneNumber = data.user.phoneNumber;
            this.imageId = data.user.profileImage;
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
  }

  /*
  Submit data after edit profile
  */

  submit() {
    if (this.username) {
      this.firstName = this.username.substr(0, this.username.indexOf(' '));
      this.lastName = this.username.substr(this.username.indexOf(' ') + 1);
      if (this.firstName.trim().length == 0) {
        this.firstName = this.lastName;
        this.lastName = "";
      }
    }

    if (this.id) {
      var data = {
        _id: this.id,
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email
      }
      this.appService.UpdateUser(data, (error, data) => {
        if (error) {
          console.log("Update user data error :");
          console.log(error);
        }
        else if (data) {
          console.log("Update user data :");
          console.log(data);
          this.appService.updateUser(data.user);
          this.isUsername = true;
          this.isEmail = true;
        }
      });
    }
  }

  selectImage(event) {
    let fileList: FileList = event.target.files;

    console.log("File list information :");
    console.log(fileList);

    if (fileList.length > 0) {
      let file: File = fileList[0];

      if (file) {
        var reader = new FileReader();

        reader.onload = (event: any) => {
          this.url = event.target.result;
        }
        reader.readAsDataURL(event.target.files[0]);
      }

      console.log("File information :");
      console.log(file);

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
              let id = data.upload._id;
            }
          },
          error => {
            if (error) {
            }
          });

    }
  }

  updateUser(imageID: any) {
    let _base = this;

    // let 
    // return new Promise(function (resolve, reject) {
    //   _base.appService.chargeCard(paymentData, function (error, data) {
    //     if (error) {
    //       reject(error);
    //     }
    //     else {
    //       if (data) {
    //         resolve(data);
    //       }
    //     }
    //   });
    // });
  }


}
