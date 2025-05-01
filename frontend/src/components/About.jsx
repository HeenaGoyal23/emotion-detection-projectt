import React from "react";
import { Sparkles, Heart, Rocket, CircleUser } from "lucide-react";
import "./About.css";
import Logo from "./../images/wmremove-transformed.jpeg";
import { useNavigate } from "react-router-dom";

function About() {
    let navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("authToken");
        navigate("/login");
    };
    return (
        <div className="app-container">
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

            <main>
                <div className="content">
                    <h1>About SentiBeat</h1>
                    <hr />
                    <p>
                        Welcome to <span>SentiBeat</span>! We're passionate
                        about forging meaningful connections between your
                        emotions and personalized entertainment. Our
                        cutting-edge emotion detection technology curates
                        content that perfectly aligns with your mood, making
                        every moment more vibrant.
                    </p>

                    <h2>Our Values</h2>
                    <div className="values-grid">
                        <div className="value-card">
                            <Sparkles className="text-indigo-600" />
                            <h3>Innovation with Purpose</h3>
                            <p>
                                Harnessing technology to uplift your emotional
                                well-being.
                            </p>
                        </div>
                        <div className="value-card">
                            <Heart className="text-purple-600" />
                            <h3>Empathy First</h3>
                            <p>
                                Deeply understanding and responding to your
                                emotional needs.
                            </p>
                        </div>
                        <div className="value-card">
                            <Rocket className="text-blue-600" />
                            <h3>Always Evolving</h3>
                            <p>
                                Relentlessly refining our recommendations for
                                you.
                            </p>
                        </div>
                    </div>

                    <div className="tech-section">
                        <h2>Our Technology</h2>
                        <p>
                            SentiBeat blends advanced emotion detection with
                            intelligent recommendation systems to deliver a
                            tailored experience. Whether you're feeling joyful,
                            calm, or introspective, we enhance your mood with
                            content that feels just right.
                        </p>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="footer">
                <p>© 2025 SentiBeat App. All rights reserved.</p>
            </footer>
        </div>
    );
}

export default About;
