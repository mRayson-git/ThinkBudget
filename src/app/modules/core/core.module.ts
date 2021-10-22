import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Error404Component } from './error404/error404.component';
import { HomepageComponent } from './homepage/homepage.component';
import { NavbarComponent } from './navbar/navbar.component';
import { SharedModule } from '../shared/shared.module';
import { ToastContainerComponent } from './toast-container/toast-container.component';
import { SuggestionsComponent } from './suggestions/suggestions.component';
import { SuggestionModalComponent } from './suggestion-modal/suggestion-modal.component';



@NgModule({
  declarations: [
    Error404Component,
    HomepageComponent,
    NavbarComponent,
    ToastContainerComponent,
    SuggestionsComponent,
    SuggestionModalComponent
  ],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports: [
    NavbarComponent,
    ToastContainerComponent
  ]
})
export class CoreModule { }
