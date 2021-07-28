import { SiteInterest } from './siteInterest';
import { SubCategory } from './subCategory';

export interface DialogSiteData {
	title: string;
	site: SiteInterest;
	subcategories: SubCategory[];
}
