import { Component, OnInit, OnDestroy } from '@angular/core';
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
  budgets: MonthlyBudget[] = [];

  currParentCategories: string[] = [];

  budgetShown?: MonthlyBudget;
  budgetShownParents?: string[];

  constructor(public bs: MonthlyBudgetService, private modalService: NgbModal) { }

  ngOnInit(): void {
    this.bs.budgets$.subscribe(budgets => {
      this.budgets = budgets;
    });
    if (this.bs.currBudget) {
      this.budgetShown = this.bs.currBudget;
      this.budgetShownParents = this.bs.getParentCategories(this.budgetShown);
      this.incomeForm.get('income')?.setValue(this.bs.currBudget.income);
    }
  }
  
  addCategory(): void {
    let category: Category = {
      parent: this.categoryForm.get('name')?.value.split(': ')[0],
      name: this.categoryForm.get('name')?.value.split(': ')[1],
      amount: this.categoryForm.get('amount')?.value,
      colour: this.categoryForm.get('colour')?.value || this.getRandomColor()
    }
    this.bs.currBudget?.categories.push(category);
    // Add to the parent categories if not already there
    if (!this.budgetShownParents!.find(parent => parent == category.parent)) {this.budgetShownParents!.push(category.parent);}
    this.sortCategoryNames();
  }

  editIncome(): void {
    this.budgetShown!.income = Number(this.incomeForm.get('income')?.value);
  }

  editCategory(category: Category): void {
    const modalRef = this.modalService.open(BudgetModalComponent, { centered: true, size: 'lg' });
    modalRef.componentInstance.category = category;
    modalRef.componentInstance.categoryEditEvent.subscribe((category: Category) => {
      console.log(category.parent);
      console.log(category.name);
      let index = this.budgetShown!.categories.findIndex(element => element.parent == category.parent && element.name == category.name);
      console.log(index);
      this.budgetShown!.categories[index!] = category;
    });
    modalRef.componentInstance.categoryRemoveEvent.subscribe((remove: Boolean) => {
      if (remove) {
        this.budgetShown!.categories = this.budgetShown!.categories.filter(element => element != category);
        this.budgetShownParents = this.bs.getParentCategories(this.budgetShown!)
      }
    });
  }

  importDefault(oldBudget?: MonthlyBudget): void {
    if (!oldBudget){
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
    } else {
      let budget: MonthlyBudget = {
        income: oldBudget.income,
        date: Timestamp.now(),
        categories: oldBudget.categories
      }
      this.bs.addBudget(budget);
    }
  }

  commitChanges(): void {
    this.bs.editBudget(this.budgetShown!);
  }

  // Helper methods

  getTotalBudgeted(): number {
    let total = 0;
    this.bs.currBudget?.categories.forEach(category => {
      total = total + category.amount;
    });
    return Math.round(total * 100) / 100;
  }

  getRemainingToBudget(): number {
    let remaining = this.bs.currBudget!.income;
    this.bs.currBudget?.categories.forEach(category => {
      remaining = remaining - category.amount;
    });
    return Math.round(remaining * 100) / 100;
  }

  sortCategoryNames(): void {
    this.bs.currBudget?.categories.sort((a,b) => {
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

  // ngOnDestroy(): void {
  //   this.bs.
  // }

}
