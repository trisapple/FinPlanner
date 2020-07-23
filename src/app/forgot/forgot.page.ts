import { Component, OnInit } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-forgot',
  templateUrl: './forgot.page.html',
  styleUrls: ['./forgot.page.scss'],
})
export class ForgotPage implements OnInit {
  email: string = '';
  password: string = '';
  error: string = '';
  username: string = '';
  // image: number;


  constructor(private fireauth: AngularFireAuth, private router: Router, public loadingController: LoadingController,
              public alertController: AlertController, private toastController: ToastController) { }

  ngOnInit() {
  }

  async openLoader() {
    const loading = await this.loadingController.create({
      message: 'Please Wait ...',
      duration: 2000
    });
    await loading.present();
  }
  async closeLoading() {
    return await this.loadingController.dismiss();
  }

  recover() {
    this.fireauth.sendPasswordResetEmail(this.email)
      .then(data => {
        console.log(data);
        this.presentToast('Password reset email has been sent!', 'bottom', 2000);
        this.router.navigateByUrl('/login');
      })
      .catch(err => {
        console.log(` failed ${err}`);
        this.error = err.message;
      });
  }

  login() {
    this.router.navigateByUrl('/login');
  }

  // tslint:disable-next-line: member-ordering
  async presentToast(message, position, duration) {
    const toast = await this.toastController.create({
      message,
      position,
      duration,
    });
    toast.present();
  }

}
