import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Timestamp } from 'firebase/firestore';
import firebase from 'firebase/compat';
import { Observable } from 'rxjs';
import { MonthlyBudget } from '../interfaces/monthly-budget';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root'
})
export class MonthlyBudgetService {

  budgets$ = new Observable<MonthlyBudget[]>();
  budgetCollection!: AngularFirestoreCollection<MonthlyBudget>;
  currBudget?: MonthlyBudget;

  currentUser!: firebase.User;

  parentCategories: string[] = [
    "Food",
    "Housing",
    "Income",
    "Insurance",
    "Personal",
    "Saving",
    "Transportation",
    "Utilities"
  ]
  categoryNames: string[] = [
    "Food: Delivery",
    "Food: Dining Out",
    "Food: Groceries",
    "Housing: HOA Dues",
    "Housing: Mortgage",
    "Housing: Maintenance",
    "Housing: Renovations",
    "Housing: Rent",
    "Income: Misc",
    "Income: Payroll",
    "Insurance: Dental",
    "Insurance: Health",
    "Insurance: Optometry",
    "Personal: Entertainment",
    "Personal: Gifts",
    "Personal: Health",
    "Personal: Hobby",
    "Personal: Recreation",
    "Saving: Crypto",
    "Saving: Emergency Fund",
    "Saving: Investment",
    "Saving: Non-Investment",
    "Transportation: Car payments",
    "Transportation: Gas",
    "Transportation: Maintenance",
    "Transportation: Parking",
    "Transportation: Repairs",
    "Transportation: Tolls",
    "Transportation: Transit Pass",
    "Utilities: Electricity",
    "Utilities: Gas",
    "Utilities: Phone",
    "Utilities: Water",
  ]

  constructor(private afs: AngularFirestore,
    private auth: AngularFireAuth,
    private ts: ToastService) { }

  init(): void {
    this.auth.currentUser.then(user => {
      this.currentUser = user!;
      this.budgetCollection = this.afs.collection<MonthlyBudget>(user?.uid + '/resources/monthlyBudgets');
      this.budgets$ = this.budgetCollection.valueChanges();
      this.getThisMonthsBudget().subscribe(budgets => {
        if (budgets.length > 0) {
          this.currBudget = budgets[0];
        } else {
          this.currBudget = undefined;
        }
      });
    });
  }

  addBudget(budget: MonthlyBudget): void {
    this.budgetCollection.add(budget)
      .then(result => {
        budget.id = result.id;
        this.budgetCollection.doc(budget.id).set(budget, {merge: true});
      });
  }

  editBudget(budget: MonthlyBudget): void {
    this.budgetCollection.doc(budget.id).set(budget)
      .then(res => this.ts.show({type: 'success', content: 'Budget properties updated'}))
      .catch(err => this.ts.show({type: 'danger', content: 'Could not update budget'}));
  }

  getThisMonthsBudget(): Observable<MonthlyBudget[]> {
    let currDate = new Date();
    return this.afs.collection<MonthlyBudget>(this.currentUser?.uid + '/resources/monthlyBudgets', ref => ref
      .where('date', ">=", Timestamp.fromDate(new Date(currDate.getFullYear(), currDate.getMonth())))).valueChanges();
  }

  // Helper methods non-database
  getCategoryNames(parent: string): string[] {
    let names: string[] = [];
    this.categoryNames.forEach(name => {
      if (name.split(': ')[0] == parent) {
        names.push(name.split(': ')[1]);
      }
    });
    return names;
  }

  getParentCategories(): string[] {
    let parent: string[] = [];
    this.currBudget?.categories.forEach(category => {
      if (!parent.find(parent => parent == category.parent)) { parent.push(category.parent); }
    });
    return parent;
  }
}
