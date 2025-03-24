// src/store/slices/appSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface AppState {
  loading: boolean;
  appVersion: string;
  initialized: boolean;
}

const initialState: AppState = {
  loading: false,
  appVersion: '0.1.0',
  initialized: false,
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setInitialized: (state, action: PayloadAction<boolean>) => {
      state.initialized = action.payload;
    },
  },
});

export const { setLoading, setInitialized } = appSlice.actions;
export default appSlice.reducer;
