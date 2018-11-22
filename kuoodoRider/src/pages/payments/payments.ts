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
  public pendingAmount: any = '0';

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

    this.getPendingPayments()
      .then(function (success: any) {
        console.log("success - getting payments", success);
        _base.pendingAmount = success.result[0].amount;
      }, function (error) {
        console.log("error - getting payments", error);
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
    if (this.cards.length != 0) {
      this.showToast("Remove the linked card to add a new one");
    } else {
      this.navCtrl.push("AddcardPage");
    }
  };

  deleteCard(number) {
    var _base = this;
    var loading = this.loadingCtrl.create({
      content: 'Removing selected card...'
    });
    _base.appService.deleteCard(number, function (error, data) {
      _base.getCards()
        .then(function (success: any) {
          _base.cards = success.cards;
        }, function (error) {
          _base.showToast("can not get card");
        });
      if (error) {
        loading.dismiss();
        _base.showToast("can not delete card");
      }
      else {
        _base.showToast("card has been deleted");
        _base.getCards()
          .then(function (success: any) {
            _base.cards = success.cards;
          }, function (error) {
            _base.showToast("can not get card");
          });
      }
    });
  }

  // get penging payments
  getPendingPayments() {
    var _base = this;
    var loading = this.loadingCtrl.create({
      content: 'Getting pending payments...'
    });
    loading.present();
    return new Promise(function (resolve, reject) {
      _base.appService.getPendingPayments(_base.userID, function (error, data) {
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

  makePayment() {
    this.chargeCard()
      .then(function (success: any) {
        console.log(success);
        this.showToast("card has been charged")
      }, function (error) {
        console.log(error);
        this.showToast("card has not been charged")
      });
  }

  //charge card
  chargeCard() {
    var _base = this;
    var loading = this.loadingCtrl.create({
      content: 'Charging the card...'
    });
    loading.present();
    return new Promise(function (resolve, reject) {
      _base.appService.chargeCard(_base.userID, function (error, data) {
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

}