import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FormControl, FormGroup } from '@angular/forms';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { MonthlyBudget } from 'src/app/interfaces/monthly-budget';
import { Parser } from 'src/app/interfaces/parser';
import { CsvProfileService } from 'src/app/services/csv-profile.service';
import { MonthlyBudgetService } from 'src/app/services/monthly-budget.service';
import { ToastService } from 'src/app/services/toast.service';
import { BudgetModalComponent } from '../../budget/budget-modal/budget-modal.component';
import { ModalComponent } from '../modal/modal.component';

@Component({
  selector: 'app-account-settings',
  templateUrl: './account-settings.component.html',
  styleUrls: ['./account-settings.component.scss']
})
export class AccountSettingsComponent implements OnInit {
  accountForm: FormGroup = new FormGroup ({
    displayname: new FormControl(''),
    email: new FormControl(''),
  });
  parsers: Parser[] = [];
  currBudget?: MonthlyBudget;
  currParentCategories: string[] = [];

  constructor(public auth: AngularFireAuth,
    public toastService: ToastService,
    public modalService: NgbModal,
    public csvPS: CsvProfileService,
    public bs: MonthlyBudgetService) { }

  ngOnInit(): void {
    this.auth.currentUser.then(user => {
      console.log(`${user?.email}`);
      this.accountForm.get('displayname')?.setValue(user?.displayName);
      this.accountForm.get('email')?.setValue(user?.email);
    });
    this.csvPS.parsers$.subscribe(result => {
      this.parsers = result;
    });
    console.log(this.bs.currBudget);
    this.getCategories(this.bs.currBudget);
  }

  updateAccount(): void {
    this.auth.currentUser.then(user => {
      user?.updateProfile({ displayName: this.accountForm.get('displayname')?.value })
      .then(success => this.toastService.show({ type: 'success', content: 'Updated displayname'}))
      .catch(err => this.toastService.show({ type: 'danger', content: err.message }));
      user?.updateEmail(this.accountForm.get('email')?.value)
      .then(success => this.toastService.show({ type: 'success', content: 'Updated email'}))
      .catch(err => this.toastService.show({ type: 'danger', content: err.message }));
    });
  }

  bankInfo(): void{
    this.toastService.show({ type: 'info', content: 'This is where you set your profiles to let ThinkBudget know how to handle your financial records', delay: 10000 });
  }

  budgetInfo(): void{
    this.toastService.show({ type: 'info', content: 'This is where your current budget lives', delay: 10000 });
  }

  openParserDialog(): void {
    const modalRef = this.modalService.open(ModalComponent, { centered: true, size: 'lg' });
  }

  openParserUpdateDialog(parser: Parser): void {
    const modalRef = this.modalService.open(ModalComponent, { centered: true, size: 'lg' });
    modalRef.componentInstance.parser = parser;
  }

  getCategories(budget: MonthlyBudget | undefined): void {
    if (budget){
      budget.categories.forEach(category => {
        if (!this.currParentCategories.find(parent => parent == category.parent)) {this.currParentCategories.push(category.parent)}
      });
    }
  }

}
