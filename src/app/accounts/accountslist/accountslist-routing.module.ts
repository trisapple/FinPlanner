import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AccountslistPage } from './accountslist.page';

const routes: Routes = [
  {
    path: '',
    component: AccountslistPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AccountslistPageRoutingModule {}
