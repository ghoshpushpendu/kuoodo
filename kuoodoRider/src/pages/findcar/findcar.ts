import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, NavParams, ModalController, IonicPage, ToastController } from 'ionic-angular';
import { Geolocation, GeolocationOptions } from '@ionic-native/geolocation';
import { AlertController, LoadingController } from 'ionic-angular';
import { HttpService } from '../../app.httpService';
import { Stripe } from '@ionic-native/stripe';
import { strings } from './../../lang';

declare var google;

import { AppService } from '../../app.providers';
import { LocalStorageProvider } from '../../app.localStorage';
import * as io from "socket.io-client";


@IonicPage({ name: 'FindcarPage' })
@Component({
  selector: 'page-findcar',
  templateUrl: 'findcar.html',
  providers: [HttpService]
})
export class FindcarPage {

  public string: any = strings;
  //waiting loader
  public waitingLoader: any;

  public rideMode: boolean = false;

  map: any;
  message: any;
  public marker: any = null;
  public destinationmarker: any = null;

  public nearestDrivers: any = [];

  name: string;
  driverCompleteEndAddressLogin: any;
  driverCompleteStartAddressLogin: any;

  driverCompleteEndAddressG: any;
  driverCompleteStartAddressG: any;
  driverCompleteEndAddressFB: any;
  driverCompleteStartAddressFB: any;

  driverCompleteEndAddress: any;
  driverCompleteStartAddress: any;

  drivername: any;

  driverId: any;
  response: any;
  LoginId: any;
  id: any;

  otp: any = "";
  tempOtp: any = "";
  phone: any;
  location: any;
  endingLongitude: any;
  endingLatitude: any;
  startLongitude: any;
  startLatitude: any;
  public startAddress: any = this.string.fetchLocation;
  public endAddress: any;
  public distance: string;
  public driverNode: any;
  public userData: any;
  arrival_status: any = "arriving";

  public locationCircle: any;

  public images: any = [1, 2, 3, 4, 5, 6];

  originmarker: any = null;
  public polygon: any = null;
  public interval: any = null;


  @ViewChild('map') mapElement: ElementRef;

  directionsService = new google.maps.DirectionsService;
  directionsDisplay = new google.maps.DirectionsRenderer;
  socket: SocketIOClient.Socket;
  polyline: any;
  driverSearch: number;
  arrivingDistance: any;
  arrivingDuration: any;

  cabTypes: any = [];

  address: any = {
    place: ''
  };
  selectedCar: number;
  cartype: any;

  //currently available drivers
  availableCars: any = [];
  cards: any;

  constructor(public nav: NavController,
    public navCtrl: NavController,
    public modalCtrl: ModalController,
    public navParams: NavParams,
    private _geoLoc: Geolocation,
    private httpService: HttpService,
    private appService: AppService,
    private localStorageProvider: LocalStorageProvider,
    private alertCtrl: AlertController,
    public toastCtrl: ToastController,
    private stripe: Stripe,
    public loadingCtrl: LoadingController) {


    let _base = this;
    this.stripe.setPublishableKey('pk_live_9AHmOl62GsyiArYPdxApwouk');

    this.socket = io(this.httpService.url);
    this.socket.on('connect', () => {
      this.changeStatus("Online")
    });

    this.socket.on('disconnect', () => {
      this.changeStatus("Offline");
    });

    this.socket.on("accepted", (data) => {
      let userID = data.userId._id;





      if (userID == _base.id) {

        _base.waitingLoader.dismiss();
        _base.showToast(_base.string.accepted);

        _base.rideMode = true;

        //subscribe to driver location update
        _base.socket.on(_base.driverId + "-location", (data) => {


          _base.showDriver(data.lat, data.lng);

        })
      } else {

      }
    });


    this.socket.on("rejected", (data) => {
      let userID = data.userId._id;
      // 
      if (userID == _base.id) {
        _base.waitingLoader.dismiss();
        _base.showToast(_base.string.rejected);
        _base.rideMode = false;
        _base.startSearch();
      }
    });


    this.socket.on("arrived", (data) => {
      let userID = data.userId._id;

      if (userID == _base.id) {
        _base.otp = _base.tempOtp;
        _base.arrival_status = "arrived";
        _base.showToast(_base.string.arrived);
        _base.showJourneyRoute();
      }
    });

    this.socket.on("start", (data) => {
      let userID = data.userId._id;

      if (userID == _base.id) {
        _base.otp = "";
        _base.showToast(_base.string.rideStarted);
        _base.socket.removeListener(_base.driverId + "-location", function () {

        });
      }
    });

    this.socket.on("end", (data) => {
      let userID = data.userId._id;
      let driverID = data.driverId._id;
      if (userID == _base.id) {
        _base.showToast(_base.string.rideCompleted);
        // _base.clearTrip();
        let price = data.price;
        // this.attemptPayment();
        _base.nav.push("RatingPage");
        _base.rideMode = false;
      }
    });

    this.appService.PaymentStutus.subscribe(function (payment) {
      if (payment) {
        if (payment.status == "success") {
          // location.reload();
          // _base.socket.emit("payment", {
          //   driverId: _base.driverId
          // });
          _base.nav.push("RatingPage", {
            "driverName": _base.drivername,
            "driverid": _base.driverId
          });
        }
      }
    });

    /*
    getting id's after completing registration
    */

    this.id = this.localStorageProvider.getUserId();
    this.checkRideStatus();
    this.getCabTypes();
  }

