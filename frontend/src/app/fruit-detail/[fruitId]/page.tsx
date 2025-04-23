"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import { useTranslation } from "react-i18next";

// Định nghĩa giao diện cho dữ liệu trái cây
interface FruitDetail {
  fruit_id: number;
  fruit_name: string;
  fruit_scientificname: string | null;
  fruit_description: string | null;
  images: { fi_id: number; fi_path: string }[];
  benefits: { benefit_id: number; benefit_name: string; benefit_description: string | null }[];
  categories: { category_id: number; category_name: string; category_description: string | null }[];
  availabilities: {
    availability_id: number;
    riv_id: number;
    fruit_id: number;
    availability_isyearround: boolean;
    region: { riv_id: number; riv_name: string };
    months: { month_stt: number; month_name: string }[];
  }[];
  nutritions: {
    nutrition_id: number;
    fruit_id: number;
    nutrition_nutrientname: string;
    nutrition_amountvalue: number;
    nutrition_dailyvaluepercent: number | null;
    unit: { nu_id: number; nu_name: string; nu_description: string | null };
    nu_category: { nc_id: number; nc_name: string; nc_description: string | null };
  }[];
}

export default function FruitsDetail({ params }: { params: Promise<{ fruitId: string }> }) {
  const { t } = useTranslation();
  const [detail, setDetail] = useState<FruitDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const { fruitId } = await params;
        const id = Number(fruitId);
        if (isNaN(id)) {
          throw new Error("ID trái cây không hợp lệ");
        }
        const response = await axios.get(
          `http://127.0.0.1:8000/get-fruit-info?id=${encodeURIComponent(id)}`
        );
        setDetail(response.data);
        setError(null);
      } catch (error) {
        console.error("Lỗi khi tải thông tin trái cây:", error);
        setError("Không thể tải thông tin trái cây. Vui lòng thử lại sau.");
        setDetail(null);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [params]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-gray-600 text-lg animate-pulse">Đang tải...</div>
      </div>
    );
  }

  if (error || !detail) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-red-500 text-lg">{error || "Không tìm thấy trái cây"}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between bg-gradient-to-r from-orange-600 to-orange-400 p-6 text-white shadow-md">
          <div>
            <h1 className="text-3xl font-bold">{t(detail.fruit_name)}</h1>
            {detail.fruit_scientificname && (
              <p className="text-sm italic opacity-80">Tên khoa học: {t(detail.fruit_scientificname)}</p>
            )}
          </div>
        </div>

        {/* Nội dung chính */}
        <div className="p-6 space-y-6">
          {detail.images.length > 0 && (
            <div className="flex justify-center">
              <Image
                src={detail.images[1].fi_path}
                alt={detail.fruit_name}
                width={400}
                height={300}
                className="rounded-lg shadow-md object-cover transition-transform duration-300 hover:scale-105"
              />
            </div>
          )}

          {detail.fruit_description && (
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Mô tả</h2>
              <p className="text-gray-600 leading-relaxed">{t(detail.fruit_description)}</p>
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
                      <p className="font-medium text-gray-700">{t(benefit.benefit_name)}</p>
                      {benefit.benefit_description && (
                        <p className="text-sm text-gray-500">{t(benefit.benefit_description)}</p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {detail.nutritions.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Dinh dưỡng</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {detail.nutritions.map((nutri) => (
                  <div
                    key={nutri.nutrition_id}
                    className="bg-gray-50 p-3 rounded-lg shadow-sm border border-gray-200"
                  >
                    <p className="font-medium text-gray-700">{t(nutri.nutrition_nutrientname)}</p>
                    <p className="text-sm text-gray-600">
                      <strong>Hàm lượng:</strong> {nutri.nutrition_amountvalue} {nutri.unit.nu_name}
                    </p>
                    {nutri.nutrition_dailyvaluepercent && (
                      <p className="text-sm text-gray-600">
                        <strong>Giá trị hàng ngày:</strong> {nutri.nutrition_dailyvaluepercent}%
                      </p>
                    )}
                    <p className="text-xs text-gray-500 italic">{t(nutri.nu_category.nc_name)}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {detail.availabilities.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Có ở đâu và khi nào?</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {detail.availabilities.map((avail) => (
                  <div
                    key={avail.availability_id}
                    className="bg-blue-50 p-4 rounded-lg shadow-sm border border-blue-200"
                  >
                    <div className="flex items-center mb-2">
                      <span className="text-blue-500 mr-2">📍</span>
                      <h3 className="text-lg font-medium text-gray-800">{t(avail.region.riv_name)}</h3>
                    </div>
                    {avail.availability_isyearround ? (
                      <p className="text-sm text-green-600 font-medium">Quanh năm</p>
                    ) : avail.months.length > 0 ? (
                      <p className="text-sm text-gray-600">
                        <strong>Tháng:</strong>{" "}
                        {avail.months
                          .map((month) => {
                            const monthNamesVi: { [key: string]: string } = {
                              january: "1",
                              february: "2",
                              march: "3",
                              april: "4",
                              may: "5",
                              june: "6",
                              july: "7",
                              august: "8",
                              september: "9",
                              october: "10",
                              november: "11",
                              december: "12",
                            };
                            return monthNamesVi[month.month_name.toLowerCase()] || month.month_name;
                          })
                          .sort((a, b) => {
                            const monthOrder = [
                              "Tháng Một",
                              "Tháng Hai",
                              "Tháng Ba",
                              "Tháng Tư",
                              "Tháng Năm",
                              "Tháng Sáu",
                              "Tháng Bảy",
                              "Tháng Tám",
                              "Tháng Chín",
                              "Tháng Mười",
                              "Tháng Mười Một",
                              "Tháng Mười Hai",
                            ];
                            return monthOrder.indexOf(a) - monthOrder.indexOf(b);
                          })
                          .join(", ")}
                      </p>
                    ) : (
                      <p className="text-sm text-gray-600 italic">Không có thông tin</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {detail.categories.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Danh mục</h2>
              <div className="flex flex-wrap gap-2">
                {detail.categories.map((category) => (
                  <span
                    key={category.category_id}
                    className="bg-orange-100 text-orange-800 text-sm font-medium px-3 py-1 rounded-full"
                  >
                    {t(category.category_name)}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="p-6 bg-gray-50 border-t border-gray-200 flex justify-end">
          <button
            onClick={() => window.history.back()}
            className="bg-orange-600 text-white py-2 px-6 rounded-lg hover:bg-orange-700 transition-colors duration-200"
          >
            Quay lại
          </button>
        </div>
      </div>
    </div>
  );
}