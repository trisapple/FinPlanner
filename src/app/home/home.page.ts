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

    var postData = JSON.stringify({ "data": { "customer_id": this.saltedgeService.saltedgecustomerid, "report_types": ["balance", "expense", "income", "savings"], "currency_code": "SGD", "from_date": this.made_on_first, "to_date": this.made_on_latest } });

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

    if (ev.detail.value == new Date(this.made_on_first).getFullYear()) {
      if ((new Date(this.made_on_first).getMonth()) == 11) {
        this.montharray = [["Jan", true], ["Feb", true], ["Mar", true], ["Apr", true], ["May", true], ["Jun", true], ["Jul", true], ["Aug", true], ["Sep", true], ["Oct", true], ["Nov", true], ["Dec", false]]
        if (this.defaultmonth[0][0] == "Jan" || this.defaultmonth[0][0] == "Feb" || this.defaultmonth[0][0] == "Mar" || this.defaultmonth[0][0] == "Apr" || this.defaultmonth[0][0] == "May" || this.defaultmonth[0][0] == "Jun" || this.defaultmonth[0][0] == "Jul" || this.defaultmonth[0][0] == "Aug" || this.defaultmonth[0][0] == "Sep" || this.defaultmonth[0][0] == "Oct" || this.defaultmonth[0][0] == "Nov") {
          this.defaultmonth = [["Dec", "12"]]
        }
      }
      if ((new Date(this.made_on_first).getMonth()) == 10) {
        this.montharray = [["Jan", true], ["Feb", true], ["Mar", true], ["Apr", true], ["May", true], ["Jun", true], ["Jul", true], ["Aug", true], ["Sep", true], ["Oct", true], ["Nov", false], ["Dec", false]]
        if (this.defaultmonth[0][0] == "Jan" || this.defaultmonth[0][0] == "Feb" || this.defaultmonth[0][0] == "Mar" || this.defaultmonth[0][0] == "Apr" || this.defaultmonth[0][0] == "May" || this.defaultmonth[0][0] == "Jun" || this.defaultmonth[0][0] == "Jul" || this.defaultmonth[0][0] == "Aug" || this.defaultmonth[0][0] == "Sep" || this.defaultmonth[0][0] == "Oct") {
          this.defaultmonth = [["Nov", "11"]]
        }
      }
      if ((new Date(this.made_on_first).getMonth()) == 9) {
        this.montharray = [["Jan", true], ["Feb", true], ["Mar", true], ["Apr", true], ["May", true], ["Jun", true], ["Jul", true], ["Aug", true], ["Sep", true], ["Oct", false], ["Nov", false], ["Dec", false]]
        if (this.defaultmonth[0][0] == "Jan" || this.defaultmonth[0][0] == "Feb" || this.defaultmonth[0][0] == "Mar" || this.defaultmonth[0][0] == "Apr" || this.defaultmonth[0][0] == "May" || this.defaultmonth[0][0] == "Jun" || this.defaultmonth[0][0] == "Jul" || this.defaultmonth[0][0] == "Aug" || this.defaultmonth[0][0] == "Sep") {
          this.defaultmonth = [["Oct", "10"]]
        }
      }
      if ((new Date(this.made_on_first).getMonth()) == 8) {
        this.montharray = [["Jan", true], ["Feb", true], ["Mar", true], ["Apr", true], ["May", true], ["Jun", true], ["Jul", true], ["Aug", true], ["Sep", false], ["Oct", false], ["Nov", false], ["Dec", false]]
        if (this.defaultmonth[0][0] == "Jan" || this.defaultmonth[0][0] == "Feb" || this.defaultmonth[0][0] == "Mar" || this.defaultmonth[0][0] == "Apr" || this.defaultmonth[0][0] == "May" || this.defaultmonth[0][0] == "Jun" || this.defaultmonth[0][0] == "Jul" || this.defaultmonth[0][0] == "Aug") {
          this.defaultmonth = [["Sep", "09"]]
        }
      }
      if ((new Date(this.made_on_first).getMonth()) == 7) {
        this.montharray = [["Jan", true], ["Feb", true], ["Mar", true], ["Apr", true], ["May", true], ["Jun", true], ["Jul", true], ["Aug", false], ["Sep", false], ["Oct", false], ["Nov", false], ["Dec", false]]
        if (this.defaultmonth[0][0] == "Jan" || this.defaultmonth[0][0] == "Feb" || this.defaultmonth[0][0] == "Mar" || this.defaultmonth[0][0] == "Apr" || this.defaultmonth[0][0] == "May" || this.defaultmonth[0][0] == "Jun" || this.defaultmonth[0][0] == "Jul") {
          this.defaultmonth = [["Aug", "08"]]
        }
      }
      if ((new Date(this.made_on_first).getMonth()) == 6) {
        this.montharray = [["Jan", true], ["Feb", true], ["Mar", true], ["Apr", true], ["May", true], ["Jun", true], ["Jul", false], ["Aug", false], ["Sep", false], ["Oct", false], ["Nov", false], ["Dec", false]]
        if (this.defaultmonth[0][0] == "Jan" || this.defaultmonth[0][0] == "Feb" || this.defaultmonth[0][0] == "Mar" || this.defaultmonth[0][0] == "Apr" || this.defaultmonth[0][0] == "May" || this.defaultmonth[0][0] == "Jun") {
          this.defaultmonth = [["Jul", "07"]]
        }
      }
      if ((new Date(this.made_on_first).getMonth()) == 5) {
        this.montharray = [["Jan", true], ["Feb", true], ["Mar", true], ["Apr", true], ["May", true], ["Jun", false], ["Jul", false], ["Aug", false], ["Sep", false], ["Oct", false], ["Nov", false], ["Dec", false]]
        if (this.defaultmonth[0][0] == "Jan" || this.defaultmonth[0][0] == "Feb" || this.defaultmonth[0][0] == "Mar" || this.defaultmonth[0][0] == "Apr" || this.defaultmonth[0][0] == "May") {
          this.defaultmonth = [["Jun", "06"]]
        }
      }
      if ((new Date(this.made_on_first).getMonth()) == 4) {
        this.montharray = [["Jan", true], ["Feb", true], ["Mar", true], ["Apr", true], ["May", false], ["Jun", false], ["Jul", false], ["Aug", false], ["Sep", false], ["Oct", false], ["Nov", false], ["Dec", false]]
        if (this.defaultmonth[0][0] == "Jan" || this.defaultmonth[0][0] == "Feb" || this.defaultmonth[0][0] == "Mar" || this.defaultmonth[0][0] == "Apr") {
          this.defaultmonth = [["May", "05"]]
        }
      }
      if ((new Date(this.made_on_first).getMonth()) == 3) {
        this.montharray = [["Jan", true], ["Feb", true], ["Mar", true], ["Apr", false], ["May", false], ["Jun", false], ["Jul", false], ["Aug", false], ["Sep", false], ["Oct", false], ["Nov", false], ["Dec", false]]
        if (this.defaultmonth[0][0] == "Jan" || this.defaultmonth[0][0] == "Feb" || this.defaultmonth[0][0] == "Mar") {
          this.defaultmonth = [["Apr", "04"]]
        }
      }
      if ((new Date(this.made_on_first).getMonth()) == 2) {
        this.montharray = [["Jan", true], ["Feb", true], ["Mar", false], ["Apr", false], ["May", false], ["Jun", false], ["Jul", false], ["Aug", false], ["Sep", false], ["Oct", false], ["Nov", false], ["Dec", false]]
        if (this.defaultmonth[0][0] == "Jan" || this.defaultmonth[0][0] == "Feb") {
          this.defaultmonth = [["Mar", "03"]]
        }
      }
      if ((new Date(this.made_on_first).getMonth()) == 1) {
        this.montharray = [["Jan", true], ["Feb", false], ["Mar", false], ["Apr", false], ["May", false], ["Jun", false], ["Jul", false], ["Aug", false], ["Sep", false], ["Oct", false], ["Nov", false], ["Dec", false]]
        if (this.defaultmonth[0][0] == "Jan") {
          this.defaultmonth = [["Feb", "02"]]
        }
      }
      if ((new Date(this.made_on_first).getMonth()) == 0) {
        this.montharray = [["Jan", false], ["Feb", false], ["Mar", false], ["Apr", false], ["May", false], ["Jun", false], ["Jul", false], ["Aug", false], ["Sep", false], ["Oct", false], ["Nov", false], ["Dec", false]]
      }
    } else if (ev.detail.value == new Date(this.made_on_latest).getFullYear()) {
      if ((new Date(this.made_on_latest).getMonth()) == 11) {
        this.montharray = [["Jan", false], ["Feb", false], ["Mar", false], ["Apr", false], ["May", false], ["Jun", false], ["Jul", false], ["Aug", false], ["Sep", false], ["Oct", false], ["Nov", false], ["Dec", false]]
      }
      if ((new Date(this.made_on_latest).getMonth()) == 10) {
        this.montharray = [["Jan", false], ["Feb", false], ["Mar", false], ["Apr", false], ["May", false], ["Jun", false], ["Jul", false], ["Aug", false], ["Sep", false], ["Oct", false], ["Nov", false], ["Dec", true]]
        if (this.defaultmonth[0][0] == "Dec") {
          this.defaultmonth = [["Nov", "11"]]
        }
      }
      if ((new Date(this.made_on_latest).getMonth()) == 9) {
        this.montharray = [["Jan", false], ["Feb", false], ["Mar", false], ["Apr", false], ["May", false], ["Jun", false], ["Jul", false], ["Aug", false], ["Sep", false], ["Oct", false], ["Nov", true], ["Dec", true]]
        if (this.defaultmonth[0][0] == "Dec" || this.defaultmonth[0][0] == "Nov") {
          this.defaultmonth = [["Oct", "10"]]
        }
      }
      if ((new Date(this.made_on_latest).getMonth()) == 8) {
        this.montharray = [["Jan", false], ["Feb", false], ["Mar", false], ["Apr", false], ["May", false], ["Jun", false], ["Jul", false], ["Aug", false], ["Sep", false], ["Oct", true], ["Nov", true], ["Dec", true]]
        if (this.defaultmonth[0][0] == "Dec" || this.defaultmonth[0][0] == "Nov" || this.defaultmonth[0][0] == "Oct") {
          this.defaultmonth = [["Sep", "09"]]
        }
      }
      if ((new Date(this.made_on_latest).getMonth()) == 7) {
        this.montharray = [["Jan", false], ["Feb", false], ["Mar", false], ["Apr", false], ["May", false], ["Jun", false], ["Jul", false], ["Aug", false], ["Sep", true], ["Oct", true], ["Nov", true], ["Dec", true]]
        if (this.defaultmonth[0][0] == "Dec" || this.defaultmonth[0][0] == "Nov" || this.defaultmonth[0][0] == "Oct" || this.defaultmonth[0][0] == "Sep") {
          this.defaultmonth = [["Aug", "08"]]
        }
      }
      if ((new Date(this.made_on_latest).getMonth()) == 6) {
        this.montharray = [["Jan", false], ["Feb", false], ["Mar", false], ["Apr", false], ["May", false], ["Jun", false], ["Jul", false], ["Aug", true], ["Sep", true], ["Oct", true], ["Nov", true], ["Dec", true]]
        if (this.defaultmonth[0][0] == "Dec" || this.defaultmonth[0][0] == "Nov" || this.defaultmonth[0][0] == "Oct" || this.defaultmonth[0][0] == "Sep" || this.defaultmonth[0][0] == "Aug") {
          this.defaultmonth = [["Jul", "07"]]
        }
      }
      if ((new Date(this.made_on_latest).getMonth()) == 5) {
        this.montharray = [["Jan", false], ["Feb", false], ["Mar", false], ["Apr", false], ["May", false], ["Jun", false], ["Jul", true], ["Aug", true], ["Sep", true], ["Oct", true], ["Nov", true], ["Dec", true]]
        if (this.defaultmonth[0][0] == "Dec" || this.defaultmonth[0][0] == "Nov" || this.defaultmonth[0][0] == "Oct" || this.defaultmonth[0][0] == "Sep" || this.defaultmonth[0][0] == "Aug" || this.defaultmonth[0][0] == "Jul") {
          this.defaultmonth = [["Jun", "06"]]
        }
      }
      if ((new Date(this.made_on_latest).getMonth()) == 4) {
        this.montharray = [["Jan", false], ["Feb", false], ["Mar", false], ["Apr", false], ["May", false], ["Jun", true], ["Jul", true], ["Aug", true], ["Sep", true], ["Oct", true], ["Nov", true], ["Dec", true]]
        if (this.defaultmonth[0][0] == "Dec" || this.defaultmonth[0][0] == "Nov" || this.defaultmonth[0][0] == "Oct" || this.defaultmonth[0][0] == "Sep" || this.defaultmonth[0][0] == "Aug" || this.defaultmonth[0][0] == "Jul" || this.defaultmonth[0][0] == "Jun") {
          this.defaultmonth = [["May", "05"]]
        }
      }
      if ((new Date(this.made_on_latest).getMonth()) == 3) {
        this.montharray = [["Jan", false], ["Feb", false], ["Mar", false], ["Apr", false], ["May", true], ["Jun", true], ["Jul", true], ["Aug", true], ["Sep", true], ["Oct", true], ["Nov", true], ["Dec", true]]
        if (this.defaultmonth[0][0] == "Dec" || this.defaultmonth[0][0] == "Nov" || this.defaultmonth[0][0] == "Oct" || this.defaultmonth[0][0] == "Sep" || this.defaultmonth[0][0] == "Aug" || this.defaultmonth[0][0] == "Jul" || this.defaultmonth[0][0] == "Jun" || this.defaultmonth[0][0] == "May") {
          this.defaultmonth = [["Apr", "04"]]
        }
      }
      if ((new Date(this.made_on_latest).getMonth()) == 2) {
        this.montharray = [["Jan", false], ["Feb", false], ["Mar", false], ["Apr", true], ["May", true], ["Jun", true], ["Jul", true], ["Aug", true], ["Sep", true], ["Oct", true], ["Nov", true], ["Dec", true]]
        if (this.defaultmonth[0][0] == "Dec" || this.defaultmonth[0][0] == "Nov" || this.defaultmonth[0][0] == "Oct" || this.defaultmonth[0][0] == "Sep" || this.defaultmonth[0][0] == "Aug" || this.defaultmonth[0][0] == "Jul" || this.defaultmonth[0][0] == "Jun" || this.defaultmonth[0][0] == "May" || this.defaultmonth[0][0] == "Apr") {
          this.defaultmonth = [["Mar", "03"]]
        }
      }
      if ((new Date(this.made_on_latest).getMonth()) == 1) {
        this.montharray = [["Jan", false], ["Feb", false], ["Mar", true], ["Apr", true], ["May", true], ["Jun", true], ["Jul", true], ["Aug", true], ["Sep", true], ["Oct", true], ["Nov", true], ["Dec", true]]
        if (this.defaultmonth[0][0] == "Dec" || this.defaultmonth[0][0] == "Nov" || this.defaultmonth[0][0] == "Oct" || this.defaultmonth[0][0] == "Sep" || this.defaultmonth[0][0] == "Aug" || this.defaultmonth[0][0] == "Jul" || this.defaultmonth[0][0] == "Jun" || this.defaultmonth[0][0] == "May" || this.defaultmonth[0][0] == "Apr" || this.defaultmonth[0][0] == "Mar") {
          this.defaultmonth = [["Feb", "02"]]
        }
      }
      if ((new Date(this.made_on_latest).getMonth()) == 0) {
        this.montharray = [["Jan", false], ["Feb", true], ["Mar", true], ["Apr", true], ["May", true], ["Jun", true], ["Jul", true], ["Aug", true], ["Sep", true], ["Oct", true], ["Nov", true], ["Dec", true]]
        if (this.defaultmonth[0][0] == "Dec" || this.defaultmonth[0][0] == "Nov" || this.defaultmonth[0][0] == "Oct" || this.defaultmonth[0][0] == "Sep" || this.defaultmonth[0][0] == "Aug" || this.defaultmonth[0][0] == "Jul" || this.defaultmonth[0][0] == "Jun" || this.defaultmonth[0][0] == "May" || this.defaultmonth[0][0] == "Apr" || this.defaultmonth[0][0] == "Mar" || this.defaultmonth[0][0] == "Feb") {
          this.defaultmonth = [["Jan", "01"]]
        }
      }
    } else {
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

    for (let i = new Date(this.made_on_latest).getFullYear(); i >= new Date(this.made_on_first).getFullYear(); i--) {
      this.yeararray.push(i)
    }
    console.log(this.yeararray)
    this.defaultyear = [this.yeararray[0]]

    if ((new Date(this.made_on_latest).getFullYear()) != (new Date(this.made_on_first).getFullYear())) {
      if ((new Date(this.made_on_latest).getMonth()) == 11) {
        this.montharray = [["Jan", false], ["Feb", false], ["Mar", false], ["Apr", false], ["May", false], ["Jun", false], ["Jul", false], ["Aug", false], ["Sep", false], ["Oct", false], ["Nov", false], ["Dec", false]]
        this.defaultmonth = [["Dec", "12"]]
      }
      if ((new Date(this.made_on_latest).getMonth()) == 10) {
        this.montharray = [["Jan", false], ["Feb", false], ["Mar", false], ["Apr", false], ["May", false], ["Jun", false], ["Jul", false], ["Aug", false], ["Sep", false], ["Oct", false], ["Nov", false], ["Dec", true]]
        this.defaultmonth = [["Nov", "11"]]
      }
      if ((new Date(this.made_on_latest).getMonth()) == 9) {
        this.montharray = [["Jan", false], ["Feb", false], ["Mar", false], ["Apr", false], ["May", false], ["Jun", false], ["Jul", false], ["Aug", false], ["Sep", false], ["Oct", false], ["Nov", true], ["Dec", true]]
        this.defaultmonth = [["Oct", "10"]]
      }
      if ((new Date(this.made_on_latest).getMonth()) == 8) {
        this.montharray = [["Jan", false], ["Feb", false], ["Mar", false], ["Apr", false], ["May", false], ["Jun", false], ["Jul", false], ["Aug", false], ["Sep", false], ["Oct", true], ["Nov", true], ["Dec", true]]
        this.defaultmonth = [["Sep", "09"]]
      }
      if ((new Date(this.made_on_latest).getMonth()) == 7) {
        this.montharray = [["Jan", false], ["Feb", false], ["Mar", false], ["Apr", false], ["May", false], ["Jun", false], ["Jul", false], ["Aug", false], ["Sep", true], ["Oct", true], ["Nov", true], ["Dec", true]]
        this.defaultmonth = [["Aug", "08"]]
      }
      if ((new Date(this.made_on_latest).getMonth()) == 6) {
        this.montharray = [["Jan", false], ["Feb", false], ["Mar", false], ["Apr", false], ["May", false], ["Jun", false], ["Jul", false], ["Aug", true], ["Sep", true], ["Oct", true], ["Nov", true], ["Dec", true]]
        this.defaultmonth = [["Jul", "07"]]
      }
      if ((new Date(this.made_on_latest).getMonth()) == 5) {
        this.montharray = [["Jan", false], ["Feb", false], ["Mar", false], ["Apr", false], ["May", false], ["Jun", false], ["Jul", true], ["Aug", true], ["Sep", true], ["Oct", true], ["Nov", true], ["Dec", true]]
        this.defaultmonth = [["Jun", "06"]]
      }
      if ((new Date(this.made_on_latest).getMonth()) == 4) {
        this.montharray = [["Jan", false], ["Feb", false], ["Mar", false], ["Apr", false], ["May", false], ["Jun", true], ["Jul", true], ["Aug", true], ["Sep", true], ["Oct", true], ["Nov", true], ["Dec", true]]
        this.defaultmonth = [["May", "05"]]
      }
      if ((new Date(this.made_on_latest).getMonth()) == 3) {
        this.montharray = [["Jan", false], ["Feb", false], ["Mar", false], ["Apr", false], ["May", true], ["Jun", true], ["Jul", true], ["Aug", true], ["Sep", true], ["Oct", true], ["Nov", true], ["Dec", true]]
        this.defaultmonth = [["Apr", "04"]]
      }
      if ((new Date(this.made_on_latest).getMonth()) == 2) {
        this.montharray = [["Jan", false], ["Feb", false], ["Mar", false], ["Apr", true], ["May", true], ["Jun", true], ["Jul", true], ["Aug", true], ["Sep", true], ["Oct", true], ["Nov", true], ["Dec", true]]
        this.defaultmonth = [["Mar", "03"]]
      }
      if ((new Date(this.made_on_latest).getMonth()) == 1) {
        this.montharray = [["Jan", false], ["Feb", false], ["Mar", true], ["Apr", true], ["May", true], ["Jun", true], ["Jul", true], ["Aug", true], ["Sep", true], ["Oct", true], ["Nov", true], ["Dec", true]]
        this.defaultmonth = [["Feb", "02"]]
      }
      if ((new Date(this.made_on_latest).getMonth()) == 0) {
        this.montharray = [["Jan", false], ["Feb", true], ["Mar", true], ["Apr", true], ["May", true], ["Jun", true], ["Jul", true], ["Aug", true], ["Sep", true], ["Oct", true], ["Nov", true], ["Dec", true]]
        this.defaultmonth = [["Jan", "01"]]
      }
    } else {
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

        this.recreateinsight()
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

        this.recreateinsight()
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

