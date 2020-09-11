import { Component, OnInit } from '@angular/core';
import { ExpensesService } from '../../expenses.service';

@Component({
  selector: 'app-fxrates',
  templateUrl: './fxrates.page.html',
  styleUrls: ['./fxrates.page.scss'],
})
export class FxratesPage implements OnInit {

  constructor(private expensesService: ExpensesService) {

      var https = require('follow-redirects').https;

      var options = {
        'method': 'GET',
        'hostname': 'www.alphavantage.co',
        'path': '/query?function=CURRENCY_EXCHANGE_RATE&from_currency=USD&to_currency=SGD&apikey=JDK7QWBWHQDIT41Y',
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

          expensesService.fxrates = JSON.parse(body.toString())["Realtime Currency Exchange Rate"]
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
