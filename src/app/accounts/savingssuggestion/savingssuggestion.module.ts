import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SavingssuggestionPageRoutingModule } from './savingssuggestion-routing.module';

import { SavingssuggestionPage } from './savingssuggestion.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SavingssuggestionPageRoutingModule
  ],
  declarations: [SavingssuggestionPage]
})
export class SavingssuggestionPageModule {}
