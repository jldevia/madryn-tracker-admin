import { Observable } from 'rxjs';
import { Category } from 'src/app/models/category';
import { Result } from 'src/app/models/result';
import { SubCategory } from 'src/app/models/subCategory';

export interface SubCategoryService {
  //CRUD of Sub-Category
  getSubCategories(categoryId: string): Observable<Array<SubCategory>>;

  getSubCategoriesAll(): Observable<Array<SubCategory>>;

  addSubCategory(item: SubCategory): Promise<Result>;

  editSubCategory(item: SubCategory): Promise<Result>;

  deleteSubCategory(item: SubCategory): Promise<Result>;
}
