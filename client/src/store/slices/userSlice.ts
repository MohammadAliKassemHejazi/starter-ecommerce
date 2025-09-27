import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "@/store/store"
import { UserState } from "@/interfaces/types/store/slices/userSlices.types";
import * as authService from "@/services/authService"
import httpClient from "@/utils/httpClient";
import  { InternalAxiosRequestConfig } from 'axios';
import { localStorageService } from "@/services/localStorageService";
import { syncGuestFavorites } from "./favoritesSlice";
import { loadGuestCart } from "./cartSlice";

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
	isGuest: true,
};

export const signIn = createAsyncThunk(
	"auth/signin",
	async (credential: SignAction, { dispatch }) => {
	
		const resp = await authService.signIn(credential);

		if (resp.data.accessToken === "") {
			throw new Error("login failed");
		}
		// set access token
		httpClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
			if (config && config.headers) {
				config.headers["Authorization"] = `Bearer ${resp.data.accessToken}`;
			}
			return config;
		});

		// Sync guest data if any exists
		if (localStorageService.hasGuestData()) {
			// Load guest cart into Redux state
			const guestCart = localStorageService.getGuestCart();
			if (guestCart.length > 0) {
				dispatch(loadGuestCart(guestCart));
			}

			// Sync guest favorites to server
			const guestFavorites = localStorageService.getGuestFavorites();
			if (guestFavorites.length > 0) {
				dispatch(syncGuestFavorites());
			}
		}

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
	// Clear all guest data when signing out
	localStorageService.clearAllGuestData();
  //	Router.push("/auth/signin");
});

export const fetchSession = createAsyncThunk(
  "user/fetchSession",
  async (_, { getState, rejectWithValue }) => {
    try {
      // Always try to get authenticated session first
      console.log("Fetching user session...");
      const response = await authService.getSession();
      return response;
    } catch (error: any) {
      // If getSession fails with 401 (unauthorized), fall back to public session
      if (error.response?.status === 401) {
        console.log("Session expired or invalid — switching to guest mode with public session");
        const publicResponse = await authService.getPublicSession();
        return publicResponse;
      }

      // For any other error (network, 500, etc.), reject
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Define setGuestMode thunk
export const setGuestMode = createAsyncThunk(
	"user/setGuestMode",
	async () => {
		// Return guest user state
		return {
			id: "guest",
			email: "",
			name: "Guest User",
			address: "",
			phone: "",
			accessToken: "",
			isAuthenticated: false,
			isGuest: true,
			roles: [],
			permissions: [],
			isAuthenticating: false,
		};
	}
);

// Define exitGuestMode thunk
export const exitGuestMode = createAsyncThunk(
	"user/exitGuestMode",
	async () => {
		// Return default user state (could be customized)
		return {
			id: "",
			email: "",
			name: "",
			address: "",
			phone: "",
			accessToken: "",
			isAuthenticated: false,
			isGuest: false,
			roles: [],
			permissions: [],
			isAuthenticating: false,
		};
	}
);

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
			console.log("sign in", action.payload.data);
			state.id = action.payload.data.id;
			state.accessToken = action.payload.data.accessToken;
			state.email = action.payload.data.email;
			state.name = action.payload.data.name;
			state.address = action.payload.data.address;
			state.phone = action.payload.data.phone;
			state.roles = action.payload.data.roles || [];
			state.permissions = action.payload.data.permissions || [];
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
				state.isGuest = false; // Exit guest mode when session is found
			} else {
				// No valid session found, set as guest (default behavior)
				state.isGuest = true;
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
			state.isGuest = true;
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
			state.isGuest = true; // Return to guest mode after sign out
		});
		// Guest mode reducers
		builder.addCase(setGuestMode.fulfilled, (state, action) => {
			state.id = action.payload.id;
			state.email = action.payload.email;
			state.name = action.payload.name;
			state.address = action.payload.address;
			state.phone = action.payload.phone;
			state.accessToken = action.payload.accessToken;
			state.isAuthenticated = action.payload.isAuthenticated;
			state.isGuest = action.payload.isGuest;
			state.roles = action.payload.roles;
			state.permissions = action.payload.permissions;
			state.isAuthenticating = false;
		});
		builder.addCase(exitGuestMode.fulfilled, (state, action) => {
			state.id = action.payload.id;
			state.email = action.payload.email;
			state.name = action.payload.name;
			state.address = action.payload.address;
			state.phone = action.payload.phone;
			state.accessToken = action.payload.accessToken;
			state.isAuthenticated = action.payload.isAuthenticated;
			state.isGuest = action.payload.isGuest;
			state.roles = action.payload.roles;
			state.permissions = action.payload.permissions;
			state.isAuthenticating = false;
		});
	}
})

export const userSelector = (store: RootState) => store.user;
export const isAuthenticatedSelector = (store: RootState): boolean =>
	store.user.isAuthenticated;
export const isAuthenticatingSelector = (store: RootState): boolean =>
	store.user.isAuthenticating;
export const isGuestSelector = (store: RootState): boolean =>
	store.user.isGuest;
export const isUserOrGuestSelector = (store: RootState): boolean =>
	store.user.isAuthenticated || store.user.isGuest;

export default userSlice.reducer;