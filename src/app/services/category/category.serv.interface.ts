import { Observable } from 'rxjs';
import { Category } from '../../models/category';
import { Result } from '../../models/result';

export interface CategoryService {
	//  CRUD de categorias
	getCategories(): Observable<Category[]>;

	addCategory(item: Category): Promise<Category>;

	editCategory(item: Category): Promise<Category>;

	deleteCategory(item: Category): Promise<Result>;
}
