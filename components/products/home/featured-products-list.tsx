"use client";

import { motion } from "framer-motion";
import ProductCard from "@/components/products/product-card";
import RippleGrid from "@/components/ui/ripple-grid/RippleGrid";
import { IProducts } from "@/lib/types";

import "./featured-products-list.scss";

const STAGGER_INTERVAL = 0.5;
const GRID_COLORS = ["#c4b5fd", "#7dd3fc", "#86efac"];

const containerVariants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: STAGGER_INTERVAL,
    },
  },
};

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 24,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

type FeaturedProductsListProps = {
  products: IProducts[];
  isToggle: boolean;
};

export default function FeaturedProductsList({
  products,
  isToggle,
}: FeaturedProductsListProps) {
  return (
    <motion.div
      className="home_products-marketing"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {products.map((product, index) => (
        <motion.div
          key={product.id}
          className="home_products-marketing__item"
          variants={cardVariants}
        >
          <div className="featured-card">
            <div className="featured-card__bg" aria-hidden="true">
              <RippleGrid
                gridColor={GRID_COLORS[index % GRID_COLORS.length]}
                rippleIntensity={0.04}
                gridSize={12}
                glowIntensity={0.15}
                opacity={0.9}
                mouseInteraction={false}
              />
            </div>
            <div className="featured-card__content">
              <ProductCard product={product} isToggle={isToggle} />
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
