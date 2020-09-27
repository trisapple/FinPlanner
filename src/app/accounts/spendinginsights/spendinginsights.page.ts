import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ExpensesService } from '../../expenses.service';
import { UserService } from '../../user.service';
import { NavController } from '@ionic/angular';
import { SaltedgeService } from 'src/app/saltedge.service';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-spendinginsights',
  templateUrl: './spendinginsights.page.html',
  styleUrls: ['./spendinginsights.page.scss'],
})
export class SpendingInsightsPage implements OnInit {

  @ViewChild("doughnutCanvas") doughnutCanvas: ElementRef;
  private doughnutChart: Chart;

  // Chart.js arrays for doughnut chart
  labels = []
  values = []
  backgroundcolors = []
  hovercolors = []

  constructor(public expensesService: ExpensesService, public userService: UserService, public navCtrl: NavController, public saltedgeService: SaltedgeService) {

    // Null the pieChart so that we can refresh the pie chart when switching to another account
    // We load the pieChart with ngif so that it will only show if the data is populated
    expensesService.pieChart = null

    var https = require('follow-redirects').https;

    var options = {
      'method': 'GET',
      'hostname': 'quiet-shelf-43690.herokuapp.com',
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
          var colors = this.saltedgeService.dynamicColors()
          category[2] = category[1].toLocaleString('en-SG', { style: 'currency', currency: saltedgeService.saltedgeaccountcurrencycode }) // Add currency symbol
          category[3] = (category[1] / expensesService.total * 100).toFixed(1) // Percentage of total expenses
          category[4] = colors[0] // Random background color
          category[5] = colors[1] // Random hover color
          this.labels.push(category[0])
          this.values.push(category[1])
          this.backgroundcolors.push(category[4])
          this.hovercolors.push(category[5])
        }

        // Sort the top expenses categories in descending order (from largest to smallest)
        expensesService.pieChartData2.sort(function (a, b) {
          return b[1] - a[1]
        });

        console.log(expensesService.pieChartData)
        console.log(expensesService.pieChartData2)

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

  ionViewDidEnter() {
    setTimeout(() => this.doughnutChart = new Chart(this.doughnutCanvas.nativeElement, {
      type: "doughnut",
      data: {
        labels: this.labels,
        datasets: [
          {
            label: "# of Votes",
            data: this.values,
            backgroundColor: this.backgroundcolors,
            hoverBackgroundColor: this.hovercolors
          }
        ]
      }
    }), 3000);
  }

  view() {
    this.navCtrl.navigateForward(['/accounts/savingssuggestion']);
    console.log(this.view)
  }

}