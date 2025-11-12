import { MessageTG } from "@/components/products/telegram-chat/telegram-chat-widget";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
  isOpen: false,
  messages: [],
  inputMessage: "",
  isLoading: false,
  error: null,
};

const tgChatSlice = createSlice({
  initialState,
  name: "telegram-chat",
  reducers: {
    setIsOpen(state, action: PayloadAction<boolean>) {
      state.isOpen = action.payload;
    },
    //  setMessages(state, action: PayloadAction<MessageTG[]>) {
    //    state.messages =
    //  },
  },
});

export const {} = tgChatSlice.actions;
export default tgChatSlice.reducer;
