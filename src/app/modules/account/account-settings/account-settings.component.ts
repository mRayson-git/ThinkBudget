import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FormControl, FormGroup } from '@angular/forms';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Parser } from 'src/app/interfaces/parser';
import { CsvProfileService } from 'src/app/services/csv-profile.service';
import { ToastService } from 'src/app/services/toast.service';
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
  

  constructor(public auth: AngularFireAuth,
    public toastService: ToastService,
    public modalService: NgbModal,
    public csvPS: CsvProfileService) { }

  ngOnInit(): void {
    this.auth.currentUser.then(user => {
      console.log(`${user?.email}`);
      this.accountForm.get('displayname')?.setValue(user?.displayName);
      this.accountForm.get('email')?.setValue(user?.email);
    });
    this.csvPS.parsers$.subscribe(result => {
      this.parsers = result;
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

  openParserDialog(): void {
    const modalRef = this.modalService.open(ModalComponent, { centered: true, size: 'lg' });
  }

  openParserUpdateDialog(parser: Parser): void {
    const modalRef = this.modalService.open(ModalComponent, { centered: true, size: 'lg' });
    modalRef.componentInstance.parser = parser;
  }
}
