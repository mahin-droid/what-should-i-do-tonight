import axios from 'axios'
import { API_URL } from '../utils/constants'

const api = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
})

// Entertainment
export const getEntertainmentTrending = () => api.get('/api/entertainment/trending')
export const searchEntertainment = (query) => api.get(`/api/entertainment/search?q=${query}`)
export const getEntertainmentByMood = (mood) => api.get(`/api/entertainment/recommendations?mood=${mood}`)

// Sports
export const getLiveSports = (sport) => api.get('/api/sports/live', { params: sport ? { sport } : {} })
export const getUpcomingSports = (sport) => api.get('/api/sports/upcoming', { params: sport ? { sport } : {} })
export const getSportsResults = (sport) => api.get('/api/sports/results', { params: sport ? { sport } : {} })
export const getAvailableSports = () => api.get('/api/sports/sports')

// Food
export const getNearbyFood = (params) => api.get('/api/food/nearby', { params })
export const getTrendingCuisines = (city) => api.get(`/api/food/trending?city=${city}`)

// Weather
export const getCurrentWeather = (city) => api.get(`/api/weather/current?city=${city}`)
export const getWeatherForecast = (city) => api.get(`/api/weather/forecast?city=${city}`)

// Travel
export const getTravelDeals = (params) => api.get('/api/travel/deals', { params })
export const getTravelSuggestions = (mood) => api.get(`/api/travel/suggestions?mood=${mood}`)

// Events
export const getNearbyEvents = (city) => api.get(`/api/events/nearby?city=${city}`)

// Chat
export const sendChatMessage = (data) => api.post('/api/chat', data)

// Analytics
export const getGenreTrends = () => api.get('/api/analytics/genre-trends')
export const getActivityHeatmap = () => api.get('/api/analytics/activity-heatmap')
export const getCuisineDistribution = (city) => api.get(`/api/analytics/cuisine-distribution?city=${city}`)
export const getPriceRating = () => api.get('/api/analytics/price-rating')
export const getCrossDomain = () => api.get('/api/analytics/cross-domain')
export const getSportsStats = () => api.get('/api/analytics/sports-stats')

// Recommendations
export const getRecommendations = (params) => api.get('/api/recommendations', { params })

export default api
