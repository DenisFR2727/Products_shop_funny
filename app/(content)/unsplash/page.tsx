import UnsplashList from "@/components/unsplash/unsplash-list";
import "@/styles/globals.css";

export const metadata = {
  title: "Unsplash pages",
  description: "Unsplash pages random.",
};

export default async function UnsPlashPage({ modal }: any) {
  return (
    <>
      {modal}
      <UnsplashList />
    </>
  );
}