  chooseLanguage() {


    let prompt = this.alertCtrl.create({
      title: 'Language',
      message: 'Select a language to continue.',
      inputs: [
        {
          type: 'radio',
          label: 'English',
          value: 'english',
          checked: (localStorage.getItem("language") == 'english') ? true : false
        },
        {
          type: 'radio',
          label: 'Español',
          value: 'spanish',
          checked: (localStorage.getItem("language") == 'spanish') ? true : false
        },
        {
          type: 'radio',
          label: '中文',
          value: 'chineese',
          checked: (localStorage.getItem("language") == 'chineese') ? true : false
        }
      ],
      buttons: [
        // {
        //   text: "Cancel",
        //   handler: data => {
        //     
        //   }
        // },
        {
          text: "Continue",
          handler: data => {
            localStorage.removeItem("language");

            localStorage.setItem("language", data);
            strings.setLanguage(data);
          }
        }]
    });
    prompt.present();
  }

  ionViewDidLeave() {
    this.stopSearch();
  }

  showAddressModal(str: String) {
    let _base = this;
    let modal = this.modalCtrl.create("AutocompletePage", {
      lat: _base.startLatitude,
      lng: _base.startLongitude
    });

    modal.onDidDismiss(data => {
      if (Object.keys(data).length != 0) {

        if (str == 'start') {

          this.startLatitude = data.lat;
          this.startLongitude = data.lng;
          _base.startAddress = data.address;
          let loc = new google.maps.LatLng(data.lat, data.lng);
          let endingLoc = new google.maps.LatLng(this.endingLatitude, this.endingLongitude)
          this.createMarkar(loc, 0);

          if (Object.getOwnPropertyNames(this.directionsService).length != 0) {
            this.showRoute(loc, endingLoc);
          }

        } else if (str == 'end') {
          _base.endAddress = data.address;
          _base.endingLatitude = data.lat;
          _base.endingLongitude = data.lng;
          let loc = new google.maps.LatLng(_base.endingLatitude, _base.endingLongitude);
          _base.createDestinationMarker(loc);
        }

      } else {

      }
    });
    modal.present();
  }

  showDriver(lat: any, lng: any) {
    let start = new google.maps.LatLng(this.startLatitude, this.startLongitude);
    let end = new google.maps.LatLng(lng, lat);
    this.showRoute(start, end);
  }

  showJourneyRoute() {
    let _base = this;
    let start = new google.maps.LatLng(_base.startLatitude, _base.startLongitude);
    let end = new google.maps.LatLng(_base.endingLatitude, _base.endingLongitude);
    _base.showRoute(start, end);
  }

  clearTrip() {
    this.endingLatitude = null;
    this.endingLongitude = null;
    this.endAddress = null;
    this.driverId = null;
    this.rideMode = false;
    this.arrival_status = "";
    this.directionsDisplay.setMap(null);
    this.destinationmarker.serMap(null);
    this.getLocation();
  }

  checkRideStatus() {
    let _base = this;
    _base.appService.bookingStatus
      .subscribe(data => {
        if (data) {
          if (data.status == 'rideaccept') {
            _base.waitingLoader.dismiss();
            let loading = this.loadingCtrl.create({
              content: _base.string.pleaseWait
            });

            loading.present();

            setTimeout(() => {
              loading.dismiss();
            }, 2000);
          } else if (data.status == 'ridecancel') {
            _base.waitingLoader.dismiss();
            let loading = this.loadingCtrl.create({
              content: _base.string.pleaseWait
            });

            loading.present();

            setTimeout(() => {
              loading.dismiss();
            }, 2000);
          }
        }
      });
  }

  reziseMap() {
    let mapHeight = (<HTMLElement>document.getElementById("map")).clientHeight;
    (<HTMLElement>document.getElementById("map")).style.height = mapHeight + "px";
  }


  ionViewDidLoad() {

    this.reziseMap();

    let _base = this;
    /** user profile info **/

    this.initMap();
  }

  ionViewDidEnter() {
    let _base = this;

    this.appService.getProfile(this.id, (error, data) => {
      if (error) {

      } else {
        if (data) {
          _base.appService.updateUser(data.user);
          _base.userData = data.user;
          // 
        }
      }
    });

    //checking pending payments
    _base.getPendingPayments()
      .then(function (success: any) {

        if (success.result.length) {
          if (success.result[0].amount >= 0) {
            // _base.nav.push("PaymentsPage");
          }
        }
      }, function (error) {

      });

    //checking payment methods
    _base.getCards()
      .then(function (success: any) {
        if (success.cards.length == 0) {
          // alert(_base.string.paymentMethodError);
          // _base.navCtrl.push("PaymentsPage");
        } else {
          _base.cards = success.cards;
        }
      }, function (error) {
        // _base.navCtrl.push("PaymentsPage");
        _base.showToast("can not get card");
      });


    _base.fetchCurrentRide()
      .then(function (response: any) {
        if (!response.error) {

          if (response.result.length != 0) {
            // alert("You are in a ride")

            let booking = response.result[0];
          }
        }
      }, function (error: any) {

      });

    if (sessionStorage.getItem("location") == "enabled") {
      _base.setCurrentLocation();
    }
  }


