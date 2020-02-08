import { Component } from '@angular/core';
import { IonicPage, NavController, ToastController, NavParams } from 'ionic-angular';
import { LocalStorageProvider } from '../../app.localStorage';
import { AppService } from '../../app.providers';
import { LoadingController } from 'ionic-angular';
import { strings } from './../../lang';
import { HttpService } from '../../app.httpService';

@IonicPage({ name: 'TriphistoryPage' })
@Component({
  selector: 'page-triphistory',
  templateUrl: 'triphistory.html',
})
export class TriphistoryPage {

  public userID: string; // current user ID
  public string: any = strings;

  public trips: any;  // list of trips
  public loader: any;

  public imageBase = "http://mitapi.memeinfotech.com:5040/user/fileShow?imageId=";


  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private localStorageProvider: LocalStorageProvider,
    private appService: AppService,
    public toastCtrl: ToastController,
    public httpService: HttpService,
    public loadingCtrl: LoadingController) {
    this.userID = this.localStorageProvider.getUserId();
  }

  showToast(message: string) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: 'bottom'
    });

    toast.present(toast);
  }

  ionViewDidLoad() {
    let _base = this;
    console.log('ionViewDidLoad TriphistoryPage');
    this.loading();
    this.getUserTripHistory()
      .then(function (success: any) {
        console.log(success.result);
        console.log("hmm user");
        _base.trips = success.result.map(function (trip) {
          trip.amount = parseInt(trip.amount);
          return trip;
        }).slice(0, 20).filter(item => {
          if (item.status) { return item }
        });
        if (success.result.length == 0) {
          _base.showToast(_base.string.noTrip);
          _base.navCtrl.pop();
        }
        _base.loader.dismiss();
        // console.log(_base.trips[1].startTime.now());
      }, function (error) {
        console.log(error);
        _base.loader.dismiss();
      });
  }

  getUserTripHistory() {
    let _base = this;
    return new Promise(function (resolve, reject) {
      _base.appService.userHistory(_base.userID, (error, data) => {
        if (error) {
          reject(error);
        } else {
          if (data) {
            resolve(data);
          }
        }
      });
    });
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

  pop() {
    this.navCtrl.pop();
  }

}
