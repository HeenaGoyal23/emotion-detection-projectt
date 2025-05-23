import React, { useState } from "react";
import { LogIn, Mail, Lock } from "lucide-react";
import Logo from "./../images/wmremove-transformed.jpeg";
import "./LoginPage.css";
import { useNavigate } from "react-router-dom";

function LoginPage() {
    let navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:5000/login", {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });
            const data = await response.json();
            setMessage(data.message);
            if (response.ok) {
                localStorage.setItem("userId", data.id);
                localStorage.setItem("authToken", "mock-token");
                navigate("/");

                console.log("Login successful:", data);
            }
        } catch (error) {
            setMessage("Error logging in. Please try again.");
        }
    };

    return (
        <div className="app-container">
            {/* Navbar */}
            <nav className="navbar">
                <div className="container">
                    <a className="navbar-brand" href="/">
                        <img src={Logo} alt="SentiBeat" height={"50px"} />
                    </a>
                </div>
            </nav>

            {/* Main Content */}
            <div className="main-content">
                <div className="card">
                    <h1 className="card-title">Login to SentiBeat</h1>
                    <form onSubmit={handleLogin}>
                        <div className="mb-3">
                            <div className="input-group">
                                <span className="input-group-icon">
                                    <Mail size={20} />
                                </span>
                                <input
                                    type="email"
                                    className="form-control"
                                    placeholder="Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <div className="mb-3">
                            <div className="input-group">
                                <span className="input-group-icon">
                                    <Lock size={20} />
                                </span>
                                <input
                                    type="password"
                                    className="form-control"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    required
                                />
                            </div>
                        </div>
                        <button type="submit" className="btn btn-primary w-100">
                            <LogIn size={20} />
                            Login
                        </button>
                    </form>
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
                    <p className="text-center mt-3">
                        Don't have an account?{" "}
                        <a href="/signup" className="nav-link d-inline">
                            Sign Up
                        </a>
                    </p>
                </div>
            </div>

            {/* Footer */}
            <footer className="footer">
                <p>© 2025 SentiBeat App. All rights reserved.</p>
            </footer>
        </div>
    );
}

export default LoginPage;
