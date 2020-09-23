import { Component, OnInit } from '@angular/core';
import { UserService } from '../../user.service';
import { ExpensesService } from '../../expenses.service';
import { SaltedgeService } from 'src/app/saltedge.service';

@Component({
  selector: 'app-transactionhistory',
  templateUrl: './transactionhistory.page.html',
  styleUrls: ['./transactionhistory.page.scss'],
})
export class TransactionHistoryPage implements OnInit {

  constructor(public userService: UserService, public expensesService: ExpensesService, public saltedgeService: SaltedgeService) {

    var https = require('follow-redirects').https;

    var options = {
      'method': 'GET',
      'hostname': 'quiet-shelf-43690.herokuapp.com',
      // The connection_id and account_id determines where to retrieve the transaction history
      'path': '/https://www.saltedge.com/api/v5/transactions?connection_id=' + this.saltedgeService.saltedgeconnection["id"] + '&account_id=' + this.saltedgeService.saltedgeaccount["id"],
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
        expensesService.transactions = JSON.parse(body.toString())["data"]
        console.log(expensesService.transactions)
        expensesService.transactions.reverse() // Sort by latest transactions first

        var obj = {}
        var transactionlist = []
        for (let transaction of expensesService.transactions) {

          transaction["category"] = expensesService.humanize(transaction["category"]) // Remove underscores and capitalise every word
          transaction["amount"] = transaction["amount"].toLocaleString('en-SG', { style: 'currency', currency: saltedgeService.saltedgeaccountcurrencycode }) // Include currency symbol 

          // The 5 lines of code below will collate transactions by date
          // transaction["made_on"] is the date of transaction

          // Once we start from the first date or move to a new date, we empty the transactionlist array
          if (obj[transaction["made_on"]] == undefined) {
            transactionlist = []
          }

          transactionlist.push(transaction) // Add the transaction to the array
          obj[transaction["made_on"]] = transactionlist // Set the transactionlist array as the value of the date key 
          // e.g. {2018-04-23: Array, 2018-04-22: Array, ... }

        }
        console.log(obj)
        var obj2 = Object.entries(obj) // Convert the object into an array so that we can interate it in HTML
        // e.g. [["2018-04-23", Array], ["2018-04-22", Array], ... ]
        expensesService.transactions2 = obj2

        console.log(expensesService.transactions2)
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
