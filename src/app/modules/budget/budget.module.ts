import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { OverviewComponent } from './overview/overview.component';
import { BudgetCreatorComponent } from './budget-creator/budget-creator.component';
import { BudgetModalComponent } from './budget-modal/budget-modal.component';



@NgModule({
  declarations: [
    OverviewComponent,
    BudgetCreatorComponent,
    BudgetModalComponent
  ],
  imports: [
    CommonModule,
    SharedModule
  ]
})
export class BudgetModule { }
