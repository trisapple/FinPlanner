import { Component, OnInit } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { NavController } from '@ionic/angular';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  email: string = '';
  password: string = '';
  error: string = '';

  constructor(private fireauth: AngularFireAuth,
              private router: Router,
              public loadingController: LoadingController,
              public alertController: AlertController, private toastController: ToastController, public navCtrl: NavController) { }

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

  login() {
    this.fireauth.signInWithEmailAndPassword(this.email, this.password)
      .then(res => {
        if (res.user.emailVerified) {
          // console.log(res.user);
          this.presentToast('Login Successfully!', 'middle', 2000);
          this.navCtrl.navigateRoot('/home');
        }
        else {
          // window.alert('Email is not verified!');
          this.presentToast('Please verfiy your email!', 'middle', 2000);
          return false;
        }
      })
      .catch(err => {
        console.log(`login failed ${err}`);
        this.error = err.message;
      });
  }

  register() {
    this.navCtrl.navigateForward(['/register']);
  }

  forgot() {
    this.navCtrl.navigateForward(['/forgot']);
  }

  async presentToast(message, position, duration) {
    const toast = await this.toastController.create({
      message,
      position,
      duration,
    });
    toast.present();
  }

}
