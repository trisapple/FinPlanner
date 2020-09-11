import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RetirePageRoutingModule } from './retire-routing.module';

import { RetirePage } from './retire.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RetirePageRoutingModule
  ],
  declarations: [RetirePage]
})
export class RetirePageModule {}
