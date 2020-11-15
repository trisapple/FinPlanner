import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ViewexchangeratesPage } from './viewexchangerates.page';

const routes: Routes = [
  {
    path: '',
    component: ViewexchangeratesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ViewexchangeratesPageRoutingModule {}
