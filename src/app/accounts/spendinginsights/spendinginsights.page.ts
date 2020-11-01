import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ExpensesService } from '../../expenses.service';
import { UserService } from '../../user.service';
import { NavController } from '@ionic/angular';
import { SaltedgeService } from 'src/app/saltedge.service';
import { Chart } from 'chart.js';
import { AngularFirestore } from '@angular/fire/firestore';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-spendinginsights',
  templateUrl: './spendinginsights.page.html',
  styleUrls: ['./spendinginsights.page.scss'],
})
export class SpendingInsightsPage {

  @ViewChild("doughnutCanvas") doughnutCanvas: ElementRef;
  private doughnutChart: Chart;

  // Chart.js arrays for doughnut chart
  labels = [] // Categories
  values = [] // Amount spent in categories
  backgroundcolors = [] // Colours for pie chart
  hovercolors = [] // Colours for pie chart when mouse is hovered

  piechartDataobject = {} // Convert pieChartData array into Object
  aggregatedspendinginsights = {} // Aggregated spending insights to be sent to firebase

  constructor(public expensesService: ExpensesService, public userService: UserService, public navCtrl: NavController, public saltedgeService: SaltedgeService, public firestore: AngularFirestore) {

    var https = require('follow-redirects').https;

    var options = {
      'method': 'GET',
      'hostname': 'quiet-shelf-43690.herokuapp.com',
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

        // Variables to keep track of the amount spent in the transaction categories
        var categories = {} // Set up an empty categories Object
        expensesService.total = 0 // Start from 0

        // Loop through the list of transactions and add the transaction amount to the categories accordingly. 
        for (let transaction of expensesService.transactions) {
          transaction.category = expensesService.humanize(transaction.category) // Remove underscores and capitalise every word
          // If the transaction is a negative value
          if (Math.sign(transaction.amount) == -1) {
            // If the category has not yet been added to the categories Object, start it from 0 and add up the value
            if (categories[transaction.category] == undefined) {
              categories[transaction.category] = 0 // Start from 0
            }
            categories[transaction.category] += Math.abs(transaction.amount) // Add up the value to the Object

            expensesService.total += Math.abs(transaction.amount) // Add up the amounts of all the transactions (regardless of name or description)
          }
        }

        console.log(categories)

        expensesService.pieChartData = Object.entries(categories); // Make the key value pairs in the object into an array (to populate the categories and progress bars)
        // {"Food": 83.65, "Shopping": 83.65, ...} becomes 
        // [["Food", 83.65], ["Shopping", 83.65], ... ]

        // Sort the top expenses categories in descending order (from largest to smallest)
        expensesService.pieChartData.sort(function (a, b) {
          return b[1] - a[1]
        });

        for (let category of expensesService.pieChartData) {
          var colors = this.saltedgeService.dynamicColors()
          category[2] = category[1].toLocaleString('en-SG', { style: 'currency', currency: saltedgeService.saltedgeaccountcurrencycode }) // Add currency symbol
          category[3] = (category[1] / expensesService.total * 100).toFixed(1) // Percentage of total expenses
          category[4] = colors[0] // Random background color
          category[5] = colors[1] // Random hover color
          category[6] = saltedgeService.saltedgeaccountcurrencycode // Currency Code of spending insight
          this.labels.push(category[0])
          this.values.push(category[1])
          this.backgroundcolors.push(category[4])
          this.hovercolors.push(category[5])
        }

        console.log(expensesService.pieChartData)

        // Put the pieChartData array into an object so that it can be accepted by firebase
        for (let each of expensesService.pieChartData) {
          this.piechartDataobject[each[0]] = each
        }
        console.log(this.piechartDataobject)

        // Set the piechart data
        this.doughnutChart.config.data.labels = this.labels
        this.doughnutChart.config.data.datasets[0].data = this.values
        this.doughnutChart.config.data.datasets[0].backgroundColor = this.backgroundcolors
        this.doughnutChart.config.data.datasets[0].hoverBackgroundColor = this.hovercolors
        this.doughnutChart.update({ duration: 1000 }) // Refresh the piechart in HTML
        // Duration (in milliseconds) is the how long the animation will take to finish.
        // Remove the duration to remove the animation. 
      });

      res.on("error", function (error) {
        console.error(error);
      });
    });
    req.end();
  }

  ionViewDidEnter() {
    this.doughnutChart = new Chart(this.doughnutCanvas.nativeElement, {
      type: "doughnut",
      data: {
        labels: this.labels,
        datasets: [
          {
            label: "Spending Insights",
            data: this.values,
            backgroundColor: this.backgroundcolors,
            hoverBackgroundColor: this.hovercolors
          }
        ]
      },
      options: {
        maintainAspectRatio: false
      }
    });
  }

  view() {
    this.navCtrl.navigateForward(['/accounts/savingssuggestion']);
    console.log(this.view)
  }

}