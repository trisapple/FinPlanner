import { Component, OnInit } from '@angular/core';
import { ExpensesService } from '../../expenses.service';
import { UserService } from 'src/app/user.service';

@Component({
  selector: 'app-stocks',
  templateUrl: './stocks.page.html',
  styleUrls: ['./stocks.page.scss'],
})
export class StocksPage implements OnInit {

  constructor(private expensesService: ExpensesService, private userService: UserService) {

    var https = require('follow-redirects').https;
  
    var options = {
      'method': 'GET',
      'hostname': 'www.alphavantage.co',
      'path': '/query?function=GLOBAL_QUOTE&symbol=MSFT&interval=5min&apikey=JDK7QWBWHQDIT41Y',
      'headers': {
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
        console.log (JSON.parse(body.toString())["Global Quote"])

        expensesService.msftStocks = JSON.parse(body.toString())["Global Quote"]

        // var msft = {}

        // msft["latestTradingDay"] = JSON.parse(body.toString())["Global Quote"]["07. latest trading day"]
        // msft["open"] = JSON.parse(body.toString())["Global Quote"]["02. open"]
        // msft["high"] = JSON.parse(body.toString())["Global Quote"]["03. high"]
        // msft["low"] = JSON.parse(body.toString())["Global Quote"]["04. low"]
        // msft["close"] = JSON.parse(body.toString())["Global Quote"]["08. previous close"]
        // msft["volume"] = JSON.parse(body.toString())["Global Quote"]["06. volume"]

        // expensesService.msftStocks.push(msft)
        // console.log(expensesService.msftStocks)
      });

      res.on("error", function (error) {
        console.error(error);
      });
    });

    req.end();

      var https = require('follow-redirects').https;

      var options = {
        'method': 'GET',
        'hostname': 'www.alphavantage.co',
        'path': '/query?function=GLOBAL_QUOTE&symbol=TSLA&interval=5min&apikey=JDK7QWBWHQDIT41Y',
        'headers': {
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
          console.log (JSON.parse(body.toString())["Global Quote"])

          expensesService.teslaStocks = JSON.parse(body.toString())["Global Quote"]
       
        });

        res.on("error", function (error) {
          console.error(error);
        });
      });

      req.end();
    }

  ngOnInit() {
  }

}
