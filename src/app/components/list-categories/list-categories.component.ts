import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { UtilService } from 'src/app/services/util.service';

import { Category } from '../../models/category';
import { CategoryMockService } from '../../services/category/category-mock.service';
import { DialogCategoryComponent } from '../dialog-category/dialog-category.component';
import { DialogDeleteComponent } from '../dialog-delete/dialog-delete.component';

@Component({
  selector: 'madryntracker-list-categories',
  templateUrl: './list-categories.component.html',
  styleUrls: ['./list-categories.component.css'],
})
export class ListCategoriesComponent implements OnInit {
  categories: Category[] = new Array<Category>();
  displayedColumns = ['id', 'nombre', 'descripcion', 'editar', 'eliminar'];
  categoriesObs: Observable<Category[]>;

  constructor(
    private service: CategoryMockService,
    private dialog: MatDialog,
    private utilService: UtilService
  ) {
    this.categoriesObs = service.getCategories();
  }

  ngOnInit(): void {
    this.categoriesObs.subscribe({
      next: (data) => (this.categories = data),
    });
  }

  newCategory(): void {
    const dialogReference = this.dialog.open(DialogCategoryComponent, {
      width: '350px',
      disableClose: true,
      data: {
        title: 'Nueva Categoría',
        nombre: '',
        descripcion: '',
      },
    });

    dialogReference.afterClosed().subscribe({
      next: (result) => {
        if (result) {
          this.service
            .addCategory(result)
            .then((result) => {
              this.utilService.showSnackBar(result.msgOk);
            })
            .catch((result) => {
              this.utilService.showSnackBar(
                'Error al guardar nueva categoría.',
                'danger'
              );
            });
        }
      },
    });
  }

  editCategory(category: Category): void {
    const dialogReference = this.dialog.open(DialogCategoryComponent, {
      width: '350px',
      disableClose: true,
      data: {
        title: 'Editando categoría',
        nombre: category.nombre,
        descripcion: category.descripcion,
      },
    });

    dialogReference.afterClosed().subscribe({
      next: (result) => {
        if (result) {
          let categoryEdit = {
            id: category.id,
            nombre: result.nombre,
            descripcion: result.descripcion,
          };
          this.service
            .editCategory(categoryEdit)
            .then((success) => this.utilService.showSnackBar(success.msgOk))
            .catch((err) =>
              this.utilService.showSnackBar(
                'Error al modificar categoría.',
                'danger'
              )
            );
        }
      },
    });
  }

  deleteCategory(category: Category): void {
    const dialogReference = this.dialog.open(DialogDeleteComponent, {
      width: '350px',
      disableClose: true,
      data: {
        title: 'Eliminando Categoría',
        message: 'Desea realmente eliminar esta categoría?',
      },
    });

    dialogReference.afterClosed().subscribe((result) => {
      if (result) {
        this.service
          .deleteCategory(category)
          .then((result) => this.utilService.showSnackBar(result.msgOk))
          .catch((result) =>
            this.utilService.showSnackBar(
              'Error al eliminar categoría.',
              'danger'
            )
          );
      }
    });
  }
}
