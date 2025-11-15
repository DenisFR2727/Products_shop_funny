import { getProduct } from "@/lib/api/api";
import { notFound } from "next/navigation";
import { PropsId } from "../../page";
import ModalBackdrop from "@/components/products/modal/modal-backdrop";
import Image from "next/image";

import "@/styles/globals.css";

export const dynamic = "force-static";

export default async function PhotoPage({ params }: PropsId) {
  const { id } = await params;
  const photo = await getProduct(+id);

  if (!photo) {
    notFound();
  }

  return (
    <ModalBackdrop>
      <dialog className="modal" open>
        <div className="fullscreen-image">
          <Image
            src={`${photo?.thumbnail}`}
            alt={photo?.title}
            width={500}
            height={500}
          />
        </div>
      </dialog>
    </ModalBackdrop>
  );
}
