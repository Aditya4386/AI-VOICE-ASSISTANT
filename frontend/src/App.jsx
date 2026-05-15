import { Routes, Route } from "react-router-dom"

import Login from "./pages/Login"
import Register from "./pages/Register"
import Chat from "./pages/Chat"

import ProtectedRoute from "./components/ProtectedRoute"

function App() {

  return (
    <Routes>

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Chat />
          </ProtectedRoute>
        }
      />

      <Route path="/login" element={<Login />} />

      <Route path="/register" element={<Register />} />

    </Routes>
  )
}

export default App