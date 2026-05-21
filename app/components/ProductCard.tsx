import React from "react";
import Image from "next/image";
import { IProduct } from "../types";


interface ProductCardProps {
  product: IProduct;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <div className="group bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col h-full">
      {/* Product Image Wrapper */}
      <div className="relative w-full h-48 bg-gray-50 overflow-hidden">
        <Image
          src={product.image.url}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          priority={false}
        />
      </div>

      {/* Card Body */}
      <div className="p-5 flex flex-col flex-grow justify-between space-y-4">
        <div className="space-y-1">
          <span className="text-xs font-semibold tracking-wider text-blue-600 uppercase">
            {product.category}
          </span>
          <h3 className="font-bold text-gray-800 text-lg line-clamp-1 group-hover:text-blue-600 transition-colors">
            {product.name}
          </h3>
          <p className="text-sm text-gray-500 line-clamp-2">
            {product.description || "No description provided."}
          </p>
        </div>

        {/* Pricing & Stock Status */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-50">
          <span className="text-xl font-extrabold text-gray-900">
            ${product.price.toFixed(2)}
          </span>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            product.stock > 0 ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
          }`}>
            {product.stock > 0 ? `${product.stock} In Stock` : "Out of Stock"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;