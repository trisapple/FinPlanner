import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../user.service';
import { Subscription } from 'rxjs';


import { GoogleChartInterface } from 'ng2-google-charts/esm2015/lib/google-charts-interfaces';
import { AngularFirestore } from '@angular/fire/firestore';
import { ExpensesService } from '../expenses.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

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

  constructor(public navCtrl: NavController, private activatedRoute: ActivatedRoute, private userService: UserService, private firestore: AngularFirestore, public expensesService: ExpensesService) {
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

    var https = require('follow-redirects').https;

    var options = {
      'method': 'GET',
      'hostname': 'cors-anywhere.herokuapp.com',
      'path': '/https://www.saltedge.com/api/v5/reports/310877788942895670',
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

        var originaltotal = {}
        for (let each of JSON.parse(body.toString()).data.data.connections) {
          // console.log(each.accounts)
          for (let each2 of each.accounts) {
            console.log(each2)
            console.log(each2.original_balance)
            console.log(each2.original_currency_code)

            // If the category has not yet been added to the Object, start it from 0 and add up the value
            if (originaltotal[each2.original_currency_code] == undefined) {
              originaltotal[each2.original_currency_code] = 0 // Start from 0
            }
            originaltotal[each2.original_currency_code] += each2.original_balance // Add up the value to the Object
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
        // this.originaltotal.push(originaltotal)

        // Expenses
        for (let each of this.expenses) {
          if (each["month"] == 6) {
            each["month"] = "June"
          }
          if (each["month"] == 7) {
            each["month"] = "July"
          }
          if (each["month"] == 8) {
            each["month"] = "August"
          }
          if (each["month"] == 9) {
            each["month"] = "September"
          }
          each["amount"] = Math.abs(each["amount"]).toLocaleString('en-SG', { style: 'currency', currency: this.currencycode })
        }

        // Income
        for (let each of this.income) {
          if (each["month"] == 6) {
            each["month"] = "June"
          }
          if (each["month"] == 7) {
            each["month"] = "July"
          }
          if (each["month"] == 8) {
            each["month"] = "August"
          }
          if (each["month"] == 9) {
            each["month"] = "September"
          }
          each["amount"] = (each["amount"]).toLocaleString('en-SG', { style: 'currency', currency: this.currencycode })
        }
        console.log(this.expenses)

      });

      res.on("error", function (error) {
        console.error(error);
      });
    });

    req.end();

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

  ngOnInit() {

  }
}

