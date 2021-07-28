import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LoadingService {
	isLoading$ = new Subject<boolean>();

	showLoading(): void {
		this.isLoading$.next(true);
	}

	hideLoading(): void {
		this.isLoading$.next(false);
	}
}
