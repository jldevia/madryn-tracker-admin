import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogSubCategoryData } from 'src/app/models/dialogSubCategoryData';

@Component({
  selector: 'madryntracker-dialog-subcategory',
  templateUrl: './dialog-subcategory.component.html',
  styleUrls: ['./dialog-subcategory.component.css'],
})
export class DialogSubcategoryComponent implements OnInit {
  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogSubCategoryData) {}

  ngOnInit(): void {}
}
