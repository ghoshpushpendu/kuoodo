import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, NavParams, ModalController, IonicPage, ToastController } from 'ionic-angular';
import { AlertController, LoadingController } from 'ionic-angular';
import { LocalStorageProvider } from '../../app.localStorage';
import { AppService } from '../../app.providers';
import { HttpService } from '../../app.httpService';


@IonicPage({ name: 'PaymentsPage' })
@Component({
  selector: 'page-payments',
  templateUrl: 'payments.html',
})
export class PaymentsPage {

  public userID: String;
  public cards: any = [];

  constructor(public appService: AppService, public navCtrl: NavController, public localStorageProvider: LocalStorageProvider, public toastCtrl: ToastController, public loadingCtrl: LoadingController, public navParams: NavParams) {
    this.userID = this.localStorageProvider.getUserId();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PaymentsPage');
  }

  showToast(message) {
    var toast = this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: 'bottom'
    });
    toast.present(toast);
  }

  ionViewDidEnter() {
    console.log("View loaded");
    var _base = this;
    this.getCards()
      .then(function (success: any) {
        _base.cards = success.cards;
      }, function (error) {
        _base.showToast("can not get card");
      });
  }

  getCards() {
    var _base = this;
    var loading = this.loadingCtrl.create({
      content: 'Getting cards...'
    });
    loading.present();
    return new Promise(function (resolve, reject) {
      _base.appService.getCards(_base.userID, function (error, data) {
        loading.dismiss();
        if (error) {
          reject(error);
        }
        else {
          if (data) {
            resolve(data);
          }
        }
      });
    });
  }

  addCard() {
    console.log("go to add card");
    this.navCtrl.push("AddcardPage");
  };

  deleteCard(number) {
    var _base = this;
    var loading = this.loadingCtrl.create({
      content: 'Removing selected card...'
    });
    _base.appService.deleteCard(number, function (error, data) {
      loading.dismiss();
      _base.getCards();
      if (error) {
        _base.showToast("can not delete card");
      }
      else {
        if (data) {
          _base.showToast("card has been deleted");
          _base.getCards();
        }
      }
    });
  }

}