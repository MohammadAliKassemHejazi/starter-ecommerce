
export interface SignIn { data:{
	id: string
	email: string
	name: string
	address: string
	phone: string
	bio?: string;
	accessToken: string
	roles?: Array<{ id: string; name: string; }>;
	permissions?: Array<{ id: string; name: string; }>;
	packages?: Array<{
		id: string;
		name: string;
		description: string;
		storeLimit: number;
		categoryLimit: number;
		productLimit: number;
		userLimit: number;
		isSuperAdminPackage: boolean;
		price: number;
		isActive: boolean;
		UserPackage: {
			startDate: string;
			endDate: string | null;
			isActive: boolean;
		};
	}>;
	error?: string;
	}
}

export interface SignUp {
	email: string
	password: string
	name: string
	address: string
	phone: string
}


export interface GetSession {
	id:string,
	email:string,
	name:string,
	address:string,
	phone:string,
	bio?:string,
	accessToken:string,
	roles?: Array<{ id: string; name: string; }>;
	permissions?: Array<{ id: string; name: string; }>;
	packages?: Array<{
		id: string;
		name: string;
		description: string;
		storeLimit: number;
		categoryLimit: number;
		productLimit: number;
		userLimit: number;
		isSuperAdminPackage: boolean;
		price: number;
		isActive: boolean;
		UserPackage: {
			startDate: string;
			endDate: string | null;
			isActive: boolean;
		};
	}>;
	error?: string;
}