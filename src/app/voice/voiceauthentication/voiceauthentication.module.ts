import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VoiceauthenticationPageRoutingModule } from './voiceauthentication-routing.module';

import { VoiceauthenticationPage } from './voiceauthentication.page';
import { Base64 } from '@ionic-native/base64/ngx';
import { HTTP } from '@ionic-native/http/ngx';
import { MediaCapture } from '@ionic-native/media-capture/ngx';
import { File } from '@ionic-native/file/ngx';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VoiceauthenticationPageRoutingModule
  ],
  declarations: [VoiceauthenticationPage],
  providers: [
    Base64,
    MediaCapture,
    File,
    HTTP
  ]
})
export class VoiceauthenticationPageModule {}
