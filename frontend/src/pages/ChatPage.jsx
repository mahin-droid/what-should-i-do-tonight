import PageHead from '../components/shared/PageHead'
import ChatWindow from '../components/chat/ChatWindow'
import ChatInput from '../components/chat/ChatInput'
import QuickPrompts from '../components/chat/QuickPrompts'
import { Trash2 } from 'lucide-react'
import { useChat } from '../hooks/useChat'
import { useMood } from '../context/MoodContext'

export default function ChatPage() {
  const { messages, loading, send, clearMessages } = useChat()
  const { mood, setMood } = useMood()

  const handleSend = async (text) => {
    const result = await send(text, mood)
    if (result?.mood_detected && !mood) {
      setMood(result.mood_detected)
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] md:h-[calc(100vh-5rem)]">
      <PageHead title="Chat" description="Chat with AI for personalized recommendations" />
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-white/5">
        <div>
          <h1 className="text-lg font-bold text-gray-900 dark:text-white">AI Assistant</h1>
          <p className="text-xs text-gray-500 dark:text-gray-400">Your personal recommendation engine</p>
        </div>
        {messages.length > 0 && (
          <button onClick={clearMessages} className="p-2 rounded-lg text-gray-400 hover:text-danger hover:bg-danger/5 transition" title="Clear chat">
            <Trash2 size={16} />
          </button>
        )}
      </div>

      <QuickPrompts onSelect={handleSend} />
      <ChatWindow messages={messages} loading={loading} />
      <ChatInput onSend={handleSend} disabled={loading} />
    </div>
  )
}
