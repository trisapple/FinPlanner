import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ETFPageRoutingModule } from './etf-routing.module';

import { ETFPage } from './etf.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ETFPageRoutingModule
  ],
  declarations: [ETFPage]
})
export class ETFPageModule {}
