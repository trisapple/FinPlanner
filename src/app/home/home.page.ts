import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../user.service';
import { Subscription } from 'rxjs';

import { AngularFirestore } from '@angular/fire/firestore';
import { ExpensesService } from '../expenses.service';
import { SaltedgeService } from '../saltedge.service';

import { Chart } from 'chart.js';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  @ViewChild("barCanvas") barCanvas: ElementRef;
  @ViewChild("doughnutCanvas") doughnutCanvas: ElementRef;
  @ViewChild("lineCanvas") lineCanvas: ElementRef;

  private barChart: Chart;
  private doughnutChart: Chart;
  private lineChart: Chart;

  // Chart.js arrays for bar chart
  labels = []
  incomevalues = []
  expensevalues = []

  labelsspliced = []
  incomevaluesspliced = []
  expensevaluesspliced = []

  startindex = 3
  endindex = 0
  segmentvalue = "3months"

  // Chart.js arrays for doughnut chart
  spendinginsightlabels = []
  spendinginsightvalues = []
  backgroundcolors = []
  hovercolors = []

  firebasedata = {}
  exchangerates = {}
  filtereddata = []
  filtereddata2 = []

  // Ion-segment
  yeararray = []
  defaultyear = []
  montharray = []
  defaultmonth = []

  made_on_latest = ""
  made_on_first = ""

  total = ""
  originaltotal = []
  expenses = []
  income = []
  currencycode = "SGD"
  sgdonly = true

  months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

  previousmonth() {
    if (this.startindex < this.labels.length) {
      this.updateBarChart(1, 1)
    }
  }

  nextmonth() {
    if (this.endindex > 0) {
      this.updateBarChart(-1, -1)
    }
  }

  updateBarChart(startindex, endindex) {
    this.startindex = this.startindex + startindex
    this.endindex = this.endindex + endindex
    this.labelsspliced = []
    this.expensevaluesspliced = []
    this.incomevaluesspliced = []
    for (let i = this.startindex; i > this.endindex; i--) {
      if (this.labels[this.labels.length - i] == undefined) {
        this.labelsspliced.push("")
      } else {
        this.labelsspliced.push(this.labels[this.labels.length - i])
      }
      if (this.expensevalues[this.expensevalues.length - i] == undefined) {
        this.expensevaluesspliced.push(0)
      } else {
        this.expensevaluesspliced.push(this.expensevalues[this.expensevalues.length - i])
      }
      if (this.incomevalues[this.incomevalues.length - i] == undefined) {
        this.incomevaluesspliced.push(0)
      } else {
        this.incomevaluesspliced.push(this.incomevalues[this.incomevalues.length - i])
      }
    }
    console.log(this.labelsspliced)
    console.log(this.expensevaluesspliced)
    console.log(this.incomevaluesspliced)
    console.log(this.startindex)
    console.log(this.endindex)

    this.barChart.data.datasets[0].data = this.incomevaluesspliced
    this.barChart.data.datasets[1].data = this.expensevaluesspliced
    this.barChart.data.labels = this.labelsspliced
    this.barChart.update({ duration: 1000 })
  }

  segmentChanged(ev: any) {
    console.log('Segment changed', ev);
    console.log(ev.detail.value);
    if (ev.detail.value == "1month") {
      this.segmentvalue = "1month"
    }
    if (ev.detail.value == "3months") {
      if (this.segmentvalue == "6months") {
        this.updateBarChart(-3, 0)
      }
      if (this.segmentvalue == "1year") {
        this.updateBarChart(-9, 0)
      }
      this.segmentvalue = "3months"
    }
    if (ev.detail.value == "6months") {
      if (this.segmentvalue == "3months") {
        this.updateBarChart(3, 0)
      }
      if (this.segmentvalue == "1year") {
        this.updateBarChart(-6, 0)
      }
      this.segmentvalue = "6months"
    }
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

  changemonth(ev: any) {
    console.log('Segment changed', ev);
    console.log(ev.detail.value);

    for (let i = 0; i <= this.months.length - 1; i++) {
      if (ev.detail.value == this.months[i]) {
        this.defaultmonth = [[this.months[i], ('0' + (i + 1)).slice(-2)]]
      }
    }
    this.filtereddata = this.firebasedata["transactionhistory"].filter(each => each["made_on"].includes((this.defaultyear[0] + "-" + this.defaultmonth[0][1])));

    console.log(this.filtereddata)
    console.log(this.defaultmonth)

    var obj = {}
    this.backgroundcolors = []
    this.hovercolors = []
    // Loop through the list of transactions. Based on the transaction description, add the transaction amount to the categories accordingly. 
    for (let transaction of this.filtereddata) {
      // If the transaction is a negative value
      if (Math.sign(transaction.amount) == -1) {
        // If the category has not yet been added to the Object, start it from 0 and add up the value
        if (obj[transaction.category] == undefined) {
          obj[transaction.category] = 0 // Start from 0
          var colors = this.saltedgeService.dynamicColors()
          this.backgroundcolors.push(colors[0])
          this.hovercolors.push(colors[1])
        }

        if (this.exchangerates[transaction.currency_code] != undefined) {
          console.log(this.exchangerates[transaction.currency_code])
          obj[transaction.category] += Math.abs(transaction.amount) * this.exchangerates[transaction.currency_code]
        } else {
          obj[transaction.category] += Math.abs(transaction.amount)
        }
      }
    }

    this.spendinginsightlabels = Object.keys(obj)
    this.spendinginsightvalues = Object.values(obj)
    console.log(this.spendinginsightlabels)
    console.log(Object.values(obj))
    console.log(obj)

    console.log(this.doughnutChart)
    this.filtereddata2 = this.filtereddata.slice()

    this.doughnutChart.config.data.labels = this.spendinginsightlabels
    this.doughnutChart.config.data.datasets[0].data = this.spendinginsightvalues
    this.doughnutChart.config.data.datasets[0].backgroundColor = this.backgroundcolors
    this.doughnutChart.config.data.datasets[0].hoverBackgroundColor = this.hovercolors
    this.doughnutChart.update({ duration: 1000 })
  }

  changeyear(ev: any) {
    console.log('Segment changed', ev);
    console.log(ev.detail.value);

    this.defaultyear = [ev.detail.value]

    // If on first year of data
    if (ev.detail.value == new Date(this.made_on_first).getFullYear()) {

      this.montharray = [["Jan", false], ["Feb", false], ["Mar", false], ["Apr", false], ["May", false], ["Jun", false], ["Jul", false], ["Aug", false], ["Sep", false], ["Oct", false], ["Nov", false], ["Dec", false]]

      for (let i = 0; i <= this.months.length - 1; i++) {
        if ((new Date(this.made_on_first).getMonth()) == i) {
          for (let i = 0; i <= (new Date(this.made_on_first).getMonth()); i++) {
            if (i > 0) {
              this.montharray[i - 1][1] = true
            }
          }
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

      this.montharray = [["Jan", true], ["Feb", true], ["Mar", true], ["Apr", true], ["May", true], ["Jun", true], ["Jul", true], ["Aug", true], ["Sep", true], ["Oct", true], ["Nov", true], ["Dec", true]]

      for (let i = 0; i <= this.months.length - 1; i++) {
        if ((new Date(this.made_on_latest).getMonth()) == i) {
          for (let i = 0; i <= (new Date(this.made_on_latest).getMonth()); i++) {
            this.montharray[i][1] = false
          }
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
      this.montharray = [["Jan", false], ["Feb", false], ["Mar", false], ["Apr", false], ["May", false], ["Jun", false], ["Jul", false], ["Aug", false], ["Sep", false], ["Oct", false], ["Nov", false], ["Dec", false]]
    }

    this.filtereddata = this.firebasedata["transactionhistory"].filter(each => each["made_on"].includes((this.defaultyear[0] + "-" + this.defaultmonth[0][1])));
    console.log(this.filtereddata)
    console.log(this.defaultyear)

    var obj = {}
    this.backgroundcolors = []
    this.hovercolors = []
    // Loop through the list of transactions. Based on the transaction description, add the transaction amount to the categories accordingly. 
    for (let transaction of this.filtereddata) {
      // If the transaction is a negative value
      if (Math.sign(transaction.amount) == -1) {
        // If the category has not yet been added to the Object, start it from 0 and add up the value
        if (obj[transaction.category] == undefined) {
          obj[transaction.category] = 0 // Start from 0
          var colors = this.saltedgeService.dynamicColors()
          this.backgroundcolors.push(colors[0])
          this.hovercolors.push(colors[1])
        }

        if (this.exchangerates[transaction.currency_code] != undefined) {
          console.log(this.exchangerates[transaction.currency_code])
          obj[transaction.category] += Math.abs(transaction.amount) * this.exchangerates[transaction.currency_code]
        } else {
          obj[transaction.category] += Math.abs(transaction.amount)
        }
      }
    }

    this.spendinginsightlabels = Object.keys(obj)
    this.spendinginsightvalues = Object.values(obj)
    console.log(this.spendinginsightlabels)
    console.log(Object.values(obj))
    console.log(obj)

    console.log(this.doughnutChart)
    this.filtereddata2 = this.filtereddata.slice()

    this.doughnutChart.config.data.labels = this.spendinginsightlabels
    this.doughnutChart.config.data.datasets[0].data = this.spendinginsightvalues
    this.doughnutChart.config.data.datasets[0].backgroundColor = this.backgroundcolors
    this.doughnutChart.config.data.datasets[0].hoverBackgroundColor = this.hovercolors
    this.doughnutChart.update({ duration: 1000 })
  }

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

        this.transactionhistory()
      });

      res.on("error", function (error) {
        console.error(error);
      });
    });

    req.end();
  }

  transactionhistory() {
    console.log(this.firebasedata["transactionhistory"])

    console.log(this.made_on_latest)
    console.log(this.made_on_first)

    console.log(new Date(this.made_on_latest))
    console.log(new Date(this.made_on_latest).getFullYear())
    console.log(new Date(this.made_on_latest).getMonth())
    console.log(new Date(this.made_on_first))
    console.log(new Date(this.made_on_first).getFullYear())
    console.log(new Date(this.made_on_first).getMonth())

    for (let year = new Date(this.made_on_first).getFullYear(); year <= new Date(this.made_on_latest).getFullYear(); year++) {
      console.log(year)

      // If there's data for other years (e.g. data for 2017, 2018, 2019)
      if ((new Date(this.made_on_latest).getFullYear()) != (new Date(this.made_on_first).getFullYear())) {
        if (year == new Date(this.made_on_first).getFullYear()) {
          for (let i = new Date(this.made_on_first).getMonth(); i <= 11; i++) {
            console.log(i)
            this.labels.push(this.months[i] + " " + year)
            var filteredexpenses = this.firebasedata["transactionhistory"].filter(each => each["made_on"].includes(year + "-" + ('0' + (i + 1)).slice(-2)) && Math.sign(each.amount) == -1);
            var filteredincome = this.firebasedata["transactionhistory"].filter(each => each["made_on"].includes(year + "-" + ('0' + (i + 1)).slice(-2)) && Math.sign(each.amount) == 1);
            var expenses = 0
            var income = 0
            for (let each of filteredexpenses) {
              expenses += Math.abs(each["amount"])
            }
            for (let each of filteredincome) {
              income += each.amount
            }
            this.expensevalues.push(expenses)
            this.incomevalues.push(income)
          }
        }
        else if (year == new Date(this.made_on_latest).getFullYear()) {
          for (let i = 0; i <= new Date(this.made_on_latest).getMonth(); i++) {
            console.log(i)
            this.labels.push(this.months[i] + " " + year)
            var filteredexpenses = this.firebasedata["transactionhistory"].filter(each => each["made_on"].includes(year + "-" + ('0' + (i + 1)).slice(-2)) && Math.sign(each.amount) == -1);
            var filteredincome = this.firebasedata["transactionhistory"].filter(each => each["made_on"].includes(year + "-" + ('0' + (i + 1)).slice(-2)) && Math.sign(each.amount) == 1);
            var expenses = 0
            var income = 0
            for (let each of filteredexpenses) {
              expenses += Math.abs(each["amount"])
            }
            for (let each of filteredincome) {
              income += each.amount
            }
            this.expensevalues.push(expenses)
            this.incomevalues.push(income)
          }
        } else {
          for (let i = 0; i <= 11; i++) {
            console.log(i)
            this.labels.push(this.months[i] + " " + year)
            var filteredexpenses = this.firebasedata["transactionhistory"].filter(each => each["made_on"].includes(year + "-" + ('0' + (i + 1)).slice(-2)) && Math.sign(each.amount) == -1);
            var filteredincome = this.firebasedata["transactionhistory"].filter(each => each["made_on"].includes(year + "-" + ('0' + (i + 1)).slice(-2)) && Math.sign(each.amount) == 1);
            var expenses = 0
            var income = 0
            for (let each of filteredexpenses) {
              expenses += Math.abs(each["amount"])
            }
            for (let each of filteredincome) {
              income += each.amount
            }
            this.expensevalues.push(expenses)
            this.incomevalues.push(income)
          }
        }
      }
      // If there's only less than 1 year of data (e.g. only data for 2020 and no other year)
      else {
        for (let i = new Date(this.made_on_first).getMonth(); i <= new Date(this.made_on_latest).getMonth(); i++) {
          console.log(i)
          this.labels.push(this.months[i] + " " + year)
          var filteredexpenses = this.firebasedata["transactionhistory"].filter(each => each["made_on"].includes(year + "-" + ('0' + (i + 1)).slice(-2)) && Math.sign(each.amount) == -1);
          var filteredincome = this.firebasedata["transactionhistory"].filter(each => each["made_on"].includes(year + "-" + ('0' + (i + 1)).slice(-2)) && Math.sign(each.amount) == 1);
          var expenses = 0
          var income = 0
          for (let each of filteredexpenses) {
            expenses += Math.abs(each["amount"])
          }
          for (let each of filteredincome) {
            income += each.amount
          }
          this.expensevalues.push(expenses)
          this.incomevalues.push(income)
        }
      }
    }

    for (let i = this.startindex; i > this.endindex; i--) {
      this.labelsspliced.push(this.labels[this.labels.length - i])
      this.expensevaluesspliced.push(this.expensevalues[this.expensevalues.length - i])
      this.incomevaluesspliced.push(this.incomevalues[this.incomevalues.length - i])
    }

    this.originaltotal = Object.entries(this.firebasedata["balances"][0])
    var total = 0
    for (let each of this.originaltotal) {
      each[2] = each[1].toLocaleString('en-SG', { style: 'currency', currency: each[0] }) // Add currency symbol
      if (each[0] != "SGD") {
        this.sgdonly = false
      }
      total += each[1] * this.exchangerates[each[0]]
    }
    this.total = total.toLocaleString('en-SG', { style: 'currency', currency: "SGD" })
    console.log(this.originaltotal)

    // Load the latest year first
    for (let i = new Date(this.made_on_latest).getFullYear(); i >= new Date(this.made_on_first).getFullYear(); i--) {
      this.yeararray.push(i)
    }
    console.log(this.yeararray)
    this.defaultyear = [this.yeararray[0]]

    // If there is more than 1 year of data (e.g. 2019, 2018, ...)
    if ((new Date(this.made_on_latest).getFullYear()) != (new Date(this.made_on_first).getFullYear())) {

      this.montharray = [["Jan", true], ["Feb", true], ["Mar", true], ["Apr", true], ["May", true], ["Jun", true], ["Jul", true], ["Aug", true], ["Sep", true], ["Oct", true], ["Nov", true], ["Dec", true]]

      for (let i = 0; i <= this.months.length - 1; i++) {
        if ((new Date(this.made_on_latest).getMonth()) == i) {
          for (let i = 0; i <= (new Date(this.made_on_latest).getMonth()); i++) {
            this.montharray[i][1] = false
          }
          for (let each of this.montharray) {
            if (each[1] == false) {
              this.defaultmonth = [[this.months[i], ('0' + (i + 1)).slice(-2)]]
            }
          }
        }
      }
    } 
    // If there is just 1 year of data
    else {
      this.montharray = [["Jan", true], ["Feb", true], ["Mar", true], ["Apr", true], ["May", true], ["Jun", true], ["Jul", true], ["Aug", true], ["Sep", true], ["Oct", true], ["Nov", true], ["Dec", true]]
      for (let i = new Date(this.made_on_first).getMonth(); i <= new Date(this.made_on_latest).getMonth(); i++) {
        console.log(i)
        this.montharray[i][1] = false
      }
      this.defaultmonth = [[this.montharray[new Date(this.made_on_latest).getMonth()][0], ('0' + (new Date(this.made_on_latest).getMonth() + 1)).slice(-2)]]
      console.log(this.defaultmonth)
    }

    this.filtereddata = this.firebasedata["transactionhistory"].filter(each => each["made_on"].includes((this.defaultyear[0] + "-" + this.defaultmonth[0][1])));
    console.log(this.defaultyear)
    console.log(this.defaultmonth)
    console.log(this.filtereddata)

    var obj = {}
    this.backgroundcolors = []
    this.hovercolors = []
    // Loop through the list of transactions. Based on the transaction description, add the transaction amount to the categories accordingly. 
    for (let transaction of this.filtereddata) {
      // If the transaction is a negative value
      if (Math.sign(transaction.amount) == -1) {
        // If the category has not yet been added to the Object, start it from 0 and add up the value
        if (obj[transaction.category] == undefined) {
          obj[transaction.category] = 0 // Start from 0
          var colors = this.saltedgeService.dynamicColors()
          this.backgroundcolors.push(colors[0])
          this.hovercolors.push(colors[1])
        }

        if (this.exchangerates[transaction.currency_code] != undefined) {
          console.log(this.exchangerates[transaction.currency_code])
          obj[transaction.category] += Math.abs(transaction.amount) * this.exchangerates[transaction.currency_code]
        } else {
          obj[transaction.category] += Math.abs(transaction.amount)
        }
      }
    }

    this.filtereddata2 = this.filtereddata.slice()

    this.spendinginsightlabels = Object.keys(obj)
    this.spendinginsightvalues = Object.values(obj)
    console.log(this.spendinginsightlabels)
    console.log(Object.values(obj))
    console.log(obj)
  }

  constructor(public navCtrl: NavController, private activatedRoute: ActivatedRoute, private userService: UserService, private firestore: AngularFirestore, public expensesService: ExpensesService, public saltedgeService: SaltedgeService) {

    console.log(new Date().toDateString())
    console.log(this.saltedgeService.formatDate(new Date()))

    if (this.userService.loggedin == false) {
      let sub: Subscription = this.firestore.collection<any>('users').doc("test1234@example.com").valueChanges().subscribe((data) => {
        this.firebasedata = data
        this.made_on_latest = this.firebasedata["transactionhistory"][0]["made_on"]
        this.made_on_first = this.firebasedata["transactionhistory"][this.firebasedata["transactionhistory"].length - 1]["made_on"]
        console.log(data)
        console.log(data["saltedgereportid"])
        this.saltedgeService.saltedgereportid = data["saltedgereportid"]
        this.saltedgeService.saltedgecustomerid = data["saltedgecustomerid"]

        sub.unsubscribe();

        this.getexchangerates()
        // this.transactionhistory()
      });
    } else {
      let sub: Subscription = this.firestore.collection<any>('users').doc(this.userService.uid).valueChanges().subscribe((data) => {
        this.firebasedata = data
        this.made_on_latest = this.firebasedata["transactionhistory"][0]["made_on"]
        this.made_on_first = this.firebasedata["transactionhistory"][this.firebasedata["transactionhistory"].length - 1]["made_on"]
        console.log(data)
        console.log(data["saltedgereportid"])
        this.saltedgeService.saltedgereportid = data["saltedgereportid"]

        sub.unsubscribe();

        this.getexchangerates()
        // this.transactionhistory()
      });
    }
  }

  ionViewDidEnter() {
    setTimeout(() => this.barChart = new Chart(this.barCanvas.nativeElement, {
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
    }), 2000);

    setTimeout(() => this.doughnutChart = new Chart(this.doughnutCanvas.nativeElement, {
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
        maintainAspectRatio: false,
        onClick: (evt, elements) => {
          console.log(evt)
          var datasetIndex;
          var dataset;

          const { left, right, top, bottom } = this.doughnutChart.chartArea;
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
              this.filtereddata2 = this.filtereddata.slice() // Put back the originally filtered expenses
            }
            this.doughnutChart.update();
          }
        }
      }
    }), 2000)

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
}

