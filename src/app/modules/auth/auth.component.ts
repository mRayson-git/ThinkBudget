import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {
  formType = "";

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    // this.route.queryParams.subscribe
  }

}
