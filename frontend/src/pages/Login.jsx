import { useState } from "react"

import { loginUser } from "../services/api"

import {
  useNavigate,
  Link
} from "react-router-dom"

function Login() {

  const navigate = useNavigate()

  const [email, setEmail] = useState("")

  const [password, setPassword] = useState("")

  const [loading, setLoading] = useState(false)

  const [error, setError] = useState("")

  const [message, setMessage] = useState("")

  const handleLogin = async () => {

    setLoading(true)

    setError("")

    setMessage("")

    try {

      const response = await loginUser({

        email,
        password
      })

      localStorage.setItem(
        "token",
        response.access_token
      )
      
      localStorage.setItem(
        "username",
        response.username
      )

      setMessage(
        "Login successful"
      )

      setTimeout(() => {

        navigate("/")

      }, 1000)

    } catch (error) {

      setError(

        error.response?.data?.detail ||

        "Login failed"
      )

    } finally {

      setLoading(false)
    }
  }

  return (

    <div className="flex justify-center items-center min-h-screen bg-black px-5">

      <div className="bg-zinc-900 border border-zinc-800 p-10 rounded-3xl w-full max-w-md shadow-2xl">

        <h1 className="text-white text-5xl font-bold mb-8 text-center">

          Welcome Back

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
          className="w-full p-4 mb-5 rounded-xl bg-zinc-800 text-white outline-none border border-zinc-700 focus:border-white"
        />

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full p-4 bg-white hover:bg-zinc-300 transition rounded-xl text-black font-semibold"
        >

          {

            loading
              ? "Logging in..."
              : "Login"
          }

        </button>

        <div className="flex justify-between mt-6 text-sm">

          <Link
            to="/register"
            className="text-zinc-400 hover:text-white"
          >
            Create account
          </Link>

          <Link
            to="/forgot-password"
            className="text-zinc-400 hover:text-white"
          >
            Forgot password?
          </Link>

        </div>

      </div>
    </div>
  )
}

export default Login