/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { IProduct } from "../types";
import DashboardTable from "../components/DashboardTable";



export default function DashboardPage() {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchMyProducts = async () => {
    try {
      const res = await fetch("/api/products?myOnly=true");
      if (!res.ok) throw new Error("Failed to load your products");
      const data = await res.json();
      setProducts(data);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyProducts();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Delete failed");

      toast.success("Product deleted successfully");
      setProducts(products.filter((p) => p._id !== id));
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Merchant Dashboard</h1>
          <p className="text-sm text-gray-500">Manage and keep track of all your listed products.</p>
        </div>
        <Link href="/dashboard/products/new" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition">
          + Add New Product
        </Link>
      </div>

      {loading ? (
        <div className="space-y-3 animate-pulse">
          <div className="h-12 bg-gray-200 rounded-xl" />
          <div className="h-24 bg-gray-200 rounded-xl" />
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-200">
          <p className="text-gray-500">You haven't uploaded any products yet.</p>
        </div>
      ) : (
        <DashboardTable products={products} onDelete={handleDelete} />
      )}
    </div>
  );
}