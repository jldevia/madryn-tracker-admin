import { Injectable } from '@angular/core';
import { BehaviorSubject, from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Result } from 'src/app/models/result';
import { SubCategory } from 'src/app/models/subCategory';
import { SubCategoryService } from './subCategoryService.interface';
import { dbSucCategories } from './dbSubCategories';

@Injectable({
	providedIn: 'root'
})
export class SubCategoryMockService implements SubCategoryService {
	private dbSubCategories: SubCategory[] = [];
	private obsSubCategories: BehaviorSubject<SubCategory[]>;

	constructor() {
		//Se inicializa el observer
		this.obsSubCategories = new BehaviorSubject<SubCategory[]>(this.dbSubCategories);
	}
	addSubCategory(item: SubCategory): Promise<SubCategory> {
		throw new Error('Method not implemented.');
	}
	editSubCategory(item: SubCategory): Promise<SubCategory> {
		throw new Error('Method not implemented.');
	}

	getSubCategories(key: string | undefined): Observable<SubCategory[]> {
		if (typeof key === 'undefined') {
			throw new Error('Id. de categoria indefinido.');
		}

		return this.getSubCategoriesAll().pipe(
			map((data) => data.filter((subCategory) => subCategory.categoryId === key))
		);
	}

	getSubCategoriesAll(): Observable<SubCategory[]> {
		this.dbSubCategories = dbSucCategories as Array<SubCategory>;
		this.obsSubCategories.next(this.dbSubCategories);
		return this.obsSubCategories;
	}

	/*addSubCategory(item: SubCategory): Promise<Result> {
		const intRandom = this._ramdonInt(1, 100);
		item.id = `SUBCAT${intRandom}`;
		this.dbSubCategories.push(item);
		this.obsSubCategories.next(this.dbSubCategories);
		return Promise.resolve({
			msgOk: 'Sub-Categoría creada.'
		});
	}
	editSubCategory(item: SubCategory): Promise<Result> {
		const editedDB = this.dbSubCategories.map((value) => {
			let obj: SubCategory;
			if (value.id === item.id) {
				obj = item;
			} else {
				obj = value;
			}

			return obj;
		});

		this.dbSubCategories = editedDB;
		this.obsSubCategories.next(this.dbSubCategories);

		return Promise.resolve({
			msgOk: 'Sub-Categoría modificada.'
		});
	}*/
	deleteSubCategory(item: SubCategory): Promise<Result> {
		const newDB = this.dbSubCategories.filter((value) => value.id !== item.id);
		this.dbSubCategories = newDB;
		this.obsSubCategories.next(this.dbSubCategories);

		return Promise.resolve({
			msgOk: 'Sub-Categoría eliminada.'
		});
	}

	private _ramdonInt(min: number, max: number): number {
		return min + Math.floor((max - min) * Math.random());
	}
}
