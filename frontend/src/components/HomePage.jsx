import React from "react";
import { useNavigate } from "react-router-dom";
import Logo from "./../images/wmremove-transformed.jpeg";
import {
    Camera,
    CircleUser,
    Clapperboard,
    Frown,
    Laugh,
    MicVocal,
    MoveRight,
    Pizza,
    Sparkles,
} from "lucide-react";
import "./EmotionDetectionApp.css";

function HomePage() {
    let navigate = useNavigate();

    const goToEmotionDetection = () => {
        navigate("/emotiondetection");
    };
    const handleLogout = () => {
        localStorage.removeItem("authToken");
        localStorage.removeItem("userId");
        navigate("/login");
    };

    return (
        <div className="sentibeat-home-container">
            {/* Navbar */}
            <nav className="sentibeat-home-navbar">
                <div className="sentibeat-home-container-inner">
                    <a className="sentibeat-home-navbar-brand" href="/">
                        <img src={Logo} alt="SentiBeat" height="50px" />
                    </a>
                    <ul className="navbar-nav d-flex flex-row gap-3">
                        <li className="nav-item">
                            <a className="nav-link" href="/">
                                Home
                            </a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="/emotiondetection">
                                Detection
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
                            <a
                                className="nav-link"
                                href="/login"
                                onClick={handleLogout}
                            >
                                Logout
                            </a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="/history">
                                <CircleUser />
                            </a>
                        </li>
                    </ul>
                </div>
            </nav>

            {/* Hero Section */}
            <div className="sentibeat-home-hero-section">
                <div className="sentibeat-home-hero-content">
                    <h1 className="sentibeat-home-hero-title">
                        Discover Your Emotions with <span>SentiBeat</span>
                    </h1>
                    <p className="sentibeat-home-hero-subtitle">
                        Capture your moment, detect your mood, and get
                        personalized recommendations for movies, music, diet,
                        and workouts!
                    </p>
                    <button
                        className="btn btn-primary sentibeat-home-hero-btn"
                        onClick={goToEmotionDetection}
                    >
                        <Sparkles size={20} />
                        Start Emotion Detection
                    </button>
                </div>
                <div className="sentibeat-home-hero-image">
                    <Laugh size={80} className="sentibeat-home-camera-icon" />
                    <Clapperboard
                        size={80}
                        className="sentibeat-home-camera-icon"
                    />
                    <MicVocal
                        size={80}
                        className="sentibeat-home-camera-icon"
                    />
                    <Pizza size={80} className="sentibeat-home-camera-icon" />
                    <Frown size={80} className="sentibeat-home-camera-icon" />
                </div>
            </div>

            {/* Features Section */}
            <div className="sentibeat-home-features-section">
                <h2 className="sentibeat-home-features-title">
                    Why Choose SentiBeat?
                </h2>
                <div className="sentibeat-home-features-grid">
                    <div className="sentibeat-home-feature-card">
                        <h3>Instant Emotion Detection</h3>
                        <p>
                            Use your camera or upload an image to analyze your
                            emotions in real-time.
                        </p>
                    </div>
                    <div className="sentibeat-home-feature-card">
                        <h3>Personalized Recommendations</h3>
                        <p>
                            Get tailored suggestions for movies, playlists,
                            meals, and exercises based on your mood.
                        </p>
                    </div>
                    <div className="sentibeat-home-feature-card">
                        <h3>Seamless Experience</h3>
                        <p>
                            Enjoy a user-friendly interface with smooth
                            navigation and vibrant design.
                        </p>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="sentibeat-home-footer">
                <p>© 2025 SentiBeat App. All rights reserved.</p>
            </footer>
        </div>
    );
}

export default HomePage;
