/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import toast from "react-hot-toast";
import { Input } from "@/app/components/ui/Input";
import { Button } from "@/app/components/ui/Button";

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [loading, setLoading] = useState<boolean>(false);
  const [fetching, setFetching] = useState<boolean>(true);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "",
  });
  const [currentImage, setCurrentImage] = useState({ url: "", publicId: "" });

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const res = await fetch(`/api/products/${id}`);
        if (!res.ok) throw new Error("Product details not found");
        const data = await res.json();
        
        setFormData({
          name: data.name,
          description: data.description || "",
          price: String(data.price),
          category: data.category,
          stock: String(data.stock),
        });
        setCurrentImage(data.image);
      } catch (error: any) {
        toast.error(error.message);
        router.push("/dashboard");
      } finally {
        setFetching(false);
      }
    };
    if (id) fetchProductDetails();
  }, [id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      let finalImage = currentImage;

      // Bonus Feature: Replace old Cloudinary image if new file is selected
      if (imageFile) {
        const imagePayload = new FormData();
        imagePayload.append("file", imageFile);

        const uploadRes = await fetch("/api/products", {
          method: "POST",
          headers: { "X-Action": "UPLOAD" },
          body: imagePayload,
        });
        const uploadData = await uploadRes.json();
        if (!uploadRes.ok) throw new Error(uploadData.error);
        finalImage = uploadData.image;
      }

      const res = await fetch(`/api/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          price: Number(formData.price),
          stock: Number(formData.stock),
          image: finalImage,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Update failed");

      toast.success("Product updated successfully");
      router.push("/dashboard");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className="text-center py-12 text-sm text-gray-500">Loading details...</div>;

  return (
    <div className="max-w-xl mx-auto p-6 bg-white border border-gray-100 rounded-2xl shadow-sm">
      <h2 className="text-xl font-bold text-gray-800 mb-6">Edit Product</h2>
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
          <select id="category" value={formData.category} onChange={handleInputChange} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:outline-none">
            <option value="Electronics">Electronics</option>
            <option value="Clothing">Clothing</option>
            <option value="Gadgets">Gadgets</option>
            <option value="Home Decor">Home Decor</option>
          </select>
        </div>
        <div className="space-y-1">
          <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider">Change Image (Optional)</label>
          <input type="file" accept="image/*" onChange={(e) => e.target.files && setImageFile(e.target.files[0])} className="w-full text-sm text-gray-500" />
        </div>
        <Button type="submit" isLoading={loading}>Save Changes</Button>
      </form>
    </div>
  );
}