import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {
  GoogleMaps,
  GoogleMap,
  LatLng
} from '@ionic-native/google-maps';
import { Geolocation } from '@ionic-native/geolocation';

/**
 * Generated class for the DriverRidePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-driver-ride',
  templateUrl: 'driver-ride.html',
})
export class DriverRidePage {

  public userStartLatitude: any = 23.226613;
  public userStartLongitude: any = 87.080624;

  public userEndLatitude: any = 23.241284;
  public userEndLongitude: any = 87.033637;

  public driverStartLatitude: any = 23.239381;
  public driverStartLongitude: any = 87.074530;

  @ViewChild('map') mapElement: ElementRef;
  map: GoogleMap;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private _googleMaps: GoogleMaps,
    private _geoLoc: Geolocation) {
  }

  ionViewDidLoad() {
    // this.mapViewAndDriverShow();
    this.initMap();
    this.calculateDistance(this.userStartLatitude, this.userStartLongitude, this.driverStartLatitude, this.driverStartLongitude);
  }

  // mapViewAndDriverShow() {

  //   let loc: LatLng;
  //   this.initMap();

  //   this.map.one(GoogleMapsEvent.MAP_READY).then(() => {

  //     let userStartLatitude = 23.226613;
  //     let userStartLongitude = 87.080624;

  //     let userEndLatitude = 23.241284;
  //     let userEndLongitude = 87.033637;

  //     let driverStartLatitude = 23.239381;
  //     let driverStartLongitude = 87.074530;

  //     loc = new LatLng(userStartLatitude, userStartLongitude);
  //     console.log("User loc :", loc);

  //     this.moveCamera(loc);

  //     // this.createMarkar(loc);

  //   });
  // }

  //Initialize google map
  initMap() {
    let element = this.mapElement.nativeElement;
    this.map = GoogleMaps.create(element);
  }

  //Camera move to focus the target location
  moveCamera(loc: LatLng) {
    let options: any = {
      target: loc,
      zoom: 18,
      tilt: 10
    };
    this.map.moveCamera(options);
  }

  //Calculate distance between Driver location and User Location in Km
  calculateDistance(userStartLatitude, userStartLongitude, driverStartLatitude, driverStartLongitude) {

    var R = 6371; // Radius of the earth in km
    let fare = 9;

    //Convert degree to redian
    var lat = (driverStartLatitude - userStartLatitude) * (Math.PI / 180);
    console.log("lat :", lat);
    console.log("lat dataType :", typeof (lat));
    var lon = (driverStartLongitude - userStartLongitude) * (Math.PI / 180);
    console.log("lon :", lat);
    console.log("lon dataType :", typeof (lat));
    var a =
      Math.sin(lat / 2) * Math.sin(lat / 2) +
      Math.cos((userStartLatitude) * (Math.PI / 180)) * Math.cos((driverStartLatitude) * (Math.PI / 180)) *
      Math.sin(lon / 2) * Math.sin(lon / 2)
      ;
    console.log("a :", a);
    console.log("a dataType :", typeof (a));
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    console.log("c :", c);
    console.log("c dataType :", typeof (c));
    var d = R * c; // Distance in km
    console.log("d :", d);
    console.log("d dataType :", typeof (d));

    let totalFare = d * fare;
    console.log("fare :", fare);
  }
}
