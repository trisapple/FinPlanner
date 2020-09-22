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
  saltedgeaccountcurrencycode: String // Currency code for spending insights and transaction history to display the corresponding currency symbol
  saltedgecustomerid: String // Salt Edge customer id to fetch user's connected banks
  saltedgereportid: String // Salt Edge Report id to display insights in home page
}
