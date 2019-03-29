import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, ToastController, IonicPage } from 'ionic-angular';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { HttpService } from '../../app.httpService';
import { AppService } from '../../app.providers';
import { LocalStorageProvider } from '../../app.localStorage';

@IonicPage()
@Component({
  selector: 'page-documents',
  templateUrl: 'documents.html',
  providers: [HttpService, AppService]
})

export class DocumentsPage {
  imageIdFour: any;
  imageIdThree: any;
  imageIdTwo: any;
  imageIdOne: any;
  id: any;
  urlThree: any = "";
  urlTwo: any = "";
  urlOne: any = "";
  base64textString: string;
  url: any = "";
  vehiclePermitImage: string;
  vehiclePermitImageId: any;
  vehicleRegistrationImage: string;
  vehicleRegistrationImageId: any;
  vehicleInsurenceImage: string;
  vehicleInsurenceImageId: any;
  drivingLicenseImage: any;
  drivingLicenseImageId: any;

  public user: any = {};

  message: string;
  loader: any;
  loadingMessage: string;

  public checkdrivingLicense: boolean = false;
  public checkvehicleInsurance: boolean = true;
  public checkvehicleRegistration: boolean = true;
  public checkvehiclePermit: boolean = true;

  constructor(public nav: NavController,
    public navCtrl: NavController,
    public navParams: NavParams,
    private http: Http,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    private httpService: HttpService,
    private appService: AppService,
    private localStorageProvider: LocalStorageProvider) {

    this.user = this.navParams.data;


  }

  /*
    Driving license upload
  */
  drivingLicense(event) {
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

      //Loading message
      this.loadingMessage = "Uploading..";
      this.loading();
      this.loader.present();


      this.http.post(this.httpService.url + "user/fileUpload", formData, headerOptions)
        .map(res => res.json())
        .catch(error => Observable.throw(error))
        .subscribe(
          data => {

            //Dismiss the loader
            this.loader.dismiss();

            console.log("Data is :");
            console.log(data);

            this.imageIdOne = data.upload._id;

            this.message = "Driving License Upload Successfully.";
            this.showToast('top');

            if (data) {
              this.checkdrivingLicense = true;
              this.checkvehicleInsurance = false;
            }
          },
          error => {
            if (error) {
              console.log("Error is :");
              console.log(error);

              this.checkdrivingLicense = false;
              this.checkvehicleInsurance = true;
              this.checkvehicleRegistration = true;
              this.checkvehiclePermit = true;
            }
          });
    }
  }

  /*
    Vehicle Insurance Upload
  */
  vehicleInsurance(event) {

    let fileList: FileList = event.target.files;

    console.log("File list information :");
    console.log(fileList);

    if (fileList.length > 0) {
      let file: File = fileList[0];

      if (file) {
        var reader = new FileReader();

        reader.onload = (event: any) => {
          this.urlOne = event.target.result;
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

      //Loading message
      this.loadingMessage = "Uploading..";
      this.loading();
      this.loader.present();


      this.http.post(this.httpService.url + "user/fileUpload", formData, headerOptions)
        .map(res => res.json())
        .catch(error => Observable.throw(error))
        .subscribe(
          data => {

            //Dismiss the loader
            this.loader.dismiss();

            console.log("Data is :");
            console.log(data);

            this.imageIdTwo = data.upload._id;

            this.message = "Vehicle Insurance Upload Successfully.";
            this.showToast('top');

            if (data) {
              this.checkvehicleInsurance = true;
              this.checkvehicleRegistration = false;
            }
          },
          error => {
            if (error) {
              console.log("Error is :");
              console.log(error);

              this.checkdrivingLicense = true;
              this.checkvehicleInsurance = false;
              this.checkvehicleRegistration = true;
              this.checkvehiclePermit = true;
            }
          })
    }
  }

  /*
    Vehicle Registration upload
  */
  vehicleRegistration(event) {

    let fileList: FileList = event.target.files;

    console.log("File list information :");
    console.log(fileList);

    if (fileList.length > 0) {
      let file: File = fileList[0];

      if (file) {
        var reader = new FileReader();

        reader.onload = (event: any) => {
          this.urlTwo = event.target.result;
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

      //Loading message
      this.loadingMessage = "Uploading..";
      this.loading();
      this.loader.present();


      this.http.post(this.httpService.url + "user/fileUpload", formData, headerOptions)
        .map(res => res.json())
        .catch(error => Observable.throw(error))
        .subscribe(
          data => {

            //Dismiss the loader
            this.loader.dismiss();

            console.log("Data is :");
            console.log(data);

            this.imageIdThree = data.upload._id;

            this.message = "Vehicle Registration Upload Successfully.";
            this.showToast('top');

            if (data) {
              this.checkvehicleRegistration = true;
              this.checkvehiclePermit = false;
            }
          },
          error => {
            if (error) {
              console.log("Error is :");
              console.log(error);

              this.checkdrivingLicense = true;
              this.checkvehicleInsurance = true;
              this.checkvehicleRegistration = false;
              this.checkvehiclePermit = true;
            }
          })
    }
  }

  /*
    Vehicle Permit upload
  */
  vehiclePermit(event) {

    let fileList: FileList = event.target.files;

    console.log("File list information :");
    console.log(fileList);

    if (fileList.length > 0) {
      let file: File = fileList[0];

      if (file) {
        var reader = new FileReader();

        reader.onload = (event: any) => {
          this.urlThree = event.target.result;
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
      //Loading message
      this.loadingMessage = "Uploading..";
      this.loading();
      this.loader.present();

      this.http.post(this.httpService.url + "user/fileUpload", formData, headerOptions)
        .map(res => res.json())
        .catch(error => Observable.throw(error))
        .subscribe(
          data => {

            //Dismiss the loader
            this.loader.dismiss();

            console.log("Data is :");
            console.log(data);

            this.imageIdFour = data.upload._id;

            if (data) {
              this.checkvehiclePermit = true;
              this.message = "Vehicle Permit Upload Successfully.";
              this.showToast('top');
            }
          },
          error => {
            if (error) {
              console.log("Error is :");
              console.log(error);

              this.checkdrivingLicense = true;
              this.checkvehicleInsurance = true;
              this.checkvehicleRegistration = true;
              this.checkvehiclePermit = false;
            }
          })
    }
  }

  DocUpload() {
    let _base = this;
    if (this.imageIdOne && this.imageIdTwo && this.imageIdThree && this.imageIdFour) {
      let a = this.imageIdOne;
      let b = this.imageIdTwo;
      let c = this.imageIdThree;
      let d = this.imageIdFour;
      var data = {
        drivingLicense: a,
        vehicleInsurance: b,
        vechileRegistration: c,
        vehiclePermit: d
      }
      this.loading();

      Object.assign(_base.user, data);
      console.log("User", _base.user);

      this.loadingMessage = "Registering..";
      this.loading();
      this.loader.present();
      this.appService.verifyUserAndSendOtp(data, (error, data) => {
        this.loader.dismiss();
        if (error) {
          this.message = data.message;
          this.showToast('top');
        }
        else {
          if (!data.error) {
            this.navCtrl.setRoot("OtpPage", _base.user);
          }
        }
      });

    }
    else {
      this.message = "You have to upload all the documents.";
      this.showToast('top');
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
      position: 'bottom'
    });
    toast.present(toast);
  }

}
