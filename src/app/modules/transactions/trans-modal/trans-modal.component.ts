import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Timestamp } from 'firebase/firestore';
import { Transaction } from 'src/app/interfaces/transaction';
import { MonthlyBudgetService } from 'src/app/services/monthly-budget.service';
import { TransactionService } from 'src/app/services/transaction.service';

@Component({
  selector: 'app-trans-modal',
  templateUrl: './trans-modal.component.html',
  styleUrls: ['./trans-modal.component.scss']
})
export class TransModalComponent implements OnInit {
  @Input() trans?: Transaction;

  categories: string[] = [];

  transForm: FormGroup = new FormGroup({
    id: new FormControl(''),
    bankAccountName: new FormControl(''),
    bankAccountType: new FormControl(''),
    transDate: new FormControl(''),
    transAmount: new FormControl(''),
    transPayee: new FormControl(''),
    transType: new FormControl(''),
    transNote: new FormControl(''),
    transCategory: new FormControl(''),
  })

  constructor(private transactionService: TransactionService, private modalService: NgbModal, public bs: MonthlyBudgetService) { }

  ngOnInit(): void {
    if (this.trans) {
      this.transForm.get('id')?.setValue(this.trans?.id);
      this.transForm.get('bankAccountName')?.setValue(this.trans?.bankAccountName);
      this.transForm.get('bankAccountType')?.setValue(this.trans?.bankAccountType);
      this.transForm.get('transDate')?.setValue(this.trans?.transDate);
      this.transForm.get('transAmount')?.setValue(this.trans?.transAmount);
      this.transForm.get('transPayee')?.setValue(this.trans?.transPayee);
      this.transForm.get('transType')?.setValue(this.trans?.transType);
      this.transForm.get('transNote')?.setValue(this.trans?.transNote);
      this.transForm.get('transCategory')?.setValue(this.trans?.transCategory || '');
    }
  }

  submitChanges(): void {
    let transaction:Transaction = {
      id: this.transForm.get('id')?.value,
      bankAccountName: this.transForm.get('bankAccountName')?.value,
      bankAccountType: this.transForm.get('bankAccountType')?.value,
      transDate: this.transForm.get('transDate')?.value,
      transAmount: this.transForm.get('transAmount')?.value,
      transPayee: this.transForm.get('transPayee')?.value,
      transType: this.transForm.get('transType')?.value,
      transCategory: this.transForm.get('transCategory')?.value || '',
      transNote: this.transForm.get('transNote')?.value || ''
    }
    this.transactionService.updateTransaction(transaction);
    this.modalService.dismissAll();
  }

  removeTransaction(): void {
    this.transactionService.deleteTransaction(this.trans!.id!);
    this.modalService.dismissAll();
  }

  addTransaction(): void {
    let transaction: Transaction = {
      bankAccountName: this.transForm.get('bankAccountName')?.value,
      bankAccountType: this.transForm.get('bankAccountType')?.value,
      transDate: Timestamp.fromDate(new Date(this.transForm.get('transDate')?.value)),
      transAmount: this.transForm.get('transAmount')?.value,
      transPayee: this.transForm.get('transPayee')?.value,
      transType: this.transForm.get('transType')?.value,
      transCategory: this.transForm.get('transCategory')?.value || '',
      transNote: this.transForm.get('transNote')?.value || ''
    }
    this.transactionService.createTransaction(transaction);
    this.modalService.dismissAll();
  }

}
