import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ExpensesService {

  transactions: JSON;
  allaccounts: Array<any>;

  accountGroups = [];
  accounts = [];
  accountsbool = false;

  // accountsummaryArray = []
  transactionhistorytitle: String
  transactionhistoryaccountId: String

  constructor() { }
}
