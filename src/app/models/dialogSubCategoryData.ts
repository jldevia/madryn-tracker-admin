import { Category } from './category';
import { DialogCategoryData } from './dialogCategoyData';

export interface DialogSubCategoryData extends DialogCategoryData {
	categoriaId: string;
	categorias: Category[];
}
