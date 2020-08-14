import { Component, OnInit } from '@angular/core';
import { ExpensesPage } from '../expenses/expenses.page';
import { ExpensesService } from '../expenses.service';
import { UserService } from '../user.service';

import { GoogleChartInterface } from 'ng2-google-charts/esm2015/lib/google-charts-interfaces';

@Component({
  selector: 'app-expensessummary',
  templateUrl: './expensessummary.page.html',
  styleUrls: ['./expensessummary.page.scss'],
})
export class ExpensessummaryPage implements OnInit {

  constructor(public expensesService: ExpensesService, public userService: UserService) { 

    retrieveCitiTransactions()
    function retrieveCitiTransactions() {
      var https = require('follow-redirects').https;
      var options = {
        'method': 'GET',
        'hostname': 'sandbox.apihub.citi.com',
        'path': '/gcb/api/v1/accounts/' + expensesService.transactionhistoryaccountId + '/transactions',
        'headers': {
          'Accept': 'application/json',
          'client_id': '05451865-7d39-4704-b495-803f11d2dd09',
          'uuid': 'aae5acdc-f196-48c7-8d10-e027ffd54552',
          'Authorization': 'Bearer ' + userService.accessToken,
          'Cookie': 'RSA=164292451157170727520200729230711; RSA=164292451157170727520200729230711; RSA=164292451157170727520200729230711; CITI_SITE=gtdc'
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
          // console.log(body.toString());
          // console.log(JSON.parse(body.toString())["transaction"])
          expensesService.transactions = JSON.parse(body.toString())["transaction"]
          console.log(expensesService.transactions)

          expensesService.transactioncategories = []

          var obj = {}
          var food = 0
          var bills = 0
          var lifestyle = 0
          var taxes = 0
          var recurringfees = 0

          for (let transaction of expensesService.transactions) {
            if (transaction.transactionDescription == "COLD STORAGE-EASTWOOD" || transaction.transactionDescription == "COLD STORAGE-EASTWOOD SINGAPORE SG") {
              food += transaction.transactionAmount
            }
            if (transaction.transactionDescription == "BILLED FINANCE CHARGES") {
              bills += transaction.transactionAmount
            }
            if (transaction.transactionDescription == "APPLE SOUTH ASIA PTE LTD SINGAP(009:012)") {
              lifestyle += transaction.transactionAmount
            }
            if (transaction.transactionDescription == "GST ON ANNUAL MEMBERSHIP FEE") {
              taxes += transaction.transactionAmount
            }
            if (transaction.transactionDescription == "ANNUAL MEMBERSHIP FEE") {
              recurringfees += transaction.transactionAmount
            }
            
          }
          obj["category"] = 'Amount'
          obj["Food"] = food
          obj["Bills"] = bills
          obj["Lifestyle"] = lifestyle
          obj["Taxes"] = taxes
          obj["RecurringFees"] = recurringfees
          console.log(obj)
          expensesService.transactioncategories.push(obj)
          console.log(expensesService.transactioncategories)

          expensesService.pieChartData = Object.entries(obj);
          console.log(expensesService.pieChartData)

          expensesService.pieChart = {
            chartType: 'PieChart',
            dataTable: expensesService.pieChartData,
            //opt_firstRowIsData: true,
            options: {
              height: 600,
              width: '100%',
              is3D: true
            },
          };

          // loadSimplePieChart()
        });
  
        res.on("error", function (error) {
          console.error(error);
        });
      });
  
      req.end();
    }
  }

  ngOnInit() {
  }

}
