import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SpendingInsightsPageRoutingModule } from './spendinginsights-routing.module';

import { SpendingInsightsPage } from './spendinginsights.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SpendingInsightsPageRoutingModule
  ],
  declarations: [SpendingInsightsPage]
})
export class SpendingInsightsPageModule {}
