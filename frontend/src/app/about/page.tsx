// app/about/page.tsx
import React from "react";

const AboutPage = () => {
  return (
    <main className="max-w-3xl mx-auto px-4 py-10 text-gray-800">
      <h1 className="text-3xl font-bold mb-6">Giới thiệu về FruitFacts</h1>

      <p className="mb-4">
        <strong>FruitFacts</strong> là một trang web cung cấp thông tin cơ bản và khoa học về các loại trái cây, 
        tập trung vào nguồn gốc, đặc điểm, thành phần dinh dưỡng và lợi ích sức khỏe.
      </p>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Mục tiêu</h2>
        <p>
          Chúng tôi hướng đến việc xây dựng một kho dữ liệu dễ tra cứu, đơn giản, dành cho những ai cần tìm hiểu 
          thông tin về trái cây một cách chính xác và gọn gàng, từ người dùng phổ thông đến nhà phát triển.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Thông tin cung cấp</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>Tên thường gọi và tên khoa học</li>
          <li>Hình ảnh minh họa</li>
          <li>Lợi ích sức khỏe</li>
          <li>Thông tin theo mùa và nơi xuất xứ</li>
          <li>Dữ liệu dinh dưỡng</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Liên hệ</h2>
        <p>Nếu bạn có câu hỏi hoặc góp ý, vui lòng gửi email về: <code>contact@fruitfacts.com</code></p>
      </section>

      <p className="text-sm text-gray-500 italic">
        Phiên bản thử nghiệm – Dữ liệu đang được cập nhật và hoàn thiện dần theo thời gian.
      </p>
    </main>
  );
};

export default AboutPage;
