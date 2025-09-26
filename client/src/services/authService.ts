import { GetSession, SignIn, SignUp } from "@/models/auth.model"
import { 
	SignInResponse, 
	SignUpResponse, 
	SessionResponse, 
	UserSessionsResponse, 
	LogoutResponse 
} from "@/interfaces/api/auth.types";
import httpClient from "@/utils/httpClient";

type signProps = {
	email: string;
	password: string;
};

// server api
export const signIn = async (user: signProps): Promise<SignInResponse> => {
	const { data: response } = await httpClient.post<SignInResponse>(
		`/auth/login`,
		user
	);
	return response;
};

// server api
export async function signOut(): Promise<LogoutResponse> {
	const { data: response } = await httpClient.post<LogoutResponse>(`/auth/logout`);
	return response;
}

// server api
export const signUp = async (user: signProps): Promise<SignUpResponse> => {
	const { data: response } = await httpClient.post<SignUpResponse>("/auth/register", user);
	return response;
};

// server api
export const getSession = async (): Promise<SessionResponse> => {
	const { data: response } = await httpClient.get<SessionResponse>(`/auth/session`);
	return response;
};

// Get user sessions
export const getUserSessions = async (): Promise<UserSessionsResponse> => {
	const { data: response } = await httpClient.get<UserSessionsResponse>(`/auth/sessions`);
	return response;
};