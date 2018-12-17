import { Injectable } from '@angular/core';
import { HttpService } from './app.httpService';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class AppService {

    public countryCode: string = "+1";

    userInfo: BehaviorSubject<any> = new BehaviorSubject({});
    bookingInfo: BehaviorSubject<any> = new BehaviorSubject({});
    PaymentStutus: BehaviorSubject<any> = new BehaviorSubject({});
    bookingStatus: BehaviorSubject<any> = new BehaviorSubject({});
    ratingStatus: BehaviorSubject<any> = new BehaviorSubject({});

    constructor(private httpService: HttpService) { }

    updateUser(userData: any) {
        this.userInfo.next(userData);
    }

    addBookingInfo(bookingData: any) {
        this.bookingInfo.next(bookingData);
    }

    changeBookingStatus(bookstatus: any) {
        this.bookingStatus.next(bookstatus);
    }

    changePaymentStatus(status: any) {
        console.log('change payment status', status);
        this.PaymentStutus.next(status);
    }

    changeRatingStatus(status: any) {
        this.ratingStatus.next(status);
    }

    /**
    * 
    *   Get the profile info of user\
    *   params: userID ( String )
    * 
    *   returns userInfo (Objectu)
    * 
    * **/

    public getProfile(userID: string, callback): any {
        console.log("user Id in provider :", userID);
        this.httpService.getUserInfo(userID).subscribe(data => {
            callback(false, data);
        }, error => {
            callback(true, error || 'HTTP fail.');
        });
    }

    //Verify user and send otp in providers for registration 
    public verifyUserAndSendOtp(params, callback): any {
        console.log("Verify user and send otp in providers for registration");
        console.log(params);
        this.httpService.verifyUserAndSendOtp(params).subscribe(data => {
            callback(false, data);
        }, error => {
            callback(true, error || 'HTTP fail.');
        });
    }

    //User registration in providers 
    public userRegistration(params, callback): any {
        console.log("User registration in providers");
        console.log(params);
        this.httpService.userRegistration(params).subscribe(data => {
            callback(false, data);
        }, error => {
            callback(true, error || 'HTTP fail.');
        });
    }

    //User login in providers 
    public userLogin(params, callback): any {
        console.log("User login in providers");
        console.log(params);
        this.httpService.userLogin(params).subscribe(data => {
            callback(false, data);
        }, error => {
            callback(true, error || 'HTTP fail.');
        });
    }

    // update driver status
    updateUserStatus(status: string, userID: string, socketID: string, callback): any {
        this.httpService.updateUserStatus(status, userID, socketID).subscribe(data => {
            callback(false, data);
        }, error => {
            callback(true, error || 'HTTP fail.');
        });
    }

    //User social login in providers 
    public userSocialLogin(params, callback): any {
        console.log("User social login in providers");
        console.log(params);
        this.httpService.userSocialLogin(params).subscribe(data => {
            callback(false, data);
        }, error => {
            callback(true, error || 'HTTP fail.');
        });
    }

    //Verify otp in providers for registration 
    public verifyOtp(params, callback): any {
        console.log("Verify otp in providers for registration");
        console.log(params);
        this.httpService.verifyOtp(params).subscribe(data => {
            callback(false, data);
        }, error => {
            callback(true, error || 'HTTP fail.');
        });
    }

    //Search driver based on latitude and longitude 
    public searchDriver(params, callback): any {
        console.log("Search driver based on latitude and longitude :");
        console.log(params);
        this.httpService.searchDriver(params).subscribe(data => {
            callback(false, data);
        }, error => {
            callback(true, error || 'HTTP fail.');
        });
    }

    //Driver booking 
    public driverBooking(params, callback): any {
        console.log("Driver booking in provider :");
        console.log(params);
        this.httpService.driverBooking(params).subscribe(data => {
            callback(false, data);
        }, error => {
            callback(true, error || 'HTTP fail.');
        });
    }

    //Update User 
    public UpdateUser(params, callback): any {
        console.log("Update User :");
        console.log(params);
        this.httpService.UpdateUser(params).subscribe(data => {
            callback(false, data);
        }, error => {
            callback(true, error || 'HTTP fail.');
        });
    }

    // get countries
    public getCountries(callback): any {
        this.httpService.getCountries().subscribe(data => {
            callback(false, data);
        }, error => {
            callback(true, error || 'HTTP fail.');
        });
    }

    //User history list
    public userHistory(params, callback): any {
        console.log("User history in providers :");
        console.log(params);
        this.httpService.userHistory(params).subscribe(data => {
            callback(false, data);
        }, error => {
            callback(true, error || 'HTTP fail.');
        });
    }

    public getDistance(oLat: string, oLng: string, dLat: string, dLng: string, callback): any {
        this.httpService.getDistance(oLat, oLng, dLat, dLng).subscribe(data => {
            callback(false, data);
        }, error => {
            callback(true, error || 'HTTP fail.');
        });
    }


    //rate driver
    public rateDriver(params, callback): any {
        this.httpService.rateDriver(params).subscribe(data => {
            callback(false, data);
        }, error => {
            callback(true, error || 'HTTP fail.');
        });
    }


    //rate driver
    public getCards(params, callback) {
        this.httpService.getCards(params).subscribe(function (data) {
            callback(false, data);
        }, function (error) {
            callback(true, error || 'HTTP fail.');
        });
    };
    //rate driver
    public addCard(params, callback) {
        this.httpService.addCard(params).subscribe(function (data) {
            callback(false, data);
        }, function (error) {
            callback(true, error || 'HTTP fail.');
        });
    };
    //rate driver
    public deleteCard(params, callback) {
        this.httpService.deleteCard(params).subscribe(function (data) {
            callback(false, data);
        }, function (error) {
            callback(true, error || 'HTTP fail.');
        });
    };

    //get pending payments
    public getPendingPayments(params, callback) {
        this.httpService.getPendingPayments(params).subscribe(function (data) {
            callback(false, data);
        }, function (error) {
            callback(true, error || 'HTTP fail.');
        });
    };

    //charge card
    public chargeCard(params, callback) {
        this.httpService.chargeCard(params).subscribe(function (data) {
            callback(false, data);
        }, function (error) {
            callback(true, error || 'HTTP fail.');
        });
    };

    //charge card
    public getCabTypes(callback) {
        this.httpService.getCabTypes().subscribe(function (data) {
            callback(false, data);
        }, function (error) {
            callback(true, error || 'HTTP fail.');
        });
    };

}
