import { TestBed } from '@angular/core/testing';

import { CsvProfileService } from './csv-profile.service';

describe('CsvProfileService', () => {
  let service: CsvProfileService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CsvProfileService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
