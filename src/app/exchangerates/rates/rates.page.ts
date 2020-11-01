import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-rates',
  templateUrl: './rates.page.html',
  styleUrls: ['./rates.page.scss'],
})
export class RatesPage implements OnInit {

  constructor(public navCtrl: NavController) { }

  ngOnInit() {
  }

  stocks() {
    this.navCtrl.navigateForward(['/exchangerates/stocks']);
  }

  fxrates() {
    this.navCtrl.navigateForward(['/exchangerates/fxrates']);
  }

  crypto() {
    this.navCtrl.navigateForward(['/exchangerates/crypto']);
  }




}
