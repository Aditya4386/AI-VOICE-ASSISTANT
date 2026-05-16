import { useState } from "react"

import {
  sendOTP,
  verifyOTP
} from "../services/api"

import { useNavigate, Link } from "react-router-dom"

function Register() {

  const navigate = useNavigate()

  const [username, setUsername] = useState("")

  const [email, setEmail] = useState("")

  const [password, setPassword] = useState("")

  const [otp, setOtp] = useState("")

  const [otpSent, setOtpSent] = useState(false)

  const [loading, setLoading] = useState(false)

  const [message, setMessage] = useState("")

  const [error, setError] = useState("")

  const handleSendOTP = async () => {

    setLoading(true)

    setError("")

    setMessage("")

    try {

      await sendOTP({

        username,
        email,
        password
      })

      setOtpSent(true)

      setMessage(
        "OTP sent to your email"
      )

    } catch (error) {

      setError(
        error.response?.data?.detail ||
        "Failed to send OTP"
      )

    } finally {

      setLoading(false)
    }
  }

  const handleVerifyOTP = async () => {

    setLoading(true)

    setError("")

    setMessage("")

    try {

      await verifyOTP({

        username,
        email,
        password,
        otp
      })

      setMessage(
        "Registration successful"
      )

      setTimeout(() => {

        navigate("/login")

      }, 1500)

    } catch (error) {

      setError(
        error.response?.data?.detail ||
        "Invalid OTP"
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
          className="w-full p-4 mb-4 rounded-xl bg-zinc-800 text-white outline-none border border-zinc-700 focus:border-white"
        />

        {

          otpSent && (

            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full p-4 mb-4 rounded-xl bg-zinc-800 text-white outline-none border border-zinc-700 focus:border-green-500"
            />
          )
        }

        {

          !otpSent ? (

            <button
              onClick={handleSendOTP}
              disabled={loading}
              className="w-full p-4 bg-white hover:bg-zinc-300 transition rounded-xl text-black font-semibold"
            >

              {

                loading
                  ? "Sending OTP..."
                  : "Send OTP"
              }

            </button>

          ) : (

            <button
              onClick={handleVerifyOTP}
              disabled={loading}
              className="w-full p-4 bg-green-500 hover:bg-green-600 transition rounded-xl text-white font-semibold"
            >

              {

                loading
                  ? "Verifying..."
                  : "Verify OTP"
              }

            </button>
          )
        }

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