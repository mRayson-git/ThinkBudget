import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FormControl, FormGroup } from '@angular/forms';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Budget } from 'src/app/interfaces/budget';
import { Parser } from 'src/app/interfaces/parser';
import { BudgetService } from 'src/app/services/budget.service';
import { CsvProfileService } from 'src/app/services/csv-profile.service';
import { ToastService } from 'src/app/services/toast.service';
import { BudgetModalComponent } from '../budget-modal/budget-modal.component';
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
  budgets?: Budget[] = [];

  constructor(public auth: AngularFireAuth,
    public toastService: ToastService,
    public modalService: NgbModal,
    public csvPS: CsvProfileService,
    public budgetService: BudgetService) { }

  ngOnInit(): void {
    this.auth.currentUser.then(user => {
      console.log(`${user?.email}`);
      this.accountForm.get('displayname')?.setValue(user?.displayName);
      this.accountForm.get('email')?.setValue(user?.email);
    });
    this.csvPS.parsers$.subscribe(result => {
      this.parsers = result;
    });
    this.budgetService.budget$.subscribe(result => {
      this.budgets = result;
    });
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

  editBudget(budget: Budget): void {
    const modalRef = this.modalService.open(BudgetModalComponent, { centered: true, size: 'lg' });
    modalRef.componentInstance.budget = budget;
  }
}
