import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MonthlyBudget } from 'src/app/interfaces/monthly-budget';
import { Transaction } from 'src/app/interfaces/transaction';
import { MonthlyBudgetService } from 'src/app/services/monthly-budget.service';
import { TransactionService } from 'src/app/services/transaction.service';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {
  totals: { parent: string, name: string, amount: number, remaining: number, percentage: number }[] = [];
  currDate!: Date;

  showUntracked: FormGroup = new FormGroup({
    show: new FormControl(false)
  });

  constructor(private transactionService: TransactionService,
    public bs: MonthlyBudgetService) {
      this.currDate = new Date();
    }

  ngOnInit(): void {
    // Get this months budget
    this.transactionService.getMonthlyTransactions().subscribe(transactions => {
      this.getCategoryTotals(this.bs.currBudget!, transactions);
    });
  }

  getCategoryTotals(budget: MonthlyBudget, transactions: Transaction[]): void {
    let totals: { parent: string, name: string, amount: number, remaining: number, percentage: number }[] = [];
    // let untrackedTotals: { category: string, amount: number, remaining: number, percentage: number }[] = [];
    budget.categories.forEach(category => {
      let total = 0;
      let percentage = 0;
      let remaining = category.amount;
      const fullName = category.parent + ": " + category.name;
      transactions.forEach(transaction => {
        if (transaction.transCategory == fullName) {
          total = total - transaction.transAmount;
          percentage = Math.round(total / category.amount * 100);
          remaining = remaining + transaction.transAmount;
        }
      });
      totals.push({ parent: category.parent, name: category.name, amount: total, remaining: remaining, percentage: percentage });
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
      if (total.parent == 'Saving') {
        totalSaved = totalSaved + total.amount
      }
    });
    return totalSaved;
  }



}
