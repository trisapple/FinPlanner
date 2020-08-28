import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UpdatetodoPage } from './updatetodo.page';

const routes: Routes = [
  {
    path: '',
    component: UpdatetodoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UpdatetodoPageRoutingModule {}
