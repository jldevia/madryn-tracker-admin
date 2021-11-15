import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { BehaviorSubject, Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';
import { Category } from 'src/app/models/category';
import { LoadingService } from '../loading.service';
import { SubCategoryFBStoreService } from '../subCategory/sub-category-fb-store.service';

@Injectable({
	providedIn: 'root'
})
export class CategoryFBStore {
	private categories: Category[] = [];
	private categories$: BehaviorSubject<Category[]> = new BehaviorSubject<Category[]>([]);
	get categoriesObservable(): Observable<Category[]> {
		return this.categories$.asObservable();
	}
	get categoriesValues(): Category[] {
		return this.categories;
	}
	constructor(private firestore: AngularFirestore,
		private loadingService: LoadingService,
		private subCategoryService: SubCategoryFBStoreService) {
		this.getAllCategories().subscribe((data) => {
			this.categories = data;
			this.categories$.next(this.categories);
		});
	}

	private getAllCategories(): Observable<Category[]> {
		this.loadingService.showLoading();
		return this.firestore
			.collection<Category>('categorias')
			.get()
			.pipe(
				map((data) =>
					data.docs.map((doc) => {
						const { nombre, descripcion } = doc.data();
						return { id: doc.id, nombre: nombre, descripcion: descripcion } as Category;
					})
				),
				finalize(() => this.loadingService.hideLoading())
			);
	}

	addCategory(item: Category): Promise<Category> {
		return this.firestore
			.collection<Category>('categorias')
			.add({ nombre: item.nombre, descripcion: item.descripcion })
			.then((doc) => {
				const newCategory = {
					id: doc.id,
					nombre: item.nombre,
					descripcion: item.descripcion
				} as Category;
				this.categories.push(newCategory);
				this.categories$.next(this.categories);
				return newCategory;
			});
	}
	editCategory(category: Category): Promise<Category> {
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		return this.firestore
			.doc<Category>(`categorias/${category.id!}`)
			.update({ nombre: category.nombre, descripcion: category.descripcion })
			.then(() => {
				this.categories = this.categories.map((element) => {
					if (element.id === category.id) {
						return category;
					}
					return element;
				});
				this.categories$.next(this.categories);
				return category;
			});
	}
	async deleteCategory(category: Category): Promise<void> {
		const numberSubcategories = await this.subCategoryService.numberOfSubcategories(category);

		if (numberSubcategories > 0) {
			return Promise.reject(new Error('La categoría tienen subcategorías asociadas.'));
		}

		return this.firestore
			.doc<Category>(`categorias/${category.id!}`)
			.delete()
			.then(() => {
				this.categories = this.categories.filter((element) => element.id !== category.id);
				this.categories$.next(this.categories);
			});
	}
}
