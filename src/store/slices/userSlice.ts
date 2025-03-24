import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserPreferences {
  units: 'metric' | 'imperial';
  decimals: number;
  autoSave: boolean;
}

export interface UserState {
  preferences: UserPreferences;
}

const initialState: UserState = {
  preferences: {
    units: 'metric',
    decimals: 2,
    autoSave: true,
  },
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUnits: (state, action: PayloadAction<'metric' | 'imperial'>) => {
      state.preferences.units = action.payload;
    },
    setDecimals: (state, action: PayloadAction<number>) => {
      state.preferences.decimals = action.payload;
    },
    setAutoSave: (state, action: PayloadAction<boolean>) => {
      state.preferences.autoSave = action.payload;
    },
    updatePreferences: (state, action: PayloadAction<Partial<UserPreferences>>) => {
      state.preferences = { ...state.preferences, ...action.payload };
    },
  },
});

export const { setUnits, setDecimals, setAutoSave, updatePreferences } = userSlice.actions;
export default userSlice.reducer;
