import { useState } from "react"
import api from "../services/api"

function Register() {

  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleRegister = async () => {

    try {

      const response = await api.post("/signup", {
        username,
        email,
        password
      })

      alert(response.data.message)

    } catch (error) {
      alert("Registration failed")
    }
  }

  return (
    <div className="bg-black min-h-screen flex items-center justify-center">

      <div className="bg-zinc-900 p-8 rounded-xl w-96">

        <h1 className="text-white text-3xl mb-6">
          Register
        </h1>

        <input
          type="text"
          placeholder="Username"
          className="w-full p-3 mb-4 rounded bg-zinc-800 text-white"
          onChange={(e) => setUsername(e.target.value)}
        />

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
          onClick={handleRegister}
          className="bg-white text-black px-4 py-3 rounded w-full"
        >
          Register
        </button>

      </div>

    </div>
  )
}

export default Register