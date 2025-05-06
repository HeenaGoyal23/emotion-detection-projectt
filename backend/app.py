import cv2
from deepface import DeepFace
from flask import Flask, request, jsonify, session
from flask_cors import CORS
import os
import base64
import time
import random
import requests
import sqlite3
import bcrypt
import mysql.connector

app = Flask(__name__)
app.secret_key = 'sentibeat123'
app.config.update(
    SESSION_COOKIE_SAMESITE='Lax',   # or 'Strict' if you don't need cross-site
    SESSION_COOKIE_SECURE=False      # must be False for HTTP (localhost)
)
CORS(app, supports_credentials=True, resources={r"/*": {"origins": "*"}})

# Function to fetch Spotify playlists based on emotion
def fetch_spotify_playlists(emotion):
    client_id = "6b3015db6caa44499d13096ce481e810"  # Replace with your Spotify Client ID
    client_secret = "0f54a8d616144226a398687cef304a7f"  # Replace with your Spotify Client Secret

    # Get access token
    auth_response = requests.post(
        'https://accounts.spotify.com/api/token',
        data={'grant_type': 'client_credentials'},
        headers={
            'Authorization': 'Basic ' + base64.b64encode(f"{client_id}:{client_secret}".encode()).decode()
        }
    )

    if auth_response.status_code != 200:
        print("Failed to fetch access token")
        print(auth_response.text)
        return [{"title": "Error fetching token", "url": ""}]

    access_token = auth_response.json().get('access_token')
    if not access_token:
        print("No access token in response")
        return [{"title": "Error: No access token", "url": ""}]

    headers = {'Authorization': f'Bearer {access_token}'}
    search_query = emotion + " playlist"
    url = f"https://api.spotify.com/v1/search?q={search_query}&type=playlist&limit=5"

    try:
        # Send the request to Spotify API
        response = requests.get(url, headers=headers)

        # Handle Rate Limiting
        if response.status_code == 429:
            retry_after = int(response.headers.get("Retry-After", 10))  # Default retry after 10 seconds if not specified
            print(f"Rate limit hit! Retrying after {retry_after} seconds...")
            time.sleep(retry_after)  # Sleep for the specified time and retry the request
            return fetch_spotify_playlists(emotion)  # Retry the request

        # Handle other response status codes
        response.raise_for_status()  # Will raise an error for non-2xx responses

    except requests.exceptions.RequestException as e:
        print(f"Error fetching playlists: {e}")
        return [{"title": "Error fetching playlists", "url": ""}]

    # Process response data
    data = response.json()
    playlists = []

    for item in data.get("playlists", {}).get("items", []):
        if item and isinstance(item, dict) and "name" in item and "external_urls" in item:
            playlists.append({
                "title": item["name"],
                "url": item["external_urls"]["spotify"]
            })
        else:
            print("Skipping an invalid item:", item)

    return playlists

def fetch_movies_based_on_emotion(emotion):
    tmdb_api_key = "027bd01c52cabf6adcfd6aa9eb59baad"

    # Map emotions to TMDb genre IDs
    emotion_genre_map = {
        "happy": [35, 10749],       # Comedy, Romance
        "sad": [18, 10749],          # Drama, Romance
        "angry": [28, 53],           # Action, Thriller
        "fear": [27, 53],            # Horror, Thriller
        "surprise": [878, 9648],     # Sci-Fi, Mystery
        "disgust": [35, 27],         # Comedy, Horror
        "neutral": [18, 12]          # Drama, Adventure
    }

    genre_ids = emotion_genre_map.get(emotion.lower(), [18])  # Default to Drama if unknown emotion

    genre_query = ",".join(str(genre_id) for genre_id in genre_ids)

    url = f"https://api.themoviedb.org/3/discover/movie?api_key={tmdb_api_key}&with_genres={genre_query}&sort_by=popularity.desc&page=1"

    response = requests.get(url, timeout=10)  # waits max 10 seconds

    if response.status_code == 200:
        movies = response.json().get('results', [])
        if not movies:
            return [{"title": "No results found for " + emotion, "poster": ""}]
        
        movie_data = []
        for movie in movies[:5]:  # Top 5 movies
            movie_data.append({
                "title": movie["title"],
                "overview": movie["overview"],
                "poster": f"https://image.tmdb.org/t/p/w500{movie.get('poster_path')}" if movie.get("poster_path") else ""
            })
        return movie_data
    else:
        print("Error fetching movies:", response.status_code)
        return [{"title": "Error fetching movies", "poster": ""}]

