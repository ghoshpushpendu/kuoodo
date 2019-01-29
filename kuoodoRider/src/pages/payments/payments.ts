import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, NavParams, ModalController, IonicPage, ToastController } from 'ionic-angular';
import { AlertController, LoadingController } from 'ionic-angular';
import { LocalStorageProvider } from '../../app.localStorage';
import { AppService } from '../../app.providers';
import { HttpService } from '../../app.httpService';
import { Stripe } from '@ionic-native/stripe';

@IonicPage({ name: 'PaymentsPage' })
@Component({
  selector: 'page-payments',
  templateUrl: 'payments.html',
})
export class PaymentsPage {

  public userID: String;
  public cards: any = [];
  public pendingAmount: any = '0';

  constructor(private stripe: Stripe, public appService: AppService, public navCtrl: NavController, public localStorageProvider: LocalStorageProvider, public toastCtrl: ToastController, public loadingCtrl: LoadingController, public navParams: NavParams) {
    this.userID = this.localStorageProvider.getUserId();
    this.stripe.setPublishableKey('pk_live_9AHmOl62GsyiArYPdxApwouk');
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
        console.log("cards ============================================", success.cards);
        _base.cards = success.cards;
      }, function (error) {
        _base.showToast("can not get card");
      });

    this.getPendingPayments()
      .then(function (success: any) {
        console.log("success - getting payments", success);
        if (success.result.length) {
          _base.pendingAmount = Math.round(success.result[0].amount);
        }
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
            console.log("cards ============================================", success.cards);
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
    let _base = this;
    let card = {
      number: this.cards[0].number,
      expMonth: this.cards[0].expmonth,
      expYear: this.cards[0].expyear,
      cvc: this.cards[0].cvv
    };

    var loading = this.loadingCtrl.create({
      content: 'Making the payment...'
    });
    loading.present();

    this.stripe.createCardToken(card)
      .then(token => {
        let tokenID = token.id;
        console.log("Payment token :", token);
        _base.chargeCard(tokenID)
          .then(function (response: any) {
            loading.dismiss();
            console.log("Payment response :", response);
            if (response.error) {
              // alert(response.message);
              _base.showToast(response.message)
            } else {
              _base.showToast("Payment successfull");
              _base.navCtrl.setRoot("FindcarPage");
            }
          }, function (error) {
            loading.dismiss();
            console.log("Error in payment", error);
            _base.showToast("Error processing payment");
          });
      })
      .catch(error => {
        loading.dismiss();
        console.log(error);
        console.log("Error processing payment", error);
        _base.showToast("Error processing the payment.");
      });
  }

  //charge card
  chargeCard(token) {
    var _base = this;
    let paymentData = {
      userId: this.userID,
      token: token
    }
    return new Promise(function (resolve, reject) {
      _base.appService.chargeCard(paymentData, function (error, data) {
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