import { Parser } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import firebase from 'firebase/compat';
import { OrderByDirection, WriteBatch } from 'firebase/firestore';
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
  currentUser!: firebase.User;

  constructor(private afs: AngularFirestore, private auth: AngularFireAuth, private toastService: ToastService) {

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
            this.transactionCollection.add(transaction);
          } else {
            console.warn("Requires manual addition");
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
      .catch(error => this.toastService.show({type: 'danger', content: `Could not create transaction: ${error}`}));
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

  init(): void {
    this.history$ = new Subject<string>();
    this.auth.currentUser.then(user => {
      this.currentUser = user!;
      this.limitFilter$ = new BehaviorSubject(5);
      this.transactions$ = this.limitFilter$.pipe(
        switchMap(limit => this.afs.collection<Transaction>(user?.uid + '/resources/transactions', ref => ref.orderBy('transDate', 'desc').limit(limit)).valueChanges()
        ));
      this.transactionCollection = this.afs.collection<Transaction>(user?.uid + '/resources/transactions');
    });
  }

  getMostRecent(bankAccountName: string): AngularFirestoreCollection<Transaction> {
    return this.afs.collection<Transaction>(this.currentUser?.uid + '/resources/transactions', ref => ref
      .where('bankAccountName', '==', bankAccountName)
      .orderBy('transDate', 'desc')
      .limit(1));
  }
}
