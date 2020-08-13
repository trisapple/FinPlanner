import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ExpensesService {

  transactions = [];
  allaccounts: Array<any>;

  accountGroups = [];
  accounts = [];
  accountsbool = false;

  // accountsummaryArray = []
  transactionhistorytitle: String
  transactionhistoryaccountId: String

  transactioncategories = []

  constructor() { }
}
