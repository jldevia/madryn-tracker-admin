import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { BehaviorSubject, Observable } from 'rxjs';
import { Category } from 'src/app/models/category';
import { SubCategory } from 'src/app/models/subCategory';
import { LoadingService } from '../loading.service';
import { SitesFBService } from '../sites/sites-fb.service';

@Injectable({
	providedIn: 'root'
})
export class SubCategoryFBStoreService {
	private subCategories$: BehaviorSubject<SubCategory[]> = new BehaviorSubject<SubCategory[]>([]);

	get subCategoriesObservable(): Observable<SubCategory[]> {
		return this.subCategories$.asObservable();
	}

	constructor(private fireStore: AngularFirestore,
		private loadingService: LoadingService,
		private sitesServices: SitesFBService) {}

	public getSubcategories(categoryId: string): Observable<SubCategory[]> {
		this.fireStore.collection<SubCategory>(`categorias/${categoryId}/subcategorias`)
				.get()
				.subscribe( doc => {
					const subCategories = doc.docs.map( item => {
						const {nombre, descripcion} = item.data();
						return {id: item.id, nombre: nombre, descripcion: descripcion, categoryId: categoryId} as SubCategory;
					});
					this.subCategories$.next(subCategories);
				});

		return this.subCategoriesObservable;
	}

	public addSubcategory(item: SubCategory): Promise<SubCategory> {
		if(!item.categoryId){
			return Promise.reject(new Error('Categoría indefinida.'));
		}
		return this.fireStore.collection<SubCategory>(`categorias/${item.categoryId}/subcategorias`)
			.add({nombre: item.nombre, descripcion: item.descripcion})
			.then( doc => {
				const newSubcategory = {
					id: doc.id,
					nombre: item.nombre,
					descripcion: item.descripcion
				} as SubCategory;
				void this.getSubcategories(item.categoryId || '');
				return newSubcategory;
			} );			
	}

	public editSubcategory(item: SubCategory): Promise<SubCategory> {
		if(!item.categoryId){
			return Promise.reject(new Error('Categoría indefinida.'));
		}
		return this.fireStore.doc<SubCategory>(`categorias/${item.categoryId}/subcategorias/${item.id}`)
			.update({nombre: item.nombre, descripcion: item.descripcion})
			.then( value => {
				void this.getSubcategories(item.categoryId || '');
				return item;
			} );			
	}

	public async deleteSubcategory(item: SubCategory): Promise<void> {
		if(!item.categoryId){
			return Promise.reject(new Error('Categoría indefinida.'));
		}

		const numberSites = await this.sitesServices.numberOfSites(item);

		if(numberSites > 0) {
			return Promise.reject(new Error('La subcategoría tiene sitios de interes asociados.'));
		}

		return this.fireStore.doc<SubCategory>(`categorias/${item.categoryId}/subcategorias/${item.id}`)
			.delete()
			.then( value => {
				void this.getSubcategories(item.categoryId || '');
			});
	}
	
	public numberOfSubcategories(item: Category): Promise<number> {
		return this.fireStore
			.collection(`categorias/${item.id}/subcategorias/`)
			.get()
			.toPromise()
			.then( value => value.size);	
	}
}
