import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FormGroup, FormControl, Validators, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { ToastService } from 'src/app/services/toast.service';
import { Toast } from 'src/app/interfaces/toast';
import { Router } from '@angular/router';
import { checkPasswords } from '../validators/password';
import { BudgetService } from 'src/app/services/budget.service';
import { CsvProfileService } from 'src/app/services/csv-profile.service';
import { TransactionService } from 'src/app/services/transaction.service';
import { SuggestionService } from 'src/app/services/suggestion.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit {
  createForm: FormGroup = new FormGroup({
    email: new FormControl('', Validators.required),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    cpassword: new FormControl('', Validators.required),
  }, { validators: checkPasswords });
  constructor(public auth: AngularFireAuth,
    public toastService: ToastService,
    private router: Router,
    private ts: TransactionService,
    private bs: BudgetService,
    private csvS: CsvProfileService,
    private ss: SuggestionService) { }

  ngOnInit(): void {
  }

  createAccount(): void {
    this.auth.createUserWithEmailAndPassword(this.createForm.get('email')!.value, this.createForm.get('password')!.value).then(result => {
      console.log(result);
      this.toastService.show({ type: 'success', content: 'Account created' });
      this.ts.init();
      this.bs.init();
      this.csvS.init();
      this.ss.init();
      this.router.navigate(['/']);
    }).catch(error => {
      this.toastService.show({ type: 'danger', content: error.message });
    });
  }

  isInValid(formControlName: string): boolean | undefined {
    return !this.createForm.get(formControlName)!.valid && this.createForm.get(formControlName)!.touched;
  }

  

}
