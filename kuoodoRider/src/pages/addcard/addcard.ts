import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { AppService } from '../../app.providers';
import { LocalStorageProvider } from '../../app.localStorage';

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
  constructor(public toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    private localStorageProvider: LocalStorageProvider,
    private appService: AppService,
    public navCtrl: NavController,
    public navParams: NavParams) {

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
    let loading = this.loadingCtrl.create({ content: 'Creaing card...' });
    loading.present();
    _base.appService.addCard(_base.card, (error, data) => {
      loading.dismiss();
      if (error) {
        _base.showToast("can not add card");
      } else {
        if (data) {
          if (data.error) {
            alert(data.message);
          } else {
            _base.showToast("card added");
            this.navCtrl.pop();
          }
        }
      }
    });
  }
  paypal() {

  }
}