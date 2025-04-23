import Link from "next/link";
import Image from "next/legacy/image";
import Carousel from "../components/carousel"
const hotFruits = [
  {
    id: 3,
    name: "Chuối",
    description:
      "Chuối cung cấp kali và năng lượng nhanh chóng, lý tưởng cho bữa sáng.",
    image: "/banana_thum.jpg", 
  },
  {
    id: 10,
    name: "Thơm",
    description:
      "Thơm cung cấp kali và năng lượng nhanh chóng, lý tưởng cho bữa sáng.",
    image: "/pineapple_thum.jpg", 
  },
  {
    id: 13,
    name: "Dưa hấu",
    description:
      "Dưa hấu cung cấp kali và năng lượng nhanh chóng, lý tưởng cho bữa sáng.",
    image: "/melon2.jpg", 
  },
];

export default function HotFruitsSection() {
  return (
    <>
      <Carousel />
      {/* bg-gradient-to-b from-orange-50 to-white */}
      <section className="py-12 px-4">
        {/* Tiêu đề */}
        <h2 className="text-4xl font-bold text-center mb-10 bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-red-500 animate-pulse">
          Trái cây hot! 🔥
        </h2>

        {/* Grid layout cho các card trái cây */}
        <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {hotFruits.map((fruit) => (
            <div
              key={fruit.id}
              className="relative bg-white rounded-2xl shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
            >
              {/* Hình ảnh trái cây */}
              <div className="relative h-48 w-full overflow-hidden">
                <Image
                  src={fruit.image}
                  alt={fruit.name}
                  fill
                  objectFit="cover"
                  className="transition-transform duration-300 hover:scale-110"
                />
              </div>

              {/* Nội dung card */}
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {fruit.name}
                </h3>
                <p className="text-gray-600 text-sm mb-4">{fruit.description}</p>
                <Link href={`/fruit-detail/${fruit.id}`}>
                  <button className="w-full py-2 px-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-medium hover:from-orange-600 hover:to-red-600 transition-all duration-300">
                    Tìm hiểu thêm
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}