import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Budget } from 'src/app/interfaces/budget';
import { BudgetService } from 'src/app/services/budget.service';
import { ToastService } from 'src/app/services/toast.service';
import { BudgetModalComponent } from '../budget-modal/budget-modal.component';

@Component({
  selector: 'app-budget-creator',
  templateUrl: './budget-creator.component.html',
  styleUrls: ['./budget-creator.component.scss']
})
export class BudgetCreatorComponent implements OnInit {
  budgetForm: FormGroup = new FormGroup({
    tracked: new FormControl(true),
    categoryName: new FormControl('', Validators.required),
    budgetAmount: new FormControl('', Validators.required),
    budgetColour: new FormControl('', Validators.required)
  });

  categories: string[] = [
    "Groceries",
    "Rent",
    "Electricity"
  ]

  budgets: Budget[] = [];

  constructor(private toastService: ToastService, public budgetService: BudgetService, private modalService: NgbModal) { }

  ngOnInit(): void {
    this.budgetService.budget$.subscribe(budgets => {
      this.budgets = budgets;
      this.budgets.sort((a, b) => {
        if (a.categoryName.toUpperCase() < b.categoryName.toUpperCase()) {
          return -1;
        }
        else if (a.categoryName.toUpperCase() > b.categoryName.toUpperCase()) {
          return 1;
        }
        else {
          return 0;
        }
      });
      this.budgets.forEach(budget => {
        if (this.categories.find(name => name == budget.categoryName) == undefined){
          this.categories.push(budget.categoryName);
        }
      });
    });
  }

  addBudget(): void {
    console.log(this.budgetForm.value);
    this.budgetService.addBudget(this.budgetForm.value);
    this.budgetForm.reset({
      tracked: true,
      categoryName: '',
    });
  }

  editBudget(budget: Budget): void {
    const modalRef = this.modalService.open(BudgetModalComponent, { centered: true, size: 'lg' });
    modalRef.componentInstance.budget = budget;
  }

  getTotalBudgeted(): number {
    let total = 0;
    this.budgets.forEach(budget => {
      if (budget.tracked) {
        total = total + budget.budgetAmount;
      }
    });
    return total;
  }

  budgetInfo(): void{
    this.toastService.show({ type: 'info', content: 'Click on the table rows to alter the individual budgets', delay: 10000 });
  }
}
