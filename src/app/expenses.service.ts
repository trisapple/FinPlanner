import { Injectable } from '@angular/core';
import { GoogleChartInterface } from 'ng2-google-charts/esm2015/lib/google-charts-interfaces';

@Injectable({
  providedIn: 'root'
})
export class ExpensesService {

  transactions = []; // Transactions List for the displayed account
  transactions2 = []
  ocbcCreditCardTransaction = false;
 
  // Citibank
  citiAccounts = []; // Each array in the accountGroups array will contain the accountGroup and its associated accounts
  accountsloaded = false; // Variable to check if the user's accounts have loaded
  // transactionhistorycardId: String;

  // OCBC
  ocbcAccounts =[];
  ocbcaccountsloaded = false;

  transactionhistorytitle: String // Display the account name on the ion-header
  transactionhistoryaccountId: String // Account id to be passed to the request path

  // Piechart
  pieChart: GoogleChartInterface // Display the piechart
  pieChartData = [] // Pie Chart Data with key value data in array form [["category", "Amount"], ["Food", 83.65], ... ]
  pieChartData2 = [] // Pie Chart Data with key value data in array form excluding ["category", "Amount"] from pieChartData
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

  constructor() { }
}
