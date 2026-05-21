/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Input } from "@/app/components/ui/Input";
import { Button } from "@/app/components/ui/Button";


export default function NewProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "Electronics",
    stock: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.stock || !imageFile) {
      return toast.error("Please fill in required fields and choose an image");
    }

    try {
      setLoading(true);

      // 1. Convert image to base64 or FormData to stream via endpoint
      const imagePayload = new FormData();
      imagePayload.append("file", imageFile);

      const uploadRes = await fetch("/api/products", {
        method: "POST",
        headers: { "X-Action": "UPLOAD" }, 
        body: imagePayload,
      });

      const uploadData = await uploadRes.json();
      if (!uploadRes.ok) throw new Error(uploadData.error || "Image upload failed");

      // 2. Create the product document
      const productRes = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          price: Number(formData.price),
          stock: Number(formData.stock),
          image: uploadData.image,
        }),
      });

      const productData = await productRes.json();
      if (!productRes.ok) throw new Error(productData.error || "Failed to create product");

      toast.success("Product created successfully");
      router.push("/dashboard");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white border border-gray-100 rounded-2xl shadow-sm">
      <h2 className="text-xl font-bold text-gray-800 mb-6">Add New Product</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input id="name" label="Product Name *" type="text" value={formData.name} onChange={handleInputChange} />
        
        <div className="space-y-1">
          <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider">Description</label>
          <textarea id="description" rows={3} value={formData.description} onChange={handleInputChange} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input id="price" label="Price ($) *" type="number" step="0.01" value={formData.price} onChange={handleInputChange} />
          <Input id="stock" label="Stock Quantity *" type="number" value={formData.stock} onChange={handleInputChange} />
        </div>

        <div className="space-y-1">
          <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider">Category *</label>
          <select id="category" value={formData.category} onChange={handleInputChange} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-100">
            <option value="Electronics">Electronics</option>
            <option value="Clothing">Clothing</option>
            <option value="Gadgets">Gadgets</option>
            <option value="Home Decor">Home Decor</option>
          </select>
        </div>

        <div className="space-y-1">
          <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider">Product Image *</label>
          <input type="file" accept="image/*" onChange={handleFileChange} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
        </div>

        <Button type="submit" isLoading={loading}>Publish Product</Button>
      </form>
    </div>
  );
}