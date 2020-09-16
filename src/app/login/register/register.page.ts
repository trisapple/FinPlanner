import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/auth';
import { NavController } from '@ionic/angular';
import { UserService } from '../../user.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { ExpensesService } from 'src/app/expenses.service';

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

  constructor(private fireauth: AngularFireAuth,
              public toastCtrl: ToastController, public navCtrl: NavController, public userService: UserService, public firestore: AngularFirestore, public expensesService: ExpensesService) { }

  ngOnInit() {
  }

  signup() {
    if (this.name == "" || this.email == "" || this.password == "" || this.confirmPassword == "") { // If either of the fields are empty
      this.presentToast('Please fill up all details!', 'middle', 2000);
    }
    else if (this.confirmPassword !== this.password) { // If passwords do not match
      this.presentToast('Passwords do not match!', 'middle', 2000);
    }
    else { // If all fields are filled up and passwords are matched
      this.fireauth.createUserWithEmailAndPassword(this.email, this.password)
      .then(async res => {
          console.log(res.user);
          this.userService.signup(this.name, this.email, res.user.uid);
          this.createcustomer(this.email, res.user.uid)
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

  createcustomer(email, uid) {
    // Create the customer
    var https = require('follow-redirects').https;

    var options = {
      'method': 'POST',
      'hostname': 'cors-anywhere.herokuapp.com',
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
          this.firestore.collection<any>('users').doc(uid).update({
            saltedgecustomerid: JSON.parse(body.toString())["data"]["id"]
          })
          this.expensesService.saltedgecustomerid = JSON.parse(body.toString())["data"]["id"]
        }
      });

      res.on("error", function (error) {
        console.error(error);
      });
    });

    var postData = JSON.stringify({ "data": { "identifier": email } });
    
    req.write(postData);

    req.end();
  }

}
