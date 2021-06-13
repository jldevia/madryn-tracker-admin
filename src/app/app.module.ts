import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { MaterialComponentsModule } from './material-components/material-components.module';
import { ListCategoriesComponent } from './components/list-categories/list-categories.component';
import { DialogCategoryComponent } from './components/dialog-category/dialog-category.component';
import { DialogDeleteComponent } from './components/dialog-delete/dialog-delete.component';
import { ListSubcategoriesComponent } from './components/list-subcategories/list-subcategories.component';
import { DialogSubcategoryComponent } from './components/dialog-subcategory/dialog-subcategory.component';
import { MapViewerComponent } from './components/map-viewer/map-viewer.component';
import { DialogSiteComponent } from './components/dialog-site/dialog-site.component';

@NgModule({
  declarations: [AppComponent, HeaderComponent, ListCategoriesComponent, DialogCategoryComponent, DialogDeleteComponent, ListSubcategoriesComponent, DialogSubcategoryComponent, MapViewerComponent, DialogSiteComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialComponentsModule,
    FormsModule    
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule   {}
