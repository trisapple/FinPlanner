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

  public items: any = [];

  expandItem(item): void {

    // Can expand as many ion-items the user wishes at any one time
    // item.expanded = !item.expanded

    // Only 1 ion-item can be expanded at any one time
    if (item.expanded) {
      item.expanded = false;
    } else {
      for (let each of this.expensesService.citiAccounts) {
        each["accounts"].map(listItem => {
          if (item == listItem) {
            listItem.expanded = !listItem.expanded;
          } else {
            listItem.expanded = false;
          }
          return listItem;
        });
      }
      this.expensesService.ocbcAccounts.map(listItem => {
        if (item == listItem) {
          listItem.expanded = !listItem.expanded;
        } else {
          listItem.expanded = false;
        }
        return listItem;
      });
    }
  }

  constructor(public navCtrl: NavController, private activatedRoute: ActivatedRoute, private userService: UserService, private expensesService: ExpensesService) {

    this.items = [
      { productName: "Test", expanded: false },
      { expanded: false }
    ];

    if (userService.citiLogin == true) {

      // Check if the accounts have loaded. 
      // If not, get the users accounts. 
      // If loaded, do not get the users accounts again.
      // This check is to prevent the accounts from loading twice resulting in duplicates being displayed.
      if (expensesService.accountsloaded == false) {
        allaccountsummary()
      }

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
            'Authorization': 'Bearer ' + userService.citiaccessToken
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
            var accountGroupSummary = JSON.parse(body.toString())["accountGroupSummary"] // Account Groups and accounts

            // Loop through the account groups and its associated information
            for (let each of accountGroupSummary) {

              // Our own temporary Object will have two keys, accountGroup and accounts. 
              // It will then be added into the expensesService.accountGroups array once we had collected all the info for that accountGroup
              var accountGroup = {}

              // The 'if' is to display the account group and its following accounts. If not included, it will not be displayed. 
              if (each.accountGroup == "SAVINGS_AND_INVESTMENTS") {
                accountGroup["accountGroup"] = "Savings and Investments" // Display the accountGroup in a neater manner, removing underscores and capitalising only on the first letter
              }
              if (each.accountGroup == "CREDIT_CARD") {
                accountGroup["accountGroup"] = "Credit Cards"
              }
              if (each.accountGroup == "CHECKING") {
                accountGroup["accountGroup"] = "Checking"
              }
              if (each.accountGroup == "LOANS") {
                accountGroup["accountGroup"] = "Loans"
              }
              if (each.accountGroup == "INSURANCE") {
                accountGroup["accountGroup"] = "Insurance"
              }
              // else {
              //   expensesService.accountGroups.push(each.accountGroup)
              // }

              var accounts = [] // This accounts array will temporarily store the accounts associated with the accountGroup
              if (accountGroup["accountGroup"] == "Insurance") {
                // Loop through the accounts in the accountGroup and add it to the temporary accounts array
                for (let account of each.insurancePolicies) {
                  console.log(account)
                  accounts.push(account)
                }
              } else {
                // Loop through the accounts in the accountGroup and add it to the temporary accounts array
                for (let account of each.accounts) {
                  console.log(account);
                  var values: Object = Object.values(account); // Get account information and exclude the key in the Object
                  values[0]["expanded"] = false
                  accounts.push(values[0]); // Add it to the expensesService.accounts array. values[0] as there is one array in an array. We don't want to make the array a nested array.
                }
              }
              accountGroup["accounts"] = accounts // Add the accounts into the "accounts" key of our temporary accountGroup object
              expensesService.citiAccounts.push(accountGroup) // Add our temporary accountGroup Object comprising the accountGroup and the associated accounts into our array
              console.log(expensesService.citiAccounts);
            }
          });

          res.on("error", function (error) {
            console.error(error);
          });
        });

        req.end();
      }
    }
    if (userService.ocbcLogin == true) {

      if (expensesService.ocbcaccountsloaded == false) {
        ocbcaccountsummary()
      }

      function ocbcaccountsummary() {
        var https = require('follow-redirects').https;

        var options = {
          'method': 'GET',
          'hostname': 'api.ocbc.com',
          'port': 8243,
          'path': '/transactional/creditcardlisting/1.0',
          'headers': {
            'Authorization': 'Bearer e9907b0acea2e822d906e1e9e0db8330',
            'Cookie': 'visid_incap_1634122=z3xtAN2xSiSHYiaqILb6yDSYPl8AAAAAQUIPAAAAAACwkEV6njlIOeQyUjtckt9o; nlbi_1634122=B5NSf4KDuGB8wZN6ZPv8YwAAAADP/vVam6LDQQ9qBxTbwi5q; incap_ses_944_1634122=1WzXBzs+FijsJKvlFsMZDUxGP18AAAAA2LYhS6z1dLGagQqp1SrUHA=='
          },
          'maxRedirects': 20
        };

        var req = https.request(options, function (res) {
          var chunks = [];

          res.on("data", function (chunk) {
            chunks.push(chunk);
          });

          res.on("end", function (chunk) {
            expensesService.ocbcaccountsloaded = true // Set the accountsloaded to variable to true (indicate that the accounts have been loaded)
            var body = Buffer.concat(chunks);
            console.log(body.toString());
            console.log(JSON.parse(body.toString()))
            console.log(JSON.parse(body.toString())["result"])
            expensesService.ocbcAccounts = JSON.parse(body.toString())["result"]

            for (let each of expensesService.ocbcAccounts) { // The 'ocbcAccounts' will be looped through
              each["expanded"] = false;
            }
            console.log(expensesService.ocbcAccounts)
          });
          res.on("error", function (error) {
            console.error(error);
          });
        });

        req.end();
      }
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

  // Onclick to next page, passing account information to the next page
  spendinginsights(account) {
    this.expensesService.transactionhistorytitle = account.productName
    this.expensesService.transactionhistoryaccountId = account.accountId // Store the account id in a global variable so that the next page can fetch the transaction details and show the expenses summary
    this.navCtrl.navigateForward(['/accounts/spendinginsights']); // Navigate to the next page
  }
}
