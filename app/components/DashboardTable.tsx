import React from "react";
import Link from "next/link";
import Image from "next/image";
import { IProduct } from "../types";


interface DashboardTableProps {
  products: IProduct[];
  onDelete: (id: string) => void;
}

export const DashboardTable: React.FC<DashboardTableProps> = ({ products, onDelete }) => {
  return (
    <div className="w-full bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-150">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Product</th>
              <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</th>
              <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Price</th>
              <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Stock</th>
              <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {products.map((product) => (
              <tr key={product._id} className="hover:bg-gray-50/50 transition-colors">
                <td className="p-4 flex items-center space-x-3">
                  <div className="relative h-12 w-12 rounded-lg bg-gray-50 overflow-hidden shrink-0 border border-gray-100">
                    <Image
                      src={product.image.url}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="max-w-50">
                    <p className="font-semibold text-sm text-gray-800 truncate">{product.name}</p>
                    <p className="text-xs text-gray-400 truncate">{product.description || "No description"}</p>
                  </div>
                </td>
                <td className="p-4">
                  <span className="text-xs font-medium px-2.5 py-1 rounded-md bg-gray-100 text-gray-600">
                    {product.category}
                  </span>
                </td>
                <td className="p-4 font-medium text-sm text-gray-900">${product.price.toFixed(2)}</td>
                <td className="p-4 text-sm text-gray-500">{product.stock} units</td>
                <td className="p-4 text-right space-x-2">
                  <Link
                    href={`/dashboard/products/${product._id}/edit`}
                    className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => onDelete(product._id)}
                    className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DashboardTable;