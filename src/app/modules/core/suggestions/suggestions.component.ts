import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Timestamp } from 'firebase/firestore';
import { Suggestion } from 'src/app/interfaces/suggestion';
import { SuggestionService } from 'src/app/services/suggestion.service';
import { SuggestionModalComponent } from '../suggestion-modal/suggestion-modal.component';

@Component({
  selector: 'app-suggestions',
  templateUrl: './suggestions.component.html',
  styleUrls: ['./suggestions.component.scss']
})
export class SuggestionsComponent implements OnInit {
  suggestions!: Suggestion[];

  constructor(public suggestionService: SuggestionService, public modalService: NgbModal) { }

  ngOnInit(): void {
    this.suggestionService.suggestions$.subscribe(suggestions => this.suggestions = suggestions);
  }

  addSuggestion(): void {
    const modalRef = this.modalService.open(SuggestionModalComponent, { centered: true, size: 'lg' });
  }

  editSuggestion(suggestion: Suggestion): void {
    const modalRef = this.modalService.open(SuggestionModalComponent, { centered: true, size: 'lg' });
    modalRef.componentInstance.suggestion = suggestion;
  }

}
