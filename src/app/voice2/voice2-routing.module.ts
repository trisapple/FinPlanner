import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Voice2Page } from './voice2.page';

const routes: Routes = [
  {
    path: '',
    component: Voice2Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class Voice2PageRoutingModule {}
