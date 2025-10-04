import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "@/store/store"
import { UserState } from "@/interfaces/types/store/slices/userSlices.types";
import * as authService from "@/services/authService"
import httpClient from "@/utils/httpClient";
import  { AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios';
import Router from "next/router";
interface SignAction {
	email: string
	password: string

}
interface SignupAction {
	email: string
	password: string
	name: string
	address: string
	phone: string
}

const initialState: UserState = {
	id: "",
	email: "",
	name: "",
	address: "",
	phone: "",
	accessToken: "",
	isAuthenticated: false,
	isAuthenticating: true,
	roles: [],
	permissions: [],
};

export const signIn = createAsyncThunk(
	"auth/signin",
	async (credential: SignAction, { dispatch }) => {
	
		const resp = await authService.signIn(credential);

		if (resp.accessToken === "") {
			throw new Error("login failed");
		}
		// set access token
		httpClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
			if (config && config.headers) {
				config.headers["Authorization"] = `Bearer ${resp.accessToken}`;
			}
			return config;
		});

		// Authentication successful

		return resp;
	}
)

export const signUp = createAsyncThunk(
	"user/signup",
	async (credential: SignupAction) => {
		const response = await authService.signUp(credential);
		return response;
	}
);

export const signOut = createAsyncThunk("user/signout", async () => {
	await authService.signOut();
  	Router.push("/auth/signin");
});

// export const fetchSession = createAsyncThunk(
//   "user/fetchSession",
//   async (_, { getState, rejectWithValue }) => {
// 	  try {
// 		  let response : any = null;
//       // Always try to get authenticated session first
// 		console.log("Fetching user session...");
// 		if ((getState() as RootState).user.isGuest) {
// 			response = await authService.getPublicSession();
// 		} else {
// 			exitGuestMode
// 			response= await authService.getSession();
// 		  }
// 		  if (response) {
// 		httpClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
// 			if (config && config.headers && response.data.email) {
// 				config.headers["Authorization"] = `Bearer ${response.data.accessToken}`;
// 			}
// 			return config;
// 		});
// 	}
		  
     
//       return response;
//     } catch (error: any) {
//       // If getSession fails with 401 (unauthorized), fall back to public session
//       if (error.response?.status === 401) {
//         console.log("Session expired or invalid — switching to guest mode with public session");
//         const publicResponse = await authService.getPublicSession();
//         return publicResponse;
//       }

//       // For any other error (network, 500, etc.), reject
//       return rejectWithValue(error.response?.data || error.message);
//     }
//   }
// );


export const fetchSession = createAsyncThunk("user/fetchSession", async () => {
	const response = await authService.getSession();
	// set access token
	if (response) {
		httpClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
			if (config && config.headers && response.data.email) {
				config.headers["Authorization"] = `Bearer ${response.data.accessToken}`;
			}
			return config;
		});
	}
	return response;
});

// Guest mode removed



export const userSlice = createSlice({
	name: "user",
	initialState: initialState,
	reducers: {

	},
	extraReducers: (builder) => {
		builder.addCase(signUp.fulfilled, (state, action) => {
			state.accessToken = "";
			state.email = action.payload.data.email;
			state.name = action.payload.data.name;
			state.address = action.payload.data.address;
			state.phone = action.payload.data.phone;
			state.isAuthenticated = false;
		});
		builder.addCase(signIn.fulfilled, (state, action) => {
			console.log("sign in", action.payload);
			state.id = action.payload.id;
			state.accessToken = action.payload.accessToken;
			state.email = action.payload.email;
			state.name = action.payload.name;
			state.address = action.payload.address;
			state.phone = action.payload.phone;
			state.roles = action.payload.roles || [];
			state.permissions = action.payload.permissions || [];
			state.isAuthenticated = true;
			state.isAuthenticating = false;
		});
		builder.addCase(signIn.rejected, (state) => {
			state.accessToken = "";
			state.isAuthenticated = false;
			state.isAuthenticating = false;
			state.email = "";
			state.name = "";
			state.address = "";
		});
		builder.addCase(fetchSession.fulfilled, (state, action) => {
			state.isAuthenticating = false;
			console.log("fetch session", action.payload.data);
			if (action.payload.data && action.payload.data.email && action.payload.data.accessToken) {
				state.accessToken = action.payload.data.accessToken;
				state.id = action.payload.data.id;
				state.email = action.payload.data.email;
				state.name = action.payload.data.name;
				state.address = action.payload.data.address;
				state.roles = action.payload.data.roles || [];
				state.permissions = action.payload.data.permissions || [];
				state.isAuthenticated = true;
				
			} else {
				
				state.isAuthenticated = false;
				state.id = "guest";
				state.name = "Guest User";
				state.email = "";
				state.address = "";
				state.phone = "";
				state.accessToken = "";
				state.roles = [];
				state.permissions = [];
			}
		});
		builder.addCase(fetchSession.rejected, (state) => {
			state.isAuthenticating = false;
			// If session fetch fails, set as guest (default behavior)
	
			state.isAuthenticated = false;
			state.id = "guest";
			state.name = "Guest User";
			state.email = "";
			state.address = "";
			state.phone = "";
			state.accessToken = "";
			state.roles = [];
			state.permissions = [];
		});
		builder.addCase(signOut.fulfilled, (state) => {
			state.isAuthenticated = false;
			state.isAuthenticating = false;
			state.id = "";
			state.email = "";
			state.name = "";
			state.address = "";
			state.accessToken = "";
			state.roles = [];
			state.permissions = [];
		});
// Guest mode reducers removed
	}
})

export const userSelector = (store: RootState) => store.user;
export const isAuthenticatedSelector = (store: RootState): boolean =>
	store.user.isAuthenticated;
export const isAuthenticatingSelector = (store: RootState): boolean =>
	store.user.isAuthenticating;


export default userSlice.reducer;