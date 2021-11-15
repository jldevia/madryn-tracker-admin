import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { BehaviorSubject, Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';
import { SiteInterest } from 'src/app/models/siteInterest';
import { SubCategory } from 'src/app/models/subCategory';
import { LoadingService } from '../loading.service';

@Injectable({
  providedIn: 'root'
})
export class SitesFBService {
  private sites: SiteInterest[] = [];
  private sites$: BehaviorSubject<SiteInterest[]> = new BehaviorSubject<SiteInterest[]>([]);

  get sitesObservable(): Observable<SiteInterest[]>{
    return this.sites$.asObservable();
  }

  constructor(private firestore: AngularFirestore, private loadingService: LoadingService) {}

   public getSites(idSubCat: string): Observable<SiteInterest[]> {
    this.loadingService.showLoading(); 
    this.firestore
      .collection<SiteInterest>('sitios', ref => ref.where('subCategoryId', '==', idSubCat || ''))
      .get()
      .pipe( 
        map( doc => doc.docs.map( element => {
          const data = element.data();
          data.id = element.id;
          return data;
        })),
        finalize( () => this.loadingService.hideLoading()
        )
      )
      .subscribe( data => {
        this.sites = data;
        this.sites$.next(data);
      });
    
    return this.sites$; 
   }

   public addSite(site: SiteInterest): Promise<SiteInterest> {
      if (!site.subCategoryId) {
        return Promise.reject(new Error("Subcategoría indefinida"));
      }  

      return this.firestore.collection<SiteInterest>('sitios')
        .add(site)
        .then( docRef => {
          const newSite = {
            id: docRef.id
            ,...site
          } as SiteInterest;
                    
          this.sites.push(newSite);
          this.sites$.next(this.sites);
          return newSite;
        } );      
   }

  public editSiteInterest(site: SiteInterest): Promise<SiteInterest> {
    if (!site.subCategoryId) {
      return Promise.reject(new Error("Subcategoría indefinida"));      
    }
    
    return this.firestore
      .doc<SiteInterest>(`sitios/${site.id}`)
      .update(site)
      .then( () => {
        this.getSites(site.subCategoryId || '');
        return site;
      })
      ;
  }
  
  public deleteSiteInterest(site: SiteInterest): Promise<void> {
    return this.firestore.doc<SiteInterest>(`sitios/${site.id}`)
      .delete()
      .then( () => {
        void this.getSites(site.subCategoryId || '');
      });
  }

  public numberOfSites(item: SubCategory): Promise<number> {
    return this.firestore
        .collection(`sitios`, ref => ref.where('subCategoryId', '==', item.id || ''))
        .get()
        .toPromise()
        .then( docs => docs.size );
        
  }
}
