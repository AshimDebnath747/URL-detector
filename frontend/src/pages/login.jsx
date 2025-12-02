import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { checkAuth } from "../utility/checkAuth";
export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [msg, setMsg] = useState("");
    const navigate = useNavigate();
    useEffect(() => {
        checkAuth().then(data => {
            if (data.loggedIn == true) {
                navigate("/")
            }
        })
    }, []);
    async function handleLogin(e) {
        e.preventDefault();
        setMsg("");

        try {
            const res = await axios.post("http://localhost:8000/api/login", {
                email, password
            }, {
                withCredentials: true
            })
            console.log(res)
            if (!res.data.login) { setMsg(res.data.message || "Login failed"); }
            else { navigate("/") }
        } catch {
            setMsg("Server error");
        }
    }

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <form
                onSubmit={handleLogin}
                className="w-96 bg-white p-8 rounded-2xl shadow-lg space-y-4"
            >
                <h1 className="text-2xl font-bold text-center">Login</h1>

                {msg && (
                    <p className="text-center text-sm text-red-500">{msg}</p>
                )}

                <input
                    type="email"
                    placeholder="Email"
                    className="w-full px-3 py-2 border rounded-lg"
                    onChange={(e) => setEmail(e.target.value)}
                />

                <input
                    type="password"
                    placeholder="Password"
                    className="w-full px-3 py-2 border rounded-lg"
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button
                    className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                >
                    Login
                </button>

                <p className="text-center text-sm">
                    Don't have an account?{" "}
                    <a href="/signup" className="text-blue-600 underline">Signup</a>
                </p>
            </form>
        </div>
    );
}
