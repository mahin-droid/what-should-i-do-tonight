import PageHead from '../components/shared/PageHead'
import { getGreeting, getTimeEmoji, getTimeSuggestion } from '../utils/helpers'
import WeatherBackground from '../components/home/WeatherBackground'
import WeatherWidget from '../components/home/WeatherWidget'
import MoodSelector from '../components/home/MoodSelector'
import AIRecommendation from '../components/home/AIRecommendation'
import LiveSportsWidget from '../components/home/LiveSportsWidget'
import ActivityChart from '../components/home/ActivityChart'
import TrendingSection from '../components/home/TrendingSection'
import SurpriseMe from '../components/home/SurpriseMe'
import TrendingTicker from '../components/home/TrendingTicker'
import RecentlyViewed from '../components/home/RecentlyViewed'
import FavoritesBar from '../components/home/FavoritesBar'
import RefreshButton from '../components/shared/RefreshButton'

export default function HomePage() {
  return (
    <div className="space-y-6">
      <WeatherBackground />
      <PageHead title="Home" description="AI-powered recommendations for your evening" />
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{getGreeting()} {getTimeEmoji()}</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{getTimeSuggestion()}</p>
        </div>
        <RefreshButton onRefresh={() => window.location.reload()} />
      </div>

      <TrendingTicker />

      <RecentlyViewed />
      <FavoritesBar />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <MoodSelector />
          <SurpriseMe />
          <AIRecommendation />
          <TrendingSection />
        </div>
        <div className="space-y-4">
          <WeatherWidget />
          <LiveSportsWidget />
          <ActivityChart />
        </div>
      </div>
    </div>
  )
}
