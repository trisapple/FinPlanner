import { Injectable } from '@angular/core';
import { GoogleChartInterface } from 'ng2-google-charts/esm2015/lib/google-charts-interfaces';

@Injectable({
  providedIn: 'root'
})
export class ExpensesService {

  transactions = []; // Transactions List for the displayed account
  transactions2 = [] // Sorted transactions list

  transactionhistorytitle: String // Display the account name on the ion-header

  // Piechart
  pieChart: GoogleChartInterface // Display the piechart
  pieChartData = [] // Pie Chart Data with key value data in array form [["category", "Amount"], ["Food", 83.65], ... ]
  pieChartData2 = [] // Pie Chart Data with key value data in array form excluding ["category", "Amount"] from pieChartData to display the progress bar of the expenses
  total = 0 // Put the total spending of the account as a global variable so that it can be accessed from the html



  // Stocks
  msftStocks = [];
  teslaStocks = [];

  // Crypto 
  cryptoUS = [];
  cryptoSG = [];

  // FXRates
  fxrates = [];
  fxratesSG = [];

  saltedgeconnections = [] // Array of connected banks
  saltedgeconnection = [] // Array of Connected Bank information
  saltedgeaccounts = [] // Array of accounts for the connected bank
  saltedgeaccount = [] // Array of account information 
  saltedgeaccountcurrencycode: String // Currency code for spending insights and transaction history to display the corresponding currency symbol
  saltedgecustomerid: String // Salt Edge customer id to fetch user's connected banks
  saltedgereportid: String // Salt Edge Report id to display insights in home page

  constructor() { }

  // Remove underscores and capitalise every word (e.g. fees_and_charges becomes Fees And Charges)
  humanize(str) {
    var i, frags = str.split('_');
    for (i = 0; i < frags.length; i++) {
      frags[i] = frags[i].charAt(0).toUpperCase() + frags[i].slice(1);
    }
    return frags.join(' ');
  }
}
