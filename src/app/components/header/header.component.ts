import { Component, Output, EventEmitter } from '@angular/core';

@Component({
	selector: 'madryntracker-header',
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.css']
})
export class HeaderComponent {
	@Output() public menuSideToggle = new EventEmitter();

	// eslint-disable-next-line @typescript-eslint/no-empty-function
	constructor() {}

	public onToggleMenuSide = (): void => {
		this.menuSideToggle.emit('menuSideToggleEvent');
	};
}
