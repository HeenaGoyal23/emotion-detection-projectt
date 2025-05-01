import React, { useState } from "react";
import "./EmotionDetectionApp.css";
import { Camera, Upload, Sparkles, CircleUser } from "lucide-react";
import Logo from "./../images/wmremove-transformed.jpeg";
import { useNavigate } from "react-router-dom";

function EmotionDetectionApp() {
    let navigate = useNavigate();
    const [message, setMessage] = useState("");
    const [emotion, setEmotion] = useState("");
    const [recommendations, setRecommendations] = useState({
        movies: "",
        spotify: [],
        diet: [],
        exercise: [],
    });

    const captureImage = async () => {
        try {
            const response = await fetch("http://127.0.0.1:5000/capture");
            const data = await response.json();
            setMessage(data.message);
        } catch (error) {
            setMessage("Error capturing image.");
        }
    };

    const handleFileSelectAndUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) {
            setMessage("Please select an image file.");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await fetch("http://127.0.0.1:5000/upload", {
                method: "POST",
                body: formData,
            });
            const data = await response.json();
            setMessage(data.message);
        } catch (error) {
            setMessage("Error uploading image.");
        }
    };

    const detectEmotion = async () => {
        try {
            const response = await fetch("http://127.0.0.1:5000/emotion");
            const data = await response.json();
            setEmotion(data.emotion);
            setRecommendations(
                data.recommendations || {
                    movies: "",
                    spotify: [],
                    diet: [],
                    exercise: [],
                }
            );
            console.log(data.recommendations);
        } catch (error) {
            setEmotion("Error detecting emotion.");
            setRecommendations({
                movies: "",
                spotify: [],
                diet: [],
                exercise: [],
            });
        }
    };
    const handleLogout = () => {
        localStorage.removeItem("authToken");
        navigate("/login");
    };

    return (
        <div className="app-container">
            {/* Navbar */}
            <nav className="navbar">
                <div className="container">
                    <a className="navbar-brand" href="/">
                        <img src={Logo} alt="SentiBeat" height={"50px"} />
                    </a>
                    <ul className="navbar-nav d-flex flex-row gap-3">
                        <li className="nav-item">
                            <a className="nav-link" href="/">
                                Home
                            </a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="/about">
                                About
                            </a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="/contact">
                                Contact
                            </a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="/contact">
                                <CircleUser />
                            </a>
                        </li>
                        <li className="nav-item">
                            <a
                                className="nav-link"
                                href="/login"
                                onClick={handleLogout}
                            >
                                Logout
                            </a>
                        </li>
                    </ul>
                </div>
            </nav>

            {/* Main Content */}
            <div className="main-content">
                <div className="card">
                    <h1 className="card-title">SentiBeat</h1>
                    <div className="row d-flex align-items-center justify-content-between">
                        <button
                            onClick={captureImage}
                            className="btn btn-primary flex-fill col-5"
                        >
                            <Camera />
                            Capture Image
                        </button>

                        {/* <h3 className="divider col-1"></h3> */}

                        {/* Stylish File Input */}
                        <button
                            type="button"
                            className="btn btn-primary flex-fill col-5"
                            onClick={() =>
                                document.getElementById("file-upload").click()
                            }
                        >
                            <Upload />
                            Choose and Upload Image
                        </button>
                        <input
                            type="file"
                            id="file-upload"
                            accept="image/*"
                            onChange={handleFileSelectAndUpload}
                            style={{ display: "none" }} // Hidden input
                        />
                    </div>
                    {/* Detect Emotion Button */}
                    <div className="row">
                        <button
                            onClick={detectEmotion}
                            className="btn btn-success col-12"
                        >
                            <Sparkles />
                            Detect Emotion
                        </button>
                    </div>

                    {/* Message */}
                    {message && (
                        <p
                            className={`message ${
                                message.toLowerCase().includes("error")
                                    ? "error"
                                    : "success"
                            }`}
                        >
                            {message}
                        </p>
                    )}
                </div>
                {emotion && (
                    <div className="card">
                        {/* Emotion Result */}
                        {emotion && (
                            <div className="emotion-result">
                                <p className="emotion-text">
                                    Detected Emotion: <span>{emotion}</span>
                                </p>

                                {recommendations.movies &&
                                    recommendations.movies.length > 0 && (
                                        <div className="recommendations">
                                            <h5 className="recommendation-title">
                                                Recommended Movies
                                            </h5>
                                            <div className="recommendation-grid">
                                                {recommendations.movies.map(
                                                    (movie, index) => (
                                                        <div
                                                            key={index}
                                                            className="recommendation-card"
                                                        >
                                                            {movie.poster && (
                                                                <img
                                                                    src={
                                                                        movie.poster
                                                                    }
                                                                    alt={
                                                                        movie.title
                                                                    }
                                                                    className="recommendation-image"
                                                                />
                                                            )}
                                                            <div className="recommendation-content">
                                                                <h6>
                                                                    {
                                                                        movie.title
                                                                    }
                                                                </h6>
                                                                <p>
                                                                    {movie.overview
                                                                        ? movie.overview.slice(
                                                                              0,
                                                                              100
                                                                          ) +
                                                                          "..."
                                                                        : "No description available."}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                        </div>
                                    )}

                                {/* Spotify Recommendations */}
                                {recommendations.spotify &&
                                    recommendations.spotify.length > 0 && (
                                        <div className="recommendations">
                                            <h5 className="recommendation-title">
                                                Recommended Playlists
                                            </h5>
                                            <div className="recommendation-grid">
                                                {recommendations.spotify.map(
                                                    (playlist, index) => (
                                                        <a
                                                            key={index}
                                                            href={playlist.url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="recommendation-card"
                                                        >
                                                            <div className="recommendation-placeholder spotify-placeholder"></div>
                                                            <div className="recommendation-content">
                                                                <h6>
                                                                    {
                                                                        playlist.title
                                                                    }
                                                                </h6>
                                                                <p>
                                                                    Listen on
                                                                    Spotify
                                                                </p>
                                                            </div>
                                                        </a>
                                                    )
                                                )}
                                            </div>
                                        </div>
                                    )}

                                {/* Diet Recommendations */}
                                {recommendations.diet &&
                                    recommendations.diet.length > 0 && (
                                        <div className="recommendations">
                                            <h5 className="recommendation-title">
                                                Recommended Food Items
                                            </h5>
                                            <div className="recommendation-grid">
                                                {recommendations.diet.map(
                                                    (food, index) => (
                                                        <div
                                                            key={index}
                                                            className="recommendation-card"
                                                        >
                                                            <img
                                                                src={food.image}
                                                                alt={food.title}
                                                                className="recommendation-image"
                                                            />
                                                            <div className="recommendation-content">
                                                                <h6>
                                                                    {food.title}
                                                                </h6>
                                                                <p>
                                                                    Delicious
                                                                    choice!
                                                                </p>
                                                            </div>
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                        </div>
                                    )}

                                {/* Exercise Recommendations */}
                                {recommendations.exercise &&
                                    recommendations.exercise.length > 0 && (
                                        <div className="recommendations">
                                            <h5 className="recommendation-title">
                                                Recommended Workouts
                                            </h5>
                                            <div className="recommendation-grid">
                                                {recommendations.exercise.map(
                                                    (workout, index) => (
                                                        <div
                                                            key={index}
                                                            className="recommendation-card workout-card"
                                                        >
                                                            <div className="recommendation-placeholder exercise-placeholder"></div>
                                                            <div className="recommendation-content">
                                                                <h6>
                                                                    {
                                                                        workout.name
                                                                    }
                                                                </h6>
                                                                <p>
                                                                    {
                                                                        workout.description
                                                                    }
                                                                </p>
                                                            </div>
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                        </div>
                                    )}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Footer */}
            <footer className="footer">
                <p>© 2025 SentiBeat App. All rights reserved.</p>
            </footer>
        </div>
    );
}

export default EmotionDetectionApp;
