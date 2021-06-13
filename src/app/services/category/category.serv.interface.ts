import { Observable } from 'rxjs';
import { Category } from '../../models/category';
import { Result } from '../../models/result';

export interface CategoryService {
  //  CRUD de categorias
  getCategories(): Observable<Category[]>;

  addCategory(item: Category): Promise<Result>;

  editCategory(item: Category): Promise<Result>;

  deleteCategory(item: Category): Promise<Result>;
}
