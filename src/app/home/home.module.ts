import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';
import { Routes, RouterModule } from '@angular/router';

import { Ng2GoogleChartsModule } from 'ng2-google-charts';


import { HomePageRoutingModule } from './home-routing.module';



const routes: Routes = [
  {
    path: '',
    component: HomePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    RouterModule.forChild(routes),
    Ng2GoogleChartsModule
  ],
  declarations: [HomePage]
})
export class HomePageModule {}
