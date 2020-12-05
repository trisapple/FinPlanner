import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VoicePageRoutingModule } from './voice-routing.module';

import { VoicePage } from './voice.page';
import { Base64 } from '@ionic-native/base64/ngx';
import { MediaCapture } from '@ionic-native/media-capture/ngx';
import { HTTP } from '@ionic-native/http/ngx';
import { File } from '@ionic-native/file/ngx';



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VoicePageRoutingModule
  ],
  declarations: [VoicePage],
  providers: [
    Base64,
    MediaCapture,
    File,
    HTTP
  ]
})
export class VoicePageModule {}
