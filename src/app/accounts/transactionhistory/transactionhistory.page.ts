import { Component, OnInit } from '@angular/core';
import { UserService } from '../../user.service';
import { ExpensesService } from '../../expenses.service';
import { SaltedgeService } from 'src/app/saltedge.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-transactionhistory',
  templateUrl: './transactionhistory.page.html',
  styleUrls: ['./transactionhistory.page.scss'],
})

export class TransactionHistoryPage {

  // Ion-segment for doughnut chart
  yeararray = [] // Populate the years (e.g. 2019, 2018, 2017)
  defaultyear = [] // Select the year in the ion-segment
  montharray = [] // Populate the months (Jan - Dec)
  defaultmonth = [] // Select the month in the ion-segment

  made_on_latest = "" // Date of last transaction
  made_on_first = "" // Date of first transaction

  months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

  filtereddata = []

  async ngOnInit() {
    const loading = await this.loadingController.create({
      message: 'Loading...',
    });
    loading.present();

    var https = require('follow-redirects').https;

    var options = {
      'method': 'GET',
      'hostname': 'quiet-shelf-43690.herokuapp.com',
      // The connection_id and account_id determines where to retrieve the transaction history
      // 'path': '/https://www.saltedge.com/api/v5/transactions?connection_id=' + '301371211005299276' + '&account_id=' + '301374390707161589' + '&per_page=1000',
      'path': '/https://www.saltedge.com/api/v5/transactions?connection_id=' + this.saltedgeService.saltedgeconnection["id"] + '&account_id=' + this.saltedgeService.saltedgeaccount["id"] + '&per_page=1000',
      'headers': {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'App-id': 'XwfTIwSo2aaqEY71Lh4f-dFdvHIj8oNdaGcxD-yB7-I',
        'Secret': '2aX68O-S7H5kGBDFRUdXxRtfN377d2ZOrwpJQ-gfzD4',
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
        this.expensesService.transactions = JSON.parse(body.toString())["data"]
        this.expensesService.sortbylatesttransaction(this.expensesService.transactions, "made_on")

        this.made_on_latest = this.expensesService.transactions[0]["made_on"] // Get the date of latest transaction
        this.made_on_first = this.expensesService.transactions[this.expensesService.transactions.length - 1]["made_on"] // Get the date of first transaction

        // Populate the years for the doughnut chart ion-segment in descending order (e.g. 2019, 2018, 2017)
        for (let i = new Date(this.made_on_latest).getFullYear(); i >= new Date(this.made_on_first).getFullYear(); i--) {
          this.yeararray.push(i)
        }
        this.defaultyear = [this.yeararray[0]] // Set to the latest year

        // Once we set the year, we need to set the month
        // Populate the months and disable or enable them accordingly
        // If there is more than 1 year of data (e.g. 2019, 2018, ...)
        if ((new Date(this.made_on_latest).getFullYear()) != (new Date(this.made_on_first).getFullYear())) {

          this.montharray = [["Jan", true], ["Feb", true], ["Mar", true], ["Apr", true], ["May", true], ["Jun", true], ["Jul", true], ["Aug", true], ["Sep", true], ["Oct", true], ["Nov", true], ["Dec", true]]

          // Loop through the months
          for (let i = 0; i <= this.months.length - 1; i++) {
            // We use if to determine the month
            if ((new Date(this.made_on_latest).getMonth()) == i) {
              // Loop through the months to the month of latest transaction and enable the ion-segments accordingly
              for (let i = 0; i <= (new Date(this.made_on_latest).getMonth()); i++) {
                this.montharray[i][1] = false
              }
              // Loop through the month array and set the month to the latest month
              for (let each of this.montharray) {
                if (each[1] == false) {
                  this.defaultmonth = [[this.months[i], ('0' + (i + 1)).slice(-2)]] // Set the month to the latest month
                }
              }
            }
          }
        }
        // If there is just 1 year of data
        else {
          this.montharray = [["Jan", true], ["Feb", true], ["Mar", true], ["Apr", true], ["May", true], ["Jun", true], ["Jul", true], ["Aug", true], ["Sep", true], ["Oct", true], ["Nov", true], ["Dec", true]]

          // Loop through the months from month of first transaction to the month of latest transaction and enable the ion-segments accordingly
          for (let i = new Date(this.made_on_first).getMonth(); i <= new Date(this.made_on_latest).getMonth(); i++) {
            this.montharray[i][1] = false
          }
          // Set the month to the latest month
          this.defaultmonth = [[this.montharray[new Date(this.made_on_latest).getMonth()][0], ('0' + (new Date(this.made_on_latest).getMonth() + 1)).slice(-2)]]
        }

        var transactionhistoryObject = {}
        var transactionhistoryArray = []
        for (let transaction of this.expensesService.transactions) {
          transaction["category"] = this.expensesService.humanize(transaction["category"]) // Remove underscores and capitalise every word
          transaction["amountcurrencycode"] = transaction["amount"].toLocaleString('en-SG', { style: 'currency', currency: this.saltedgeService.saltedgeaccountcurrencycode }) // Include currency symbol 
          // transaction["amountcurrencycode"] = transaction["amount"].toLocaleString('en-SG', { style: 'currency', currency: "SGD" }) // Include currency symbol 

          // The 5 lines of code below will collate transactions by date
          // transaction["made_on"] is the date of transaction

          // Once we start from the first date or move to a new date, we empty the transactionlist array
          if (transactionhistoryObject[transaction["made_on"]] == undefined) {
            transactionhistoryArray = []
          }

          transactionhistoryArray.push(transaction) // Add the transaction to the array
          transactionhistoryObject[transaction["made_on"]] = transactionhistoryArray // Set the transactionlist array as the value of the date key 
          // e.g. {2018-04-23: Array, 2018-04-22: Array, ... }
        }
        console.log(transactionhistoryObject)
        console.log(Object.entries(transactionhistoryObject))

        // Convert the object into an array so that we can iterate it in HTML
        // e.g. [["2018-04-23", Array], ["2018-04-22", Array], ... ]
        this.expensesService.transactions2 = Object.entries(transactionhistoryObject)

        this.expensesService.sortbylatesttransaction(this.expensesService.transactions2, 0)

        this.looptransactions()

        loading.dismiss()

        console.log(this.expensesService.transactions)
        console.log(this.expensesService.transactions2)
      });

      res.on("error", function (error) {
        console.error(error);
        loading.dismiss()
      });
    });

    req.end();
  }

  constructor(public userService: UserService, public expensesService: ExpensesService, public saltedgeService: SaltedgeService, public firestore: AngularFirestore, public loadingController: LoadingController) {
  }

  // When the month in the ion-segment is changed (spending insights pie chart)
  changemonth(ev: any) {
    // Loop through the months array and check if it matches the value of the selected ion-segment
    // If ev.detail.value == "Jan", this.defaultmonth = [["Jan", "01"]]
    // If ev.detail.value == "Feb", this.defaultmonth = [["Feb", "02"]]
    for (let i = 0; i <= this.months.length - 1; i++) {
      if (ev.detail.value == this.months[i]) {
        this.defaultmonth = [[this.months[i], ('0' + (i + 1)).slice(-2)]]
      }
    }

    this.looptransactions()
  }

  // When the year in the ion-segment is changed (spending insights pie chart)
  changeyear(ev: any) {
    this.defaultyear = [ev.detail.value]

    // If on first year of data
    if (ev.detail.value == new Date(this.made_on_first).getFullYear()) {

      // Enable all the ion-segments
      this.montharray = [["Jan", false], ["Feb", false], ["Mar", false], ["Apr", false], ["May", false], ["Jun", false], ["Jul", false], ["Aug", false], ["Sep", false], ["Oct", false], ["Nov", false], ["Dec", false]]

      // Loop through 0 to 11
      for (let i = 0; i <= this.months.length - 1; i++) {
        // We use if to determine the month
        if ((new Date(this.made_on_first).getMonth()) == i) {

          // If the month is February or later, disable the relevant ion-segments as we loop through the montharray. 
          // We have an if to avoid possible error if i = 0, then this.montharray[-1][1] might cause an error
          for (let i = 0; i <= (new Date(this.made_on_first).getMonth()); i++) {
            if (i > 0) {
              this.montharray[i - 1][1] = true
            }
          }

          // If the current ion-segment value will be disabled, shift the value to the first month of data
          for (let each of this.montharray) {
            if (each[1] == true && this.defaultmonth[0][0] == each[0]) {
              this.defaultmonth = [[this.months[i], ('0' + (i + 1)).slice(-2)]]
            }
          }
        }
      }
    }
    // If on last year of data
    else if (ev.detail.value == new Date(this.made_on_latest).getFullYear()) {

      // Disable all the ion-segments
      this.montharray = [["Jan", true], ["Feb", true], ["Mar", true], ["Apr", true], ["May", true], ["Jun", true], ["Jul", true], ["Aug", true], ["Sep", true], ["Oct", true], ["Nov", true], ["Dec", true]]

      for (let i = 0; i <= this.months.length - 1; i++) {
        if ((new Date(this.made_on_latest).getMonth()) == i) {

          // Enable the ion-segments as we loop through the montharray
          for (let i = 0; i <= (new Date(this.made_on_latest).getMonth()); i++) {
            this.montharray[i][1] = false
          }

          // If the current ion-segment value will be disabled, shift the value to the last month of data
          for (let each of this.montharray) {
            if (each[1] == true && this.defaultmonth[0][0] == each[0]) {
              this.defaultmonth = [[this.months[i - 1], ('0' + (i + 1)).slice(-2)]]
            }
          }
        }
      }
    }
    // If not first or last year of data
    else {
      // Enable all ion-segments
      this.montharray = [["Jan", false], ["Feb", false], ["Mar", false], ["Apr", false], ["May", false], ["Jun", false], ["Jul", false], ["Aug", false], ["Sep", false], ["Oct", false], ["Nov", false], ["Dec", false]]
    }

    this.looptransactions()
  }

  // Filter transaction history and populate the pie chart
  looptransactions() {
    // Filter the aggregated transaction history based on the year and month
    this.filtereddata = this.expensesService.transactions2.filter(each => each[0].includes((this.defaultyear[0] + "-" + this.defaultmonth[0][1])));
  }
}
