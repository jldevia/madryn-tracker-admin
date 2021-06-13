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

@Component({
  selector: 'madryntracker-map-viewer',
  templateUrl: './map-viewer.component.html',
  styleUrls: ['./map-viewer.component.css'],
})
export class MapViewerComponent implements OnInit /*, OnDestroy*/ {
  mapa: Map | undefined;
  sites: SiteInterest[] = [];
  categories: Category[] = [];
  subCategories: SubCategory[] = [];
  private vectorLayer!: VectorLayer;

  constructor(
    private categoryService: CategoryMockService,
    private subCategoryService: SubCategoryMockService,
    private siteService: InterestSiteMockService,
    private utilService: UtilService,
    private dialog: MatDialog
  ) {}

  /*ngOnDestroy(): void {
    throw new Error('ngOnDestroy - Method not implemented.');
  }*/

  ngOnInit(): void {
    this.siteService.getSitesInterestAll().subscribe((data) => {
      this.sites = data;
      let points = this.generatePoints(this.sites);
      this.generateMap(points);
    });

    this.categoryService.getCategories().subscribe((data) => {
      this.categories = data;
    });
  }

  private generateMap(points: Feature[]): void {
    // Si el mapa ya esta generado solo se debe actualizar los puntos
    // visualizados
    let auxLayer = new VectorLayer({
      source: new VectorSource({
        features: points,
      }),
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
          source: new OSM(),
        }),
        this.vectorLayer,
      ],
      view: new View({
        center: Proj.fromLonLat([-65.04363818681641, -42.76790812052684]),
        zoom: 13.0,
      }),
      controls: defaultControls().extend([]),
      interactions: defaults({ doubleClickZoom: false }),
    });

    // New Site
    this.mapa.on('dblclick', (evt) => {
      let latLon = Proj.toLonLat([evt.coordinate[0], evt.coordinate[1]]);

      let newSite: SiteInterest = {};
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

      let objConfig = {
        title: 'Nuevo Sitio',
        site: newSite,
        subcategories: [
          { nombre: 'Subcategoría 1' },
          { nombre: 'Subcategoria 2' },
        ],
      } as DialogSiteData;

      this.openDialog(objConfig, Operation.NEW);
    });
  }

  private generatePoints(sites: SiteInterest[]): Feature[] {
    let points = new Array<Feature>();
    sites.forEach((element) => {
      let point = new Feature({
        geometry: new Point(
          Proj.fromLonLat([element.longitude || 0, element.latitude || 0])
        ),
      });

      point.setStyle(
        new Style({
          image: new Icon({
            src: '../assets/img/marker-icon.png',
          }),
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
      data: data,
    });

    dialogReference.afterClosed().subscribe({
      next: (result) => {
        if (result) {
          let dataNewSite = result as DialogSiteData;
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
      },
    });
  }
  editSite(site: SiteInterest) {
    this.siteService
      .editSiteInterest(site)
      .then((res) => this.utilService.showSnackBar(res.msgOk))
      .catch((err) =>
        this.utilService.showSnackBar(
          `${err.codeErr} - ${err.msgErr}`,
          'danger'
        )
      );
  }
  saveSite(site: SiteInterest) {
    this.siteService
      .addSiteInterest(site)
      .then((res) => this.utilService.showSnackBar(res.msgOk))
      .catch((err) =>
        this.utilService.showSnackBar(
          `${err.codeErr} - ${err.msgErr}`,
          'danger'
        )
      );
  }

  onCategoryChanged(event: MatSelectChange): void {
    this.subCategoryService
      .getSubCategories(event.value)
      .subscribe((data) => (this.subCategories = data));
  }

  onSubCategoryChanged(event: MatSelectChange): void {}

  onUpdateSite(site: SiteInterest): void {
    let objConfig = {
      title: 'Editando Sitio',
      site: site,
      subcategories: [
        { nombre: 'Subcategoría 1' },
        { nombre: 'Subcategoria 2' },
      ],
    } as DialogSiteData;

    this.openDialog(objConfig, Operation.EDIT);
  }

  onDeleteSite(site: SiteInterest): void {
    const dialogReference = this.dialog.open(DialogDeleteComponent, {
      width: '350px',
      disableClose: true,
      data: {
        title: 'Eliminando Sitio de interes',
        message: 'Desea realmente eliminar este sitio de interes?',
      },
    });

    dialogReference.afterClosed().subscribe((result) => {
      if (result) {
        this.siteService
          .deleteSiteInteres(site)
          .then((resutl) => this.utilService.showSnackBar(resutl.msgOk));
      }
    });
  }
}
