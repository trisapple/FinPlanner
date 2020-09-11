import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RetirePage } from './retire.page';

const routes: Routes = [
  {
    path: '',
    component: RetirePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RetirePageRoutingModule {}
