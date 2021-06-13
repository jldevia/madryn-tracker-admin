import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Category } from 'src/app/models/category';
import { Result } from 'src/app/models/result';
import { SubCategory } from 'src/app/models/subCategory';
import { SubCategoryService } from './subCategoryService.interface';
import { dbSucCategories } from './dbSubCategories';

@Injectable({
  providedIn: 'root',
})
export class SubCategoryMockService implements SubCategoryService {
  private dbSubCategories: SubCategory[];
  private obsSubCategories: BehaviorSubject<SubCategory[]>;

  constructor() {
    //Se inicializa la BD
    this.dbSubCategories = dbSucCategories as Array<SubCategory>;
    this.obsSubCategories = new BehaviorSubject<SubCategory[]>(
      this.dbSubCategories
    );
  }
  getSubCategories(categoryId: string | undefined): Observable<SubCategory[]> {
    if (typeof categoryId !== 'undefined') {
      let result = this.dbSubCategories.filter(
        (item) => item.categoryId === categoryId
      );
      this.obsSubCategories.next(result);
    }

    return this.obsSubCategories;
  }
  getSubCategoriesAll(): Observable<SubCategory[]> {
    this.obsSubCategories.next(this.dbSubCategories);
    return this.obsSubCategories;
  }
  addSubCategory(item: SubCategory): Promise<Result> {
    let intRandom = this._ramdonInt(1, 100);
    item.id = `SUBCAT${intRandom}`;
    this.dbSubCategories.push(item);
    this.obsSubCategories.next(this.dbSubCategories);
    return Promise.resolve({
      msgOk: 'Sub-Categoría creada.',
    });
  }
  editSubCategory(item: SubCategory): Promise<Result> {
    let editedDB = this.dbSubCategories.map((value) => {
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
      msgOk: 'Sub-Categoría modificada.',
    });
  }
  deleteSubCategory(item: SubCategory): Promise<Result> {
    let newDB = this.dbSubCategories.filter((value) => value.id !== item.id);
    this.dbSubCategories = newDB;
    this.obsSubCategories.next(this.dbSubCategories);

    return Promise.resolve({
      msgOk: 'Sub-Categoría eliminada.',
    });
  }

  private _ramdonInt(min: number, max: number): number {
    return min + Math.floor((max - min) * Math.random());
  }
}
