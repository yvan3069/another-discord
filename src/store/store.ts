import { configureStore } from "@reduxjs/toolkit";

import modalReducer from "./features/createModalSlice";

// export const store = configureStore({
//   reducer: {
//     modal: modalReducer,
//   },
// });
export const makeStore = () => {
  return configureStore({
    reducer: {
      modal: modalReducer,
    },
    //TODO: 当所有的序列化和反序列化完成时，删除此项。for redux
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false, // 不推荐禁用
      }),
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
