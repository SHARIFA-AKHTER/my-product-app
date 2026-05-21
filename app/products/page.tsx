
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import ProductCard from "../components/ProductCard";
interface IProduct {
  _id: string;
  name: string;
  description?: string;
  price: number;
  category: string;
  stock: number;
  image: { url: string; publicId: string };
  user: any;
  createdAt: any;
  updatedAt: any;
}

export default function BrowseProductsPage() {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUserProducts = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/products", { method: "GET" });

        if (res.status === 401) {
          toast.error("Please login to view your workspace products");
          setLoading(false);
          return;
        }

        if (!res.ok) throw new Error("Failed to load target data container");

        const data = await res.json();
        setProducts(data);
      } catch (error: any) {
        toast.error(error.message || "An unexpected dynamic error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchUserProducts();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-semibold text-gray-700">No Products Found</h2>
        <p className="text-gray-500 mt-2">You haven't uploaded any products yet.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Your Uploaded Products</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (

          <ProductCard key={product._id} product={product as any} />
        ))}
      </div>
    </div>
  );
}