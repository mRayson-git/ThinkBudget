import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Parser } from 'src/app/interfaces/parser';
import { CsvProfileService } from 'src/app/services/csv-profile.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {
  parserForm: FormGroup = new FormGroup({
    hasHeader: new FormControl(true),
    accountName: new FormControl('', Validators.required),
    accountType: new FormControl('', Validators.required),
    dateCol: new FormControl('', Validators.required),
    amountCol: new FormControl('', Validators.required),
    payeeCol: new FormControl('', Validators.required),
    typeCol: new FormControl('', Validators.required)
  });
  constructor(public modalService: NgbModal, public csvPS: CsvProfileService) { }
  @Input() parser?: Parser;

  ngOnInit(): void {
    if (this.parser) {
      console.log(this.parser);
      this.parserForm.get('hasHeader')?.setValue(this.parser.hasHeader);
      this.parserForm.get('accountName')?.setValue(this.parser.accountName);
      this.parserForm.get('accountType')?.setValue(this.parser.accountType);
      this.parserForm.get('dateCol')?.setValue(this.parser.dateCol);
      this.parserForm.get('amountCol')?.setValue(this.parser.amountCol);
      this.parserForm.get('payeeCol')?.setValue(this.parser.payeeCol);
      this.parserForm.get('typeCol')?.setValue(this.parser.typeCol);
    }
  }

  submitProfile(): void {
    // if it exists, update
    if (this.parser){
      let updatedParser: Parser = this.parserForm.value;
      updatedParser.id = this.parser.id;
      this.csvPS.updateParser(updatedParser);
    }
    // else make a new one
    else {
      let parser: Parser = this.parserForm.value;
      this.csvPS.saveParser(parser);
      console.log(parser);
    }
    this.modalService.dismissAll();
  }

  deleteParser(): void {
    this.csvPS.deleteParser(this.parser!);
    this.modalService.dismissAll();
  }
}
