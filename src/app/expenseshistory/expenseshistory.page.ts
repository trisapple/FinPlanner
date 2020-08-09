import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';

@Component({
  selector: 'app-expenseshistory',
  templateUrl: './expenseshistory.page.html',
  styleUrls: ['./expenseshistory.page.scss'],
})
export class ExpenseshistoryPage implements OnInit {

  constructor(public userService: UserService) {
    retrieveCitiTransactions()
    function retrieveCitiTransactions() {
      var https = require('follow-redirects').https;
  
      var options = {
        'method': 'GET',
        'hostname': 'sandbox.apihub.citi.com',
        'path': '/gcb/api/v1/accounts/' + userService.transactionhistoryaccountId + '/transactions',
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
          userService.transactions = JSON.parse(body.toString())["transaction"]
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
