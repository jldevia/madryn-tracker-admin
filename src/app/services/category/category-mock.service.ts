import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Category } from '../../models/category';
import { Result } from '../../models/result';
import { CategoryService } from './category.serv.interface';

@Injectable({
	providedIn: 'root'
})
export class CategoryMockService implements CategoryService {
	private dbCategories!: Category[];
	private subject: BehaviorSubject<Category[]>;

	constructor(private httpClient: HttpClient) {
		this.subject = new BehaviorSubject<Category[]>([]);
	}
	getCategories(): Observable<Category[]> {
		this.httpClient.get<Category[]>('http://localhost:3000/categories').subscribe((resp) => {
			this.dbCategories = resp;
			this.subject.next(this.dbCategories);
		});

		return this.subject;
	}
	addCategory(item: Category): Promise<Category> {
		const intRandom = this._ramdonInt(1, 50);
		item.id = `XXXYYY${intRandom}`;
		return this.httpClient.post<Category>('http://localhost:3000/categories', item).toPromise();
	}
	editCategory(item: Category): Promise<Category> {
		/*let newDB = this.dbCategories.map((element) => {
      let obj: Category = {};

      if (element.id == item.id) {
        obj = item;
      } else {
        obj = element;
      }

      return obj;
    }) as Array<Category>;

    this.dbCategories = newDB;
    this.subject.next(this.dbCategories);

    return Promise.resolve({
      msgOk: 'Categoría modificada.',
    });*/

		return this.httpClient
			.put<Category>(`http://localhost:3000/categories/${item.id}`, item)
			.toPromise();
	}
	deleteCategory(item: Category): Promise<Result> {
		const newDB = this.dbCategories.filter((element) => element.id != item.id);
		this.dbCategories = newDB;
		this.subject.next(this.dbCategories);

		return Promise.resolve({
			msgOk: 'Categoria eliminada.'
		});
	}

	private _ramdonInt(min: number, max: number): number {
		return min + Math.floor((max - min) * Math.random());
	}
}
