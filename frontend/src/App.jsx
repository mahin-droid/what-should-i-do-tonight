import { Routes, Route, useLocation } from 'react-router-dom'
import { useState, useEffect, lazy, Suspense } from 'react'
import { MoodProvider } from './context/MoodContext'
import { UserProvider } from './context/UserContext'
import { DataCacheProvider } from './context/DataCacheContext'
import { BookmarkProvider } from './context/BookmarkContext'
import { ToastProvider } from './components/shared/Toast'
import { ActivityProvider } from './context/ActivityContext'
import { NotificationProvider } from './context/NotificationContext'
import { RecentProvider } from './context/RecentContext'
import { FavoritesProvider } from './context/FavoritesContext'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import ErrorBoundary from './components/shared/ErrorBoundary'
import Onboarding from './components/shared/Onboarding'
import { getItem } from './services/storage'

const HomePage = lazy(() => import('./pages/HomePage'))
const ExplorePage = lazy(() => import('./pages/ExplorePage'))
const AnalyticsPage = lazy(() => import('./pages/AnalyticsPage'))
const ChatPage = lazy(() => import('./pages/ChatPage'))
const PlanPage = lazy(() => import('./pages/PlanPage'))
const BookmarksPage = lazy(() => import('./pages/BookmarksPage'))
const ProfilePage = lazy(() => import('./pages/ProfilePage'))
const SettingsPage = lazy(() => import('./pages/SettingsPage'))
const MyStatsPage = lazy(() => import('./pages/MyStatsPage'))
const PredictionsPage = lazy(() => import('./pages/PredictionsPage'))
const CompareCitiesPage = lazy(() => import('./pages/CompareCitiesPage'))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'))

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

export default function App() {
  const [showOnboarding, setShowOnboarding] = useState(() => !getItem('onboarding_done'))

  return (
    <UserProvider>
      <MoodProvider>
        <DataCacheProvider>
        <BookmarkProvider>
        <ActivityProvider>
        <NotificationProvider>
        <RecentProvider>
        <FavoritesProvider>
        <ToastProvider>
          <div className="min-h-screen bg-white dark:bg-bg-dark text-gray-800 dark:text-gray-200 transition-colors duration-300">
            <Navbar />
            <ScrollToTop />
            <main className="max-w-7xl mx-auto px-4 py-6 pb-24 md:pb-6">
              <ErrorBoundary>
                <Suspense fallback={<div className="flex items-center justify-center py-20"><div className="h-8 w-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" /></div>}>
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/explore" element={<ExplorePage />} />
                    <Route path="/analytics" element={<AnalyticsPage />} />
                    <Route path="/chat" element={<ChatPage />} />
                    <Route path="/plan" element={<PlanPage />} />
                    <Route path="/saved" element={<BookmarksPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/settings" element={<SettingsPage />} />
                    <Route path="/stats" element={<MyStatsPage />} />
                    <Route path="/predictions" element={<PredictionsPage />} />
                    <Route path="/compare" element={<CompareCitiesPage />} />
                    <Route path="*" element={<NotFoundPage />} />
                  </Routes>
                </Suspense>
              </ErrorBoundary>
            </main>
            <Footer />
            {showOnboarding && <Onboarding onComplete={() => setShowOnboarding(false)} />}
          </div>
        </ToastProvider>
        </FavoritesProvider>
        </RecentProvider>
        </NotificationProvider>
        </ActivityProvider>
        </BookmarkProvider>
        </DataCacheProvider>
      </MoodProvider>
    </UserProvider>
  )
}
