import { Component, OnInit, Input } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';
import { Platform } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/auth';
import { NavController } from '@ionic/angular';

import { UserService } from '../user.service';
import * as firebase from 'firebase';

import { Subscription } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { ExpensesService } from '../expenses.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { SaltedgeService } from '../saltedge.service';
import { ModalController } from '@ionic/angular';
import { FingerprintPage } from '../fingerprint/fingerprint.page'

import { FingerprintAIO } from '@ionic-native/fingerprint-aio/ngx';
import { Router } from '@angular/router';

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
  @Input() isModal: boolean;

  constructor(private fireauth: AngularFireAuth,
    public alertController: AlertController,
    public toastCtrl: ToastController,
    public navCtrl: NavController,
    public userService: UserService,
    public http: HttpClient,
    public platform: Platform,
    private googlePlus: GooglePlus,
    private fb: Facebook,
    public expensesService: ExpensesService,
    public firestore: AngularFirestore,
    public saltedgeService: SaltedgeService,
    private modalCtrl: ModalController,
    private faio: FingerprintAIO,
    private router: Router
  ) { }

  ngOnInit() {
    console.log('I am modal: ', this.isModal);
  }

  login() {
    if (this.email == "" || this.password == "") { // If email or password are null
      this.presentToast('Please enter your email and password!', 'middle', 2000);
    }
    else { // If both email and password are not null
      this.fireauth.signInWithEmailAndPassword(this.email, this.password)
        .then(res => {
          if (res.user.emailVerified) { // To check whether has the user verified his/her email
            console.log(res.user);

            let sub: Subscription = this.userService.login(res.user.uid).subscribe((data) => {

              console.log(data)
              this.userService.loggedin = true;
              this.userService.uid = res.user.uid
              this.userService.name = data["name"];
              this.userService.email = data["email"];
              this.userService.provider = "Email and Password";

              this.presentToast('Login Successfully!', 'middle', 2000); // Will be executed if email is verified

              if (this.platform.is('hybrid')) {
                this.checkVoice()
              } else {
                this.navCtrl.navigateRoot('/home');
              }

              // this.navCtrl.navigateRoot('/voice/voiceauthentication');

              sub.unsubscribe();
            });
          }
          else {
            this.presentToast('Please verfiy your email!', 'middle', 2000); // Will be executed if email is not verified
          }
        })
        .catch(async error => {
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
    this.navCtrl.navigateForward(['/login/register']);
  }

  forgot() {
    this.navCtrl.navigateForward(['/login/forgot']);
  }

  gotoVoice() {
    this.navCtrl.navigateForward(['/voice']);
  }

  gotoFP() {
    // this.lockApp();
    // this.navCtrl.navigateForward(['/fingerprint'])
    this.faio.show({
      title: 'Biometric Authentication', // (Android Only) | optional | Default: "<APP_NAME> Biometric Sign On"
      subtitle: 'For Login Verification,', // (Android Only) | optional | Default: null
      description: 'Please authenticate', // optional | Default: null
      fallbackButtonTitle: 'Use Pin', // optional | When disableBackup is false defaults to "Use Pin".
      // When disableBackup is true defaults to "Cancel"
      disableBackup: true,  // optional | default: false
    }).then(() => {
      if (this.isModal) {
        this.modalCtrl.dismiss().then(() => {
          this.modalCtrl.dismiss();
        })
      }
      else {
        this.router.navigateByUrl('/home');
      }
    })
      .catch((error: any) => console.log(error));
  }

  async lockApp() {
    const modal = await this.modalCtrl.create({
      component: FingerprintPage,
      backdropDismiss: false,
      cssClass: 'lock-modal',
      componentProps: {
        isModal: true
      }
    });
    modal.present();
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
          console.log('Logged into Facebook!', res);
          const accessToken = res.authResponse.accessToken;
          this.fireauth.signInWithCredential(firebase.auth.FacebookAuthProvider.credential(accessToken))
            .then(res => {
              this.getFacebookUserData(accessToken);
              this.userService.uid = res.user.uid
              if (res.additionalUserInfo.isNewUser) {
                this.userService.signup(res.user.displayName, res.user.email, res.user.uid)
                this.createcustomer()
                this.navCtrl.navigateRoot('/home');
              } else {
                if (this.platform.is('hybrid')) {
                  this.checkVoice()
                } else {
                  this.navCtrl.navigateRoot('/home');
                }
              }
            })
            .catch(err => {
              console.log(err);
              alert(err);
            });
        })
        .catch(e => {
          console.log('Error logging into Facebook', e);
        });

      this.fb.logEvent(this.fb.EVENTS.EVENT_NAME_ADDED_TO_CART);
    }
    // If running on the web
    else {
      this.fireauth.signInWithPopup(new firebase.auth.FacebookAuthProvider())
        .then(res => {
          this.getFacebookUserData((<any>res).credential.accessToken); // Get the user's Facebook Account Data
          this.presentToast('Login Successfully!', 'middle', 2000);
          console.log(res);
          this.userService.uid = res.user.uid
          if (res.additionalUserInfo.isNewUser) {
            this.userService.signup(res.user.displayName, res.user.email, res.user.uid)
            this.createcustomer()
            this.navCtrl.navigateRoot('/home');
          } else {
            if (this.platform.is('hybrid')) {
              this.checkVoice()
            } else {
              this.navCtrl.navigateRoot('/home');
            }
          }
          // this.navCtrl.navigateRoot('/home');
        })
        .catch(err => {
          console.log(err);
          alert(err);
        });
    }
  }

  // This method helps to retrieve a better quality profile picture
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
      // this.navCtrl.navigateRoot('/home');
    }).catch((err) => {
      console.log(err);
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
        });

        return await this.fireauth.signInWithCredential(
          firebase.auth.GoogleAuthProvider.credential(user.idToken)
        ).then(res => {
          console.log(res);
          this.userService.name = res.user.displayName;
          this.userService.email = res.user.email;
          this.userService.profilePicture = res.user.photoURL;
          this.userService.uid = res.user.uid;
          this.userService.loggedin = true;
          this.userService.socialLogin = true;
          this.userService.provider = "Google";
          if (res.additionalUserInfo.isNewUser) {
            this.userService.signup(res.user.displayName, res.user.email, res.user.uid)
            this.createcustomer()
            this.navCtrl.navigateRoot('/home');
          } else {
            if (this.platform.is('hybrid')) {
              this.checkVoice()
            } else {
              this.navCtrl.navigateRoot('/home');
            }
          }
          // this.navCtrl.navigateRoot('/home');
        }).catch(err => {
          console.log(err);
          alert(err);
        });
      } catch (err) {
        console.log(err);
      }
    }
    else {
      this.fireauth.signInWithPopup(new firebase.auth.GoogleAuthProvider())
        .then(res => {
          // Get the user's Google Account Data
          this.userService.loggedin = true;
          this.userService.name = res.user.displayName;
          this.userService.email = res.user.email;
          this.userService.profilePicture = res.user.photoURL;
          this.userService.uid = res.user.uid;
          if (res.additionalUserInfo.isNewUser) {
            this.userService.signup(res.user.displayName, res.user.email, res.user.uid)
            this.createcustomer()
            this.navCtrl.navigateRoot('/home');
          } else {
            if (this.platform.is('hybrid')) {
              this.checkVoice()
            } else {
              this.navCtrl.navigateRoot('/home');
            }
          }
          this.presentToast('Login Successfully!', 'middle', 2000);
          console.log('From --Google--');
          console.log(res);
          this.userService.socialLogin = true;
          this.userService.provider = "Google";
          // this.navCtrl.navigateRoot('/home');
        })
        .catch(err => {
          console.log(err);
          alert(err);
        });
    }
  }

  checkVoice() {
    var https = require('follow-redirects').https;

    var options = {
      'method': 'POST',
      'hostname': 'quiet-shelf-43690.herokuapp.com',
      'path': '/https://vpr-sg.oneconnectft.com.sg/vprc_dmz/api/isRegister',
      'headers': {
        'Content-Type': 'application/json',
        'Origin': ''
        // 'Cookie': 'visid_incap_2206674=diWXZ/9yQS6dKEFlN427l9KCy18AAAAAQUIPAAAAAACogEWogMY6HwFQ+XupmRes; route=eac4da8a8199714d9b2d17eb97fcdb41; incap_ses_943_2206674=ShYcDzzdgAg2V/ZFmDUWDUHG2F8AAAAAIGUJL1rl9FPnLhS7GZP/lA=='
      },
      'maxRedirects': 20
    };

    var req = https.request(options, (res) => {
      var chunks = [];

      res.on("data", (chunk) => {
        chunks.push(chunk);
        // this.statusCheck = false
      });

      res.on("end", (chunk) => {
        var body = Buffer.concat(chunks);
        console.log(body.toString());
        // this.statusCheck = false
        // User has registered

        if (Object.keys(JSON.parse(body.toString()).data).length === 0 && (JSON.parse(body.toString()).data).constructor === Object) {
          alert("VoicePrint API returned no data.")
        } else {
          if (JSON.parse(body.toString()).data.returnData.code == "201") {
            // this.isVoiceEnrolled = true
            this.navCtrl.navigateRoot('/voice/voiceauthentication');
          } else {
            this.navCtrl.navigateRoot('/home');
          }
        }
      });

      res.on("error", (error) => {
        console.error(error);
        // this.statusCheck = false
      });
    });

    var postData = JSON.stringify({ "appId": "10013", "scene": "sg_temasekpoly_cll", "appIdKey": "2534eb7d19b5427a93fa7449882e1fea", "token": "494cea4ee98171754dc7e61b225baaca", "timestamp": "1552958446757", "userId": this.userService.uid });

    req.write(postData);

    req.end();
  }

  // Create the customer in salt edge
  createcustomer() {
    var https = require('follow-redirects').https;

    var options = {
      'method': 'POST',
      'hostname': 'quiet-shelf-43690.herokuapp.com',
      'path': '/https://www.saltedge.com/api/v5/customers/',
      'headers': {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'App-id': 'XwfTIwSo2aaqEY71Lh4f-dFdvHIj8oNdaGcxD-yB7-I',
        'Secret': '2aX68O-S7H5kGBDFRUdXxRtfN377d2ZOrwpJQ-gfzD4',
        'Origin': ''
      },
      'maxRedirects': 20
    };

    var req = https.request(options, res => {
      var chunks = [];

      res.on("data", function (chunk) {
        chunks.push(chunk);
      });

      res.on("end", chunk => {
        var body = Buffer.concat(chunks);
        console.log(body.toString());
        console.log(JSON.parse(body.toString()));

        if (JSON.parse(body.toString())["data"]) {
          this.firestore.collection<any>('users').doc(this.userService.uid).update({
            saltedgecustomerid: JSON.parse(body.toString())["data"]["id"]
          })
          this.saltedgeService.saltedgecustomerid = JSON.parse(body.toString())["data"]["id"]
        }
      });

      res.on("error", function (error) {
        console.error(error);
      });
    });

    var postData = JSON.stringify({ "data": { "identifier": this.userService.email } });

    req.write(postData);

    req.end();
  }
}
