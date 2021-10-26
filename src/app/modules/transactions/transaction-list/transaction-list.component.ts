import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Timestamp } from 'firebase/firestore';
import { Parser } from 'src/app/interfaces/parser';
import { Transaction } from 'src/app/interfaces/transaction';
import { CsvProfileService } from 'src/app/services/csv-profile.service';
import { ToastService } from 'src/app/services/toast.service';
import { TransactionService } from 'src/app/services/transaction.service';
import { TransModalComponent } from '../trans-modal/trans-modal.component';

@Component({
  selector: 'app-transaction-list',
  templateUrl: './transaction-list.component.html',
  styleUrls: ['./transaction-list.component.scss']
})
export class TransactionListComponent implements OnInit {
  transImportForm: FormGroup = new FormGroup({
    parser: new FormControl('', Validators.required),
    file: new FormControl('', Validators.required)
  });
  sortForm: FormGroup = new FormGroup({
    limit: new FormControl(20),
    amount: new FormControl(''),
    payee: new FormControl('')
  });
  parsers: Parser[] = [];
  transactions: Transaction[] = [];
  file: any;

  constructor(public toastService: ToastService,
    public csvPS: CsvProfileService,
    public transactionService: TransactionService,
    private modalService: NgbModal) { }

  ngOnInit(): void {
    this.csvPS.parsers$.subscribe(result => this.parsers = result);
    this.transactionService.transactions$.subscribe(result => this.transactions = result);
    this.transactionService.getMostRecent('PCFinancial');
  }

  transInfo(): void {
    this.toastService.show({type: 'info', content: 'This is where you choose the appropriate parser and csv file to import transactions into your account', delay: 10000 });
  }

  fileChanged(event: any): void {
    this.file = event.target.files[0];
  }

  import(): void {
    let fileReader = new FileReader();
    let parser: Parser = this.parsers.find(parser => parser.accountName == this.transImportForm.get('parser')!.value)!;
    fileReader.onload = (e) => this.parseTransactions(<string>fileReader.result, parser);
    fileReader.readAsText(this.file);
  }

  async parseTransactions(data: string, parser: Parser): Promise<void> {
    let transactions: Transaction[] = [];
    try{
      data.split('\n').forEach((row, index) => {
        if (!parser.hasHeader || parser.hasHeader && index != 0) {
          const temp = row.split(',');
          if (temp[0] != ""){
            console.log(temp);
            const transaction: Transaction = {
              bankAccountName: parser.accountName,
              bankAccountType: parser.accountType,
              transAmount: Number(this.cleanString(temp[parser.amountCol-1])) || 0,
              transDate: Timestamp.fromDate(new Date(this.cleanString(temp[parser.dateCol-1]))),
              transPayee: this.cleanString(temp[parser.payeeCol-1]) || '',
              transType: this.cleanString(temp[parser.typeCol-1]) || ''
            }
            transactions.push(transaction);
          }
        }
      });
    } catch (error) {
      console.error(error);
    }
    this.transactionService.batchSave(transactions);
  }

  filterTransactions(): void {
    this.transactionService.getTransactionsWithLimit(this.sortForm.get('limit')?.value);
  }

  cleanString(string: string): string {
    if (string) {
      string = string.split('$').join('');
      string = string.split('"').join('');
      return string.trim();
    }
    return string;
  }

  addCustomTransaction(): void {
    const modalRef = this.modalService.open(TransModalComponent, { centered: true, size: 'lg' });
  }

  openTransUpdateDialog(transaction: Transaction): void {
    const modalRef = this.modalService.open(TransModalComponent, { centered: true, size: 'lg' });
    modalRef.componentInstance.trans = transaction;
  }

}
