import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { AngularFireModule } from '@angular/fire';

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
import { LoginComponent } from './components/login/login.component';
import { SpinnerModule } from './components/spinner/spinner.module';

import { environment } from '../environments/environment';
@NgModule({
	declarations: [
		AppComponent,
		HeaderComponent,
		ListCategoriesComponent,
		DialogCategoryComponent,
		DialogDeleteComponent,
		ListSubcategoriesComponent,
		DialogSubcategoryComponent,
		MapViewerComponent,
		DialogSiteComponent,
		LoginComponent
	],
	imports: [
		BrowserModule,
		AppRoutingModule,
		BrowserAnimationsModule,
		MaterialComponentsModule,
		FormsModule,
		HttpClientModule,
		AngularFireModule.initializeApp(environment.firebaseConfig),
		AngularFirestoreModule,
		SpinnerModule
	],
	bootstrap: [AppComponent]
})
export class AppModule {}
