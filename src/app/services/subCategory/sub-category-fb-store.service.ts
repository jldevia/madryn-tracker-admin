import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { BehaviorSubject, Observable } from 'rxjs';
import { SubCategory } from 'src/app/models/subCategory';
import { LoadingService } from '../loading.service';

@Injectable({
	providedIn: 'root'
})
export class SubCategoryFBStoreService {
	private subCategories: SubCategory[] = [];
	private subCategories$: BehaviorSubject<SubCategory[]> = new BehaviorSubject<SubCategory[]>([]);

	get subCategoriesObservable(): Observable<SubCategory[]> {
		return this.subCategories$.asObservable();
	}

	constructor(private fireStore: AngularFirestore, private loadingService: LoadingService) {}

  private getAllSubcategories(): Observable<SubCategory[]> {
    this.loadingService.showLoading();

    
  }
}
