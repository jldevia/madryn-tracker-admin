import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
	selector: 'madryntracker-spinner',
	template: `<div class="overlay" *ngIf="isLoading$ | async">
		<div class="lds-hourglass"></div>
	</div>`,
	styleUrls: ['./spinner.component.css']
})
export class SpinnerComponent implements OnInit {
	isLoading$: Subject<boolean>;

	constructor(private loadingService: LoadingService) {
		this.isLoading$ = this.loadingService.isLoading$;
	}

	ngOnInit(): void {}
}
