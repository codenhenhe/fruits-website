from ultralytics import YOLO

model = YOLO("runs\\detect\\train4\\weights\\best.pt")

results = model.predict(source="Dataset\\melon.jpg", conf=0.5)

for result in results:
    boxes = result.boxes  # Đối tượng bounding box
    for box in boxes:
        # Lấy tọa độ bounding box
        conf = box.conf[0].item()    # Độ tin cậy
        cls = int(box.cls[0].item()) # ID lớp
        label = model.names[cls]     # Tên lớp

        print(f"ID: {cls}, Đối tượng: {label}, Độ tin cậy: {conf: .2f}")
# results[0].show()