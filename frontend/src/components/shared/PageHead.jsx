import { useEffect } from 'react'

export default function PageHead({ title, description }) {
  useEffect(() => {
    document.title = title ? `${title} | What Should I Do Tonight?` : 'What Should I Do Tonight?'
    const meta = document.querySelector('meta[name="description"]')
    if (meta && description) {
      meta.setAttribute('content', description)
    } else if (description) {
      const newMeta = document.createElement('meta')
      newMeta.name = 'description'
      newMeta.content = description
      document.head.appendChild(newMeta)
    }
  }, [title, description])
  return null
}
