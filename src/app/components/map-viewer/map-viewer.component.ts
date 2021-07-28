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
import { InterestSiteMockService } from 'src/app/services/sites/interest-site-mock.service';
import { SiteInterest } from 'src/app/models/siteInterest';
import { MatDialog } from '@angular/material/dialog';
import { DialogSiteData } from 'src/app/models/dialogSiteData';
import { Operation } from 'src/app/models/operation-enum';
import { DialogSiteComponent } from '../dialog-site/dialog-site.component';
import { CategoryMockService } from 'src/app/services/category/category-mock.service';
import { SubCategoryMockService } from 'src/app/services/subCategory/sub-category-mock.service';
import { Category } from 'src/app/models/category';
import { SubCategory } from 'src/app/models/subCategory';
import { MatSelectChange } from '@angular/material/select';
import { DialogDeleteComponent } from '../dialog-delete/dialog-delete.component';
import { UtilService } from 'src/app/services/util.service';
import { Subscription } from 'rxjs';
import { Result } from 'src/app/models/result';

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
		private categoryService: CategoryMockService,
		private subCategoryService: SubCategoryMockService,
		private siteService: InterestSiteMockService,
		private utilService: UtilService,
		private dialog: MatDialog
	) {
		this.subcriptionGlobal = new Subscription();
	}

	ngOnDestroy(): void {
		this.subcriptionGlobal.unsubscribe();
	}

	ngOnInit(): void {
		// load sites
		const subscriptionSites = this.siteService.getSitesInterestAll().subscribe((data) => {
			this.sites = data;
			this.filteredSites = data;
			this.showSites(this.filteredSites);
		});

		this.subcriptionGlobal.add(subscriptionSites);

		// load categories
		const subscriptionCategory = this.categoryService.getCategories().subscribe((data) => {
			this.categories = data;
		});

		this.subcriptionGlobal.add(subscriptionCategory);

		// load subcategories
		const subscriptionSubCategories = this.subCategoryService
			.getSubCategoriesAll()
			.subscribe((data) => {
				this.subCategories = data;
				this.filteredSubCategories = data;
			});

		this.subcriptionGlobal.add(subscriptionSubCategories);
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
			const latLon = Proj.toLonLat([evt.coordinate[0], evt.coordinate[1]]);

			const newSite: SiteInterest = {};
			newSite.name = '';
			newSite.description = '';
			newSite.address = '';
			newSite.hoursAttention = '';
			newSite.ranking = 0;
			newSite.longitude = latLon[0];
			newSite.latitude = latLon[1];
			newSite.phone1 = '';
			newSite.phone2 = '';
			newSite.email = '';
			newSite.web = '';

			const objConfig = {
				title: 'Nuevo Sitio',
				site: newSite,
				subcategories: [{ nombre: 'Subcategoría 1' }, { nombre: 'Subcategoria 2' }]
			} as DialogSiteData;

			this.openDialog(objConfig, Operation.NEW);
		});
	}

	private generatePoints(sites: SiteInterest[]): Feature[] {
		const points = new Array<Feature>();
		sites.forEach((element) => {
			const point = new Feature({
				geometry: new Point(
					Proj.fromLonLat([element.longitude || 0, element.latitude || 0])
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
		this.siteService
			.editSiteInterest(site)
			.then((resp: SiteInterest) => {
				this.sites.forEach((item) => {
					if (item.id === resp.id) {
						item = resp;
					}
				});
				this.utilService.showMessageSuccess('Sitio de interes modificado.');
			})
			.catch((err: Result) =>
				this.utilService.showMessageError(`${err.codeErr!} - ${err.msgErr!}`)
			);
	}

	saveSite(site: SiteInterest): void {
		this.siteService
			.addSiteInterest(site)
			.then((resp: SiteInterest) => {
				this.sites.push(resp);
				this.utilService.showMessageSuccess('Sitio de interes creado.');
			})
			.catch((err: Result) =>
				this.utilService.showMessageError(`${err.codeErr!} - ${err.msgErr!}`)
			);
	}

	onCategoryChanged(event: MatSelectChange): void {
		this.filteredSubCategories = this.subCategories.filter(
			(subcategory) => subcategory.categoryId === event.value
		);
		this.showSites([]);
	}

	onSubCategoryChanged(event: MatSelectChange): void {
		this.filteredSites = this.sites.filter((site) => site.subCategoryId === event.value);
		this.showSites(this.filteredSites);
	}

	onUpdateSite(site: SiteInterest): void {
		const objConfig = {
			title: 'Editando Sitio',
			site: site,
			subcategories: [{ nombre: 'Subcategoría 1' }, { nombre: 'Subcategoria 2' }]
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
				void this.siteService
					.deleteSiteInteres(site)
					.then((result: Result) =>
						this.utilService.showMessageError('Sitio de interes eliminado.')
					);
			}
		});
	}
}
