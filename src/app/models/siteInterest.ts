import * as firebase from 'firebase/app'


export interface SiteInterest {
	id?: string;
	name?: string;
	description?: string;
	address?: string;
	ranking?: number;
	hoursAttention?: string;
	location?: firebase.default.firestore.GeoPoint
	image?: string;
	phone1?: string;
	phone2?: string;
	email?: string;
	web?: string;
	countVisits?: number;
	subCategoryId?: string;
}
