import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { Routes, RouterModule } from '@angular/router';

import { MenuPageRoutingModule } from './menu-routing.module';

import { MenuPage } from './menu.page';

const routes: Routes = [
  {
    path: '',
    component: MenuPage,
    children: [
      { path: 'home', loadChildren: () => import('../home/home.module').then( m => m.HomePageModule) },
      { path: 'login', loadChildren: () => import('../login/login.module').then( m => m.LoginPageModule) },
      { path: 'courses', loadChildren: () => import('../courses/courses.module').then( m => m.CoursesPageModule) },
      { path: 'faq', loadChildren: () => import('../faq/faq.module').then( m => m.FaqPageModule)},
      { path: 'profile', loadChildren: () => import('../profile/profile.module').then( m => m.ProfilePageModule)},
      { path: 'accounts', loadChildren: () => import('../accounts/accounts.module').then( m => m.AccountsPageModule)}
    ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MenuPageRoutingModule,
    RouterModule.forChild(routes)
  ],
  declarations: [MenuPage]
})
export class MenuPageModule {}
