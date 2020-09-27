import { Component, OnInit } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../user.service';
import { ExpensesService } from '../expenses.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { Subscription } from 'rxjs';
import { SaltedgeService } from '../saltedge.service';

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.page.html',
  styleUrls: ['./accounts.page.scss'],
})
export class AccountsPage implements OnInit {

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

    var req = https.request(options, function (res) {
      var chunks = [];

      res.on("data", function (chunk) {
        chunks.push(chunk);
      });

      res.on("end", function (chunk) {
        var body = Buffer.concat(chunks);
        console.log(body.toString());
        console.log(JSON.parse(body.toString()));
        window.open(JSON.parse(body.toString())["data"]["connect_url"], "_blank"); // Open a new tab and redirect the user to the connect url to connect their bank account
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
  gotoAccounts(each) {
    console.log(each)
    this.saltedgeService.saltedgeconnection = each
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

    var req = https.request(options, function (res) {
      var chunks = [];

      res.on("data", function (chunk) {
        chunks.push(chunk);
      });

      res.on("end", function (chunk) {
        var body = Buffer.concat(chunks);
        console.log(JSON.parse(body.toString()));
        window.open(JSON.parse(body.toString())["data"]["connect_url"], "_blank");
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

              res.on("data", function (chunk) {
                chunks.push(chunk);
              });

              res.on("end", (chunk) => {
                var body = Buffer.concat(chunks);
                console.log(JSON.parse(body.toString()));
                if (this.userService.loggedin == false) {
                  this.firestore.collection<any>('users').doc("test1234@example.com").collection("saltedgeconnections").doc(connection_id).delete()
                } else {
                  this.firestore.collection<any>('users').doc(this.userService.uid).collection("saltedgeconnections").doc(connection_id).delete()
                }
                this.getsaltedgeaccounts() // Refresh the list of bank accounts
              });

              res.on("error", function (error) {
                console.error(error);
              });
            });

            req.end();

          }
        }
      ]
    });
    await alert.present();
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

      res.on("data", function (chunk) {
        chunks.push(chunk);
      });

      res.on("end", (chunk) => {
        var body = Buffer.concat(chunks);
        // console.log(body.toString());
        console.log(JSON.parse(body.toString()));
        this.saltedgeService.saltedgeconnections = JSON.parse(body.toString())["data"]
        // this.firestore.collection<any>('users').doc("test1234@example.com").update({
        //   saltedgeconnections: JSON.parse(body.toString())["data"]
        // })

        var balances = []
        var currency = {}

        if (this.userService.loggedin == false) {
          let sub: Subscription = this.firestore.collection<any>('users').doc("test1234@example.com").collection("saltedgeconnections").valueChanges().subscribe((data) => {
            console.log(data)
            for (let each of data) {
              console.log(each)
              console.log(each.balances[0])
              console.log(Object.keys(each.balances[0]))

              for (let each2 of Object.keys(each.balances[0])) {
                console.log(each2)
                console.log(each.balances[0][each2])

                if (currency[each2] == undefined) {
                  currency[each2] = 0 // Start from 0
                }
                currency[each2] += each.balances[0][each2]
              }
            }
            balances.push(currency)
            console.log(currency)

            this.firestore.collection('users').doc("test1234@example.com").update({
              balances: balances
            })

            sub.unsubscribe();
          });
        } else {
          let sub: Subscription = this.firestore.collection<any>('users').doc(this.userService.uid).collection("saltedgeconnections").valueChanges().subscribe((data) => {
            console.log(data)
            for (let each of data) {
              console.log(each)
              console.log(each.balances[0])
              console.log(Object.keys(each.balances[0]))

              for (let each2 of Object.keys(each.balances[0])) {
                console.log(each2)
                console.log(each.balances[0][each2])

                if (currency[each2] == undefined) {
                  currency[each2] = 0 // Start from 0
                }
                currency[each2] += each.balances[0][each2]
              }
            }
            balances.push(currency)
            console.log(currency)

            this.firestore.collection('users').doc(this.userService.uid).update({
              balances: balances
            })

            sub.unsubscribe();
          });
        }

        for (let connection of this.saltedgeService.saltedgeconnections) {
          console.log(connection["last_success_at"])
          if (connection["last_success_at"] == null) {
            connection["last_success_at"] = "Never"
          } else {
            connection["last_success_at"] = new Date(connection["last_success_at"]).toLocaleString()
          }
        }
      });

      res.on("error", function (error) {
        console.error(error);
      });
    });

    req.end();
  }

  constructor(public navCtrl: NavController, private activatedRoute: ActivatedRoute, private userService: UserService, private expensesService: ExpensesService, public firestore: AngularFirestore, public alertController: AlertController, public saltedgeService: SaltedgeService) {

    // If user is not logged in, display the test account info.
    // if (this.userService.loggedin != true) {
    //   let sub: Subscription = this.firestore.collection<any>('users').doc("test1234@example.com").valueChanges().subscribe((data) => {

    //     console.log(data)
    //     this.expensesService.saltedgecustomerid = data["saltedgecustomerid"]
    //     this.expensesService.saltedgereportid = data["saltedgereportid"]

    //     sub.unsubscribe();
    //     this.getsaltedgeaccounts()
    //   });
    // } else {
    this.getsaltedgeaccounts()
    // }
  }

  ngOnInit() {
  }
}
