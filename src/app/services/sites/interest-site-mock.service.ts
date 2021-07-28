import { Injectable } from '@angular/core';
import { BehaviorSubject, concat, Observable, Observer } from 'rxjs';
import { map } from 'rxjs/operators';
import { Result } from 'src/app/models/result';
import { SiteInterest } from 'src/app/models/siteInterest';
import { SubCategory } from 'src/app/models/subCategory';
import { SubCategoryMockService } from '../subCategory/sub-category-mock.service';
import { UtilService } from '../util.service';
import { dbSites } from './dbSites';
import { InterestSiteService } from './interest-site.service';

@Injectable({
	providedIn: 'root'
})
export class InterestSiteMockService implements InterestSiteService {
	private dbSitesInterst: Array<SiteInterest> = [];
	private result$: BehaviorSubject<SiteInterest[]>;

	constructor(
		private utilService: UtilService,
		private subCategoryService: SubCategoryMockService
	) {
		//Se crea el observer
		this.result$ = new BehaviorSubject<SiteInterest[]>(this.dbSitesInterst);
	}

	getSitesInterestOfCategory(categoryId: string | undefined): Observable<SiteInterest[]> {
		if (typeof categoryId === 'undefined') {
			throw new Error('Id. de categoria indefinido.');
		}

		const subCategories$ = this.subCategoryService.getSubCategories(categoryId);

		const sites$ = this.getSitesInterestAll();

		return concat(subCategories$, sites$).pipe(
			map((dataMerged) => {
				const subCategories = dataMerged[0] as SubCategory[];
				const sites = dataMerged[1] as SiteInterest[];
				const result: SiteInterest[] = [];

				subCategories.forEach((subCategory) => {
					const sitesFiltered = sites.filter(
						(site) => site.subCategoryId === subCategory
					);
					result.push(...sitesFiltered);
				});

				return result;
			})
		);
	}

	private sitesOfSubCategories(categoryId: string, obs: Observer<SiteInterest[]>): void {
		const result: SiteInterest[] = [];
		this.subCategoryService.getSubCategories(categoryId).subscribe((subCategories) => {
			subCategories.forEach((subCategory) => {
				const aux = this.dbSitesInterst.filter(
					(site) => site.subCategoryId === subCategory.id
				);
				result.push(...aux);
			});
			obs.next(result);
		});
	}

	getSitesInterestOfSubCategory(subCategoryId: string | undefined): Observable<SiteInterest[]> {
		if (typeof subCategoryId === 'undefined') {
			throw new Error('Id. de Subcategoria indefinido.');
		}

		if (this.dbSitesInterst.length === 0) {
			this.getSitesInterestAll().subscribe((sites) => {
				this.dbSitesInterst = sites;
				const result = this.dbSitesInterst.filter(
					(site) => site.subCategoryId === subCategoryId
				);
				this.result$.next(result);
			});
		} else {
			const result = this.dbSitesInterst.filter(
				(site) => site.subCategoryId === subCategoryId
			);
			this.result$.next(result);
		}

		return this.result$;
	}

	getSitesInterestAll(): Observable<SiteInterest[]> {
		this.dbSitesInterst = dbSites as Array<SiteInterest>;
		this.result$.next(this.dbSitesInterst);
		return this.result$;
	}

	addSiteInterest(item: SiteInterest): Promise<SiteInterest> {
		const intRandom = this.utilService.ramdonInt(1, 50);
		item.id = `000${intRandom}`;
		this.dbSitesInterst.push(item);
		this.result$.next(this.dbSitesInterst);
		return Promise.resolve(item);
	}

	editSiteInterest(item: SiteInterest): Promise<SiteInterest> {
		const newDB = this.dbSitesInterst.map((element) => {
			let obj = {} as SiteInterest;
			if (item.id === element.id) {
				obj = item;
			} else {
				obj = element;
			}
			return obj;
		});

		this.dbSitesInterst = newDB;
		this.result$.next(this.dbSitesInterst);

		return Promise.resolve(item);
	}

	deleteSiteInteres(item: SiteInterest): Promise<Result> {
		const newDB = this.dbSitesInterst.filter((element) => element.id != item.id);
		this.dbSitesInterst = newDB;
		this.result$.next(this.dbSitesInterst);
		return Promise.resolve({ msgOk: 'El sitio de interes fue eliminado.' });
	}
}
