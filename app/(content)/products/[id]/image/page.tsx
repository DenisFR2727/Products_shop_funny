import { getProduct } from "@/lib/api/api";
import { notFound } from "next/navigation";
import Link from "next/link";
import { PropsId } from "../page";

import "@/styles/globals.css";

export const dynamic = "force-static";

export default async function PhotoPage({ params }: PropsId) {
  const { id } = await params;
  const photo = await getProduct(+id);

  if (!photo) {
    notFound();
  }

  return (
    <div className="fullscreen-image">
      <h2>Image</h2>
      <Link href={`/`}>
        <img src={`${photo?.thumbnail}`} alt={photo?.title} />
      </Link>
    </div>
  );
}
