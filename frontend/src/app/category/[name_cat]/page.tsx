import CategoryPageClient from "./CategoryPageClient";

// Giả lập dữ liệu trái cây (có thể thay bằng API thật)
const fruitData = [
  { id: 1, name: "Chuối", image_url: "/banana_thum.jpg", category: "tropical" },
  { id: 2, name: "Xoài", image_url: "/banana.jpg", category: "tropical" },
  { id: 3, name: "Cam", image_url: "/banana.jpg", category: "citrus" },
  { id: 5, name: "Dâu tây", image_url: "/banana.jpg", category: "berries" },
];

// Server Component - Fetch dữ liệu từ server
export default async function CategoryPage({ params }: { params: Promise<{ name_cat: string }> }) {
  // Await params để lấy giá trị thực tế của name_cat
  const { name_cat } = await params;

  // Tìm trái cây theo danh mục
  const filteredFruits = fruitData.filter((fruit) => fruit.category === name_cat);

  // Truyền dữ liệu vào Client Component
  return <CategoryPageClient fruits={filteredFruits} category={name_cat} />;
}