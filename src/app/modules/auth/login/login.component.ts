import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BudgetService } from 'src/app/services/budget.service';
import { CsvProfileService } from 'src/app/services/csv-profile.service';
import { SuggestionService } from 'src/app/services/suggestion.service';
import { ToastService } from 'src/app/services/toast.service';
import { TransactionService } from 'src/app/services/transaction.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup = new FormGroup({
    email: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
  });
  constructor(public auth: AngularFireAuth,
    private toastService: ToastService,
    private router: Router,
    private ts: TransactionService,
    private bs: BudgetService,
    private csvS: CsvProfileService,
    private ss: SuggestionService) { }

  ngOnInit(): void {
  }

  goToSignup(): void {
    this.router.navigate(['/create']);
  }

  login(): void {
    this.auth.signInWithEmailAndPassword(this.loginForm.get('email')!.value, this.loginForm.get('password')!.value).then(result => {
      console.log(result);
      this.toastService.show({ type: 'success', content: 'Logged in!' });
      this.ts.init();
      this.bs.init();
      this.csvS.init();
      this.ss.init();
      this.router.navigate(['/']);
    }).catch(error => {
      this.loginForm.reset();
      this.toastService.show({ type: 'danger', content: error.message });
    });
  }

}
