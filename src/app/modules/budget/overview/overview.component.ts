import { Component, OnInit } from '@angular/core';
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
  transactions: Transaction[] = [];
  budgets: Budget[] = [];
  totals: { category: string, amount: number, percentage: number }[] = [];

  constructor(private transactionService: TransactionService,
    private budgetService: BudgetService) { }

  ngOnInit(): void {
    this.budgetService.budget$.subscribe(budgets => {
      this.budgets = budgets;
      this.transactions = this.transactionService.getMonthlyTransactions();
      console.log(this.transactions);
      this.totals = this.getCategoryTotals();
      console.log(this.totals);
    });
  }

  getCategoryTotals() {
    let totals: { category: string, amount: number, percentage: number }[] = [];
    this.budgets.forEach(budget => {
      let total = 0;
      let percentage = 0;
      this.transactions.forEach(transaction => {
        if (transaction.transCategory == budget.categoryName) {
          total = total - transaction.transAmount;
          percentage = total / budget.budgetAmount;
        }
      });
      totals.push({ category: budget.categoryName, amount: total, percentage: percentage });
    });
    return totals;
  }



}
