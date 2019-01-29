//import modules
import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class HttpService {
    //provide the base url
    public url = 'https://kuoodo.snapbase.online/';

    //request headers
    private headerOptions = new RequestOptions({
        headers: new Headers({ 'Content-Type': 'application/json;charset=UTF-8' })
    });

    constructor(private http: Http) { }

    //Verify user and Send OTP for registration in http service
    public verifyUserAndSendOtp(params) {
        console.log("verify user and send otp for registration");
        console.log(params);
        return this.http.post(this.url + "user/verifyUser", JSON.stringify(params), this.headerOptions)
            .map((response: Response) => response.json())
            .catch((error: any) => Observable.throw(error.json() || `Server error`));
    }

    //User registration in http service
    public userRegistration(params) {
        console.log("User registration in http service");
        console.log(params);
        return this.http.post(this.url + "user/registration", JSON.stringify(params), this.headerOptions)
            .map((response: Response) => response.json())
            .catch((error: any) => Observable.throw(error.json() || `Server error`));
    }

    public updateUserStatus(status: string, userID: string, socketID: string) {
        return this.http.put(this.url + "user/availability", { 'availability': status, "_id": userID, "socketId": socketID }, this.headerOptions)
            .map((response: Response) => response.json())
            .catch((error: any) => Observable.throw(error.json() || `Server error`));
    }

    //User login in http service
    public userLogin(params) {
        console.log("User login in http service");
        console.log(params);
        return this.http.post(this.url + "user/login", JSON.stringify(params), this.headerOptions)
            .map((response: Response) => response.json())
            .catch((error: any) => Observable.throw(error.json() || `Server error`));
    }

    //User social login in http service
    public userSocialLogin(params) {
        console.log(params);
        return this.http.post(this.url + "user/socialLogin", params, this.headerOptions)
            .map((response: Response) => response.json())
            .catch((error: any) => Observable.throw(error.json() || `Server error`));
    }

    //Verify OTP for registration in http service
    public verifyOtp(params) {
        console.log("Verify otp for registration");
        console.log(params);
        return this.http.post(this.url + "user/verifyOTP", JSON.stringify(params), this.headerOptions)
            .map((response: Response) => response.json())
            .catch((error: any) => Observable.throw(error.json() || `Server error`));
    }

    //Search driver based on latitude and longitude in http service
    public searchDriver(params) {
        console.log("Search driver based on latitude and longitude in http service");
        console.log(params);
        return this.http.post(this.url + "user/search", JSON.stringify(params), this.headerOptions)
            .map((response: Response) => response.json())
            .catch((error: any) => Observable.throw(error.json() || `Server error`));
    }

    //Driver booking 
    public driverBooking(params) {
        console.log("Driver booking  in http service");
        console.log(params);
        return this.http.post(this.url + "booking/create", JSON.stringify(params), this.headerOptions)
            .map((response: Response) => response.json())
            .catch((error: any) => Observable.throw(error.json() || `Server error`));
    }

    /**
     * 
     *   Get info / details of the current user
     *   params : User id
     *   return userinfo (object)
     * 
     * **/
    public getUserInfo(userID: string) {
        console.log("user Id in http :", userID);
        return this.http.get(this.url + "user/getDetails?_id=" + userID, this.headerOptions)
            .map((response: Response) => response.json())
            .catch((error: any) => Observable.throw(error.json() || `Server error`));
    }

    /**
     *  Get pending or commute booking
     * **/
    public getCurrentRide(userID) {
        return this.http.get(this.url + "/booking/getcurrentride?userId=" + userID, this.headerOptions)
            .map((response: Response) => response.json())
            .catch((error: any) => Observable.throw(error.json() || `Server error`));
    }

    //Uers Update 
    public UpdateUser(params) {
        console.log("Uers Update :");
        console.log(params);
        return this.http.put(this.url + "user/update", JSON.stringify(params), this.headerOptions)
            .map((response: Response) => response.json())
            .catch((error: any) => Observable.throw(error.json() || `Server error`));
    }

    // get countries
    public getCountries() {
        return this.http.get('https://restcountries.eu/rest/v2/all?fields=callingCodes;name')
            .map((response: Response) => response.json())
            .catch((error: any) => Observable.throw(error.json() || `Server error`));
    }

    //User history list
    public userHistory(userId: string) {
        return this.http.get(this.url + "booking/userHistory?userId=" + userId, this.headerOptions)
            .map((response: Response) => response.json())
            .catch((error: any) => Observable.throw(error.json() || `Server error`));
    }

    //get distance
    public getDistance(oLat: string, oLng: string, dLat: string, dLng: string) {
        return this.http.get('http://maps.googleapis.com/maps/api/directions/json?origin=' + oLat + ',' + oLng + '&destination=' + dLat + ',' + dLng + '&sensor=false', this.headerOptions)
            .map((response: Response) => response.json())
            .catch((error: any) => Observable.throw(error.json() || `Server error`));
    }

    // rate driver after ride complete
    public rateDriver(ratingData: any) {
        return this.http.put(this.url + "user/DriverReview", JSON.stringify(ratingData), this.headerOptions)
            .map((response: Response) => response.json())
            .catch((error: any) => Observable.throw(error.json() || `Server error`));
    }

    // APIS for FORGOT Password
    public sendFOTP(phone) {
        console.log(phone.phone);
        return this.http.post(this.url + "user/forgotPassword", { phoneNumber: phone.phone }, this.headerOptions)
            .map((response: Response) => response.json())
            .catch((error: any) => Observable.throw(error.json() || `Server error`));
    }

    public verifyFOTP(phone, code) {
        console.log(code);
        return this.http.post(this.url + "user/verifyforForgotPassword", { phoneNumber: phone.phone, code: code }, this.headerOptions)
            .map((response: Response) => response.json())
            .catch((error: any) => Observable.throw(error.json() || `Server error`));
    }

    public resetFPassword(phone, newPassword) {
        return this.http.put(this.url + "user/resetPassword", { phoneNumber: phone, password: newPassword }, this.headerOptions)
            .map((response: Response) => response.json())
            .catch((error: any) => Observable.throw(error.json() || `Server error`));
    }

    public getCards(userID) {
        return this.http.post(this.url + "cards/list", { userId: userID }, this.headerOptions)
            .map(function (response) { return response.json(); })
            .catch((error: any) => Observable.throw(error.json() || `Server error`));
    };
    public addCard(card) {
        return this.http.post(this.url + "cards/create", card, this.headerOptions)
            .map(function (response) { return response.json(); })
            .catch((error: any) => Observable.throw(error.json() || `Server error`));
    };
    public deleteCard(number) {
        return this.http.post(this.url + "cards/delete", { number: number }, this.headerOptions)
            .map(function (response) { return response.json(); })
            .catch((error: any) => Observable.throw(error.json() || `Server error`));
    };

    // get pending payments
    public getPendingPayments(userID) {
        return this.http.get(this.url + "booking/getpending?userId=" + userID, this.headerOptions)
            .map((response: Response) => response.json())
            .catch((error: any) => Observable.throw(error.json() || `Server error`));
    };

    //charge the card
    public chargeCard(paymentData) {
        return this.http.post(this.url + "cards/charge", paymentData, this.headerOptions)
            .map(function (response) { return response.json(); })
            .catch((error: any) => Observable.throw(error.json() || `Server error`));
    };

    // get pending payments
    public getCabTypes() {
        return this.http.get(this.url + "booking/getcabtypes", this.headerOptions)
            .map((response: Response) => response.json())
            .catch((error: any) => Observable.throw(error.json() || `Server error`));
    };


}