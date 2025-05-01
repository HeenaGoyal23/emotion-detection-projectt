import cv2
from fer import FER

class EmotionRecognizer:
    def __init__(self):
        self.detector = FER(mtcnn=True)

    def predict_emotion(self, frame):
        rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        results = self.detector.detect_emotions(rgb_frame)

        if results:
            emotions = results[0]['emotions']
            top_emotion = max(emotions, key=emotions.get)
            return top_emotion
        else:
            return "neutral"