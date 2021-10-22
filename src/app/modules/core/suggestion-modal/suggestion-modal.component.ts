import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Timestamp } from 'firebase/firestore';
import { Suggestion } from 'src/app/interfaces/suggestion';
import { SuggestionService } from 'src/app/services/suggestion.service';

@Component({
  selector: 'app-suggestion-modal',
  templateUrl: './suggestion-modal.component.html',
  styleUrls: ['./suggestion-modal.component.scss']
})
export class SuggestionModalComponent implements OnInit {

  types: string[] = [
    "Feature Request",
    "Bug Report"
  ]

  suggestionForm: FormGroup = new FormGroup({
    type: new FormControl('', Validators.required),
    content: new FormControl('', Validators.required)
  });

  constructor(public suggestionService: SuggestionService) { }

  ngOnInit(): void {
  }

  addSuggestion(): void {
    let suggestion: Suggestion = {
      type: this.suggestionForm.get('type')!.value,
      date: Timestamp.now(),
      content: this.suggestionForm.get('content')!.value
    }
    this.suggestionService.addSuggestion(suggestion);
  }

}
