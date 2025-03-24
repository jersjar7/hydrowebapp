// src/store/index.ts
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import { apiMiddleware } from './middleware/apiMiddleware';
import { validationMiddleware } from './middleware/validationMiddleware';
import { loggerMiddleware } from './middleware/loggerMiddleware';

import uiReducer, { UiState } from './slices/uiSlice';
import appReducer, { AppState } from './slices/appSlice';
import projectReducer, { ProjectState } from './slices/projectSlice';
import userReducer, { UserState } from './slices/userSlice';

// Define state types before using them
export interface AppRootState {
  ui: UiState;
  app: AppState;
  project: ProjectState;
  user: UserState;
}

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['project', 'user'],
};

const rootReducer = combineReducers({
  ui: uiReducer,
  app: appReducer,
  project: projectReducer,
  user: userReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(loggerMiddleware, apiMiddleware, validationMiddleware),
});

export const persistor = persistStore(store);

// Define RootState after store is created to avoid circular references
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

/* src/store/index.ts */
export * from "./slices";
export * from "./middleware";
export * from "./hooks";