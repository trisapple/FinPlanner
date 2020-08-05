import { Component, OnInit } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';
import { Platform } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/auth';
import { NavController } from '@ionic/angular';

import { UserService } from '../user.service';
import * as firebase from 'firebase';

import { Subscription } from 'rxjs';

import { Plugins } from '@capacitor/core';
import { HttpClient } from '@angular/common/http';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook/ngx';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  email = '';
  password = '';
  error = '';
  // showPassword = false;
  // passwordToggleIcon = 'eye-off';

  constructor(private fireauth: AngularFireAuth,
              public alertController: AlertController,
              private toastCtrl: ToastController,
              public navCtrl: NavController,
              public userService: UserService,
              public http: HttpClient,
              public platform: Platform,
              private googlePlus: GooglePlus,
              private fb: Facebook
              ) { }

  ngOnInit() {
  }

  // async openLoader() {
  //   const loading = await this.loadingController.create({
  //     message: 'Please Wait ...',
  //     duration: 2000
  //   });
  //   await loading.present();
  // }
  // async closeLoading() {
  //   return await this.loadingController.dismiss();
  // }

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
              this.userService.name = data["name"];
              this.userService.email = this.email;
              this.userService.provider = "Email and Password"

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

  async loginWithFacebook(): Promise<void> {
    // If running in an iOS or Android App
    if (this.platform.is('hybrid')) {

      this.fb.login(['public_profile', 'user_friends', 'email'])
        .then((res: FacebookLoginResponse) => {
          console.log('Logged into Facebook!', res)
          const accessToken = res.authResponse.accessToken
          this.fireauth.signInWithCredential(firebase.auth.FacebookAuthProvider.credential(accessToken))
          .then (res => {
            this.getFacebookUserData(accessToken);
          })
          .catch (err => {
            console.log(err)
            alert(err)
          })
        })
        .catch(e => {
          console.log('Error logging into Facebook', e)
        });

      this.fb.logEvent(this.fb.EVENTS.EVENT_NAME_ADDED_TO_CART);


      // const FACEBOOK_PERMISSIONS = ['email', 'user_birthday', 'user_photos', 'user_gender'];
      // await Plugins.FacebookLogin.login({ permissions: FACEBOOK_PERMISSIONS })
      // .then (result => {
      //   if (result.accessToken) {
      //     // Login successful.
      //     console.log(result)
      //     console.log(`Facebook access token is ${result.accessToken.token}`);
      //     this.fireauth.signInWithCredential(firebase.auth.FacebookAuthProvider.credential(result.accessToken.token))
      //     .then (res => {
      //       this.getFacebookUserData(result.accessToken.token);
      //     })
      //     .catch (err => {
      //       console.log(err)
      //       alert(err)
      //     })
      //   } else {
      //     // Cancelled by user.
      //   }
      // })
      // .catch (err => {
      //   console.log(err)
      //   alert(err)
      // })
    }
    // If running on the web
    else {
      this.fireauth.signInWithPopup(new firebase.auth.FacebookAuthProvider())
        .then(res => {
        this.getFacebookUserData((<any>res).credential.accessToken);
        this.presentToast('Login Successfully!', 'middle', 2000);
        console.log(res);
        this.navCtrl.navigateRoot('/home');
      })
      .catch(err => {
        console.log(err);
        alert(err);
      });
    }
}

  getFacebookUserData(accessToken) {
    const endpoint = `https://graph.facebook.com/me?fields=name,email,picture.width(400).height(400)&access_token=${accessToken}`
    this.http.get(endpoint).toPromise().then(result => {
      console.log("Get Facebook User Data");
      console.log(result);
      this.userService.name = result["name"];
      this.userService.email = result["email"];
      this.userService.profilePicture = result["picture"]["data"]["url"];
      this.userService.loggedin = true;
      this.userService.socialLogin = true
      this.userService.provider = "Facebook"
      this.navCtrl.navigateRoot('/home');
    }).catch((err) => {
      console.log(err)
    });
  }

  async loginWithGoogle() {
    // If running in an iOS or Android App
    if (this.platform.is('hybrid')) {
      try {
        const user = await this.googlePlus.login({
          'webClientId': '671807746722-beipop6ng5ke1asn9ha50eqpm1fn677o.apps.googleusercontent.com',
          'offline': true,
          'scopes': 'profile email'
        })

        return await this.fireauth.signInWithCredential(
          firebase.auth.GoogleAuthProvider.credential(user.idToken)
        ).then(result => {
          console.log(result)
          this.userService.name = result["user"]["displayName"];
          this.userService.email = result["user"]["email"];
          this.userService.profilePicture = result["user"]["photoURL"];
          this.userService.loggedin = true;
          this.navCtrl.navigateRoot('/home');
        }).catch(err => {
          console.log(err)
          alert(err)
        })
      } catch(err) {
        console.log(err)
      }
    } 
    // If running on the web
    else {
      this.fireauth.signInWithPopup(new firebase.auth.GoogleAuthProvider())
      .then( res => {
        this.userService.loggedin = true;
        this.userService.name = res.user.displayName;
        this.userService.email = res.user.email;
        this.userService.profilePicture = res.user.photoURL;
        this.presentToast('Login Successfully!', 'middle', 2000);
        console.log('From --Google--');
        console.log(res);
        this.userService.socialLogin = true
        this.userService.provider = "Google"
        // alert(res)
        this.navCtrl.navigateRoot('/home');
      })
      .catch(err => {
        console.log(err);
        alert(err);
      });
    }
  }
  // passwordToggle(): void {
  //   this.showPassword = !this.showPassword;
 
  //   if (this.passwordToggleIcon == 'eye-off') {
  //     this.passwordToggleIcon = 'eye';
  //   }
  //   else {
  //     this.passwordToggleIcon = 'eye-off';
  //   }
  //  }
}
