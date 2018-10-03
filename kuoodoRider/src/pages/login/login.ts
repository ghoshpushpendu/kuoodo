import { Component } from '@angular/core';
import { NavController, IonicPage, NavParams } from 'ionic-angular';


@IonicPage({ name: 'LoginPage' })
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

}
