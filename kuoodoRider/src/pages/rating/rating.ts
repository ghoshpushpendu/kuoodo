import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AppService } from '../../app.providers';

@IonicPage({ name: 'RatingPage' })
@Component({
  selector: 'page-rating',
  templateUrl: 'rating.html',
})
export class RatingPage {
  driverid: string;

  public rate: any = 1;
  public review: string = "";
  public driverName: string = "";
  public date: string = "";

  constructor(public navCtrl: NavController, public navParams: NavParams, public http: AppService) {
    this.driverName = localStorage.getItem("driverName");
    this.driverid = localStorage.getItem("driverid");
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RatingPage');
  }

  public rateDriver() {
    let _base = this;
    if (_base.review.trim() == "") {
      alert("Please write some comment to review");
    } else {
      let rateData = {
        driverId: _base.driverid,
        rating: _base.rate,
        review: {
          coment: _base.review,
          name: _base.driverName,
          date: new Date().toString()
        }
      }
      _base.http.rateDriver(rateData, (error, data) => {
        if (error) {
          alert("Error posting review . Please try again");
          _base.http.changeRatingStatus({
            status: 'error'
          });
        } else {
          _base.http.changeRatingStatus({
            status: 'success'
          });
          _base.navCtrl.setRoot("FindcarPage");
        }
      });

    }
  }

}
