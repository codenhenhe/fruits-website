"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import Image from "next/legacy/image";
import { useTranslation } from "react-i18next";

interface Fruit {
  fruit_id: number;
  fruit_name: string;
}

interface FilterFruitsResponse {
  data: Fruit[];
  message: string | null;
}

export default function FruitFilter() {
  const { t } = useTranslation();
  const [region, setRegion] = useState<string>("");
  const [origin, setOrigin] = useState<string>("");
  const [benefit, setBenefit] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [fruits, setFruits] = useState<FilterFruitsResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [regions, setRegions] = useState<string[]>([]);
  const [origins, setOrigins] = useState<string[]>([]);
  const [benefits, setBenefits] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);

  // Hàm lấy danh sách regions, origins, benefits, categories từ API
  const fetchFilterOptions = async () => {
    try {
      const [regionsRes, originsRes, benefitsRes, categoriesRes] = await Promise.all([
        axios.get("http://127.0.0.1:8000/regions").catch((err) => {
          console.error("Error fetching /regions:", err);
          throw err;
        }),
        axios.get("http://127.0.0.1:8000/origins").catch((err) => {
          console.error("Error fetching /origins:", err);
          throw err;
        }),
        axios.get("http://127.0.0.1:8000/benefits").catch((err) => {
          console.error("Error fetching /benefits:", err);
          throw err;
        }),
        axios.get("http://127.0.0.1:8000/categories").catch((err) => {
          console.error("Error fetching /categories:", err);
          throw err;
        }),
      ]);

      // Kiểm tra và log dữ liệu trả về
      console.log("Regions response:", regionsRes.data);
      console.log("Origins response:", originsRes.data);
      console.log("Benefits response:", benefitsRes.data);
      console.log("Categories response:", categoriesRes.data);

      setRegions(Array.isArray(regionsRes.data.regions) ? regionsRes.data.regions : []);
      setOrigins(Array.isArray(originsRes.data.origins) ? originsRes.data.origins : []);
      setBenefits(Array.isArray(benefitsRes.data.benefits) ? benefitsRes.data.benefits : []);
      setCategories(Array.isArray(categoriesRes.data.categories) ? categoriesRes.data.categories : []);
    } catch (error: any) {
      console.error("Error fetching filter options:", error);
      setError("Không thể tải tùy chọn bộ lọc");
    }
  };

  
  useEffect(() => {
    fetchFilterOptions();
  }, []);

  // Hàm gọi API lọc trái cây
  const fetchFilteredFruits = async () => {
    try {
      setIsLoading(true);
      const params: Record<string, string> = {};
      if (region) params.region = region;
      if (origin) params.origin = origin;
      if (benefit) params.benefit = benefit;
      if (category) params.category = category;

      const response = await axios.get("http://127.0.0.1:8000/filter-fruits", { params });
      setFruits(response.data);
      setError(null);
    } catch (error: any) {
      console.error("Error fetching filtered fruits:", error);
      setError("Không thể kết nối đến server");
      setFruits(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (region || origin || benefit || category) {
      fetchFilteredFruits();
    } else {
      setFruits(null);
    }
  }, [region, origin, benefit, category]);

  const clearFilters = () => {
    setRegion("");
    setOrigin("");
    setBenefit("");
    setCategory("");
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Bộ lọc */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <h2 className="text-2xl text-center font-semibold text-gray-800 mb-4">{t("Filter fruits")}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Lọc theo miền */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t("Region")}</label>
            <select
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
            >
              <option value="">{t("Select region")}</option>
              {Array.isArray(regions) && regions.map((r) => (
                <option key={r} value={r}>
                  {t(r)}
                </option>
              ))}
            </select>
          </div>

          {/* Lọc theo nguồn gốc */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t("Origin")}</label>
            <select
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
            >
              <option value="">{t("Select origin")}</option>
              {Array.isArray(origins) && origins.map((o) => (
                <option key={o} value={o}>
                  {t(o)}
                </option>
              ))}
            </select>
          </div>

          {/* Lọc theo lợi ích */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t("Benefit")}</label>
            <select
              value={benefit}
              onChange={(e) => setBenefit(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
            >
              <option value="">{t("Select benefit")}</option>
              {Array.isArray(benefits) && benefits.map((b) => (
                <option key={b} value={b}>
                  {t(b)}
                </option>
              ))}
            </select>
          </div>

          {/* Lọc theo loại trái cây */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t("Category")}</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
            >
              <option value="">{t("Select category")}</option>
              {Array.isArray(categories) && categories.map((c) => (
                <option key={c} value={c}>
                  {t(c)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Nút xóa bộ lọc */}
        <div className="mt-4 flex justify-end">
          <button
            onClick={clearFilters}
            className="bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
          >
            {t("Clear filters")}
          </button>
        </div>
      </div>

      {(region || origin || benefit || category) && (
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">{t("Filtered fruits")}</h2>
          {isLoading ? (
            <p className="text-gray-600 animate-pulse">{t("loading")}</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : fruits ? (
            fruits.data.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {fruits.data.map((fruit) => (
                  <Link key={fruit.fruit_id} href={`/fruit-detail/${fruit.fruit_id}`}>
                    <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors">
                      <p className="text-lg font-medium text-gray-800">{t(fruit.fruit_name)}</p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">
                {fruits.message ? t(fruits.message) : t("Không có thông tin.")}
              </p>
            )
          ) : null}
        </div>
      )}
    </div>
  );
}