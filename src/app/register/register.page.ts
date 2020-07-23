import { Component, OnInit } from '@angular/core';
import { Platform, AlertController, ToastController } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  email: string = '';
  password: string = '';
  error: string = '';
  // username: string = '';

  // tslint:disable-next-line: max-line-length
  constructor(private fireauth: AngularFireAuth, private router: Router, private platform: Platform, public loadingController: LoadingController,
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

  signup() {
    this.fireauth.createUserWithEmailAndPassword(this.email, this.password)
      .then(async res => {
        if (res.user) {
          console.log(res.user);
          const user = this.fireauth.currentUser;
          (await user).sendEmailVerification();
          this.presentToast('Registered successfully! Email verification has been sent!', 'middle', 2000);
          // this.updateProfile();
          this.router.navigateByUrl('/login');
        }
      })
      .catch(err => {
        console.log(`login failed ${err}`);
        this.error = err.message;
      });
  }

  login() {
    // this.router.navigateByUrl('/login');
    this.navCtrl.pop()
  }

  async presentToast(message, position, duration) {
    const toast = await this.toastController.create({
      message,
      position,
      duration,
    });
    toast.present();
  }

  // updateProfile() {
  //   this.fireauth.onAuthStateChanged((user) => {
  //     if (user) {
  //       console.log(user);
  //       user.updateProfile({
  //         displayName: this.username,
  //       })
  //         .then(() => {
  //           this.router.navigateByUrl('/login');
  //         });
  //     }
  //   });
  // }


}
