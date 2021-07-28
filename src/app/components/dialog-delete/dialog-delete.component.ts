/* eslint-disable @typescript-eslint/no-empty-function */
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
	selector: 'madryntracker-dialog-delete',
	templateUrl: './dialog-delete.component.html',
	styleUrls: ['./dialog-delete.component.css']
})
export class DialogDeleteComponent implements OnInit {
	constructor(@Inject(MAT_DIALOG_DATA) public data: { title: string; message: string }) {}

	// eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
	ngOnInit(): void {}
}
