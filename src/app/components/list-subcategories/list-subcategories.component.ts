import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { Category } from 'src/app/models/category';
import { DialogSubCategoryData } from 'src/app/models/dialogSubCategoryData';
import { SubCategory } from 'src/app/models/subCategory';
import { CategoryMockService } from 'src/app/services/category/category-mock.service';
import { UtilService } from 'src/app/services/util.service';
import { SubCategoryMockService } from '../../services/subCategory/sub-category-mock.service';
import { DialogDeleteComponent } from '../dialog-delete/dialog-delete.component';
import { DialogSubcategoryComponent } from '../dialog-subcategory/dialog-subcategory.component';

@Component({
	selector: 'madryntracker-list-subcategories',
	templateUrl: './list-subcategories.component.html',
	styleUrls: ['./list-subcategories.component.css']
})
export class ListSubcategoriesComponent {
	subCategoriesObs: Observable<SubCategory[]>;
	categories: Category[] = [];
	idCategorySelected = '';
	displayedColumns = ['id', 'nombre', 'descripcion', 'editar', 'eliminar'];

	constructor(
		private serviceSubCat: SubCategoryMockService,
		private serviceCat: CategoryMockService,
		private utilService: UtilService,
		private dialog: MatDialog
	) {
		this.subCategoriesObs = serviceSubCat.getSubCategoriesAll();
		this.serviceCat.getCategories().subscribe((data) => {
			this.categories.push({ id: 'ALL', nombre: 'Todas', descripcion: '' });
			this.categories.push(...data);
		});
	}

	newSubCategory(): void {
		const dialogReference = this.dialog.open(DialogSubcategoryComponent, {
			width: '350px',
			disableClose: true,
			data: {
				title: 'Nueva Subcategoría',
				nombre: '',
				descripcion: '',
				categorias: this.categories
			}
		});

		dialogReference.afterClosed().subscribe((result: DialogSubCategoryData) => {
			if (result) {
				this.serviceSubCat
					.addSubCategory({
						id: result.id,
						nombre: result.nombre,
						descripcion: result.descripcion,
						categoryId: result.categoriaId
					})
					.then((result) => this.utilService.showMessageSuccess('Subcategoría creada.'))
					.catch((err) => {
						console.error(err);
						this.utilService.showMessageError('Error al guardar nueva Subcategoría');
					});
			}
		});
	}

	editSubCategory(item: SubCategory): void {
		const dialogReference = this.dialog.open(DialogSubcategoryComponent, {
			width: '350px',
			disableClose: true,
			data: {
				title: 'Editando Subcategoría',
				nombre: item.nombre,
				descripcion: item.descripcion,
				categoriaId: item.categoryId,
				categorias: this.categories
			}
		});

		dialogReference.afterClosed().subscribe({
			next: (result: DialogSubCategoryData) => {
				if (result) {
					const obj = {
						id: item.id,
						nombre: result.nombre,
						descripcion: result.descripcion,
						categoryId: result.categoriaId
					};
					this.serviceSubCat
						.editSubCategory(obj)
						.then((result) =>
							this.utilService.showMessageSuccess('Subcategoría modificada.')
						)
						.catch((err) => {
							console.error(err);
							this.utilService.showMessageError(
								'Error al modificar la subcategoría.'
							);
						});
				}
			}
		});
	}

	deleteSubCategory(item: SubCategory): void {
		const dialogReference = this.dialog.open(DialogDeleteComponent, {
			width: '350px',
			disableClose: true,
			data: {
				title: 'Eliminando Subcategoría',
				message: 'Desea realmente eliminar esta subcategoría?'
			}
		});

		dialogReference.afterClosed().subscribe((result) => {
			if (result) {
				this.serviceSubCat
					.deleteSubCategory(item)
					.then((result) =>
						this.utilService.showMessageSuccess('Subcategoría eliminada.')
					)
					.catch((err) => {
						console.error(err);
						this.utilService.showMessageError('Error al eliminar la Subcategoría');
					});
			}
		});
	}

	onCategoryChanged(): void {
		if (this.idCategorySelected === 'ALL') {
			this.subCategoriesObs = this.serviceSubCat.getSubCategoriesAll();
		} else {
			this.subCategoriesObs = this.serviceSubCat.getSubCategories(this.idCategorySelected);
		}
	}
}
