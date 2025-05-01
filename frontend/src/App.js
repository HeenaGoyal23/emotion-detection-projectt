import React from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";
import About from "./components/About";
import Contact from "./components/Contact";
import "./components/EmotionDetectionApp.css";
import EmotionDetectionApp from "./components/EmotionDetectionApp";
import LoginPage from "./components/Login";
import SignUpPage from "./components/Signup";

// Protected Route component
const ProtectedRoute = ({ children }) => {
    const isAuthenticated = localStorage.getItem("authToken");
    return isAuthenticated ? children : <Navigate to="/login" replace />;
};

function App() {
    return (
        <Router>
            <Routes>
                <Route
                    path="/"
                    element={
                        <ProtectedRoute>
                            <EmotionDetectionApp />
                        </ProtectedRoute>
                    }
                />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignUpPage />} />
            </Routes>
        </Router>
    );
}

export default App;
