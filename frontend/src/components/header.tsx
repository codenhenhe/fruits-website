"use client";
import Link from "next/link";
import Image from "next/image";
import styles from "./header.module.css";
import { useState, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import SearchBar from "@/components/search_bar";

interface Fruit {
  id: number;
  name: string;
  confidence: number;
}

interface FruitDetection {
  fruits: Fruit[];
}

export default function Header() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<FruitDetection | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);

      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    setLoading(true);
    setResult(null);

    try {
      const res = await axios.post<FruitDetection>(
        "http://127.0.0.1:8000/detect-fruit/",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      setResult(res.data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <header className={styles.header}>
        <div className={styles.container}>
          {/* Logo */}
          <div className={styles.logo}>
            <Image src="/favicon.png" alt="Fruit Facts Logo" width={60} height={60} />
            <Link href="/" className={styles.logoText}>
              Fruit Facts
            </Link>
          </div>

          <div className="flex">
            {/* Search by image */}
            <div className="flex items-center justify-center mr-2 group">
              <button
                onClick={() => setIsModalOpen(true)}
                className="rounded text-[1.1rem] text-base text-gray-900 gap-3 hover:bg-gray-300 p-1 transition-transform duration-300 hover:scale-110"
              >
                <svg
                  width="35px"
                  height="35px"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    stroke="#000000"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12.5 3H7.8C6.11984 3 5.27976 3 4.63803 3.32698C4.07354 3.6146 3.6146 4.07354 3.32698 4.63803C3 5.27976 3 6.11984 3 7.8V16.2C3 17.8802 3 18.7202 3.32698 19.362C3.6146 19.9265 4.07354 20.3854 4.63803 20.673C5.27976 21 6.11984 21 7.8 21H17C17.93 21 18.395 21 18.7765 20.8978C19.8117 20.6204 20.6204 19.8117 20.8978 18.7765C21 18.395 21 17.93 21 17M19 8V2M16 5H22M10.5 8.5C10.5 9.60457 9.60457 10.5 8.5 10.5C7.39543 10.5 6.5 9.60457 6.5 8.5C6.5 7.39543 7.39543 6.5 8.5 6.5C9.60457 6.5 10.5 7.39543 10.5 8.5ZM14.99 11.9181L6.53115 19.608C6.05536 20.0406 5.81747 20.2568 5.79643 20.4442C5.77819 20.6066 5.84045 20.7676 5.96319 20.8755C6.10478 21 6.42628 21 7.06929 21H16.456C17.8951 21 18.6147 21 19.1799 20.7582C19.8894 20.4547 20.4547 19.8894 20.7582 19.1799C21 18.6147 21 17.8951 21 16.456C21 15.9717 21 15.7296 20.9471 15.5042C20.8805 15.2208 20.753 14.9554 20.5733 14.7264C20.4303 14.5442 20.2412 14.3929 19.8631 14.0905L17.0658 11.8527C16.6874 11.5499 16.4982 11.3985 16.2898 11.3451C16.1061 11.298 15.9129 11.3041 15.7325 11.3627C15.5279 11.4291 15.3486 11.5921 14.99 11.9181Z"
                  />
                </svg>
              </button>
              <div className="bg-gray-600 p-2 rounded-lg text-white w-48 -translate-x-full translate-y-11 absolute group-hover:block hidden left-1/2 mt-2 transform z-50 transition-opacity duration-200">
                <p>Tìm kiếm bằng hình ảnh</p>
              </div>
            </div>

            {/* Search Modal */}
            {isModalOpen && (
              <div className="flex bg-black/50 justify-center fixed inset-0 transition-opacity duration-300 items-center z-60">
                <div className="bg-white p-6 rounded-lg shadow-lg max-w-md max-h-[90vh] overflow-auto">
                  <div className="flex justify-center mb-2">
                    <h3 className="flex-1 text-center text-gray-900 text-lg font-semibold pl-[24px]">
                      🍏 Tìm kiếm trái cây bằng hình ảnh 🍌
                    </h3>
                    <button
                      onClick={() => setIsModalOpen(false)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <svg
                        className="h-6 w-6"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  <div className="mb-4">
                    <p className="text-center text-gray-600 text-sm mb-2">
                      Tải ảnh lên
                    </p>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="bg-gray-50 border border-gray-300 p-2 rounded-lg text-gray-900 text-sm w-full block cursor-pointer"
                      />
                      {preview && (
                        <img
                          src={preview}
                          alt="Selected"
                          className="border h-auto rounded-lg w-full mt-2"
                        />
                      )}
                      <button
                        type="submit"
                        className="bg-orange-600 rounded-lg text-white w-full disabled:bg-gray-400 hover:bg-orange-700 py-2 transition"
                        disabled={loading}
                      >
                        {loading ? "Đang tìm kiếm..." : "Tìm kiếm"}
                      </button>
                    </form>
                    {result && (
                      <div className="mt-4">
                        <h2 className="text-gray-700 text-lg font-semibold">Kết quả tìm kiếm:</h2>
                        <ul className="mt-2 space-y-2">
                          {result.fruits.map((fruit) => (
                            <li
                              key={fruit.id}
                              className="bg-green-100 p-2 rounded-lg text-gray-700 group relative"
                            >
                              <Link
                                href={`/fruit-detail/${encodeURIComponent(fruit.id)}`}
                                className="block cursor-pointer"
                                onClick={() => setIsModalOpen(false)}
                              >
                                <span className="font-bold">{fruit.name}</span> -{" "}
                                <span className="text-gray-600">
                                  {(fruit.confidence * 100).toFixed(2)}%
                                </span>
                              </Link>
                              <div className="bg-gray-800 p-2 rounded-lg text-white w-48 -translate-x-1/2 absolute group-hover:block hidden left-1/2 mt-2 transform z-10 transition-opacity duration-200">
                                <p>{fruit.name} là một loại quả ngon! Nhấn vào để xem thông tin chi tiết!</p>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Search bar */}
            <SearchBar />
          </div>

          {/* Navigation with Dropdown */}
          <div className="flex justify-around">
            <nav className={styles.nav}>
              <Link href="/fruit-filter" className={styles.navLink}>Bộ lọc</Link>
              <Link href="/about" className={styles.navLink}>
                Giới thiệu
              </Link>
              <Link href="#" className={styles.navLink}>
                Liên hệ
              </Link>
            </nav>
          </div>
        </div>
      </header>
    </>
  );
}