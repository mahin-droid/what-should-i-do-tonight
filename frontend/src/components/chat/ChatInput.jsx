import { useState } from 'react'
import { Send, Mic, MicOff } from 'lucide-react'

export default function ChatInput({ onSend, disabled }) {
  const [text, setText] = useState('')
  const [listening, setListening] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!text.trim() || disabled) return
    onSend(text.trim())
    setText('')
  }

  const handleVoice = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) return
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    const recognition = new SR()
    recognition.lang = 'en-IN'
    recognition.continuous = false
    recognition.interimResults = false
    recognition.onstart = () => setListening(true)
    recognition.onend = () => setListening(false)
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript
      setText(transcript)
    }
    recognition.start()
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2 p-4 border-t border-gray-200 dark:border-white/5">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Ask me anything about tonight..."
        disabled={disabled}
        className="flex-1 bg-gray-50 dark:bg-surface-dark border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 transition"
      />
      <button
        type="button"
        onClick={handleVoice}
        className={`p-3 rounded-xl transition ${listening ? 'bg-danger text-white animate-pulse' : 'text-gray-400 hover:text-primary hover:bg-primary/5'}`}
      >
        {listening ? <MicOff size={18} /> : <Mic size={18} />}
      </button>
      <button
        type="submit"
        disabled={!text.trim() || disabled}
        className="p-3 bg-primary text-white rounded-xl hover:bg-primary/80 transition disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <Send size={18} />
      </button>
    </form>
  )
}
