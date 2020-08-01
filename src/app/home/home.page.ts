import { Component } from '@angular/core';
import { NavController, MenuController } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { LoginPage } from '../login/login.page';
import { access } from 'fs';
import { UserService } from '../user.service';
// import request = require('request')


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  // public authorisationCode = ''
  // public accessToken = ''

  constructor(public navCtrl: NavController, private router: Router, private menu: MenuController, private activatedRoute: ActivatedRoute, private userService: UserService) {
    // this.activatedRoute.queryParams.subscribe(params => {
    //   this.authorisationCode = params['code'];
    //   console.log(this.authorisationCode);
    // });

    this.userService.authorisationCode = this.activatedRoute.snapshot.queryParams['code'];
    console.log(this.userService.authorisationCode)

    if (this.userService.authorisationCode) {
      
      var https = require('follow-redirects').https;
      // var fs = require('fs');
      
      var qs = require('querystring');
      
      var options = {
        'method': 'POST',
        'hostname': 'sandbox.apihub.citi.com',
        'path': '/gcb/api/authCode/oauth2/token/sg/gcb',
        'headers': {
          'Accept': 'application/json',
          'Authorization': 'Basic MzEyZTRjZDEtYzBjNC00Njc1LTlkMjItYzYyNGQ2NzI5ODJjOkU4a1cyd0g4Z1MzblgzYVI4Z1UzbUk0aFI2bkYzb1I1YUY2bkg2Z0g4a0YxaVA1Y1M0',
          'Content-Type': 'application/x-www-form-urlencoded',
          'Cookie': 'RSA=164292451157170727520200729230711; bizToken=fU2UtG1g/AI3JOqozWsTWkpiT9WhJwTX6VEA7KVJYStvXsBe/bJYuBCltpb6fjNrrpyNQvfhu79O3O8ZnQchXSGf35FKcMTX2DeZL3uIoPu7wr8+7KmPSSzipBMzyXxgoFmg4C4kDc9BrI7l90mgcEFbrdOZCuKcrgl9CYY59EK+yurqvFtwgYpitFFTIGX1WiLqSt7VIXZMPgNmen1dLlGkFnlxSE3CFqqFIuQW6ClDmyj3jTHxCyU/Ekcl9rbj72U8n0rcCXvGoyNup6FxPiBW2n5ICSI7p8yMLn+HentBjKsrGksl1tCrdBjz8t3M+qvQvF/RW1ckJO46EiYz9spF1G132H73c3zyBBOc5lVyZ2HzjkwKYifkE2DTiDr5tQPyUBkfy/AaaJiGY0Yw8MwK8HM+YbcRWYxdXwi9WleOuW0F5+Ug/FzLx16MZx3LVHh7qcsgwqRAxgM1nOKR9RqOdRyxvVrmp52bh0lie5Q=; CITI_SITE=gtdc'
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
          console.log(body.toString());
          console.log(JSON.parse(body.toString())["access_token"])
          userService.accessToken = (JSON.parse(body.toString())["access_token"])
          retrieveCitiTransactions()
        });
      
        res.on("error", function (error) {
          console.error(error);
        });
      });
      
      var postData = qs.stringify({
        'grant_type': 'authorization_code',
        'code': this.userService.authorisationCode,
        'redirect_uri': 'http://localhost:8100'
      });
      
      req.write(postData);
      
      req.end();
      console.log(postData)
    }

    function retrieveCitiTransactions() {
      var https = require('follow-redirects').https;
      // var fs = require('fs');
  
      var options = {
        'method': 'GET',
        'hostname': 'sandbox.apihub.citi.com',
        'path': '/gcb/api/v1/accounts/674d4a4f6a443741656e5a584a6f57665a444e685772393273615777397a4c665073305a5a2b51356f76513d/transactions',
        'headers': {
          'Accept': 'application/json',
          'client_id': '312e4cd1-c0c4-4675-9d22-c624d672982c',
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
          console.log(body.toString());
          console.log(JSON.parse(body.toString())["transaction"])
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

  citiconnect() {
    window.open("https://sandbox.apihub.citi.com/gcb/api/authCode/oauth2/authorize?response_type=code&client_id=312e4cd1-c0c4-4675-9d22-c624d672982c&scope=accounts_details_transactions&countryCode=SG&businessCode=GCB&locale=en_SG&state=12093&redirect_uri=http://localhost:8100", "_blank");
  }

  dbsconnect() {
    window.open("https://www.dbs.com/sandbox/api/sg/v1/oauth/authorize?client_id=75fd953a-e032-4525-8deb-ca0800a2c08c&scope=Read&response_type=code&redirect_uri=http://localhost:8100", "_blank");
  }

  codes() {
    console.log(this.userService.authorisationCode)
    console.log(this.userService.accessToken)
  }
}
    
