import { Injectable, TemplateRef } from '@angular/core';
import { Toast } from '../interfaces/toast';

@Injectable({ providedIn: 'root' })
export class ToastService {
  toasts: Toast[] = [];

  show(toast: Toast) {
    if (toast.type == 'danger') {
      toast.classname = 'bg-danger text-light';
    } else if (toast.type == 'success') {
      toast.classname = 'bg-success text-light';
    } else if (toast.type == 'info') {
      toast.classname = 'bg-info text-light';
    } else if (toast.type == 'warn') {
      toast.classname = 'bg-warn text-dark';
    } else {
      toast.classname = 'bg-primary text-light';
    }
    console.log("Adding toast: " + toast.content);
    this.toasts.push(toast);
  }

  remove(toast: Toast) {
    this.toasts = this.toasts.filter(t => t !== toast);
  }
}
