import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
	providedIn: 'root'
})
export class UtilService {
	constructor(private snackBar: MatSnackBar) {}

	private showSnackBar(msg = '', type = 'success'): void {
		const classCss = `sanck-bar-${type}`;
		this.snackBar.open(msg, undefined, {
			duration: 3000,
			horizontalPosition: 'end',
			verticalPosition: 'top',
			panelClass: classCss
		});
	}

	showMessageSuccess(msg: string): void {
		this.showSnackBar(msg);
	}

	showMessageInfo(msg: string): void {
		this.showSnackBar(msg, 'info');
	}

	showMessageError(msg: string): void {
		this.showSnackBar(msg, 'danger');
	}

	showMessageWarning(msg: string): void {
		this.showSnackBar(msg, 'warning');
	}

	ramdonInt(min: number, max: number): number {
		return min + Math.floor((max - min) * Math.random());
	}
}
