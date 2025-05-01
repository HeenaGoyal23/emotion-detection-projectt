import React, { useState } from "react";
import Logo from "./../images/wmremove-transformed.jpeg";
import { CircleUser } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Contact = () => {
    let navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("authToken");
        navigate("/login");
    };
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: "",
    });
    const [success, setSuccess] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(formData); // You can replace this with an API call later
        setSuccess(true);
        setFormData({ name: "", email: "", message: "" });
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
                    <h1 className="card-title">Contact Us</h1>

                    <form onSubmit={handleSubmit} className="text-center">
                        <input
                            type="text"
                            name="name"
                            className="form-control"
                            placeholder="Your Name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                        <input
                            type="email"
                            name="email"
                            className="form-control"
                            placeholder="Your Email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                        <textarea
                            name="message"
                            className="form-control"
                            placeholder="Your Message"
                            rows="5"
                            value={formData.message}
                            onChange={handleChange}
                            required
                        ></textarea>

                        <button type="submit" className="btn btn-primary">
                            Send Message
                        </button>
                    </form>

                    {success && (
                        <div className="message success">
                            Thank you for contacting us!
                        </div>
                    )}

                    <div className="divider">OR</div>

                    <p
                        className="form-control"
                        style={{
                            background: "none",
                            border: "none",
                            boxShadow: "none",
                            cursor: "default",
                            textAlign: "center",
                        }}
                    >
                        Email us directly at{" "}
                        <strong>support@sentibeat.com</strong>
                    </p>
                </div>
            </div>

            {/* Footer */}
            <footer className="footer">
                © {new Date().getFullYear()} SentiBeat. All rights reserved.
            </footer>
        </div>
    );
};

export default Contact;
