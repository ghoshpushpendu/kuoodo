import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { AppService } from '../../app.providers';
import { LocalStorageProvider } from '../../app.localStorage';

@IonicPage({ name: 'TransactionsPage' })
@Component({
  selector: 'page-transactions',
  templateUrl: 'transactions.html',
})
export class TransactionsPage {
  public bank: any = {
    bankName: "",
    accountNumber: "",
    ifscCode: "",
    branch: "",
    accountHolder: "",
    userId: ""
  }

  public currentBank: any = {

  }

  constructor(public toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    private localStorageProvider: LocalStorageProvider,
    private appService: AppService,
    public navCtrl: NavController,
    public navParams: NavParams) {
  }

  ionViewDidEnter() {
    console.log('ionViewDidLoad AddcardPage');
    this.bank.userId = localStorage.getItem("driverId");
    this.getBank();
  }

  showToast(message: string) {
    let toast = this.toastCtrl.create({ message: message, duration: 3000, position: 'bottom' });
    toast.present(toast);
  }

  addBank() {
    let _base = this;
    if (_base.currentBank._id) {
      alert("Please remove the current account to add a new one");
      return;
    }
    let loading = this.loadingCtrl.create({ content: "Please wait ..." });
    loading.present();
    _base.appService.createBank(_base.bank, (error, data) => {
      loading.dismiss();
      if (error) {
        _base.showToast("Can not add bank account");
      } else {
        if (data) {
          if (data.error) {
            alert(data.message);
          } else {
            _base.showToast("Bank account has been added successfully");
            _base.getBank();
          }
        }
      }
    });
  }


  getBank() {
    let _base = this;
    let loading = this.loadingCtrl.create({ content: "Please wait ..." });
    loading.present();
    _base.appService.getBank(_base.bank.userId, (error, data) => {
      loading.dismiss();
      if (error) {
        _base.showToast("Can not get bank account");
      } else {
        if (data) {
          if (data.error) {
            alert(data.message);
          } else {
            console.log(data);
            if (data.bank.length != 0) {
              _base.currentBank = data.bank[0];
            } else {
              _base.currentBank = {};
              _base.showToast("No linked bank account found")
            }
          }
        }
      }
    });
  }

  deleteBank() {
    let _base = this;
    let loading = this.loadingCtrl.create({ content: "Please wait ..." });
    loading.present();
    _base.appService.deleteBank(_base.bank.userId, (error, data) => {
      loading.dismiss();
      if (error) {
        _base.showToast("Can not delete bank account");
      } else {
        if (data) {
          if (data.error) {
            alert(data.message);
          } else {
            _base.showToast("Bank account has been deleted successfully");
            _base.currentBank = {};
          }
        }
      }
    });
  }

}