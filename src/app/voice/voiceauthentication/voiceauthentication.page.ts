import { Component, OnInit } from '@angular/core';
import { UserService } from '../../user.service'
import { AngularFireAuth } from '@angular/fire/auth';
import { NavController } from '@ionic/angular';


@Component({
  selector: 'app-voiceauthentication',
  templateUrl: './voiceauthentication.page.html',
  styleUrls: ['./voiceauthentication.page.scss'],
})
export class VoiceauthenticationPage implements OnInit {

  constructor(public userService: UserService, private fireauth: AngularFireAuth, public navCtrl: NavController) { }

  ngOnInit() {
  }

  // signOut() {
  //   this.userService.loggedin = false;
  //   this.userService.socialLogin = false;
  //   this.fireauth.signOut().then(() => {
  //     this.navCtrl.navigateRoot('/login');
  //   });
  // }

}
