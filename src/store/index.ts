import { configureStore } from '@reduxjs/toolkit';
import { loggerMiddleware } from './middleware/loggerMiddleware';
import uiReducer from './slices/uiSlice';
import appReducer from './slices/appSlice';
import projectReducer from './slices/projectSlice';
import userReducer from './slices/userSlice';

export const store = configureStore({
  reducer: {
    ui: uiReducer,
    app: appReducer,
    project: projectReducer,
    user: userReducer,
  },
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware().concat(loggerMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
