import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ExchangeratesPageRoutingModule } from './exchangerates-routing.module';

import { ExchangeratesPage } from './exchangerates.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ExchangeratesPageRoutingModule
  ],
  declarations: [ExchangeratesPage]
})
export class ExchangeratesPageModule {}
