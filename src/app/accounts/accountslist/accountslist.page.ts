import { Component, OnInit } from '@angular/core';
import { ExpensesService } from 'src/app/expenses.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-accountslist',
  templateUrl: './accountslist.page.html',
  styleUrls: ['./accountslist.page.scss'],
})
export class AccountslistPage implements OnInit {

  // Citibank
  transactionhistory(account) {
    console.log(account);
    this.expensesService.saltedgeaccount = account
    this.expensesService.transactionhistorytitle = account.account_name;
    this.expensesService.saltedgeaccountcurrencycode = account.currency_code
    // this.expensesService.transactionhistoryaccountId = account.accountId;
    this.navCtrl.navigateForward(['/accounts/transactionhistory']);
  }

  // Onclick to next page, passing account information to the next page
  spendinginsights(account) {
    this.expensesService.saltedgeaccount = account
    this.expensesService.transactionhistorytitle = account.account_name
    this.expensesService.saltedgeaccountcurrencycode = account.currency_code
    // this.expensesService.transactionhistoryaccountId = account.accountId // Store the account id in a global variable so that the next page can fetch the transaction details and show the expenses summary
    this.navCtrl.navigateForward(['/accounts/spendinginsights']); // Navigate to the next page
  }

  expandItem(item): void {
    // Can expand as many ion-items the user wishes at any one time
    // item.expanded = !item.expanded

    // Only 1 ion-item can be expanded at any one time
    if (item.expanded) {
      item.expanded = false;
    } else {
      this.expensesService.saltedgeaccounts.map(listItem => {
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
  constructor(public expensesService: ExpensesService, public navCtrl: NavController) {
    var https = require('follow-redirects').https;

    var options = {
      'method': 'GET',
      'hostname': 'cors-anywhere.herokuapp.com',
      // connection_id determines which accounts to get
      'path': '/https://www.saltedge.com/api/v5/accounts?connection_id=' + this.expensesService.saltedgeconnection["id"],
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
        expensesService.saltedgeaccounts = JSON.parse(body.toString())["data"]

        // Remove underscores and capitalise every word (e.g. fees_and_charges becomes Fees And Charges)
        function humanize(str) {
          var i, frags = str.split('_');
          for (i = 0; i < frags.length; i++) {
            frags[i] = frags[i].charAt(0).toUpperCase() + frags[i].slice(1);
          }
          return frags.join(' ');
        }

        // Loop through the accounts to get the account name (or nature) and the balance
        for (let each of expensesService.saltedgeaccounts) {

          if (each["extra"]["account_name"]) {
            each["account_name"] = each["extra"]["account_name"]
          } else {
            each["account_name"] = humanize(each["nature"])
          }
          each["balance"] = each["balance"].toLocaleString('en-SG', { style: 'currency', currency: each["currency_code"] }) // Include currency symbol
          each["expanded"] = false // Allow the expandable to work
        }
        console.log(expensesService.saltedgeaccounts)
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
