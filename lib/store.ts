import { combineReducers, configureStore } from "@reduxjs/toolkit";
import cartSlice from "./features/products/cartSlice";
import filterProductsSlice from "./features/products/filterProductsSlice";
import paginationPage from "./features/products/paginationSlice";
import unsplashPage from "./features/unsplash/unsplashSlice";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";

const persistConfig = {
  key: "root",
  storage,
  blacklist: ["header-menu", "filterReducer", "paginationPage", "unsplash"],
};

const rootReducer = combineReducers({
  cartReducer: cartSlice,
  filterReducer: filterProductsSlice,
  paginationPage: paginationPage,
  unsplashPage: unsplashPage,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;
