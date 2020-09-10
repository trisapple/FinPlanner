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
    this.expensesService.transactionhistorytitle = account.nature;
    // this.expensesService.transactionhistoryaccountId = account.accountId;
    this.navCtrl.navigateForward(['/accounts/transactionhistory']);
  }

  // Onclick to next page, passing account information to the next page
  spendinginsights(account) {
    this.expensesService.saltedgeaccount = account
    this.expensesService.transactionhistorytitle = account.nature
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

    var test = []
  }

  constructor(public expensesService: ExpensesService, public navCtrl: NavController) { 
    var https = require('follow-redirects').https;

    var options = {
      'method': 'GET',
      'hostname': 'cors-anywhere.herokuapp.com',
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
        for (let each of expensesService.saltedgeaccounts) {
          if (each["nature"] == 'account') {
            each["nature"] = 'Account'
          }
          if (each["nature"] == 'savings') {
            each["nature"] = 'Savings'
          }
          if (each["nature"] == 'credit_card') {
            each["nature"] = 'Credit Card'
          }
          each["expanded"] = false
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
