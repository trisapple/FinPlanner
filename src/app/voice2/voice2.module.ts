import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { Voice2PageRoutingModule } from './voice2-routing.module';

import { Voice2Page } from './voice2.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    Voice2PageRoutingModule
  ],
  declarations: [Voice2Page]
})
export class Voice2PageModule {}
