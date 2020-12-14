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
  { path: 'accounts/accountslist', loadChildren: () => import('./accounts/accountslist/accountslist.module').then( m => m.AccountslistPageModule) },
  {
    path: 'courses/planning',
    loadChildren: () => import('./courses/planning/planning.module').then( m => m.PlanningPageModule)
  },
  // {
  //   path: 'courses/invest',
  //   loadChildren: () => import('./courses/invest/invest.module').then( m => m.InvestPageModule)
  // },
  // {
  //   path: 'courses/save',
  //   loadChildren: () => import('./courses/save/save.module').then( m => m.SavePageModule)
  // },
  // {
  //   path: 'courses/etf',
  //   loadChildren: () => import('./courses/etf/etf.module').then( m => m.ETFPageModule)
  // },
  // {
  //   path: 'courses/retire',
  //   loadChildren: () => import('./courses/retire/retire.module').then( m => m.RetirePageModule)
  // },
  // {
  //   path: 'courses/tips',
  //   loadChildren: () => import('./courses/tips/tips.module').then( m => m.TipsPageModule)
  // },
  {
    path: 'news',
    loadChildren: () => import('./news/news.module').then( m => m.NewsPageModule)
  },
  {
    path: 'news-single',
    loadChildren: () => import('./news-single/news-single.module').then( m => m.NewsSinglePageModule)
  },
  {
    path: 'finance/rates',
    loadChildren: () => import('./finance/rates/rates.module').then( m => m.RatesPageModule)
  },
  {
    path: 'finance/viewexchangerates',
    loadChildren: () => import('./finance/viewexchangerates/viewexchangerates.module').then( m => m.ViewexchangeratesPageModule)
  },
  {
    path: 'voice',
    loadChildren: () => import('./voice/voice.module').then( m => m.VoicePageModule)
  },
  {
    path: 'home/aggregatedinsights',
    loadChildren: () => import('./home/aggregatedinsights/aggregatedinsights.module').then( m => m.AggregatedinsightsPageModule)
  },
  {
    path: 'fingerprint',
    loadChildren: () => import('./fingerprint/fingerprint.module').then( m => m.FingerprintPageModule)
  },
  {
    path: 'voice/voiceauthentication',
    loadChildren: () => import('./voice/voiceauthentication/voiceauthentication.module').then( m => m.VoiceauthenticationPageModule)
  },
  // { path: 'exchangerates', loadChildren: () => import('./exchangerates/exchangerates.module').then( m => m.ExchangeratesPageModule) },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
