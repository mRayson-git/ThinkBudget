import { Component, Input, OnInit } from '@angular/core';
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

  @Input() suggestion?: Suggestion;

  types: string[] = [
    "Feature Request",
    "Bug Report"
  ]

  suggestionForm: FormGroup = new FormGroup({
    type: new FormControl('', Validators.required),
    content: new FormControl('', Validators.required),
    complete: new FormControl(false, Validators.required)
  });

  constructor(public suggestionService: SuggestionService) { }

  ngOnInit(): void {
    if (this.suggestion) {
      this.suggestionForm.get('type')?.setValue(this.suggestion.type);
      this.suggestionForm.get('content')?.setValue(this.suggestion.content);
      this.suggestionForm.get('complete')?.setValue(this.suggestion.complete);
    }
  }

  addSuggestion(): void {
    let suggestion: Suggestion = {
      type: this.suggestionForm.get('type')!.value,
      date: Timestamp.now(),
      content: this.suggestionForm.get('content')!.value
    }
    this.suggestionService.addSuggestion(suggestion);
  }

  editSuggestion(): void {
    let suggestion: Suggestion = {
      id: this.suggestion?.id,
      type: this.suggestionForm.get('type')!.value,
      date: this.suggestion!.date,
      content: this.suggestionForm.get('content')!.value,
      complete: this.suggestionForm.get('complete')!.value
    }
    this.suggestionService.updateSuggestion(suggestion);
  }

}
