import { useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "../services/api"

function Login() {

  const navigate = useNavigate()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleLogin = async () => {

    try {

      const response = await api.post("/login", {
        email,
        password
      })

      localStorage.setItem(
        "token",
        response.data.access_token
      )

      alert("Login successful")

      navigate("/")

    } catch (error) {

      alert("Login failed")
    }
  }

  return (
    <div className="bg-black min-h-screen flex items-center justify-center">

      <div className="bg-zinc-900 p-8 rounded-xl w-96">

        <h1 className="text-white text-3xl mb-6">
          Login
        </h1>

        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 mb-4 rounded bg-zinc-800 text-white"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 mb-4 rounded bg-zinc-800 text-white"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          className="bg-white text-black px-4 py-3 rounded w-full"
        >
          Login
        </button>

      </div>

    </div>
  )
}

export default Login