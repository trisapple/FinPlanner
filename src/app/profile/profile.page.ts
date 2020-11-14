import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { ToastController, AlertController } from '@ionic/angular';
import { NavController } from '@ionic/angular';
import { ExpensesService } from '../expenses.service';
import { SaltedgeService } from '../saltedge.service';
import { Subscription } from 'rxjs';
import * as firebase from 'firebase';
import { Router } from '@angular/router';



@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  constructor(public userService: UserService, private router: Router, private fireauth: AngularFireAuth, public toastCtrl: ToastController, public alertCtrl: AlertController, public navCtrl: NavController, public expensesService: ExpensesService, public saltedgeService: SaltedgeService) {
    if (userService.socialLogin == false) {
      this.userService.profilePicture = 'assets/avatar.png';
    }

    firebase.auth().onAuthStateChanged((user) => {
      if (user != null) {
        let sub: Subscription = userService.login(user.uid).subscribe((data) => {
          userService.loggedin = true;
          userService.name = data["name"];
          userService.email = user.email;
          userService.uid = user.uid;
          // userService.provider = "Email and Password"
          if (user.providerData[0]["providerId"] == "password") {
            userService.provider = "Email and Password";
          }
          if (user.providerData[0]["providerId"] == "google.com") {
            userService.socialLogin = true;
            userService.provider = "Google";
            userService.profilePicture = user.providerData[0]["photoURL"];
          }
          if (user.providerData[0]["providerId"] == "facebook.com") {
            userService.socialLogin = true;
            userService.provider = "Facebook";
            userService.profilePicture = user.providerData[0]["photoURL"];
          }
          console.log(user);
          // if (this.activatedRoute.snapshot.queryParamMap.get("connection_id")) {
          //   this.connection_id()
          // } else {
          //   this.getsaltedgedata()
          // }
          sub.unsubscribe();
        });
      } else {
        // No user is signed in.
        this.router.navigate(['/login']);
      }
    });
  }

  ngOnInit() {
  }

  changePassword() {
    this.navCtrl.navigateForward(['/profile/changepassword']);
  }

  // updateProfile() {
  //   this.navCtrl.navigateForward(['/profile/updateprofile']);
  // }

  // async deleteAccount() {
  //   const alert = await this.alertCtrl.create({
  //     header: 'Delete Account',
  //     message: 'Are you sure you want to delete your account?',
  //     buttons: [
  //       {
  //         text: 'Yes',
  //         handler: async () => {
  //           this.deletecustomer()
  //           this.userService.deleteAccount(this.userService.uid);
  //           (await this.fireauth.currentUser).delete();
  //           this.navCtrl.navigateRoot(['/home']); // If 'yes' is clicked
  //           this.presentToast('Account Deleted!', 'middle', 2000);
  //           console.log('Yes clicked');
  //         }
  //       },
  //       {
  //         text: 'No',
  //         handler: () => {
  //           // this.navCtrl.pop(); // If 'no' is clicked. Additionally, pop means it will go back to the previous page
  //           console.log('No clicked');
  //         }
  //       }
  //     ]
  //   });
  //   alert.present();
  // }

  // 'async' returns a promise value
  // await is used to wait for a Promise, and it only makes the 'async' block wait and not the entire program execution. 

  async presentToast(message, position, duration) { // presentToast is a method that consists of 3 arguments
    const toast = await this.toastCtrl.create({
      message,
      position,
      duration,
    });
    toast.present();
  }

  // deletecustomer() {
  //   var https = require('follow-redirects').https;

  //   var options = {
  //     'method': 'DELETE',
  //     'hostname': 'quiet-shelf-43690.herokuapp.com',
  //     'path': '/https://www.saltedge.com/api/v5/customers/' + this.saltedgeService.saltedgecustomerid,
  //     'headers': {
  //       'Accept': 'application/json',
  //       'Content-Type': 'application/json',
  //       'App-id': 'XwfTIwSo2aaqEY71Lh4f-dFdvHIj8oNdaGcxD-yB7-I',
  //       'Secret': '2aX68O-S7H5kGBDFRUdXxRtfN377d2ZOrwpJQ-gfzD4'
  //     },
  //     'maxRedirects': 20
  //   };

  //   var req = https.request(options, function (res) {
  //     var chunks = [];

  //     res.on("data", function (chunk) {
  //       chunks.push(chunk);
  //     });

  //     res.on("end", function (chunk) {
  //       var body = Buffer.concat(chunks);
  //       console.log(JSON.parse(body.toString()));
  //     });

  //     res.on("error", function (error) {
  //       console.error(error);
  //     });
  //   });

  //   req.end();
  // }

}
