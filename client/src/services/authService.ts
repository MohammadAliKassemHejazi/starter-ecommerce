import { GetSession, SignIn, SignUp } from "@/models/auth.model"
import httpClient from "@/utils/httpClient";


type signProps = {
	email: string;
	password: string;
};

// server api
export const signIn = async (user: signProps): Promise<SignIn> => {
	const { data: response } = await httpClient.post<SignIn>(
		`/auth/login`,
		user
	);
	return response;
};

// server api
export async function signOut() {
	const response = await httpClient.post(`/auth/logout`);
	return response.data;
}

// server api
export const signUp = async (user: signProps): Promise<SignUp> => {
	const response = await httpClient.post<SignUp>("/auth/register", user);
	return response.data;
};


// server api
export const getSession = async (): Promise<GetSession> => {
	const response = await httpClient.get(`/auth/session`);

	return response.data;
};

// Get user sessions
export const getUserSessions = async () => {
	const response = await httpClient.get(`/auth/sessions`);
	return response.data;
};