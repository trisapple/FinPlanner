import { Component } from '@angular/core';
import { NavController, MenuController } from '@ionic/angular';
import { Router } from '@angular/router';
import { LoginPage } from '../login/login.page';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor(public navCtrl: NavController, private router: Router, private menu: MenuController) {}

  login() {
    // this.navCtrl.setRoot(anOtherPage);
    //this.router.navigateByUrl('/login')
    this.navCtrl.navigateForward('/login')
  }

}
