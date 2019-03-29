import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { AppService } from '../../app.providers';
import { LocalStorageProvider } from '../../app.localStorage';
import { Stripe } from '@ionic-native/stripe';
import { strings } from './../../lang';

@IonicPage({ name: 'AddcardPage' })
@Component({
  selector: 'page-addcard',
  templateUrl: 'addcard.html',
})
export class AddcardPage {
  public card: any = {
    name: '',
    country: '',
    number: '',
    cvv: '',
    expmonth: '',
    expyear: '',
    userId: ''
  }
  public string: any = strings;

  constructor(public toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    private localStorageProvider: LocalStorageProvider,
    private appService: AppService,
    public navCtrl: NavController,
    private stripe: Stripe,
    public navParams: NavParams) {
    this.stripe.setPublishableKey('pk_live_9AHmOl62GsyiArYPdxApwouk');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddcardPage');
    this.card.userId = this.localStorageProvider.getUserId();
  }

  showToast(message: string) {
    let toast = this.toastCtrl.create({ message: message, duration: 3000, position: 'bottom' });
    toast.present(toast);
  }

  addCard() {
    let _base = this;
    let loading = this.loadingCtrl.create({ content: _base.string.pleaseWait });
    loading.present();


    let card = {
      number: this.card.number,
      expMonth: this.card.expmonth,
      expYear: this.card.expyear,
      cvc: this.card.cvv
    };

    this.stripe.createCardToken(card)
      .then(token => {
        let tokenID = token.id;
        _base.appService.addCard(_base.card, (error, data) => {
          loading.dismiss();
          if (error) {
            _base.showToast(_base.string.cardAddError);
          } else {
            if (data) {
              if (data.error) {
                alert(data.message);
              } else {
                _base.showToast(_base.string.cardAddSuccess);
                this.navCtrl.pop();
              }
            }
          }
        });
      })
      .catch(error => {
        loading.dismiss();
        console.log("Error processing payment", error);
        alert(_base.string.cardAddError);
      });

  }

}