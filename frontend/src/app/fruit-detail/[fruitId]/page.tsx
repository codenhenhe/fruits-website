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
          throw new Error("Invalid fruit ID");
        }
        const response = await axios.get(
          `http://127.0.0.1:8000/get-fruit-info?id=${encodeURIComponent(id)}`
        );
        setDetail(response.data);
        setError(null);
      } catch (error) {
        console.error("Error fetching fruit detail:", error);
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
        <div className="text-gray-600 text-lg animate-pulse">{t("loading")}</div>
      </div>
    );
  }

  if (error || !detail) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-red-500 text-lg">{error || t("fruit_not_found")}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between bg-gradient-to-r from-orange-600 to-orange-400 p-6 text-white shadow-md">
          <div>
            <h1 className="text-3xl font-bold">{detail.fruit_name}</h1>
            {detail.fruit_scientificname && (
              <p className="text-sm italic opacity-80">
                {t("Scientific name")}: {detail.fruit_scientificname}
              </p>
            )}
          </div>
        </div>

        {/* Nội dung chính */}
        <div className="p-6 space-y-6">
          {detail.images.length > 0 && (
            <div className="flex justify-center">
              <Image
                src={detail.images[1].fi_path}
                alt={t(`fruits.${detail.fruit_name}`)}
                width={400}
                height={300}
                className="rounded-lg shadow-md object-cover transition-transform duration-300 hover:scale-105"
              />
            </div>
          )}

          {detail.fruit_description && (
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">{t("Description")}</h2>
              <p className="text-gray-600 leading-relaxed">{detail.fruit_description}</p>
            </div>
          )}

          {detail.benefits.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">{t("Benefits")}</h2>
              <ul className="space-y-2">
                {detail.benefits.map((benefit) => (
                  <li key={benefit.benefit_id} className="flex items-start">
                    <span className="text-green-500 mr-2">✔</span>
                    <div>
                      <p className="font-medium text-gray-700">{benefit.benefit_name}</p>
                      {benefit.benefit_description && (
                        <p className="text-sm text-gray-500">{benefit.benefit_description}</p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {detail.nutritions.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">{t("Nutrition")}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {detail.nutritions.map((nutri) => (
                  <div
                    key={nutri.nutrition_id}
                    className="bg-gray-50 p-3 rounded-lg shadow-sm border border-gray-200"
                  >
                    <p className="font-medium text-gray-700">{nutri.nutrition_nutrientname}</p>
                    <p className="text-sm text-gray-600">
                      <strong>{t("Amount")}:</strong> {nutri.nutrition_amountvalue} {nutri.unit.nu_name}
                    </p>
                    {nutri.nutrition_dailyvaluepercent && (
                      <p className="text-sm text-gray-600">
                        <strong>{t("Daily value")}:</strong> {nutri.nutrition_dailyvaluepercent}%
                      </p>
                    )}
                    <p className="text-xs text-gray-500 italic">{nutri.nu_category.nc_name}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {detail.availabilities.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">{t("Availability")}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {detail.availabilities.map((avail) => (
                  <div
                    key={avail.availability_id}
                    className="bg-blue-50 p-4 rounded-lg shadow-sm border border-blue-200"
                  >
                    <div className="flex items-center mb-2">
                      <span className="text-blue-500 mr-2">📍</span>
                      <h3 className="text-lg font-medium text-gray-800">{avail.region.riv_name}</h3>
                    </div>
                    {avail.availability_isyearround ? (
                      <p className="text-sm text-green-600 font-medium">{t("All year round")}</p>
                    ) : avail.months.length > 0 ? (
                      <p className="text-sm text-gray-600">
                        <strong>{t("Months")}:</strong>{" "}
                        {avail.months
                          .map((month) => t(`${month.month_name.toLowerCase()}`))
                          .sort((a, b) => {
                            const monthOrder = [
                              "january", "february", "march", "april", "may", "june",
                              "july", "august", "september", "october", "november", "december"
                            ];
                            return monthOrder.indexOf(a.toLowerCase()) - monthOrder.indexOf(b.toLowerCase());
                          })
                          .join(", ")}
                      </p>
                    ) : (
                      <p className="text-sm text-gray-600 italic">{t("No information")}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {detail.categories.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">{t("categories")}</h2>
              <div className="flex flex-wrap gap-2">
                {detail.categories.map((category) => (
                  <span
                    key={category.category_id}
                    className="bg-orange-100 text-orange-800 text-sm font-medium px-3 py-1 rounded-full"
                  >
                    {category.category_name}
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
            {t("Back")}
          </button>
        </div>
      </div>
    </div>
  );
}