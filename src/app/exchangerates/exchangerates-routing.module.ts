import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ExchangeratesPage } from './exchangerates.page';

const routes: Routes = [
  {
    path: '',
    component: ExchangeratesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExchangeratesPageRoutingModule {}
