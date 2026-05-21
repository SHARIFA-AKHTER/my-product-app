/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";


import toast from "react-hot-toast";
import { IProduct } from "./types";
import ProductCard from "./components/ProductCard";

export default function HomePage() {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  
  const [search, setSearch] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [sort, setSort] = useState<string>("createdAt_desc");

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const query = new URLSearchParams({ search, category, sort });
      const res = await fetch(`/api/products?${query.toString()}`);
      
      if (!res.ok) {
        throw new Error("Failed to load products");
      }
      
      const data: IProduct[] = await res.json();
      setProducts(data);
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchProducts();
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [search, category, sort]);

  return (
    <div className="space-y-8">
      {/* Hero Header */}
      <div className="text-center md:text-left py-6 border-b border-gray-200">
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
          Explore Products
        </h1>
        <p className="mt-2 text-sm md:text-base text-gray-500">
          Discover high-quality items listed by our trusted sellers.
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <input
          type="text"
          placeholder="Search by product name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
        >
          <option value="">All Categories</option>
          <option value="Electronics">Electronics</option>
          <option value="Clothing">Clothing</option>
          <option value="Gadgets">Gadgets</option>
          <option value="Home Decor">Home Decor</option>
        </select>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
        >
          <option value="createdAt_desc">Latest Arrivals</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
        </select>
      </div>

      {/* UI States */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="border rounded-xl p-4 space-y-4 animate-pulse bg-white">
              <div className="bg-gray-200 h-48 w-full rounded-lg" />
              <div className="h-4 bg-gray-200 rounded w-2/3" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
              <div className="flex justify-between h-6 bg-gray-200 rounded w-full" />
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center p-6">
          <div className="text-gray-300 mb-4 text-5xl">📦</div>
          <h3 className="text-lg font-semibold text-gray-700">No Products Found</h3>
          <p className="text-sm text-gray-500 max-w-sm mt-1">
            We couldn't find anything matching your criteria. Try adjusting your filters or search terms.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}