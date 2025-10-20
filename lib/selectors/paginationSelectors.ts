import { RootState } from "../store";

export const pageSelector = (state: RootState) => state.paginationPage.page;
