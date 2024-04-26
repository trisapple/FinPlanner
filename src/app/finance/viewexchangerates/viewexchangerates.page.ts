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
  constructor(public newsService: NewsService, private expensesService: ExpensesService, private userService: UserService, private router: Router, private route: ActivatedRoute) {
    // Accessing data
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.params = this.router.getCurrentNavigation().extras.state.symbol;
      }

      var https = require('follow-redirects').https;

      var options = {
        'method': 'GET',
        'hostname': 'api.apilayer.com',
        'path': '/exchangerates_data/latest?base=SGD&apikey=Q7wykoBFz1RleS21bUcgS9OvubCoxEnC',
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

          var req = https.request(options, (res) => {
            var chunks = [];

            res.on("data", function (chunk) {
              chunks.push(chunk);
            });

            res.on("end", (chunk) => {
              var body = Buffer.concat(chunks);
              console.log(JSON.parse(body.toString())["Global Quote"])

              expensesService.Stocks = JSON.parse(body.toString())["Global Quote"]

              this.newsService.getData(`search?q=${this.params.symbol}&sortBy=publishedAt&lang=en`)
              // var https = require('follow-redirects').https;

              // var options = {
              //   'method': 'GET',
              //   'hostname': 'hello-world-holy-cherry-49c2.tristanchng.workers.dev',
              //   'path': `/https://newsapi.org/v2/everything?q=${this.params.symbol}&apiKey=fc0c0278121d401e87dbdf8933565a66`,
              //   'headers': {
              //     'x-cors-proxy-api-key': 'EZWTLwVEqFnaycMzdhBz',
              //     'Origin': ''
              //   },
              //   'maxRedirects': 20
              // };

              // var req = https.request(options, (res) => {
              //   var chunks = [];

              //   res.on("data", function (chunk) {
              //     chunks.push(chunk);
              //   });

              //   res.on("end", (chunk) => {
              //     var body = Buffer.concat(chunks);
              //     console.log(JSON.parse(body.toString()));

              //     newsService.articles = JSON.parse(body.toString())["articles"]
              //   });

              //   res.on("error", function (error) {
              //     console.error(error);
              //   });
              // });

              req.end();

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
