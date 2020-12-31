import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FingerprintLockPage } from './fingerprint-lock.page';

const routes: Routes = [
  {
    path: '',
    component: FingerprintLockPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FingerprintLockPageRoutingModule {}
