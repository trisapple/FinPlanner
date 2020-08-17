import { Component, OnInit } from '@angular/core';
import { ToastController, NavController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/auth';


@Component({
  selector: 'app-changepassword',
  templateUrl: './changepassword.page.html',
  styleUrls: ['./changepassword.page.scss'],
})
export class ChangepasswordPage implements OnInit {
  newPassword = '';
  confirmPassword = '';
  error = '';

  constructor(private fireauth: AngularFireAuth, public toastCtrl: ToastController, public navCtrl: NavController) { }

  ngOnInit() {
  }

  async changePassword() {
    if (this.newPassword == "" || this.confirmPassword == "") { // If either of the fields are blank
      this.presentToast('Please fill up all details!', 'middle', 2000);
    }
    else if (this.newPassword !== this.confirmPassword) { // If passwords do not match
      this.presentToast('Passwords do not match!', 'middle', 2000);
    }
    else { // This will only be executed if all fields are filled up and passwords are matched
      (await this.fireauth.currentUser).updatePassword(this.newPassword)
      .then (res => {
        this.presentToast('Your password is successfully changed!', 'middle', 2000);
        this.navCtrl.pop();
      })
      .catch (async error => { // Catch 
        const toast = this.toastCtrl.create({
          message: error.message,
          position: 'middle',
          duration: 2000
        });
        (await toast).present();
      });
    }
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
