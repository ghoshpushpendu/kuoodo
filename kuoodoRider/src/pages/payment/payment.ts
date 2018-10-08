import { Component } from '@angular/core';
import { NavController, IonicPage, LoadingController, NavParams } from 'ionic-angular';
import { AppService } from '../../app.providers';

@IonicPage({ name: 'PaymentPage' })
@Component({
  selector: 'page-payment',
  templateUrl: 'payment.html',
})
export class PaymentPage {

  public driverId: any;
  public payAmount: any = 20;

  constructor(public loadingCtrl: LoadingController, public appservice: AppService, public navCtrl: NavController, public navParams: NavParams) {
    this.driverId = this.navParams.get("driverID");
    this.payAmount = this.navParams.get("paymentAmount");

    let _base = this;

    let loading = this.loadingCtrl.create({
      content: 'Making automatic payment...'
    });

    loading.present();

    setTimeout(function () {
      _base.appservice.changePaymentStatus({
        status: "success"
      });
      loading.dismiss();
    }, 3000);
  }

}
