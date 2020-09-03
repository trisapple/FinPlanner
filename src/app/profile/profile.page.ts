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

  constructor(public userService: UserService, private fireauth: AngularFireAuth, public toastCtrl: ToastController, public alertCtrl: AlertController, public navCtrl: NavController) {
    if (userService.socialLogin == false) {
      this.userService.profilePicture = 'assets/avatar.png';
    }
  }

  ngOnInit() {
  }

  changePassword() {
    this.navCtrl.navigateForward(['/profile/changepassword']);
  }

  // updateProfile() {
  //   this.navCtrl.navigateForward(['/profile/updateprofile']);
  // }

  async deleteAccount() {
    const alert = await this.alertCtrl.create({
        header: 'Delete Account',
        message: 'Are you sure you want to delete your account?',
        buttons: [
          {
            text: 'Yes',
            handler: async () => {
              this.userService.deleteAccount(this.userService.uid);
              (await this.fireauth.currentUser).delete();
              this.navCtrl.navigateRoot(['/home']); // If 'yes' is clicked
              this.presentToast('Account Deleted!', 'middle', 2000);
              console.log('Yes clicked');
            }
          },
          {
            text: 'No',
            handler: () => {
              // this.navCtrl.pop(); // If 'no' is clicked. Additionally, pop means it will go back to the previous page
              console.log('No clicked');
            }
          }
        ]
      });
      alert.present();
  }

  // 'async' returns a promise value
  // await is used to wait for a Promise, and it only makes the 'async' block wait and not the entire program execution. 

  async presentToast(message, position, duration) { // presentToast is a method that consists of 3 arguments
    const toast = await this.toastCtrl.create({
      message,
      position,
      duration,
    });
    toast.present();
  }

}
