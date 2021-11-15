import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListCategoriesComponent } from './components/list-categories/list-categories.component';
import { ListSubcategoriesComponent } from './components/list-subcategories/list-subcategories.component';
import { MapViewerComponent } from './components/map-viewer/map-viewer.component';

const routes: Routes = [
	{ path: 'categories', component: ListCategoriesComponent },
	{ path: 'subcategories', component: ListSubcategoriesComponent },
	{ path: 'map', component: MapViewerComponent }
];

@NgModule({
	imports: [RouterModule.forRoot(routes, { useHash: true })],
	exports: [RouterModule]
})
export class AppRoutingModule {}
