import { Component, OnInit } from '@angular/core';
import { ExpensesService } from '../../expenses.service';
import { UserService } from 'src/app/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NewsService } from '../../news.service';


@Component({
  selector: 'app-viewexchangerates',
  templateUrl: './viewexchangerates.page.html',
  styleUrls: ['./viewexchangerates.page.scss'],
})
export class ViewexchangeratesPage {
  symbol: any;
  params: any;
  SGDtoUSDrate = 0
  constructor(private newsService: NewsService, private expensesService: ExpensesService, private userService: UserService, private router: Router, private route: ActivatedRoute) {
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.params = this.router.getCurrentNavigation().extras.state.symbol;
      }

      var https = require('follow-redirects').https;

      var options = {
        'method': 'GET',
        'hostname': 'api.exchangeratesapi.io',
        'path': '/latest?base=SGD',
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

          this.SGDtoUSDrate = JSON.parse(body.toString())["rates"]["USD"] // Get the price of USD for 1 SGD

          var https = require('follow-redirects').https;

          var options = {
            'method': 'GET',
            'hostname': 'www.alphavantage.co',
            'path': `/query?function=GLOBAL_QUOTE&symbol=${this.params.symbol}&interval=5min&apikey=JDK7QWBWHQDIT41Y`,
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
              console.log(JSON.parse(body.toString())["Global Quote"])

              expensesService.Stocks = JSON.parse(body.toString())["Global Quote"]

            });

            res.on("error", function (error) {
              console.error(error);
            });
          });

          req.end();
        });

        res.on("error", function (error) {
          console.error(error);
        });
      });

      req.end();


    });
  }
}
