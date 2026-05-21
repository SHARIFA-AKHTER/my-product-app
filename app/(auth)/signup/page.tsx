/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { Input } from "@/app/components/ui/Input";
import { Button } from "@/app/components/ui/Button";


export default function SignupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {
      return toast.error("All fields are required");
    }
    if (formData.password.length < 6) {
      return toast.error("Password must be at least 6 characters");
    }

    try {
      setLoading(true);
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Signup failed");

      toast.success("Account created successfully");
      router.push("/login");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-12 p-6 bg-white border border-gray-100 rounded-2xl shadow-sm">
      <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">Create an Account</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input id="name" label="Full Name" type="text" placeholder="John Doe" value={formData.name} onChange={handleChange} />
        <Input id="email" label="Email Address" type="email" placeholder="john@example.com" value={formData.email} onChange={handleChange} />
        <Input id="password" label="Password" type="password" placeholder="••••••••" value={formData.password} onChange={handleChange} />
        <Button type="submit" isLoading={loading}>Sign Up</Button>
      </form>
      <p className="mt-4 text-center text-sm text-gray-500">
        Already have an account? <Link href="/login" className="text-blue-600 font-semibold hover:underline">Login</Link>
      </p>
    </div>
  );
}