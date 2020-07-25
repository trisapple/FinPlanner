import { Component, OnInit } from '@angular/core';
import { Platform, AlertController, ToastController } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { NavController } from '@ionic/angular';
import { UserService } from '../user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  firstName = '';
  lastName = '';
  email = '';
  password = '';
  confirmPassword = '';
  error = '';
  // username: string = '';

  // tslint:disable-next-line: max-line-length
  constructor(private fireauth: AngularFireAuth, private router: Router, private platform: Platform, public loadingController: LoadingController,
              public alertController: AlertController, private toastCtrl: ToastController, public navCtrl: NavController, public userService: UserService) { }

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
    // tslint:disable-next-line: quotemark
    if (this.email === "" || this.password === "" || this.confirmPassword === "") {
      this.presentToast('Please fill up all details!', 'middle', 2000);
    }
    else if (this.confirmPassword !== this.password) {
      this.presentToast('Passwords do not match!', 'middle', 2000);
    }
    else {
      this.fireauth.createUserWithEmailAndPassword(this.email, this.password)
      .then(async res => {
      // tslint:disable-next-line: align
          // if (res.user) {
          // console.log(res.user);
          this.userService.signup(this.firstName, this.lastName, this.email);
          const user = this.fireauth.currentUser;
          (await user).sendEmailVerification();
          this.presentToast('Registered successfully! Email verification has been sent!', 'middle', 2000);
          // this.updateProfile();
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

  async presentToast(message, position, duration) {
    const toast = await this.toastCtrl.create({
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
