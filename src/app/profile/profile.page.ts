import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { ToastController } from '@ionic/angular';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  // tslint:disable-next-line: max-line-length
  constructor(public userService: UserService, private router: Router, private fireauth: AngularFireAuth, private toastCtrl: ToastController) {
    if (userService.socialLogin == false) {
      this.userService.profilePicture = 'assets/avatar.png';
    }
  }

  ngOnInit() {
  }

  changePassword() {
    this.router.navigateByUrl('/changepassword');
  }

  updateProfile() {
    this.router.navigateByUrl('/updateprofile');
  }

  async deleteAccount() {
    this.userService.deleteAccount(this.userService.email);
    (await this.fireauth.currentUser).delete()
    .then (data => {
      this.presentToast('Account Deleted!', 'middle', 2000);
      this.router.navigateByUrl('/home');
    });
  }

  async presentToast(message, position, duration) {
    const toast = await this.toastCtrl.create({
      message,
      position,
      duration,
    });
    toast.present();
  }

}
