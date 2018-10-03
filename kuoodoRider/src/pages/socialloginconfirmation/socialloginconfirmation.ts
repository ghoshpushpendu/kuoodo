import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';


@IonicPage({ name: 'SocialloginconfirmationPage' })
@Component({
  selector: 'page-socialloginconfirmation',
  templateUrl: 'socialloginconfirmation.html',
})
export class SocialloginconfirmationPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SocialloginconfirmationPage');
  }

}
