import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { DialogCategoryData } from 'src/app/models/dialogCategoyData';
import { CategoryFBStore } from 'src/app/services/category/category-firebase.service';
import { UtilService } from 'src/app/services/util.service';

import { Category } from '../../models/category';
import { DialogCategoryComponent } from '../dialog-category/dialog-category.component';
import { DialogDeleteComponent } from '../dialog-delete/dialog-delete.component';

@Component({
	selector: 'madryntracker-list-categories',
	templateUrl: './list-categories.component.html',
	styleUrls: ['./list-categories.component.css']
})
export class ListCategoriesComponent {
	displayedColumns = ['id', 'nombre', 'descripcion', 'editar', 'eliminar'];
	categories$!: Observable<Category[]>;

	constructor(
		private categoryService: CategoryFBStore,
		private dialog: MatDialog,
		private utilService: UtilService
	) {
		this.categories$ = this.categoryService.categoriesObservable;
	}

	newCategory(): void {
		const dialogReference = this.dialog.open(DialogCategoryComponent, {
			width: '350px',
			disableClose: true,
			data: {
				title: 'Nueva Categoría',
				nombre: '',
				descripcion: ''
			}
		});

		dialogReference.afterClosed().subscribe({
			next: (result: DialogCategoryData) => {
				if (result) {
					this.categoryService
						.addCategory({
							id: result.id,
							nombre: result.nombre,
							descripcion: result.descripcion
						})
						.then((result: Category) => {
							this.utilService.showMessageSuccess('Categoría creada.');
						})
						.catch((err) => {
							console.error(err);
							this.utilService.showMessageError(`Error al guardar nueva categoría.`);
						});
				}
			}
		});
	}

	editCategory(category: Category): void {
		const dialogReference = this.dialog.open(DialogCategoryComponent, {
			width: '350px',
			disableClose: true,
			data: {
				title: 'Editando categoría',
				nombre: category.nombre,
				descripcion: category.descripcion
			}
		});

		dialogReference.afterClosed().subscribe({
			next: (result: DialogCategoryData) => {
				if (result) {
					const categoryEdit = {
						id: category.id,
						nombre: result.nombre,
						descripcion: result.descripcion
					} as Category;
					this.categoryService
						.editCategory(categoryEdit)
						.then((result) => {
							this.utilService.showMessageSuccess('Categoria modificada.');
						})
						.catch((err) => {
							console.error(err);
							this.utilService.showMessageError('Error al modificar categoría.');
						});
				}
			}
		});
	}

	deleteCategory(category: Category): void {
		const dialogReference = this.dialog.open(DialogDeleteComponent, {
			width: '350px',
			disableClose: true,
			data: {
				title: 'Eliminando Categoría',
				message: 'Desea realmente eliminar esta categoría?'
			}
		});

		dialogReference.afterClosed().subscribe((result) => {
			if (result) {
				this.categoryService
					.deleteCategory(category)
					.then(() => this.utilService.showMessageSuccess('Categoría eliminada.'))
					.catch((err) => {
						console.error(err);
						this.utilService.showMessageError('Error al eliminar categoría.');
					});
			}
		});
	}
}
