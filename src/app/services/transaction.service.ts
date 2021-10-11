import { Parser } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { OrderByDirection } from 'firebase/firestore';
import { BehaviorSubject, combineLatest, Observable, Subject } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Transaction } from '../interfaces/transaction';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  transactions$!: Observable<Transaction[]>;
  history$!: Subject<string>;
  limitFilter$?: BehaviorSubject<number>; 
  transactionCollection!: AngularFirestoreCollection<Transaction>;

  constructor(private afs: AngularFirestore, private auth: AngularFireAuth, private toastService: ToastService) {
    this.history$ = new Subject<string>();
    this.auth.currentUser.then(user => {
      this.limitFilter$ = new BehaviorSubject(20);
      this.transactions$ = this.limitFilter$.pipe(
        switchMap(limit => afs.collection<Transaction>(user?.uid + '/resources/transactions', ref => ref.orderBy('transDate', 'desc').limit(limit)).valueChanges()
      ));
      this.transactionCollection = afs.collection<Transaction>(user?.uid + '/resources/transactions');
    });
  }

  saveTransaction(transaction: Transaction): void {
    this.auth.currentUser.then(user => {
      let transCheck = this.afs.collection<Transaction>(user?.uid + '/resources/transactions', ref => ref.where('transPayee', '==', transaction.transPayee)
        .where('transDate', '==', transaction.transDate)
        .where('transAmount', '==', transaction.transAmount)
        .where('bankAccountName', '==', transaction.bankAccountName));
      transCheck.get().subscribe(data => {
        // if the transaction does not exist, add it
        console.log(data.docs.length);
        if (data.docs.length == 0) {
          this.history$.next('Successfull');
          this.transactionCollection.add(transaction)
          .then(res => {
            transaction.id = res.id;
            this.transactionCollection.doc(res.id).set(transaction, {merge: true});
          })
          .catch(error => this.toastService.show({ type: 'danger', content: `Could not add transaction: ${error}` }));
        } else {
          this.history$.next('Already exists');
        }
      });
    });
  }

  updateTransaction(transaction: Transaction): void {
    this.transactionCollection.doc(transaction.id).set(transaction, {merge: true})
      .then(res => this.toastService.show({ type: 'success', content: 'Updated transaction'}))
      .catch(err => this.toastService.show({ type: 'danger', content: `Could not update transaction: ${err}` }));
  }

  deleteTransaction(id: string): void {
    this.transactionCollection.doc(id).delete()
      .then(res => this.toastService.show({ type: 'success', content: 'Removed transaction' }))
      .catch(err => this.toastService.show({ type: 'danger', content: `Could not remove transaction: ${err}` }));

  }

  getTransactions(limit: number, orderBy: string, dir: OrderByDirection): void {
    
  }

  getTransactionsWithLimit(limit: number): void {
    this.limitFilter$?.next(limit);
  }
}
