import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../user.service';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  // public authorisationCode = ''
  // public accessToken = ''

  constructor(public navCtrl: NavController, private activatedRoute: ActivatedRoute, private userService: UserService) {
    console.log(this.userService.authorisationCode)
    if (!this.userService.authorisationCode) {
      this.userService.authorisationCode = this.activatedRoute.snapshot.queryParams['code'];
    }
    console.log(this.userService.authorisationCode)

    if (this.userService.authorisationCode && !this.userService.accessToken) {
      
      var https = require('follow-redirects').https;
      // var fs = require('fs');
      
      var qs = require('querystring');
      
      var options = {
        'method': 'POST',
        'hostname': 'sandbox.apihub.citi.com',
        'path': '/gcb/api/authCode/oauth2/token/sg/gcb',
        'headers': {
          'Accept': 'application/json',
          'Authorization': 'Basic MDU0NTE4NjUtN2QzOS00NzA0LWI0OTUtODAzZjExZDJkZDA5OlY4a1QybVM1eVkyeUE0aEM2YkU4YUMyZUU3Y0U1Z0w4dkIydUQxakcxcUw1ZUUyYlgx',
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
        'redirect_uri': 'http://ionicfirebase-a8213.web.app'
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
        'path': '/gcb/api/v1/accounts/5557596e6f556132725970397479356a4e66504f4638516772434d4663784176616174663332366b4739383d/transactions',
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
    window.open("https://sandbox.apihub.citi.com/gcb/api/authCode/oauth2/authorize?response_type=code&client_id=05451865-7d39-4704-b495-803f11d2dd09&scope=accounts_details_transactions&countryCode=SG&businessCode=GCB&locale=en_SG&state=12093&redirect_uri=http://ionicfirebase-a8213.web.app", "_blank");
  }

  dbsconnect() {
    window.open("https://www.dbs.com/sandbox/api/sg/v1/oauth/authorize?client_id=75fd953a-e032-4525-8deb-ca0800a2c08c&scope=Read&response_type=code&redirect_uri=http://localhost:8100", "_blank");
  }
}
    
