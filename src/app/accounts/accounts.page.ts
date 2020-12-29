import { Component, OnInit } from '@angular/core';
import { AlertController, NavController, LoadingController, Platform } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../user.service';
import { ExpensesService } from '../expenses.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { Subscription } from 'rxjs';
import { SaltedgeService } from '../saltedge.service';
import * as firebase from 'firebase';
import { Router } from '@angular/router';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.page.html',
  styleUrls: ['./accounts.page.scss'],
})
export class AccountsPage {

  // Connect Bank
  createconnection() {
    // Create the connection
    var https = require('follow-redirects').https;
    var options = {
      'method': 'POST',
      'hostname': 'quiet-shelf-43690.herokuapp.com',
      'path': '/https://www.saltedge.com/api/v5/connect_sessions/create',
      'headers': {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'App-id': 'XwfTIwSo2aaqEY71Lh4f-dFdvHIj8oNdaGcxD-yB7-I',
        'Secret': '2aX68O-S7H5kGBDFRUdXxRtfN377d2ZOrwpJQ-gfzD4',
        'Origin': ''
      },
      'maxRedirects': 20
    };

    var req = https.request(options, (res) => {
      var chunks = [];

      res.on("data", function (chunk) {
        chunks.push(chunk);
      });

      res.on("end", (chunk) => {
        var body = Buffer.concat(chunks);
        console.log(JSON.parse(body.toString()));
        var url = JSON.parse(body.toString())["data"]["connect_url"]
        if (this.platform.is('hybrid')) {
          this.iab.create(url);
        } else {
          window.open(url, "_blank"); // Open a new tab and redirect the user to the connect url to connect their bank account
        }
      });

      res.on("error", function (error) {
        console.error(error);
      });
    });

    // The customer_id determines where to connect the bank account to
    var postData = JSON.stringify({ "data": { "customer_id": this.saltedgeService.saltedgecustomerid, "return_connection_id": true, "consent": { "scopes": ["account_details", "transactions_details"], "from_date": new Date(new Date().setDate(new Date().getDate() - 365)).toDateString() }, "attempt": { "fetch_scopes": ["accounts", "transactions"] } } });

    req.write(postData);

    req.end();
  }

  // When user clicks on their bank, they will be presented a list of their corresponding accounts
  // Pass the relevant array to the accountslist page
  gotoAccounts(saltedgeconnection) {
    console.log(saltedgeconnection)
    this.saltedgeService.saltedgeconnection = saltedgeconnection
    this.navCtrl.navigateForward(["/accounts/accountslist"])
  }

  // Reconnect Bank to refresh data
  reconnect(connection_id) {
    var https = require('follow-redirects').https;

    var options = {
      'method': 'POST',
      'hostname': 'quiet-shelf-43690.herokuapp.com',
      'path': '/https://www.saltedge.com/api/v5/connect_sessions/reconnect',
      'headers': {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'App-id': 'XwfTIwSo2aaqEY71Lh4f-dFdvHIj8oNdaGcxD-yB7-I',
        'Secret': '2aX68O-S7H5kGBDFRUdXxRtfN377d2ZOrwpJQ-gfzD4',
        'Origin': ''
      },
      'maxRedirects': 20
    };

    var req = https.request(options, (res) => {
      var chunks = [];

      res.on("data", function (chunk) {
        chunks.push(chunk);
      });

      res.on("end", (chunk) => {
        var body = Buffer.concat(chunks);
        console.log(JSON.parse(body.toString()));
        var url = JSON.parse(body.toString())["data"]["connect_url"]
        if (this.platform.is('hybrid')) {
          this.iab.create(url);
        } else {
          window.open(url, "_blank"); // Open a new tab and redirect the user to the connect url to connect their bank account
        }
      });

      res.on("error", function (error) {
        console.error(error);
      });
    });

    // The customer_id and connection_id determines the connection to refresh
    var postData = JSON.stringify({ "data": { "customer_id": this.saltedgeService.saltedgecustomerid, "connection_id": connection_id, "return_connection_id": true, "consent": { "scopes": ["account_details", "transactions_details"], "from_date": new Date(new Date().setDate(new Date().getDate() - 365)).toDateString() }, "attempt": { "fetch_scopes": ["accounts", "transactions"] } } });

    req.write(postData);

    req.end();
  }

