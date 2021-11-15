/* eslint-disable @typescript-eslint/no-empty-function */
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogSiteData } from 'src/app/models/dialogSiteData';

@Component({
	selector: 'madryntracker-dialog-site',
	templateUrl: './dialog-site.component.html',
	styleUrls: ['./dialog-site.component.css']
})
export class DialogSiteComponent implements OnInit {
	constructor(@Inject(MAT_DIALOG_DATA) public data: DialogSiteData) {}

	// eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
	ngOnInit(): void {}

	get latitude() {
		return this.data.site.location?.latitude || 0;
	}

	get longitude() {
		return this.data.site.location?.longitude || 0;
	}
	
}
