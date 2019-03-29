import { Component, NgZone } from '@angular/core';
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

  latitude: number = 0;
  longitude: number = 0;
  geo: any

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
  }

  dismiss() {
    this.viewCtrl.dismiss({});
  }

  chooseItem(item: any) {
    this.geo = item;
    this.geoCode(this.geo);//convert Address to lat and long
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

  //convert Address string to lat and long
  geoCode(address: any) {
    let geocoder = new google.maps.Geocoder();
    let _base = this;
    geocoder.geocode({ 'address': address }, (results, status) => {
      let latitude = results[0].geometry.location.lat();
      let longitude = results[0].geometry.location.lng();
      let location = address;
      _base.viewCtrl.dismiss({
        lat: latitude,
        lng: longitude,
        location: location
      });
    });
  }
}