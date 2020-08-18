import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '', loadChildren: () => import('./menu/menu.module').then( m => m.MenuPageModule) },
  { path: 'login/register', loadChildren: () => import('./login/register/register.module').then( m => m.RegisterPageModule) },
  { path: 'login/forgot', loadChildren: () => import('./login/forgot/forgot.module').then( m => m.ForgotPageModule) },
  { path: 'profile/changepassword', loadChildren: () => import('./profile/changepassword/changepassword.module').then( m => m.ChangepasswordPageModule) },
  { path: 'profile/updateprofile', loadChildren: () => import('./profile/updateprofile/updateprofile.module').then( m => m.UpdateprofilePageModule) },
  { path: 'accounts/transactionhistory', loadChildren: () => import('./accounts/transactionhistory/transactionhistory.module').then( m => m.TransactionHistoryPageModule) },
  { path: 'accounts/spendinginsights', loadChildren: () => import('./accounts/spendinginsights/spendinginsights.module').then( m => m.SpendingInsightsPageModule) },  {
    path: 'askquestions',
    loadChildren: () => import('./askquestions/askquestions.module').then( m => m.AskquestionsPageModule)
  },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
