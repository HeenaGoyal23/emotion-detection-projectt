import React, { useState, useEffect } from "react";
import Logo from "./../images/wmremove-transformed.jpeg";
import { CircleUser } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend,
} from "recharts";

const History = () => {
    const navigate = useNavigate();
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const handleLogout = () => {
        localStorage.removeItem("authToken");
        localStorage.removeItem("userId");
        navigate("/login");
    };

    useEffect(() => {
        const userId = localStorage.getItem("userId");
        if (!userId) {
            navigate("/login");
            return;
        }

        fetch(`http://localhost:5000/emotion-history/${userId}`)
            .then((res) => {
                if (!res.ok) {
                    throw new Error("Failed to fetch emotion history");
                }
                return res.json();
            })
            .then((data) => {
                const oneMonthAgo = new Date();
                oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

                const filteredHistory = data.filter((entry) => {
                    const entryDate = new Date(entry.timestamp);
                    return entryDate >= oneMonthAgo;
                });

                filteredHistory.sort(
                    (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
                );

                setHistory(filteredHistory);

                setLoading(false);
            })
            .catch((err) => {
                console.error("Fetch error:", err);
                setError("Unable to load history. Please try again later.");
                setLoading(false);
            });
    }, [navigate]);

    const emotionMap = {
        sad: 1,
        angry: 2,
        neutral: 3,
        surprise: 4,
        happy: 5,
    };

    const chartData = history.map((entry) => ({
        timestamp: new Date(entry.timestamp).toLocaleString(),
        emotion: emotionMap[entry.emotion.toLowerCase()] || 0,
        label: entry.emotion.toUpperCase(),
    }));

    const emotionCounts = history.reduce((acc, entry) => {
        const emotion = entry.emotion.toLowerCase();
        acc[emotion] = acc[emotion] ? acc[emotion] + 1 : 1;
        return acc;
    }, {});

    const totalEntries = history.length;
    const pieData = Object.keys(emotionCounts).map((emotion) => ({
        name: emotion.charAt(0).toUpperCase() + emotion.slice(1),
        value: Math.round((emotionCounts[emotion] / totalEntries) * 100), // Round percentage
    }));

    const COLORS = ["#8884d8", "#82ca9d", "#ff7300", "#ffc658", "#ff0000"];

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

            <div className="main-content">
                <div className="card">
                    <h1 className="card-title">Emotion History</h1>

                    {loading ? (
                        <p className="mt-3">Loading...</p>
                    ) : error ? (
                        <p className="text-danger mt-3">{error}</p>
                    ) : (
                        <>
                            {chartData.length > 0 ? (
                                <ResponsiveContainer width="100%" height={400}>
                                    <LineChart data={chartData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis
                                            dataKey="timestamp"
                                            angle={-90}
                                            textAnchor="end"
                                            height={60}
                                            tick={false}
                                            label={{
                                                value: "Time",
                                                position: "insideBottom",
                                                offset: 20,
                                            }}
                                        />
                                        <YAxis
                                            domain={[0, 6]}
                                            ticks={[1, 2, 3, 4, 5]}
                                            tickFormatter={(tick) => {
                                                const emotionEntry =
                                                    Object.entries(
                                                        emotionMap
                                                    ).find(
                                                        ([k, v]) => v === tick
                                                    );
                                                return emotionEntry
                                                    ? emotionEntry[0]
                                                    : "";
                                            }}
                                        />
                                        <Tooltip
                                            formatter={(value, name, props) => {
                                                const emotion =
                                                    props.payload.label ||
                                                    "Unknown";
                                                return [emotion, "Emotion"];
                                            }}
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="emotion"
                                            stroke="#8884d8"
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            ) : (
                                <p className="mt-3">No history available.</p>
                            )}

                            {/* Pie Chart */}
                            {pieData.length > 0 && (
                                <div className="mt-5">
                                    <h1 className="card-title">
                                        Emotional Health
                                    </h1>

                                    <ResponsiveContainer
                                        width="100%"
                                        height={400}
                                    >
                                        <PieChart>
                                            <Pie
                                                data={pieData}
                                                dataKey="value"
                                                nameKey="name"
                                                outerRadius="80%"
                                                label
                                            >
                                                {pieData.map((entry, index) => (
                                                    <Cell
                                                        key={`cell-${index}`}
                                                        fill={
                                                            COLORS[
                                                                index %
                                                                    COLORS.length
                                                            ]
                                                        }
                                                    />
                                                ))}
                                            </Pie>
                                            <Legend />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>

            <footer className="footer">
                © {new Date().getFullYear()} SentiBeat. All rights reserved.
            </footer>
        </div>
    );
};

export default History;
