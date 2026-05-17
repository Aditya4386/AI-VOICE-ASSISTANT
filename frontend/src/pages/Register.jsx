import { useState } from "react"

import axios from "axios"

import { useNavigate, Link } from "react-router-dom"

function Register() {

  const navigate = useNavigate()

  const [username, setUsername] = useState("")

  const [email, setEmail] = useState("")

  const [password, setPassword] = useState("")

  const [loading, setLoading] = useState(false)

  const [message, setMessage] = useState("")

  const [error, setError] = useState("")

  const API_URL =
    "https://ai-voice-assistant-nka5.onrender.com"

  const handleRegister = async () => {

    setLoading(true)

    setError("")

    setMessage("")

    try {

      await axios.post(

        `${API_URL}/signup`,

        {
          username,
          email,
          password
        }
      )

      setMessage(
        "Registration successful"
      )

      setTimeout(() => {

        navigate("/login")

      }, 1500)

    } catch (error) {

      setError(

        error.response?.data?.detail ||

        "Registration failed"
      )

    } finally {

      setLoading(false)
    }
  }

  return (

    <div className="flex justify-center items-center min-h-screen bg-black px-5">

      <div className="bg-zinc-900 border border-zinc-800 p-10 rounded-3xl w-full max-w-md shadow-2xl">

        <h1 className="text-white text-5xl font-bold mb-8 text-center">

          Create Account

        </h1>

        {

          message && (

            <div className="bg-green-500/20 border border-green-500 text-green-400 p-3 rounded mb-5 text-sm">

              {message}

            </div>
          )
        }

        {

          error && (

            <div className="bg-red-500/20 border border-red-500 text-red-400 p-3 rounded mb-5 text-sm">

              {error}

            </div>
          )
        }

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-4 mb-4 rounded-xl bg-zinc-800 text-white outline-none border border-zinc-700 focus:border-white"
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-4 mb-4 rounded-xl bg-zinc-800 text-white outline-none border border-zinc-700 focus:border-white"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-6 mb-6 rounded-xl bg-zinc-800 text-white outline-none border border-zinc-700 focus:border-white"
        />

        <button
          onClick={handleRegister}
          disabled={loading}
          className="w-full p-4 bg-white hover:bg-zinc-300 transition rounded-xl text-black font-semibold"
        >

          {

            loading
              ? "Creating Account..."
              : "Register"
          }

        </button>

        <p className="text-zinc-400 text-center mt-6">

          Already have an account?

          <Link
            to="/login"
            className="text-white ml-2 hover:underline"
          >
            Login
          </Link>

        </p>

      </div>
    </div>
  )
}

export default Register
