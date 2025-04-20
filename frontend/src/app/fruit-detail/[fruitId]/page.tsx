"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import { useTranslation } from "react-i18next";

// Định nghĩa giao diện cho dữ liệu trái cây
interface FruitDetail {
  fruit_id: number;
  fruit_name: string;
  scientific_name: string | null;
  description: string | null;
  images: { image_id: number; image_url: string; description: string | null }[];
  benefits: { benefit_id: number; benefit: string; description: string | null }[];
  nutrition: { id: number; category: string; nutrient_name: string; amount: string; daily_value: string | null }[];
  availability: { region_name: string; month: number | null; is_year_round: boolean }[];
  categories: { category_id: number, category_name: string; description: string | null }[];
}

export default function FruitsDetail({ params }: { params: Promise<{ fruitId: number }> }) {
  const { t } = useTranslation();
  const [detail, setDetail] = useState<FruitDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      const fruitId = (await params).fruitId;
      if (fruitId) {
        try {
          const response = await axios.get(
            `http://127.0.0.1:8000/get-fruit-info?fruit_id=${encodeURIComponent(fruitId)}`
          );
          setDetail(response.data);
        } catch (error) {
          console.error("Error fetching detail:", error);
          setDetail(null);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchDetail();
  }, [params]);

  const groupByRegion = (availability: FruitDetail["availability"]) => {
    return availability.reduce((acc, item) => {
      const region = item.region_name;
      if (!acc[region]) {
        acc[region] = [];
      }
      acc[region].push(item);
      return acc;
    }, {} as Record<string, FruitDetail["availability"]>);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600 text-lg animate-pulse">Đang tải...</div>
      </div>
    );
  }

  if (!detail) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500 text-lg">Không tìm thấy thông tin trái cây</div>
      </div>
    );
  }

  const groupedAvailability = groupByRegion(detail.availability);

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between bg-gradient-to-r from-orange-600 to-orange-400 p-6 text-white shadow-md hover:bg-blue-700">
          <div>
            <h1 className="text-3xl font-bold">{t(`fruits.${detail.fruit_name}`)}</h1>
            {detail.scientific_name && (
              <p className="text-sm italic opacity-80">Tên khoa học: {detail.scientific_name}</p>
            )}
          </div>
          {/* <div className="h-full">
            <Image
              src="/apple/apple1.jpg"
              alt={t(`fruits.${detail.fruit_name}`)}
              width={80}
              height={100}
              objectFit="cover"
              className="transition-transform duration-300 hover:scale-110"
            />
          </div> */}
        </div>

        {/* Nội dung chính */}
        <div className="p-6 space-y-6">
          {detail.images.length > 0 && (
            <div className="flex justify-center">
              <img
                src={detail.images[0].image_url}
                alt={t(`fruits.${detail.fruit_name}`)}
                className="w-full max-w-md h-64 object-cover rounded-lg shadow-md"
              />
            </div>
          )}

          {detail.description && (
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Mô tả</h2>
              <p className="text-gray-600 leading-relaxed">{detail.description}</p>
            </div>
          )}

          {detail.benefits.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Lợi ích</h2>
              <ul className="space-y-2">
                {detail.benefits.map((benefit) => (
                  <li key={benefit.benefit_id} className="flex items-start">
                    <span className="text-green-500 mr-2">✔</span>
                    <div>
                      <p className="font-medium text-gray-700">{benefit.benefit}</p>
                      {benefit.description && (
                        <p className="text-sm text-gray-500">{benefit.description}</p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {detail.nutrition.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Giá trị dinh dưỡng</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {detail.nutrition.map((nutri) => (
                  <div
                    key={nutri.id}
                    className="bg-gray-50 p-3 rounded-lg shadow-sm border border-gray-200"
                  >
                    <p className="font-medium text-gray-700">{nutri.nutrient_name}</p>
                    <p className="text-sm text-gray-600">
                      <strong>Lượng:</strong> {nutri.amount}
                    </p>
                    {nutri.daily_value && (
                      <p className="text-sm text-gray-600">
                        <strong>Giá trị hàng ngày:</strong> {nutri.daily_value}
                      </p>
                    )}
                    <p className="text-xs text-gray-500 italic">{nutri.category}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {detail.availability.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Có thể tìm thấy ở</h2>
              <ul className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {Object.entries(groupedAvailability).map(([region, items]) => (
                  <li key={region} className="bg-blue-50 p-2 rounded-lg shadow-sm">
                    <div className="flex items-center mb-2">
                      <span className="text-blue-500 mr-2">📍</span>
                      <h3 className="text-lg font-medium text-gray-800">Miền {region}</h3>
                    </div>
                    <ul className="ml-6">
                      {items.some((item) => item.is_year_round) ? (
                        <li className="text-sm text-green-600 font-medium">Có quanh năm</li>
                      ) : (
                        <li className="text-sm text-gray-600">
                          Tháng:{" "}
                          {items
                            .map((item) => item.month)
                            .filter((month): month is number => month !== null)
                            .sort((a, b) => a - b)
                            .join(", ")}
                        </li>
                      )}
                    </ul>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="p-6 bg-gray-50 border-t border-gray-200 flex justify-end">
          <button
            onClick={() => window.history.back()}
            className="bg-orange-600 text-white py-2 px-6 rounded-lg hover:bg-orange-700 transition-colors"
          >
            Quay lại
          </button>
        </div>
      </div>
    </div>
  );
}