import {
  useEffect,
  useRef,
  useState
} from "react"

import {
  deleteConversation
} from "../services/api"

import { useNavigate } from "react-router-dom"
import api from "../services/api"

const user = {
  username: localStorage.getItem("username") || "User"
}

function Chat() {

  const navigate = useNavigate()

  const [messages, setMessages] = useState([])

  const [input, setInput] = useState("")

  const [loading, setLoading] = useState(false)

  const [conversationId, setConversationId] = useState(null)

  const [sidebarOpen, setSidebarOpen] = useState(true)

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

  const handleDeleteConversation =
  async (conversationId) => {

    try {

      await deleteConversation(
        conversationId
      )

      const updated =
        conversations.filter(
          (conversation) =>
            conversation.id !==
            conversationId
        )

      setConversations(updated)

      if (
        Number(
          localStorage.getItem(
            "activeConversationId"
          )
        ) === conversationId
      ) {

        setMessages([])

        setConversationId(null)

        localStorage.removeItem(
          "activeConversationId"
        )

      }

    } catch (error) {

      console.log(error)

    }

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

  <div className="bg-black text-white h-screen flex overflow-hidden">

    {/* SIDEBAR */}

    <div
      className={`
        bg-[#111111]
        border-r
        border-zinc-800
        flex
        flex-col
        transition-all
        duration-300
        ${sidebarOpen ? "w-[250px]" : "w-[70px]"}
      `}
    >

      {/* TOP */}

      <div className="p-3 flex items-center justify-between border-b border-zinc-800">

        {sidebarOpen && (

          <button
            onClick={createConversation}
            className="bg-white text-black text-sm px-4 py-2 rounded-lg hover:bg-gray-200 transition w-full"
          >
            + New Chat
          </button>

        )}

        <button
          onClick={() =>
            setSidebarOpen(!sidebarOpen)
          }
          className="text-xl text-gray-400 hover:text-white ml-2"
        >
          ☰
        </button>

      </div>

      {/* CONVERSATIONS */}

      <div className="flex-1 overflow-y-auto p-2 space-y-2">

        {conversations.map((conversation) => (

  <div
    key={conversation.id}
    className="
      group
      flex
      items-center
      justify-between
      px-3
      py-2
      rounded-lg
      hover:bg-[#1f1f1f]
      transition
    "
  >

    <div
      onClick={() =>
        loadMessages(conversation.id)
      }
      className={`
        flex-1
        cursor-pointer
        text-sm
        truncate
        ${
          conversationId ==
          conversation.id
            ? "text-white"
            : "text-gray-300"
        }
      `}
    >

      {
        sidebarOpen
          ? conversation.title
          : "💬"
      }

    </div>

    {sidebarOpen && (

      <button
        onClick={() =>
          handleDeleteConversation(
            conversation.id
          )
        }
        className="
          opacity-0
          group-hover:opacity-100
          transition
          text-gray-500
          hover:text-red-500
          text-sm
          ml-2
        "
      >
        ✕
      </button>

    )}

  </div>

))}

      </div>

      {/* USER */}

      <div className="border-t border-zinc-800 p-3">

        <div className="flex items-center justify-between">

          <div className="flex items-center gap-2">

            <div className="w-9 h-9 rounded-full bg-white text-black flex items-center justify-center text-sm font-semibold">

              {
                user.username
                  .charAt(0)
                  .toUpperCase()
              }

            </div>

            {sidebarOpen && (

              <div>

                <p className="text-sm font-medium">
                  {user.username}
                </p>

                <p className="text-xs text-gray-500">
                  Online
                </p>

              </div>

            )}

          </div>

          {sidebarOpen && (

            <button
              onClick={() => {

                localStorage.removeItem("token")

                localStorage.removeItem(
                  "activeConversationId"
                )

                navigate("/login")
              }}
              className="text-xs text-red-400 hover:text-red-500"
            >
              Logout
            </button>

          )}

        </div>

      </div>

    </div>

    {/* MAIN */}

    <div className="flex-1 flex flex-col">

      {/* HEADER */}

      <div className="h-[55px] border-b border-zinc-800 flex items-center justify-center">

        <h1 className="text-sm tracking-wide font-semibold">

          AI VOICE ASSISTANT

        </h1>

      </div>

      {/* CHAT */}

      <div className="flex-1 overflow-y-auto px-6 py-5">

        <div className="max-w-4xl mx-auto">

          {

            messages.length === 0 && (

              <div className="h-full flex flex-col items-center justify-center text-center mt-40">

                <h2 className="text-3xl font-semibold mb-2">
                  How can I help you?
                </h2>

                <p className="text-gray-500 text-sm">
                  Start chatting with your AI assistant
                </p>

              </div>

            )

          }

          {

            messages.map((message, index) => (

              <div
                key={index}
                className={`flex mb-5 ${
                  message.role === "user"
                    ? "justify-end"
                    : "justify-start"
                }`}
              >

                <div
                  className={`
                    max-w-[75%]
                    px-4
                    py-3
                    rounded-2xl
                    text-sm
                    leading-relaxed
                    whitespace-pre-wrap
                    ${
                      message.role === "user"
                        ? "bg-white text-black"
                        : "bg-[#1a1a1a] text-white"
                    }
                  `}
                >

                  {message.content}

                </div>

              </div>

            ))

          }

          {

            loading && (

              <div className="flex justify-start">

                <div className="bg-[#1a1a1a] px-4 py-3 rounded-2xl text-sm">

                  Thinking...

                </div>

              </div>

            )

          }

          <div ref={messagesEndRef}></div>

        </div>

      </div>

      {/* INPUT */}

      <div className="border-t border-zinc-800 p-4">

        <div className="max-w-4xl mx-auto flex items-center gap-2">

          <input
            type="text"
            placeholder="Send a message..."
            value={input}
            onChange={(e) =>
              setInput(e.target.value)
            }
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSend()
              }
            }}
            className="
              flex-1
              bg-[#1a1a1a]
              border
              border-zinc-800
              rounded-xl
              px-4
              py-3
              text-sm
              outline-none
            "
          />

          <button
            onClick={startListening}
            className="
              bg-[#1a1a1a]
              hover:bg-[#222]
              transition
              px-4
              py-3
              rounded-xl
              text-sm
            "
          >
            🎤
          </button>

          <button
            onClick={handleSend}
            className="
              bg-white
              text-black
              hover:bg-gray-200
              transition
              px-5
              py-3
              rounded-xl
              text-sm
              font-medium
            "
          >
            Send
          </button>

        </div>

      </div>

    </div>

  </div>
)
  }

export default Chat