import { useEffect, useRef, useState } from "react"
import api from "../services/api"

function Chat() {

  const [messages, setMessages] = useState([])

  const [input, setInput] = useState("")

  const [loading, setLoading] = useState(false)

  const [conversationId, setConversationId] = useState(null)

  const [conversations, setConversations] = useState([])

  const recognitionRef = useRef(null)

  const messagesEndRef = useRef(null)

  // Load conversations and restore active chat

  useEffect(() => {

    fetchConversations()

    const savedConversationId =
      localStorage.getItem(
        "activeConversationId"
      )

    if (savedConversationId) {

      loadMessages(savedConversationId)

      setConversationId(savedConversationId)
    }

  }, [])

  // Auto scroll

  useEffect(() => {

    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth"
    })

  }, [messages, loading])

  const fetchConversations = async () => {

    try {

      const response = await api.get(
        "/conversations/1"
      )

      setConversations(response.data)

    } catch (error) {

      console.log(error)
    }
  }

  // Start fresh empty chat

  const createConversation = () => {

    setConversationId(null)

    setMessages([])

    localStorage.removeItem(
      "activeConversationId"
    )
  }

  const loadMessages = async (id) => {

    try {

      const response = await api.get(
        `/messages/${id}`
      )

      setMessages(response.data)

      setConversationId(id)

      localStorage.setItem(
        "activeConversationId",
        id
      )

    } catch (error) {

      console.log(error)
    }
  }

  // Text to speech

  const speakText = (text) => {

    const speech = new SpeechSynthesisUtterance(text)

    const voices = window.speechSynthesis.getVoices()

    const indianVoice = voices.find(
      (voice) =>
        voice.lang === "en-IN"
    )

    if (indianVoice) {
      speech.voice = indianVoice
    }

    speech.lang = "en-IN"

    speech.rate = 1

    speech.pitch = 1

    window.speechSynthesis.speak(speech)
  }

  // Speech recognition

  const startListening = () => {

    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition

    if (!SpeechRecognition) {

      alert("Speech Recognition not supported")

      return
    }

    const recognition = new SpeechRecognition()

    recognition.lang = "en-US"

    recognition.start()

    recognition.onresult = (event) => {

      const transcript =
        event.results[0][0].transcript

      setInput(transcript)
    }

    recognitionRef.current = recognition
  }

  const handleSend = async () => {

    if (!input.trim()) return

    let currentConversationId = conversationId

    try {

      // Create conversation ONLY on first message

      if (!currentConversationId) {

        const conversationResponse = await api.post(
          "/conversations",
          {
            title: input.slice(0, 30),
            user_id: 1
          }
        )

        currentConversationId =
          conversationResponse.data.conversation_id

        setConversationId(currentConversationId)

        localStorage.setItem(
          "activeConversationId",
          currentConversationId
        )

        fetchConversations()
      }

      const userMessage = {
        role: "user",
        content: input
      }

      setMessages((prev) => [
        ...prev,
        userMessage
      ])

      const currentInput = input

      setInput("")

      setLoading(true)

      const response = await api.post(
        "/chat-message",
        {
          conversation_id: currentConversationId,
          message: currentInput
        }
      )

      const aiMessage = {
        role: "assistant",
        content: response.data.response
      }

      speakText(response.data.response)

      setMessages((prev) => [
        ...prev,
        aiMessage
      ])

      fetchConversations()

    } catch (error) {

      console.log(error)
    }

    setLoading(false)
  }

  return (
    <div className="bg-black text-white h-screen flex">

      {/* Sidebar */}

      <div className="w-64 bg-zinc-900 p-4 overflow-y-auto">

        <button
          onClick={createConversation}
          className="w-full bg-white text-black p-3 rounded-lg mb-4"
        >
          + New Chat
        </button>

        <button
          onClick={() => {
            localStorage.removeItem("token")
            localStorage.removeItem(
              "activeConversationId"
            )
            window.location.href = "/login"
          }}
          className="w-full bg-red-500 text-white p-3 rounded-lg mb-4"
        >
          Logout
        </button>

        <div className="space-y-2">

          {conversations.map((conversation) => (

            <div
              key={conversation.id}
              onClick={() =>
                loadMessages(conversation.id)
              }
              className={`p-3 rounded-lg cursor-pointer hover:bg-zinc-700 ${
                conversationId == conversation.id
                  ? "bg-white text-black"
                  : "bg-zinc-800 text-white"
              }`}
            >
              {conversation.title}
            </div>

          ))}

        </div>

      </div>

      {/* Main Area */}

      <div className="flex-1 flex flex-col">

        {/* Header */}

        <div className="border-b border-zinc-800 p-4 text-xl">
          AI Voice Assistant
        </div>

        {/* Messages */}

        <div className="flex-1 overflow-y-auto p-6">

          {messages.map((message, index) => (

            <div
              key={index}
              className={`mb-4 flex ${
                message.role === "user"
                  ? "justify-end"
                  : "justify-start"
              }`}
            >

              <div
                className={`px-4 py-3 rounded-xl max-w-2xl whitespace-pre-wrap ${
                  message.role === "user"
                    ? "bg-white text-black"
                    : "bg-zinc-800 text-white"
                }`}
              >
                {message.content}
              </div>

            </div>

          ))}

          {loading && (

            <div className="flex justify-start">

              <div className="bg-zinc-800 px-4 py-3 rounded-xl">
                Thinking...
              </div>

            </div>

          )}

          <div ref={messagesEndRef}></div>

        </div>

        {/* Input */}

        <div className="p-4 border-t border-zinc-800 flex gap-3">

          <input
            type="text"
            placeholder="Send a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSend()
              }
            }}
            className="flex-1 bg-zinc-900 p-4 rounded-xl outline-none"
          />

          <button
            onClick={startListening}
            className="bg-zinc-700 px-6 rounded-xl"
          >
            🎤
          </button>

          <button
            onClick={handleSend}
            className="bg-white text-black px-6 rounded-xl"
          >
            Send
          </button>

        </div>

      </div>

    </div>
  )
}

export default Chat