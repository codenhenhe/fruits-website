import os
import shutil
import random

# Đường dẫn gốc chứa dữ liệu ban đầu
dataset_path = "Dataset"
image_dir = os.path.join(dataset_path, "images")
label_dir = os.path.join(dataset_path, "labels")

# Tạo thư mục cho train, val, test
split_dirs = ["train", "val", "test"]
for split in split_dirs:
    os.makedirs(os.path.join(dataset_path, split, "images"), exist_ok=True)
    os.makedirs(os.path.join(dataset_path, split, "labels"), exist_ok=True)

# Lấy danh sách tất cả ảnh
all_images = [f for f in os.listdir(image_dir) if f.endswith((".jpg", ".jpeg"))]
random.shuffle(all_images)  # Xáo trộn để đảm bảo phân chia ngẫu nhiên

# Chia theo tỉ lệ 8:1:1
total = len(all_images)
train_split = int(0.8 * total)
val_split = int(0.1 * total) 

# Hàm hỗ trợ di chuyển ảnh và nhãn
def move_files(image_list, dest_folder):
    for image_file in image_list:
        # Di chuyển ảnh
        src_image_path = os.path.join(image_dir, image_file)
        dst_image_path = os.path.join(dataset_path, dest_folder, "images", image_file)
        shutil.move(src_image_path, dst_image_path)

        # Di chuyển nhãn tương ứng
        label_file = os.path.splitext(image_file)[0] + ".txt"
        src_label_path = os.path.join(label_dir, label_file)
        dst_label_path = os.path.join(dataset_path, dest_folder, "labels", label_file)

        if os.path.exists(src_label_path):  # Kiểm tra nếu có nhãn tương ứng
            shutil.move(src_label_path, dst_label_path)

# Thực hiện di chuyển files
move_files(all_images[:train_split], "train")
move_files(all_images[train_split:train_split+val_split], "val")
move_files(all_images[train_split+val_split:], "test")

print("Dữ liệu đã được chia thành train, val, test theo tỉ lệ 8:1:1")