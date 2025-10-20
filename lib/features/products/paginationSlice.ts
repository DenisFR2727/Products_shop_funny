import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface PaginationProducts {
  page: number;
}

const initialState: PaginationProducts = {
  page: 1,
};
const paginationPage = createSlice({
  name: "pagination",
  initialState,
  reducers: {
    setPage(state, action: PayloadAction<number>) {
      state.page = action.payload;
    },
  },
});
export const { setPage } = paginationPage.actions;
export default paginationPage.reducer;
