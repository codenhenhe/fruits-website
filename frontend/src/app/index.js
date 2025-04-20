import { useEffect, useState } from "react";
import { getFruits } from "../lib/api";

export default function Home() {
  const [fruits, setFruits] = useState([]);

  useEffect(() => {
    getFruits().then(setFruits);
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold">Danh sách trái cây</h1>
      <ul className="mt-4">
        {fruits.map((fruit) => (
          <li key={fruit.id} className="p-2 border-b">{fruit.name}</li>
        ))}
      </ul>
    </div>
  );
}