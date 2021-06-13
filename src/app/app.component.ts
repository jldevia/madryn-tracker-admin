import { Component } from '@angular/core';

@Component({
  selector: 'madryntracker-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  public itemsMenu = [
    {
      title: 'Categorias',
      icon: 'navigate_next',
      link: '/categories',
    },
    {
      title: 'Sub Categorias',
      icon: 'navigate_next',
      link: '/subcategories',
    },
    {
      title: 'Sitios de Interes',
      icon: 'assistant_direction',
      link: '/map',
    },
    {
      title: 'Usuarios',
      icon: 'supervised_user_circle',
      link: '/usuarios',
    },
  ];
}
