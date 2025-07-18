import "react-native-get-random-values";

// project import
import reducers, { RootState } from "./reducers";

// third-party
import React from "react";
import Constants from "expo-constants";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE,
} from "redux-persist";

import { encryptTransform } from "redux-persist-transform-encrypt";
import { setupListeners } from "@reduxjs/toolkit/query";
import { apiMiddlewares } from "../api/services";
import { Persistor } from "redux-persist/es/types";
import AsyncStorage from "@react-native-async-storage/async-storage";

// ==============================|| REDUX PERSIST For Next.js SSR ||============================== //
import { PersistGate } from "redux-persist/integration/react";

// ==============================|| REDUX TOOLKIT - MAIN STORE ||============================== //

const APP_NAME = Constants.expoConfig?.extra?.APP_NAME || "MyApp";

const persistConfig = {
  keyPrefix: APP_NAME.replaceAll(" ", "-").toLowerCase() + "-",
  key: "store",
  storage: AsyncStorage,
  transforms: [
    // For Store Encryption in LocalStorage
    encryptTransform({
      secretKey: "your-secret-key", // Replace with your actual secret key
      onError: function (error: any) {
        console.log("Error during encryption", error);
      },
    }),
  ],
  // whitelist : ["amount"],
  // blacklist : ["users"],
};

// Persist All reducers
const persistedReducer = persistReducer<RootState>(persistConfig, reducers);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(...apiMiddlewares);
  },
});

// Setup React Query listeners for re-fetching on app focus or network change etc
setupListeners(store.dispatch);

const persistor = persistStore(store) as Persistor;

const { dispatch } = store;

interface ReduxPersistedProps {
  children: React.ReactNode;
}

export type AppDispatch = typeof store.dispatch;

const ReduxPersisted = ({ children }: ReduxPersistedProps) => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  );
};

export { store, dispatch, ReduxPersisted };
