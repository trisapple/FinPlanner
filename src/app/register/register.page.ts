import { Component, OnInit } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/auth';
import { NavController } from '@ionic/angular';
import { UserService } from '../user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  name = '';
  email = '';
  password = '';
  confirmPassword = '';
  error = '';

  // tslint:disable-next-line: max-line-length
  constructor(private fireauth: AngularFireAuth,
              // tslint:disable-next-line: max-line-length
              public alertController: AlertController, private toastCtrl: ToastController, public navCtrl: NavController, public userService: UserService) { }

  ngOnInit() {
  }

  signup() {
    // tslint:disable-next-line: quotemark
    if (this.name == "" || this.email == "" || this.password == "" || this.confirmPassword == "") {
      this.presentToast('Please fill up all details!', 'middle', 2000);
    }
    else if (this.confirmPassword !== this.password) {
      this.presentToast('Passwords do not match!', 'middle', 2000);
    }
    else {
      this.fireauth.createUserWithEmailAndPassword(this.email, this.password)
      .then(async res => {
      // tslint:disable-next-line: align
          console.log(res.user);
          this.userService.signup(this.name, this.email);
          const user = this.fireauth.currentUser;
          (await user).sendEmailVerification();
          this.presentToast('Registered successfully! Email verification has been sent!', 'middle', 2000);
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

}
