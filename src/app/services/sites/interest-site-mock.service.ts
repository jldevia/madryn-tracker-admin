import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Result } from 'src/app/models/result';
import { SiteInterest } from 'src/app/models/siteInterest';
import { SubCategoryMockService } from '../subCategory/sub-category-mock.service';
import { UtilService } from '../util.service';
import { dbSites } from './dbSites';
import { InterestSiteService } from './interest-site.service';

@Injectable({
  providedIn: 'root',
})
export class InterestSiteMockService implements InterestSiteService {
  private dbSitesInterst: Array<SiteInterest>;
  private subject: BehaviorSubject<SiteInterest[]>;

  constructor(
    private utilService: UtilService,
    private subCategoryService: SubCategoryMockService
  ) {
    //Se crea la BD
    this.dbSitesInterst = dbSites as Array<SiteInterest>;
    this.subject = new BehaviorSubject<SiteInterest[]>(this.dbSitesInterst);
  }
  getSitesInterestOfCategory(
    categoryId: string | undefined
  ): Observable<SiteInterest[]> {
    const result: SiteInterest[] = [];
    if (typeof categoryId !== 'undefined') {
      this.subCategoryService.getSubCategories(categoryId).subscribe((data) => {
        data.forEach((subCategory) => {
          const aux = this.dbSitesInterst.filter(
            (site) => site.subCategoryId === subCategory.id
          );
          result.push(...aux);
        });
        this.subject.next(result);
      });
    }

    return this.subject;
  }
  getSitesInterestOfSubCategory(
    subCategoryId: string | undefined
  ): Observable<SiteInterest[]> {
    if (typeof subCategoryId !== 'undefined') {
      const result = this.dbSitesInterst.filter(
        (site) => site.subCategoryId === subCategoryId
      );
      this.subject.next(result);
    }
    return this.subject;
  }

  getSitesInterestAll(): Observable<SiteInterest[]> {
    return this.subject;
  }
  addSiteInterest(item: SiteInterest): Promise<Result> {
    let intRandom = this.utilService.ramdonInt(1, 50);
    item.id = `000${intRandom}`;
    this.dbSitesInterst.push(item);
    this.subject.next(this.dbSitesInterst);
    return Promise.resolve({ msgOk: 'El sitio de interes fue creado.' });
  }
  editSiteInterest(item: SiteInterest): Promise<Result> {
    let newDB = this.dbSitesInterst.map((element) => {
      let obj = {} as SiteInterest;
      if (item.id === element.id) {
        obj = item;
      } else {
        obj = element;
      }
      return obj;
    }) as Array<SiteInterest>;

    this.dbSitesInterst = newDB;
    this.subject.next(this.dbSitesInterst);

    return Promise.resolve({
      msgOk: 'El sitio de interes fue modificado.',
    });
  }
  deleteSiteInteres(item: SiteInterest): Promise<Result> {
    let newDB = this.dbSitesInterst.filter((element) => element.id != item.id);
    this.dbSitesInterst = newDB;
    this.subject.next(this.dbSitesInterst);
    return Promise.resolve({ msgOk: 'El sitio de interes fue eliminado.' });
  }
}
