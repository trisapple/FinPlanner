import { Component, OnInit } from '@angular/core';
import { UserService } from '../../user.service';
import { ExpensesService } from '../../expenses.service';
import { SaltedgeService } from 'src/app/saltedge.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { Subscription } from 'rxjs';


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

        this.sortbylatesttransaction(expensesService.transactions2, 0)
        this.sortbylatesttransaction(expensesService.transactions, "made_on")

        console.log(expensesService.transactions)
        console.log(expensesService.transactions2)

        // var aggregatedtransactions = []
        if (userService.loggedin == false) {
          this.aggregatetransactionhistory("test1234@example.com")
        } else {
          this.aggregatetransactionhistory(this.userService.uid)
        }
      });

      res.on("error", function (error) {
        console.error(error);
      });
    });

    req.end();
  }

  // Sort by latest transaction first
  sortbylatesttransaction(array, field) {
    array.sort((a, b) => {
      if (a[field] > b[field]) {
        return -1;
      }
      if (a[field] < b[field]) {
        return 1;
      }
      return 0;
    });
  }

  aggregatetransactionhistory(uid) {
    // Put the account transaction history into firebase at users/{{uid}}/saltedgeconnections/{{saltedgeconnectionid}}/accounts/{{saltedgeaccountid}}
    this.firestore.collection('users').doc(uid).collection("saltedgeconnections").doc(this.saltedgeService.saltedgeconnection["id"]).collection("accounts").doc(this.saltedgeService.saltedgeaccount["id"]).set({
      transactionhistory: this.expensesService.transactions
    }, { merge: true }).then(() => {
      // Get the transaction history of all accounts from firebase and put it in users/{{uid}}/saltedgeconnections/{{saltedgeconnectionid}}
      let sub: Subscription = this.firestore.collection('users').doc(uid).collection("saltedgeconnections").doc(this.saltedgeService.saltedgeconnection["id"]).collection("accounts").valueChanges().subscribe((data) => {
        console.log(data)
        // Loop through the accounts in the salt edge connection
        for (let account of data) {
          console.log(account["transactionhistory"])
          this.aggregatedtransactions = this.aggregatedtransactions.concat(account["transactionhistory"]) // Concatenate the arrays into one array
        }

        this.sortbylatesttransaction(this.aggregatedtransactions, "made_on")
        console.log(this.aggregatedtransactions)
        sub.unsubscribe();

        // Put it in users/{{uid}}/saltedgeconnections/{{saltedgeconnectionid}}
        this.firestore.collection('users').doc(uid).collection("saltedgeconnections").doc(this.saltedgeService.saltedgeconnection["id"]).set({
          transactionhistory: this.aggregatedtransactions
        }, { merge: true })
      })
    })
  }
}
