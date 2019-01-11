import { Component, ElementRef, ViewChild } from '@angular/core';
import { NavController, ModalController, NavParams, Platform, LoadingController, AlertController, Events, IonicPage } from 'ionic-angular';
import { Geolocation, GeolocationOptions } from '@ionic-native/geolocation';
import { AppService } from '../../app.providers';
import { HttpService } from '../../app.httpService';
import { LocalStorageProvider } from '../../app.localStorage';
import { ToastController } from 'ionic-angular';
import * as io from "socket.io-client";
import { LaunchNavigator, LaunchNavigatorOptions } from '@ionic-native/launch-navigator';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
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

  //waiting loader
  public waitingLoader: any;

  public stopwatch: any = new Stopwatch();
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
    private barcodeScanner: BarcodeScanner,
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
            _base.playRingtone();
            _base.autoCancel();
          }
        });
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
    this.rideRequest = false;
    this.pauseRingtone();
    this.acceptRide();
    this.completeLoading();
    this.clearAutoCancel();
  }

  cancelRideRequest() {
    this.rideRequest = false;
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
    let options = {
      zoom: 19, center: { lat: -25.344, lng: 131.036 }, disableDefaultUI: true, mapTypeId: 'terrain', gestureHandling: 'none',
      zoomControl: false
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
      this.locationUpdate(locationData);
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

    var icon = {
      url: "https://hoodmaps.com/assets/self-map-marker.png", // url
      scaledSize: new google.maps.Size(50, 50), // scaled size
      origin: new google.maps.Point(0, 0), // origin
      anchor: new google.maps.Point(0, 0) // anchor
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
        // "accuracy": locationData.accuracy,
        // "heading": (locationData.heading) ? locationData.heading : 0,
        // "speed": (locationData.speed) ? locationData.speed : 0
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

          // start stop watch here
          _base.timer.start();

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

    this.barcodeScanner.scan().then(barcodeData => {
      console.log('Barcode data', barcodeData.text);
      _base.startRide(barcodeData.text);
    }).catch(err => {
      console.log('Error', err);
      alert("Please try again");
    });
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
            cost: cost
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
    _base.timer.stop();

    let timeTravelled = (_base.timer.ms / 1000) / 60;

    _base.calculateAmount(timeTravelled)
      .then(function (travelCost: any) {
        let cost = travelCost.cost;
        var data = {
          bookingId: _base.bookingId,
          amount: cost
        }

        this.appService.driverEndRide(data, (error, data) => {
          if (error) {
            console.log("Error in Driver end ride :", error);
          }
          else if (data) {

            console.log("Data in Driver end ride :", data);
            _base.isEndRide = true;
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
      duration: 3000,
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

}
