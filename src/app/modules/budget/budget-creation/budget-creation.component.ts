import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Timestamp } from 'firebase/firestore';
import { Category } from 'src/app/interfaces/category';
import { MonthlyBudget } from 'src/app/interfaces/monthly-budget';
import { MonthlyBudgetService } from 'src/app/services/monthly-budget.service';
import { BudgetModalComponent } from '../budget-modal/budget-modal.component';

@Component({
  selector: 'app-budget-creation',
  templateUrl: './budget-creation.component.html',
  styleUrls: ['./budget-creation.component.scss']
})
export class BudgetCreationComponent implements OnInit {
  incomeForm: FormGroup = new FormGroup({
    income: new FormControl('', Validators.required)
  });
  categoryForm: FormGroup = new FormGroup({
    name: new FormControl('', Validators.required),
    amount: new FormControl('', Validators.required),
    colour: new FormControl('')
  });

  currDate: Date = new Date();
  currBudget?: MonthlyBudget;
  budgets: MonthlyBudget[] = [];

  currParentCategories: string[] = [];

  constructor(public bs: MonthlyBudgetService, private modalService: NgbModal) { }

  ngOnInit(): void {
    this.bs.budgets$.subscribe(budgets => {
      console.log(budgets);
      this.budgets = budgets;
      if (this.budgets.length > 0) {
        // Do we have a budget for this month?
        if (this.budgets[0].date.toDate().getMonth() == this.currDate.getMonth()) {
          this.currBudget = this.budgets[0];
          this.getCategories(this.currBudget);
          this.incomeForm.get('income')?.setValue(this.currBudget.income);
        }
      } else {
        this.currBudget = undefined;
      }
    });
  }
  
  addCategory(): void {
    let category: Category = {
      parent: this.categoryForm.get('name')?.value.split(': ')[0],
      name: this.categoryForm.get('name')?.value.split(': ')[1],
      amount: this.categoryForm.get('amount')?.value,
      colour: this.categoryForm.get('colour')?.value || this.getRandomColor()
    }
    this.currBudget?.categories.push(category);
    // Add to the parent categories if not already there
    if (!this.currParentCategories.find(parent => parent == category.parent)) {this.currParentCategories.push(category.parent);}
    this.sortCategoryNames();
  }

  editIncome(): void {
    this.currBudget!.income = Number(this.incomeForm.get('income')?.value);
  }

  editCategory(category: Category): void {
    const modalRef = this.modalService.open(BudgetModalComponent, { centered: true, size: 'lg' });
    modalRef.componentInstance.category = category;
    modalRef.componentInstance.categoryEditEvent.subscribe((category: Category) => {
      console.log(category.parent);
      console.log(category.name);
      let index = this.currBudget!.categories.findIndex(element => element.parent == category.parent && element.name == category.name);
      console.log(index);
      this.currBudget!.categories[index!] = category;
    });
    modalRef.componentInstance.categoryRemoveEvent.subscribe((remove: Boolean) => {
      if (remove) {
        this.currBudget!.categories = this.currBudget!.categories.filter(element => element != category);
      }
    });
  }

  importDefault(): void {
    let income = Number(this.incomeForm.get('income')!.value)
    let budget: MonthlyBudget = {
      income: income,
      date: Timestamp.now(),
      categories: [
        { parent: "Food", name: "Groceries", amount: income * 0.1, colour: "#50C878" },
        { parent: "Food", name: "Dining Out", amount: income * 0.1, colour: "#5F8575" },
        { parent: "Saving", name: "Non-Investment", amount: income * 0.8, colour: "#4F7942" },
      ]
    }
    this.bs.addBudget(budget);
  }

  // Helper methods
  getCategories(budget: MonthlyBudget): void {
    budget.categories.forEach(category => {
      if (!this.currParentCategories.find(parent => parent == category.parent)) {this.currParentCategories.push(category.parent)}
    });
  }

  getTotalBudgeted(): number {
    let total = 0;
    this.currBudget?.categories.forEach(category => {
      total = total + category.amount;
    });
    return total;
  }

  getRemainingToBudget(): number {
    let remaining = this.currBudget!.income;
    this.currBudget?.categories.forEach(category => {
      remaining = remaining - category.amount;
    });
    return remaining;
  }

  sortCategoryNames(): void {
    this.currBudget?.categories.sort((a,b) => {
      if (a.name > b.name) {
        return 1;
      } else if (a.name < b.name) {
        return -1;
      } else {
        return 0;
      }
    });
  }

  getRandomColor() {
    let letters = '0123456789ABCDEF';
    let color: string = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

}
