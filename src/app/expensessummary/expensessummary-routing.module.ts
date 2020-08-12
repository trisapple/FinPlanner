import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ExpensessummaryPage } from './expensessummary.page';

const routes: Routes = [
  {
    path: '',
    component: ExpensessummaryPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExpensessummaryPageRoutingModule {}
