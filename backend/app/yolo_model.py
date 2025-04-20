from ultralytics import YOLO
import cv2

# model = YOLO("..\\..\\runs\\detect\\train4\\weights\\best.pt")
model = YOLO("..\\..\\Python\\runs\\detect\\train\\weights\\best.pt")

# results = model.predict(source="..\\old_dataset\\fruit2.jpg", conf=0.5)

# results[0].show()