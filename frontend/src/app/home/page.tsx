// import { useEffect, useState } from "react";
// import axios from "axios";

// export default function Home() {
//   const [items, setItems] = useState([]);

//   useEffect(() => {
//     axios.get("http://127.0.0.1:8000/items")
//       .then(response => setItems(response.data))
//       .catch(error => console.error("Lỗi khi lấy dữ liệu:", error));
//   }, []);

//   return (
//     <div>
//       <h1>Danh sách Items</h1>
//       <ul>
//         {items.map(item => (
//           <li key={item.id}>
//             <h2>{item.name}</h2>
//             <p>{item.description}</p>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }
export default function fruits() {
    return (
      <main>
        <h1 className="text-3xl font-bold">Hello World!</h1>
        <p>Fruits list</p>
      </main>
    );
}
