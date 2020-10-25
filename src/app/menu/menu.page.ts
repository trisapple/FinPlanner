import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service'
import { AngularFireAuth } from '@angular/fire/auth';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})

export class MenuPage implements OnInit {

  constructor(public userService: UserService, private fireauth: AngularFireAuth, public navCtrl: NavController) { }

  ngOnInit() {
  }

  signout() {
    this.userService.loggedin = false;
    this.userService.socialLogin = false;
    this.fireauth.signOut().then(() => {
      this.navCtrl.navigateRoot('/home');
    });
  }

}
