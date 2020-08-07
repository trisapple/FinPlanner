import { Component, OnInit } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-forgot',
  templateUrl: './forgot.page.html',
  styleUrls: ['./forgot.page.scss'],
})
export class ForgotPage implements OnInit {
  email = '';
  password = '';
  error = '';
  username = '';

  constructor(private fireauth: AngularFireAuth, private router: Router,
              public alertController: AlertController, private toastCtrl: ToastController, public navCtrl: NavController) { }

  ngOnInit() {
  }

  recover() {
    if (this.email == "") {
      this.presentToast('Please enter your email!', 'middle', 2000);
    }
    else {
      this.fireauth.sendPasswordResetEmail(this.email)
        .then(data => {
          console.log(data);
          this.presentToast('Password reset email has been sent!', 'bottom', 2000);
          this.navCtrl.pop();
        })
        .catch (async error => {
          const toast = this.toastCtrl.create({
            message: error.message,
            position: 'middle',
            duration: 2000
          });
          (await toast).present();
        });
    }
  }

  login() {
    // this.router.navigateByUrl('/login');
    this.navCtrl.pop();
  }

  // tslint:disable-next-line: member-ordering
  async presentToast(message, position, duration) {
    const toast = await this.toastCtrl.create({
      message,
      position,
      duration,
    });
    toast.present();
  }

}
