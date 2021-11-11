import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { OverviewComponent } from './overview/overview.component';
import { BudgetModalComponent } from './budget-modal/budget-modal.component';
import { BudgetCreationComponent } from './budget-creation/budget-creation.component';



@NgModule({
  declarations: [
    OverviewComponent,
    BudgetModalComponent,
    BudgetCreationComponent
  ],
  imports: [
    CommonModule,
    SharedModule
  ]
})
export class BudgetModule { }
