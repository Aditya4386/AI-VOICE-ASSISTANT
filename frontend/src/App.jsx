import {
  Routes,
  Route,
  Navigate
} from "react-router-dom"

import Login from "./pages/Login"

import Register from "./pages/Register"

import Chat from "./pages/Chat"

function ProtectedRoute({ children }) {

  const token = localStorage.getItem("token")

  return token
    ? children
    : <Navigate to="/login" />
}

function App() {

  return (

    <Routes>

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/register"
        element={<Register />}
      />

      <Route
        path="/"
        element={

          <ProtectedRoute>

            <Chat />

          </ProtectedRoute>
        }
      />

    </Routes>
  )
}

export default App