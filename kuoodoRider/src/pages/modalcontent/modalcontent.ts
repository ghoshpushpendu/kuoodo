import { Component } from '@angular/core';
import { NavController, IonicPage, NavParams, ViewController } from 'ionic-angular';


@IonicPage({ name: 'ModalcontentPage' })
@Component({
  selector: 'page-modalcontent',
  templateUrl: 'modalcontent.html',
})
export class ModalcontentPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ModalcontentPage');
  }
  dismiss() {
    this.viewCtrl.dismiss();
  }

}
