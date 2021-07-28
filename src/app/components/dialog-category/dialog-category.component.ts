import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogCategoryData } from 'src/app/models/dialogCategoyData';

@Component({
	selector: 'madryntracker-dialog-category',
	templateUrl: './dialog-category.component.html',
	styleUrls: ['./dialog-category.component.css']
})
export class DialogCategoryComponent {
	constructor(@Inject(MAT_DIALOG_DATA) public data: DialogCategoryData) {}
}
