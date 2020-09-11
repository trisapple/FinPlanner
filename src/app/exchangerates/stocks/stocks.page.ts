import { Component, OnInit } from '@angular/core';
// import { AlphaVantageAPI } from 'alpha-vantage-cli';
import { ExpensesService } from '../../expenses.service';
import { UserService } from 'src/app/user.service';

@Component({
  selector: 'app-stocks',
  templateUrl: './stocks.page.html',
  styleUrls: ['./stocks.page.scss'],
})
export class StocksPage implements OnInit {

  // av(){
  //   var AlphaVantageAPI = require('alpha-vantage-cli').AlphaVantageAPI;

  //   var yourApiKey = 'L5345HVJSEBMJTHF';
  //   var alphaVantageAPI = new AlphaVantageAPI(yourApiKey, 'compact', true);

  //   alphaVantageAPI.getDailyData('MSFT')
  //       .then(dailyData => {
  //           console.log("Daily data:");
  //           console.log(dailyData);
  //       })
  //       .catch(err => {
  //           console.error(err);
  //       });
  // }

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
      
    // function msft() {
    //   var https = require('follow-redirects').https;

    //   var options = {
    //     'method': 'GET',
    //     'hostname': 'www.alphavantage.co',
    //     'path': '/query?function=TIME_SERIES_INTRADAY&symbol=MSFT&interval=5min&apikey=JDK7QWBWHQDIT41Y',
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
    //       console.log (JSON.parse(body.toString())["Time Series (5min)"])
    //       // expensesService.msftStocks = JSON.parse(body.toString())["Time Series (5min)"]
          
          
    //       var msft = {}
    //       msft["lastRefreshedDate"] = JSON.parse(body.toString())["Meta Data"]["3. Last Refreshed"]
    //       msft["open"] = JSON.parse(body.toString())["Time Series (5min)"]["2020-09-09 20:00:00"]["1. open"]
    //       msft["high"] = JSON.parse(body.toString())["Time Series (5min)"]["2020-09-09 20:00:00"]["2. high"]
    //       msft["low"] = JSON.parse(body.toString())["Time Series (5min)"]["2020-09-09 20:00:00"]["3. low"]
    //       msft["close"] = JSON.parse(body.toString())["Time Series (5min)"]["2020-09-09 20:00:00"]["4. close"]
    //       msft["volume"] = JSON.parse(body.toString())["Time Series (5min)"]["2020-09-09 20:00:00"]["5. volume"]
         

    //       expensesService.msftStocks.push(msft)
    //       console.log(expensesService.msftStocks)

          
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
