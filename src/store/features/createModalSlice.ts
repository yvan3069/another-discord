import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import { Server } from "@prisma/client";

export type ModalType = "createServer";

interface ModalData {
  server?: Server;
}

// 为 slice state 定义一个类型
interface ModelState {
  type: ModalType | null;
  isOpen: boolean;
  data: ModalData;
}

// 使用该类型定义初始 state
const initialState: ModelState = {
  type: null,
  isOpen: false,
  data: {},
};

export const modalSlice = createSlice({
  name: "modal",
  // `createSlice` 将从 `initialState` 参数推断 state 类型
  initialState,
  reducers: {
    onOpen: (state, action: PayloadAction<ModalType>) => {
      if (action.payload === "createServer") {
        state.isOpen = true;
      }
    },
    onClose: (state) => {
      state.isOpen = false;
    },
    // 使用 PayloadAction 类型声明 `action.payload` 的内容
    // incrementByAmount: (state, action: PayloadAction<number>) => {
    //   state.value += action.payload;
    // },
  },
});

export const { onOpen, onClose } = modalSlice.actions;

// 选择器等其他代码可以使用导入的 `RootState` 类型
export const selectModalIsOpen = (state: RootState) => state.modal.isOpen;

export default modalSlice.reducer;
