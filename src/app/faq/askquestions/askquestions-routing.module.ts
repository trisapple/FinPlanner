import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AskquestionsPage } from './askquestions.page';

const routes: Routes = [
  {
    path: '',
    component: AskquestionsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AskquestionsPageRoutingModule {}
