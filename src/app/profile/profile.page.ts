import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { ToastController, AlertController } from '@ionic/angular';
import { NavController } from '@ionic/angular';



@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  // tslint:disable-next-line: max-line-length
  constructor(public userService: UserService, private fireauth: AngularFireAuth, public toastCtrl: ToastController, public alertCtrl: AlertController, public navCtrl: NavController) {
    if (userService.socialLogin == false) {
      this.userService.profilePicture = 'assets/avatar.png';
    }
  }

  ngOnInit() {
  }

  changePassword() {
    this.navCtrl.navigateForward(['/changepassword']);
  }

  updateProfile() {
    this.navCtrl.navigateForward(['/updateprofile']);
  }

  async deleteAccount() {
    // this.presentToast('Account Deleted!', 'middle', 2000);
    // this.navCtrl.navigateForward(['/home']);
    // .then (async data => {
    const alert = await this.alertCtrl.create({
        header: 'Delete Account',
        message: 'Are you sure you want to delete your account?',
        buttons: [
          {
            text: 'Yes',
            handler: async () => {
              this.userService.deleteAccount(this.userService.email);
              (await this.fireauth.currentUser).delete();
              this.navCtrl.navigateForward(['/home']);
              this.presentToast('Account Deleted!', 'middle', 2000);
            }
          },
          {
            text: 'No',
            handler: () => {
              this.navCtrl.pop();
            }
          }
        ]
      });
    await alert.present();
    let result = await alert.onDidDismiss();
    console.log(result);
    // });
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
