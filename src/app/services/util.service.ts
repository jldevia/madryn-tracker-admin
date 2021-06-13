import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class UtilService {
  constructor(private snackBar: MatSnackBar) {}

  showSnackBar(msg: string = '', type: string = 'success'): void {
    const classCss = `sanck-bar-${type}`;
    this.snackBar.open(msg, undefined, {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: classCss,
    });
  }

  ramdonInt(min: number, max: number): number {
    return min + Math.floor((max - min) * Math.random());
  }
}
