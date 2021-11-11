import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Category } from 'src/app/interfaces/category';

@Component({
  selector: 'app-budget-modal',
  templateUrl: './budget-modal.component.html',
  styleUrls: ['./budget-modal.component.scss']
})
export class BudgetModalComponent implements OnInit {
  @Input() category!: Category;
  @Output() categoryEditEvent = new EventEmitter<Category>();
  @Output() categoryRemoveEvent = new EventEmitter<Boolean>();

  categoryForm: FormGroup = new FormGroup({
    parent: new FormControl(''),
    name: new FormControl('', Validators.required),
    amount: new FormControl('', Validators.required),
    colour: new FormControl('', Validators.required)
  });

  constructor(private modalService: NgbModal) { }

  ngOnInit(): void {
    this.categoryForm.get('parent')?.setValue(this.category.parent);
    this.categoryForm.get('name')?.setValue(this.category.name);
    this.categoryForm.get('amount')?.setValue(this.category.amount);
    this.categoryForm.get('colour')?.setValue(this.category.colour);
  }

  updateCategory(): void {
    this.category = this.categoryForm.value;
    this.categoryEditEvent.emit(this.category);
    this.modalService.dismissAll();
  }

  removeCategory(): void {
    this.categoryRemoveEvent.emit(true);
    this.modalService.dismissAll();
  }

}
