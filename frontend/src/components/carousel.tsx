// components/Banner.js
"use client"
import { useState, useEffect } from "react";
import Image from "next/legacy/image";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link"

const carousels = [
  { src: "/carousel_tropical_fruit.png", alt: "Trái cây nhiệt đới", title: "Trái cây nhiệt đới", slogan: "Bạn đã biết những gì về loại trái cây này?", href: "/fruit-filter"},
  { src: "/carousel_berry_2.jpg", alt: "Quả mọng (Berry)", title: "Quả mọng (Berry)", slogan: "Bạn đã biết những gì về loại trái cây này?", href: "/fruit-filter"},
  { src: "/orange/orange1.jpg", alt: "Có múi (Citrus)", title: "Có múi (Citrus)", slogan: "Bạn đã biết những gì về loại trái cây này?", href: "/fruit-filter"}
];

export default function Carousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % carousels.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + carousels.length) % carousels.length);
  };

  // Tự động chuyển ảnh mỗi 3 giây (nếu cần thì bỏ comment)
  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative pt-2 mx-auto max-w-4xl h-[23rem] md:h-[24rem] lg:h-[25rem] overflow-hidden">
      <div className="relative w-full h-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5 }}
            className="absolute w-full h-full flex items-center"
          >
            {/* Tiêu đề bên trái trong carousel */}
            <div className="w-1/3 ps-12 space-y-5">
              <div>
                <h1 className="text-3xl font-bold text-gray-800">{carousels[currentIndex].title}</h1>
                <p className="text-gray-800">{carousels[currentIndex].slogan}</p>
              </div>
              <div>
                <Link href={carousels[currentIndex].href}>
                    <button className="cursor-pointer py-2 px-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-medium hover:from-orange-600 hover:to-red-600 transition-all duration-300">
                        Khám phá ngay
                    </button>
                </Link>
              </div>
            </div>

            {/* Hình ảnh bên phải */}
            <div className="w-2/3 h-full">
              <Image
                src={carousels[currentIndex].src}
                alt={carousels[currentIndex].alt}
                width={500}
                height={500}
                objectFit="cover"
                className="rounded-[10vw] w-full"
              />
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Nút "Trước" */}
        <button
          className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full z-10"
          onClick={prevSlide}
        >
          ◀
        </button>

        {/* Nút "Sau" */}
        <button
          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full z-10"
          onClick={nextSlide}
        >
          ▶
        </button>

        {/* Dots Chỉ báo */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
          {carousels.map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full ${
                index === currentIndex ? "bg-gray-400" : "bg-gray-900"
              }`}
              onClick={() => setCurrentIndex(index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}