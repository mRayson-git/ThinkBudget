import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { CreateComponent } from './create/create.component';
import { SharedModule } from '../shared/shared.module';
import { AuthComponent } from './auth.component';

@NgModule({
  declarations: [
    LoginComponent,
    CreateComponent,
    AuthComponent
  ],
  imports: [
    CommonModule,
    SharedModule
  ]
})
export class AuthModule { }
