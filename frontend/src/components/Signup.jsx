import React, { useState } from "react";
import { UserPlus, User, Mail, Lock } from "lucide-react";
import Logo from "./../images/wmremove-transformed.jpeg";
import "./SignUpPage.css";
import { useNavigate } from "react-router-dom";

function SignUpPage() {
    let navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const handleSignUp = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:5000/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password }),
            });
            const data = await response.json();
            setMessage(data.message);
            if (response.ok) {
                localStorage.setItem("authToken", "mock-token");
                navigate("/");
            }
        } catch (error) {
            setMessage("Error signing up. Please try again.");
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
                    </ul>
                </div>
            </nav>

            {/* Main Content */}
            <div className="main-content">
                <div className="card">
                    <h1 className="card-title">Sign Up for SentiBeat</h1>
                    <form onSubmit={handleSignUp}>
                        <div className="mb-3">
                            <div className="input-group">
                                <span className="input-group-icon">
                                    <User size={20} />
                                </span>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Full Name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
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
                            <UserPlus size={20} />
                            Sign Up
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
                        Already have an account?{" "}
                        <a href="/login" className="nav-link d-inline">
                            Login
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

export default SignUpPage;
