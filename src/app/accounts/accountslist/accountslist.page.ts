import { Component, OnInit } from '@angular/core';
import { ExpensesService } from 'src/app/expenses.service';
import { NavController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/firestore';
import { UserService } from 'src/app/user.service';
import { SaltedgeService } from 'src/app/saltedge.service';

@Component({
  selector: 'app-accountslist',
  templateUrl: './accountslist.page.html',
  styleUrls: ['./accountslist.page.scss'],
})
export class AccountslistPage implements OnInit {

  transactionhistory(account) {
    console.log(account);
    this.saltedgeService.saltedgeaccount = account
    this.expensesService.transactionhistorytitle = account.account_name;
    this.saltedgeService.saltedgeaccountcurrencycode = account.currency_code
    this.navCtrl.navigateForward(['/accounts/transactionhistory']);
  }

  // Onclick to next page, passing account information to the next page
  spendinginsights(account) {
    this.saltedgeService.saltedgeaccount = account
    this.expensesService.transactionhistorytitle = account.account_name
    this.saltedgeService.saltedgeaccountcurrencycode = account.currency_code
    this.navCtrl.navigateForward(['/accounts/spendinginsights']); // Navigate to the next page
  }

  expandItem(item): void {
    // Can expand as many ion-items the user wishes at any one time
    // item.expanded = !item.expanded

    // Only 1 ion-item can be expanded at any one time
    if (item.expanded) {
      item.expanded = false;
    } else {
      this.saltedgeService.saltedgeaccounts.map(listItem => {
        if (item == listItem) {
          listItem.expanded = !listItem.expanded;
        } else {
          listItem.expanded = false;
        }
        return listItem;
      });
    }
  }

  // Get the list of accounts based on the bank
  constructor(public expensesService: ExpensesService, public userService: UserService, public navCtrl: NavController, public firestore: AngularFirestore, public saltedgeService: SaltedgeService) {
    var https = require('follow-redirects').https;

    var options = {
      'method': 'GET',
      'hostname': 'cors-anywhere.herokuapp.com',
      // connection_id determines which accounts to get
      'path': '/https://www.saltedge.com/api/v5/accounts?connection_id=' + this.saltedgeService.saltedgeconnection["id"],
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
        saltedgeService.saltedgeaccounts = JSON.parse(body.toString())["data"]

        var balances = []
        var currency = {}
        var balancescurrencycode = []
        var currencycode = {}

        for (let each of JSON.parse(body.toString())["data"]) {
          if (currency[each.currency_code] == undefined) {
            currency[each.currency_code] = 0 // Start from 0
          }
          currency[each.currency_code] += each.balance
        }
        for (let each of Object.keys(currency)) {
          currencycode[each] = currency[each].toLocaleString('en-SG', { style: 'currency', currency: each })
        }
        // each["balance"].toLocaleString('en-SG', { style: 'currency', currency: each["currency_code"] })
        balances.push(currency)
        balancescurrencycode.push(currencycode)
        console.log(currency)

        if (userService.loggedin == false) {
          firestore.collection('users').doc("test1234@example.com").collection("saltedgeconnections").doc(saltedgeService.saltedgeconnection["id"]).set({
            connectioninfo: JSON.parse(body.toString())["data"],
            balances: balances,
            balancescurrencycode: balancescurrencycode
          })
        } else {
          firestore.collection('users').doc(this.userService.uid).collection("saltedgeconnections").doc(saltedgeService.saltedgeconnection["id"]).set({
            connectioninfo: JSON.parse(body.toString())["data"],
            balances: balances,
            balancescurrencycode: balancescurrencycode
          })
        }

        // Loop through the accounts to get the account name (or nature) and the balance
        for (let each of saltedgeService.saltedgeaccounts) {

          if (each["extra"]["account_name"]) {
            each["account_name"] = each["extra"]["account_name"]
          } else {
            each["account_name"] = expensesService.humanize(each["nature"])
          }
          each["balance"] = each["balance"].toLocaleString('en-SG', { style: 'currency', currency: each["currency_code"] }) // Include currency symbol
          each["expanded"] = false // Allow the expandable to work
        }
        console.log(saltedgeService.saltedgeaccounts)
      });

      res.on("error", function (error) {
        console.error(error);
      });
    });

    req.end();
  }

  ngOnInit() {

  }

}