  // this function is not in use currently
  public mapRideData(data: any) {
    let _base = this;
    if (data.status == 'Booked') {
      _base.showToast(_base.string.accepted);

      _base.rideMode = true;
      _base.driverId = data.driverId._id;


      // setting address in address input fields
      _base.endAddress = data.endLocation;
      _base.startAddress = data.startLocation;

      // setting start location on local variables
      _base.startLatitude = data.pickUpLocation.latitude;
      _base.startLongitude = data.pickUpLocation.longitude;

      // setting end location on local variable
      _base.endingLatitude = data.destination.latitude;
      _base.endingLongitude = data.destination.longitude;

      // setting up driver info
      _base.drivername = data.driverId.firstName + ' ' + data.driverId.lastName;

      //subscribe to driver location update
      _base.socket.on(_base.driverId + "-location", (data) => {


        _base.showDriver(data.lat, data.lng);
        // endAddress
      })
    } else if (data.status == 'Arrived') {
      // _base.otp = _base.tempOtp;
      // _base.arrival_status = "arrived";
      // _base.showToast("Driver has arrived");
      // _base.showJourneyRoute();
    } else if (data.status == 'Commute') {

    } else if (data.status == 'Completed') {

    }
  }

  /*
  Initialize the google map
  */

  initMap() {
    let _base = this;

    let mapStyle = [
      {
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#f5f5f5"
          }
        ]
      },
      {
        "elementType": "labels.icon",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },
      {
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#616161"
          }
        ]
      },
      {
        "elementType": "labels.text.stroke",
        "stylers": [
          {
            "color": "#f5f5f5"
          }
        ]
      },
      {
        "featureType": "administrative",
        "elementType": "geometry",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },
      {
        "featureType": "administrative.land_parcel",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#bdbdbd"
          }
        ]
      },
      {
        "featureType": "poi",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },
      {
        "featureType": "poi",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#eeeeee"
          }
        ]
      },
      {
        "featureType": "poi",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#757575"
          }
        ]
      },
      {
        "featureType": "poi.park",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#e5e5e5"
          }
        ]
      },
      {
        "featureType": "poi.park",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#9e9e9e"
          }
        ]
      },
      {
        "featureType": "road",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#ffffff"
          }
        ]
      },
      {
        "featureType": "road",
        "elementType": "labels.icon",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },
      {
        "featureType": "road.arterial",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#757575"
          }
        ]
      },
      {
        "featureType": "road.highway",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#dadada"
          }
        ]
      },
      {
        "featureType": "road.highway",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#616161"
          }
        ]
      },
      {
        "featureType": "road.local",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#9e9e9e"
          }
        ]
      },
      {
        "featureType": "transit",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },
      {
        "featureType": "transit.line",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#e5e5e5"
          }
        ]
      },
      {
        "featureType": "transit.station",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#eeeeee"
          }
        ]
      },
      {
        "featureType": "water",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#c9c9c9"
          }
        ]
      },
      {
        "featureType": "water",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#9e9e9e"
          }
        ]
      }
    ];

    var uluru = { lat: -25.344, lng: 131.036 };
    let options = {
      zoom: 15, center: { lat: -25.344, lng: 131.036 }, 
      mapTypeId: 'terrain', 
      // gestureHandling: 'none',
      zoomControl: false,
      disableDefaultUI: true,
      styles: mapStyle
    };
    this.map = new google.maps.Map(document.getElementById('map'), options);

    google.maps.event.addListenerOnce(_base.map, 'idle', function () {
      // do something only the first time the map is loaded
      _base.setCurrentLocation();
    });

  }

  setCurrentLocation() {
    let _base = this;


    sessionStorage.setItem("location", "enabled");

    let loader = _base.loadingCtrl.create({
      content: _base.string.pleaseWait
    });
    loader.present();
    _base.getLocation().then((res) => {
      // 
      this.response = res;
      this.startLatitude = res.coords.latitude;
      this.startLongitude = res.coords.longitude;
      var latlng = new google.maps.LatLng(res.coords.latitude, res.coords.longitude);
      let geocoder = new google.maps.Geocoder;
      geocoder.geocode({ 'location': latlng }, function (results, status) {
        if (status === 'OK') {
          if (results[0]) {
            let address = results[0].formatted_address;
            _base.startAddress = address;
          } else {

          }
        } else {

        }
      });

      let loc = new google.maps.LatLng(res.coords.latitude, res.coords.longitude);
      let endingLoc = new google.maps.LatLng(this.endingLatitude, this.endingLongitude)
      this.createMarkar(loc, res.coords.accuracy);

      if (Object.getOwnPropertyNames(this.directionsService).length != 0) {
        this.showRoute(loc, endingLoc);
      }

      if (this.response) {
        loader.dismiss();
        this.stopSearch();
        this.startSearch();
      }
    });
  }

  calculateAmount() {
    let _base = this;
    return new Promise(function (resolve, reject) {
      let end = new google.maps.LatLng(_base.endingLatitude, _base.endingLongitude);
      let start = new google.maps.LatLng(_base.startLatitude, _base.startLongitude);

      var directionsService = new google.maps.DirectionsService();

      var request = {
        origin: start,
        destination: end,
        travelMode: google.maps.TravelMode.DRIVING
      };

      directionsService.route(request, function (response, status) {
        if (status == google.maps.DirectionsStatus.OK) {
          let distance = response.routes[0].legs[0].distance.value * 0.000621371;
          let time = parseInt(response.routes[0].legs[0].duration.value) / 60;


          let minutes = parseFloat(_base.getPerMilePrice(_base.cartype.name).perMinutes);
          let miles = parseFloat(_base.getPerMilePrice(_base.cartype.name).perMile);
          let initial = parseFloat(_base.getCarInfo().initialCost);
          let service = parseFloat(_base.getCarInfo().serviceFee);
          let cost = initial + service + distance * miles + time * minutes;
          resolve({
            cost: cost
          });
        }
      });
    });
  }

  getPerMilePrice(carType: string) {
    let _base = this;
    for (let i = 0; i < _base.cabTypes.length; i++) {
      if (_base.cabTypes[i].name == carType) {
        return {
          perMile: _base.cabTypes[i].perMile,
          perMinutes: _base.cabTypes[i].perMinutes
        }
      }
    }
  }

  getCarInfo() {
    let _base = this;
    let carType = this.cartype.name;
    for (let i = 0; i <= _base.cabTypes.length; i++) {
      if (_base.cabTypes[i].name = carType) {
        return _base.cabTypes[i];
      }
    }
  }

  //calculate and draw route
  calculateMaps(start, end) {
    this.directionsService.route({
      origin: start,
      destination: end,
      travelMode: 'DRIVING'
    }, (response, status) => {
      if (status === 'OK') {

      } else {

      }
    });
  }

  clearDestination() {
    this.endAddress = null;
    this.endingLatitude = null;
    this.endingLongitude = null;
    this.directionsDisplay.setMap(null);
    let loc = new google.maps.LatLng({
      lat: this.startLatitude,
      lng: this.startLongitude
    });
    this.moveCamera(loc);
  }

  /*
  Getting the current position of the User
  */


  /** get Drivers **/


  getLocation() {
    let options: GeolocationOptions = {
      enableHighAccuracy: true,
      // maximumAge:2000
    }
    return this._geoLoc.getCurrentPosition(options);
  }

  /*
  Google map camera property
  */

  moveCamera(loc: any) {
    this.map.setCenter(loc, 14);
  }

  /*
  Marker creation in google map on starting latitude and longitude
  */

  createMarkar(loc: any, accuracy: number) {

    let _base = this;

    // var icon = {
    //   // url: "https://lemi.travel/images/current.png",
    //   // url: "https://cdn1.iconfinder.com/data/icons/Map-Markers-Icons-Demo-PNG/256/Map-Marker-Ball-Chartreuse.png", // url
    //   scaledSize: new google.maps.Size(40, 40), // scaled size
    //   origin: new google.maps.Point(0, 0), // origin
    //   anchor: new google.maps.Point(20, 5) // anchor
    // };

    let icon = {
      path: google.maps.SymbolPath.CIRCLE,
      fillColor: 'white',
      fillOpacity: 0.6,
      strokeColor: '#00A',
      strokeOpacity: 0,
      strokeWeight: 0,
      scale: 0
    }

    let markarOptions = {
      position: loc,
      // icon: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png',
      icon: icon,
      map: _base.map
    };

    if (_base.marker) {
      if (!_base.endingLatitude) {
        _base.moveCamera(loc);
      }
      _base.marker.setPosition(loc);
    } else {
      _base.moveCamera(loc);
      _base.marker = new google.maps.Marker(markarOptions);
    }
  }

  createDestinationMarker(loc: any) {
    // console.clear();
    let _base = this;
    const image = {
      url: './assets/img/destination.png',
      size: {
        width: 30,
        height: 50
      }
    };
    let markarOptions = {
      position: loc
    };
    if (_base.destinationmarker) {
      _base.destinationmarker.setPosition(loc);
      let start = new google.maps.LatLng(_base.startLatitude, _base.startLongitude);
      let end = new google.maps.LatLng(_base.endingLatitude, _base.endingLongitude);
      _base.showRoute(start, end);
    } else {

      _base.destinationmarker = new google.maps.Marker(markarOptions);
      let start = new google.maps.LatLng(_base.startLatitude, _base.startLongitude);
      let end = new google.maps.LatLng(_base.endingLatitude, _base.endingLongitude);
      _base.showRoute(start, end);
    }
  }

  resizeViewport(start, end) {
    // let points = [start, end];
    // let options: any = {
    //   target: points,
    //   padding: 70
    // };
    // this.map.moveCamera(options);
  }

  // moveMarker(start: LatLng, end: LatLng, marker: Marker) {
  //   let fraction = 0;
  //   let direction = 1;
  //   let interval = setInterval(function () {
  //     fraction += 0.01 * direction;
  //     if (fraction >= 1) {
  //       clearInterval(interval);
  //     }
  //     marker.setPosition(new google.maps.geometry.spherical.interpolate(start, end, fraction));
  //   }, 50);
  // }

  makeMarker(position, icon) {

    let sicon = {
      url: "https://cdn1.iconfinder.com/data/icons/Map-Markers-Icons-Demo-PNG/256/Map-Marker-Ball-Chartreuse.png", // url
      scaledSize: new google.maps.Size(40, 40), // scaled size
      origin: new google.maps.Point(0, 0), // origin
      anchor: new google.maps.Point(20, 40) // anchor
    };

    let eicon = {
      url: "https://www.stickpng.com/assets/images/588891ecbc2fc2ef3a1860a4.png", // url
      scaledSize: new google.maps.Size(40, 50), // scaled size
      origin: new google.maps.Point(0, 0), // origin
      anchor: new google.maps.Point(10, 45) // anchor
    };
    let _base = this;

    if (icon == 'start') {
      if (_base.originmarker) {
        _base.originmarker.setMap(null)
      }
    } else {
      if (_base.destinationmarker) {
        _base.destinationmarker.setMap(null);
      }
    }
    let marker = new google.maps.Marker({
      position: position,
      map: _base.map,
      icon: icon == 'start' ? sicon : eicon
    });
    if (icon == 'start') {
      _base.originmarker = marker
    } else {
      _base.destinationmarker = marker;
    }
  }

  showRoute(origin, destination) {

    //   // url: "https://lemi.travel/images/current.png",
    //   // url: "https://cdn1.iconfinder.com/data/icons/Map-Markers-Icons-Demo-PNG/256/Map-Marker-Ball-Chartreuse.png", // url
    //   scaledSize: new google.maps.Size(40, 40), // scaled size
    //   origin: new google.maps.Point(0, 0), // origin
    //   anchor: new google.maps.Point(20, 5) // anchor
    var icons = {
      start: new google.maps.MarkerImage(
        // URL
        'https://cdn1.iconfinder.com/data/icons/Map-Markers-Icons-Demo-PNG/256/Map-Marker-Ball-Chartreuse.png',
        // (width,height)
        new google.maps.Size(40, 30),
        // The origin point (x,y)
        new google.maps.Point(0, 0),
        // The anchor point (x,y)
        new google.maps.Point(20, 5)
      ),
      end: new google.maps.MarkerImage(
        // URL
        'https://cdn.imgbin.com/8/3/6/imgbin-drawing-pin-marker-pen-google-map-maker-google-maps-pushpin-AKt1BYE9dbp032r9yqAc7QCsG.jpg',
        // (width,height)
        new google.maps.Size(40, 40),
        // The origin point (x,y)
        new google.maps.Point(0, 0),
        // The anchor point (x,y)
        new google.maps.Point(20, 5)
      )
    };

    let _base = this;
    _base.directionsDisplay.setMap(null);
    _base.directionsDisplay = new google.maps.DirectionsRenderer({
      polylineOptions: {
        strokeColor: "grey"
      },
      suppressMarkers: true
    });
    var directionsService = new google.maps.DirectionsService();

    _base.directionsDisplay.setMap(_base.map);
    // _base.makeMarker(origin, icons.start)
    _base.makeMarker(destination, icons.end)
    var request = {
      origin: origin,
      destination: destination,
      travelMode: google.maps.TravelMode.DRIVING
    };


    directionsService.route(request, function (response, status) {

      if (status == google.maps.DirectionsStatus.OK) {


        let leg = response.routes[0].legs[0];
        _base.makeMarker(leg.start_location, 'start');
        _base.makeMarker(leg.end_location, 'end');

        _base.directionsDisplay.setDirections(response);
        _base.directionsDisplay.setMap(_base.map);
        _base.distance = response.routes[0].legs[0].distance.text;
        let distance = response.routes[0].legs[0].distance.value;
        let duration = response.routes[0].legs[0].duration.value;
        _base.calculate(distance, duration);
        _base.drawrouteanimation(response.routes[0].overview_path);
      } else {
        _base.endAddress = null;
        alert("");
      }
    });
  }

  drawrouteanimation(coords: any) {
    // Define the LatLng coordinates for the polygon's path.

    let length = coords.length;
    let _base = this;
    let count = 0;
    if (_base.interval != null) {
      clearInterval(_base.interval)
    }

    _base.interval = setInterval(function () {
      let triangleCoords = [coords[count + 0], coords[count + 1], coords[count + 2], coords[count + 4], coords[count + 5], coords[count + 6], coords[count + 7], coords[count + 8], coords[count + 9], coords[count + 10]];
      count = count + 10;

      if (count >= length - 10) {
        count = 0;
      } else {
        if (_base.polygon != null) {
          _base.polygon.setMap(null)
        }
        // Construct the polygon.
        _base.polygon = new google.maps.Polygon({
          paths: triangleCoords,
          strokeColor: '#ff0000',
          strokeOpacity: 1,
          strokeWeight: 5,
          // fillColor: '#FF0000',
          fillOpacity: 0,
          zIndex: 100
        });
        _base.polygon.setMap(_base.map);
      }
    }, 70)

  }


  // calculate price between source and deistination

  calculate(distance, duration) {


    let mileDistance = distance * 0.000621371;
    let minuteDuration = duration / 60;
    let _base = this;
    _base.cabTypes.forEach(element => {
      let minutes = parseFloat(element.perMinutes);
      let miles = parseFloat(element.perMile);
      let minimum = parseFloat(element.minimum);
      let maximum = parseFloat(element.maximum);
      let service = parseFloat(element.serviceFee);
      let initial = parseFloat(element.initialCost);
      let cost = initial + service + mileDistance * mileDistance + minuteDuration * minutes;
      let maxCost = 0;
      if (cost < minimum) {
        cost = 5;
      } else if (cost > maximum) {
        cost = 0;
      }
      element.cost = Math.ceil(cost);
    });

  }



  /*
  Marker creation on google map to show the available driver after search
  */

  createMarkarOne(loc: any, driverDetails: any) {
    let _base = this;

    var icon = {
      url: "./assets/image.png?id=" + driverDetails._id,
      // url: "https://cdn1.iconfinder.com/data/icons/Map-Markers-Icons-Demo-PNG/256/Map-Marker-Ball-Chartreuse.png", // url
      scaledSize: new google.maps.Size(50, 50), // scaled size
      origin: new google.maps.Point(0, 0), // origin
      anchor: new google.maps.Point(25, 25) // anchor
    };

    let markarOptions = {
      position: loc,
      icon: icon,
      map: _base.map,
      title: driverDetails._id
    };

    let index = _base.getDriverIndex(driverDetails._id);
    if (index != -1) {
      let element = <HTMLElement>document.querySelector('img[src = "./assets/image.png?id=' + driverDetails._id + '"]');
      if(element){
        element.style.transform = "rotate(" + driverDetails.heading + "deg)";
      }
      setTimeout(function () {
        _base.animatedMove(_base.nearestDrivers[index].marker, 1, _base.nearestDrivers[index].marker.position, loc)
      }, 1000);
    } else {

      let marker = new google.maps.Marker(markarOptions);
      _base.nearestDrivers.push({
        id: driverDetails._id,
        details: driverDetails,
        marker: marker
      });

      setTimeout(function () {
        let element = <HTMLElement>document.querySelector('img[src = "./assets/image.png?id=' + driverDetails._id + '"]');
        if(element){
          element.style.transitionDuration = "1s";
        }
      }, 500)
    }
  }

  removeDriver(data) {
    let _base = this;
    return new Promise(function (resolve, reject) {
      if (_base.nearestDrivers.length == 0) {
        resolve(true);
      } else {
        for (let i = 0; i < _base.nearestDrivers.length; i++) {
          let id = _base.nearestDrivers[i].id;
          let index = _base.getNewDataDriverIndex(id, data);
          if (index == -1) {
            _base.nearestDrivers[i].marker.setMap(null);
            _base.nearestDrivers.splice(i, 1);
          }
          if (i == _base.nearestDrivers.length - 1) {
            resolve(true);
          }
        }
      }
    });
  }

  /** get driver index **/
  getDriverIndex(driverID: any) {
    let _base = this;
    if (_base.nearestDrivers.length == 0) {
      return -1;
    } else {
      for (let i = 0; i < _base.nearestDrivers.length; i++) {
        if (_base.nearestDrivers[i].id == driverID) {
          return i;
        }
        if (i == _base.nearestDrivers.length - 1) {
          return -1;
        }
      }
    }
  }

  getNewDataDriverIndex(driverID, data: any) {
    let _base = this;
    if (data.driverDetails.length == 0) {
      return -1;
    }
    for (let i = 0; i < data.driverDetails.length; i++) {
      let ID = data.driverDetails[i]._id;
      if (driverID == ID) {
        return i;
      }
      if (i == data.driverDetails.length - 1) {
        return -1;
      }
    }
  }



  /*
  Driver booking
  */

  bookDriver() {

    let _base = this;

    if (_base.startLatitude == null || _base.startLatitude == undefined) {
      alert(_base.string.noPickUp);
      return;
    }
    if (_base.startLongitude == null || _base.startLongitude == undefined) {
      alert(_base.string.noPickUp);
      return;
    }
    if (_base.endingLatitude == null || _base.endingLatitude == undefined) {
      alert(_base.string.noDropOff);
      return;
    }
    if (_base.endingLongitude == null || _base.endingLongitude == undefined) {
      alert(_base.string.noDropOff);
      return;
    }
    if (_base.selectedCar == null) {
      alert(_base.string.selectCar);
      return;
    }

    var value = {
      userId: _base.id,
      pickUpLocation: {
        latitude: _base.startLatitude,
        longitude: _base.startLongitude
      },
      destination: {
        latitude: JSON.stringify(_base.endingLatitude),
        longitude: JSON.stringify(_base.endingLongitude)
      },
      startLocation: _base.startAddress,
      endLocation: _base.endAddress,
      distance: _base.distance,
      carType: _base.cartype.name,
      amount: _base.cabTypes.amount
    }

    let bookLoader = _base.loadingCtrl.create({
      content: _base.string.searchingDriver
    });
    bookLoader.present();

    _base.appService.driverBooking(value, (error, data) => {
      let bookData = data.result;
      bookLoader.dismiss();

      if (error) {

        alert(_base.string.serverError);
      }
      else if (!data.error) {



        _base.driverId = data.result.driverId._id;
        _base.phone = data.result.driverId.phoneNumber;
        _base.tempOtp = bookData.code;


        _base.drivername = data.result.driverId.firstName + " " + data.result.driverId.lastName;
        localStorage.setItem("driverName", _base.drivername);
        let location = data.result.driverId.location;




        _base.calculateBookedCab(location[1], location[0]);

        _base.rideMode = true;
        _base.waitingLoader = _base.loadingCtrl.create({
          content: _base.string.driverConfirmation
        });

        _base.waitingLoader.present();
        _base.stopSearch();

      } else if (data.error) {
        this.message = data.message;
        alert(this.message);
      }
    });
  }

  startSearch() {
    let _base = this;
    this.driverSearch = setInterval(function () {
      _base.searchDrivers();
    }, 3000);
  }

  stopSearch() {
    clearInterval(this.driverSearch);
  }

  searchDrivers() {

    let _base = this;
    var data = {
      latitude: this.startLatitude,
      longitude: this.startLongitude
    }
    let loading;

    this.appService.searchDriver(data, (error, data) => {

      if (error) {

      }
      else if (data) {

        if (data.error == true) {
          // this.message = data.message;
          // this.showToast('top');
        }
        else if (data.error == false) {
          if (data.driverDetails) {
            _base.availableCars = data.driverDetails;
            _base.calculateCarDistance();

            _base.removeDriver(data)
              .then(function () {
                for (var i = 0; i < data.driverDetails.length; i++) {
                  let driverDetails = data.driverDetails[i];
                  let location = data.driverDetails[i].location;
                  let driverID = data.driverDetails[i]._id;
                  var lat = location[1];
                  var lon = location[0];
                  let loc = new google.maps.LatLng(lat, lon);
                  _base.createMarkarOne(loc, data.driverDetails[i]);
                }
              });
          }
        }
      }
    });
  }


  calculateCarDistance() {
    let _base = this;
    let cars = this.availableCars;
    let distanceCars = [];
    if (cars.length == 0) {
      this.selectedCar = null;
      this.cartype = null;
      _base.cabTypes.map(element => {
        delete element.duration;
      });
    }
    cars.forEach(element => {

      let lng = element.location[0];
      let lat = element.location[1];
      let type = element.carType;

      let end = new google.maps.LatLng(_base.startLatitude, _base.startLongitude);
      let start = new google.maps.LatLng(lat, lng);

      var directionsService = new google.maps.DirectionsService();

      var request = {
        origin: start,
        destination: end,
        travelMode: google.maps.TravelMode.DRIVING
      };

      directionsService.route(request, function (response, status) {
        if (status == google.maps.DirectionsStatus.OK) {
          let duration = response.routes[0].legs[0].duration.text;

          _base.cabTypes.map(element => {
            let name = element.name;

            if (name == type) {

              distanceCars.push(name);
              if (element.duration && element.duration > duration) {

                element.duration = duration;
              } else if (!element.duration) {

                element.duration = duration;
              }
            }
          });

          _base.cabTypes.map(element => {
            if (distanceCars.indexOf(element.name) == -1) {
              delete element.duration;
            }
            if (_base.cartype && distanceCars.indexOf(_base.cartype.name) == -1) {
              _base.selectedCar = null;
              _base.cartype = null;
            }
          });

        }
      });
    });
  }

  calculateBookedCab(lat, lng) {
    let _base = this;

    let end = new google.maps.LatLng(_base.startLatitude, _base.startLongitude);
    let start = new google.maps.LatLng(lat, lng);

    var directionsService = new google.maps.DirectionsService();

    var request = {
      origin: start,
      destination: end,
      travelMode: google.maps.TravelMode.DRIVING
    };

    directionsService.route(request, function (response, status) {
      if (status == google.maps.DirectionsStatus.OK) {
        let duration = response.routes[0].legs[0].duration.text;
        let distance = response.routes[0].legs[0].distance.value;
        _base.arrivingDistance = distance;
        _base.arrivingDuration = duration;

      }
    });
  }

  /*
  Display message
  */
  showToast(position: string) {
    let toast = this.toastCtrl.create({
      message: this.message,
      duration: 3000,
      position: 'top'
    });

    toast.present(toast);
  }

  // modal box
  openModal(characterNum) {

    let modal = this.modalCtrl.create("ModalcontentPage", characterNum);
    modal.present();
  }

  //change driver status
  changeStatus(status) {
    let _base = this;
    this.appService.updateUserStatus(status, this.id, this.socket.id, (error, data) => {
      if (error) {
        _base.showToast(_base.string.updateError);
      }
      else {
        _base.showToast(_base.string.onlineStatus + status);
      }
    });
  }

  presentToast(message: any) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000
    });
    toast.present();
  }


  //  get cab types
  getCabTypes() {
    let _base = this;
    let loading = this.loadingCtrl.create({ content: _base.string.pleaseWait });
    loading.present();
    _base.appService.getCabTypes((error, data) => {
      loading.dismiss();
      if (error) {

      } else {
        if (data) {

          _base.cabTypes = data.results;
        }
      }
    });
  }


  // select car
  selectCar(i, car) {
    let _base = this;
    if (car.duration) {
      this.selectedCar = i;
      this.cartype = car;
      let _base = this;
      this.calculateAmount()
        .then(function (success: any) {

          if (parseInt(_base.cartype.maximum) < success.cost) {
            alert("This ride exceeds maximum ride cost");
            _base.cartype = {};
            _base.selectedCar = null;
          } else if (parseInt(_base.cartype.minimum) > success.cost) {
            alert("You will be charged minimum amount $" + this.cartype.minimum + "U.S.D")
          } else {
            alert("Car selected " + _base.cartype.name);
          }
        });

    } else {

      alert(car.name + ' car ' + this.string.notAvailable);
    }
  }


  // get penging payments
  getPendingPayments() {
    var _base = this;
    var loading = this.loadingCtrl.create({
      content: _base.string.gettingPayments
    });
    loading.present();
    return new Promise(function (resolve, reject) {
      _base.appService.getPendingPayments(_base.id, function (error, data) {
        loading.dismiss();
        if (error) {
          reject(error);
        }
        else {
          if (data) {
            resolve(data);
          }
        }
      });
    });
  }

  // get cards
  getCards() {
    var _base = this;
    var loading = this.loadingCtrl.create({
      content: _base.string.gettingCards
    });
    loading.present();
    return new Promise(function (resolve, reject) {
      _base.appService.getCards(_base.id, function (error, data) {
        loading.dismiss();
        if (error) {
          reject(error);
        }
        else {
          if (data) {
            resolve(data);
          }
        }
      });
    });
  }

  attemptPayment() {
    let _base = this;
    let card = {
      number: this.cards[0].number,
      expMonth: this.cards[0].expmonth,
      expYear: this.cards[0].expyear,
      cvc: this.cards[0].cvv
    };

    var loading = this.loadingCtrl.create({
      content: _base.string.makingPayment
    });
    loading.present();

    this.stripe.createCardToken(card)
      .then(token => {
        let tokenID = token.id;

        _base.chargeCard(tokenID)
          .then(function (response: any) {
            loading.dismiss();

            if (response.error) {
              alert(response.message);
            } else {
              alert("Payment successfull");
              _base.navCtrl.push("RatingPage");
            }
          }, function (error) {
            loading.dismiss();

            alert("Error processing payment");
            _base.navCtrl.push("RatingPage");
          });
      })
      .catch(error => {
        loading.dismiss();

        alert("Error processing the payment.");
        _base.navCtrl.push("RatingPage");
      });
  }

  //charge card
  chargeCard(token) {
    var _base = this;
    let paymentData = {
      userId: this.id,
      token: token
    }
    return new Promise(function (resolve, reject) {
      _base.appService.chargeCard(paymentData, function (error, data) {
        if (error) {
          reject(error);
        }
        else {
          if (data) {
            resolve(data);
          }
        }
      });
    });
  }

  // fetch current riding
  fetchCurrentRide() {
    var _base = this;
    let id = this.id;
    return new Promise(function (resolve, reject) {
      _base.appService.getCurrentRide(id, function (error, data) {
        if (error) {
          reject(error);
        }
        else {
          if (data) {
            resolve(data);
          }
        }
      });
    });
  }

  animatedMove(marker, t, current, moveto) {
    var lat = current.lat();
    var lng = current.lng();

    var deltalat = (moveto.lat() - current.lat()) / 100;
    var deltalng = (moveto.lng() - current.lng()) / 100;

    var delay = 10 * t;
    for (var i = 0; i < 100; i++) {
      (function (ind) {
        setTimeout(
          function () {
            var lat = marker.position.lat();
            var lng = marker.position.lng();
            lat += deltalat;
            lng += deltalng;
            let latlng = new google.maps.LatLng(lat, lng);
            marker.setPosition(latlng);
          }, delay * ind
        );
      })(i)
    }
  }

}


