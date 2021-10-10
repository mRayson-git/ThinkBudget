import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountSettingsComponent } from './account-settings/account-settings.component';
import { SharedModule } from '../shared/shared.module';
import { ModalComponent } from './modal/modal.component';



@NgModule({
  declarations: [
    AccountSettingsComponent,
    ModalComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
  ]
})
export class AccountModule { }
