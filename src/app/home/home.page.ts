import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { LoadingController, ModalController, NavController } from '@ionic/angular';
import { NavigationExtras, Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../user.service';
import { Subscription } from 'rxjs';
import * as firebase from 'firebase';

import { AngularFirestore } from '@angular/fire/firestore';
import { ExpensesService } from '../expenses.service';
import { SaltedgeService } from '../saltedge.service';


import { Chart } from 'chart.js';
// import { FingerprintPage } from '../fingerprint/fingerprint.page';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  @ViewChild("barCanvas") barCanvas: ElementRef;
  @ViewChild("doughnutCanvas") doughnutCanvas: ElementRef;
  @ViewChild("doughnutCanvas2") doughnutCanvas2: ElementRef;
  @ViewChild("lineCanvas") lineCanvas: ElementRef;

  private barChart: Chart;
  private doughnutChart: Chart;
  private doughnutChart2: Chart;
  private lineChart: Chart;

  // Chart.js arrays for bar chart (full data)
  labels = [] // e.g. ["Jan 2019", "Feb 2019", "Mar 2019", "Apr 2019", "May 2019", "Jun 2019"]
  incomevalues = [] // e.g. [100, 200, 300]
  expensevalues = [] // e.g. [100, 200, 300]

  // Chart.js arrays for bar chart (partial data, to show a fraction of the data such as 3 months, 6 months, 1 year)
  labelsspliced = []
  incomevaluesspliced = []
  expensevaluesspliced = []

  // Set the default bar chart view to 3 months
  // E.g. we have a labels array of ["Jan 2019", "Feb 2019", "Mar 2019", "Apr 2019", "May 2019", "Jun 2019"]
  startindex = 3 // startindex = 3 is "Apr 2019"
  endindex = 1 // endindex = 1 is "Jun 2019"
  // Same goes for incomevalues and expensevalues array
  segmentvalue = "3months"

  // Chart.js arrays for doughnut chart
  spendinginsightlabels = [] // Categories (e.g. Shopping)
  spendinginsightvalues = [] // Values of the categories (e.g. $100)
  backgroundcolors = [] // Colours for pie chart
  hovercolors = [] // Colours for pie chart when mouse is hovered

  // Chart.js arrays for doughnut chart
  incomeinsightlabels = [] // Categories (e.g. Shopping)
  incomeinsightvalues = [] // Values of the categories (e.g. $100)
  incomebackgroundcolors = [] // Colours for pie chart
  incomehovercolors = [] // Colours for pie chart when mouse is hovered

  firebasedata = {} // User data from firebase by calling users/{uid}
  exchangerates = {} // Exchange rates from api.exchangeratesapi.io to convert foreign currency to SGD
  filtereddata = [] // Filtered transaction history by year and month for pie chart
  filtereddata2 = [] // Filter the transaction history further by category from the filtereddata array when the user clicks on the pie
  filtereddata3 = []
  // We create another array so that we can re-copy the filtereddata array when the user clicks somewhere outside of the pie chart

  // Ion-segment for doughnut chart
  yeararray = [] // Populate the years (e.g. 2019, 2018, 2017)
  defaultyear = [] // Select the year in the ion-segment
  montharray = [] // Populate the months (Jan - Dec)
  defaultmonth = [] // Select the month in the ion-segment

  made_on_latest = "" // Date of last transaction
  made_on_first = "" // Date of first transaction

  total = "" // Balance converted to SGD
  originaltotal = [] // Balances of all currencies of the user (e.g. SGD, EUR, GBP)
  currencycode = "SGD" // Converted currency code (to display in html)
  sgdonly = true // To display different text in home.page.html

  months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  month = ""
  year = ""
  monthlyspend = ""
  monthlyincome = ""
  savings = ""

  // "Previous" button for bar chart to go back one month
  previousmonth() {
    // If statement to ensure that the bar chart does not go out of bounds of the full data arrays (labels, incomevalues, expensevalues)
    if (this.startindex < this.labels.length) {
      this.updateBarChart(1, 1)
    }
  }

  // "Next" button for bar chart to advance one month
  nextmonth() {
    // If statement to ensure that the bar chart does not go out of bounds of the full data arrays (labels, incomevalues, expensevalues)
    if (this.endindex > 1) {
      this.updateBarChart(-1, -1)
    }
  }

  // Update bar chart data when previous, next, or any of the ion-segment buttons are clicked
  updateBarChart(startindex, endindex) {

    // Update the startindex and endindex so that we can determine where to collect the data from the full data arrays (labels, incomevalues, expensevalues)
    this.startindex = this.startindex + startindex
    this.endindex = this.endindex + endindex

    // Empty the arrays so that we can populate the data with the new startindex and endindex using the for loop below
    this.labelsspliced = []
    this.expensevaluesspliced = []
    this.incomevaluesspliced = []

    // Populate the partial data arrays (labelsspliced, expensevaluesspliced, incomevaluesspliced) from full data arrays (labels, expensevalues and incomevalues)
    for (let i = this.startindex; i >= this.endindex; i--) {

      // We check for undefined so that we can remove the 'undefined' word when the labelsspliced array (partial data) goes out of bounds of the labels array (full data)
      if (this.labels[this.labels.length - i] == undefined) {
        this.labelsspliced.push("") // Push an empty string to remove the 'undefined' word at the bottom
      } else {
        this.labelsspliced.push(this.labels[this.labels.length - i]) // Populate the months and years
      }
      if (this.expensevalues[this.expensevalues.length - i] == undefined) {
        this.expensevaluesspliced.push(0) // Push a zero value to make the expensevaluesspliced array in line with the labels array
        // If we remove it the bars won't move along with the labels
      } else {
        this.expensevaluesspliced.push(this.expensevalues[this.expensevalues.length - i]) // Populate the monthly expense values
      }
      if (this.incomevalues[this.incomevalues.length - i] == undefined) {
        this.incomevaluesspliced.push(0) // Push a zero value to make the incomevaluesspliced array in line with the labels array
        // If we remove it the bars won't move along with the labels
      } else {
        this.incomevaluesspliced.push(this.incomevalues[this.incomevalues.length - i]) // Populate the monthly income values
      }
    }

    // Set the barchart data
    this.barChart.data.datasets[0].data = this.incomevaluesspliced
    this.barChart.data.datasets[1].data = this.expensevaluesspliced
    this.barChart.data.labels = this.labelsspliced
    this.barChart.update({ duration: 1000 }) // Refresh the barchart in HTML
    // Duration (in milliseconds) is the how long the animation will take to finish.
    // Remove the duration to remove the animation. 
  }

  // Any change in ion-segment selection at the bar chart will call this method.  
  barchartsegmentChanged(ev: any) {
    if (ev.detail.value == "1month") {
      this.segmentvalue = "1month"
    }
    // If "3 months" is selected
    if (ev.detail.value == "3months") {
      // If the ion-segment selection is changed from "6 months" to "3 months"
      if (this.segmentvalue == "6months") {
        this.updateBarChart(-3, 0) // We minus the start index (move right of the array) to remove the first 3 months of the spliced data
      }
      // If the ion-segment selection is changed from "1 year" to "3 months"
      if (this.segmentvalue == "1year") {
        this.updateBarChart(-9, 0)
      }
      this.segmentvalue = "3months" // Set the segment value
    }
    // If "6 months" is selected
    if (ev.detail.value == "6months") {
      if (this.segmentvalue == "3months") {
        this.updateBarChart(3, 0)
      }
      if (this.segmentvalue == "1year") {
        this.updateBarChart(-6, 0)
      }
      this.segmentvalue = "6months"
    }
    // If "1 year" is selected
    if (ev.detail.value == "1year") {
      if (this.segmentvalue == "3months") {
        this.updateBarChart(9, 0)
      }
      if (this.segmentvalue == "6months") {
        this.updateBarChart(6, 0)
      }
      this.segmentvalue = "1year"
    }
    if (ev.detail.value == "all") {
      this.segmentvalue = "all"
    }
  }

  // When the month in the ion-segment is changed (spending insights pie chart)
  changemonth(ev: any) {
    // Loop through the months array and check if it matches the value of the selected ion-segment
    // If ev.detail.value == "Jan", this.defaultmonth = [["Jan", "01"]]
    // If ev.detail.value == "Feb", this.defaultmonth = [["Feb", "02"]]
    for (let i = 0; i <= this.months.length - 1; i++) {
      if (ev.detail.value == this.months[i]) {
        this.defaultmonth = [[this.months[i], ('0' + (i + 1)).slice(-2)]]
        this.month = this.months[i]
      }
    }

    this.looptransactions()

    // Set the piechart data
    this.doughnutChart.config.data.labels = this.spendinginsightlabels
    this.doughnutChart.config.data.datasets[0].data = this.spendinginsightvalues
    this.doughnutChart.config.data.datasets[0].backgroundColor = this.backgroundcolors
    this.doughnutChart.config.data.datasets[0].hoverBackgroundColor = this.hovercolors
    this.doughnutChart.update({ duration: 1000 }) // Refresh the piechart in HTML
    // Duration (in milliseconds) is the how long the animation will take to finish.
    // Remove the duration to remove the animation. 
  }

  // When the year in the ion-segment is changed (spending insights pie chart)
  changeyear(ev: any) {
    this.defaultyear = [ev.detail.value]
    this.year = ev.detail.value

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
              this.month = this.months[i]
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
              this.month = this.months[i - 1]
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

    // Set the piechart data
    this.doughnutChart.config.data.labels = this.spendinginsightlabels
    this.doughnutChart.config.data.datasets[0].data = this.spendinginsightvalues
    this.doughnutChart.config.data.datasets[0].backgroundColor = this.backgroundcolors
    this.doughnutChart.config.data.datasets[0].hoverBackgroundColor = this.hovercolors
    this.doughnutChart.update({ duration: 1000 }) // Refresh the piechart in HTML
    // Duration (in milliseconds) is the how long the animation will take to finish.
    // Remove the duration to remove the animation. 
  }

  // Get the exchange rates from an API as the Salt Edge Insights API is not working
  getexchangerates() {
    var https = require('follow-redirects').https;

    var options = {
      'method': 'GET',
      'hostname': 'api.exchangeratesapi.io',
      'path': '/latest?base=SGD',
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
        this.exchangerates = JSON.parse(body.toString()).rates

        this.loadHTML()
      });

      res.on("error", function (error) {
        console.error(error);
      });
    });

    req.end();
  }

  populatebarchart(start, end, year) {
    for (let i = start; i <= end; i++) {
      this.labels.push(this.months[i] + " " + year) // Create the label (e.g. Jan 2019)

      // Filter the expenses and income based on month
      var filteredexpenses = this.firebasedata["transactionhistory"].filter(each => each["made_on"].includes(year + "-" + ('0' + (i + 1)).slice(-2)) && Math.sign(each.amount) == -1);
      var filteredincome = this.firebasedata["transactionhistory"].filter(each => each["made_on"].includes(year + "-" + ('0' + (i + 1)).slice(-2)) && Math.sign(each.amount) == 1);

      // Start from 0
      var expenses = 0
      var income = 0

      // Loop through the transaction and add up the amounts for the month
      for (let each of filteredexpenses) {
        expenses += Math.abs(each["amount"])
      }
      for (let each of filteredincome) {
        income += each.amount
      }

      // Add it to the full data array
      this.expensevalues.push(expenses)
      this.incomevalues.push(income)

      // Once done, repeat for subsequent months
    }
  }

  loadHTML() {
    console.log(this.firebasedata["transactionhistory"])

    // Loop through the year from the beginning
    for (let year = new Date(this.made_on_first).getFullYear(); year <= new Date(this.made_on_latest).getFullYear(); year++) {

      // If there's data for other years (e.g. data for 2017, 2018, 2019)
      if ((new Date(this.made_on_latest).getFullYear()) != (new Date(this.made_on_first).getFullYear())) {
        // If at first year
        if (year == new Date(this.made_on_first).getFullYear()) {
          this.populatebarchart(new Date(this.made_on_first).getMonth(), 11, year)
        }
        // If at last year
        else if (year == new Date(this.made_on_latest).getFullYear()) {
          this.populatebarchart(0, new Date(this.made_on_latest).getMonth(), year)
        }
        // If not at first or last year
        else {
          this.populatebarchart(0, 11, year)
        }
      }
      // If there's only less than 1 year of data (e.g. only data for 2020 and no other year)
      else {
        this.populatebarchart(new Date(this.made_on_first).getMonth(), new Date(this.made_on_latest).getMonth(), year)
      }
    }

    for (let i = this.startindex; i >= this.endindex; i--) {
      this.labelsspliced.push(this.labels[this.labels.length - i])
      this.expensevaluesspliced.push(this.expensevalues[this.expensevalues.length - i])
      this.incomevaluesspliced.push(this.incomevalues[this.incomevalues.length - i])
    }

    // Set the barchart data
    this.barChart.data.datasets[0].data = this.incomevaluesspliced
    this.barChart.data.datasets[1].data = this.expensevaluesspliced
    this.barChart.data.labels = this.labelsspliced
    this.barChart.update({ duration: 1000 }) // Refresh the barchart in HTML
    // Duration (in milliseconds) is the how long the animation will take to finish.
    // Remove the duration to remove the animation. 
    if (this.firebasedata["balances"]) {
      this.originaltotal = Object.entries(this.firebasedata["balances"][0]) // Get the balances of all currencies of the user (e.g. SGD, EUR, GBP)
    } else {
      this.firebasedata["balances"] = []
    }
    
    var total = 0 // Start from 0
    for (let each of this.originaltotal) {
      each[2] = each[1].toLocaleString('en-SG', { style: 'currency', currency: each[0] }) // Add currency symbol

      // Check if any of the currencies are not in SGD
      if (each[0] != "SGD") {
        this.sgdonly = false
      }

      total += each[1] * (1 / this.exchangerates[each[0]]) // Convert to SGD and add up the total
    }
    this.total = total.toLocaleString('en-SG', { style: 'currency', currency: "SGD" }) // Show the total with currency symbol

    // Populate the years for the doughnut chart ion-segment in descending order (e.g. 2019, 2018, 2017)
    for (let i = new Date(this.made_on_latest).getFullYear(); i >= new Date(this.made_on_first).getFullYear(); i--) {
      this.yeararray.push(i)
    }
    this.defaultyear = [this.yeararray[0]] // Set to the latest year
    this.year = this.yeararray[0]

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
              this.month = this.months[i]
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
      this.month = this.montharray[new Date(this.made_on_latest).getMonth()][0]
    }

    this.looptransactions()
  }

  // Filter transaction history and populate the pie chart
  looptransactions() {
    var categories = {}
    var categories2 = {}
    this.spendinginsightlabels = []
    this.spendinginsightvalues = []
    this.backgroundcolors = []
    this.hovercolors = []

    this.incomeinsightlabels = []
    this.incomeinsightvalues = []
    this.incomebackgroundcolors = []
    this.incomehovercolors = []

    var monthlyspend = 0
    var monthlyincome = 0

    // Filter the aggregated transaction history based on the year and month
    this.filtereddata = this.firebasedata["transactionhistory"].filter(each => each["made_on"].includes((this.defaultyear[0] + "-" + this.defaultmonth[0][1])));

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
        console.log(this.exchangerates[transaction.currency_code])

        // Add up the value to the category and multiply it by the exchange rate
        categories[transaction.category] += Math.abs(transaction.amount) / this.exchangerates[transaction.currency_code]
        monthlyspend += Math.abs(transaction.amount) / this.exchangerates[transaction.currency_code]
      }
      if (Math.sign(transaction.amount) == 1) {
        // If the category has not yet been added to the categories Object, start it from 0 and add up the value
        if (categories2[transaction.category] == undefined) {
          categories2[transaction.category] = 0 // Start from 0

          // Randomly generate the pie color for the category
          var colors = this.saltedgeService.dynamicColors()
          this.incomebackgroundcolors.push(colors[0])
          this.incomehovercolors.push(colors[1])
        }
        // console.log(this.exchangerates[transaction.currency_code])

        // Add up the value to the category and multiply it by the exchange rate
        categories2[transaction.category] += Math.abs(transaction.amount) / this.exchangerates[transaction.currency_code]
        monthlyincome += Math.abs(transaction.amount) / this.exchangerates[transaction.currency_code]
      }
    }

    this.savings = (monthlyincome - monthlyspend).toLocaleString('en-SG', { style: 'currency', currency: "SGD" })
    this.monthlyspend = monthlyspend.toLocaleString('en-SG', { style: 'currency', currency: "SGD" }) // Include currency symbol 
    this.monthlyincome = monthlyincome.toLocaleString('en-SG', { style: 'currency', currency: "SGD" }) // Include currency symbol 

    this.filtereddata2 = this.filtereddata.slice().filter(each => Math.sign(each.amount) == -1); // Copy the filtereddata array to the filtereddata2 array
    this.filtereddata3 = this.filtereddata.slice().filter(each => Math.sign(each.amount) == 1); // Copy the filtereddata array to the filtereddata2 array
    // this.spendinginsightlabels = Object.keys(categories) // Category names
    // this.spendinginsightvalues = Object.values(categories) // Values consisting of the amount spent for each category

    var categoriesarray = Object.entries(categories)
    var categoriesarray2 = Object.entries(categories2)

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
      this.spendinginsightlabels.push(each[0])
      this.spendinginsightvalues.push(each[1])
    }

    for (let each of categoriesarray2) {
      this.incomeinsightlabels.push(each[0])
      this.incomeinsightvalues.push(each[1])
    }

    console.log(categoriesarray)

    // Set the piechart data
    this.doughnutChart.config.data.labels = this.spendinginsightlabels
    this.doughnutChart.config.data.datasets[0].data = this.spendinginsightvalues
    this.doughnutChart.config.data.datasets[0].backgroundColor = this.backgroundcolors
    this.doughnutChart.config.data.datasets[0].hoverBackgroundColor = this.hovercolors
    this.doughnutChart.update({ duration: 1000 }) // Refresh the piechart in HTML
    // Duration (in milliseconds) is the how long the animation will take to finish.
    // Remove the duration to remove the animation. 

    // Set the piechart data
    this.doughnutChart2.config.data.labels = this.incomeinsightlabels
    this.doughnutChart2.config.data.datasets[0].data = this.incomeinsightvalues
    this.doughnutChart2.config.data.datasets[0].backgroundColor = this.incomebackgroundcolors
    this.doughnutChart2.config.data.datasets[0].hoverBackgroundColor = this.incomehovercolors
    this.doughnutChart2.update({ duration: 1000 }) // Refresh the piechart in HTML
    // Duration (in milliseconds) is the how long the animation will take to finish.
    // Remove the duration to remove the animation. 

    this.loadingController.dismiss()
  }

  getData(uid) {
    let sub: Subscription = this.firestore.collection<any>('users').doc(uid).valueChanges().subscribe((data) => {
      this.firebasedata = data
      console.log(data)
      if (this.firebasedata["transactionhistory"]) {
        if (this.firebasedata["transactionhistory"].length != 0) {
          this.made_on_latest = this.firebasedata["transactionhistory"][0]["made_on"] // Get the date of latest transaction
          this.made_on_first = this.firebasedata["transactionhistory"][this.firebasedata["transactionhistory"].length - 1]["made_on"] // Get the date of first transaction
        } else {
          this.firebasedata["transactionhistory"] = []
        }
      } else {
        this.firebasedata["transactionhistory"] = []
      }

      this.saltedgeService.saltedgecustomerid = data["saltedgecustomerid"] // Get user's salt edge customer id to load their relevant accounts

      sub.unsubscribe();

      this.getexchangerates()
      // this.transactionhistory()
    });
  }

  async ngOnInit() {
    const loading = await this.loadingController.create({
      message: 'Loading...',
    });
    loading.present();

    firebase.auth().onAuthStateChanged((user) => {
      if (user != null) {
        let sub: Subscription = this.userService.login(user.uid).subscribe((data) => {
          this.userService.loggedin = true;
          this.userService.name = data["name"];
          this.userService.email = user.email;
          this.userService.uid = user.uid;
          // userService.provider = "Email and Password"
          if (user.providerData[0]["providerId"] == "password") {
            this.userService.provider = "Email and Password";
          }
          if (user.providerData[0]["providerId"] == "google.com") {
            this.userService.socialLogin = true;
            this.userService.provider = "Google";
            this.userService.profilePicture = user.providerData[0]["photoURL"];
          }
          if (user.providerData[0]["providerId"] == "facebook.com") {
            this.userService.socialLogin = true;
            this.userService.provider = "Facebook";
            this.userService.profilePicture = user.providerData[0]["photoURL"];
          }
          console.log(user);
          if (this.activatedRoute.snapshot.queryParamMap.get("connection_id")) {
            this.connection_id()
          } else {
            this.getsaltedgedata()
          }
          sub.unsubscribe();
        });
      } else {
        // No user is signed in.
        this.loadingController.dismiss()
        this.router.navigate(['/login']);
        // if (this.activatedRoute.snapshot.queryParamMap.get("connection_id")) {
        //   this.connection_id()
        // } else {
        //   this.getsaltedgedata()
        // }
      }
    });
  }

  constructor(public navCtrl: NavController, public router: Router, private activatedRoute: ActivatedRoute, private userService: UserService, private firestore: AngularFirestore, public expensesService: ExpensesService, public saltedgeService: SaltedgeService, public loadingController: LoadingController, private modalCtrl: ModalController) {
    // setTimeout(() => {
    //   this.lockApp();
    // }, 2000);
  }

  // async lockApp(){
  //   const modal = await this.modalCtrl.create({
  //     component: FingerprintPage,
  //     backdropDismiss: false,
  //     cssClass: 'login-modal',
  //     componentProps: {
  //       isModal: true
  //     }
  //   });
  //   modal.present()
  // }

  connection_id() {
    console.log(this.activatedRoute.snapshot.queryParamMap.get("connection_id"))

    var https = require('follow-redirects').https;

    var options = {
      'method': 'GET',
      'hostname': 'quiet-shelf-43690.herokuapp.com',
      // connection_id determines which accounts to get
      'path': '/https://www.saltedge.com/api/v5/accounts?connection_id=' + this.activatedRoute.snapshot.queryParamMap.get("connection_id"),
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

        var connectiondata = JSON.parse(body.toString())["data"]

        var balances = [] // currency Object to be pushed to this balances array (so that firebase can accept it)
        var currency = {} // Aggregated currencies from all accounts in the salt edge connection
        var balancescurrencycode = [] // currencycode Object to be pushed to this balancescurrencycode array (so that firebase can accept it)
        var currencycode = {} // Aggregated currencies from all accounts in the salt edge connection (with currency symbol)

        // Loop through all accounts in the salt edge connection
        for (let account of connectiondata) {
          // If the currency is not yet added to the currency Object
          if (currency[account.currency_code] == undefined) {
            currency[account.currency_code] = 0 // Start from 0
          }
          // Add it to the relevant currency key
          currency[account.currency_code] += account.balance
        }
        // Loop through the currency codes in the currency object and add the currency symbol to another array
        for (let eachcurrency of Object.keys(currency)) {
          currencycode[eachcurrency] = currency[eachcurrency].toLocaleString('en-SG', { style: 'currency', currency: eachcurrency })
        }
        balances.push(currency)
        balancescurrencycode.push(currencycode)
        console.log(currency)

        if (this.userService.loggedin == false) {
          this.aggregateaccountsinconnection("test1234@example.com", balances, balancescurrencycode, this.activatedRoute.snapshot.queryParamMap.get("connection_id"))
        } else {
          this.aggregateaccountsinconnection(this.userService.uid, balances, balancescurrencycode, this.activatedRoute.snapshot.queryParamMap.get("connection_id"))
        }

        for (let connection of connectiondata) {
          var https = require('follow-redirects').https;

          var options = {
            'method': 'GET',
            'hostname': 'quiet-shelf-43690.herokuapp.com',
            // The connection_id and account_id determines where to retrieve the transaction history
            'path': '/https://www.saltedge.com/api/v5/transactions?connection_id=' + this.activatedRoute.snapshot.queryParamMap.get("connection_id") + '&account_id=' + connection.id + '&per_page=1000',
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

              var transactionhistory = JSON.parse(body.toString())["data"]

              for (let transaction of transactionhistory) {
                transaction["category"] = this.expensesService.humanize(transaction["category"]) // Remove underscores and capitalise every word
                transaction["amountcurrencycode"] = transaction["amount"].toLocaleString('en-SG', { style: 'currency', currency: connection.currency_code }) // Include currency symbol 
                transaction["accountname"] = connection["extra"]["account_name"]
              }

              this.expensesService.sortbylatesttransaction(transactionhistory, "made_on")

              if (this.userService.loggedin == false) {
                this.aggregatetransactionhistory("test1234@example.com", connection.connection_id, connection.id, transactionhistory)
              } else {
                this.aggregatetransactionhistory(this.userService.uid, connection.connection_id, connection.id, transactionhistory)
              }

            });

            res.on("error", function (error) {
              console.error(error);
            });
          });

          req.end();
        }

      });

      res.on("error", function (error) {
        console.error(error);
      });
    });

    req.end();
  }

  aggregateconnections(uid) {
    var balances = [] // currencies Object to be pushed to this balances array (so that firebase can accept it)
    var currencies = {} // Aggregated currencies from all salt edge connections
    var aggregatedtransactionhistory = []

    // Get the salt edge connections from firebase
    let sub: Subscription = this.firestore.collection<any>('users').doc(uid).collection("saltedgeconnections").valueChanges().subscribe((data) => {
      console.log(data)
      // Loop through each salt edge connection
      for (let saltedgeconnection of data) {
        console.log(saltedgeconnection)
        console.log(saltedgeconnection.balances[0])
        console.log(Object.keys(saltedgeconnection.balances[0]))
        // console.log(Object.keys(saltedgeconnection.spendinginsights))

        // Loop through the currency keys
        // e.g. saltedgeconnection.balances[0] = {GBP: 4301, EUR: 2410}
        // e.g. Object.keys(saltedgeconnection.balances[0]) = ["GBP", "EUR"]
        for (let currency of Object.keys(saltedgeconnection.balances[0])) {
          console.log(currency)
          console.log(saltedgeconnection.balances[0][currency])

          // If the currency is not yet added to the currencies Object
          if (currencies[currency] == undefined) {
            currencies[currency] = 0 // Start from 0
          }
          // Add it to the relevant currency key
          currencies[currency] += saltedgeconnection.balances[0][currency]
        }

        // Add up the transaction histories of every salt edge connection
        aggregatedtransactionhistory = aggregatedtransactionhistory.concat(saltedgeconnection.transactionhistory)
      }
      // Sort the transaction history by descending order (latest transaction first)
      aggregatedtransactionhistory.sort((a, b) => {
        if (a["made_on"] > b["made_on"]) {
          return -1;
        }
        if (a["made_on"] < b["made_on"]) {
          return 1;
        }
        return 0;
      });
      balances.push(currencies)
      console.log(currencies)
      console.log(aggregatedtransactionhistory)

      // Set the aggregated balances, spending insights and transaction history to the users collection
      this.firestore.collection('users').doc(uid).set({
        balances: balances,
        transactionhistory: aggregatedtransactionhistory
      }, { merge: true }).then(() => {
        this.getsaltedgedata()
      })

      sub.unsubscribe();
    });
  }

  aggregatetransactionhistory(uid, connection_id, account_id, transactionhistory) {
    // Put the account transaction history into firebase at users/{{uid}}/saltedgeconnections/{{saltedgeconnectionid}}/accounts/{{saltedgeaccountid}}
    this.firestore.collection('users').doc(uid).collection("saltedgeconnections").doc(connection_id).collection("accounts").doc(account_id).set({
      transactionhistory: transactionhistory
    }, { merge: true }).then(() => {
      var aggregatedtransactions = []
      // Get the transaction history of all accounts from firebase and put it in users/{{uid}}/saltedgeconnections/{{saltedgeconnectionid}}
      let sub: Subscription = this.firestore.collection('users').doc(uid).collection("saltedgeconnections").doc(connection_id).collection("accounts").valueChanges().subscribe((data) => {
        console.log(data)
        // Loop through the accounts in the salt edge connection
        for (let account of data) {
          console.log(account["transactionhistory"])
          aggregatedtransactions = aggregatedtransactions.concat(account["transactionhistory"]) // Concatenate the arrays into one array
        }

        this.expensesService.sortbylatesttransaction(aggregatedtransactions, "made_on")
        console.log(aggregatedtransactions)

        // Put it in users/{{uid}}/saltedgeconnections/{{saltedgeconnectionid}}
        this.firestore.collection('users').doc(uid).collection("saltedgeconnections").doc(connection_id).set({
          transactionhistory: aggregatedtransactions
        }, { merge: true }).then(() => {
          this.aggregateconnections(uid)
        })

        sub.unsubscribe();
      })
    })
  }

  aggregateaccountsinconnection(uid, balances, balancescurrencycode, connection_id) {
    this.firestore.collection('users').doc(uid).collection("saltedgeconnections").doc(connection_id).set({
      balances: balances,
      balancescurrencycode: balancescurrencycode
    }, { merge: true })
  }

  getsaltedgedata() {
    if (this.userService.loggedin == false) {
      this.getData("test1234@example.com")
    } else {
      this.getData(this.userService.uid)
    }
  }

  ionViewDidEnter() {
    // Load bar chart
    this.barChart = new Chart(this.barCanvas.nativeElement, {
      type: "bar",
      data: {
        labels: this.labelsspliced,
        datasets: [
          {
            label: "Money In",
            data: this.incomevaluesspliced,
            backgroundColor: "rgba(0,204,0,0.5)",
            borderColor: "rgb(0,204,0)",
            borderWidth: 1
          },
          {
            label: "Money Out",
            data: this.expensevaluesspliced,
            backgroundColor: "rgba(204,0,0,0.5)",
            borderColor: "rgb(204,0,0)",
            borderWidth: 1
          }
        ]
      },
      options: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        },
        maintainAspectRatio: false
      }
    });

    // Load doughnut chart
    this.doughnutChart = new Chart(this.doughnutCanvas.nativeElement, {
      type: "doughnut",
      data: {
        labels: this.spendinginsightlabels,
        datasets: [
          {
            label: "Spending Insights",
            data: this.spendinginsightvalues,
            backgroundColor: this.backgroundcolors,
            hoverBackgroundColor: this.hovercolors
          }
        ]
      },
      options: {
        legend: {
          'position': 'right'
        },
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
              this.filtereddata2 = this.filtereddata.filter(each => each["category"].includes(this.spendinginsightlabels[index]) && Math.sign(each.amount) == -1); // Filtered expenses by category
            } else {
              // remove hover styles
              for (datasetIndex = 0; datasetIndex < this.doughnutChart.data.datasets.length; ++datasetIndex) {
                dataset = this.doughnutChart.data.datasets[datasetIndex];
                dataset.backgroundColor = this.backgroundcolors.slice();
                dataset.hoverBackgroundColor = this.hovercolors.slice();
              }
              this.filtereddata2 = this.filtereddata.slice().filter(each => Math.sign(each.amount) == -1); // Put back the originally filtered expenses
            }
            this.doughnutChart.update();
          }
        }
      }
    })

    // Load doughnut chart
    this.doughnutChart2 = new Chart(this.doughnutCanvas2.nativeElement, {
      type: "doughnut",
      data: {
        labels: this.incomeinsightlabels,
        datasets: [
          {
            label: "Income Insights",
            data: this.incomeinsightvalues,
            backgroundColor: this.incomebackgroundcolors,
            hoverBackgroundColor: this.incomehovercolors
          }
        ]
      },
      options: {
        legend: {
          'position': 'right'
        },
        maintainAspectRatio: false,
        onClick: (evt, elements) => {
          var datasetIndex;
          var dataset;

          const { left, right, top, bottom } = this.doughnutChart2.chartArea; // We have this to exclude the chart legend because it also has its own onclick otherwise we would override it
          if (evt.offsetX > left && evt.offsetX < right && evt.offsetY > top && evt.offsetY < bottom) {
            if (elements.length) {
              var index = elements[0]._index;
              datasetIndex = elements[0]._datasetIndex;

              // Reset old state
              dataset = this.doughnutChart2.data.datasets[datasetIndex];
              dataset.backgroundColor = this.incomebackgroundcolors.slice();
              dataset.hoverBackgroundColor = this.incomehovercolors.slice();

              dataset.backgroundColor[index] = this.incomehovercolors[index]; // click color
              dataset.hoverBackgroundColor[index] = this.incomehovercolors[index];
              this.filtereddata3 = this.filtereddata.filter(each => each["category"].includes(this.incomeinsightlabels[index]) && Math.sign(each.amount) == 1); // Filtered expenses by category
            } else {
              // remove hover styles
              for (datasetIndex = 0; datasetIndex < this.doughnutChart2.data.datasets.length; ++datasetIndex) {
                dataset = this.doughnutChart2.data.datasets[datasetIndex];
                dataset.backgroundColor = this.incomebackgroundcolors.slice();
                dataset.hoverBackgroundColor = this.incomehovercolors.slice();
              }
              this.filtereddata3 = this.filtereddata.slice().filter(each => Math.sign(each.amount) == 1); // Put back the originally filtered expenses
            }
            this.doughnutChart2.update();
          }
        }
      }
    })

    console.log(this.barChart)
    console.log(this.doughnutChart)

    // this.lineChart = new Chart(this.lineCanvas.nativeElement, {
    //   type: "line",
    //   data: {
    //     labels: ["January", "February", "March", "April", "May", "June", "July"],
    //     datasets: [
    //       {
    //         label: "My First dataset",
    //         fill: false,
    //         lineTension: 0.1,
    //         backgroundColor: "rgba(75,192,192,0.4)",
    //         borderColor: "rgba(75,192,192,1)",
    //         borderCapStyle: "butt",
    //         borderDash: [],
    //         borderDashOffset: 0.0,
    //         borderJoinStyle: "miter",
    //         pointBorderColor: "rgba(75,192,192,1)",
    //         pointBackgroundColor: "#fff",
    //         pointBorderWidth: 1,
    //         pointHoverRadius: 5,
    //         pointHoverBackgroundColor: "rgba(75,192,192,1)",
    //         pointHoverBorderColor: "rgba(220,220,220,1)",
    //         pointHoverBorderWidth: 2,
    //         pointRadius: 1,
    //         pointHitRadius: 10,
    //         data: [65, 59, 80, 81, 56, 55, 40],
    //         spanGaps: false
    //       }
    //     ]
    //   }
    // });
  }

  view() {
    let navigationExtras: NavigationExtras = {
      state: {
        // title: title,
        // data: data,
        // labels: labels,
        // values: values,
        // backgroundcolors: backgroundcolors,
        // hovercolors: hovercolors,
        // amount: amount,
        month: this.month,
        year: this.year,
        spendinginsightlabels: this.spendinginsightlabels
      }
    };
    this.navCtrl.navigateForward(['/accounts/savingssuggestion'], navigationExtras);
  }

  view2(title, data, labels, values, backgroundcolors, hovercolors, amount, month, year) {
    let navigationExtras: NavigationExtras = {
      state: {
        title: title,
        data: data,
        labels: labels,
        values: values,
        backgroundcolors: backgroundcolors,
        hovercolors: hovercolors,
        amount: amount,
        month: month,
        year: year
      }
    };
    this.navCtrl.navigateForward(['/home/aggregatedinsights'], navigationExtras)
  }

  
}

