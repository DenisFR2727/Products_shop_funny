"use client";
import Masonry from "react-masonry-css";
import "./unsplash-list.scss";

interface ChildrenProps {
  children: React.ReactNode;
}

export default function MasonryLayout({ children }: ChildrenProps) {
  return (
    <Masonry
      breakpointCols={{ default: 3, 768: 2, 480: 1 }}
      className="unsplash_list"
      columnClassName="unsplash_column"
    >
      {children}
    </Masonry>
  );
}
