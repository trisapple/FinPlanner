import { Component } from '@angular/core';
import { UserService } from '../../user.service';
import { ExpensesService } from '../../expenses.service';
import { SaltedgeService } from 'src/app/saltedge.service';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-transactionhistory',
  templateUrl: './transactionhistory.page.html',
  styleUrls: ['./transactionhistory.page.scss'],
})

export class TransactionHistoryPage {

  aggregatedtransactions = []

  constructor(public userService: UserService, public expensesService: ExpensesService, public saltedgeService: SaltedgeService, public firestore: AngularFirestore) {

    var https = require('follow-redirects').https;

    var options = {
      'method': 'GET',
      'hostname': 'quiet-shelf-43690.herokuapp.com',
      // The connection_id and account_id determines where to retrieve the transaction history
      'path': '/https://www.saltedge.com/api/v5/transactions?connection_id=' + this.saltedgeService.saltedgeconnection["id"] + '&account_id=' + this.saltedgeService.saltedgeaccount["id"] + '&per_page=1000',
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
        expensesService.transactions = JSON.parse(body.toString())["data"]

        var transactionhistoryObject = {}
        var transactionhistoryArray = []
        for (let transaction of expensesService.transactions) {
          transaction["category"] = expensesService.humanize(transaction["category"]) // Remove underscores and capitalise every word
          transaction["amountcurrencycode"] = transaction["amount"].toLocaleString('en-SG', { style: 'currency', currency: saltedgeService.saltedgeaccountcurrencycode }) // Include currency symbol 

          // The 5 lines of code below will collate transactions by date
          // transaction["made_on"] is the date of transaction

          // Once we start from the first date or move to a new date, we empty the transactionlist array
          if (transactionhistoryObject[transaction["made_on"]] == undefined) {
            transactionhistoryArray = []
          }

          transactionhistoryArray.push(transaction) // Add the transaction to the array
          transactionhistoryObject[transaction["made_on"]] = transactionhistoryArray // Set the transactionlist array as the value of the date key 
          // e.g. {2018-04-23: Array, 2018-04-22: Array, ... }
        }
        console.log(transactionhistoryObject)
        console.log(Object.entries(transactionhistoryObject))

        // Convert the object into an array so that we can iterate it in HTML
        // e.g. [["2018-04-23", Array], ["2018-04-22", Array], ... ]
        expensesService.transactions2 = Object.entries(transactionhistoryObject)

        expensesService.sortbylatesttransaction(expensesService.transactions2, 0)
        expensesService.sortbylatesttransaction(expensesService.transactions, "made_on")

        console.log(expensesService.transactions)
        console.log(expensesService.transactions2)
      });

      res.on("error", function (error) {
        console.error(error);
      });
    });

    req.end();
  }
}
