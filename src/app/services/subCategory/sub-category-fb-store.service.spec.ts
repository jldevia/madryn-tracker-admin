import { TestBed } from '@angular/core/testing';

import { SubCategoryFBStoreService } from './sub-category-fb-store.service';

describe('SubCategoryFBStoreService', () => {
  let service: SubCategoryFBStoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SubCategoryFBStoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
