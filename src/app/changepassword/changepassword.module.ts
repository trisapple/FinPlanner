import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { Routes, RouterModule } from '@angular/router';

import { ChangepasswordPageRoutingModule } from './changepassword-routing.module';

import { ChangepasswordPage } from './changepassword.page';

const routes: Routes = [
  {
    path: '',
    component: ChangepasswordPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChangepasswordPageRoutingModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ChangepasswordPage]
})
export class ChangepasswordPageModule {}
