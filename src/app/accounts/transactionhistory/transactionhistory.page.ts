import { Component, OnInit } from '@angular/core';
import { UserService } from '../../user.service';
import { ExpensesService } from '../../expenses.service';

@Component({
  selector: 'app-transactionhistory',
  templateUrl: './transactionhistory.page.html',
  styleUrls: ['./transactionhistory.page.scss'],
})
export class TransactionHistoryPage implements OnInit {

  constructor(public userService: UserService, public expensesService: ExpensesService) {
    if (userService.citiLogin == true) {
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
    
          res.on("end", function (chunk) {
            var body = Buffer.concat(chunks);
            // console.log(body.toString());
            // console.log(JSON.parse(body.toString())["transaction"])
            expensesService.transactions = JSON.parse(body.toString())["transaction"] // Transactions List
            console.log(expensesService.transactions)
          });
    
          res.on("error", function (error) {
            console.error(error);
          });
        });
    
        req.end();
      }
    }
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
            'Authorization': 'Bearer e9907b0acea2e822d906e1e9e0db8330',
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

}
