import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class LocalStorageProvider {

    constructor(public http: Http) {
    }
    /*
        Set userId for normail registration
    */
    profileInformation(data) {
        return new Promise(function (resolve, reject) {
            localStorage.setItem('userId', data);
            resolve(true);
        });
    }

    /*
       Get userId for normail registration
   */
    getUserId() {
        var userId = localStorage.getItem('userId')
        return userId;
    }

    /*
       Set provider name after Facebook registration
   */
    fbProviderName(data) {
        
        
        localStorage.setItem('fbProviderName', data.user.providers);
    }

    /*
        Get provider name after Facebook registration
    */
    getFbProviderName() {
        var fbProviderName = localStorage.getItem('fbProviderName')
        return fbProviderName;
    }

    /*
       Set Facebook uId 
   */
    fbUid(data) {
        
        
        localStorage.setItem('fbUid', data.user.uId);
    }

    /*
        Get Facebook uId 
    */
    getFbUid() {
        var fbUid = localStorage.getItem('fbUid')
        return fbUid;
    }

    /*
       Set provider name after google registration
   */
    gProviderName(data) {
        
        
        localStorage.setItem('gProviderName', data.user.providers);
    }

    /*
        Get provider name after google registration
    */
    getGProviderName() {
        var gProviderName = localStorage.getItem('gProviderName')
        return gProviderName;
    }

    /*
       Set google uId 
    */
    gUid(data) {
        
        
        localStorage.setItem('gUid', data.user.uId);
    }

    /*
        Get google uId 
    */
    getGUid() {
        var gUid = localStorage.getItem('gUid')
        return gUid;
    }

    /*
        Set loginId for normail registration
    */
    loginInformation(data) {
        
        
        localStorage.setItem('userId', data.user._id);
    }

    /*
       Get loginId for normail registration
   */
    getLoginId() {
        return localStorage.getItem('userId')
    }

    /*
        Set facebook Id for registration
    */
    facebookLoginInformation(data) {
        
        
        localStorage.setItem('facebookId', data.user._id);
    }

    /*
       Get facebookId for registration
   */
    getFacebookLoginId() {
        var facebookId = localStorage.getItem('facebookId')
        return facebookId;
    }

    /*
        Set google Id for registration
    */
    googleLoginInformation(data) {
        
        
        localStorage.setItem('googleId', data.user._id);
    }

    /*
       Get google Id for registration
   */
    getGoogleLoginId() {
        var googleId = localStorage.getItem('googleId')
        return googleId;
    }

    /*
        Set id after completing facebook registration
    */
    facebookData(data) {
        
        
        localStorage.setItem('fbId', data.user._id);
    }

    /*
       Get id after completing facebook registration
   */
    getFbId() {
        var fbId = localStorage.getItem('fbId')
        return fbId;
    }

    /*
        Set id after completing google registration
    */
    googleData(data) {
        
        
        localStorage.setItem('gId', data.user._id);
    }

    /*
       Get id after completing google registration
   */
    getGId() {
        var gId = localStorage.getItem('gId')
        return gId;
    }

}
