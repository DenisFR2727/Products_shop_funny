import { UnsPlash } from "@/lib/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UnsplashState {
  selectedPhoto: UnsPlash | null;
  idPhotoData: string[];
}
const initialState: UnsplashState = {
  selectedPhoto: null,
  idPhotoData: [],
};

const unsplashPage = createSlice({
  name: "unsplash",
  initialState,
  reducers: {
    setSelectedPhoto(state, action: PayloadAction<UnsPlash | null>) {
      state.selectedPhoto = action.payload;
    },
    setIdPhotoToggle(state, action: PayloadAction<string>) {
      if (state.idPhotoData.includes(action.payload)) {
        state.idPhotoData = state.idPhotoData.filter(
          (id) => id !== action.payload
        );
      } else {
        state.idPhotoData.push(action.payload);
      }
    },
  },
});
export const { setSelectedPhoto, setIdPhotoToggle } = unsplashPage.actions;
export default unsplashPage.reducer;
