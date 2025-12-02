import { useState } from "react";
import axios from 'axios';
export default function Signup() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [msg, setMsg] = useState("");

    async function handleSignup(e) {
        e.preventDefault();
        setMsg("");

        try {
            const res = await axios.post("http://localhost:8000/api/signup", {
                name, email, password
            })

            const data = res.data;
            console.log(data.message)
            if (data.message == "Server error") return setMsg(data.error || "Signup failed");

            setMsg(data.message);
        } catch (err) {
            console.log(err);
            setMsg("Server error");
        }
    }

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <form
                onSubmit={handleSignup}
                className="w-96 bg-white p-8 rounded-2xl shadow-lg space-y-4"
            >
                <h1 className="text-2xl font-bold text-center">Create Account</h1>

                {msg && (
                    <p className="text-center text-sm text-red-500">{msg}</p>
                )}

                <input
                    type="text"
                    placeholder="Name"
                    className="w-full px-3 py-2 border rounded-lg"
                    onChange={(e) => setName(e.target.value)}
                />

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
                    className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
                >
                    Signup
                </button>

                <p className="text-center text-sm">
                    Already have an account?{" "}
                    <a href="/login" className="text-blue-600 underline">Login</a>
                </p>
            </form>
        </div>
    );
}
