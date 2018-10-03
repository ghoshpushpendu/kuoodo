import { Component } from '@angular/core';
import { NavController, IonicPage, NavParams } from 'ionic-angular';
import { AppService } from '../../app.providers';

@IonicPage({ name: 'PaymentPage' })
@Component({
  selector: 'page-payment',
  templateUrl: 'payment.html',
})
export class PaymentPage {

  public driverId: any;
  public payAmount: any;

  constructor(public appservice: AppService, public navCtrl: NavController, public navParams: NavParams) {
    this.driverId = this.navParams.get("driverID");
    this.payAmount = this.navParams.get("paymentAmount");
  }

}
