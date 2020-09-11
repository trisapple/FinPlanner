import { Component, OnInit } from '@angular/core';
import { ExpensesService } from '../../expenses.service';

@Component({
  selector: 'app-crypto',
  templateUrl: './crypto.page.html',
  styleUrls: ['./crypto.page.scss'],
})
export class CryptoPage implements OnInit {

  constructor(private expensesService: ExpensesService) {

    if (expensesService.exchangeRatesLoaded == false) {
      crypto()
    }

    function crypto() {
      var https = require('follow-redirects').https;

      var options = {
        'method': 'GET',
        'hostname': 'www.alphavantage.co',
        'path': '/query?function=CURRENCY_EXCHANGE_RATE&from_currency=BTC&to_currency=USD&apikey=JDK7QWBWHQDIT41Y',
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
          console.log (JSON.parse(body.toString())["Realtime Currency Exchange Rate"])

          expensesService.crypto = JSON.parse(body.toString())["Realtime Currency Exchange Rate"]
        });

        res.on("error", function (error) {
          console.error(error);
        });
      });

      req.end();
    }

    // if (expensesService.cryptoloaded == false) {
    //   cryptoSGD()
    // }

    // function cryptoSGD() {
    //   var https = require('follow-redirects').https;

    //   var options = {
    //     'method': 'GET',
    //     'hostname': 'www.alphavantage.co',
    //     'path': '/query?function=CURRENCY_EXCHANGE_RATE&from_currency=BTC&to_currency=SGD&apikey=JDK7QWBWHQDIT41Y',
    //     'headers': {
    //     },
    //     'maxRedirects': 20
    //   };

    //   var req = https.request(options, function (res) {
    //     var chunks = [];

    //     res.on("data", function (chunk) {
    //       chunks.push(chunk);
    //     });

    //     res.on("end", function (chunk) {
    //       var body = Buffer.concat(chunks);
    //       // console.log(body.toString());
    //       console.log (JSON.parse(body.toString())["Realtime Currency Exchange Rate"])

    //       expensesService.cryptoSG = JSON.parse(body.toString())["Realtime Currency Exchange Rate"]
    //     });

    //     res.on("error", function (error) {
    //       console.error(error);
    //     });
    //   });

    //   req.end();
    // }

  }

  ngOnInit() {
  }

}
