import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'madryntracker-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  @Output() public menuSideToggle = new EventEmitter();

  constructor() {}

  public onToggleMenuSide = () => {
    this.menuSideToggle.emit('menuSideToggleEvent');
  };
}
