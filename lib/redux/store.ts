import { configureStore } from "@reduxjs/toolkit";

import counterReducer from "./slices/couter";
import languageReducer from "./slices/language";
import authReducer from "./slices/auth";

export const makeStore = () => {
  return configureStore({
    reducer: {
      counter: counterReducer,
      language: languageReducer,
      auth: authReducer,
    },
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
