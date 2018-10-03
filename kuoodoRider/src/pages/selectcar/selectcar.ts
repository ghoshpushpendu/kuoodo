import { Component } from '@angular/core';
import { NavController, IonicPage, NavParams } from 'ionic-angular';


@IonicPage({ name: 'SelectcarPage' })
@Component({
  selector: 'page-selectcar',
  templateUrl: 'selectcar.html',
})
export class SelectcarPage {
  pet: string = "puppies";
  isAndroid: boolean = false;

  constructor(public nav: NavController, public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SelectcarPage');
  }
  paymentpage() {
    // hide booking form
    // this.toggleForm();

    // go to finding page
    this.nav.setRoot("PaymentPage");
  }

}
