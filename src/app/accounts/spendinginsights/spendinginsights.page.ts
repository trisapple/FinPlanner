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

  // Ion-segment for doughnut chart
  yeararray = [] // Populate the years (e.g. 2019, 2018, 2017)
  defaultyear = [] // Select the year in the ion-segment
  montharray = [] // Populate the months (Jan - Dec)
  defaultmonth = [] // Select the month in the ion-segment

  made_on_latest = "" // Date of last transaction
  made_on_first = "" // Date of first transaction

  filtereddata = [] // Filtered transaction history by year and month for pie chart
  filtereddata2 = [] // Filter the transaction history further by category from the filtereddata array when the user clicks on the pie

  months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

  constructor(public expensesService: ExpensesService, public userService: UserService, public navCtrl: NavController, public saltedgeService: SaltedgeService, public firestore: AngularFirestore) {

    var https = require('follow-redirects').https;

    var options = {
      'method': 'GET',
      'hostname': 'quiet-shelf-43690.herokuapp.com',
      'path': '/https://www.saltedge.com/api/v5/transactions?connection_id=' + this.saltedgeService.saltedgeconnection["id"] + '&account_id=' + this.saltedgeService.saltedgeaccount["id"] + '&per_page=1000',
      // 'path': '/https://www.saltedge.com/api/v5/transactions?connection_id=' + '301371211005299276' + '&account_id=' + '301374390707161589' + '&per_page=1000',
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
        expensesService.transactions = expensesService.transactions.filter(each => Math.sign(each.amount) == -1);
        this.expensesService.sortbylatesttransaction(this.expensesService.transactions, "made_on")

        this.made_on_latest = this.expensesService.transactions[0]["made_on"] // Get the date of latest transaction
        this.made_on_first = this.expensesService.transactions[this.expensesService.transactions.length - 1]["made_on"] // Get the date of first transaction

        console.log(this.made_on_first)
        console.log(this.made_on_latest)

        // Populate the years for the doughnut chart ion-segment in descending order (e.g. 2019, 2018, 2017)
        for (let i = new Date(this.made_on_latest).getFullYear(); i >= new Date(this.made_on_first).getFullYear(); i--) {
          this.yeararray.push(i)
        }
        this.defaultyear = [this.yeararray[0]] // Set to the latest year

        // Once we set the year, we need to set the month
        // Populate the months and disable or enable them accordingly
        // If there is more than 1 year of data (e.g. 2019, 2018, ...)
        if ((new Date(this.made_on_latest).getFullYear()) != (new Date(this.made_on_first).getFullYear())) {

          this.montharray = [["Jan", true], ["Feb", true], ["Mar", true], ["Apr", true], ["May", true], ["Jun", true], ["Jul", true], ["Aug", true], ["Sep", true], ["Oct", true], ["Nov", true], ["Dec", true]]

          // Loop through the months
          for (let i = 0; i <= this.months.length - 1; i++) {
            // We use if to determine the month
            if ((new Date(this.made_on_latest).getMonth()) == i) {
              // Loop through the months to the month of latest transaction and enable the ion-segments accordingly
              for (let i = 0; i <= (new Date(this.made_on_latest).getMonth()); i++) {
                this.montharray[i][1] = false
              }
              // Loop through the month array and set the month to the latest month
              for (let each of this.montharray) {
                if (each[1] == false) {
                  this.defaultmonth = [[this.months[i], ('0' + (i + 1)).slice(-2)]] // Set the month to the latest month
                }
              }
            }
          }
        }
        // If there is just 1 year of data
        else {
          this.montharray = [["Jan", true], ["Feb", true], ["Mar", true], ["Apr", true], ["May", true], ["Jun", true], ["Jul", true], ["Aug", true], ["Sep", true], ["Oct", true], ["Nov", true], ["Dec", true]]

          // Loop through the months from month of first transaction to the month of latest transaction and enable the ion-segments accordingly
          for (let i = new Date(this.made_on_first).getMonth(); i <= new Date(this.made_on_latest).getMonth(); i++) {
            this.montharray[i][1] = false
          }
          // Set the month to the latest month
          this.defaultmonth = [[this.montharray[new Date(this.made_on_latest).getMonth()][0], ('0' + (new Date(this.made_on_latest).getMonth() + 1)).slice(-2)]]
        }

        // Loop through the list of transactions and add the transaction amount to the categories accordingly. 
        for (let transaction of expensesService.transactions) {
          transaction.category = expensesService.humanize(transaction.category) // Remove underscores and capitalise every word
          transaction["amountcurrencycode"] = transaction["amount"].toLocaleString('en-SG', { style: 'currency', currency: transaction.currency_code }) // Include currency symbol 
        }

        this.looptransactions()
      });

      res.on("error", function (error) {
        console.error(error);
      });
    });
    req.end();
  }

  // When the month in the ion-segment is changed (spending insights pie chart)
  changemonth(ev: any) {
    // Loop through the months array and check if it matches the value of the selected ion-segment
    // If ev.detail.value == "Jan", this.defaultmonth = [["Jan", "01"]]
    // If ev.detail.value == "Feb", this.defaultmonth = [["Feb", "02"]]
    for (let i = 0; i <= this.months.length - 1; i++) {
      if (ev.detail.value == this.months[i]) {
        this.defaultmonth = [[this.months[i], ('0' + (i + 1)).slice(-2)]]
      }
    }

    this.looptransactions()
  }

  // When the year in the ion-segment is changed (spending insights pie chart)
  changeyear(ev: any) {
    this.defaultyear = [ev.detail.value]

    // If on first year of data
    if (ev.detail.value == new Date(this.made_on_first).getFullYear()) {

      // Enable all the ion-segments
      this.montharray = [["Jan", false], ["Feb", false], ["Mar", false], ["Apr", false], ["May", false], ["Jun", false], ["Jul", false], ["Aug", false], ["Sep", false], ["Oct", false], ["Nov", false], ["Dec", false]]

      // Loop through 0 to 11
      for (let i = 0; i <= this.months.length - 1; i++) {
        // We use if to determine the month
        if ((new Date(this.made_on_first).getMonth()) == i) {

          // If the month is February or later, disable the relevant ion-segments as we loop through the montharray. 
          // We have an if to avoid possible error if i = 0, then this.montharray[-1][1] might cause an error
          for (let i = 0; i <= (new Date(this.made_on_first).getMonth()); i++) {
            if (i > 0) {
              this.montharray[i - 1][1] = true
            }
          }

          // If the current ion-segment value will be disabled, shift the value to the first month of data
          for (let each of this.montharray) {
            if (each[1] == true && this.defaultmonth[0][0] == each[0]) {
              this.defaultmonth = [[this.months[i], ('0' + (i + 1)).slice(-2)]]
            }
          }
        }
      }
    }
    // If on last year of data
    else if (ev.detail.value == new Date(this.made_on_latest).getFullYear()) {

      // Disable all the ion-segments
      this.montharray = [["Jan", true], ["Feb", true], ["Mar", true], ["Apr", true], ["May", true], ["Jun", true], ["Jul", true], ["Aug", true], ["Sep", true], ["Oct", true], ["Nov", true], ["Dec", true]]

      for (let i = 0; i <= this.months.length - 1; i++) {
        if ((new Date(this.made_on_latest).getMonth()) == i) {

          // Enable the ion-segments as we loop through the montharray
          for (let i = 0; i <= (new Date(this.made_on_latest).getMonth()); i++) {
            this.montharray[i][1] = false
          }

          // If the current ion-segment value will be disabled, shift the value to the last month of data
          for (let each of this.montharray) {
            if (each[1] == true && this.defaultmonth[0][0] == each[0]) {
              this.defaultmonth = [[this.months[i - 1], ('0' + (i + 1)).slice(-2)]]
            }
          }
        }
      }
    }
    // If not first or last year of data
    else {
      // Enable all ion-segments
      this.montharray = [["Jan", false], ["Feb", false], ["Mar", false], ["Apr", false], ["May", false], ["Jun", false], ["Jul", false], ["Aug", false], ["Sep", false], ["Oct", false], ["Nov", false], ["Dec", false]]
    }

    this.looptransactions()
  }

  // Filter transaction history and populate the pie chart
  looptransactions() {
    var categories = {}
    this.labels = []
    this.values = []
    this.backgroundcolors = []
    this.hovercolors = []

    // Filter the aggregated transaction history based on the year and month
    this.filtereddata = this.expensesService.transactions.filter(each => each["made_on"].includes((this.defaultyear[0] + "-" + this.defaultmonth[0][1])));

    // Loop through the list of transactions. Based on the transaction description, add the transaction amount to the categories accordingly. 
    for (let transaction of this.filtereddata) {
      // If the transaction is a negative value
      if (Math.sign(transaction.amount) == -1) {
        // If the category has not yet been added to the categories Object, start it from 0 and add up the value
        if (categories[transaction.category] == undefined) {
          categories[transaction.category] = 0 // Start from 0

          // Randomly generate the pie color for the category
          var colors = this.saltedgeService.dynamicColors()
          this.backgroundcolors.push(colors[0])
          this.hovercolors.push(colors[1])
        }
        // console.log(this.exchangerates[transaction.currency_code])

        // Add up the value to the category and multiply it by the exchange rate
        categories[transaction.category] += Math.abs(transaction.amount)
      }
    }

    this.filtereddata2 = this.filtereddata.slice() // Copy the filtereddata array to the filtereddata2 array

    var categoriesarray = Object.entries(categories)

    // Sort by largest value first
    categoriesarray.sort((a, b) => {
      if (a[1] > b[1]) {
        return -1;
      }
      if (a[1] < b[1]) {
        return 1;
      }
      return 0;
    });

    for (let each of categoriesarray) {
      this.labels.push(each[0])
      this.values.push(each[1])
    }

    console.log(categoriesarray)

    // Set the piechart data
    this.doughnutChart.config.data.labels = this.labels
    this.doughnutChart.config.data.datasets[0].data = this.values
    this.doughnutChart.config.data.datasets[0].backgroundColor = this.backgroundcolors
    this.doughnutChart.config.data.datasets[0].hoverBackgroundColor = this.hovercolors
    this.doughnutChart.update({ duration: 1000 }) // Refresh the piechart in HTML
    // Duration (in milliseconds) is the how long the animation will take to finish.
    // Remove the duration to remove the animation. 
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
        maintainAspectRatio: false,
        onClick: (evt, elements) => {
          var datasetIndex;
          var dataset;

          const { left, right, top, bottom } = this.doughnutChart.chartArea; // We have this to exclude the chart legend because it also has its own onclick otherwise we would override it
          if (evt.offsetX > left && evt.offsetX < right && evt.offsetY > top && evt.offsetY < bottom) {
            if (elements.length) {
              var index = elements[0]._index;
              datasetIndex = elements[0]._datasetIndex;

              // Reset old state
              dataset = this.doughnutChart.data.datasets[datasetIndex];
              dataset.backgroundColor = this.backgroundcolors.slice();
              dataset.hoverBackgroundColor = this.hovercolors.slice();

              dataset.backgroundColor[index] = this.hovercolors[index]; // click color
              dataset.hoverBackgroundColor[index] = this.hovercolors[index];
              this.filtereddata2 = this.filtereddata.filter(each => each["category"].includes(this.labels[index]) && Math.sign(each.amount) == -1); // Filtered expenses by category
            } else {
              // remove hover styles
              for (datasetIndex = 0; datasetIndex < this.doughnutChart.data.datasets.length; ++datasetIndex) {
                dataset = this.doughnutChart.data.datasets[datasetIndex];
                dataset.backgroundColor = this.backgroundcolors.slice();
                dataset.hoverBackgroundColor = this.hovercolors.slice();
              }
              this.filtereddata2 = this.filtereddata.slice() // Put back the originally filtered expenses
            }
            this.doughnutChart.update();
          }
        }
      }
    });
  }

  view() {
    this.navCtrl.navigateForward(['/accounts/savingssuggestion']);
    console.log(this.view)
  }

}