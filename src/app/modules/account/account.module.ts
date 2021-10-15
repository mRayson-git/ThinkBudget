import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountSettingsComponent } from './account-settings/account-settings.component';
import { SharedModule } from '../shared/shared.module';
import { ModalComponent } from './modal/modal.component';
import { BudgetCreatorComponent } from './budget-creator/budget-creator.component';
import { BudgetModalComponent } from './budget-modal/budget-modal.component';



@NgModule({
  declarations: [
    AccountSettingsComponent,
    ModalComponent,
    BudgetCreatorComponent,
    BudgetModalComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
  ]
})
export class AccountModule { }
