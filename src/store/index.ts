import { configureStore } from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage
import { AuthApi } from './auth/auth.api';
import { ProfileApi } from './profile/profile.api';
import { DashboardApi } from './dashboard/dashboard.api';
import profileReducer from './profile/profile.slice';

const profilePersistConfig = {
  key: 'profile',
  storage,
  whitelist: ['user', 'isLoggedIn'],
};

const persistedProfileReducer = persistReducer(
  profilePersistConfig,
  profileReducer
);

export const store = configureStore({
  reducer: {
    profile: persistedProfileReducer,
    [DashboardApi.reducerPath]: DashboardApi.reducer,
    [AuthApi.reducerPath]: AuthApi.reducer,
    [ProfileApi.reducerPath]: ProfileApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(
      AuthApi.middleware,
      ProfileApi.middleware,
      DashboardApi.middleware
    ),
});
export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
