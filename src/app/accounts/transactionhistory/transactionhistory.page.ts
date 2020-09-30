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
export class TransactionHistoryPage implements OnInit {

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
        console.log(expensesService.transactions)
        // expensesService.transactions.reverse() // Sort by latest transactions first

        var obj = {}
        var transactionlist = []
        for (let transaction of expensesService.transactions) {

          transaction["category"] = expensesService.humanize(transaction["category"]) // Remove underscores and capitalise every word
          transaction["amountcurrencycode"] = transaction["amount"].toLocaleString('en-SG', { style: 'currency', currency: saltedgeService.saltedgeaccountcurrencycode }) // Include currency symbol 

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

        // Sort by latest transactions first
        expensesService.transactions2.sort((a, b) => {
          if (a[0] > b[0]) {
            return -1;
          }

          if (a[0] < b[0]) {
            return 1;
          }

          return 0;
        });

        // Sort by latest transactions first
        expensesService.transactions.sort((a, b) => {
          if (a["made_on"] > b["made_on"]) {
            return -1;
          }

          if (a["made_on"] < b["made_on"]) {
            return 1;
          }

          return 0;
        });
        console.log(expensesService.transactions)
        console.log(expensesService.transactions2)

        var aggregatedtransactions = []
        if (userService.loggedin == false) {
          this.firestore.collection('users').doc("test1234@example.com").collection("saltedgeconnections").doc(saltedgeService.saltedgeconnection["id"]).collection("accounts").doc(saltedgeService.saltedgeaccount["id"]).set({
            transactionhistory: expensesService.transactions
          }, { merge: true }).then(() => {
            let sub: Subscription = firestore.collection('users').doc("test1234@example.com").collection("saltedgeconnections").doc(saltedgeService.saltedgeconnection["id"]).collection("accounts").valueChanges().subscribe((data) => {
              console.log(data)
              for (let account of data) {
                console.log(account["transactionhistory"])
                aggregatedtransactions = aggregatedtransactions.concat(account["transactionhistory"])
              }
              aggregatedtransactions.sort((a, b) => {
                if (a["made_on"] > b["made_on"]) {
                  return -1;
                }
      
                if (a["made_on"] < b["made_on"]) {
                  return 1;
                }
      
                return 0;
              });
              console.log(aggregatedtransactions)
              sub.unsubscribe();

              this.firestore.collection('users').doc("test1234@example.com").collection("saltedgeconnections").doc(saltedgeService.saltedgeconnection["id"]).set({
                transactionhistory: aggregatedtransactions
              }, { merge: true })
            })
          })
        } else {
          this.firestore.collection('users').doc(this.userService.uid).collection("saltedgeconnections").doc(saltedgeService.saltedgeconnection["id"]).collection("accounts").doc(saltedgeService.saltedgeaccount["id"]).set({
            transactionhistory: expensesService.transactions
          }, { merge: true }).then(() => {
            let sub: Subscription = firestore.collection('users').doc(this.userService.uid).collection("saltedgeconnections").doc(saltedgeService.saltedgeconnection["id"]).collection("accounts").valueChanges().subscribe((data) => {
              console.log(data)
              for (let account of data) {
                console.log(account["transactionhistory"])
                aggregatedtransactions = aggregatedtransactions.concat(account["transactionhistory"])
              }
              aggregatedtransactions.sort((a, b) => {
                if (a["made_on"] > b["made_on"]) {
                  return -1;
                }
      
                if (a["made_on"] < b["made_on"]) {
                  return 1;
                }
      
                return 0;
              });
              console.log(aggregatedtransactions)
              sub.unsubscribe();

              this.firestore.collection('users').doc(this.userService.uid).collection("saltedgeconnections").doc(saltedgeService.saltedgeconnection["id"]).set({
                transactionhistory: aggregatedtransactions
              }, { merge: true })
            })
          })
        }
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
