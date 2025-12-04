import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login() {

  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post("http://localhost:3000/api/auth/login",{
        username, 
        password
      });
      console.log(res);
      const userId = res.data.user_id;
      alert(res.data.message);
      if(res.status == 200){
        navigate(`/MainPage/${userId}`);
      }
    } catch (err) {
      setError("Invalid username or password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-xl p-8 w-80 flex flex-col gap-4"
      >
        <h2 className="text-center text-2xl font-semibold">Login</h2>

        {error && (
          <p className="text-red-500 text-center text-sm">{error}</p>
        )}

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <button
          type="submit"
          className="bg-blue-500 text-white rounded-lg py-2 font-medium hover:bg-blue-600 transition"
        >
          Login
        </button>
      </form>
        <p className="text-sm text-center mt-4">
          Not a member?{" "}
          <Link to="/signup" className="text-blue-600 underline hover:text-blue-800">
            Sign up here
          </Link>
        </p>


    </div>
  );
}
