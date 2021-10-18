import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// Firebase
import { environment } from '../environments/environment';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from './modules/shared/shared.module';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFireModule } from '@angular/fire/compat';
import { CoreModule } from './modules/core/core.module';
import { AuthModule } from './modules/auth/auth.module';
import { AccountModule } from './modules/account/account.module';
import { TransactionsModule } from './modules/transactions/transactions.module';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { BudgetModule } from './modules/budget/budget.module';


@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
    AngularFirestoreModule.enablePersistence(),
    BrowserAnimationsModule,
    SharedModule,
    CoreModule,
    AuthModule,
    AccountModule,
    TransactionsModule,
    BudgetModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
