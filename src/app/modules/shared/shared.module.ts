import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ChartsModule } from 'ng2-charts';


@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    RouterModule,
    NgbModule,
    ChartsModule
  ],
  exports: [
    ReactiveFormsModule,
    RouterModule,
    NgbModule,
    ChartsModule
  ]
})
export class SharedModule { }
