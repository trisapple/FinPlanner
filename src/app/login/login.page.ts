import { Component, OnInit } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';
// import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { NavController } from '@ionic/angular';

import { UserService } from '../user.service';
import * as firebase from 'firebase';

import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  email = '';
  password = '';
  error = '';

  constructor(private fireauth: AngularFireAuth,
              // private router: Router,
              public loadingController: LoadingController,
              public alertController: AlertController,
              private toastCtrl: ToastController,
              public navCtrl: NavController,
              public userService: UserService) { }

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
    // tslint:disable-next-line: quotemark
    if (this.email === "" || this.password === "" ) {
      this.presentToast('Please enter your email and password!', 'middle', 2000);
    }
    else {
      this.fireauth.signInWithEmailAndPassword(this.email, this.password)
        .then(res => {
          if (res.user.emailVerified) {
            // console.log(res.user);

            let sub: Subscription = this.userService.login(this.email).subscribe((data) => {

              this.userService.loggedin = true;
              this.userService.firstname = data["firstname"];
              this.userService.lastname = data["lastname"];
              this.userService.email = this.email;

              sub.unsubscribe();
            });

            this.presentToast('Login Successfully!', 'middle', 2000);
            this.navCtrl.navigateRoot('/home');
          }
          else {
            // window.alert('Email is not verified!');
            this.presentToast('Please verfiy your email!', 'middle', 2000);
            return false;
          }
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

  register() {
    this.navCtrl.navigateForward(['/register']);
  }

  forgot() {
    this.navCtrl.navigateForward(['/forgot']);
  }

  async presentToast(message, position, duration) {
    const toast = await this.toastCtrl.create({
      message,
      position,
      duration,
    });
    toast.present();
  }

  loginWithFacebook() {
    this.fireauth.signInWithPopup(new firebase.auth.FacebookAuthProvider())
    .then( res => {
      console.log(res);
      this.navCtrl.navigateRoot('/home');
    });
  }

  loginWithGoogle() {
    this.fireauth.signInWithPopup(new firebase.auth.GoogleAuthProvider())
    .then( res => {
      console.log('From --Google--');
      console.log(res);
      this.navCtrl.navigateRoot('/home');
    });
  }


}
