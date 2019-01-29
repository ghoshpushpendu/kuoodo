import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, NavParams, ModalController, IonicPage, ToastController } from 'ionic-angular';
import { Geolocation, GeolocationOptions } from '@ionic-native/geolocation';
import { AlertController, LoadingController } from 'ionic-angular';
import { HttpService } from '../../app.httpService';
import { Stripe } from '@ionic-native/stripe';

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
  public startAddress: any = "fetching pickup location ...";
  public endAddress: any;
  public distance: string;
  public driverNode: any;
  public userData: any;
  arrival_status: any = "arriving";

  public locationCircle: any;

  public images: any = [1, 2, 3, 4, 5, 6];


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
      console.log(data);
      console.log(data.userId);
      console.log(data.userId._id);
      console.log("Ride has been accepted", userID);
      console.log("Current userID", _base.id);
      if (userID == _base.id) {
        console.log("Vitore gachhe .......");
        _base.waitingLoader.dismiss();
        _base.showToast("Ride request has been accepted");
        console.log("ride request has been accepted");
        _base.rideMode = true;

        //subscribe to driver location update
        _base.socket.on(_base.driverId + "-location", (data) => {
          console.log(data.lat);
          console.log(data.lng);
          _base.showDriver(data.lat, data.lng);

        })
      } else {
        console.log("Baire gachhe ! .....");
      }
    });


    this.socket.on("rejected", (data) => {
      let userID = data.userId._id;
      // console.log("Ride has been rejected");
      if (userID == _base.id) {
        _base.waitingLoader.dismiss();
        _base.showToast("Ride request has been rejected");
        _base.rideMode = false;
        _base.startSearch();
      }
    });


    this.socket.on("arrived", (data) => {
      let userID = data.userId._id;
      console.log("Driver has arrived");
      if (userID == _base.id) {
        _base.otp = _base.tempOtp;
        _base.arrival_status = "arrived";
        _base.showToast("Driver has arrived");
        _base.showJourneyRoute();
      }
    });

    this.socket.on("start", (data) => {
      let userID = data.userId._id;
      console.log("Ride has been started");
      if (userID == _base.id) {
        _base.otp = "";
        _base.showToast("Ride has been started");
        _base.socket.removeListener(_base.driverId + "-location", function () {
          console.log("Driver current location request stopped");
        });
      }
    });

    this.socket.on("end", (data) => {
      let userID = data.userId._id;
      let driverID = data.driverId._id;
      if (userID == _base.id) {
        _base.showToast("Ride has completed");
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

  ionViewDidLeave() {
    this.stopSearch();
  }

  showAddressModal() {
    let modal = this.modalCtrl.create("AutocompletePage");
    let _base = this;
    modal.onDidDismiss(data => {
      if (Object.keys(data).length != 0) {
        _base.endAddress = data.location;
        _base.endingLatitude = data.lat;
        _base.endingLongitude = data.lng;
        let loc = new google.maps.LatLng(_base.endingLatitude, _base.endingLongitude);
        _base.createDestinationMarker(loc);
      } else {
        console.log("no data");
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
              content: 'driver accepted ride request...'
            });

            loading.present();

            setTimeout(() => {
              loading.dismiss();
            }, 2000);
          } else if (data.status == 'ridecancel') {
            _base.waitingLoader.dismiss();
            let loading = this.loadingCtrl.create({
              content: 'driver canceled ride request...'
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
        console.log("Error in fetching profile :", error);
      } else {
        if (data) {
          _base.appService.updateUser(data.user);
          _base.userData = data.user;
          // console.log(data);
        }
      }
    });

    //checking pending payments
    _base.getPendingPayments()
      .then(function (success: any) {
        console.log("success - getting payments", success);
        if (success.result.length) {
          if (success.result[0].amount >= 0) {
            _base.nav.push("PaymentsPage");
          }
        }
      }, function (error) {
        console.log("error - getting payments", error);
      });

    //checking payment methods
    _base.getCards()
      .then(function (success: any) {
        if (success.cards.length == 0) {
          alert("Please add a payment method to book ride");
          _base.navCtrl.push("PaymentsPage");
        } else {
          _base.cards = success.cards;
        }
      }, function (error) {
        _base.navCtrl.push("PaymentsPage");
        _base.showToast("can not get card");
      });

    console.log("================================================================")
    _base.fetchCurrentRide()
      .then(function (response: any) {
        if (!response.error) {
          console.log("Current ride details :", response);
          if (response.result.length != 0) {
            // alert("You are in a ride")
            console.log(response);
            let booking = response.result[0];
          }
        }
      }, function (error: any) {
        console.log("Ride fetch error is :", error);
      });

    if (sessionStorage.getItem("location") == "enabled") {
      _base.setCurrentLocation();
    }
  }


  // this function is not in use currently
  public mapRideData(data: any) {
    let _base = this;
    if (data.status == 'Booked') {
      _base.showToast("Ride request has been accepted");
      console.log("ride request has been accepted");
      _base.rideMode = true;
      _base.driverId = data.driverId._id;
      console.log("Ride in booked mode =============================", data);

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
        console.log(data.lat);
        console.log(data.lng);
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
    var uluru = { lat: -25.344, lng: 131.036 };
    let options = {
      zoom: 19, center: uluru, disableDefaultUI: true, mapTypeId: 'terrain', gestureHandling: 'none',
      zoomControl: false
    };
    this.map = new google.maps.Map(document.getElementById('map'), options);

    google.maps.event.addListenerOnce(_base.map, 'idle', function () {
      // do something only the first time the map is loaded
      _base.setCurrentLocation();
    });
  }

  setCurrentLocation() {
    let _base = this;
    console.log("map loaded");

    sessionStorage.setItem("location", "enabled");

    let loader = _base.loadingCtrl.create({
      content: 'Searching location....'
    });
    loader.present();
    _base.getLocation().then((res) => {
      // console.log(res);
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
            console.log('No results found');
          }
        } else {
          console.log('Geocoder failed due to: ' + status);
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

  //calculate and draw route
  calculateMaps(start, end) {
    this.directionsService.route({
      origin: start,
      destination: end,
      travelMode: 'DRIVING'
    }, (response, status) => {
      if (status === 'OK') {
        console.log(response);
      } else {
        console.log('Directions request failed due to ' + status);
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


    let markarOptions = {
      position: loc,
      icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
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

  showRoute(origin, destination) {

    let _base = this;
    _base.directionsDisplay.setMap(null);
    _base.directionsDisplay = new google.maps.DirectionsRenderer({
      polylineOptions: {
        strokeColor: "black"
      }
    });
    var directionsService = new google.maps.DirectionsService();

    _base.directionsDisplay.setMap(_base.map);
    var request = {
      origin: origin,
      destination: destination,
      travelMode: google.maps.TravelMode.DRIVING
    };

    console.log(request);
    directionsService.route(request, function (response, status) {
      console.log(response);
      if (status == google.maps.DirectionsStatus.OK) {
        _base.directionsDisplay.setDirections(response);
        _base.directionsDisplay.setMap(_base.map);
        _base.distance = response.routes[0].legs[0].distance.text;
        let distance = response.routes[0].legs[0].distance.value;
        let duration = response.routes[0].legs[0].duration.value;
        _base.calculate(distance, duration);
      } else {
        _base.endAddress = null;
        alert("Unexpected destination");
      }
    });
  }


  // calculate price between source and deistination

  calculate(distance, duration) {
    console.log("distance", distance);
    console.log("duration", duration);
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
    console.log(this.cabTypes);
  }



  /*
  Marker creation on google map to show the available driver after search
  */

  createMarkarOne(loc: any, driverDetails: any) {
    let _base = this;

    let markarOptions = {
      position: loc,
      icon: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png',
      map: _base.map
    };

    let index = _base.getDriverIndex(driverDetails._id);
    if (index != -1) {
      _base.nearestDrivers[index].marker.setPosition(loc);
    } else {

      let marker = new google.maps.Marker(markarOptions);
      _base.nearestDrivers.push({
        id: driverDetails._id,
        details: driverDetails,
        marker: marker
      });
    }
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
            _base.nearestDrivers[i].marker.setMap(null); // remove no existing driver
            _base.nearestDrivers.splice(i, 1);
          }
          if (i == _base.nearestDrivers.length - 1) {
            resolve(true);
          }
        }
      }
    });
  }

  /*
  Driver booking
  */

  bookDriver() {

    let _base = this;

    if (_base.startLatitude == null || _base.startLatitude == undefined) {
      alert("No pickup location");
      return;
    }
    if (_base.startLongitude == null || _base.startLongitude == undefined) {
      alert("No pickup location");
      return;
    }
    if (_base.endingLatitude == null || _base.endingLatitude == undefined) {
      alert("No drop off location");
      return;
    }
    if (_base.endingLongitude == null || _base.endingLongitude == undefined) {
      alert("No drop off location");
      return;
    }
    if (_base.selectedCar == null) {
      alert("Select a car type to book");
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
      content: 'Searching and booking driver...'
    });
    bookLoader.present();

    _base.appService.driverBooking(value, (error, data) => {
      let bookData = data.result;
      bookLoader.dismiss();

      if (error) {
        console.log(error);
        alert("Server error . Try again");
      }
      else if (!data.error) {

        console.log("Driver details =========>", data);

        _base.driverId = data.result.driverId._id;
        _base.phone = data.result.driverId.phoneNumber;
        _base.tempOtp = bookData.code;


        _base.drivername = data.result.driverId.firstName + " " + data.result.driverId.lastName;
        localStorage.setItem("driverName", _base.drivername);
        let location = data.result.driverId.location;

        console.log(_base.startLatitude, _base.startLongitude);
        console.log(location[1], location[0]);

        _base.calculateBookedCab(location[1], location[0]);

        _base.rideMode = true;
        _base.waitingLoader = _base.loadingCtrl.create({
          content: 'Please wait for driver confirmation...'
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
    }, 5000);
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
        console.log(error);
      }
      else if (data) {
        console.log("Drivers", data);
        if (data.error == true) {
          this.message = data.message;
          this.showToast('top');
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
      console.log("element", element);
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
          console.log("Duration is :", duration);
          _base.cabTypes.map(element => {
            let name = element.name;
            console.log(name, type);
            if (name == type) {
              console.log(name, "==", type);
              distanceCars.push(name);
              if (element.duration && element.duration > duration) {
                console.log("Condition 1");
                element.duration = duration;
              } else if (!element.duration) {
                console.log("Condition 2");
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
          console.log("Cab types after adding duration", _base.cabTypes);
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
        console.log("Cab types after adding duration", _base.cabTypes);
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


  // alert box

  showAlert() {
    let alert = this.alertCtrl.create();

    alert.addInput({
      type: 'checkbox',
      label: 'Driver Name',
      value: 'Driver Name:john doe',
      checked: true
    });
    alert.addInput({
      type: 'checkbox',
      label: 'John Doe',
      value: 'Start Location: Lorem Ipsum',
      checked: true
    });
    alert.addInput({
      type: 'checkbox',
      label: 'Alderaan',
      value: 'End Location: Lorem Ipsum',
      checked: true
    });
    alert.addInput({
      type: 'checkbox',
      label: 'Alderaan',
      value: 'Fare:250',
      checked: true
    });

    alert.addButton({
      text: 'OK',
    });

    alert.present();
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
        _base.showToast("Can not update status");
      }
      else {
        _base.showToast("You are now " + status);
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
    let loading = this.loadingCtrl.create({ content: 'Feching required data...' });
    loading.present();
    _base.appService.getCabTypes((error, data) => {
      loading.dismiss();
      if (error) {
        console.log("Internet connection error , getting cab types");
      } else {
        if (data) {
          console.log("All cab types", data.results);
          _base.cabTypes = data.results;
        }
      }
    });
  }


  // select car
  selectCar(i, car) {
    if (car.duration) {
      this.selectedCar = i;
      this.cartype = car;
    } else {
      console.log("No available");
      alert(car.name + " is not available here.");
    }
  }


  // get penging payments
  getPendingPayments() {
    var _base = this;
    var loading = this.loadingCtrl.create({
      content: 'Getting pending payments...'
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
      content: 'Getting cards...'
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
      content: 'Making the payment...'
    });
    loading.present();

    this.stripe.createCardToken(card)
      .then(token => {
        let tokenID = token.id;
        console.log("Payment token :", token);
        _base.chargeCard(tokenID)
          .then(function (response: any) {
            loading.dismiss();
            console.log("Payment response :", response);
            if (response.error) {
              alert(response.message);
            } else {
              alert("Payment successfull");
              _base.navCtrl.push("RatingPage");
            }
          }, function (error) {
            loading.dismiss();
            console.log("Error in payment", error);
            alert("Error processing payment");
            _base.navCtrl.push("RatingPage");
          });
      })
      .catch(error => {
        loading.dismiss();
        console.log("Error processing payment", error);
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

}


