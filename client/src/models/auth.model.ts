
export interface SignIn {
	id: string
	email: string
	name: string
	address: string
	phone: string
	accessToken: string
	roles?: Array<{ id: string; name: string; }>;
	permissions?: Array<{ id: string; name: string; }>;
	error?: string;
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
	accessToken:string,
	roles?: Array<{ id: string; name: string; }>;
	permissions?: Array<{ id: string; name: string; }>;
	error?: string;
}