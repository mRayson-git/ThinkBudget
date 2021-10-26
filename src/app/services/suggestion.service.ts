import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { Suggestion } from '../interfaces/suggestion';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root'
})
export class SuggestionService {

  suggestions$ = new Observable<Suggestion[]>();
  suggestionCollection!: AngularFirestoreCollection<Suggestion>;

  constructor(private afs: AngularFirestore, private auth: AngularFireAuth, private toastService: ToastService) { }

  init(): void {
    this.suggestionCollection = this.afs.collection<Suggestion>("/suggestions", ref => ref.orderBy('date', 'desc'));
    this.suggestions$ = this.suggestionCollection.valueChanges();
  }

  addSuggestion(suggestion: Suggestion){
    this.suggestionCollection.add(suggestion)
    .then(res => {
      this.toastService.show({ type: 'success', content: `Sent suggestion ${suggestion}` });
      suggestion.id = res.id;
      this.suggestionCollection.doc(res.id).set(suggestion, {merge: true});
    })
    .catch(error => this.toastService.show({ type: 'danger', content: `Could not add suggestion: ${error}` }));
  }

  updateSuggestion(suggestion: Suggestion): void {
    this.suggestionCollection.doc(suggestion.id).set(suggestion)
    .then(res => this.toastService.show({type: 'success', content: 'Updated budget'}))
    .catch(err => this.toastService.show({type: 'danger', content: `Could not update budget: ${err}`}));
  }
}
