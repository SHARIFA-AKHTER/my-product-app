/* eslint-disable @typescript-eslint/no-explicit-any */

import { uploadImage } from "@/app/lib/cloudinary";
import dbConnect from "@/app/lib/dbConnect";
import { getAuthUser } from "@/app/lib/getAuthUser";
import Product from "@/app/models/Product";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const myOnly = searchParams.get("myOnly");
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";
    const sort = searchParams.get("sort") || "createdAt_desc";

    const userId = await getAuthUser();

    // 1. Dashboard specific filter
    if (myOnly === "true") {
      if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      const myProducts = await Product.find({ user: userId }).sort({ createdAt: -1 });
      return NextResponse.json(myProducts);
    }

    // 2. Public product search & filters
    const query: any = { name: { $regex: search, $options: "i" } };
    if (category) query.category = category;

    const sortOptions: any = {};
    if (sort === "price_asc") sortOptions.price = 1;
    else if (sort === "price_desc") sortOptions.price = -1;
    else sortOptions.createdAt = -1;

    const products = await Product.find(query).sort(sortOptions);
    return NextResponse.json(products);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const userId = await getAuthUser();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const action = req.headers.get("X-Action");

    // File binary uploader interface for Cloudinary
    if (action === "UPLOAD") {
      const formData = await req.formData();
      const file = formData.get("file") as File;
      if (!file) return NextResponse.json({ error: "No image file provided" }, { status: 400 });

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const uploadResult = await uploadImage(buffer);
      return NextResponse.json({ image: uploadResult });
    }

    // Regular product JSON creation
    const { name, description, price, category, stock, image } = await req.json();
    if (!name || price === undefined || stock === undefined || !image?.url) {
      return NextResponse.json({ error: "Validation failed. Missing properties." }, { status: 400 });
    }
    if (price < 0 || stock < 0) {
      return NextResponse.json({ error: "Price or stock cannot be negative" }, { status: 400 });
    }

    const product = await Product.create({ name, description, price, category, stock, image, user: userId });
    return NextResponse.json(product, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}