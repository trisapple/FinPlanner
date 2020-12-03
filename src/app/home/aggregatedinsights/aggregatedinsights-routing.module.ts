import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AggregatedinsightsPage } from './aggregatedinsights.page';

const routes: Routes = [
  {
    path: '',
    component: AggregatedinsightsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AggregatedinsightsPageRoutingModule {}
