import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMood } from '../context/MoodContext'
import { useUser } from '../context/UserContext'
import { useToast } from '../components/shared/Toast'
import { getRecommendations } from '../services/api'
import LoadingSpinner from '../components/shared/LoadingSpinner'
import PageHead from '../components/shared/PageHead'
import Confetti from '../components/shared/Confetti'

const STEPS = [
  { id: 'mood', title: 'How are you feeling?', subtitle: 'Pick your vibe for tonight' },
  { id: 'budget', title: "What's your budget?", subtitle: 'How much do you want to spend?' },
  { id: 'time', title: 'What time works?', subtitle: 'When do you want to head out?' },
  { id: 'result', title: 'Your Perfect Evening', subtitle: 'Here\'s what we recommend' },
]

const MOODS = [
  { id: 'chill', emoji: '😌', label: 'Chill' },
  { id: 'excited', emoji: '🤩', label: 'Excited' },
  { id: 'bored', emoji: '😴', label: 'Bored' },
  { id: 'social', emoji: '🎉', label: 'Social' },
  { id: 'romantic', emoji: '💕', label: 'Romantic' },
  { id: 'hungry', emoji: '🍕', label: 'Hungry' },
]

const BUDGETS = [
  { id: 'low', label: 'Budget Friendly', range: 'Under ₹500', emoji: '💰' },
  { id: 'medium', label: 'Mid Range', range: '₹500 - ₹2,000', emoji: '💳' },
  { id: 'high', label: 'Premium', range: '₹2,000+', emoji: '💎' },
]

const TIMES = [
  { id: 'afternoon', label: 'Afternoon', range: '12 PM - 5 PM', emoji: '☀️' },
  { id: 'evening', label: 'Evening', range: '5 PM - 9 PM', emoji: '🌆' },
  { id: 'night', label: 'Night', range: '9 PM+', emoji: '🌙' },
]

const CATEGORY_ICONS = { entertainment: '🎬', food: '🍽️', sports: '🏏', travel: '✈️', events: '🎭', music: '🎵' }

