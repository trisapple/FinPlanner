import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';


@Component({
  selector: 'app-exchangerates',
  templateUrl: './exchangerates.page.html',
  styleUrls: ['./exchangerates.page.scss'],
})
export class ExchangeratesPage implements OnInit {

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
