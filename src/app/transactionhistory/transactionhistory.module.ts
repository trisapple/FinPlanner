import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TransactionHistoryPageRoutingModule } from './transactionhistory-routing.module';

import { TransactionHistoryPage } from './transactionhistory.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TransactionHistoryPageRoutingModule
  ],
  declarations: [TransactionHistoryPage]
})
export class TransactionHistoryPageModule {}
