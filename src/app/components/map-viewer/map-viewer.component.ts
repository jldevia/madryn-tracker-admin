import { Component, OnInit, OnDestroy } from '@angular/core';
import Feature from 'ol/Feature';
import Map from 'ol/Map';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import View from 'ol/View';
import Point from 'ol/geom/Point';
import Style from 'ol/style/Style';
import Icon from 'ol/style/Icon';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { defaults } from 'ol/interaction';
import * as Proj from 'ol/proj';
import { defaults as defaultControls } from 'ol/control';
import { SiteInterest } from 'src/app/models/siteInterest';
import { MatDialog } from '@angular/material/dialog';
import { DialogSiteData } from 'src/app/models/dialogSiteData';
import { Operation } from 'src/app/models/operation-enum';
import { DialogSiteComponent } from '../dialog-site/dialog-site.component';
import { Category } from 'src/app/models/category';
import { SubCategory } from 'src/app/models/subCategory';
import { MatSelectChange } from '@angular/material/select';
import { DialogDeleteComponent } from '../dialog-delete/dialog-delete.component';
import { UtilService } from 'src/app/services/util.service';
import { Subscription } from 'rxjs';
import { SitesFBService } from 'src/app/services/sites/sites-fb.service';
import { GeoPoint } from 'src/app/models/geoPoint';
import { CategoryFBStore } from 'src/app/services/category/category-firebase.service';
import { SubCategoryFBStoreService } from 'src/app/services/subCategory/sub-category-fb-store.service';
import * as firebase from 'firebase/app'

@Component({
	selector: 'madryntracker-map-viewer',
	templateUrl: './map-viewer.component.html',
	styleUrls: ['./map-viewer.component.css']
})
export class MapViewerComponent implements OnInit, OnDestroy {
	mapa: Map | undefined;
	sites: SiteInterest[] = [];
	filteredSites!: SiteInterest[];
	categories: Category[] = [];
	subCategories: SubCategory[] = [];
	filteredSubCategories!: SubCategory[];
	private vectorLayer!: VectorLayer;
	private subcriptionGlobal: Subscription;

	constructor(
		private categoryService: CategoryFBStore,
		private subCategoryService: SubCategoryFBStoreService,
		private sitesFBService: SitesFBService,
		private utilService: UtilService,
		private dialog: MatDialog
	) {
		this.subcriptionGlobal = new Subscription();
	}

	ngOnDestroy(): void {
		this.subcriptionGlobal.unsubscribe();
	}

	ngOnInit(): void {
		// load categories
		const subscriptionCategory = this.categoryService
			.categoriesObservable.subscribe((data) => {
				this.categories = data;
		});

		this.subcriptionGlobal.add(subscriptionCategory);

		const subscriptionSites =  this.sitesFBService
			.sitesObservable
			.subscribe( data => {
				this.sites = data;
				this.showSites(data);
			});
		
		this.subcriptionGlobal.add(subscriptionSites);	
	}

	private showSites(sites: SiteInterest[]) {
		const points = this.generatePoints(sites);
		this.generateMap(points);
	}

