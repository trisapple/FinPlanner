import { Component, OnInit } from '@angular/core';
import { AlphaVantageAPI } from 'alpha-vantage-cli';


@Component({
  selector: 'app-stocks',
  templateUrl: './stocks.page.html',
  styleUrls: ['./stocks.page.scss'],
})
export class StocksPage implements OnInit {

  av(){
    var AlphaVantageAPI = require('alpha-vantage-cli').AlphaVantageAPI;

    var yourApiKey = 'L5345HVJSEBMJTHF';
    var alphaVantageAPI = new AlphaVantageAPI(yourApiKey, 'compact', true);

    alphaVantageAPI.getDailyData('MSFT')
        .then(dailyData => {
            console.log("Daily data:");
            console.log(dailyData);
        })
        .catch(err => {
            console.error(err);
        });
  }

  constructor() { 

  }

  ngOnInit() {
  }

}
