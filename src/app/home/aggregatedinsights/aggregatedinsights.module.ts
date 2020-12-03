import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AggregatedinsightsPageRoutingModule } from './aggregatedinsights-routing.module';

import { AggregatedinsightsPage } from './aggregatedinsights.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AggregatedinsightsPageRoutingModule
  ],
  declarations: [AggregatedinsightsPage]
})
export class AggregatedinsightsPageModule {}
