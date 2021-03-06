import { Component, ElementRef, ViewChild } from '@angular/core';
import { NavController, ModalController, NavParams, Platform, LoadingController, AlertController, Events, IonicPage } from 'ionic-angular';
import { Geolocation, GeolocationOptions } from '@ionic-native/geolocation';
import { AppService } from '../../app.providers';
import { HttpService } from '../../app.httpService';
import { LocalStorageProvider } from '../../app.localStorage';
import { ToastController } from 'ionic-angular';
import * as io from "socket.io-client";
import { LaunchNavigator, LaunchNavigatorOptions } from '@ionic-native/launch-navigator';
import { SlimLoadingBarService } from 'ng2-slim-loading-bar';
import Stopwatch from 'timer-stopwatch';

declare var google;
declare var navigator;

@IonicPage()
@Component({
  selector: 'page-driverdashboard',
  templateUrl: 'driverdashboard.html',
  providers: [HttpService]
})
export class DriverdashboardPage {

  public rideStatus: any = "idle"; // idle , request , arrive , pick_up, ride
  //waiting loader
  public waitingLoader: any;

  public tstopwatch: any = new Stopwatch();
  acceptRideDataMessage: any;
  e: any;
  bID: any;
  online: boolean;
  message: string;
  base: string;
  public marker: any = null;
  public destinationmarker: any = null;
  id: any;
  bookingId: any;
  response: any;

  rideRequest: any = false;

  loadingMessage: any;
  loader: any;

  endLongitude: any;
  startLatitude: any;

  userStartLatitude: any;
  userStartLongitude: any;

  userEndLatitude: any;
  userEndLongitude: any;

  public userStartLoc: any;
  public userEndLoc: any;

  public alert: any;

  //timer variable
  public timer: any;
  public duration: any = "00:00:00";

  userID: any;
  public isStartRide: boolean = false;
  public isEndRide: boolean = true;
  public ridingStatus: boolean = false;
  public ridingStatusComplete: boolean = false;
  public isPathDraw: boolean = false;

  /** Ride status **/
  // public isAcceptRideHidden: boolean = true;
  // public isCancelRideHidden: boolean = true;

  public IsStartRideHidden: boolean = true;
  public IsEndRideHidden: boolean = true;

  public carDetails: any;

  public price: any;
  public distance: any;

  public carTypes = [{
    "name": "Economy",
    "initialCost": "2.2",
    "serviceFee": "2.2",
    "perMinutes": "0.24",
    "perMile": "1.33",
    "minimum": "5",
    "maximum": "400",
    "cancellation": "5"
  },
  {
    "name": "Xtra",
    "initialCost": "2.45",
    "serviceFee": "2.45",
    "perMinutes": "0.3",
    "perMile": "2.06",
    "minimum": "7",
    "maximum": "400",
    "cancellation": "5"
  },
  {
    "name": "Luxury",
    "initialCost": "8",
    "serviceFee": "1.75",
    "perMinutes": "0.65",
    "perMile": "3.81",
    "minimum": "15",
    "maximum": "400",
    "cancellation": "5"
  },
  {
    "name": "SUV Luxury",
    "initialCost": "15",
    "serviceFee": "1.75",
    "perMinutes": "0.9",
    "perMile": "3.81",
    "minimum": "25",
    "maximum": "400",
    "cancellation": "5"
  },
  {
    "name": "Supreme",
    "initialCost": "5",
    "serviceFee": "2.45",
    "perMinutes": "0.5",
    "perMile": "2.81",
    "minimum": "9",
    "maximum": "400",
    "cancellation": "5"
  }];

  @ViewChild('map') mapElement: ElementRef;
  map: any;

  /** driver status **/
  public status: boolean = false;

