import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { Routes, RouterModule } from '@angular/router';

import { ProfilePageRoutingModule } from './profile-routing.module';

import { ProfilePage } from './profile.page';
import { Base64 } from '@ionic-native/base64/ngx';
import { HTTP } from '@ionic-native/http/ngx';
import { MediaCapture } from '@ionic-native/media-capture/ngx';
import { File } from '@ionic-native/file/ngx';

const routes: Routes = [
  {
    path: '',
    component: ProfilePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProfilePageRoutingModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ProfilePage],
  providers: [
    Base64,
    MediaCapture,
    File,
    HTTP
  ]
})
export class ProfilePageModule {}
