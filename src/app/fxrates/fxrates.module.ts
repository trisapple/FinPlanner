import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FxratesPageRoutingModule } from './fxrates-routing.module';

import { FxratesPage } from './fxrates.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FxratesPageRoutingModule
  ],
  declarations: [FxratesPage]
})
export class FxratesPageModule {}
