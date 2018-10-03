import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import {
  GoogleMaps,
  GoogleMap,
  GoogleMapsEvent,
  MarkerOptions,
  Marker,
  LatLng,
  CameraPosition,
  GoogleMapOptions
} from '@ionic-native/google-maps';

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
  map: GoogleMap;
  public marker: any;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private googleMaps: GoogleMaps,
    private geolocation: Geolocation) {
    this.userID = localStorage.getItem("userId");
    let bookingDetails = this.navParams.get("bookingDetails");
    console.log(bookingDetails);
    this.driverID = bookingDetails.id;
    this.startLocation = bookingDetails.pickUpLocation;
    this.endLocation = bookingDetails.destination;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RidingPage');
    let _base = this;
    this.loadMap();
    let watch = this.geolocation.watchPosition();
    watch.subscribe((data) => {
      let lat = data.coords.latitude;
      let lng = data.coords.longitude;
      let position = {
        lat: lat,
        lng: lng
      };
      console.log("current position");
      _base.createMyMarker(position);
    });
  }

  moveCamera(loc: LatLng) {
    let options: any = {
      target: loc
    };
    this.map.moveCamera(options);
  }

  loadMap() {

    let _base = this;

    let mapOptions: GoogleMapOptions = {
      camera: {
        target: {
          lat: 43.0741904,
          lng: -89.3809802
        },
        zoom: 18,
        tilt: 30
      }
    };

    let element = this.mapElement.nativeElement;

    this.map = GoogleMaps.create(element, mapOptions);

    // Wait the MAP_READY before using any methods.
    this.map.one(GoogleMapsEvent.MAP_READY)
      .then(() => {
        console.log('Map is ready!');

        console.log("Start Location", _base.startLocation);
        console.log("End Location", _base.endLocation);

        // create direction markers
        _base.createPinMarker(_base.startLocation);
        _base.createPinMarker(_base.endLocation);

      });
  }

  createMyMarker(position: any) {
    let _base = this;
    const image = {
      url: './assets/icon/myself.png',
      size: {
        width: 20,
        height: 20
      }
    };
    _base.moveCamera(position);
    if (this.marker) {
      this.marker.setPosition(position);
    } else {
      this.map.addMarker({
        title: 'Ionic',
        icon: image,
        animation: 'DROP',
        position: position
      })
        .then(marker => {
          _base.marker = marker;
        });
    }
  }

  createPinMarker(position) {
    console.log(position);
    let latlngPos = {
      lat: position.latitude,
      lng: position.longitude
    };
    this.map.addMarker({
      title: 'Ionic',
      animation: 'DROP',
      position: latlngPos
    })
  }

}
