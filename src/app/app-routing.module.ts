import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '', loadChildren: () => import('./menu/menu.module').then( m => m.MenuPageModule) },
  { path: 'register', loadChildren: () => import('./register/register.module').then( m => m.RegisterPageModule) },
  { path: 'forgot', loadChildren: () => import('./forgot/forgot.module').then( m => m.ForgotPageModule) },
  { path: 'profile', loadChildren: () => import('./profile/profile.module').then( m => m.ProfilePageModule) },
  { path: 'changepassword', loadChildren: () => import('./changepassword/changepassword.module').then( m => m.ChangepasswordPageModule) },
  { path: 'updateprofile', loadChildren: () => import('./updateprofile/updateprofile.module').then( m => m.UpdateprofilePageModule) },
  { path: 'accounts/transactionhistory', loadChildren: () => import('./accounts/transactionhistory/transactionhistory.module').then( m => m.TransactionHistoryPageModule) },
  { path: 'expensessummary', loadChildren: () => import('./expensessummary/expensessummary.module').then( m => m.ExpensessummaryPageModule) },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
