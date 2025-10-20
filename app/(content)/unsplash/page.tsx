import UnsplashList from "@/components/unsplash/unsplash-list";
import "@/styles/globals.css";

export default async function UnsPlashPage({ modal }: any) {
  return (
    <>
      {modal}
      <UnsplashList />
    </>
  );
}
