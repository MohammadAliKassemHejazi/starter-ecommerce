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

// next local api
export const signIn = async (user: signProps): Promise<SignIn> => {
	const { data: response } = await httpClient.post<SignIn>(
		`/user/auth/login`,
		user,
    {
      baseURL: process.env.NEXT_PUBLIC_BASE_URL_LOCAL_API,
    }
	);
	console.log("signIn response:", response);
	return response;
};

// next local api
export async function signOut(): Promise<LogoutResponse> {
	console.log("Calling signOut API");
	const { data: response } = await httpClient.post<LogoutResponse>(`/user/auth/logout`,{},
    {
      baseURL: process.env.NEXT_PUBLIC_BASE_URL_LOCAL_API,
    });
	return response;
}

// server api
export const signUp = async (user: signProps): Promise<SignUpResponse> => {
	const { data: response } = await httpClient.post<SignUpResponse>("/user/auth/register", user,{
      baseURL: process.env.NEXT_PUBLIC_BASE_URL_LOCAL_API,
	});

	return response;
};

// next local api
export const getSession = async (): Promise<SessionResponse> => {
	const { data: response } = await httpClient.get<SessionResponse>(`/user/auth/session`,
    {
      baseURL: process.env.NEXT_PUBLIC_BASE_URL_LOCAL_API,
    });
	return response;
};


// Get user sessions
export const getUserSessions = async (): Promise<UserSessionsResponse> => {
	const { data: response } = await httpClient.get<UserSessionsResponse>(`/auth/sessions`);
	return response;
};