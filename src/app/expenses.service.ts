import { Injectable } from '@angular/core';
import { GoogleChartInterface } from 'ng2-google-charts/esm2015/lib/google-charts-interfaces';

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

  pieChart: GoogleChartInterface
  pieChartData = []
  pieChartData2 = []
  total = 0

  constructor() { }
}
