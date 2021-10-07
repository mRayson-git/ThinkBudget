import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountSettingsComponent } from './account-settings/account-settings.component';
import { SharedModule } from '../shared/shared.module';



@NgModule({
  declarations: [
    AccountSettingsComponent
  ],
  imports: [
    CommonModule,
    SharedModule
  ]
})
export class AccountModule { }
