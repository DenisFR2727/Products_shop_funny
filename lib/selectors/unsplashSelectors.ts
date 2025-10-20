import { RootState } from "../store";

export const selectedPhotoSelector = (state: RootState) =>
  state.unsplashPage.selectedPhoto;
export const isLikeSelector = (state: RootState) =>
  state.unsplashPage.idPhotoData;
