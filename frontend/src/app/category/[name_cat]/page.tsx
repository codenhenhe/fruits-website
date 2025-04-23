// app/category/[name]/page.tsx
import React from 'react'

type Category = {
  category_id: number
  category_name: string
  category_description?: string
}

type Fruit = {
  fruit_id: number
  fruit_name: string
  fruit_scientificname: string
  fruit_description?: string
  categories: Category[]
}

type Props = {
  params: {
    name: string
  }
}

async function getFruitsByCategory(name: string): Promise<Fruit[]> {
  const res = await fetch(`http://localhost:8000/category?name=${encodeURIComponent(name)}`, {
    cache: 'no-store',
  })

  if (!res.ok) {
    throw new Error('Failed to fetch data')
  }

  return res.json()
}

export default async function CategoryPage({ params }: Props) {
  const name = params.name
  let fruits: Fruit[] = []

  try {
    fruits = await getFruitsByCategory(name)
  } catch (error) {
    return <div className="p-4 text-red-600">Không tìm thấy trái cây nào cho loại "{name}".</div>
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Fruits in Category: {name}</h1>
      {fruits.length === 0 ? (
        <p>No fruits found.</p>
      ) : (
        <div className="space-y-4">
          {fruits.map((fruit) => (
            <div key={fruit.fruit_id} className="border rounded-lg p-4 shadow-sm">
              <h2 className="text-xl font-semibold">{fruit.fruit_name}</h2>
              <p className="italic text-gray-600">Scientific name: {fruit.fruit_scientificname}</p>
              {fruit.fruit_description && <p className="mt-1">{fruit.fruit_description}</p>}
              <p className="text-sm text-gray-500 mt-2">
                Categories: {fruit.categories.map((cat) => cat.category_name).join(', ')}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
