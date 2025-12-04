import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";


export default function SignUp() {

  

  const [username, setUsername] = useState(null);
  const [password, setPassword] = useState(null);
  const [gmail, setGmail] = useState(null);
  const [mobile , setMobile] = useState(null);
  const [error, setError] = useState("");
  const [dp, setDp] = useState();

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {

    const formData = new FormData();
    formData.append("username", username);
    formData.append("password", password);
    formData.append("gmail", gmail);
    formData.append("mobile", mobile);
    formData.append("dp", dp); // this is the image file

    const res = await axios.post(
    "http://localhost:3000/api/auth/signup",
    formData,
    {
        headers: { "Content-Type": "multipart/form-data" }
    }
    );

      console.log(res);
      alert(res.data.message);
      if(res.status == 200){
        console.log("dsdsd*******ss");
        navigate("/");
      }
      
    } catch (err) {
      setError("Invalid submission");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-xl p-8 w-80 flex flex-col gap-4"
      >
        <h2 className="text-center text-2xl font-semibold">SignUp</h2>

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

        <input
          type="text"
          placeholder="Gmail"
          value={gmail}
          onChange={(e) => setGmail(e.target.value)}
          className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <input
          type="text"
          placeholder="Mobile"
          value={mobile}
          onChange={(e) => {
            const value = e.target.value;
            // Allow only digits
            if (/^\d*$/.test(value)) {
            setMobile(value);
            }
            else{
                setError("Mobile number must be 10 digits");
            }
          }}
          className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input
            type="file"
            accept="image/*"
            onChange={(e) => setDp(e.target.files[0])}
            className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />


        <button
          type="submit"
          className="bg-blue-500 text-white rounded-lg py-2 font-medium hover:bg-blue-600 transition"
        >
          Submit
        </button>
        
        {error && (
          <p className="text-red-500 text-center text-sm">{error}</p>
        )}

      </form>
    </div>
  );
}
