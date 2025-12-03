import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { useDispatch, useSelector, TypedUseSelectorHook } from "react-redux";
import storage from "redux-persist/lib/storage";
import { persistStore, persistReducer } from "redux-persist";
import authReducer from "./authSlice";
import tenantReducer from "./tenantSlice";
import { agentsApi } from "@/services/agentsApi";

const rootPersistConfig = {
  key: "root",
  storage,
  whitelist: ["auth", "tenant"]
};

const rootReducer = combineReducers({
  auth: authReducer,
  tenant: tenantReducer,
  [agentsApi.reducerPath]: agentsApi.reducer,
});

const persistedReducer = persistReducer(rootPersistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false // redux-persist non-serializable warnings
    }).concat(agentsApi.middleware)
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
