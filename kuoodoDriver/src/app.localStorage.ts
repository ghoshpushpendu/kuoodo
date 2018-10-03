import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class LocalStorageProvider {

    constructor(public http: Http) {
    }

    /*
        Set DriverId in LocalStorage after Registration or Login 
    */
    setDriverId(data) {
        console.log("Set DriverId after Registration and Login");
        console.log(data);
        localStorage.setItem('driverId', data);
    }

    /*
       Get DriverId in LocalStorage after Registration or Login 
   */
    getDriverId() {
        var driverId = localStorage.getItem('driverId')
        return driverId;
    }
}
