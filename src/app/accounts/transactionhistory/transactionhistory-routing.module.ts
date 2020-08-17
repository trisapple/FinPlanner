import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TransactionHistoryPage } from './transactionhistory.page';

const routes: Routes = [
  {
    path: '',
    component: TransactionHistoryPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TransactionHistoryPageRoutingModule {}
