import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import { Channel, ChannelType, Member, Profile, Server } from "@prisma/client";
import { ServerWithMembersWithProfiles } from "@/type";

//import { ServerWithMembersWithProfiles } from "@/type";

export type OpenModalType =
  | "createServer"
  | "invite"
  | "editServer"
  | "members"
  | "createChannel"
  | "leaveServer"
  | "deleteServer"
  | "deleteChannel"
  | "editChannel"
  | "messageFile"
  | "deleteMessage"
  | null;

// to fit the redux
export type SerializableServer = Omit<Server, "createdAt" | "updateAt"> & {
  createdAt: string;
  updateAt: string;
};
// export type SerializableServerWithMembersWithProfiles = Omit<
//   ServerWithMembersWithProfiles,
//   "createdAt" | "updateAt"
// > & {
//   createdAt: string;
//   updateAt: string;
// };
export type SerializableServerWithMembersWithProfiles = Omit<
  Server & {
    members: (Member & {
      profile: Profile;
    })[];
  },
  "createdAt" | "updateAt"
> & {
  createdAt: string;
  updateAt: string;
};

// only server date is serialized.
export function serializeServer(
  server: Server | ServerWithMembersWithProfiles
): SerializableServer | SerializableServerWithMembersWithProfiles {
  return {
    ...server,
    createdAt: server.createdAt.toISOString(),
    updateAt: server.updateAt.toISOString(),
  };
}

interface ModalData {
  server?: SerializableServer | SerializableServerWithMembersWithProfiles;
}

export type ModalType = {
  openType: OpenModalType;
  channelType?: ChannelType;
  data?: ModalData;
  isOpen?: boolean;
  channel?: Channel;
  //messageFile
  apiUrl?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  query?: Record<string, string>;

  //deleteMessage
  socketUrl?: string;
  messageId?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  socketQuery?: Record<string, string>;
};

// 使用该类型定义初始 state
const initialState: ModalType = {
  openType: null,
  isOpen: false,
  data: {},
  channelType: ChannelType.TEXT,
};

export const modalSlice = createSlice({
  name: "modal",
  // `createSlice` 将从 `initialState` 参数推断 state 类型
  initialState,
  reducers: {
    onOpen: (state, action: PayloadAction<ModalType>) => {
      state.isOpen = true;
      if (action.payload.openType === "createServer") {
        state.openType = "createServer";
      }
      if (action.payload.openType === "invite") {
        state.openType = "invite";
        // TODO: 反序列化
        state.data = action.payload.data;
      }
      if (action.payload.openType === "editServer") {
        state.openType = "editServer";
        state.data = action.payload.data;
      }
      if (action.payload.openType === "members") {
        state.openType = "members";
        state.data = action.payload.data;
      }
      if (action.payload.openType === "createChannel") {
        state.openType = "createChannel";
        state.channelType = action.payload?.channelType || ChannelType.TEXT;
      }
      if (action.payload.openType === "leaveServer") {
        state.openType = "leaveServer";
        state.data = action.payload.data;
      }
      if (action.payload.openType === "deleteServer") {
        state.openType = "deleteServer";
        state.data = action.payload.data;
      }
      if (action.payload.openType === "deleteChannel") {
        state.openType = "deleteChannel";
        state.channel = action.payload.channel;
      }
      if (action.payload.openType === "editChannel") {
        state.openType = "editChannel";
        state.channel = action.payload.channel;
      }
      if (action.payload.openType === "messageFile") {
        state.openType = "messageFile";
        state.apiUrl = action.payload.apiUrl;
        state.query = action.payload.query;
      }
      if (action.payload.openType === "deleteMessage") {
        state.openType = "deleteMessage";
        state.socketUrl = action.payload.socketUrl;
        state.messageId = action.payload.messageId;
        state.socketQuery = action.payload.socketQuery;
      }
    },
    onClose: (state) => {
      state.isOpen = false;
      state.openType = null;
      state.data = {}; // Clear data on close
      state.apiUrl = undefined;
      state.query = undefined;
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
export const selectModalOpenType = (state: RootState) => state.modal.openType;
export const selectModalData = (state: RootState) => state.modal.data;
export const selectModalChannelType = (state: RootState) =>
  state.modal.channelType;
export const selectModalChannel = (state: RootState) => state.modal.channel;
export const selectModalApiUrl = (state: RootState) => state.modal.apiUrl;
export const selectModalQuery = (state: RootState) => state.modal.query;
export const selectModalSocketUrl = (state: RootState) => state.modal.socketUrl;
export const selectModalMessageId = (state: RootState) => state.modal.messageId;
export const selectModalSocketQuery = (state: RootState) =>
  state.modal.socketQuery;

export default modalSlice.reducer;
