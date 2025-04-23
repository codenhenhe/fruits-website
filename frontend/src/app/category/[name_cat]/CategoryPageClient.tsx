"use client"; // Chỉ định đây là Client Component

import Link from "next/link";
import Image from "next/legacy/image";
import { useState } from "react";

// Định nghĩa interface
interface FruitCard {
  id: number;
  name: string;
  image_url: string | null;
  category: string;
}

// Client Component - Hiển thị dữ liệu
export default function CategoryPageClient({ fruits, category }: { fruits: FruitCard[], category: string }) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  if (fruits.length === 0) {
    return (
      <div className="min-h-screen bg-orange-50 flex items-center justify-center">
        <p className="text-gray-600 text-lg">Không tìm thấy trái cây trong danh mục này</p>
      </div>
    );
  }

  // Phân trang
  const totalPages = Math.ceil(fruits.length / itemsPerPage);
  const currentFruits = fruits.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="min-h-screen bg-orange-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Tiêu đề danh mục */}
        <h1 className="text-3xl font-bold text-orange-800 mb-6 capitalize">
          {category.replace("-", " ")}
        </h1>

        {/* Danh sách thẻ trái cây */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {currentFruits.map((fruit) => (
            <Link
              key={fruit.id}
              href={`/fruits/${fruit.id}`}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:scale-105 hover:shadow-lg transition-shadow duration-500"
            >
              <div className="relative w-full h-48">
                <Image
                  src={fruit.image_url || "/placeholder.png"}
                  alt={fruit.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <h2 className="text-lg font-semibold text-gray-800">{fruit.name}</h2>
                <p className="text-sm text-gray-500">Nhấn để xem chi tiết</p>
              </div>
            </Link>
          ))}
        </div>

        {/* Nút phân trang */}
        {totalPages > 1 && (
          <div className="mt-8 flex justify-center space-x-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-orange-600 text-white rounded-lg disabled:bg-gray-400 hover:bg-orange-700 transition"
            >
              Trước
            </button>
            <span className="px-4 py-2 text-gray-700">
              Trang {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-orange-600 text-white rounded-lg disabled:bg-gray-400 hover:bg-orange-700 transition"
            >
              Sau
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