  public socket: any;
  locationCircle: any;
  vibrate: number;
  public notArrived: boolean = true;
  directionsDisplay: any = new google.maps.DirectionsRenderer;
  riderName: string;
  arrivingDistance: any;
  arrivingDuration: any;
  riderNumber: any;
  autocancel: any;
  confirmalert: any;
  riderImage: string;


  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private _geoLoc: Geolocation,
    private appService: AppService,
    private httpservice: HttpService,
    private localStorageProvider: LocalStorageProvider,
    private toastCtrl: ToastController,
    public platform: Platform,
    public loadingCtrl: LoadingController,
    public alertController: AlertController,
    public events: Events,
    private launchNavigator: LaunchNavigator,
    public modalCtrl: ModalController,
    private slimLoadingBarService: SlimLoadingBarService) {

    let _base = this;

    this.id = this.localStorageProvider.getDriverId();
    console.log(this.id);

    // connect socket
    this.socket = io(this.httpservice.url);
    this.socket.on('connect', () => {
      console.log(this.socket.id);
    });


    /** socket Events **/
    this.socket.on("booking", function (booking: any) {
      console.log("driver id", booking.driverId._id);
      console.log("this id", _base.id);
      let driverID = booking.driverId._id;
      console.log("present toast", booking);
      if (driverID == _base.id) {
        console.log("present toast");
        _base.rideStatus = 'request' // new ride sttaus
        _base.rideRequest = true;
        _base.userStartLatitude = booking.pickUpLocation.latitude;
        _base.userStartLongitude = booking.pickUpLocation.longitude;
        _base.userEndLatitude = booking.destination.latitude;
        _base.userEndLongitude = booking.destination.longitude;
        _base.userStartLoc = booking.startLocation;
        _base.userEndLoc = booking.endLocation;
        _base.bookingId = booking._id;
        _base.distance = booking.distance;
        _base.riderName = booking.userId.firstName + ' ' + booking.userId.lastName;
        _base.riderNumber = booking.userId.phoneNumber;
        _base.riderImage = (booking.userId.profileImage) ? _base.httpservice.url + "user/fileShow?imageId=" + booking.userId.profileImage + "&select=thumbnail" : "./assets/image/user.jpg";

        let end = new google.maps.LatLng(_base.userStartLatitude, _base.userStartLongitude);
        let start = new google.maps.LatLng(_base.startLatitude, _base.endLongitude);

        console.log("start", start);
        console.log("end", end);

        var directionsService = new google.maps.DirectionsService();

        var request = {
          origin: start,
          destination: end,
          travelMode: google.maps.TravelMode.DRIVING
        };

        directionsService.route(request, function (response, status) {
          console.log(response);
          if (status == google.maps.DirectionsStatus.OK) {
            let distance = response.routes[0].legs[0].distance.text;
            let duration = response.routes[0].legs[0].duration.text;
            _base.arrivingDistance = distance;
            _base.arrivingDuration = duration;
            _base.rideRequest = true;
            // _base.playRingtone();
            // _base.autoCancel();
          }
        });
      }
    });


    // on user paid 
    this.socket.on("paid", function (booking: any) {
      console.log("driver id", booking.driverId._id);
      console.log("this id", _base.id);
      let driverID = booking.driverId._id;
      console.log("present toast", booking);
      if (driverID == _base.id) {
        alert("User has paid" + booking.amount);
      }
    });



    _base.isStartRide = false;
    _base.isEndRide = false;

    /** get current driver car info **/
    _base.appService.getCar(this.id, (error, data) => {
      if (!error) {
        console.log("Data just printed", data);
        if (!data.user.drivingLicense) {
          _base.navCtrl.push("DocumentationPage");
        } else {
          _base.carDetails = data.user;
        }
      }
    });

    _base.getCabTypes();
  }

  autoCancel() {
    let _base = this;
    let counter = 0;
    _base.autocancel = setInterval(function () {
      counter++;
      if (counter == 10) {
        _base.rideRequest = false;
        _base.pauseRingtone();
        _base.cancelRide();
        _base.completeLoading();
        _base.clearAutoCancel();
      } else {
        _base.loadBar(100 / counter);
      }
    }, 1000);
  }

  clearAutoCancel() {
    clearInterval(this.autocancel);
  }

  loadBar(prcnt) {
    this.slimLoadingBarService.progress = prcnt;
  }

  stopLoading() {
    this.slimLoadingBarService.stop();
  }

  completeLoading() {
    this.slimLoadingBarService.complete();
  }


  playRingtone() {
    let ringtone = <HTMLAudioElement>document.getElementById("ringtone");
    ringtone.play();
    // this.vibrate = setInterval(function () {
    //   console.log("vibrate");
    //   navigator.vibrate(500);
    // }, 1000);
  }

  pauseRingtone() {
    let ringtone = <HTMLAudioElement>document.getElementById("ringtone");
    ringtone.pause();
    // clearInterval(this.vibrate);
    // navigator.vibrate(0);
  }

  acceptRideRequest() {
    this.rideRequest = true;
    this.pauseRingtone();
    this.acceptRide();
    this.completeLoading();
    this.clearAutoCancel();
  }

  cancelRideRequest() {
    this.rideRequest = true;
    this.pauseRingtone();
    this.cancelRide();
    this.completeLoading();
    this.clearAutoCancel();
  }

  lunchNavigator(start: any, end: any) {
    console.log(start);
    console.log(end);
    let GStart = [start.lat, start.lng];
    let GEnd = [end.lat, end.lng];
    let options: LaunchNavigatorOptions = {
      start: GStart,
      transportMode: "driving"
    };

    this.launchNavigator.navigate(GEnd, options)
      .then(
        success => console.log('Launched navigator', success),
        error => console.log('Error launching navigator', error)
      );
  }


  lunchDemoNavigator() {
    let options: LaunchNavigatorOptions = {
      start: 'London, ON'
    };

    this.launchNavigator.navigate('Toronto, ON', options)
      .then(
        success => console.log('Launched navigator'),
        error => console.log('Error launching navigator', error)
      );
  }

  /** Accept Ride */
  acceptRide() {
    let loader = this.loadingCtrl.create({
      content: 'Informing rider about confirmation ... '
    });
    loader.present();
    let _base = this;
    if (_base.bookingId) {
      var data = {
        bookingId: _base.bookingId
      }
      this.appService.acceptRide(data, (error, data) => {
        loader.dismiss();
        _base.IsStartRideHidden = true;
        _base.isStartRide = true;
        _base.notArrived = false;
        _base.rideStatus = 'arrive'

        let start = new google.maps.LatLng(parseFloat(_base.startLatitude), parseFloat(_base.endLongitude));
        let end = new google.maps.LatLng(parseFloat(_base.userStartLatitude), parseFloat(_base.userStartLongitude));

        console.log(parseFloat(_base.startLatitude), parseFloat(_base.endLongitude));
        console.log(parseFloat(_base.userStartLatitude), parseFloat(_base.userStartLongitude));

        _base.showRoute(start, end);

        _base.arrivalNavigate();

        if (error) {
          console.log(error);
        } else if (data) {
        }
      });
    }
    else {
      _base.showToast("Firstly you select the driver.");
    }
  }


  /** cancel Ride */
  cancelRide() {
    let _base = this;
    let loader = this.loadingCtrl.create({
      content: 'Informing rider about cancellation ... '
    });
    loader.present();
    if (_base.bookingId) {
      var data = {
        bookingId: _base.bookingId
      }
      this.appService.cancelRide(data, (error, data) => {
        loader.dismiss();
        if (error) {
          console.log(error);
        } else if (data) {
          _base.rideStatus = 'idle'
          // _base.isAcceptRideHidden = true;
          // _base.alert.dismiss();
        }
      });
    }
    else {
      _base.showToast("Firstly you select the driver.");
    }
  }

  /*
  Direction drawing from user start location to end location
  */


  //change driver status
  changeStatus() {
    let _base = this;
    let currentStatus = "";
    if (this.status == true) {
      currentStatus = "Online";
      _base.startWatch();
    } else {
      currentStatus = "Offline";
      _base.stopWatch();
    }
    this.appService.updateDriverStatus(currentStatus, this.id, this.socket.id, (error, data) => {
      if (error) {
        _base.showToast("Can not update status");
      }
      else {
        _base.showToast("You are now " + currentStatus);
      }
    });
  }

  ionViewDidLoad() {
    let _base = this;

    this.mapViewAndDriverShow();
    this.reziseMap();

    /** user driver profile info **/
    this.appService.getProfile(this.id, (error, data) => {
      if (error) {
        console.log("Error in fetching profile :", error);
      } else {
        if (data) {
          _base.appService.updateUser(data.user);
        }
      }
    });

  }

  mapViewAndDriverShow() {
    let _base = this;
    let loc: any;
    this.initMap();
  }

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

    let options = {
      zoom: 15, center: { lat: -25.344, lng: 131.036 }, mapTypeId: 'terrain', gestureHandling: 'none',
      zoomControl: false,
      disableDefaultUI: true,
      styles: mapStyle
    };
    _base.map = new google.maps.Map(document.getElementById('map'), options);


    google.maps.event.addListenerOnce(_base.map, 'idle', function () {
      // do something only the first time the map is loaded
      _base.setLocation();
    });

  }



  setLocation() {
    let _base = this;
    console.log("map ready");
    this.getLocation().subscribe((res) => {
      console.log(res);
      this.response = res;

      this.startLatitude = res.coords.latitude;
      this.endLongitude = res.coords.longitude;

      let locationData = res.coords;

      let loc = new google.maps.LatLng(this.response.coords.latitude, this.response.coords.longitude);
      if (_base.status == true) {
        this.locationUpdate(locationData);
      }

      this.createMarkar(loc, res.coords.accuracy);

    });
  }

  getLocation() {
    let options: GeolocationOptions = {
      enableHighAccuracy: true
    }
    return this._geoLoc.watchPosition(options);
  }


  moveCamera(loc: any) {
    this.map.setCenter(loc);
  }
  /* 
  Create marker for driver
  */
  createMarkar(loc: any, accuracy: number) {

    let _base = this;

    // var icon = {
    //   url: "https://lemi.travel/images/current.png", // url
    //   scaledSize: new google.maps.Size(50, 50), // scaled size
    //   origin: new google.maps.Point(0, 0), // origin
    //   anchor: new google.maps.Point(0, 0) // anchor
    // };

    // console

    var icon = {
      url: "https://lemi.travel/images/current.png",
      // url: "https://cdn1.iconfinder.com/data/icons/Map-Markers-Icons-Demo-PNG/256/Map-Marker-Ball-Chartreuse.png", // url
      scaledSize: new google.maps.Size(60, 60), // scaled size
      origin: new google.maps.Point(0, 0), // origin
      anchor: new google.maps.Point(30, 30) // anchor
    };


    if (_base.marker) {
      _base.moveCamera(loc);
      _base.marker.setPosition(loc);
    } else {
      _base.moveCamera(loc);
      _base.marker = new google.maps.Marker({
        position: loc,
        map: this.map,
        icon: icon,
        animation: 'drop'
      });
      console.log(_base.marker, "--------------------")
    }
  }

  /* 
  Create marker for User
  */
  createUserMarkar(loc: any) {
    let _base = this;

    var icon = {
      url: "https://image.winudf.com/v2/image/Y29tLnN0cmVldC52aWV3Lm1hcC5saXZlLnBhbm9yYW1hX2ljb25fMTUxMTcxNjcxMV8wMjY/icon.png?w=170&fakeurl=1&type=.png", // url
      scaledSize: new google.maps.Size(50, 50), // scaled size
      origin: new google.maps.Point(0, 0), // origin
      anchor: new google.maps.Point(0, 0) // anchor
    };

    let markarOptions = {
      position: loc,
      icon: icon,
      map: _base.map
    };

    if (_base.destinationmarker) {
      _base.moveCamera(loc);
      _base.marker.setPosition(loc);
    } else {
      _base.moveCamera(loc);
      _base.destinationmarker = new google.maps.Marker(markarOptions);
    }
  }

  locationUpdate(locationData: any) {
    if (this.response) {
      var data = {
        "_id": this.id,
        "location": {
          "latitude": locationData.latitude,
          "longitude": locationData.longitude
        },
        "accuracy": locationData.accuracy,
        "heading": (locationData.heading) ? locationData.heading : 0,
        "speed": (locationData.speed) ? locationData.speed : 0
      }

      this.appService.driverLocation(data, (error, data) => {
        if (error) {
          console.log("Error :", error);
        }
        else if (data) {
        }
      });
    }
  }

  arrived() {
    let _base = this;
    var data = {
      bookingId: _base.bookingId,
    }
    let loader = this.loadingCtrl.create({
      content: 'Notifying rider about arival ... '
    });
    loader.present();
    this.appService.arrive(data, (error, data) => {
      loader.dismiss();
      if (error) {
        console.log("Error in Driver start ride :", error);
        _base.showToast("Error notifying rider. Please try again");
      }
      else if (data) {
        // _base.isStartRide = true;
        if (data.error) {
          _base.showToast(data.message);
        } else {
          _base.rideStatus = 'pick_up'
          _base.notArrived = true;
          _base.IsStartRideHidden = false;
          _base.IsEndRideHidden = true;
          let start = new google.maps.LatLng(parseFloat(_base.userStartLatitude), parseFloat(_base.userStartLongitude));
          let end = new google.maps.LatLng(parseFloat(_base.userEndLatitude), parseFloat(_base.userEndLongitude));
          console.log(start, end);
          _base.showRoute(start, end);
        }
      }
    });
  }

  clearTrip() {
    this.isStartRide = false;
    this.isEndRide = true;
    this.ridingStatus = false;
    this.ridingStatusComplete = false;
    this.isPathDraw = false;
    this.IsStartRideHidden = true;
    this.IsEndRideHidden = true;
    this.directionsDisplay.setMap(null);
    this.destinationmarker.serMap(null);
  }

  /*
  Driver Start Riding
  */
  startRide(code: any) {
    let _base = this;
    var data = {
      bookingId: _base.bookingId,
      code: code
    }
    let loader = this.loadingCtrl.create({
      content: 'Starting ride ... '
    });
    loader.present();
    this.appService.driverStartRide(data, (error, data) => {
      loader.dismiss();
      if (error) {
        console.log("Error in Driver start ride :", error);
        _base.showToast("Error starting ride. Please try again");
      }
      else if (data) {
        // _base.isStartRide = true;
        if (data.error) {
          _base.showToast(data.message);
        } else {
          _base.rideStatus = 'ride'
          // start stop watch here
          _base.tstopwatch.start();

          this.ridingStatus = true;

          _base.navigate();
          _base.IsEndRideHidden = false;
          _base.IsStartRideHidden = true;
        }
      }
    });
  }

  showNavigator() {
    if (this.notArrived) {
      this.arrivalNavigate();
    } else {
      this.navigate();
    }
  }

  arrivalNavigate() {
    let _base = this;
    console.log("lunch navigator");
    let start = {
      lat: parseFloat(_base.startLatitude),
      lng: parseFloat(_base.endLongitude)
    };

    let end = {
      lat: parseFloat(_base.userStartLatitude),
      lng: parseFloat(_base.userStartLongitude)
    };

    _base.lunchNavigator(start, end);
  }

  navigate() {
    let _base = this;
    console.log("lunch navigator");
    let start = {
      lat: parseFloat(_base.userStartLatitude),
      lng: parseFloat(_base.userStartLongitude)
    };

    let end = {
      lat: parseFloat(_base.userEndLatitude),
      lng: parseFloat(_base.userEndLongitude)
    };

    console.log(start, end);

    _base.lunchNavigator(start, end);
    // _base.lunchDemoNavigator();
  }
  reziseMap() {
    let mapHeight = (<HTMLElement>document.getElementById("map")).clientHeight;
    (<HTMLElement>document.getElementById("map")).style.height = mapHeight + "px";
  }

  resizeViewport(start, end) {
    let points = [start, end];
    let options: any = {
      target: points,
      padding: 10
    };
    this.map.moveCamera(options);
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
    directionsService.route(request, function (response, status) {
      console.log(response);
      if (status == google.maps.DirectionsStatus.OK) {
        _base.directionsDisplay.setDirections(response);
        _base.directionsDisplay.setMap(_base.map);
      } else {
        alert("Unexpected destination");
      }
    });
  }


  presentPrompt() {
    let _base = this;
    // start scanning

    let alert = this.alertController.create({
      title: 'Login',
      inputs: [
        {
          name: 'code',
          placeholder: 'code'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Confirm ?',
          handler: data => {
            console.log("Code is :", data.code);
            _base.startRide(data.code);
          }
        }
      ]
    });
    alert.present();

    // this.barcodeScanner.scan().then(barcodeData => {
    //   console.log('Barcode data', barcodeData.text);
    //   _base.startRide(barcodeData.text);
    // }).catch(err => {
    //   console.log('Error', err);
    //   alert("Please try again");
    // });
  }


  clearall() {
    let _base = this;
    _base.marker = null;
    _base.destinationmarker = null;
    _base.userStartLatitude = null;
    _base.userStartLongitude = null;
    _base.userEndLatitude = null;
    _base.userEndLongitude = null;
    _base.isStartRide = false;
    _base.isEndRide = false;
    // _base.isAcceptRideHidden = true;
    _base.IsStartRideHidden = true;
    _base.IsEndRideHidden = true;
    this.directionsDisplay.setMap(null);
    this.destinationmarker.serMap(null);
    alert("Ride has been completed");
  }


  /**  calculate the final travel amount  **/
  calculateAmount(time) {
    let _base = this;
    return new Promise(function (resolve, reject) {
      let end = new google.maps.LatLng(_base.userStartLatitude, _base.userStartLongitude);
      let start = new google.maps.LatLng(_base.startLatitude, _base.endLongitude);

      var directionsService = new google.maps.DirectionsService();

      var request = {
        origin: start,
        destination: end,
        travelMode: google.maps.TravelMode.DRIVING
      };

      directionsService.route(request, function (response, status) {
        if (status == google.maps.DirectionsStatus.OK) {
          let distance = response.routes[0].legs[0].distance.value * 0.000621371;
          let minutes = parseFloat(_base.getPerMilePrice(_base.carDetails.carType).perMinutes);
          let miles = parseFloat(_base.getPerMilePrice(_base.carDetails.carType).perMile);
          let initial = parseFloat(_base.getCarInfo().initialCost);
          let service = parseFloat(_base.getCarInfo().serviceFee);
          let cost = initial + service + distance * miles + time * minutes;
          resolve({
            cost: (cost >= parseFloat(_base.getCarInfo().minimum)) ? cost : parseFloat(_base.getCarInfo().minimum)
          });
        }
      });
    });
  }


  getCarInfo() {
    let _base = this;
    let carType = this.carDetails.carType;
    for (let i = 0; i <= _base.carTypes.length; i++) {
      if (_base.carTypes[i].name = carType) {
        return _base.carTypes[i];
      }
    }
  }


  /*
  Driver End Riding
  */
  endRide() {
    let _base = this;
    _base.tstopwatch.stop();

    let timeTravelled = (_base.tstopwatch.ms / 1000) / 60;

    _base.calculateAmount(timeTravelled)
      .then(function (travelCost: any) {
        let cost = travelCost.cost;
        var data = {
          bookingId: _base.bookingId,
          amount: cost
        }

        _base.appService.driverEndRide(data, (error, data) => {
          if (error) {
            console.log("Error in Driver end ride :", error);
          }
          else if (data) {
            _base.rideStatus = 'idle'
            console.log("Data in Driver end ride :", data);
            _base.isEndRide = true;
            _base.rideRequest = false;
            _base.IsEndRideHidden = true;
            _base.IsStartRideHidden = true;
            _base.clearall();
            // _base.waitingLoader = _base.loadingCtrl.create({
            //   content: 'Please wait for user payment ...'
            // });
            // _base.waitingLoader.present();
          }
        });
      });
  }

  loading() {
    this.loader = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: this.loadingMessage
    });
  }


  /** toast contorller **/
  showToast(message: string) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 2000,
      position: 'top'
    });
    toast.present(toast);
  }


  getPerMilePrice(carType: string) {
    let _base = this;
    for (let i = 0; i < _base.carTypes.length; i++) {
      if (_base.carTypes[i].name == carType) {
        return {
          perMile: _base.carTypes[i].perMile,
          perMinutes: _base.carTypes[i].perMinutes
        }
      }
    }
  }

  calculateRouteDistance() {
    var service = new google.maps.DistanceMatrixService();
  }


  startWatch() {
    let count = 0;
    let _base = this;
    _base.stopWatch();
    this.timer = setInterval(() => {
      count++;
      let duration = _base.getDuration(count);
      _base.duration = duration;
    }, 1000);
  }

  stopWatch() {
    if (this.timer) {
      clearInterval(this.timer);
    }
    this.duration = "00:00:00";
  }

  getDuration(seconds: number) {
    if (seconds < 60) {
      let lsec = '';
      if (seconds < 10) { lsec = '0' + seconds } else { lsec = seconds + '' }
      return '00:00:' + lsec;
    } else if (seconds >= 60 && seconds <= 3600) {
      let min = seconds / 60;
      let sec = seconds % 60;
      let lsec = '';
      if (sec < 10) { lsec = '0' + sec } else { lsec = sec + '' }
      return '00:' + Math.floor(min) + ':' + lsec;
    } else {
      let hour = seconds / 3600;
      let sec = seconds % 3600;
      if (sec >= 60) {
        let min = sec / 60;
        let secs = sec % 60;
        let lsec = '';
        if (secs < 10) { lsec = '0' + secs } else { lsec = secs + '' }
        return Math.floor(hour) + ':' + Math.floor(min) + ':' + lsec;
      } else {
        let lsec = '';
        if (sec < 10) { lsec = '0' + sec } else { lsec = sec + '' }
        return Math.floor(hour) + ':' + '00' + lsec;
      }
    }
  }

  //  get cab types
  getCabTypes() {
    let _base = this;
    let loading = this.loadingCtrl.create({ content: "Fetching car types" });
    loading.present();
    _base.appService.getCabTypes((error, data) => {
      loading.dismiss();
      if (error) {
        console.log("Internet connection error , getting cab types");
      } else {
        if (data) {
          console.log("All cab types", data.results);
          _base.carTypes = data.results;
        }
      }
    });
  }

}
