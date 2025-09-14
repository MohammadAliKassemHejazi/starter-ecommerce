export interface UserState {
	id:string;
	email: string;
	name: string;
	address: string;
	phone: string;
	isAuthenticated: boolean;
	isAuthenticating: boolean;
	accessToken: string;
	roles?: Array<{ id: string; name: string; }>;
	permissions?: Array<{ id: string; name: string; }>;
	error?: string;
}

export interface SignInAction {
	username: string;
	password: string;
}

export interface SignUpAction {
	username: string;
	password: string;
	name: string;
	surname: string;
}