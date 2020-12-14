import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VoiceauthenticationPageRoutingModule } from './voiceauthentication-routing.module';

import { VoiceauthenticationPage } from './voiceauthentication.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VoiceauthenticationPageRoutingModule
  ],
  declarations: [VoiceauthenticationPage]
})
export class VoiceauthenticationPageModule {}
