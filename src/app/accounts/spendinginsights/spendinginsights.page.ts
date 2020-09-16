import { Component, OnInit } from '@angular/core';
import { ExpensesService } from '../../expenses.service';
import { UserService } from '../../user.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-spendinginsights',
  templateUrl: './spendinginsights.page.html',
  styleUrls: ['./spendinginsights.page.scss'],
})
export class SpendingInsightsPage implements OnInit {

  constructor(public expensesService: ExpensesService, public userService: UserService, public navCtrl: NavController) {

    // Null the pieChart so that we can refresh the pie chart when switching to another account
    // We load the pieChart with ngif so that it will only show if the data is populated
    expensesService.pieChart = null

    var https = require('follow-redirects').https;

    var options = {
      'method': 'GET',
      'hostname': 'cors-anywhere.herokuapp.com',
      'path': '/https://www.saltedge.com/api/v5/transactions?connection_id=' + this.expensesService.saltedgeconnection["id"] + '&account_id=' + this.expensesService.saltedgeaccount["id"],
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

        // Variables to keep track of the amount spent in the transaction categories
        var obj = {} // Set up an empty Object
        expensesService.total = 0 // Start from 0

        obj["category"] = 'Amount' // Add this for the pie chart

        // Loop through the list of transactions. Based on the transaction description, add the transaction amount to the categories accordingly. 
        for (let transaction of expensesService.transactions) {
          transaction.category = expensesService.humanize(transaction.category) // Remove underscores and capitalise every word
          // If the transaction is a negative value
          if (Math.sign(transaction.amount) == -1) {
            // If the category has not yet been added to the Object, start it from 0 and add up the value
            if (obj[transaction.category] == undefined) {
              obj[transaction.category] = 0 // Start from 0
            }
            obj[transaction.category] += Math.abs(transaction.amount) // Add up the value to the Object

            expensesService.total += Math.abs(transaction.amount) // Add up the amounts of all the transactions (regardless of name or description)
          }
          console.log(expensesService.total)
        }

        console.log(obj)

        expensesService.pieChartData = Object.entries(obj); // Make the key value pairs in the object into an array (to put into google chart dataTable)
        // {"category": "Amount", "Food": 83.65, ...} becomes 
        // [["category", "Amount"], ["Food", 83.65], ... ]

        // Create another array for the progress bar because we need to remove the obj["category"] = 'Amount' at the beginning to display the progress bar of the expenses
        expensesService.pieChartData2 = Object.entries(obj);
        expensesService.pieChartData2.shift() // Remove the obj["category"] = 'Amount' at the beginning

        for (let category of expensesService.pieChartData2) {
          category[2] = category[1].toLocaleString('en-SG', { style: 'currency', currency: expensesService.saltedgeaccountcurrencycode }) // Add currency symbol
          category[3] = (category[1]/expensesService.total*100).toFixed(1) // Percentage of total expenses
        }

        // Sort the top expenses categories in descending order (from largest to smallest)
        expensesService.pieChartData2.sort(function (a, b) {
          return b[1] - a[1]
        });

        console.log(expensesService.pieChartData)

        // Piechart Data
        expensesService.pieChart = {
          chartType: 'PieChart',
          dataTable: expensesService.pieChartData,
          //opt_firstRowIsData: true,
          options: {
            'title': 'Spendings by Category',
            height: 400,
            width: '100%',
            pieHole: 0.5,
            backgroundColor: { fill: 'transparent' },
            legend: { textStyle: { color: 'gray' } }
          },
        };
      });

      res.on("error", function (error) {
        console.error(error);
      });
    });

    req.end();

  }

  ngOnInit() {
  }

  view() {
    this.navCtrl.navigateForward(['/accounts/savingssuggestion']);
    console.log(this.view)
  }

}
