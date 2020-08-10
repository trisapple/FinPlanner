import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ExpensesService {

  transactions: JSON
  allaccounts: JSON
  accountsummaryArray = []
  transactionhistorytitle: String
  transactionhistoryaccountId: String

  constructor() { }
}
