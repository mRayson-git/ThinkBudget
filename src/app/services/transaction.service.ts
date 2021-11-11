import { Parser } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import firebase from 'firebase/compat';
import { OrderByDirection, Timestamp, WriteBatch } from 'firebase/firestore';
import { BehaviorSubject, combineLatest, Observable, Subject } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';
import { Transaction } from '../interfaces/transaction';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  transactions$!: Observable<Transaction[]>;
  transactionCollection!: AngularFirestoreCollection<Transaction>;

  monthlyTransactions$!: Observable<Transaction[]>;
  monthlyTransactionCollection!: AngularFirestoreCollection<Transaction>;

  limitFilter$?: BehaviorSubject<number>;
  currentUser!: firebase.User;

  constructor(private afs: AngularFirestore, private auth: AngularFireAuth, private toastService: ToastService) {

  }

  init(): void {
    this.auth.currentUser.then(user => {
      this.currentUser = user!;
      this.limitFilter$ = new BehaviorSubject(5);
      // Setup for transactions on transaction overview page
      this.transactions$ = this.limitFilter$.pipe(
        switchMap(limit => this.afs.collection<Transaction>(user?.uid + '/resources/transactions', ref => ref.orderBy('transDate', 'desc').limit(limit)).valueChanges()
        ));
      this.transactionCollection = this.afs.collection<Transaction>(user?.uid + '/resources/transactions');
    });
  }

  // Configure to use writeBatch and custom uuids
  batchSave(transactions: Transaction[]): void {
    this.getMostRecent(transactions[0].bankAccountName).get().subscribe(data => {
      let mostRecent = data.docs.pop()?.data();
      if (mostRecent == null) {
        transactions.forEach(transaction => {
          this.transactionCollection.add(transaction).then(res => {
            transaction.id = res.id;
            this.transactionCollection.doc(res.id).set(transaction, { merge: true });
          });
        });
      } else {
        transactions.forEach(transaction => {
          if (transaction.transDate > mostRecent!.transDate) {
            this.transactionCollection.add(transaction).then(res => {
              transaction.id = res.id;
              this.transactionCollection.doc(res.id).set(transaction, { merge: true });
            });
          } else if (transaction.transDate == mostRecent!.transDate) {
            this.afs.collection<Transaction>(this.currentUser?.uid + '/resources/transactions', ref => ref
            .where('bankAccountName', '==', transaction.bankAccountName)
            .where('transAmount', '==', transaction.transAmount)
            .where('transPayee', '==', transaction.transPayee)
            .where('transType', '==', transaction.transType)
            .limit(1)).valueChanges().pipe(take(1)).subscribe(trans => {
              if (!trans) {
                this.transactionCollection.add(transaction).then(res => {
                  transaction.id = res.id;
                  this.transactionCollection.doc(res.id).set(transaction, { merge: true });
                });
              }
            });
            
          } else {
            console.warn(transaction + " Requires manual addition");
          }
        });
      }
    });
  }

  createTransaction(transaction: Transaction): void {
    this.transactionCollection.add(transaction)
      .then(res => {
        transaction.id = res.id;
        this.transactionCollection.doc(res.id).set(transaction, { merge: true });
      })
      .catch(error => this.toastService.show({ type: 'danger', content: `Could not create transaction: ${error}` }));
  }

  updateTransaction(transaction: Transaction): void {
    this.transactionCollection.doc(transaction.id).set(transaction, { merge: true })
      .then(res => this.toastService.show({ type: 'success', content: 'Updated transaction' }))
      .catch(err => this.toastService.show({ type: 'danger', content: `Could not update transaction: ${err}` }));
  }

  deleteTransaction(id: string): void {
    console.log(`Deleting transaction with ID: ${id}`);
    this.transactionCollection.doc(id).delete()
      .then(res => this.toastService.show({ type: 'success', content: 'Removed transaction' }))
      .catch(err => this.toastService.show({ type: 'danger', content: `Could not remove transaction: ${err}` }));

  }

  getTransactionsWithLimit(limit: number): void {
    this.limitFilter$?.next(limit);
  }

  getMostRecent(bankAccountName: string): AngularFirestoreCollection<Transaction> {
    return this.afs.collection<Transaction>(this.currentUser?.uid + '/resources/transactions', ref => ref
      .where('bankAccountName', '==', bankAccountName)
      .orderBy('transDate', 'desc')
      .limit(1));
  }

  getMonthlyTransactions(currDate: Date): Observable<Transaction[]> {
    return this.afs.collection<Transaction>(this.currentUser?.uid + '/resources/transactions', ref => ref
      .where('transDate', ">=", Timestamp.fromDate(new Date(currDate.getFullYear(), currDate.getMonth())))
      .where('transDate', '<', Timestamp.fromDate(new Date(currDate.getFullYear(), currDate.getMonth() + 1)))).valueChanges();
  }
}
