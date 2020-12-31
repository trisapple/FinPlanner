import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FingerprintLockPageRoutingModule } from './fingerprint-lock-routing.module';

import { FingerprintLockPage } from './fingerprint-lock.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FingerprintLockPageRoutingModule
  ],
  declarations: [FingerprintLockPage]
})
export class FingerprintLockPageModule {}
