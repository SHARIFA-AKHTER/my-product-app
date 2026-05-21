/* eslint-disable @typescript-eslint/no-explicit-any */
import dbConnect from "@/app/lib/dbConnect";
import { getAuthUser } from "@/app/lib/getAuthUser";
import Product from "@/app/models/Product";
import { NextResponse } from "next/server";


interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(req: Request, { params }: RouteParams) {
  try {
    await dbConnect();
    const { id } = await params;
    const product = await Product.findById(id);
    if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });
    return NextResponse.json(product);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: RouteParams) {
  try {
    await dbConnect();
    const userId = await getAuthUser();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const product = await Product.findById(id);
    if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });

    if (product.user.toString() !== userId) {
      return NextResponse.json({ error: "Forbidden: Not your product" }, { status: 403 });
    }

    const body = await req.json();
    const updatedProduct = await Product.findByIdAndUpdate(id, body, { new: true, runValidators: true });
    return NextResponse.json(updatedProduct);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: RouteParams) {
  try {
    await dbConnect();
    const userId = await getAuthUser();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const product = await Product.findById(id);
    if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });

    if (product.user.toString() !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await Product.findByIdAndDelete(id);
    return NextResponse.json({ message: "Product removed" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}