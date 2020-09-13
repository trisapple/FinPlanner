import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PlanningPageRoutingModule } from './planning-routing.module';

import { PlanningPage } from './planning.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PlanningPageRoutingModule
  ],
  declarations: [PlanningPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PlanningPageModule {}
