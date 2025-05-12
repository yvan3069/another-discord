// src/components/provider/store-provider.tsx
"use client"; // 标记为客户端组件

import { useRef } from "react";
import { Provider } from "react-redux";
import { makeStore, AppStore } from "@/store/store";
import CreateServerModal from "@/components/modals/createServerModal";
// 如果需要，导入用于初始化 store 的 action
// import { initializeData } from '@/store/someSlice';

interface StoreProviderProps {
  // 可以选择性地接收从服务端组件传递过来的初始数据
  // initialData?: YourInitialDataType;
  children: React.ReactNode;
}

export default function StoreProvider({
  children /*, initialData */,
}: StoreProviderProps) {
  const storeRef = useRef<AppStore | null>(null);

  if (!storeRef.current) {
    // 首次渲染时创建 store 实例
    storeRef.current = makeStore();
    // 如果有从服务端传递的初始数据，可以在这里 dispatch action 来初始化 store
    // if (initialData) {
    //   storeRef.current.dispatch(initializeData(initialData));
    // }
  }

  // 将 store 实例传递给 Redux Provider
  return (
    <Provider store={storeRef.current}>
      <CreateServerModal />
      {children}
    </Provider>
  );
}
