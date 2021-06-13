import { Observable } from 'rxjs';
import { Result } from 'src/app/models/result';
import { SiteInterest } from 'src/app/models/siteInterest';

export interface InterestSiteService {
  //CRUD de Sitios de Interes
  getSitesInterestAll(): Observable<SiteInterest[]>;

  getSitesInterestOfCategory(
    categoryId: string | undefined
  ): Observable<SiteInterest[]>;

  getSitesInterestOfSubCategory(
    subCategoryId: string | undefined
  ): Observable<SiteInterest[]>;

  addSiteInterest(item: SiteInterest): Promise<Result>;

  editSiteInterest(item: SiteInterest): Promise<Result>;

  deleteSiteInteres(item: SiteInterest): Promise<Result>;
}
