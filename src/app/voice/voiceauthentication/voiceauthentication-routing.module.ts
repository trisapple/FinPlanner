import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VoiceauthenticationPage } from './voiceauthentication.page';

const routes: Routes = [
  {
    path: '',
    component: VoiceauthenticationPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VoiceauthenticationPageRoutingModule {}
