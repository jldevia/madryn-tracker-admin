import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Category } from '../../models/category';
import { Result } from '../../models/result';
import { CategoryService } from './category.serv.interface';
import { db } from './dbCategories';

@Injectable({
  providedIn: 'root',
})
export class CategoryMockService implements CategoryService {
  private dbCategories: Category[];
  private subject: BehaviorSubject<Category[]>;

  constructor() {
    //Se crea la BD
    this.dbCategories = db as Array<Category>;
    this.subject = new BehaviorSubject<Category[]>(this.dbCategories);
  }
  getCategories(): Observable<Category[]> {
    return this.subject;
  }
  addCategory(item: Category): Promise<Result> {
    let intRandom = this._ramdonInt(1, 50);
    item.id = `XXXYYY${intRandom}`;
    this.dbCategories.push(item);
    this.subject.next(this.dbCategories);
    return Promise.resolve({
      msgOk: 'Categoría creada.',
    });
  }
  editCategory(item: Category): Promise<Result> {
    let newDB = this.dbCategories.map((element) => {
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
    });
  }
  deleteCategory(item: Category): Promise<Result> {
    let newDB = this.dbCategories.filter((element) => element.id != item.id);
    this.dbCategories = newDB as Array<Category>;
    this.subject.next(this.dbCategories);

    return Promise.resolve({
      msgOk: 'Categoria eliminada.',
    });
  }

  private _ramdonInt(min: number, max: number): number {
    return min + Math.floor((max - min) * Math.random());
  }
}
