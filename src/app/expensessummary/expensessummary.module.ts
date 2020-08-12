import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ExpensessummaryPageRoutingModule } from './expensessummary-routing.module';

import { ExpensessummaryPage } from './expensessummary.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ExpensessummaryPageRoutingModule
  ],
  declarations: [ExpensessummaryPage]
})
export class ExpensessummaryPageModule {}
