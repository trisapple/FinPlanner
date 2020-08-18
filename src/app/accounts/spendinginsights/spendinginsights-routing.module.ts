import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SpendingInsightsPage } from './spendinginsights.page';

const routes: Routes = [
  {
    path: '',
    component: SpendingInsightsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SpendingInsightsPageRoutingModule {}
