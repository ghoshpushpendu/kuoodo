import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';


declare var google;


@IonicPage({ name: 'RidingPage' })
@Component({
  selector: 'page-riding',
  templateUrl: 'riding.html',
})
export class RidingPage {
  @ViewChild('map') mapElement: ElementRef;

  // variables
  public driverID: string;
  public userID: string;
  public startLocation: any;
  public endLocation: any;
  public marker: any;

  constructor(
    private geolocation: Geolocation) {
    this.userID = localStorage.getItem("userId");
  }

  ionViewDidLoad() {

  }

}
