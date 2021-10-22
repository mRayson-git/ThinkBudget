import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Budget } from 'src/app/interfaces/budget';
import { Transaction } from 'src/app/interfaces/transaction';
import { BudgetService } from 'src/app/services/budget.service';
import { TransactionService } from 'src/app/services/transaction.service';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {
  totals: { category: string, categoryName: string, amount: number, remaining: number, percentage: number }[] = [];
  categories: string[] = [];
  currDate!: Date;

  showUntracked: FormGroup = new FormGroup({
    show: new FormControl(false)
  });

  constructor(private transactionService: TransactionService,
    public budgetService: BudgetService) {
      this.currDate = new Date();
    }

  ngOnInit(): void {
    
    // 1. Get budgets
    // 2. Get transactions
    // 3. Get totals
    this.budgetService.budget$.subscribe(budgets => {
      this.transactionService.getMonthlyTransactions().subscribe(transactions => {
        this.getCategoryTotals(budgets, transactions);
      });
    });
  }

  getCategoryTotals(budgets: Budget[], transactions: Transaction[]): void {
    let totals: { category: string, categoryName: string, amount: number, remaining: number, percentage: number }[] = [];
    // let untrackedTotals: { category: string, amount: number, remaining: number, percentage: number }[] = [];
    budgets.forEach(budget => {
      if (!this.categories.find(category=> category == budget.category)){this.categories.push(budget.category!)}
      if (budget.tracked){
        let total = 0;
        let percentage = 0;
        let remaining = budget.budgetAmount;
        transactions.forEach(transaction => {
          if (transaction.transCategory == budget.categoryName) {
            total = total - transaction.transAmount;
            percentage = Math.round(total / budget.budgetAmount * 100);
            remaining = remaining + transaction.transAmount;
          }
        });
        totals.push({ category: budget.category!, categoryName: budget.categoryName, amount: total, remaining: remaining, percentage: percentage });
      }
    });
    this.totals = totals;
  }

  getTotalSpent(): number {
    let totalSpent = 0;
    this.totals.forEach(total => {
      totalSpent = totalSpent + total.amount;
    });
    return totalSpent;
  }

  getTotalSaved(): number {
    let totalSaved = 0;
    this.totals.forEach( total => {
      if (total.category == 'Saving') {
        totalSaved = totalSaved + total.amount
      }
    });
    return totalSaved;
  }



}
