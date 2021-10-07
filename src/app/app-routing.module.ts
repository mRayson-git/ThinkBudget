import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Error404Component } from './modules/core/error404/error404.component';
import { HomepageComponent } from './modules/core/homepage/homepage.component';
import { CreateComponent } from './modules/auth/create/create.component';
import { LoginComponent } from './modules/auth/login/login.component';
import { AccountSettingsComponent } from './modules/account/account-settings/account-settings.component';

import { AngularFireAuthGuard, redirectUnauthorizedTo } from '@angular/fire/compat/auth-guard';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['login']);

const routes: Routes = [
  { path: 'homepage', component: HomepageComponent },
  { path: 'login', component: LoginComponent },
  { path: 'create', component: CreateComponent },
  { path: 'account/settings', component: AccountSettingsComponent, canActivate: [AngularFireAuthGuard], data: { authGuardPipe: redirectUnauthorizedToLogin } },
  { path: '', redirectTo: 'homepage', pathMatch: 'full'},
  { path: '**', component: Error404Component }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
