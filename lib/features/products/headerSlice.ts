import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface PaginationProducts {
  isOpenMenu: boolean;
}

const initialState: PaginationProducts = {
  isOpenMenu: false,
};
const headerDynamicMenu = createSlice({
  name: "header-menu",
  initialState,
  reducers: {
    setIsOpenMenuHeader(state, action: PayloadAction<boolean>) {
      state.isOpenMenu = action.payload;
    },
  },
});
export const { setIsOpenMenuHeader } = headerDynamicMenu.actions;
export default headerDynamicMenu.reducer;
