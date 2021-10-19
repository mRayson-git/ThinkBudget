import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Error404Component } from './modules/core/error404/error404.component';
import { HomepageComponent } from './modules/core/homepage/homepage.component';
import { CreateComponent } from './modules/auth/create/create.component';
import { LoginComponent } from './modules/auth/login/login.component';
import { AccountSettingsComponent } from './modules/account/account-settings/account-settings.component';

import { AngularFireAuthGuard, redirectUnauthorizedTo } from '@angular/fire/compat/auth-guard';
import { TransactionListComponent } from './modules/transactions/transaction-list/transaction-list.component';
import { BudgetCreatorComponent } from './modules/budget/budget-creator/budget-creator.component';
import { OverviewComponent } from './modules/budget/overview/overview.component';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['login']);

const routes: Routes = [
  { path: 'homepage', component: HomepageComponent },
  { path: 'login', component: LoginComponent },
  { path: 'create', component: CreateComponent },
  { path: 'account/settings', component: AccountSettingsComponent, canActivate: [AngularFireAuthGuard], data: { authGuardPipe: redirectUnauthorizedToLogin } },
  { path: 'transaction-list', component: TransactionListComponent, canActivate: [AngularFireAuthGuard], data: { authGuardPipe: redirectUnauthorizedToLogin } },
  { path: 'account/budget-creator', component: BudgetCreatorComponent, canActivate: [AngularFireAuthGuard], data: { authGuardPipe: redirectUnauthorizedToLogin } },
  { path: 'budget', component: OverviewComponent, canActivate: [AngularFireAuthGuard], data: { authGuardPipe: redirectUnauthorizedToLogin } },
  { path: '', redirectTo: 'homepage', pathMatch: 'full'},
  { path: '**', component: Error404Component }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
