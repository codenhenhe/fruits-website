"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";

interface Fruit {
  fruit_id: number;
  fruit_name: string;
}

interface FruitResponse {
  data: Fruit[];
}

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [fruits, setFruits] = useState<FruitResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isInputHovered, setIsInputHovered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Hàm gọi API tìm kiếm
  const fetchFruits = async (searchQuery: string) => {
    try {
      setIsLoading(true);
      const response = await axios.get("http://127.0.0.1:8000/fruits", {
        params: { name: searchQuery },
      });
      setFruits(response.data);
      setError(null);
    } catch (error: any) {
      console.error("Error fetching fruits:", error);
      if (error.response) {
        setError(error.response.data.detail || "Đã có lỗi xảy ra");
        setFruits(null);
      } else {
        setError("Không thể kết nối đến server");
        setFruits(null);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Sử dụng useEffect để gọi API mỗi khi query thay đổi
  useEffect(() => {
    if (query.trim() === "") {
      setFruits(null);
      setError(null);
      setIsLoading(false);
      return;
    }

    const delayDebounce = setTimeout(() => {
      fetchFruits(query);
    }, 300); // Tăng thời gian debounce lên 300ms

    return () => clearTimeout(delayDebounce);
  }, [query]);

  return (
    <div className="relative inline-block max-w-md w-full">
      <div className="flex items-center w-full relative">
        <div className="absolute mx-2 left-0 inset-y-0 flex items-center">
          <svg
            className="w-4 h-4 text-gray-500 dark:text-gray-400"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 20 20"
          >
            <path
              stroke="currentColor"
              strokeLinejoin="round"
              strokeLinecap="round"
              strokeWidth="2"
              d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
            />
          </svg>
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter fruit name..."
          onMouseEnter={() => setIsInputHovered(true)}
          onMouseLeave={() => setIsInputHovered(false)}
          onFocus={() => setIsInputHovered(true)}
          onBlur={() => setIsInputHovered(false)}
          className="w-full px-7 py-2 border text-black border-gray-500 rounded-lg focus:border-gray-500 placeholder:italic placeholder:text-gray-400"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-900 hover:bg-gray-300 rounded p-1"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="h-5 w-5 fill-current"
            >
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
            </svg>
          </button>
        )}
      </div>

      <div
        className={`absolute left-0 mt-3 w-[16rem] bg-white rounded-lg shadow-lg border border-gray-300 z-10 ${
          !isInputHovered && query.trim() === "" ? "hidden" : "block"
        }`}
      >
        {/* Mũi tên tam giác phía trên */}
        <div className="absolute -top-2 right-10 w-4 h-4 bg-white border-t border-l border-gray-300 transform rotate-45"></div>

        {/* Tiêu đề với biểu tượng ngôi sao */}
        <div className="flex items-center p-2 border-b border-gray-200">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className="h-5 w-5 mr-2 text-yellow-500 fill-current"
          >
            <path d="M12 .587l3.668 7.431 8.2 1.192-5.934 5.787 1.4 8.168L12 19.897l-7.334 3.868 1.4-8.168L.132 9.21l8.2-1.192L12 .587z" />
          </svg>
          <span className="text-gray-700 font-semibold">What you are looking for?</span>
        </div>

        {isLoading ? (
          <p className="p-2 text-gray-600 animate-pulse">Searching...</p>
        ) : error ? (
          <p className="p-2 text-red-500">{error}</p>
        ) : fruits && fruits.data.length > 0 ? (
          fruits.data.map((fruit) => (
            <div
              key={fruit.fruit_id}
              className="p-2 border-b text-gray-600 border-gray-200 last:border-b-0 hover:bg-gray-100"
            >
              <Link href={`/fruit-detail/${fruit.fruit_id}`}>
                <button className="w-full text-left">{fruit.fruit_name}</button>
              </Link>
            </div>
          ))
        ) : query.trim() === "" ? (
          <p className="p-2 text-gray-600">Enter fruit name to search.</p>
        ) : (
          <p className="p-2 text-gray-600">No fruit found.</p>
        )}
      </div>
    </div>
  );
}