import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SaltedgeService {

  constructor() { }

  saltedgeconnections = [] // Array of connected banks
  saltedgeconnection = [] // Array of Connected Bank information
  saltedgeaccounts = [] // Array of accounts for the connected bank
  saltedgeaccount = [] // Array of account information 
  saltedgeaccountcurrencycode: string // Currency code for spending insights and transaction history to display the corresponding currency symbol
  saltedgecustomerid: String // Salt Edge customer id to fetch user's connected banks

  formatDate(date) {
    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2)
      month = '0' + month;
    if (day.length < 2)
      day = '0' + day;

    return [year, month, day].join('-');
  }

  dynamicColors() {
    var colors = [];
    var r = Math.floor(Math.random() * 255)
    var g = Math.floor(Math.random() * 255)
    var b = Math.floor(Math.random() * 255)
    colors.push("rgba(" + r + "," + g + "," + b + ",0.2)")
    colors.push("rgb(" + r + "," + g + "," + b + ")")
    return colors;
  }
}
