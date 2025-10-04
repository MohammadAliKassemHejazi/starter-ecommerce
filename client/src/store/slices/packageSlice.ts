import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as packageService from '@/services/packageService';
import { RootState } from '../store';
import { Package } from '@/interfaces/types/store/slices/packageSlice.types';

interface PackageState {
  packages: Package[];
  selectedPackage: Package | null;
  loading: boolean;
  error: string | null;
}

const initialState: PackageState = {
  packages: [],
  selectedPackage: null,
  loading: false,
  error: null,
};

export const getAllPackages = createAsyncThunk(
  'packages/getAllPackages',
  async () => {
    const response = await packageService.requestAllPackages();
    return response;
  }
);

export const getPackageById = createAsyncThunk(
  'packages/getPackageById',
  async (id: string) => {
    const response = await packageService.requestPackageById(id);
    return response;
  }
);

export const createPackage = createAsyncThunk(
  'packages/createPackage',
  async (packageData: packageService.IPackageProps) => {
    const response = await packageService.requestCreatePackage(packageData);
    return response;
  }
);

export const updatePackage = createAsyncThunk(
  'packages/updatePackage',
  async ({ id, data }: { id: string; data: packageService.IPackageProps }) => {
    const response = await packageService.requestUpdatePackage(id, data);
    return response;
  }
);

export const deletePackage = createAsyncThunk(
  'packages/deletePackage',
  async (id: string) => {
    const response = await packageService.requestDeletePackage(id);
    return id;
  }
);

export const activatePackage = createAsyncThunk(
  'packages/activatePackage',
  async (packageId: string) => {
    const response = await packageService.requestActivatePackage(packageId);
    return response;
  }
);

export const packageSlice = createSlice({
  name: 'packages',
  initialState,
  reducers: {
    clearPackageError: (state) => {
      state.error = null;
    },
    resetPackageState: () => initialState,
  },
  extraReducers: (builder) => {
    // getAllPackages
    builder.addCase(getAllPackages.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getAllPackages.fulfilled, (state, action) => {
      state.loading = false;
      state.packages = action.payload.data as any;
    });
    builder.addCase(getAllPackages.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || 'Failed to fetch packages';
    });

    // getPackageById
    builder.addCase(getPackageById.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getPackageById.fulfilled, (state, action) => {
      state.loading = false;
      state.selectedPackage = action.payload.data as any;
    });
    builder.addCase(getPackageById.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || 'Failed to fetch package';
      state.selectedPackage = null;
    });

    // createPackage
    builder.addCase(createPackage.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(createPackage.fulfilled, (state, action) => {
      state.loading = false;
      state.packages.push(action.payload.data as any);
    });
    builder.addCase(createPackage.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || 'Failed to create package';
    });

    // updatePackage
    builder.addCase(updatePackage.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updatePackage.fulfilled, (state, action) => {
      state.loading = false;
      const updatedPackage = action.payload.data as Package;
      const index = state.packages.findIndex(pkg => pkg.id === updatedPackage.id);
      if (index !== -1) {
        state.packages[index] = updatedPackage;
      }
      if (state.selectedPackage?.id === updatedPackage.id) {
        state.selectedPackage = updatedPackage;
      }
    });
    builder.addCase(updatePackage.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || 'Failed to update package';
    });

    // deletePackage
    builder.addCase(deletePackage.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(deletePackage.fulfilled, (state, action) => {
      state.loading = false;
      state.packages = state.packages.filter(pkg => pkg.id !== action.payload);
      if (state.selectedPackage?.id === action.payload) {
        state.selectedPackage = null;
      }
    });
    builder.addCase(deletePackage.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || 'Failed to delete package';
    });

    // activatePackage
    builder.addCase(activatePackage.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(activatePackage.fulfilled, (state) => {
      state.loading = false;
    });
    builder.addCase(activatePackage.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || 'Failed to activate package';
    });
  },
});

export const { clearPackageError, resetPackageState } = packageSlice.actions;

// Selectors
export const selectAllPackages = (state: RootState) => state.packages.packages;
export const selectSelectedPackage = (state: RootState) => state.packages.selectedPackage;
export const selectPackageLoading = (state: RootState) => state.packages.loading;
export const selectPackageError = (state: RootState) => state.packages.error;

export default packageSlice.reducer;
//   async (packageId: string, { rejectWithValue }) => {
//     try {
//       const token = localStorage.getItem('token');
//       const response = await axios.post(`${API_URL}/activate`, { packageId }, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       return response.data;
//     } catch (error: any) {
//       return rejectWithValue(error.response?.data?.message || 'Failed to activate package');
//     }
//   }
// );

// // Initial state
// const initialState: PackageState = {
//   packages: [],
//   selectedPackage: null,
//   loading: false,
//   error: null
// };

// // Slice
// const packageSlice = createSlice({
//   name: 'packages',
//   initialState,
//   reducers: {
//     setSelectedPackage: (state, action) => {
//       state.selectedPackage = action.payload;
//     },
//     clearError: (state) => {
//       state.error = null;
//     }
//   },
//   extraReducers: (builder) => {
//     builder
//       // getAllPackages
//       .addCase(getAllPackages.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(getAllPackages.fulfilled, (state, action) => {
//         state.loading = false;
//         state.packages = action.payload;
//       })
//       .addCase(getAllPackages.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload as string;
//       })
      
//       // getPackageById
//       .addCase(getPackageById.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(getPackageById.fulfilled, (state, action) => {
//         state.loading = false;
//         state.selectedPackage = action.payload;
//       })
//       .addCase(getPackageById.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload as string;
//       })
      
//       // createPackage
//       .addCase(createPackage.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(createPackage.fulfilled, (state, action) => {
//         state.loading = false;
//         state.packages.push(action.payload);
//       })
//       .addCase(createPackage.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload as string;
//       })
      
//       // updatePackage
//       .addCase(updatePackage.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(updatePackage.fulfilled, (state, action) => {
//         state.loading = false;
//         const index = state.packages.findIndex(pkg => pkg.id === action.payload.id);
//         if (index !== -1) {
//           state.packages[index] = action.payload;
//         }
//         if (state.selectedPackage?.id === action.payload.id) {
//           state.selectedPackage = action.payload;
//         }
//       })
//       .addCase(updatePackage.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload as string;
//       })
      
//       // deletePackage
//       .addCase(deletePackage.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(deletePackage.fulfilled, (state, action) => {
//         state.loading = false;
//         state.packages = state.packages.filter(pkg => pkg.id !== action.payload);
//         if (state.selectedPackage?.id === action.payload) {
//           state.selectedPackage = null;
//         }
//       })
//       .addCase(deletePackage.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload as string;
//       })
      
//       // activatePackage
//       .addCase(activatePackage.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(activatePackage.fulfilled, (state) => {
//         state.loading = false;
//       })
//       .addCase(activatePackage.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload as string;
//       });
//   }
// });

// export const { setSelectedPackage, clearError } = packageSlice.actions;
// export default packageSlice.reducer;