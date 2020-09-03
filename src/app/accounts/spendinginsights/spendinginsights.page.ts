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

    // Citibank's Spending Insights 
    if (userService.citiLogin == true) {
      retrieveCitiTransactions() // Get the transaction history for the selected account

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
            'Authorization': 'Bearer ' + userService.citiaccessToken,
            'Cookie': 'RSA=164292451157170727520200729230711; RSA=164292451157170727520200729230711; RSA=164292451157170727520200729230711; CITI_SITE=gtdc'
          },
          'maxRedirects': 20
        };
    
        var req = https.request(options, function (res) {
          var chunks = [];
    
          res.on("data", function (chunk) {
            chunks.push(chunk);
          });
    
          // After the request is finished (whether failure or success), the codes inside there will run
          res.on("end", function (chunk) {
            var body = Buffer.concat(chunks);
            // console.log(body.toString());
            // console.log(JSON.parse(body.toString())["transaction"])
            expensesService.transactions = JSON.parse(body.toString())["transaction"] // Get the first 50 transactions for the account
            console.log(expensesService.transactions)

            // expensesService.transactioncategories = [] // Empty the array as the user switches accounts

            // Variables to keep track of the amount spent in the transaction categories
            var obj = {} // Set up an empty Object
            var food = 0
            var bills = 0
            var lifestyle = 0
            var taxes = 0
            var recurringfees = 0
            var others = 0
            expensesService.total = 0

            // Loop through the list of transactions. Based on the transaction description, add the transaction amount to the categories accordingly. 
            for (let transaction of expensesService.transactions) {
              // If the transaction description is "COLD STORAGE-EASTWOOD" or "COLD STORAGE-EASTWOOD SINGAPORE SG", add the transaction amount to the food variable. 
              if (transaction.transactionDescription == "COLD STORAGE-EASTWOOD" || transaction.transactionDescription == "COLD STORAGE-EASTWOOD SINGAPORE SG") {
                food += transaction.transactionAmount
              }
              // If the transaction description is "BILLED FINANCE CHARGES", add the transaction amount to the bills variable. 
              else if (transaction.transactionDescription == "BILLED FINANCE CHARGES") {
                bills += transaction.transactionAmount
              }
              else if (transaction.transactionDescription == "APPLE SOUTH ASIA PTE LTD SINGAP(009:012)") {
                lifestyle += transaction.transactionAmount
              }
              else if (transaction.transactionDescription == "GST ON ANNUAL MEMBERSHIP FEE") {
                taxes += transaction.transactionAmount
              }
              else if (transaction.transactionDescription == "ANNUAL MEMBERSHIP FEE") {
                recurringfees += transaction.transactionAmount
              }
              else {
                others += transaction.transactionAmount
              }
              expensesService.total += transaction.transactionAmount // Add up the amounts of all the transactions (regardless of name or description)
            }

            // Assign the empty Object key value pairs to display the information in HTML
            obj["category"] = 'Amount'
            obj["Food"] = food
            obj["Bills"] = bills
            obj["Lifestyle"] = lifestyle
            obj["Taxes"] = taxes
            obj["Recurring Fees"] = recurringfees
            obj["Others"] = others

            // obj["Total"] = total

            console.log(obj)
            // expensesService.transactioncategories.push(obj) // Push the object into an array
            // console.log(expensesService.transactioncategories)

            expensesService.pieChartData = Object.entries(obj); // Make the key value pairs in the object into an array (to put into google chart dataTable)
            // {{"category": "Amount"}, {"Food": 83.65}, ...} becomes 
            // [["category", "Amount"], ["Food", 83.65], ... ]

            // Create another array for the progress bar because we need to remove the obj["category"] = 'Amount' at the beginning
            expensesService.pieChartData2 = Object.entries(obj);
            expensesService.pieChartData2.shift() // Remove the obj["category"] = 'Amount' at the beginning

            // Sort the top expenses categories in descending order (from largest to smallest)
            expensesService.pieChartData2.sort(function(a,b) {
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
                backgroundColor: { fill:'transparent' },
                legend: {textStyle: {color: 'gray'}}
              },
            };
          });
    
          res.on("error", function (error) {
            console.error(error);
          });
        });
    
        req.end();
      }
    }

    // OCBC's Spending Insights 
    if (userService.ocbcLogin == true) {
      retrieveOCBCTransactions()

      function retrieveOCBCTransactions() {
        var https = require('follow-redirects').https;

        var options = {
          'method': 'GET',
          'hostname': 'api.ocbc.com',
          'port': 8243,
          'path': '/transactional/creditcardhistorybilled/1.0?cardId=' + expensesService.transactionhistoryaccountId + '&fromDate=24-04-2018&toDate=30-04-2018',
          'headers': {
            'Authorization': 'Bearer ' + userService.ocbcaccessToken,
            'Cookie': 'visid_incap_1634122=SRmhj8YhRvWQPojeLSlj4XtPMl8AAAAAQUIPAAAAAAAKZkRHRjUakyUf5nfcXdLl; nlbi_1634122=SFkScBc1uxeqgcSTZPv8YwAAAADI2TTkpbJ1KZC36SDns83U; incap_ses_500_1634122=ZORcdal0YVBiHAd3bFvwBvJvQl8AAAAApBy8NblTnJou6+AQus4cPQ=='
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
            expensesService.transactions = JSON.parse(body.toString())["results"]["creditCardTransactions"]["creditCardTransactionDetail"]
            if (expensesService.transactions.length == 0) { // If the array is empty
              expensesService.ocbcCreditCardTransaction = false; // False means there is no spending insights 
            }
            else { // If array is not empty 
              expensesService.ocbcCreditCardTransaction = true; // True means there are spending insights
            }
            console.log(expensesService.transactions.length)
            console.log(expensesService.ocbcCreditCardTransaction)

            var obj = {}
            var lifestyle = 0
            var food = 0
            var others = 0
            expensesService.total = 0

            for (let creditCardTransactionDetail of expensesService.transactions) {
              if (creditCardTransactionDetail.transactionDescription == "ROXXXXX-TRAINING SINGAPORE") {
                lifestyle += creditCardTransactionDetail.transactionAmount
              }
              else if (creditCardTransactionDetail.transactionDescription == "PRXXXXX SINGAPORE") {
                food += creditCardTransactionDetail.transactionAmount
              }
              else {
                others += creditCardTransactionDetail.transactionAmount
              }
              expensesService.total += creditCardTransactionDetail.transactionAmount 
            }

            obj["category"] = 'Amount'
            obj["Lifestyle"] = lifestyle
            obj["Food"] = food
            obj["Others"] = others

            console.log(obj)

            expensesService.pieChartData = Object.entries(obj); // Make the key value pairs in the object into an array (to put into google chart dataTable)
            // {{"category": "Amount"}, {"Food": 83.65}, ...} becomes 
            // [["category", "Amount"], ["Food", 83.65], ... ]

            // Create another array for the progress bar because we need to remove the obj["category"] = 'Amount' at the beginning
            expensesService.pieChartData2 = Object.entries(obj);
            expensesService.pieChartData2.shift() // Remove the obj["category"] = 'Amount' at the beginning

            // Sort the top expenses categories in descending order (from largest to smallest)
            expensesService.pieChartData2.sort(function(a,b) {
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
                backgroundColor: { fill:'transparent' },
                legend: {textStyle: {color: 'gray'}}
              },
            };
          });

          res.on("error", function (error) {
            console.error(error);
          });
        });

        req.end();
      }
    }
  }

  ngOnInit() {
  }

  view() {
    this.navCtrl.navigateForward(['/accounts/savingssuggestion']);
    console.log(this.view)
  }

}
