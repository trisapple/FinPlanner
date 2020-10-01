import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../user.service';
import { Subscription } from 'rxjs';


import { GoogleChartInterface } from 'ng2-google-charts/esm2015/lib/google-charts-interfaces';
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

  // Ion-segment
  yeararray = []
  defaultyear = []
  montharray = []
  defaultmonth = []

  // public columnChart1: GoogleChartInterface;
  // public columnChart2: GoogleChartInterface;
  // public barChart: GoogleChartInterface;
  // public pieChart: GoogleChartInterface;


  // loadColumnChart() {
  //   this.columnChart1 = {
  //     chartType: 'ColumnChart',
  //     dataTable: [
  //       ['City', '2010 Population'],
  //       ['New York City, NY', 8175000],
  //       ['Los Angeles, CA', 3792000],
  //       ['Chicago, IL', 2695000],
  //       ['Houston, TX', 2099000],
  //       ['Philadelphia, PA', 1526000]
  //     ],
  //     //opt_firstRowIsData: true,
  //     options: {
  //       title: 'Population of Largest U.S. Cities',
  //       height: 600,
  //       chartArea: { height: '400' },
  //       hAxis: {
  //         title: 'Total Population',
  //         minValue: 0
  //       },
  //       vAxis: {
  //         title: 'City'
  //       }
  //     },
  //   };
  // }

  // loadSimplePieChart() {
  //   this.pieChart = {
  //     chartType: 'PieChart',
  //     dataTable: [
  //       ['Task', 'Hours per Day'],
  //       ['Work', 11],
  //       ['Eat', 2],
  //       ['Commute', 2],
  //       ['Watch TV', 2],
  //       ['Sleep', 7]
  //     ],
  //     //opt_firstRowIsData: true,
  //     options: {
  //       'title': 'Tasks',
  //       height: 600,
  //       width: '100%',
  //       is3D: true,
  //       backgroundColor: { fill: 'transparent' },
  //       legend: { textStyle: { color: 'gray' } }
  //     },
  //   };
  // }

  total = ""
  originaltotal = []
  expenses = []
  income = []
  currencycode = ""
  sgdonly = true

  recreateinsight() {
    var https = require('follow-redirects').https;

    var options = {
      'method': 'DELETE',
      'hostname': 'quiet-shelf-43690.herokuapp.com',
      'path': '/https://www.saltedge.com/api/v5/reports/' + this.saltedgeService.saltedgereportid,
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
        this.createinsight()
      });

      res.on("error", function (error) {
        console.error(error);
      });
    });

    req.end();
  }

  createinsight() {
    var https = require('follow-redirects').https;

    var options = {
      'method': 'POST',
      'hostname': 'quiet-shelf-43690.herokuapp.com',
      'path': '/https://www.saltedge.com/api/v5/reports',
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
        console.log(JSON.parse(body.toString())["data"]["id"]);
        if (this.userService.loggedin == false) {
          this.firestore.collection<any>('users').doc("test1234@example.com").update({
            saltedgereportid: JSON.parse(body.toString())["data"]["id"]
          })
        } else {
          this.firestore.collection<any>('users').doc(this.userService.uid).update({
            saltedgereportid: JSON.parse(body.toString())["data"]["id"]
          })
        }
        this.saltedgeService.saltedgereportid = JSON.parse(body.toString())["data"]["id"]
        this.getinsight()
      });

      res.on("error", function (error) {
        console.error(error);
      });
    });

    var postData = JSON.stringify({ "data": { "customer_id": this.saltedgeService.saltedgecustomerid, "report_types": ["balance", "expense", "income", "savings"], "currency_code": "SGD", "from_date": "2019-01-01", "to_date": this.saltedgeService.formatDate(new Date()) } });

    req.write(postData);

    req.end();

  }

  getinsight() {
    var https = require('follow-redirects').https;

    var options = {
      'method': 'GET',
      'hostname': 'quiet-shelf-43690.herokuapp.com',
      'path': '/https://www.saltedge.com/api/v5/reports/' + this.saltedgeService.saltedgereportid,
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

        this.expenses = JSON.parse(body.toString()).data.data.result.accounts_summary.expense.total_per_month
        this.currencycode = JSON.parse(body.toString()).data.currency_code
        this.income = JSON.parse(body.toString()).data.data.result.accounts_summary.income.total_per_month
        this.total = JSON.parse(body.toString()).data.data.result.accounts_summary.balance.end_date_amount.toLocaleString('en-SG', { style: 'currency', currency: this.currencycode })

        this.exchangerates = JSON.parse(body.toString()).data.data.exchange_rates
        console.log(this.exchangerates)

        this.spendinginsights()
        this.transactionhistory()

        var originaltotal = {}
        for (let connection of JSON.parse(body.toString()).data.data.connections) {
          // console.log(each.accounts)
          for (let account of connection.accounts) {
            console.log(account)
            console.log(account.original_balance)
            console.log(account.original_currency_code)

            // If the category has not yet been added to the Object, start it from 0 and add up the value
            if (originaltotal[account.original_currency_code] == undefined) {
              originaltotal[account.original_currency_code] = 0 // Start from 0
            }
            originaltotal[account.original_currency_code] += account.original_balance // Add up the value to the Object
          }
        }
        this.originaltotal = Object.entries(originaltotal)
        for (let each of this.originaltotal) {
          each[1] = each[1].toLocaleString('en-SG', { style: 'currency', currency: each[0] }) // Add currency symbol
          if (each[0] != "SGD") {
            this.sgdonly = false
          }
        }
        console.log(this.originaltotal)

        // Expenses
        for (let each of this.expenses) {
          if (each["month"] == 1) {
            each["monthyear"] = "Jan " + each["year"]
          }
          if (each["month"] == 2) {
            each["monthyear"] = "Feb " + each["year"]
          }
          if (each["month"] == 3) {
            each["monthyear"] = "Mar " + each["year"]
          }
          if (each["month"] == 4) {
            each["monthyear"] = "Apr " + each["year"]
          }
          if (each["month"] == 5) {
            each["monthyear"] = "May " + each["year"]
          }
          if (each["month"] == 6) {
            each["monthyear"] = "Jun " + each["year"]
          }
          if (each["month"] == 7) {
            each["monthyear"] = "Jul " + each["year"]
          }
          if (each["month"] == 8) {
            each["monthyear"] = "Aug " + each["year"]
          }
          if (each["month"] == 9) {
            each["monthyear"] = "Sep " + each["year"]
          }
          if (each["month"] == 10) {
            each["monthyear"] = "Oct " + each["year"]
          }
          if (each["month"] == 11) {
            each["monthyear"] = "Nov " + each["year"]
          }
          if (each["month"] == 12) {
            each["monthyear"] = "Dec " + each["year"]
          }
          this.labels.push(each["monthyear"])
          each["amount"] = Math.abs(each["amount"])
          this.expensevalues.push(each["amount"])
        }
        console.log(this.labels)

        // Income
        for (let each of this.income) {
          if (each["month"] == 1) {
            each["monthyear"] = "Jan " + each["year"]
          }
          if (each["month"] == 2) {
            each["monthyear"] = "Feb " + each["year"]
          }
          if (each["month"] == 3) {
            each["monthyear"] = "Mar " + each["year"]
          }
          if (each["month"] == 4) {
            each["monthyear"] = "Apr " + each["year"]
          }
          if (each["month"] == 5) {
            each["monthyear"] = "May " + each["year"]
          }
          if (each["month"] == 6) {
            each["monthyear"] = "Jun " + each["year"]
          }
          if (each["month"] == 7) {
            each["monthyear"] = "Jul " + each["year"]
          }
          if (each["month"] == 8) {
            each["monthyear"] = "Aug " + each["year"]
          }
          if (each["month"] == 9) {
            each["monthyear"] = "Sep " + each["year"]
          }
          if (each["month"] == 10) {
            each["monthyear"] = "Oct " + each["year"]
          }
          if (each["month"] == 11) {
            each["monthyear"] = "Nov " + each["year"]
          }
          if (each["month"] == 12) {
            each["monthyear"] = "Dec " + each["year"]
          }
          this.incomevalues.push(each["amount"])
        }
        console.log(this.expenses)

        for (let i = this.startindex; i > this.endindex; i--) {
          this.labelsspliced.push(this.labels[this.labels.length - i])
          this.expensevaluesspliced.push(this.expensevalues[this.expensevalues.length - i])
          this.incomevaluesspliced.push(this.incomevalues[this.incomevalues.length - i])
        }

        console.log(this.labelsspliced)
        console.log(this.expensevaluesspliced)
        console.log(this.incomevaluesspliced)

      });

      res.on("error", function (error) {
        console.error(error);
      });
    });

    req.end();
  }

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
      this.labelsspliced.push(this.labels[this.labels.length - i])
      this.expensevaluesspliced.push(this.expensevalues[this.expensevalues.length - i])
      this.incomevaluesspliced.push(this.incomevalues[this.incomevalues.length - i])
    }
    console.log(this.labelsspliced)
    console.log(this.expensevaluesspliced)
    console.log(this.incomevaluesspliced)

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
    if (ev.detail.value == "Jan") {
      this.defaultmonth = [["Jan", "01"]]
    }
    if (ev.detail.value == "Feb") {
      this.defaultmonth = [["Feb", "02"]]
    }
    if (ev.detail.value == "Mar") {
      this.defaultmonth = [["Mar", "03"]]
    }
    if (ev.detail.value == "Apr") {
      this.defaultmonth = [["Apr", "04"]]
    }
    if (ev.detail.value == "May") {
      this.defaultmonth = [["May", "05"]]
    }
    if (ev.detail.value == "Jun") {
      this.defaultmonth = [["Jun", "06"]]
    }
    if (ev.detail.value == "Jul") {
      this.defaultmonth = [["Jul", "07"]]
    }
    if (ev.detail.value == "Aug") {
      this.defaultmonth = [["Aug", "08"]]
    }
    if (ev.detail.value == "Sep") {
      this.defaultmonth = [["Sep", "09"]]
    }
    if (ev.detail.value == "Oct") {
      this.defaultmonth = [["Oct", "10"]]
    }
    if (ev.detail.value == "Nov") {
      this.defaultmonth = [["Nov", "11"]]
    }
    if (ev.detail.value == "Dec") {
      this.defaultmonth = [["Dec", "12"]]
    }
    var filtereddata = this.firebasedata["transactionhistory"].filter(each => each["made_on"].includes((this.defaultyear[0] + "-" + this.defaultmonth[0][1])));
    console.log(filtereddata)
    console.log(this.defaultmonth)

    var obj = {}
    this.backgroundcolors = []
    this.hovercolors = []
    // Loop through the list of transactions. Based on the transaction description, add the transaction amount to the categories accordingly. 
    for (let transaction of filtereddata) {
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

    var filtereddata = this.firebasedata["transactionhistory"].filter(each => each["made_on"].includes((this.defaultyear[0] + "-" + this.defaultmonth[0][1])));
    console.log(filtereddata)
    console.log(this.defaultyear)

    var obj = {}
    this.backgroundcolors = []
    this.hovercolors = []
    // Loop through the list of transactions. Based on the transaction description, add the transaction amount to the categories accordingly. 
    for (let transaction of filtereddata) {
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

    this.doughnutChart.config.data.labels = this.spendinginsightlabels
    this.doughnutChart.config.data.datasets[0].data = this.spendinginsightvalues
    this.doughnutChart.config.data.datasets[0].backgroundColor = this.backgroundcolors
    this.doughnutChart.config.data.datasets[0].hoverBackgroundColor = this.hovercolors
    this.doughnutChart.update({ duration: 1000 })
  }

  spendinginsights() {
    // this.spendinginsightlabels = Object.keys(this.firebasedata["spendinginsights"])
    // console.log(this.spendinginsightlabels)
    // console.log(Object.values(this.firebasedata["spendinginsights"]))

    // this.backgroundcolors = []
    // this.hovercolors = []

    // for (let eachcategory of Object.values(this.firebasedata["spendinginsights"])) {
    //   var eachcategorycurrencies = Object.keys(eachcategory)
    //   var categorycurrency = 0
    //   for (let currency of eachcategorycurrencies) {
    //     if (this.exchangerates[currency] != undefined) {
    //       categorycurrency = categorycurrency + (eachcategory[currency] * this.exchangerates[currency])
    //     } else {
    //       categorycurrency = eachcategory[currency]
    //     }

    //     console.log(eachcategory[currency])
    //     // console.log(this.exchangerates)
    //   }
    //   this.spendinginsightvalues.push(categorycurrency)

    //   var colors = this.saltedgeService.dynamicColors()
    //   this.backgroundcolors.push(colors[0])
    //   this.hovercolors.push(colors[1])
    // }
    // console.log(this.spendinginsightvalues)
  }

  // addDays(currentDate) {
  //   let date = new Date(currentDate);
  //   date.setDate(date.getDate() + 1);
  //   return date;
  // }

  // getDates(startDate, stopDate) {
  //   var dateArray = new Array();
  //   var currentDate = startDate;
  //   while (currentDate <= stopDate) {
  //     dateArray.push(new Date(currentDate));
  //     currentDate = this.addDays(currentDate);
  //   }
  //   return dateArray;
  // }

  transactionhistory() {
    console.log(this.firebasedata["transactionhistory"])
    var made_on_latest = this.firebasedata["transactionhistory"][0]["made_on"]
    var made_on_first = this.firebasedata["transactionhistory"][this.firebasedata["transactionhistory"].length - 1]["made_on"]
    console.log(made_on_latest)
    console.log(made_on_first)

    console.log(new Date(made_on_latest))
    console.log(new Date(made_on_latest).getFullYear())
    console.log(new Date(made_on_latest).getMonth())
    console.log(new Date(made_on_first))
    console.log(new Date(made_on_first).getFullYear())
    console.log(new Date(made_on_first).getMonth())

    for (let i = new Date(made_on_latest).getFullYear(); i >= new Date(made_on_first).getFullYear(); i--) {
      this.yeararray.push(i)
    }
    console.log(this.yeararray)
    this.defaultyear = [this.yeararray[0]]

    if ((new Date(made_on_latest).getFullYear()) != (new Date(made_on_first).getFullYear())) {
      if ((new Date(made_on_latest).getMonth()) == 11) {
        this.montharray = [["Jan", false], ["Feb", false], ["Mar", false], ["Apr", false], ["May", false], ["Jun", false], ["Jul", false], ["Aug", false], ["Sep", false], ["Oct", false], ["Nov", false], ["Dec", false]]
        this.defaultmonth = [["Dec", "12"]]
      }
      if ((new Date(made_on_latest).getMonth()) == 10) {
        this.montharray = [["Jan", false], ["Feb", false], ["Mar", false], ["Apr", false], ["May", false], ["Jun", false], ["Jul", false], ["Aug", false], ["Sep", false], ["Oct", false], ["Nov", false], ["Dec", true]]
        this.defaultmonth = [["Nov", "11"]]
      }
      if ((new Date(made_on_latest).getMonth()) == 9) {
        this.montharray = [["Jan", false], ["Feb", false], ["Mar", false], ["Apr", false], ["May", false], ["Jun", false], ["Jul", false], ["Aug", false], ["Sep", false], ["Oct", false], ["Nov", true], ["Dec", true]]
        this.defaultmonth = [["Oct", "10"]]
      }
      if ((new Date(made_on_latest).getMonth()) == 8) {
        this.montharray = [["Jan", false], ["Feb", false], ["Mar", false], ["Apr", false], ["May", false], ["Jun", false], ["Jul", false], ["Aug", false], ["Sep", false], ["Oct", true], ["Nov", true], ["Dec", true]]
        this.defaultmonth = [["Sep", "09"]]
      }
      if ((new Date(made_on_latest).getMonth()) == 7) {
        this.montharray = [["Jan", false], ["Feb", false], ["Mar", false], ["Apr", false], ["May", false], ["Jun", false], ["Jul", false], ["Aug", false], ["Sep", true], ["Oct", true], ["Nov", true], ["Dec", true]]
        this.defaultmonth = [["Aug", "08"]]
      }
      if ((new Date(made_on_latest).getMonth()) == 6) {
        this.montharray = [["Jan", false], ["Feb", false], ["Mar", false], ["Apr", false], ["May", false], ["Jun", false], ["Jul", false], ["Aug", true], ["Sep", true], ["Oct", true], ["Nov", true], ["Dec", true]]
        this.defaultmonth = [["Jul", "07"]]
      }
      if ((new Date(made_on_latest).getMonth()) == 5) {
        this.montharray = [["Jan", false], ["Feb", false], ["Mar", false], ["Apr", false], ["May", false], ["Jun", false], ["Jul", true], ["Aug", true], ["Sep", true], ["Oct", true], ["Nov", true], ["Dec", true]]
        this.defaultmonth = [["Jun", "06"]]
      }
      if ((new Date(made_on_latest).getMonth()) == 4) {
        this.montharray = [["Jan", false], ["Feb", false], ["Mar", false], ["Apr", false], ["May", false], ["Jun", true], ["Jul", true], ["Aug", true], ["Sep", true], ["Oct", true], ["Nov", true], ["Dec", true]]
        this.defaultmonth = [["May", "05"]]
      }
      if ((new Date(made_on_latest).getMonth()) == 3) {
        this.montharray = [["Jan", false], ["Feb", false], ["Mar", false], ["Apr", false], ["May", true], ["Jun", true], ["Jul", true], ["Aug", true], ["Sep", true], ["Oct", true], ["Nov", true], ["Dec", true]]
        this.defaultmonth = [["Apr", "04"]]
      }
      if ((new Date(made_on_latest).getMonth()) == 2) {
        this.montharray = [["Jan", false], ["Feb", false], ["Mar", false], ["Apr", true], ["May", true], ["Jun", true], ["Jul", true], ["Aug", true], ["Sep", true], ["Oct", true], ["Nov", true], ["Dec", true]]
        this.defaultmonth = [["Mar", "03"]]
      }
      if ((new Date(made_on_latest).getMonth()) == 1) {
        this.montharray = [["Jan", false], ["Feb", false], ["Mar", true], ["Apr", true], ["May", true], ["Jun", true], ["Jul", true], ["Aug", true], ["Sep", true], ["Oct", true], ["Nov", true], ["Dec", true]]
        this.defaultmonth = [["Feb", "02"]]
      }
      if ((new Date(made_on_latest).getMonth()) == 0) {
        this.montharray = [["Jan", false], ["Feb", true], ["Mar", true], ["Apr", true], ["May", true], ["Jun", true], ["Jul", true], ["Aug", true], ["Sep", true], ["Oct", true], ["Nov", true], ["Dec", true]]
        this.defaultmonth = [["Jan", "01"]]
      }
    } else {
      this.montharray = [["Jan", true], ["Feb", true], ["Mar", true], ["Apr", true], ["May", true], ["Jun", true], ["Jul", true], ["Aug", true], ["Sep", true], ["Oct", true], ["Nov", true], ["Dec", true]]
      for (let i = new Date(made_on_first).getMonth(); i <= new Date(made_on_latest).getMonth(); i++) {
        console.log(i)
        this.montharray[i][1] = false
      }
      this.defaultmonth = [[this.montharray[new Date(made_on_latest).getMonth()][0], ('0' + (new Date(made_on_latest).getMonth() + 1)).slice(-2)]]
      console.log(this.defaultmonth)
    }

    var filtereddata = this.firebasedata["transactionhistory"].filter(each => each["made_on"].includes((this.defaultyear[0] + "-" + this.defaultmonth[0][1])));
    console.log(this.defaultyear)
    console.log(this.defaultmonth)
    console.log(filtereddata)

    var obj = {}
    this.backgroundcolors = []
    this.hovercolors = []
    // Loop through the list of transactions. Based on the transaction description, add the transaction amount to the categories accordingly. 
    for (let transaction of filtereddata) {
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
  }

  constructor(public navCtrl: NavController, private activatedRoute: ActivatedRoute, private userService: UserService, private firestore: AngularFirestore, public expensesService: ExpensesService, public saltedgeService: SaltedgeService) {
    // this.loadColumnChart();
    // this.loadSimplePieChart();

    // if (this.activatedRoute.snapshot.queryParams['code']) {
    //   citiLogin = true
    // }
    // if (this.activatedRoute.snapshot.queryParams['access_token']) {
    //   ocbcLogin = true
    // }


    // Citibank backend code to get auth code, access token and transaction history for now
    // I put at home page as this is where the user will get redirected to. 


    // if (userService.loggedin == false) {
    //   let sub: Subscription = firestore.collection<any>('users').doc("test1234@example.com").valueChanges().subscribe((data) => {
    //     console.log(data)
    //     console.log(data["balances"][0])
    //     console.log(Object.entries(data["balances"][0]))
    //     this.total = Object.entries(data["balances"][0])
    //     for (let each of this.total) {
    //       // console.log(`${each[1]} ${each[0]}`)
    //       each[1] = parseInt(each[1].toString()).toLocaleString('en-SG', { style: 'currency', currency: each[0] })
    //       // var string = `${each[1]} <br><br>`
    //       // this.total = this.total.concat(string)
    //       // console.log(this.total)
    //     }
    //     console.log(this.total)

    //     sub.unsubscribe();
    //   });
    // } else {
    //   let sub: Subscription = this.firestore.collection<any>('users').doc(this.userService.uid).valueChanges().subscribe((data) => {
    //     console.log(data)
    //     console.log(data["balances"][0])
    //     console.log(Object.entries(data["balances"][0]))
    //     this.total = Object.entries(data["balances"][0])
    //     for (let each of this.total) {
    //       // console.log(`${each[1]} ${each[0]}`)
    //       each[1] = parseInt(each[1].toString()).toLocaleString('en-SG', { style: 'currency', currency: each[0] })
    //       // var string = `${each[1]} <br><br>`
    //       // this.total = this.total.concat(string)
    //       // console.log(this.total)
    //     }
    //     console.log(this.total)

    //     sub.unsubscribe();
    //   });
    // }

    // if (this.activatedRoute.snapshot.queryParams['connection_id']) {

    // }

    console.log(new Date().toDateString())
    console.log(this.saltedgeService.formatDate(new Date()))

    if (this.userService.loggedin == false) {
      let sub: Subscription = this.firestore.collection<any>('users').doc("test1234@example.com").valueChanges().subscribe((data) => {
        this.firebasedata = data
        console.log(data)
        console.log(data["saltedgereportid"])
        this.saltedgeService.saltedgereportid = data["saltedgereportid"]
        this.saltedgeService.saltedgecustomerid = data["saltedgecustomerid"]

        sub.unsubscribe();

        this.recreateinsight()
      });
    } else {
      let sub: Subscription = this.firestore.collection<any>('users').doc(this.userService.uid).valueChanges().subscribe((data) => {
        this.firebasedata = data
        console.log(data)
        console.log(data["saltedgereportid"])
        this.saltedgeService.saltedgereportid = data["saltedgereportid"]

        sub.unsubscribe();

        this.recreateinsight()
      });
    }

    // if (this.activatedRoute.snapshot.queryParams['code']) {
    //   // If there is no authorisation code (Get auth code)
    //   if (!this.userService.citiauthorisationCode) {
    //     this.userService.citiauthorisationCode = this.activatedRoute.snapshot.queryParams['code'];
    //     console.log(this.activatedRoute.snapshot.queryParams['code'])
    //   }
    //   console.log(this.userService.citiauthorisationCode);

    //   // If there is auth code and no access token (Get access token)
    //   if (this.userService.citiauthorisationCode && !this.userService.citiaccessToken) {

    //     var https = require('follow-redirects').https;

    //     var qs = require('querystring');

    //     var options = {
    //       'method': 'POST',
    //       'hostname': 'sandbox.apihub.citi.com',
    //       'path': '/gcb/api/authCode/oauth2/token/sg/gcb',
    //       'headers': {
    //         'Accept': 'application/json',
    //         'Authorization': 'Basic MDU0NTE4NjUtN2QzOS00NzA0LWI0OTUtODAzZjExZDJkZDA5OlY4a1QybVM1eVkyeUE0aEM2YkU4YUMyZUU3Y0U1Z0w4dkIydUQxakcxcUw1ZUUyYlgx',
    //         'Content-Type': 'application/x-www-form-urlencoded',
    //         'Cookie': 'RSA=164292451157170727520200729230711; bizToken=fU2UtG1g/AI3JOqozWsTWkpiT9WhJwTX6VEA7KVJYStvXsBe/bJYuBCltpb6fjNrrpyNQvfhu79O3O8ZnQchXSGf35FKcMTX2DeZL3uIoPu7wr8+7KmPSSzipBMzyXxgoFmg4C4kDc9BrI7l90mgcEFbrdOZCuKcrgl9CYY59EK+yurqvFtwgYpitFFTIGX1WiLqSt7VIXZMPgNmen1dLlGkFnlxSE3CFqqFIuQW6ClDmyj3jTHxCyU/Ekcl9rbj72U8n0rcCXvGoyNup6FxPiBW2n5ICSI7p8yMLn+HentBjKsrGksl1tCrdBjz8t3M+qvQvF/RW1ckJO46EiYz9spF1G132H73c3zyBBOc5lVyZ2HzjkwKYifkE2DTiDr5tQPyUBkfy/AaaJiGY0Yw8MwK8HM+YbcRWYxdXwi9WleOuW0F5+Ug/FzLx16MZx3LVHh7qcsgwqRAxgM1nOKR9RqOdRyxvVrmp52bh0lie5Q=; CITI_SITE=gtdc'
    //       },
    //       'maxRedirects': 20
    //     };

    //     var req = https.request(options, function (res) {
    //       var chunks = [];

    //       res.on("data", function (chunk) {
    //         chunks.push(chunk);
    //       });

    //       res.on("end", function (chunk) {
    //         var body = Buffer.concat(chunks);
    //         console.log(body.toString());
    //         console.log(JSON.parse(body.toString())["access_token"])
    //         userService.citiaccessToken = (JSON.parse(body.toString())["access_token"])
    //         userService.citiLogin = true
    //         console.log(userService.citiLogin)
    //         navCtrl.navigateRoot('/accounts')
    //       });

    //       res.on("error", function (error) {
    //         console.error(error);
    //       });
    //     });

    //     var postData = qs.stringify({
    //       'grant_type': 'authorization_code',
    //       'code': this.userService.citiauthorisationCode,
    //       'redirect_uri': 'https://ionicfirebase-a8213.web.app'
    //     });

    //     req.write(postData);

    //     req.end();
    //     console.log(postData);
    //   }
    // }
    // if (this.activatedRoute.snapshot.queryParams['access_token']) {
    //   // console.log(this.activatedRoute.snapshot.queryParams['access_token'])
    //   userService.ocbcLogin = true
    //   userService.ocbcaccessToken = "e748e2c68bae6fa287cedb352b26229a"
    //   navCtrl.navigateRoot('/accounts')
    // }
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
    }), 6000);

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
        maintainAspectRatio: false
      }
    }), 6000)

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

