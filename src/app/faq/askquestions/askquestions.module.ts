import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AskquestionsPageRoutingModule } from './askquestions-routing.module';

import { AskquestionsPage } from './askquestions.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    AskquestionsPageRoutingModule
  ],
  declarations: [AskquestionsPage]
})
export class AskquestionsPageModule {}