def fetch_dynamic_diet(emotion):
    api_key = "860d1c9d119747019967e528a0f1138f"  # Your Spoonacular API Key

    emotion_food_map = {
        "happy": ["smoothie", "salad", "fruit", "juice", "ice cream"],
        "sad": ["chocolate", "cookies", "cake", "pudding"],
        "angry": ["green tea", "yogurt", "cooling soup"],
        "fear": ["comfort food", "mac and cheese", "bread"],
        "surprise": ["party snacks", "pizza", "burger"],
        "disgust": ["fresh fruits", "mint dishes", "yogurt"],
        "neutral": ["dal", "simple rice", "bread", "pasta"]
    }

    selected_food = random.choice(emotion_food_map.get(emotion.lower(), ["salad"]))
    print(f"[Diet] Selected query for '{emotion}': {selected_food}")

    try:
        response = requests.get(
            "https://api.spoonacular.com/recipes/complexSearch",
            params={
                "query": selected_food,
                "number": 5,
                "apiKey": api_key
            }
        )
        print("[Diet] API Status:", response.status_code)

        if response.status_code != 200:
            print("[Diet] Error:", response.text)
            return [{"title": "Error fetching recipes", "image": ""}]

        data = response.json()

        recipes = []
        for recipe in data.get("results", []):
            recipes.append({
                "title": recipe.get("title", "Unknown Dish"),
                "image": recipe.get("image", "")
            })

        if not recipes:
            print("[Diet] No recipes found!")
            return [{"title": "No recipes found for " + selected_food, "image": ""}]

        return recipes

    except Exception as e:
        print("[Diet] Exception:", str(e))
        return [{"title": "Error fetching diet", "image": ""}]

# Fixed hard-coded workout recommendations based on emotion
def fetch_dynamic_workouts(emotion="neutral"):
    # Create emotion-specific workouts
    workout_map = {
        "happy": [
            {"name": "Cardio Dance", "description": "30 minutes of dance-based cardio to boost your mood and energy."},
            {"name": "HIIT Workout", "description": "20 minutes of high-intensity interval training to channel your positive energy."},
            {"name": "Outdoor Run", "description": "A 30-minute jog outside to enjoy your surroundings."},
            {"name": "Power Yoga", "description": "Dynamic flowing movements to maintain your positive energy."}
        ],
        "sad": [
            {"name": "Gentle Yoga", "description": "A slow, mindful practice focusing on deep breathing and relaxation."},
            {"name": "Walking Meditation", "description": "A 20-minute walk while practicing mindfulness."},
            {"name": "Light Stretching", "description": "Full-body stretching routine to release tension."},
            {"name": "Tai Chi", "description": "Flowing movements to create balance between body and mind."}
        ],
        "angry": [
            {"name": "Boxing Workout", "description": "Channel your energy into a powerful boxing session."},
            {"name": "Heavy Lifting", "description": "Strength training with challenging weights."},
            {"name": "Sprint Intervals", "description": "Alternating between sprinting and walking to release tension."},
            {"name": "Kickboxing", "description": "Combination of punches and kicks to expend energy."}
        ],
        "fear": [
            {"name": "Grounding Yoga", "description": "Poses focused on stability and connection to the ground."},
            {"name": "Deep Breathing", "description": "Respiratory exercises to calm the nervous system."},
            {"name": "Progressive Muscle Relaxation", "description": "Tensing and relaxing muscle groups to release anxiety."},
            {"name": "Gentle Swimming", "description": "Low-impact movement in water for a sense of weightlessness."}
        ],
        "surprise": [
            {"name": "Try Something New", "description": "Explore a new workout style you've never tried before."},
            {"name": "Obstacle Course", "description": "Challenge yourself with varied movements and obstacles."},
            {"name": "Dance Freestyle", "description": "Move your body intuitively to your favorite music."},
            {"name": "Circuit Training", "description": "Variety of exercises in quick succession to keep it interesting."}
        ],
        "disgust": [
            {"name": "Fresh Air Hike", "description": "Get outside for a refreshing nature walk or hike."},
            {"name": "Clean Space Yoga", "description": "Create a clean, pleasant environment for a yoga session."},
            {"name": "Pool Workout", "description": "Refreshing water exercises for a clean feeling."},
            {"name": "Mindful Walking", "description": "Focus on pleasant surroundings during a peaceful walk."}
        ],
        "neutral": [
            {"name": "Balanced Workout", "description": "Equal parts cardio, strength, and flexibility training."},
            {"name": "Moderate Intensity Walk", "description": "30-minute walk at a comfortable pace."},
            {"name": "Basic Strength Circuit", "description": "Full-body workout with bodyweight exercises."},
            {"name": "Beginner's Yoga", "description": "Fundamental yoga poses for overall wellbeing."}
        ]
    }
    
    # Return workouts based on emotion, default to neutral if emotion not found
    return workout_map.get(emotion.lower(), workout_map["neutral"])

# Function to open webcam and show live feed
def show_camera():
    cap = cv2.VideoCapture(0)
    face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

    cv2.namedWindow('Press C to Capture Image, Q to Quit', cv2.WINDOW_NORMAL)  # Named window
    cv2.setWindowProperty('Press C to Capture Image, Q to Quit', cv2.WND_PROP_TOPMOST, 1)  # Force window to be topmost

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))

        for (x, y, w, h) in faces:
            cv2.rectangle(frame, (x, y), (x + w, y + h), (0, 255, 0), 2)

        cv2.imshow('Press C to Capture Image, Q to Quit', frame)

        key = cv2.waitKey(1) & 0xFF
        if key == ord('c'):
            cv2.imwrite('captured_image.jpg', frame)
            cap.release()
            cv2.destroyAllWindows()
            return "Image Captured!"
        elif key == ord('q'):
            cap.release()
            cv2.destroyAllWindows()
            return "Image Capture Cancelled."

