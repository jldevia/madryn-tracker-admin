import { Observable } from 'rxjs';
import { Category } from 'src/app/models/category';
import { Result } from 'src/app/models/result';
import { SubCategory } from 'src/app/models/subCategory';

export interface SubCategoryService {
	//CRUD of Sub-Category
	getSubCategories(categoryId: string): Observable<SubCategory[]>;

	getSubCategoriesAll(): Observable<SubCategory[]>;

	addSubCategory(item: SubCategory): Promise<SubCategory>;

	editSubCategory(item: SubCategory): Promise<SubCategory>;

	deleteSubCategory(item: SubCategory): Promise<Result>;
}
