// src/store/slices/uiSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface UiState {
  theme: 'light' | 'dark';
  sidebarOpen: boolean;
  expandedMenuItems: string[]; // IDs of expanded menu items
}

const initialState: UiState = {
  theme: 'light',
  sidebarOpen: true,
  expandedMenuItems: [], // Default to empty array - no expanded items
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
    },
    // New reducers for menu state management
    toggleMenuItem: (state, action: PayloadAction<string>) => {
      const itemId = action.payload;
      const index = state.expandedMenuItems.indexOf(itemId);
      
      if (index >= 0) {
        // Remove item if already expanded
        state.expandedMenuItems.splice(index, 1);
      } else {
        // Add item to expanded items
        state.expandedMenuItems.push(itemId);
      }
    },
    expandMenuItem: (state, action: PayloadAction<string>) => {
      if (!state.expandedMenuItems.includes(action.payload)) {
        state.expandedMenuItems.push(action.payload);
      }
    },
    collapseMenuItem: (state, action: PayloadAction<string>) => {
      const index = state.expandedMenuItems.indexOf(action.payload);
      if (index >= 0) {
        state.expandedMenuItems.splice(index, 1);
      }
    },
    resetMenuState: (state) => {
      state.expandedMenuItems = [];
    }
  },
});

export const { 
  toggleTheme, 
  toggleSidebar, 
  setSidebarOpen, 
  toggleMenuItem,
  expandMenuItem,
  collapseMenuItem,
  resetMenuState
} = uiSlice.actions;

export default uiSlice.reducer;
