import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { Budget } from '../interfaces/budget';
import { MonthlyBudget } from '../interfaces/monthly-budget';

@Injectable({
  providedIn: 'root'
})
export class MonthlyBudgetService {

  budgets$ = new Observable<MonthlyBudget[]>();
  budgetCollection!: AngularFirestoreCollection<MonthlyBudget>;

  budgetCategories: string[] = [
    "Food",
    "Housing",
    "Income",
    "Insurance",
    "Personal",
    "Saving",
    "Transportation",
    "Utilities"
  ]
  budgetCategorieNames: string[] = [
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
    private auth: AngularFireAuth) { }

  init(): void {
    this.auth.currentUser.then(user => {
      this.budgetCollection = this.afs.collection<MonthlyBudget>(user?.uid + '/resources/monthlyBudgets');
      this.budgets$ = this.budgetCollection.valueChanges();
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
    this.budgetCollection.doc(budget.id).set(budget);
  }
}
