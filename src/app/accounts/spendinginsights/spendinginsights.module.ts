import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SpendingInsightsPageRoutingModule } from './spendinginsights-routing.module';

import { SpendingInsightsPage } from './spendinginsights.page';

import { Ng2GoogleChartsModule } from 'ng2-google-charts';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SpendingInsightsPageRoutingModule,
    Ng2GoogleChartsModule
  ],
  declarations: [SpendingInsightsPage]
})
export class SpendingInsightsPageModule {}