	private generateMap(points: Feature[]): void {
		// Si el mapa ya esta generado solo se debe actualizar los puntos
		// visualizados
		const auxLayer = new VectorLayer({
			source: new VectorSource({
				features: points
			})
		});

		if (this.mapa) {
			this.mapa.removeLayer(this.vectorLayer);
			this.vectorLayer = auxLayer;
			this.mapa.addLayer(this.vectorLayer);
			return;
		}

		this.vectorLayer = auxLayer;

		this.mapa = new Map({
			target: 'map',
			layers: [
				new TileLayer({
					source: new OSM()
				}),
				this.vectorLayer
			],
			view: new View({
				center: Proj.fromLonLat([-65.04363818681641, -42.76790812052684]),
				zoom: 13.0
			}),
			controls: defaultControls().extend([]),
			interactions: defaults({ doubleClickZoom: false })
		});

		// New Site
		this.mapa.on('dblclick', (evt) => {
			
			if (!this.filteredSubCategories) {
				this.utilService.showMessageError('Debe seleccionar una subcategoría para crear un nuevo sitio de interes.');
				return;
			}

			const latLon = Proj.toLonLat([evt.coordinate[0], evt.coordinate[1]]);

			const newSite: SiteInterest = {};
			const point = new firebase.default.firestore.GeoPoint(latLon[1], latLon[0]);
			
			newSite.name = '';
			newSite.description = '';
			newSite.address = '';
			newSite.hoursAttention = '';
			newSite.ranking = 0;
			newSite.location = point;
			newSite.phone1 = '';
			newSite.phone2 = '';
			newSite.email = '';
			newSite.web = '';

			const objConfig = {
				title: 'Nuevo Sitio',
				site: newSite,
				subcategories: this.filteredSubCategories
			} as DialogSiteData;

			this.openDialog(objConfig, Operation.NEW);
		});
	}

	private generatePoints(sites: SiteInterest[]): Feature[] {
		const points = new Array<Feature>();
		sites.forEach((element) => {
			const point = new Feature({
				geometry: new Point(
					Proj.fromLonLat([element.location?.longitude || 0, element.location?.latitude || 0])
				)
			});

			point.setStyle(
				new Style({
					image: new Icon({
						src: '../assets/img/marker-icon.png'
					})
				})
			);

			points.push(point);
		});

		return points;
	}

	private openDialog(data: DialogSiteData, ope: Operation): void {
		const dialogReference = this.dialog.open(DialogSiteComponent, {
			width: '450px',
			disableClose: true,
			data: data
		});

		dialogReference.afterClosed().subscribe({
			next: (result) => {
				if (result) {
					const dataNewSite = result as DialogSiteData;
					switch (ope) {
						case Operation.NEW:
							this.saveSite(dataNewSite.site);
							break;
						case Operation.EDIT:
							this.editSite(dataNewSite.site);
							break;
						default:
							break;
					}
				}
			}
		});
	}

	editSite(site: SiteInterest): void {
		this.sitesFBService
			.editSiteInterest(site)
			.then((value) => {
				this.utilService.showMessageSuccess('Sitio de interes modificado.');
			})
			.catch((err) =>
				this.utilService.showMessageError(`Error al modificar sitio. Err: ${err}`)
			);
	}

	saveSite(site: SiteInterest): void {
		this.sitesFBService
			.addSite(site)
			.then((resp: SiteInterest) => {
				this.utilService.showMessageSuccess('Sitio de interes creado.');
			})
			.catch((err) =>
				this.utilService.showMessageError(`${err.codeErr!} - ${err.msgErr!}`)
			);
	}

	onCategoryChanged(event: MatSelectChange): void {
		const subscription = this.subCategoryService
			.getSubcategories(event.value)
			.subscribe( data => {
				this.filteredSubCategories = data;
				this.showSites([]);
			} );
		this.subcriptionGlobal.add(subscription);	
		
	}

	onSubCategoryChanged(event: MatSelectChange): void {
		void this.sitesFBService
			.getSites(event.value);		
	}

	onUpdateSite(site: SiteInterest): void {
		const objConfig = {
			title: 'Editando Sitio',
			site: site,
			subcategories: this.filteredSubCategories
		} as DialogSiteData;

		this.openDialog(objConfig, Operation.EDIT);
	}

	onDeleteSite(site: SiteInterest): void {
		const dialogReference = this.dialog.open(DialogDeleteComponent, {
			width: '350px',
			disableClose: true,
			data: {
				title: 'Eliminando Sitio de interes',
				message: 'Desea realmente eliminar este sitio de interes?'
			}
		});

		dialogReference.afterClosed().subscribe((result) => {
			if (result) {
				void this.sitesFBService
					.deleteSiteInterest(site)
					.then((value) =>
						this.utilService.showMessageError('Sitio de interes eliminado.')
					)
					.catch( err => this.utilService.showMessageError(err));
			}
		});
	}
}
