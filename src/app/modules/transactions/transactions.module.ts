import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { TransactionListComponent } from './transaction-list/transaction-list.component';
import { TransModalComponent } from './trans-modal/trans-modal.component';



@NgModule({
  declarations: [
    TransactionListComponent,
    TransModalComponent
  ],
  imports: [
    CommonModule,
    SharedModule
  ]
})
export class TransactionsModule { }
