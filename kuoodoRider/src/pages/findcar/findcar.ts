import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, NavParams, ModalController, IonicPage, ToastController } from 'ionic-angular';
import { Geolocation, GeolocationOptions } from '@ionic-native/geolocation';
import { AlertController, LoadingController } from 'ionic-angular';
import { HttpService } from '../../app.httpService';

declare var google;
import {
  GoogleMaps,
  GoogleMap,
  GoogleMapsEvent,
  MarkerOptions,
  LatLng,
  GoogleMapOptions,
  PolylineOptions,
  Marker
} from '@ionic-native/google-maps';
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

  constructor(public nav: NavController,
    public navCtrl: NavController,
    public modalCtrl: ModalController,
    public navParams: NavParams,
    private _googleMaps: GoogleMaps,
    private _geoLoc: Geolocation,
    private httpService: HttpService,
    private appService: AppService,
    private localStorageProvider: LocalStorageProvider,
    private alertCtrl: AlertController,
    public toastCtrl: ToastController,
    public googlemaps: GoogleMaps,
    public loadingCtrl: LoadingController) {

    let _base = this;

    this.socket = io(this.httpService.url);
    this.socket.on('connect', () => {
      this.changeStatus("Online")
    });

    this.socket.on('disconnect', () => {
      this.changeStatus("Offline");
    });

    this.socket.on("accepted", (data) => {
      let userID = data.userId._id;
      console.log("rider request has been accepted");
      // console.log("Ride has been accepted");
      if (userID == _base.id) {
        _base.waitingLoader.dismiss();
        _base.showToast("Ride request has been accepted");
        _base.rideMode = true;

        //subscribe to driver location update
        _base.socket.on(_base.driverId + "-location", (data) => {
          console.log(data.lat);
          console.log(data.lng);
        })

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
        let price = data.price;
        _base.nav.setRoot("PaymentPage", {
          "driverID": driverID,
          "paymentAmount": price
        });
        _base.rideMode = false;
      }
    });

    this.appService.PaymentStutus.subscribe(function (payment) {
      if (payment) {
        if (payment.status == "success") {
          location.reload();
          _base.socket.emit("payment", {
            driverId: _base.driverId
          });
          _base.nav.setRoot("RatingPage", {
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
  }

  calculateFare() {

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

    /*
    Google map autocomplete function call
    */
    this.autocompleteText();

    let loc: LatLng;

    /*
    Initialize the google map
    */
    this.initMap();
  }

  /*
  Initialize the google map
  */

  initMap() {
    let _base = this;
    var uluru = { lat: -25.344, lng: 131.036 };
    let options = {
      zoom: 16, center: uluru, disableDefaultUI: true, mapTypeId: 'terrain', gestureHandling: 'none',
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

    let loader = _base.loadingCtrl.create({
      content: 'Searching location...'
    });
    loader.present();
    _base.getLocation().then((res) => {
      // console.log(res);
      this.response = res;
      this.startLatitude = res.coords.latitude;
      this.startLongitude = res.coords.longitude;
      var latlng = { lat: parseFloat(this.startLatitude), lng: parseFloat(this.startLongitude) };
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

      let loc = new LatLng(res.coords.latitude, res.coords.longitude);
      let endingLoc = new LatLng(this.endingLatitude, this.endingLongitude)
      this.createMarkar(loc, res.coords.accuracy);
      if (this.directionsService) {
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
  calculateAndDisplayRoute(start, end) {
    let _base = this;
    const mapi = _base.map;
    this.directionsDisplay.setMap(mapi);
    this.directionsService.route({
      origin: start,
      destination: end,
      travelMode: 'DRIVING'
    }, (response, status) => {
      if (status === 'OK') {
        _base.directionsDisplay.setDirections(response);
      } else {
        console.log('Directions request failed due to ' + status);
      }
    });
  }

  /*
  Google map autocomplete area to take the location and 
  ending latitude and longitude
  */

  autocompleteText() {

    var input = (<HTMLInputElement>document.getElementById('pac-input'));

    let autocomplete = new google.maps.places.Autocomplete(input);

    let _base = this;

    autocomplete.addListener('place_changed', function () {
      var address = autocomplete.getPlace();
      var place = address.formatted_address;
      _base.endAddress = place;
      var latitude = address.geometry.location.lat();
      _base.endingLatitude = latitude;
      var longitude = address.geometry.location.lng();
      _base.endingLongitude = longitude;
      let loc = new LatLng(_base.endingLatitude, _base.endingLongitude);
      _base.createDestinationMarker(loc);
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
    let input = <HTMLInputElement>document.getElementById("pac-input");
    input.value = "";
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

  moveCamera(loc: LatLng) {
    this.map.setCenter(loc, 14);
  }

  /*
  Marker creation in google map on starting latitude and longitude
  */

  createMarkar(loc: LatLng, accuracy: number) {

    let _base = this;

    var icon = {
      url: "https://hoodmaps.com/assets/self-map-marker.png", // url
      scaledSize: new google.maps.Size(50, 50), // scaled size
      origin: new google.maps.Point(0, 0), // origin
      anchor: new google.maps.Point(18, 37) // anchor
    };

    let markarOptions = {
      position: loc,
      icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
      map: _base.map
    };

    if (_base.marker) {
      _base.moveCamera(loc);
      _base.marker.setPosition(loc);
    } else {
      _base.moveCamera(loc);
      _base.marker = new google.maps.Marker(markarOptions);
    }
  }

  createDestinationMarker(loc: LatLng) {
    // console.clear();
    let _base = this;
    const image = {
      url: './assets/img/destination.png',
      size: {
        width: 30,
        height: 50
      }
    };
    let markarOptions: MarkerOptions = {
      position: loc
    };
    if (_base.destinationmarker) {
      _base.destinationmarker.setPosition(loc);
      let start = new LatLng(_base.startLatitude, _base.startLongitude);
      let end = new LatLng(_base.endingLatitude, _base.endingLongitude);
      _base.showRoute(start, end);
    } else {

      _base.destinationmarker = new google.maps.Marker(markarOptions);
      let start = new LatLng(_base.startLatitude, _base.startLongitude);
      let end = new LatLng(_base.endingLatitude, _base.endingLongitude);
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

  moveMarker(start: LatLng, end: LatLng, marker: Marker) {
    let fraction = 0;
    let direction = 1;
    let interval = setInterval(function () {
      fraction += 0.01 * direction;
      if (fraction >= 1) {
        clearInterval(interval);
      }
      marker.setPosition(new google.maps.geometry.spherical.interpolate(start, end, fraction));
    }, 50);
  }

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
      } else {
        _base.endAddress = null;
        alert("Unexpected destination");
      }
    });
  }



  /*
  Marker creation on google map to show the available driver after search
  */

  createMarkarOne(loc: LatLng, driverDetails: any) {
    let _base = this;

    var icon = {
      url: "https://i.stack.imgur.com/wN5QD.png", // url
      scaledSize: new google.maps.Size(40, 40), // scaled size
      origin: new google.maps.Point(0, 0), // origin
      anchor: new google.maps.Point(0, 0) // anchor
    };

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
      distance: _base.distance
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
        var message = data.message;
        let BookData = {
          userId: _base.id,
          bookingID: bookData._id,
          firstName: _base.userData.firstName,
          lastName: _base.userData.lastName,
          img: (_base.userData.profileImage) ? _base.userData.profileImage : '',
          pickUpLocation: {
            latitude: _base.startLatitude,
            longitude: _base.startLongitude
          },
          destination: {
            latitude: JSON.stringify(_base.endingLatitude),
            longitude: JSON.stringify(_base.endingLongitude)
          }
        };
        _base.driverId = data.result.driverId._id;
        _base.phone = data.result.driverId.phoneNumber;
        _base.tempOtp = bookData.code;

        /*
        Getting driver's starting latitude and longitude
        */

        var driverStartingLatitude = data.result.pickUpLocation.latitude;
        var driverStartingLongitude = data.result.pickUpLocation.longitude;

        /*
        Convert the driver's starting latitude and longitude to location
        */

        var latlng = { lat: parseFloat(driverStartingLatitude), lng: parseFloat(driverStartingLongitude) };
        let geocoder = new google.maps.Geocoder;
        geocoder.geocode({ 'location': latlng }, function (results, status) {
          if (status === 'OK') {
            if (results[0]) {
              let address = results[0].formatted_address;
              _base.driverCompleteStartAddress = address;
            } else {
              console.log('No results found');
            }
          } else {
            console.log('Geocoder failed due to: ' + status);
          }
        });

        /*
      Getting driver's ending latitude and longitude
      */

        var driverDestinationLatitude = data.result.destination.latitude;
        var driverDestinationLongitude = data.result.destination.longitude;

        /*
        Convert the driver's ending latitude and longitude to location
        */



        var alatlng = { lat: parseFloat(driverDestinationLatitude), lng: parseFloat(driverDestinationLongitude) };
        geocoder.geocode({ 'location': alatlng }, function (results, status) {
          if (status === 'OK') {
            if (results[0]) {
              let address = results[0].formatted_address;
              _base.driverCompleteStartAddress = address;
              // console.log(address);
            } else {
              console.log('No results found');
            }
          } else {
            console.log('Geocoder failed due to: ' + status);
          }
        });

        if (_base.driverId) {
          localStorage.setItem("driverid", _base.driverId);
          _base.appService.getProfile(_base.driverId, (error, data) => {
            if (error) {
              console.log("Error after get profile of driver :");
              console.log(error);
            }
            else if (data) {
              _base.drivername = data.user.firstName + " " + data.user.lastName;
              localStorage.setItem("driverName", _base.drivername);

              //send Driver details with app conmonent with shared service after booking
              _base.appService.addBookingInfo({
                // name: _base.drivername,
                id: data.user._id,
                // profileImage: (data.user.profileImage) ? data.user.profileImage : '',
                pickUpLocation: {
                  latitude: _base.startLatitude,
                  longitude: _base.startLongitude
                },
                destination: {
                  latitude: JSON.stringify(_base.endingLatitude),
                  longitude: JSON.stringify(_base.endingLongitude)
                }
              });

              _base.rideMode = true;
              // _base.presentToast("Driver Name :" + _base.drivername + " Phone : " + _base.phone);
              _base.waitingLoader = _base.loadingCtrl.create({
                content: 'Please wait for driver confirmation...'
              });

              _base.waitingLoader.present();
              _base.stopSearch();
            }
          });
        }
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
    let loc: LatLng;
    var data = {
      latitude: this.startLatitude,
      longitude: this.startLongitude
    }
    this.appService.searchDriver(data, (error, data) => {

      if (error) {
        console.log(error);
      }
      else if (data) {
        // console.log("Drivers", data);
        if (data.error == true) {
          this.message = data.message;
          this.showToast('top');
        }
        else if (data.error == false) {
          if (data.driverDetails) {
            _base.removeDriver(data)
              .then(function () {
                for (var i = 0; i < data.driverDetails.length; i++) {
                  let driverDetails = data.driverDetails[i];
                  let location = data.driverDetails[i].location;
                  let driverID = data.driverDetails[i]._id;
                  var lat = location[1];
                  var lon = location[0];
                  let loc = new LatLng(lat, lon);
                  _base.createMarkarOne(loc, data.driverDetails[i]);
                }
              });
          }
        }
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


  // clear a trip and ready for new one
  clearTrip() {

  }


}


