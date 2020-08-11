import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ExpensesService {

  transactions: JSON
  allaccounts: Array<any>
  accountGroups = []

  // accountsummaryArray = []
  transactionhistorytitle: String
  transactionhistoryaccountId: String

  constructor() { }
}
