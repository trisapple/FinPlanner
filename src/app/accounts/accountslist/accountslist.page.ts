import { Component } from '@angular/core';
import { ExpensesService } from 'src/app/expenses.service';
import { NavController, LoadingController, Platform } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/firestore';
import { UserService } from 'src/app/user.service';
import { SaltedgeService } from 'src/app/saltedge.service';
import { FingerprintAIO } from '@ionic-native/fingerprint-aio/ngx';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-accountslist',
  templateUrl: './accountslist.page.html',
  styleUrls: ['./accountslist.page.scss'],
})
export class AccountslistPage {

  balances = [] // currency Object to be pushed to this balances array (so that firebase can accept it)
  currency = {} // Aggregated currencies from all accounts in the salt edge connection
  balancescurrencycode = [] // currencycode Object to be pushed to this balancescurrencycode array (so that firebase can accept it)
  currencycode = {} // Aggregated currencies from all accounts in the salt edge connection (with currency symbol)

  transactionhistory(account) {
    console.log(account);

    this.storage.get('fingerprintTransactionHistory').then((val) => {
      console.log(val);
      if ((this.platform.is('hybrid')) && val == true) {
        this.faio.show({
          title: 'Biometric Authentication', // (Android Only) | optional | Default: "<APP_NAME> Biometric Sign On"
          subtitle: 'For Login Verification,', // (Android Only) | optional | Default: null
          description: 'Please authenticate', // optional | Default: null
          fallbackButtonTitle: 'Use Pin', // optional | When disableBackup is false defaults to "Use Pin".
          // When disableBackup is true defaults to "Cancel"
          disableBackup: true,  // optional | default: false
        }).then(() => {
          this.saltedgeService.saltedgeaccount = account // Set the account information to a global variable so that we could access it from anywhere
          this.expensesService.transactionhistorytitle = account.account_name; // Display account name on top menu bar
          this.saltedgeService.saltedgeaccountcurrencycode = account.currency_code // Set the currency code so that we could display the proper symbol
          this.navCtrl.navigateForward(['/accounts/transactionhistory']);
        })
          .catch((error: any) => console.log(error));
      } else {
        this.saltedgeService.saltedgeaccount = account // Set the account information to a global variable so that we could access it from anywhere
        this.expensesService.transactionhistorytitle = account.account_name; // Display account name on top menu bar
        this.saltedgeService.saltedgeaccountcurrencycode = account.currency_code // Set the currency code so that we could display the proper symbol
        this.navCtrl.navigateForward(['/accounts/transactionhistory']);
      }
    });
  }

  // Onclick to next page, passing account information to the next page
  spendinginsights(account) {
    this.saltedgeService.saltedgeaccount = account // Set the account information to a global variable so that we could access it from anywhere
    this.expensesService.transactionhistorytitle = account.account_name // Display account name on top menu bar
    this.saltedgeService.saltedgeaccountcurrencycode = account.currency_code // Set the currency code so that we could display the proper symbol
    this.navCtrl.navigateForward(['/accounts/spendinginsights']); // Navigate to the next page
  }

  expandItem(item): void {
    // Can expand as many ion-items the user wishes at any one time
    // item.expanded = !item.expanded

    // Only 1 ion-item can be expanded at any one time
    if (item.expanded) {
      item.expanded = false;
    } else {
      this.saltedgeService.saltedgeaccounts.map(listItem => {
        if (item == listItem) {
          listItem.expanded = !listItem.expanded;
        } else {
          listItem.expanded = false;
        }
        return listItem;
      });
    }
  }

  async ngOnInit() {
    const loading = await this.loadingController.create({
      message: 'Loading...',
    });
    loading.present();

    var https = require('follow-redirects').https;

    var options = {
      'method': 'GET',
      'hostname': 'hello-world-holy-cherry-49c2.tristanchng.workers.dev',
      // connection_id determines which accounts to get
      'path': '/https://www.saltedge.com/api/v5/accounts?connection_id=' + this.saltedgeService.saltedgeconnection["id"],
      'headers': {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'App-id': 'XwfTIwSo2aaqEY71Lh4f-dFdvHIj8oNdaGcxD-yB7-I',
        'Secret': '2aX68O-S7H5kGBDFRUdXxRtfN377d2ZOrwpJQ-gfzD4',
        'x-cors-proxy-api-key': 'EZWTLwVEqFnaycMzdhBz',
        'Origin': ''
      },
      'maxRedirects': 20
    };

    var req = https.request(options, (res) => {
      var chunks = [];

      res.on("data", function (chunk) {
        chunks.push(chunk);
        loading.dismiss()
      });

      res.on("end", (chunk) => {
        var body = Buffer.concat(chunks);
        console.log(JSON.parse(body.toString()));
        this.saltedgeService.saltedgeaccounts = JSON.parse(body.toString())["data"] // Get all accounts from a salt edge connection
        console.log(this.saltedgeService.saltedgeaccounts)

        // Loop through all accounts in the salt edge connection
        for (let account of this.saltedgeService.saltedgeaccounts) {
          // If the currency is not yet added to the currency Object
          if (this.currency[account.currency_code] == undefined) {
            this.currency[account.currency_code] = 0 // Start from 0
          }
          // Add it to the relevant currency key
          this.currency[account.currency_code] += account.balance
        }
        // Loop through the currency codes in the currency object and add the currency symbol to another array
        for (let eachcurrency of Object.keys(this.currency)) {
          this.currencycode[eachcurrency] = this.currency[eachcurrency].toLocaleString('en-SG', { style: 'currency', currency: eachcurrency })
        }
        this.balances.push(this.currency)
        this.balancescurrencycode.push(this.currencycode)
        console.log(this.currency)

        // Loop through the accounts to get the account name (or nature) and the balance
        for (let account of this.saltedgeService.saltedgeaccounts) {

          if (account["extra"]["account_name"]) {
            account["account_name"] = account["extra"]["account_name"] // Display the account name if there is
          } else {
            account["account_name"] = this.expensesService.humanize(account["nature"]) // Otherwise display the nature of account
          }
          account["balance"] = account["balance"].toLocaleString('en-SG', { style: 'currency', currency: account["currency_code"] }) // Include currency symbol
          account["expanded"] = false // Allow the expandable to work
        }
        console.log(this.saltedgeService.saltedgeaccounts)
        loading.dismiss()
      });

      res.on("error", function (error) {
        console.error(error);
        loading.dismiss()
      });
    });

    req.end();
  }

  // Get the list of accounts based on the bank
  constructor(public expensesService: ExpensesService, public userService: UserService, public navCtrl: NavController, public firestore: AngularFirestore, public saltedgeService: SaltedgeService, public loadingController: LoadingController, private faio: FingerprintAIO, public platform: Platform, private storage: Storage) {

  }
}
