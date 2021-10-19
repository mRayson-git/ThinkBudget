import { Component, HostListener } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  @HostListener('window:beforeunload', ['$event'])
  beforeUnloadHandler(event: any){
    this.auth.signOut();
  }

  title = 'ThinkBudget';
  constructor(private auth: AngularFireAuth) {
  }
}
