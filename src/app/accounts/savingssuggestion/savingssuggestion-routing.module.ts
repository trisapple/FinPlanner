import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SavingssuggestionPage } from './savingssuggestion.page';

const routes: Routes = [
  {
    path: '',
    component: SavingssuggestionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SavingssuggestionPageRoutingModule {}
