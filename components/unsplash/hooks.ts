"use client";
import { getPhotos } from "@/lib/api";
import { UnsPlash } from "@/lib/types";
import { useEffect, useRef, useState } from "react";

export default function useUnsplashLoadingPage() {
  const [photos, setPhotos] = useState<UnsPlash[]>([]);
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const srollTrigger = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const data = await getPhotos(page, 9);
      setPhotos((prev) => {
        const merged = [...prev, ...data];
        const unique = merged.filter(
          (photo, index, self) =>
            index === self.findIndex((p) => p.id === photo.id)
        );
        return unique;
      });
      setLoading(false);
    };
    load();
  }, [page]);

  // IntersectionObserver auto loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading) {
          setPage((p) => p + 1);
        }
      },
      {
        rootMargin: "1500px",
      }
    );

    if (srollTrigger.current) {
      observer.observe(srollTrigger.current);
    }

    return () => {
      if (srollTrigger.current) {
        observer.unobserve(srollTrigger.current);
      }
    };
  }, [loading]);

  return { photos, srollTrigger, loading };
}
