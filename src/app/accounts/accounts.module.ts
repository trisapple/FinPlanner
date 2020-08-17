import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AccountsPageRoutingModule } from './accounts-routing.module';

import { AccountsPage } from './accounts.page';

import { ExpandableComponent } from "../components/expandable/expandable.component";


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AccountsPageRoutingModule
  ],
  declarations: [AccountsPage, ExpandableComponent]
})
export class AccountsPageModule {}
