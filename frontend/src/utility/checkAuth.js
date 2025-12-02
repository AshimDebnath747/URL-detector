import axios from "axios";

export async function checkAuth() {

    const res = await axios.get("http://localhost:8000/api/auth", {
        withCredentials: true
    });
    console.log("data:", res.data)
    return res.data


}