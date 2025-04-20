"use client"
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// Định nghĩa bản dịch
const resources = {
  vi: {
    translation: {
      fruits: {
        Apple: "Táo",
        Avocado: "Bơ",
        Banana: "Chuối",
        Cherry: "Anh Đào",
        "Dragon fruit": "Thanh Long",
        Kiwi: "Kiwi",
        Mango: "Xoài",
        Orange: "Cam",
        Pear: "Lê",
        Pineapple: "Dứa",
        Strawberry: "Dâu Tây",
        "Sugar apple": "Mãng Cầu",
        Watermelon: "Dưa Hấu",
      },
    },
  },
  en: {
    translation: {
      fruits: {
        Apple: "Apple",
        Avocado: "Avocado",
        Banana: "Banana",
        Cherry: "Cherry",
        "Dragon fruit": "Dragon fruit",
        Kiwi: "Kiwi",
        Mango: "Mango",
        Orange: "Orange",
        Pear: "Pear",
        Pineapple: "Pineapple",
        Strawberry: "Strawberry",
        "Sugar apple": "Sugar apple",
        Watermelon: "Watermelon",
      },
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: "vi", // Ngôn ngữ mặc định là tiếng Việt
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;