export default function PlanPage() {
  const [step, setStep] = useState(0)
  const [selectedMood, setSelectedMood] = useState(null)
  const [groupMode, setGroupMode] = useState(false)
  const [groupMoods, setGroupMoods] = useState([])
  const [selectedBudget, setSelectedBudget] = useState(null)
  const [selectedTime, setSelectedTime] = useState(null)
  const [plan, setPlan] = useState(null)
  const [loading, setLoading] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const { setMood } = useMood()
  const { user } = useUser()
  const navigate = useNavigate()

  const handleNext = async () => {
    if (step < 2) {
      setStep(step + 1)
    } else {
      // Generate plan
      setStep(3)
      setLoading(true)
      setMood(selectedMood)
      try {
        const res = await getRecommendations({
          mood: groupMode ? groupMoods[Math.floor(Math.random() * groupMoods.length)] : selectedMood,
          budget: selectedBudget,
          time: selectedTime,
          city: user.city,
        })
        setPlan(res.data.data)
        setShowConfetti(true)
      } catch {
        setPlan(null)
      } finally {
        setLoading(false)
      }
    }
  }

  const handleShare = () => {
    const text = plan ? `${plan.plan_title}\n\n${plan.steps.map(s => `${s.step}. ${s.title}\n   ${s.description}`).join('\n\n')}\n\nPlanned with "What Should I Do Tonight?"` : ''

    if (navigator.share) {
      navigator.share({ title: plan.plan_title, text }).catch(() => {})
    } else {
      const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`
      window.open(whatsappUrl, '_blank')
    }
  }

  const canProceed = (step === 0 && (selectedMood || groupMoods.length > 0)) || (step === 1 && selectedBudget) || (step === 2 && selectedTime)

  return (
    <div className="max-w-2xl mx-auto">
      <Confetti active={showConfetti} />
      <PageHead title="Plan My Evening" description="Step-by-step evening planner" />

      {/* Progress bar */}
      <div className="flex gap-2 mb-8">
        {STEPS.map((s, i) => (
          <div key={s.id} className={`h-1.5 flex-1 rounded-full transition-all ${i <= step ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-700'}`} />
        ))}
      </div>

      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{STEPS[step].title}</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">{STEPS[step].subtitle}</p>

      {/* Step 1: Mood */}
      {step === 0 && (
        <>
        <div className="flex items-center justify-end mb-3">
          <button
            onClick={() => { setGroupMode(!groupMode); setGroupMoods([]); setSelectedMood(null) }}
            className={`text-xs px-3 py-1.5 rounded-full transition ${groupMode ? 'bg-accent text-white' : 'bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400'}`}
          >
            {groupMode ? 'Group Mode ON' : 'Solo Mode'}
          </button>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {MOODS.map(m => (
            <button
              key={m.id}
              onClick={() => {
                if (groupMode) {
                  setGroupMoods(prev => prev.includes(m.id) ? prev.filter(x => x !== m.id) : [...prev, m.id])
                } else {
                  setSelectedMood(m.id)
                }
              }}
              className={`flex flex-col items-center gap-2 p-5 rounded-2xl border-2 transition-all ${
                (groupMode ? groupMoods.includes(m.id) : selectedMood === m.id)
                  ? 'border-primary bg-primary/10 scale-105'
                  : 'border-gray-200 dark:border-white/10 bg-white dark:bg-surface-dark hover:border-primary/50'
              }`}
            >
              <span className="text-4xl">{m.emoji}</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">{m.label}</span>
            </button>
          ))}
        </div>
        </>
      )}

      {/* Step 2: Budget */}
      {step === 1 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {BUDGETS.map(b => (
            <button
              key={b.id}
              onClick={() => setSelectedBudget(b.id)}
              className={`flex flex-col items-center gap-2 p-6 rounded-2xl border-2 transition-all ${
                selectedBudget === b.id
                  ? 'border-primary bg-primary/10 scale-105'
                  : 'border-gray-200 dark:border-white/10 bg-white dark:bg-surface-dark hover:border-primary/50'
              }`}
            >
              <span className="text-3xl">{b.emoji}</span>
              <span className="text-sm font-semibold text-gray-900 dark:text-white">{b.label}</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">{b.range}</span>
            </button>
          ))}
        </div>
      )}

      {/* Step 3: Time */}
      {step === 2 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {TIMES.map(t => (
            <button
              key={t.id}
              onClick={() => setSelectedTime(t.id)}
              className={`flex flex-col items-center gap-2 p-6 rounded-2xl border-2 transition-all ${
                selectedTime === t.id
                  ? 'border-primary bg-primary/10 scale-105'
                  : 'border-gray-200 dark:border-white/10 bg-white dark:bg-surface-dark hover:border-primary/50'
              }`}
            >
              <span className="text-3xl">{t.emoji}</span>
              <span className="text-sm font-semibold text-gray-900 dark:text-white">{t.label}</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">{t.range}</span>
            </button>
          ))}
        </div>
      )}

      {/* Step 4: Results */}
      {step === 3 && (
        loading ? <LoadingSpinner text="Creating your perfect evening plan..." /> :
        plan ? (
          <div className="bg-gradient-to-br from-primary/10 to-accent/5 border border-primary/20 rounded-2xl p-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-1">{plan.plan_title}</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">{plan.confidence}% confidence · {plan.time_of_day} · {plan.day_type}</p>
            <div className="space-y-4">
              {plan.steps.map((s, i) => (
                <div key={i} className="flex gap-3 items-start">
                  <div className="w-10 h-10 rounded-xl bg-white dark:bg-surface-dark flex items-center justify-center text-lg flex-shrink-0 border border-gray-200 dark:border-white/10">
                    {CATEGORY_ICONS[s.category] || '📌'}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{s.title}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{s.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-500 dark:text-gray-400 py-8">Couldn't generate a plan. Try again!</p>
        )
      )}

      {/* Navigation buttons */}
      <div className="flex justify-between mt-8">
        {step > 0 && step < 3 && (
          <button onClick={() => setStep(step - 1)} className="px-6 py-2.5 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 transition">
            Back
          </button>
        )}
        {step < 3 && (
          <button
            onClick={handleNext}
            disabled={!canProceed}
            className="ml-auto px-6 py-2.5 rounded-xl text-sm font-medium bg-primary text-white hover:bg-primary/80 transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {step === 2 ? 'Generate Plan ✨' : 'Next →'}
          </button>
        )}
        {step === 3 && (
          <div className="flex gap-3 mx-auto">
            <button onClick={() => { setStep(0); setPlan(null) }} className="px-6 py-2.5 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-white/5 transition">
              Start Over
            </button>
            <button onClick={() => navigate('/')} className="px-6 py-2.5 rounded-xl text-sm font-medium bg-primary text-white hover:bg-primary/80 transition">
              Go Home
            </button>
            <button onClick={handleShare} className="px-6 py-2.5 rounded-xl text-sm font-medium bg-success text-white hover:bg-success/80 transition">
              Share 📤
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
