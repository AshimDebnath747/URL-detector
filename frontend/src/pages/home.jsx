// frontend/src/App.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { checkAuth } from "../utility/checkAuth";
import axios from 'axios';
export default function Home() {
    const [url, setUrl] = useState("");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [user, setUser] = useState(null);
    const [email, setEmail] = useState(null);
    const [history, setHistory] = useState([]);
    const navigate = useNavigate();
    async function fetchHistory() {
        try {
            const res = await axios.get("http://localhost:8000/api/history", {
                withCredentials: true
            });
            setHistory(res.data);
            console.log(res.data)
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        checkAuth().then(data => {
            if (data.loggedIn == true) {
                console.log(data)
                setUser(data.user.name)
                setEmail(data.user.email)
            } else {
                navigate("/login")
            }
        })
    }, []);
    useEffect(() => {

        fetchHistory();
    }, [setResult]); // ✅ runs once on page load
    // 🔹 Logout function
    const handleLogout = async () => {
        await axios.post(
            "http://localhost:8000/api/logout",
            {},
            { withCredentials: true }
        ); // redirect to login
        navigate("/login");               // redirect to login page
    };

    async function checkUrl(e) {
        e.preventDefault();
        if (!url) return;
        setLoading(true);
        setResult(null);

        try {
            const res = await axios.post("http://localhost:8000/api/check", { url: url },
                {
                    withCredentials: true
                }
            )
            const data = res.data;
            setResult(data);
            await fetchHistory();
        } catch (err) {
            console.log(err);
            setResult({ error: "Server unreachable" });
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-sky-50 to-indigo-50 flex items-center justify-center p-6 relative">

            {/* 🔹 Logout Button (top-right) */}
            <button
                onClick={handleLogout}
                className="absolute top-4 right-4 px-4 py-2 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600 shadow"
            >
                Logout
            </button>

            <div className="max-w-3xl w-full bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-8">
                <h1 className="text-2xl font-bold text-slate-800 mb-1">PhishShield :  {user}</h1>
                <p className="text-sm text-slate-500 mb-6">Detect phishing URLs instantly</p>

                <form onSubmit={checkUrl} className="space-y-4">
                    <div className="relative">
                        <input
                            type="text"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            placeholder="Enter URL to check..."
                            className="w-full rounded-lg border p-3 pr-28 text-sm outline-none shadow-sm"
                        />
                        <button
                            className="absolute right-1 top-1 bottom-1 px-4 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700"
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? "Checking..." : "Check"}
                        </button>
                    </div>
                </form>

                <section className="mt-6">
                    {result ? (
                        result.error ? (
                            <div className="p-4 rounded-md bg-red-50 text-red-800">{result.error}</div>
                        ) : (
                            <div className="p-4 rounded-xl shadow-sm bg-white">
                                <h2 className="text-lg font-semibold">
                                    Verdict: {result.verdict === "suspicious" ? (
                                        <span className="text-red-600">suspicious</span>
                                    ) : (
                                        <span className="text-green-600">Legitimate</span>
                                    )}
                                </h2>
                                <p className="text-sm text-slate-500">Score: {result.score} / 100</p>

                                <div className="mt-4">
                                    <h3 className="text-sm font-medium text-slate-700">Reasons</h3>
                                    <ul className="mt-2 text-sm space-y-1 text-slate-600">
                                        {result.reasons && result.reasons.length > 0 ? (
                                            result.reasons.map((r, i) => <li key={i}>• {r}</li>)
                                        ) : (
                                            <li>No suspicious indicators found.</li>
                                        )}
                                    </ul>
                                </div>
                            </div>
                        )
                    ) : (
                        <div className="p-4 rounded-md bg-slate-50 text-slate-500">
                            Enter a URL and press Check.
                        </div>
                    )}
                </section>
                <section className="mt-10">
                    <h2 className="text-lg font-semibold text-slate-800 mb-3">
                        URL History
                    </h2>

                    {loading ? (
                        <p className="text-sm text-slate-500">Loading history...</p>
                    ) : history.length === 0 ? (
                        <div className="p-4 bg-slate-50 text-slate-500 rounded-lg text-sm">
                            No history found yet.
                        </div>
                    ) : (
                        <div className="overflow-x-auto rounded-xl border">
                            <table className="w-full text-sm text-left border-collapse">
                                <thead className="bg-slate-100 text-slate-700">
                                    <tr>
                                        <th className="p-3">URL</th>
                                        <th className="p-3">Status</th>
                                        <th className="p-3">Time</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {history.map((item, i) => (
                                        <tr key={i} className="border-t hover:bg-slate-50">
                                            <td className="p-3 text-slate-700 break-all">
                                                {item.url}
                                            </td>

                                            <td className="p-3">
                                                {item.status === "suspicious" ? (
                                                    <span className="px-2 py-1 text-xs bg-red-100 text-red-600 rounded">
                                                        suspicious
                                                    </span>
                                                ) : (
                                                    <span className="px-2 py-1 text-xs bg-green-100 text-green-600 rounded">
                                                        Legit
                                                    </span>
                                                )}
                                            </td>

                                            <td className="p-3 text-slate-500 text-xs">
                                                {new Date(item.time).toLocaleString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </section>
            </div>

        </div>
    );
}
