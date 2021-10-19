import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Parser } from '../interfaces/parser';
import { AngularFirestore, AngularFirestoreCollection, QuerySnapshot } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root'
})
export class CsvProfileService {
  parsers$ = new Observable<Parser[]>();

  parserCollection!: AngularFirestoreCollection<Parser>;

  constructor(private afs: AngularFirestore, private auth: AngularFireAuth, private toastService: ToastService) {
    
  }

  saveParser(parser: Parser): void {
    this.parserCollection.add(parser)
    .then(res => {
      this.toastService.show({ type: 'success', content: `Added parser ${parser.accountName}` });
      parser.id = res.id;
      this.parserCollection.doc(res.id).set(parser, {merge: true});
    })
    .catch(error => this.toastService.show({ type: 'danger', content: `Could not add parser: ${error}` }));
  }

  updateParser(parser: Parser): void {
    this.parserCollection.doc(parser.id).set(parser)
    .then(res => this.toastService.show({type: 'success', content: 'Updated parser'}))
    .catch(err => this.toastService.show({type: 'danger', content: `Could not update parser: ${err}`}))
  }

  deleteParser(parser: Parser): void {
    this.parserCollection.doc(parser.id).delete()
    .then(res => this.toastService.show({type: 'success', content: 'Parsing profile has been deleted'}))
    .catch(err => this.toastService.show({type: 'danger', content: `Could not delete parser: ${err}`}))
  }

  init(): void {
    this.auth.currentUser.then(user => {
      this.parserCollection = this.afs.collection<Parser>(user?.uid + '/resources/parsers', ref => ref.orderBy('accountName', 'asc'));
      this.parsers$ = this.parserCollection.valueChanges();
    });
  }
}
