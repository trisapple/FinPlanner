import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '', loadChildren: () => import('./menu/menu.module').then(m => m.MenuPageModule) },
  { path: 'login/register', loadChildren: () => import('./login/register/register.module').then(m => m.RegisterPageModule) },
  { path: 'login/forgot', loadChildren: () => import('./login/forgot/forgot.module').then(m => m.ForgotPageModule) },
  { path: 'profile/changepassword', loadChildren: () => import('./profile/changepassword/changepassword.module').then(m => m.ChangepasswordPageModule) },
  { path: 'profile/updateprofile', loadChildren: () => import('./profile/updateprofile/updateprofile.module').then(m => m.UpdateprofilePageModule) },
  { path: 'accounts/transactionhistory', loadChildren: () => import('./accounts/transactionhistory/transactionhistory.module').then(m => m.TransactionHistoryPageModule) },
  { path: 'accounts/spendinginsights', loadChildren: () => import('./accounts/spendinginsights/spendinginsights.module').then(m => m.SpendingInsightsPageModule) },
  { path: 'faq/askquestions', loadChildren: () => import('./faq/askquestions/askquestions.module').then(m => m.AskquestionsPageModule) },
  { path: 'todolist/add', loadChildren: () => import('./todolist/addtodo/addtodo.module').then(m => m.AddtodoPageModule) },
  { path: 'todolist/update', loadChildren: () => import('./todolist/updatetodo/updatetodo.module').then(m => m.UpdatetodoPageModule) },
  { path: 'accounts/savingssuggestion', loadChildren: () => import('./accounts/savingssuggestion/savingssuggestion.module').then( m => m.SavingssuggestionPageModule) },
  { path: 'exchangerates/fxrates', loadChildren: () => import('./exchangerates//fxrates/fxrates.module').then( m => m.FxratesPageModule) },
  { path: 'exchangerates/stocks', loadChildren: () => import('./exchangerates/stocks/stocks.module').then( m => m.StocksPageModule) },
  { path: 'exchangerates/crypto', loadChildren: () => import('./exchangerates/crypto/crypto.module').then( m => m.CryptoPageModule) },
  // { path: 'exchangerates', loadChildren: () => import('./exchangerates/exchangerates.module').then( m => m.ExchangeratesPageModule) },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
