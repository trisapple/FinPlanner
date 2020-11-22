import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ExpensesService {

  transactions = []; // Transactions List for the displayed account
  transactions2 = [] // Sorted transactions list

  transactionhistorytitle: String // Display the account name on the ion-header

  // Piechart
  pieChartData = [] // Pie Chart Data with key value data in array form [["category", "Amount"], ["Food", 83.65], ... ]
  total = 0 // Put the total spending of the account as a global variable so that it can be accessed from the html

  // Stocks
  Stocks = [];
  
  // Crypto 
  cryptoUS = [];
  cryptoSG = [];

  // FXRates
  fxrates = [];
  

  constructor() { }

  // Remove underscores and capitalise every word (e.g. fees_and_charges becomes Fees And Charges)
  humanize(str) {
    var i, frags = str.split('_');
    for (i = 0; i < frags.length; i++) {
      frags[i] = frags[i].charAt(0).toUpperCase() + frags[i].slice(1);
    }
    return frags.join(' ');
  }

  // Sort by latest transaction first
  sortbylatesttransaction(array, field) {
    array.sort((a, b) => {
      if (a[field] > b[field]) {
        return -1;
      }
      if (a[field] < b[field]) {
        return 1;
      }
      return 0;
    });
  }
}
