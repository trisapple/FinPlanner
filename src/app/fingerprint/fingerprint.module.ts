import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FingerprintPageRoutingModule } from './fingerprint-routing.module';

import { FingerprintPage } from './fingerprint.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FingerprintPageRoutingModule
  ],
  declarations: [FingerprintPage]
})
export class FingerprintPageModule {}
