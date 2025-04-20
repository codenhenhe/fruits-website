import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
      // Filters
      "Filter fruits": "Filter fruits",
      "Region": "Region",
      "Select region": "Select region",
      "Origin": "Origin",
      "Select origin": "Select origin",
      "Benefit": "Benefit",
      "Select benefit": "Select benefit",
      "Category": "Category",
      "Select category": "Select category",
      "Clear filters": "Clear filters",
      "Filtered fruits": "Filtered fruits",
      "loading": "Loading...",
      "no_fruits_found": "No fruits found",
      "No regions available": "No regions available",
      "No origins available": "No origins available",
      "No benefits available": "No benefits available",
      "No categories available": "No categories available",

      // Fruits
      "Apple": "Apple",
      "Avocado": "Avocado",
      "Banana": "Banana",
      "Dragon fruit": "Dragon fruit",
      "Durian": "Durian",
      "Guava": "Guava",
      "Jackfruit": "Jackfruit",
      "Langsat": "Langsat",
      "Longan": "Longan",
      "Mango": "Mango",
      "Mangosteen": "Mangosteen",
      "Orange": "Orange",
      "Pear": "Pear",
      "Pineapple": "Pineapple",
      "Rambai": "Rambai",
      "Rambutan": "Rambutan",
      "Rose apple": "Rose apple",
      "Strawberry": "Strawberry",
      "Sugar apple": "Sugar apple",
      "Watermelon": "Watermelon",

      // Origins
      "Vietnam": "Vietnam",
      "Thailand": "Thailand",
      "Philippines": "Philippines",
      "China": "China",
      "India": "India",
      "Malaysia": "Malaysia",
      "Indonesia": "Indonesia",
      "USA": "USA",
      "Australia": "Australia",
      "Mexico": "Mexico",

      // Categories
      "Tropical": "Tropical",
      "Citrus": "Citrus",
      "Berry": "Berry",
      "Stone fruit": "Stone fruit",
      "Pome": "Pome",
      "Melon": "Melon",
      "Exotic": "Exotic",
      "Seeded": "Seeded",
      "Seedless": "Seedless",
      "High fiber": "High fiber",
    },
  },
  vi: {
    translation: {
      // Filters
      "Filter fruits": "Lọc trái cây",
      "Region": "Miền",
      "Select region": "Chọn miền",
      "Origin": "Nguồn gốc",
      "Select origin": "Chọn nguồn gốc",
      "Benefit": "Lợi ích",
      "Select benefit": "Chọn lợi ích",
      "Category": "Danh mục",
      "Select category": "Chọn danh mục",
      "Clear filters": "Xóa bộ lọc",
      "Filtered fruits": "Trái cây đã lọc",
      "loading": "Đang tải...",
      "no_fruits_found": "Không tìm thấy trái cây",
      "No regions available": "Không có miền nào",
      "No origins available": "Không có nguồn gốc nào",
      "No benefits available": "Không có lợi ích nào",
      "No categories available": "Không có danh mục nào",

      // Fruits
      "Apple": "Táo",
      "Avocado": "Bơ",
      "Banana": "Chuối",
      "Dragon fruit": "Thanh long",
      "Durian": "Sầu riêng",
      "Guava": "Ổi",
      "Jackfruit": "Mít",
      "Langsat": "Bòn bon",
      "Longan": "Nhãn",
      "Mango": "Xoài",
      "Mangosteen": "Măng cụt",
      "Orange": "Cam",
      "Pear": "Lê",
      "Pineapple": "Dứa",
      "Rambai": "Răm bai",
      "Rambutan": "Chôm chôm",
      "Rose apple": "Mận",
      "Strawberry": "Dâu tây",
      "Sugar apple": "Mãng cầu",
      "Watermelon": "Dưa hấu",

      // Origins
      "Vietnam": "Việt Nam",
      "Thailand": "Thái Lan",
      "Philippines": "Philippin",
      "China": "Trung Quốc",
      "India": "Ấn Độ",
      "Malaysia": "Malaysia",
      "Indonesia": "Indonesia",
      "USA": "Mỹ",
      "Australia": "Úc",
      "Mexico": "Mexico",

      // Categories
      "Tropical": "Nhiệt đới",
      "Citrus": "Có múi",
      "Berry": "Quả mọng",
      "Stone fruit": "Quả hạch",
      "Pome": "Quả thịt có lõi",
      "Melon": "Dưa",
      "Exotic": "Đặc biệt",
      "Seeded": "Có hạt",
      "Seedless": "Không hạt",
      "High fiber": "Giàu chất xơ",
    },
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "vi", // Đặt ngôn ngữ mặc định là tiếng Việt
    fallbackLng: "en", // Ngôn ngữ dự phòng
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
