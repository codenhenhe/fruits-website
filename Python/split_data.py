# Chia và di chuyển dữ liệu theo tỷ lệ train:test:val = 8:1:1

import os
import shutil
import supervision as sv

# Đường dẫn gốc chứa dữ liệu ban đầu
dataset_path = "Dataset"
image_dir = os.path.join(dataset_path, "images")
label_dir = os.path.join(dataset_path, "labels")

# Tạo thư mục cho train, val, test
split_dirs = ["train", "val", "test"]
for split in split_dirs:
    os.makedirs(os.path.join(dataset_path, split, "images"), exist_ok=True)
    os.makedirs(os.path.join(dataset_path, split, "labels"), exist_ok=True)

# Tải dataset với supervision
dataset = sv.DetectionDataset.from_yolo(
    images_directory_path=image_dir,
    annotations_directory_path=label_dir,
    data_yaml_path=f"data.yaml",
)

train_dataset, val_test_dataset = dataset.split(
    split_ratio=0.8,
    random_state=42,
    shuffle=True
)

val_dataset, test_dataset = val_test_dataset.split(
    split_ratio=0.5,
    random_state=42,
    shuffle=True
)

# Hàm di chuyển ảnh và nhãn
def move_files(dataset, dest_folder):
    for image_path, annotation in dataset.annotations.items():
        image_file = os.path.basename(image_path)
        src_image_path = image_path
        dst_image_path = os.path.join(dataset_path, dest_folder, "images", image_file)
        shutil.move(src_image_path, dst_image_path)

        label_file = os.path.splitext(image_file)[0] + ".txt"
        src_label_path = os.path.join(label_dir, label_file)
        dst_label_path = os.path.join(dataset_path, dest_folder, "labels", label_file)
        if os.path.exists(src_label_path):
            shutil.move(src_label_path, dst_label_path)
        else:
            print(f"Warning: Label file {label_file} not found for image {image_file}")

# Di chuyển file
print("Đang di chuyển train")
move_files(train_dataset, "train")
print("Đang di chuyển val")
move_files(val_dataset, "val")
print("Đang di chuyển test")
move_files(test_dataset, "test")

print("Dữ liệu đã được chia thành train, val, test theo tỉ lệ 8:1:1")