import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ETFPage } from './etf.page';

const routes: Routes = [
  {
    path: '',
    component: ETFPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ETFPageRoutingModule {}
