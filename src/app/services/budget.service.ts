import { Parser } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { Budget } from '../interfaces/budget';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root'
})
export class BudgetService {
  budget$ = new Observable<Budget[]>();
  budgetCollection!: AngularFirestoreCollection<Budget>;

  constructor(private afs: AngularFirestore, private auth: AngularFireAuth, private toastService: ToastService) {
    
  }

  addBudget(budget: Budget): void {
    this.budgetCollection.add(budget)
    .then(res => {
      this.toastService.show({ type: 'success', content: `Added budget ${budget}` });
      budget.id = res.id;
      this.budgetCollection.doc(res.id).set(budget, {merge: true});
    })
    .catch(error => this.toastService.show({ type: 'danger', content: `Could not add budget: ${error}` }));
  }

  updateBudget(budget: Budget): void {
    this.budgetCollection.doc(budget.id).set(budget)
    .then(res => this.toastService.show({type: 'success', content: 'Updated budget'}))
    .catch(err => this.toastService.show({type: 'danger', content: `Could not update budget: ${err}`}));
  }

  deleteBudget(id: string): void {
    this.budgetCollection.doc(id).delete()
      .then(res => this.toastService.show({type: 'success', content: 'Deleted budget'}))
      .catch(err => this.toastService.show({type: 'danger', content: `Could not delete budget: ${err}`}));
  }

  init(): void {
    this.auth.currentUser.then(user => {
      this.budgetCollection = this.afs.collection<Budget>(user?.uid + '/resources/budget');
      this.budget$ = this.budgetCollection.valueChanges();
    });
  }
}
