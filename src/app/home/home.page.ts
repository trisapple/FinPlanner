import { Component } from '@angular/core';
import { NavController, MenuController } from '@ionic/angular';
import { Router } from '@angular/router';
import { LoginPage } from '../login/login.page';
import { Request } from 'request'

declare var require: any

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor(public navCtrl: NavController, private router: Router, private menu: MenuController, public request: Request) {}

  login() {
    // this.navCtrl.setRoot(anOtherPage);
    //this.router.navigateByUrl('/login')
    this.navCtrl.navigateForward('/login')
  }

  citiconnect() {
    
    var request = require('request');
    var options = {
      'method': 'GET',
      'url': 'https://sandbox.apihub.citi.com/gcb/api/authCode/oauth2/authorize?response_type=code&client_id=312e4cd1-c0c4-4675-9d22-c624d672982c&scope=accounts_details_transactions&countryCode=SG&businessCode=GCB&locale=en_SG&state=12093&redirect_uri=http://localhost:8100',
      'headers': {
        'Accept': 'application/json',
        'Cookie': 'RSA=164292451157170727520200729230711; CITI_SITE=gtdc; bizToken=fU2UtG1g/AI3JOqozWsTWkpiT9WhJwTX6VEA7KVJYStvXsBe/bJYuBCltpb6fjNrrpyNQvfhu79O3O8ZnQchXSGf35FKcMTX2DeZL3uIoPu7wr8+7KmPSSzipBMzyXxgoFmg4C4kDc9BrI7l90mgcEFbrdOZCuKcrgl9CYY59EK+yurqvFtwgYpitFFTIGX1WiLqSt7VIXZMPgNmen1dLlGkFnlxSE3CFqqFIuQW6ClDmyj3jTHxCyU/Ekcl9rbj72U8n0rcCXvGoyNup6FxPiBW2n5ICSI7p8yMLn+HentBjKsrGksl1tCrdBjz8t3M+qvQvF/RW1ckJO46EiYz9spF1G132H73c3zyBBOc5lVyZ2HzjkwKYifkE2DTiDr5tQPyUBkfy/AaaJiGY0Yw8MwK8HM+YbcRWYxdXwi9WleOuW0F5+Ug/FzLx16MZx3LVHh7qcsgwqRAxgM1nOKR9RqOdRyxvVrmp52bh0lie5Q='
      }
    };
    request(options, function (error, response) {
      if (error) throw new Error(error);
      console.log(response.body);
    });
  }

}
