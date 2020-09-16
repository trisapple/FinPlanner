import { Component, OnInit } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../user.service';
import { ExpensesService } from '../expenses.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { Subscription } from 'rxjs';

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
      'hostname': 'cors-anywhere.herokuapp.com',
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
    var postData = JSON.stringify({ "data": { "customer_id": this.expensesService.saltedgecustomerid, "return_connection_id": true, "consent": { "scopes": ["account_details", "transactions_details"] }, "attempt": { "fetch_scopes": ["accounts", "transactions"] } } });

    req.write(postData);

    req.end();
  }

  // When user clicks on their bank, they will be presented a list of their corresponding accounts
  // Pass the relevant array to the accountslist page
  gotoAccounts(each) {
    console.log(each)
    this.expensesService.saltedgeconnection = each
    this.navCtrl.navigateForward(["/accounts/accountslist"])
  }

  // Reconnect Bank to refresh data
  reconnect(connection_id) {
    var https = require('follow-redirects').https;

    var options = {
      'method': 'POST',
      'hostname': 'cors-anywhere.herokuapp.com',
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
    var postData = JSON.stringify({ "data": { "customer_id": this.expensesService.saltedgecustomerid, "connection_id": connection_id, "consent": { "scopes": ["account_details", "transactions_details"] }, "attempt": { "fetch_scopes": ["accounts", "transactions"] } } });

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
              'hostname': 'cors-anywhere.herokuapp.com',
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
      'hostname': 'cors-anywhere.herokuapp.com',
      'path': '/https://www.saltedge.com/api/v5/connections?customer_id=' + this.expensesService.saltedgecustomerid,
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
        this.expensesService.saltedgeconnections = JSON.parse(body.toString())["data"]
        for (let connection of this.expensesService.saltedgeconnections) {
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

  constructor(public navCtrl: NavController, private activatedRoute: ActivatedRoute, private userService: UserService, private expensesService: ExpensesService, public firestore: AngularFirestore, public alertController: AlertController) {

    // If user is not logged in, display the test account info.
    if (this.userService.loggedin != true) {
      let sub: Subscription = this.firestore.collection<any>('users').doc("test1234@example.com").valueChanges().subscribe((data) => {

        console.log(data)
        this.expensesService.saltedgecustomerid = data["saltedgecustomerid"]

        sub.unsubscribe();
        this.getsaltedgeaccounts()
      });
    } else {
      this.getsaltedgeaccounts()
    }
  }

  ngOnInit() {
  }
}
