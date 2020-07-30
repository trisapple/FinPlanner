import { Component } from '@angular/core';
import { NavController, MenuController } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { LoginPage } from '../login/login.page';
// import request = require('request')


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  authorisationCode = ''

  constructor(public navCtrl: NavController, private router: Router, private menu: MenuController, private activatedRoute: ActivatedRoute) {
    this.activatedRoute.queryParams.subscribe(params => {
      this.authorisationCode = params['code'];
      console.log(this.authorisationCode);
    });
  }

  ngOnInit() {

  }

  login() {
    // this.navCtrl.setRoot(anOtherPage);
    //this.router.navigateByUrl('/login')
    this.navCtrl.navigateForward('/login')
  }

  citiconnect() {
    window.open("https://sandbox.apihub.citi.com/gcb/api/authCode/oauth2/authorize?response_type=code&client_id=312e4cd1-c0c4-4675-9d22-c624d672982c&scope=accounts_details_transactions&countryCode=SG&businessCode=GCB&locale=en_SG&state=12093&redirect_uri=http://localhost:8100", "_blank");

    // var https = require('follow-redirects').https;
    // // var fs = require('fs');
    
    // var options = {
    //   'method': 'GET',
    //   'hostname': 'sandbox.apihub.citi.com',
    //   'path': '/gcb/api/authCode/oauth2/authorize?response_type=code&client_id=312e4cd1-c0c4-4675-9d22-c624d672982c&scope=accounts_details_transactions&countryCode=SG&businessCode=GCB&locale=en_SG&state=12093&redirect_uri=http%3A%2F%2Flocalhost%3A8100',
    //   'headers': {
    //     'Accept': 'application/json',
    //     'Cookie': 'RSA=164292451157170727520200729230711; CITI_SITE=gtdc; bizToken=fU2UtG1g/AI3JOqozWsTWkpiT9WhJwTX6VEA7KVJYStvXsBe/bJYuBCltpb6fjNrrpyNQvfhu79O3O8ZnQchXSGf35FKcMTX2DeZL3uIoPu7wr8+7KmPSSzipBMzyXxgoFmg4C4kDc9BrI7l90mgcEFbrdOZCuKcrgl9CYY59EK+yurqvFtwgYpitFFTIGX1WiLqSt7VIXZMPgNmen1dLlGkFnlxSE3CFqqFIuQW6ClDmyj3jTHxCyU/Ekcl9rbj72U8n0rcCXvGoyNup6FxPiBW2n5ICSI7p8yMLn+HentBjKsrGksl1tCrdBjz8t3M+qvQvF/RW1ckJO46EiYz9spF1G132H73c3zyBBOc5lVyZ2HzjkwKYifkE2DTiDr5tQPyUBkfy/AaaJiGY0Yw8MwK8HM+YbcRWYxdXwi9WleOuW0F5+Ug/FzLx16MZx3LVHh7qcsgwqRAxgM1nOKR9RqOdRyxvVrmp52bh0lie5Q='
    //   },
    //   'maxRedirects': 20
    // };
    
    // var req = https.request(options, function (res) {
    //   var chunks = [];
    
    //   res.on("data", function (chunk) {
    //     chunks.push(chunk);
    //   });
    
    //   res.on("end", function (chunk) {
    //     var body = Buffer.concat(chunks);
    //     console.log(body.toString());
    //   });
    
    //   res.on("error", function (error) {
    //     console.error(error);
    //   });
    // });
    
    // req.end();
  }
}
    
