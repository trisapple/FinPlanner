import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ViewexchangeratesPageRoutingModule } from './viewexchangerates-routing.module';

import { ViewexchangeratesPage } from './viewexchangerates.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ViewexchangeratesPageRoutingModule
  ],
  declarations: [ViewexchangeratesPage]
})
export class ViewexchangeratesPageModule {}
