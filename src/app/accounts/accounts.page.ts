import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../user.service';
import { ExpensesService } from '../expenses.service';

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.page.html',
  styleUrls: ['./accounts.page.scss'],
})
export class AccountsPage implements OnInit {
  
  constructor(public navCtrl: NavController, private activatedRoute: ActivatedRoute, private userService: UserService, private expensesService: ExpensesService) { 
    
    // Check if the accounts have loaded. 
    // If not, get the users accounts. 
    // If loaded, do not get the users accounts again.
    // This check is to prevent the accounts from loading twice resulting in duplicates being displayed.
    if (expensesService.accountsloaded == false) {
      allaccountsummary()
    }
    
    // retrieveCitiTransactions()
    // function retrieveCitiTransactions() {
    //   var https = require('follow-redirects').https;
  
    //   var options = {
    //     'method': 'GET',
    //     'hostname': 'sandbox.apihub.citi.com',
    //     'path': '/gcb/api/v1/accounts/5557596e6f556132725970397479356a4e66504f4638516772434d4663784176616174663332366b4739383d/transactions',
    //     'headers': {
    //       'Accept': 'application/json',
    //       'client_id': '05451865-7d39-4704-b495-803f11d2dd09',
    //       'uuid': 'aae5acdc-f196-48c7-8d10-e027ffd54552',
    //       'Authorization': 'Bearer ' + userService.accessToken,
    //       'Cookie': 'RSA=164292451157170727520200729230711; RSA=164292451157170727520200729230711; RSA=164292451157170727520200729230711; CITI_SITE=gtdc'
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
    //       // console.log(JSON.parse(body.toString())["transaction"])
    //       userService.transactions = JSON.parse(body.toString())["transaction"]
    //     });
  
    //     res.on("error", function (error) {
    //       console.error(error);
    //     });
    //   });
  
    //   req.end();
    // }

    function allaccountsummary() {
      var https = require('follow-redirects').https;

      var options = {
        'method': 'GET',
        'hostname': 'sandbox.apihub.citi.com',
        'path': '/gcb/api/v1/accounts',
        'headers': {
          'client_id': '05451865-7d39-4704-b495-803f11d2dd09',
          'uuid': '4c2b46cb-4e2b-4add-bae1-bf86208446a8',
          'Accept': 'application/json',
          'Authorization': 'Bearer ' + userService.accessToken
        },
        'maxRedirects': 20
      };

      var req = https.request(options, function (res) {
        var chunks = [];

        res.on("data", function (chunk) {
          chunks.push(chunk);
        });

        res.on("end", function (chunk) {
          expensesService.accountsloaded = true // Set the accountsloaded to variable to true (indicate that the accounts have been loaded)
          var body = Buffer.concat(chunks);
          console.log(body.toString());
          console.log(JSON.parse(body.toString())["accountGroupSummary"])
          expensesService.allaccounts = JSON.parse(body.toString())["accountGroupSummary"] // Account Groups and accounts

          // Loop through the account groups and its associated information
          for (let each of expensesService.allaccounts) {
            // The 'if' is to display the account group and its following accounts. If not included, it will not be displayed. 
            // For now, the expensesService.accountGroups array will only have one category.
            if (each.accountGroup == "SAVINGS_AND_INVESTMENTS") {
              expensesService.accountGroups.push("Savings and Investments")
            }
            if (each.accountGroup == "CREDIT_CARD") {
              expensesService.accountGroups.push("Credit Cards");
            }
            if (each.accountGroup == "CHECKING") {
              expensesService.accountGroups.push("Checking");
            }
            if (each.accountGroup == "LOANS") {
              expensesService.accountGroups.push("Loans");
            }
            // else {
            //   expensesService.accountGroups.push(each.accountGroup)
            // }

            // Loop through the accounts in the account group
            for (let account of each.accounts) {
              console.log(account);
              var values = Object.values(account); // Get account information
              expensesService.accounts.push(values); // Add it to the expensesService.accounts array
              console.log(values)
              console.log(values[0]["productName"]);
              // console.log(Object.values(values))

              // for (let i of account) {
              //   console.log(i)
              //   expensesService.accounts.push(i)
              // }
            }
            console.log(expensesService.accountGroups);
            console.log(expensesService.accounts);
          }

          // var accounts = Object.keys(JSON.parse(body.toString())["accountGroupSummary"][0]["accounts"])
          // accounts.forEach(element => {
          //   var key = Object.keys(JSON.parse(body.toString())["accountGroupSummary"][0]["accounts"][element])
          //   console.log(key)
          //   console.log(key[0])
          //   // userService.accountsummaryName = key[0]
          //   userService.accountsummaryArray.push(key[0])
          //   console.log(userService.accountsummaryArray)
          // });

          // var key = Object.keys(JSON.parse(body.toString())["accountGroupSummary"][0]["accounts"][0])
          // userService.accountsummaryName = key[0]
          // console.log(JSON.parse(body.toString())["accountGroupSummary"][0]["accounts"][0][key[0]].productName)
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

  // Redirect users to Citibank Login when user clicks on the 'Connect' Button
  citiconnect() {
    window.open("https://sandbox.apihub.citi.com/gcb/api/authCode/oauth2/authorize?response_type=code&client_id=05451865-7d39-4704-b495-803f11d2dd09&scope=accounts_details_transactions&countryCode=SG&businessCode=GCB&locale=en_SG&state=12093&redirect_uri=http://ionicfirebase-a8213.web.app", "_blank");
  }

  // Redirect users to OCBC Login when user clicks on the 'Connect' Button
  ocbcconnect() {
    window.open("https://api.ocbc.com/ocbcauthentication/api/oauth2/authorize?client_id=Bdf48cJM_OdAilo6j_kBn_PhQLwa&redirect_uri=https://ionicfirebase-a8213.web.app/&scope=transactional", "_blank");
  }

  // Onclick on list item to display account name and transaction history
  // Passing the account name and account id as a global variable to be accessed in the next screen
  transactionhistory(account) {
    console.log(account);
    this.expensesService.transactionhistorytitle = account.productName;
    this.expensesService.transactionhistoryaccountId = account.accountId;
    this.navCtrl.navigateForward(['/accounts/transactionhistory']);
  }

}
