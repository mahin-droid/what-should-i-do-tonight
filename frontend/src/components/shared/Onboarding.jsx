import { useState } from 'react'
import { useUser } from '../../context/UserContext'
import { setItem } from '../../services/storage'

const GENRES = ['Action', 'Comedy', 'Romance', 'Thriller', 'Sci-Fi', 'Drama', 'Horror', 'Documentary']
const CUISINES = ['Gujarati', 'Street Food', 'Biryani', 'Chinese', 'Italian', 'Cafe', 'BBQ', 'South Indian']
const SPORTS_LIST = ['Cricket', 'Football', 'Basketball', 'Tennis', 'Badminton', 'Hockey']

export default function Onboarding({ onComplete }) {
  const [step, setStep] = useState(0)
  const [selectedGenres, setSelectedGenres] = useState([])
  const [selectedCuisines, setSelectedCuisines] = useState([])
  const [selectedSports, setSelectedSports] = useState([])
  const { updateUser } = useUser()

  const toggle = (list, setList, item) => {
    setList(prev => prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item])
  }

  const finish = () => {
    updateUser({
      preferences: { genres: selectedGenres, cuisines: selectedCuisines, sports: selectedSports, budget: 'medium' },
    })
    setItem('onboarding_done', true)
    onComplete()
  }

  const steps = [
    {
      title: 'What do you like to watch? 🎬',
      items: GENRES,
      selected: selectedGenres,
      toggle: (item) => toggle(selectedGenres, setSelectedGenres, item),
    },
    {
      title: 'Favourite cuisines? 🍽️',
      items: CUISINES,
      selected: selectedCuisines,
      toggle: (item) => toggle(selectedCuisines, setSelectedCuisines, item),
    },
    {
      title: 'Sports you follow? 🏏',
      items: SPORTS_LIST,
      selected: selectedSports,
      toggle: (item) => toggle(selectedSports, setSelectedSports, item),
    },
  ]

  const current = steps[step]

  return (
    <div className="fixed inset-0 z-[300] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-bg-dark rounded-2xl max-w-md w-full p-6 border border-gray-200 dark:border-white/10">
        {/* Progress */}
        <div className="flex gap-2 mb-6">
          {steps.map((_, i) => (
            <div key={i} className={`h-1 flex-1 rounded-full ${i <= step ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-700'}`} />
          ))}
        </div>

        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{current.title}</h2>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">Pick as many as you like</p>

        <div className="flex flex-wrap gap-2 mb-6">
          {current.items.map(item => (
            <button
              key={item}
              onClick={() => current.toggle(item)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                current.selected.includes(item)
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/10'
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        <div className="flex justify-between">
          {step > 0 ? (
            <button onClick={() => setStep(step - 1)} className="px-4 py-2 text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white transition">Back</button>
          ) : (
            <button onClick={() => { setItem('onboarding_done', true); onComplete() }} className="px-4 py-2 text-sm text-gray-400 hover:text-gray-600 transition">Skip</button>
          )}
          <button
            onClick={() => step < 2 ? setStep(step + 1) : finish()}
            className="px-6 py-2 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary/80 transition"
          >
            {step < 2 ? 'Next →' : 'Get Started 🚀'}
          </button>
        </div>
      </div>
    </div>
  )
}
