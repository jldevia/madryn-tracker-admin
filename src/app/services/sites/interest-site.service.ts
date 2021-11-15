import { Observable } from 'rxjs';
import { Result } from 'src/app/models/result';
import { SiteInterest } from 'src/app/models/siteInterest';

//CRUD de Sitios de Interes
export interface InterestSiteService {
	getSitesInterestAll(): Observable<SiteInterest[]>;

	getSitesInterestOfCategory(categoryId: string | undefined): Observable<SiteInterest[]>;

	getSitesInterestOfSubCategory(subCategoryId: string | undefined): Observable<SiteInterest[]>;

	addSiteInterest(item: SiteInterest): Promise<SiteInterest>;

	editSiteInterest(item: SiteInterest): Promise<SiteInterest>;

	deleteSiteIntest(item: SiteInterest): Promise<Result>;
}
