from ultralytics import YOLO

model = YOLO("runs\\detect\\train4\\weights\\best.pt")

results = model.predict(source="Dataset\\melon.jpg", conf=0.2)
results[0].show()