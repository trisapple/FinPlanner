import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AccountslistPageRoutingModule } from './accountslist-routing.module';

import { AccountslistPage } from './accountslist.page';

import { ExpandableComponent } from "../../components/expandable/expandable.component";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AccountslistPageRoutingModule
  ],
  declarations: [AccountslistPage, ExpandableComponent]
})
export class AccountslistPageModule {}
