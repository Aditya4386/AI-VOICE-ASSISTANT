import axios from "axios"

const api = axios.create({
  baseURL: "http://127.0.0.1:8000"
})

export default api

export const sendOTP = async (data) => {

  const response = await api.post(
    "/send-otp",
    data
  )

  return response.data
}

export const verifyOTP = async (data) => {

  const response = await api.post(
    "/verify-otp",
    data
  )

  return response.data
}

export const loginUser = async (data) => {

  const response = await api.post(
    "/login",
    data
  )

  return response.data
}

export const deleteConversation = (
  conversationId
) => {

  return api.delete(
    `/conversations/${conversationId}`
  )

}