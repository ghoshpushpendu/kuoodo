import { Component, ViewChild, NgZone, ElementRef } from '@angular/core';
import { ViewController, NavController, IonicPage, NavParams } from 'ionic-angular';
import { strings } from '../../lang';

declare var google;

@IonicPage()
@Component({
  selector: 'page-autocomplete',
  templateUrl: 'autocomplete.html'
})

export class AutocompletePage {
  autocompleteItems;
  autocomplete;

  public string: any = strings;

  public output: any = {
    lat: 0,
    lng: 0,
    address: ''
  }

  latitude: number = 0;
  longitude: number = 0;
  geo: any
  map: any;
  @ViewChild('searchmap') mapElement: ElementRef;


  service = new google.maps.places.AutocompleteService();

  constructor(public viewCtrl: ViewController, private zone: NgZone, public param: NavParams) {
    this.autocompleteItems = [];
    this.autocomplete = {
      query: ''
    };
  }

  ionViewDidLoad() {
    console.log(this.param.get('lat'));
    console.log(this.param.get('lng'));
    let elem = <HTMLInputElement>document.querySelector('ion-searchbar');
    console.log(elem)
    if (elem) {
      elem.click();
    }


    this.reziseMap()
    this.initMap(this.param.get('lat'), this.param.get('lng'))
    this.autocomplete.query = 'fetching location ...'
    this.getCenterLocation(this.param.get('lat'), this.param.get('lng'));

  }

  dismiss() {
    this.viewCtrl.dismiss({});
  }

  chooseItem(item: any) {
    this.geo = item;
    this.geoCode(this.geo);//convert Address to lat and long
    this.autocompleteItems = [];
  }

  updateSearch() {

    if (this.autocomplete.query == '') {
      this.autocompleteItems = [];
      return;
    }

    let me = this;
    this.service.getPlacePredictions({
      input: this.autocomplete.query,
      location: new google.maps.LatLng({ lat: me.param.get('lat'), lng: me.param.get('lng') }),
      radius: 15,
      componentRestrictions: {
        // country: 'usa',
      }
    }, (predictions, status) => {
      me.autocompleteItems = [];

      me.zone.run(() => {
        if (predictions != null) {
          predictions.forEach((prediction) => {
            me.autocompleteItems.push(prediction.description);
          });
        }
      });
    });
  }

  done() {
    this.viewCtrl.dismiss(this.output);
  }

  //convert Address string to lat and long
  geoCode(address: any) {
    let geocoder = new google.maps.Geocoder();
    let _base = this;
    geocoder.geocode({ 'address': address }, (results, status) => {
      let latitude = results[0].geometry.location.lat();
      let longitude = results[0].geometry.location.lng();
      let location = address;
      _base.output = {
        lat: latitude,
        lng: longitude,
        address: location
      }
      _base.autocomplete.query = location;
      _base.moveCamera(latitude, longitude)
    });
  }

  moveCamera(lat: any, lng: any) {
    let loc = new google.maps.LatLng({
      lat: lat,
      lng: lng
    });
    this.map.setCenter(loc, 14);
  }


  getCenterLocation(lat, lng) {
    let _base = this;
    var latlng = new google.maps.LatLng(lat, lng);
    let geocoder = new google.maps.Geocoder;
    geocoder.geocode({ 'location': latlng }, function (results, status) {
      if (status === 'OK') {
        if (results[0]) {
          let address = results[0].formatted_address;
          _base.output = {
            lat: lat,
            lng: lng,
            address: address
          }
          _base.autocomplete.query = address;
        } else {
          console.log('No results found');
        }
      } else {
        console.log('Geocoder failed due to: ' + status);
      }
    });
  }

  reziseMap() {
    let mapHeight = (<HTMLElement>document.getElementById("map")).clientHeight;
    (<HTMLElement>document.getElementById("map")).style.height = mapHeight + "px";
  }


  //initialize map
  initMap(lat, lng) {
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

    var uluru = { lat: lat, lng: lng };
    let options = {
      zoom: 15,
      center: uluru,
      disableDefaultUI: true,
      // mapTypeId: 'roadmap',
      // gestureHandling: 'cooperative',
      zoomControl: true,
      styles: mapStyle
    };
    this.map = new google.maps.Map(document.getElementById('searchmap'), options);

    console.log("===================================================================")
    console.log(this.map)

    google.maps.event.addListener(_base.map, 'dragend', function () {
      // do something only the first time the map is loaded
      // _base.setCurrentLocation();
      _base.autocomplete.query = 'fetching location ...';
      console.log(_base.map.getCenter())
      let lat = _base.map.getCenter().lat();
      let lng = _base.map.getCenter().lng();
      _base.getCenterLocation(lat, lng)
    });

  }

}