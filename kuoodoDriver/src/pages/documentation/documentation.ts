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
  selector: 'page-documentation',
  templateUrl: 'documentation.html',
  providers: [HttpService, AppService]
})

export class DocumentationPage {
  imageIdFour: any;
  imageIdThree: any;
  imageIdTwo: any;
  imageIdOne: any;
  id: any;
  urlThree: any;
  urlTwo: any;
  urlOne: any;
  base64textString: string;
  url: any;
  vehiclePermitImage: string;
  vehiclePermitImageId: any;
  vehicleRegistrationImage: string;
  vehicleRegistrationImageId: any;
  vehicleInsurenceImage: string;
  vehicleInsurenceImageId: any;
  drivingLicenseImage: any;
  drivingLicenseImageId: any;

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

    /*
  Getting id's after registration or login in driver profile page
  */

    this.id = this.localStorageProvider.getDriverId();
    console.log("Getting Id in documentation page :");
    console.log(this.id);
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

  ionViewDidEnter() {
    this.getCarImages(this.id);
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
      let a = [{ _id: this.imageIdOne }];
      let b = [{ _id: this.imageIdTwo }];
      let c = [{ _id: this.imageIdThree }];
      let d = [{ _id: this.imageIdFour }];
      var dataOne = {
        userId: this.id,
        drivingLicense: a,
        vehicleInsurance: b,
        vechileRegistration: c,
        vehiclePermit: d
      }
      _base.loadingMessage = "Linking Docs";
      this.loading();
      this.appService.documentUpload(dataOne, (error, data) => {
        this.loader.dismiss();
        if (error) {
          console.log("Error :");
          console.log(error);
          this.message = "Can't link docs. Please try again";
          this.showToast('top');
        }
        else if (data) {
          console.log("Document upload result :");
          console.log(data);
          this.message = "Documents has been linked";
          this.showToast('top');
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

  /** get images **/
  public getCarImages(userid: any) {
    let _base = this;
    this.loadingMessage = "Getting images..";
    this.loading();
    this.loader.present();
    _base.appService.getCar(userid, (error, data) => {
      _base.loader.dismiss();
      if (error) {
        console.log("Error :");
        _base.message = "Can't get documents";
        _base.showToast('top');
      }
      else if (data) {
        _base.drivingLicenseImageId = (data.result[1].drivingLicense.length) ? data.result[1].drivingLicense[data.result[1].drivingLicense.length - 1] : '';
        _base.vehicleRegistrationImageId = (data.result[1].vechileRegistration.length) ? data.result[1].vechileRegistration[data.result[1].vechileRegistration.length - 1] : '';
        _base.vehicleInsurenceImageId = (data.result[1].vehicleInsurance.length) ? data.result[1].vehicleInsurance[data.result[1].vehicleInsurance.length - 1] : '';
        _base.vehiclePermitImageId = (data.result[1].vehiclePermit.length) ? data.result[1].vehiclePermit[data.result[1].vehiclePermit.length - 1] : '';

        _base.url = this.httpService.url + "user/fileShow?imageId=" + _base.drivingLicenseImageId;
        _base.urlOne = this.httpService.url + "user/fileShow?imageId=" + _base.vehicleRegistrationImageId;
        _base.urlTwo = this.httpService.url + "user/fileShow?imageId=" + _base.vehicleInsurenceImageId;
        _base.urlThree = this.httpService.url + "user/fileShow?imageId=" + _base.vehiclePermitImageId;
      }
    });
  }

}
