import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UpdatetodoPageRoutingModule } from './updatetodo-routing.module';

import { UpdatetodoPage } from './updatetodo.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UpdatetodoPageRoutingModule
  ],
  declarations: [UpdatetodoPage]
})
export class UpdatetodoPageModule {}
