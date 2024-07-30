
export interface SignIn {
	id: string
	email: string
	name: string
	address: string
	phone: string
	accessToken: string
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
	error?: string;
}