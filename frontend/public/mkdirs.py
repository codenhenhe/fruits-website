import os

path = "frontend"
final = os.path.join(path, "public")

def create_fruit_directories(fruit_list):
    # Lặp qua danh sách trái cây và tạo thư mục cho mỗi trái cây
    for fruit in fruit_list:
        try:
            # Tạo thư mục với tên của trái cây, sử dụng tên trái cây làm tên thư mục
            os.makedirs(os.path.join(final, fruit), exist_ok=True)
            print(f"Thư mục '{fruit}' đã được tạo.")
        except Exception as e:
            print(f"Không thể tạo thư mục cho {fruit}: {e}")

# Danh sách trái cây
fruit_list = [
    "apple", "avocado", "banana", "dragon_fruit", "durian", "guava",
    "jackfruit", "langsat", "longan", "mango", "mangosteen", "orange",
    "pear", "pineapple", "rambai", "rambutan", "rose_apple", "strawberry",
    "sugar_apple", "watermelon"
]

# Gọi hàm tạo thư mục
create_fruit_directories(fruit_list)
