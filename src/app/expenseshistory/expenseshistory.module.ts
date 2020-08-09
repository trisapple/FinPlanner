import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ExpenseshistoryPageRoutingModule } from './expenseshistory-routing.module';

import { ExpenseshistoryPage } from './expenseshistory.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ExpenseshistoryPageRoutingModule
  ],
  declarations: [ExpenseshistoryPage]
})
export class ExpenseshistoryPageModule {}
