import { ConditionalExpr } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { take } from 'rxjs/operators';
import { Category } from 'src/app/interfaces/category';
import { MonthlyBudget } from 'src/app/interfaces/monthly-budget';
import { Transaction } from 'src/app/interfaces/transaction';
import { MonthlyBudgetService } from 'src/app/services/monthly-budget.service';
import { TransactionService } from 'src/app/services/transaction.service';
import { ChartOptions, ChartType, ChartDataSets, ChartTitleOptions } from 'chart.js';
import { Label } from 'ng2-charts';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {
  public Math = Math;
  totals: { parent: string, name: string, budgetedAmount: number, amount: number, remaining: number, percentage: number, colour: string }[] = [];
  currDate!: Date;
  totalActualIncome!: number;

  budgetShown?: MonthlyBudget;
  budgetShownParents?: string[];

  // BarChart variables
  chartShown = false;
  barChartOptions: ChartOptions = {
    responsive: true,
    title: {
      display: true,
      text: 'Remaining Budget by Category',
      fontSize: 20
    },
    legend: {
      position: 'right'
    },
    onResize: (newSize) => {
      if (newSize.width < 800) {
        this.chartShown = true;
      } else {
        this.chartShown = false;
      }
    }
  };
  barChartLabels: Label[] = ['Budget'];
  barChartType: ChartType = 'bar';
  barChartLegend = true;
  barChartPlugins = [];
  barChartData: ChartDataSets[] = [];


  // showUntracked: FormGroup = new FormGroup({
  //   show: new FormControl(false)
  // });

  constructor(private transactionService: TransactionService,
    public bs: MonthlyBudgetService) { }

  ngOnInit(): void {
    // Get this months budget
    this.budgetShown = this.bs.currBudget;
    this.budgetShownParents = this.bs.currParentCategories;
    this.currDate = new Date();
    this.transactionService.getMonthlyTransactions(this.currDate).pipe(take(1)).subscribe(transactions => {
      this.getCategoryTotals(this.budgetShown!, transactions);
      // Build the graph
      this.setBarChartValues();
      // Update budget stats
      this.updateBudgetStats();
      this.bs.editBudget(this.budgetShown!);
    });
  }

  getCategoryTotals(budget: MonthlyBudget, transactions: Transaction[]): void {
    
    let totals: { parent: string, name: string, budgetedAmount: number, amount: number, remaining: number, percentage: number, colour: string }[] = [];
    // let untrackedTotals: { category: string, amount: number, remaining: number, percentage: number }[] = [];
    budget.categories.forEach(category => {
      let total = 0;
      let percentage = 0;
      let remaining = category.amount;
      const fullName = category.parent + ": " + category.name;
      this.totalActualIncome = 0;
      transactions.forEach(transaction => {
        if (transaction.transCategory == fullName) {
          total = total - transaction.transAmount;
          percentage = Math.round(total / category.amount * 100);
          remaining = Math.round((remaining + transaction.transAmount) * 100) / 100;
        } else if (transaction.transCategory?.split(':')[0] == 'Income'){
          this.totalActualIncome += transaction.transAmount;
        }
      });
      totals.push({ parent: category.parent, name: category.name, budgetedAmount: category.amount, amount: total, remaining: remaining, percentage: percentage, colour: category.colour });
    });
    this.totals = totals;
  }

  getTotalSpent(): number {
    let totalSpent = 0;
    this.totals.forEach(total => {
      totalSpent = totalSpent + total.amount;
    });
    return Math.round(totalSpent * 100) / 100;
  }

  getTotalSaved(): number {
    let totalSaved = 0;
    this.totals.forEach( total => {
      if (total.parent == 'Saving') {
        totalSaved = totalSaved + total.amount
      }
    });
    return Math.round(totalSaved * 100) / 100;
  }

  getTotalBudgeted(): number {
    let totalBudgeted = 0;
    this.budgetShown!.categories.forEach(category => {
      totalBudgeted += category.amount;
    });
    return Math.round(totalBudgeted * 100) / 100;
  }

  getTotalSpendingBudgeted(): number {
    let totalBudgeted = 0;
    this.budgetShown!.categories.forEach(category => {
      if (category.parent != "Saving"){
        totalBudgeted += category.amount;
      }
    });
    return Math.round(totalBudgeted * 100) / 100;
  }

  getTotalOverSpentBudget(): number {
    return Math.round((this.getTotalSpent() - this.getTotalBudgeted()) * 100) / 100;
  }

  getTotalOverSpentActual(): number {
    return Math.round((this.getTotalSpent() - this.totalActualIncome) * 100) / 100;
  }

  getPrevMonth(): void {
    this.currDate = new Date(this.currDate.getFullYear(), this.currDate.getMonth() - 1);
    // Get this months budget
    this.bs.getMonthsBudget(this.currDate).pipe(take(1)).subscribe(budgets => {
      if (budgets.length > 0) {
        this.budgetShown = budgets[0];
        this.budgetShownParents = this.bs.getParentCategories(this.budgetShown);
        this.transactionService.getMonthlyTransactions(this.currDate).pipe(take(1)).subscribe(transactions => {
          this.getCategoryTotals(this.budgetShown!, transactions);
          this.setBarChartValues();
          // this.updateBudgetStats();
        });
      } else {
        this.budgetShown = undefined;
      }
    });
  }

  getFutureMonth(): void {
    this.currDate = new Date(this.currDate.getFullYear(), this.currDate.getMonth() + 1);
    // Get this months budget
    this.bs.getMonthsBudget(this.currDate).pipe(take(1)).subscribe(budgets => {
      if (budgets.length > 0) {
        this.budgetShown = budgets[0];
        this.budgetShownParents = this.bs.getParentCategories(this.budgetShown);
        this.transactionService.getMonthlyTransactions(this.currDate).pipe(take(1)).subscribe(transactions => {
          this.getCategoryTotals(this.budgetShown!, transactions);
          this.setBarChartValues();
          this.updateBudgetStats();
        });
      } else {
        this.budgetShown = undefined;
      }
    });
  }

  updateBudgetStats(): void {
    // If stats have changed, update
    if (!this.budgetShown!.budgetStats || this.budgetShown!.budgetStats.totalDifference != this.getTotalOverSpentActual()){
      this.budgetShown!.budgetStats!.totalSaved = this.getTotalSaved();
      this.budgetShown!.budgetStats!.totalSpent = this.getTotalSpent();
      this.budgetShown!.budgetStats!.totalSpendingBudget = this.getTotalSpendingBudgeted();
      this.budgetShown!.budgetStats!.totalDifference = this.getTotalOverSpentActual();
      this.bs.editBudget(this.budgetShown!);
    }
    
  }

  getCurrDate(): Date {
    return this.currDate;
  }

  setBarChartValues(): void {
    this.barChartData = [];
    this.totals.sort((a, b) => {
      if (a.parent < b.parent) {
        return -1;
      } else if (a.parent > b.parent) {
        return 1;
      }
      return 0;
    });
    let prevValue = '';
    let counter = 0;
    this.totals.forEach((total, index) => {
      let data = [];
      let hidden = false;
      data.push(total.remaining);
      if (total.parent == 'Saving' || total.remaining == 0){
        hidden = true;
      } else { hidden = false;}
      this.barChartData.push({data: data, label: total.name, backgroundColor: this.bs.colourAdjust(total.colour, 10), hoverBackgroundColor: this.bs.colourAdjust(total.colour, 10), borderColor: total.colour , hidden: hidden });
      // // if on first index, set prev value to the first parent category
      // if (index == 0) {
      //   prevValue = total.parent;
      // }
      // // adding the parent to the bar chart labels if not already there
      // if (!this.barChartLabels.find(parent => parent == total.parent)) {
      //   this.barChartLabels.push(total.parent);
      // }
      // if (total.parent != prevValue) { 
      //   counter += 1;
      //   prevValue = total.parent;
      // }
      // for (let i = 0; i < counter; i++) {
      //   data.push(undefined);
      // }
      // prevValue = total.parent;
    });
    this.barChartData.push({data: [this.getTotalOverSpentBudget() * -1], label: 'Total Remaining (Budgeted)', backgroundColor: this.bs.colourAdjust('#3467eb', 10), hoverBackgroundColor: this.bs.colourAdjust('#3467eb', 10), borderColor: '#3467eb', hidden: true})
    this.barChartData = this.barChartData.filter(data => data.data?.length != 0);
  }

}
