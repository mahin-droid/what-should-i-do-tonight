import { Share2, MessageCircle } from 'lucide-react'

export default function ShareCard({ title, description, category }) {
  const text = `${title}\n${description}\n\n— What Should I Do Tonight?`

  const shareNative = () => {
    if (navigator.share) {
      navigator.share({ title, text }).catch(() => {})
    }
  }

  const shareWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank')
  }

  const shareTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank')
  }

  return (
    <div className="flex items-center gap-1">
      {navigator.share && (
        <button onClick={shareNative} className="p-1.5 rounded-lg text-gray-400 hover:text-primary hover:bg-primary/5 transition" title="Share">
          <Share2 size={14} />
        </button>
      )}
      <button onClick={shareWhatsApp} className="p-1.5 rounded-lg text-gray-400 hover:text-success hover:bg-success/5 transition" title="WhatsApp">
        <MessageCircle size={14} />
      </button>
    </div>
  )
}