  // Delete connection
  async deleteconnection(connection_id) {

    const loading = await this.loadingController.create({
      message: 'Deleting Connected Bank...',
    });

    // Create pop up to ask if user wants to delete or not
    const alert = await this.alertController.create({
      // cssClass: 'my-custom-class',
      header: 'Delete Connected Bank?',
      message: 'Are you sure you want to delete the connected bank?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          // cssClass: 'secondary',
          handler: () => {
            console.log('Cancelled');
          }
        }, {
          text: 'Yes',
          handler: () => {
            loading.present();
            console.log('Yes')
            var https = require('follow-redirects').https;

            var options = {
              'method': 'DELETE',
              'hostname': 'quiet-shelf-43690.herokuapp.com',
              // The connection_id determines which connection to delete
              'path': '/https://www.saltedge.com/api/v5/connections/' + connection_id,
              'headers': {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'App-id': 'XwfTIwSo2aaqEY71Lh4f-dFdvHIj8oNdaGcxD-yB7-I',
                'Secret': '2aX68O-S7H5kGBDFRUdXxRtfN377d2ZOrwpJQ-gfzD4',
                'Origin': ''
              },
              'maxRedirects': 20
            };

            var req = https.request(options, (res) => {
              var chunks = [];

              res.on("data", (chunk) => {
                chunks.push(chunk);
                this.loadingController.dismiss()
              });

              res.on("end", (chunk) => {
                var body = Buffer.concat(chunks);
                console.log(JSON.parse(body.toString()));
                if (this.userService.loggedin == false) {
                  this.firestore.collection<any>('users').doc("test1234@example.com").collection("saltedgeconnections").doc(connection_id).delete().then(() => {
                    this.aggregateconnections("test1234@example.com") // Refresh the list of bank accounts
                  })
                } else {
                  this.firestore.collection<any>('users').doc(this.userService.uid).collection("saltedgeconnections").doc(connection_id).delete().then(() => {
                    this.aggregateconnections(this.userService.uid) // Refresh the list of bank accounts
                  })
                }
                this.loadingController.dismiss()
              });

              res.on("error", (error) => {
                console.error(error);
                this.loadingController.dismiss()
              });
            });
            req.end();
          }
        }
      ]
    });
    await alert.present();
  }

  aggregateconnections(uid) {
    var balances = [] // currencies Object to be pushed to this balances array (so that firebase can accept it)
    var currencies = {} // Aggregated currencies from all salt edge connections
    var aggregatedtransactionhistory = []

    // Get the salt edge connections from firebase
    let sub: Subscription = this.firestore.collection<any>('users').doc(uid).collection("saltedgeconnections").valueChanges().subscribe((data) => {
      console.log(data)
      // Loop through each salt edge connection
      for (let saltedgeconnection of data) {
        console.log(saltedgeconnection)
        console.log(saltedgeconnection.balances[0])
        console.log(Object.keys(saltedgeconnection.balances[0]))
        // console.log(Object.keys(saltedgeconnection.spendinginsights))

        // Loop through the currency keys
        // e.g. saltedgeconnection.balances[0] = {GBP: 4301, EUR: 2410}
        // e.g. Object.keys(saltedgeconnection.balances[0]) = ["GBP", "EUR"]
        for (let currency of Object.keys(saltedgeconnection.balances[0])) {
          console.log(currency)
          console.log(saltedgeconnection.balances[0][currency])

          // If the currency is not yet added to the currencies Object
          if (currencies[currency] == undefined) {
            currencies[currency] = 0 // Start from 0
          }
          // Add it to the relevant currency key
          currencies[currency] += saltedgeconnection.balances[0][currency]
        }

        // Add up the transaction histories of every salt edge connection
        aggregatedtransactionhistory = aggregatedtransactionhistory.concat(saltedgeconnection.transactionhistory)
      }
      // Sort the transaction history by descending order (latest transaction first)
      aggregatedtransactionhistory.sort((a, b) => {
        if (a["made_on"] > b["made_on"]) {
          return -1;
        }
        if (a["made_on"] < b["made_on"]) {
          return 1;
        }
        return 0;
      });
      balances.push(currencies)
      console.log(currencies)
      console.log(aggregatedtransactionhistory)

      // Set the aggregated balances, spending insights and transaction history to the users collection
      this.firestore.collection('users').doc(uid).set({
        balances: balances,
        transactionhistory: aggregatedtransactionhistory
      }, { merge: true }).then(() => {
        this.getsaltedgeaccounts()
      })

      sub.unsubscribe();
    });
  }

  // Load the bank accounts
  getsaltedgeaccounts() {
    var https = require('follow-redirects').https;

    var options = {
      'method': 'GET',
      'hostname': 'quiet-shelf-43690.herokuapp.com',
      'path': '/https://www.saltedge.com/api/v5/connections?customer_id=' + this.saltedgeService.saltedgecustomerid,
      'headers': {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'App-id': 'XwfTIwSo2aaqEY71Lh4f-dFdvHIj8oNdaGcxD-yB7-I',
        'Secret': '2aX68O-S7H5kGBDFRUdXxRtfN377d2ZOrwpJQ-gfzD4',
        'Origin': ''
      },
      'maxRedirects': 20
    };

    var req = https.request(options, (res) => {
      var chunks = [];

      res.on("data", (chunk) => {
        chunks.push(chunk);
        this.loadingController.dismiss()
      });

      res.on("end", (chunk) => {
        var body = Buffer.concat(chunks);
        console.log(JSON.parse(body.toString()));
        this.saltedgeService.saltedgeconnections = JSON.parse(body.toString())["data"]

        // Loop through the salt edge connections in salt edge and get the last connected time
        for (let connection of this.saltedgeService.saltedgeconnections) {
          // If there is no last commented time, put it as "Never"
          if (connection["last_success_at"] == null) {
            connection["last_success_at"] = "Never"
          }
          // If there is, convert it to a date to our locale string
          // 2020-09-22T06:55:17Z --> 22/09/2020, 14:55:17
          else {
            connection["last_success_at"] = new Date(connection["last_success_at"]).toLocaleString()
          }
        }
        this.loadingController.dismiss()
      });

      res.on("error", (error) => {
        console.error(error);
        this.loadingController.dismiss()
      });
    });

    req.end();
  }

  async ngOnInit() {
    const loading = await this.loadingController.create({
      message: 'Loading...',
    });
    loading.present();

    firebase.auth().onAuthStateChanged((user) => {
      if (user != null) {
        let sub: Subscription = this.userService.login(user.uid).subscribe((data) => {
          this.userService.loggedin = true;
          this.userService.name = data["name"];
          this.userService.email = user.email;
          this.userService.uid = user.uid;
          // userService.provider = "Email and Password"
          if (user.providerData[0]["providerId"] == "password") {
            this.userService.provider = "Email and Password";
          }
          if (user.providerData[0]["providerId"] == "google.com") {
            this.userService.socialLogin = true;
            this.userService.provider = "Google";
            this.userService.profilePicture = user.providerData[0]["photoURL"];
          }
          if (user.providerData[0]["providerId"] == "facebook.com") {
            this.userService.socialLogin = true;
            this.userService.provider = "Facebook";
            this.userService.profilePicture = user.providerData[0]["photoURL"];
          }
          this.getsaltedgeaccounts()
          // console.log(user);
          // if (this.activatedRoute.snapshot.queryParamMap.get("connection_id")) {
          //   this.connection_id()
          // } else {
          //   this.getsaltedgedata()
          // }
          sub.unsubscribe();
        });
      } else {
        // No user is signed in.
        loading.dismiss()
        this.router.navigate(['/login']);
      }
    });
  }

  constructor(public navCtrl: NavController, public router: Router, private activatedRoute: ActivatedRoute, private userService: UserService, private expensesService: ExpensesService, public firestore: AngularFirestore, public alertController: AlertController, public saltedgeService: SaltedgeService, public loadingController: LoadingController, private iab: InAppBrowser, public platform: Platform) {
  }
}
