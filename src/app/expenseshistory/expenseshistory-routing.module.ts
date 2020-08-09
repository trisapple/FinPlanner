import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ExpenseshistoryPage } from './expenseshistory.page';

const routes: Routes = [
  {
    path: '',
    component: ExpenseshistoryPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExpenseshistoryPageRoutingModule {}
