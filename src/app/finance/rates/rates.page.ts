import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Router, NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-rates',
  templateUrl: './rates.page.html',
  styleUrls: ['./rates.page.scss'],
})
export class RatesPage implements OnInit {
  jsonData:any=[];

  constructor(public navCtrl: NavController, private router: Router) { 
    this.initializeJSONData();
  }

  FilterJSONData(ev: any) {
    this.initializeJSONData();
    const val = ev.target.value;
    if (val && val.trim() != '') {
      this.jsonData = this.jsonData.filter((item=>{
        return (item.name.toLowerCase().indexOf(val.toLowerCase())>-1);
      }))
    }
  }

  ngOnInit() {
  }

  // stocks() {
  //   this.navCtrl.navigateForward(['/exchangerates/stocks']);
  // }

  // fxrates() {
  //   this.navCtrl.navigateForward(['/exchangerates/fxrates']);
  // }

  // crypto() {
  //   this.navCtrl.navigateForward(['/exchangerates/crypto']);
  // }


  initializeJSONData() {
    this.jsonData =  [
      {
        "name": "Microsoft Corporation (MSFT)",
        "symbol": "MSFT"
      },
      {
        "name": "Apple (AAPL)",
        "symbol": "AAPL"
      },
    {
      "name": "Tesla (TSLA)",
      "symbol": "TSLA"
    },
    ]
  }

  details(obj) {
    console.log(obj)
    let navigationExtras: NavigationExtras = {
      state: {
        symbol: obj
      }
    };
    this.router.navigate(['finance/viewexchangerates'], navigationExtras);
  }
}
