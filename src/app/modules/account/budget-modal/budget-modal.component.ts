import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Budget } from 'src/app/interfaces/budget';
import { BudgetService } from 'src/app/services/budget.service';

@Component({
  selector: 'app-budget-modal',
  templateUrl: './budget-modal.component.html',
  styleUrls: ['./budget-modal.component.scss']
})
export class BudgetModalComponent implements OnInit {
  @Input() budget!: Budget;
  budgetForm: FormGroup = new FormGroup({
    categoryName: new FormControl('', Validators.required),
    budgetAmount: new FormControl('', Validators.required),
    budgetColour: new FormControl('', Validators.required)
  });

  constructor(private budgetService: BudgetService, private modalService: NgbModal) { }

  ngOnInit(): void {
    this.budgetForm.get('categoryName')?.setValue(this.budget.categoryName);
    this.budgetForm.get('budgetAmount')?.setValue(this.budget.budgetAmount);
    this.budgetForm.get('budgetColour')?.setValue(this.budget.budgetColour);
  }

  updateBudget(): void {
    let updatedBudget: Budget = this.budgetForm.value;
    updatedBudget.id = this.budget.id;
    this.budgetService.updateBudget(updatedBudget);
    this.modalService.dismissAll();
  }

  removeBudget(): void {
    this.budgetService.deleteBudget(this.budget.id!);
    this.modalService.dismissAll();
  }

}
