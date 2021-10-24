import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { checkPercentages } from '../validators/checkPercentages';

@Component({
  selector: 'app-budget-helper',
  templateUrl: './budget-helper.component.html',
  styleUrls: ['./budget-helper.component.scss']
})
export class BudgetHelperComponent implements OnInit {
  budgetForm: FormGroup = new FormGroup({
    income: new FormControl('', Validators.required),
    food: new FormControl('', Validators.required),
    insurance: new FormControl('', Validators.required),
    personal: new FormControl('', Validators.required),
    saving: new FormControl('', Validators.required),
    transportation: new FormControl('', Validators.required),
    utilities: new FormControl('', Validators.required),
    housing: new FormControl('', Validators.required),
    misc: new FormControl('', Validators.required),
  }, { validators: checkPercentages });

  constructor() { }

  ngOnInit(): void {
  }

  createBudget(): void {

  }

}