def store_emotion_in_db(user_id, emotion):
    try:
        # Connect to MySQL database
        conn = mysql.connector.connect(
            host='localhost',
            user='myappuser',
            password='mypassword',
            database='myappdb'
        )
        cursor = conn.cursor()

        # Insert emotion and user ID into the emotion_history table
        query = 'INSERT INTO emotion_history (user_id, emotion) VALUES (%s, %s)'
        cursor.execute(query, (user_id, emotion))
        conn.commit()

        cursor.close()
        conn.close()

        print(f"Emotion '{emotion}' stored successfully for user {user_id}.")
        return True

    except Exception as e:
        print(f"Error storing emotion: {e}")
        return False

# Function to detect emotion
def detect_emotion(image_path):
    try:
        image = cv2.imread(image_path)
        if image is None:
            return "Image not found. Please upload or capture an image first!"
        else:
            analysis = DeepFace.analyze(image, actions=['emotion'], enforce_detection=False)
            emotion = analysis[0]['dominant_emotion']
            return emotion

    except Exception as e:
        return str(e)

# Flask routes
@app.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')

    if not all([name, email, password]):
        return jsonify({'message': 'All fields are required'}), 400

    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

    try:
        conn = mysql.connector.connect(
            host='localhost',
            user='myappuser',
            password='mypassword',
            database='myappdb'
        )
        cursor = conn.cursor()

        query = 'INSERT INTO users (name, email, password) VALUES (%s, %s, %s)'
        values = (name, email, hashed_password)
        cursor.execute(query, values)
        conn.commit()
        cursor.close()
        conn.close()

        return jsonify({'message': 'Sign up successful'}), 201

    except mysql.connector.IntegrityError:
        return jsonify({'message': 'Email already exists'}), 400
    except Exception as e:
        print(e)
        return jsonify({'message': 'Error signing up'}), 500


@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not all([email, password]):
        return jsonify({'message': 'Email and password are required'}), 400

    try:
        conn = mysql.connector.connect(
            host='localhost',
            user='myappuser',
            password='mypassword',
            database='myappdb'
        )
        cursor = conn.cursor()
        query = 'SELECT id, password FROM users WHERE email = %s'
        cursor.execute(query, (email,))
        result = cursor.fetchone()
        cursor.close()
        conn.close()
        if result and bcrypt.checkpw(password.encode('utf-8'), result[1]):
            session['user_id'] = result[0]
            return jsonify({"id": result[0], "message": "Login successful"}), 200
        else:
            return jsonify({'message': 'Invalid email or password'}), 401

    except Exception as e:
        print(e)  # Optional: Log the exception
        return jsonify({'message': 'Error logging in'}), 500
    
@app.route('/capture', methods=['GET'])
def capture():
    result = show_camera()
    return jsonify({"message": result})

@app.route('/emotion', methods=['GET'])
def emotion():
    result = detect_emotion('captured_image.jpg')

    if "error" in result.lower():
        return jsonify({"message": "Error detecting emotion."}), 400

    user_id = session.get('user_id')
    if not user_id:
        return jsonify({'message': 'No user session found'}), 401 

    if store_emotion_in_db(user_id, result):
        # Fetch content based on emotion
        spotify_playlists = fetch_spotify_playlists(result)
        health_diet = fetch_dynamic_diet(result)
        health_exercise = fetch_dynamic_workouts(result)
        movie_recommendations = fetch_movies_based_on_emotion(result)

        recommendations = {
            "spotify": spotify_playlists,
            "diet": health_diet,
            "exercise": health_exercise,
            "movies": movie_recommendations
        }

        return jsonify({"emotion": result, "recommendations": recommendations})

    else:
        return jsonify({"message": "Error storing emotion in database."}), 500

@app.route('/emotion-history/<int:user_id>', methods=['GET'])
def get_emotion_history(user_id):
    try:
        conn = mysql.connector.connect(
            host='localhost',
            user='myappuser',
            password='mypassword',
            database='myappdb'
        )
        cursor = conn.cursor(dictionary=True)

        query = '''
            SELECT emotion, timestamp
            FROM emotion_history
            WHERE user_id = %s
            ORDER BY timestamp DESC
        '''
        cursor.execute(query, (user_id,))
        history = cursor.fetchall()

        cursor.close()
        conn.close()

        return jsonify(history), 200

    except Exception as e:
        print("Error:", e)
        return jsonify({'error': 'Failed to fetch emotion history'}), 500


@app.route('/upload', methods=['POST'])
def upload():
    if 'file' not in request.files:
        return jsonify({"message": "No file part in the request."})

    file = request.files['file']

    if file.filename == '':
        return jsonify({"message": "No selected file."})

    if file:
        file_path = os.path.join("captured_image.jpg")
        file.save(file_path)
        return jsonify({"message": "Image uploaded successfully."})

if __name__ == "__main__":
    app.run(debug=True)