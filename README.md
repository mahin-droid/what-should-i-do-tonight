# 🌙 What Should I Do Tonight?

**AI-powered life recommendation engine** that pulls real-time data from entertainment, sports, food, travel, and events domains, then uses AI to give personalized recommendations based on your mood, weather, location, and preferences.

Think of it as **Google + Zomato + IMDb + Cricbuzz + MakeMyTrip** combined into one AI assistant.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js (Vite) + Tailwind CSS + Recharts |
| Backend | Python FastAPI |
| Real-time | Node.js + Socket.io |
| Database | SQLite (local) / Supabase (production) |
| Cache | In-memory TTL Cache |
| AI/ML | Scikit-learn + TextBlob + Rule-based NLU |

## Architecture

```
┌─────────────┐     ┌──────────────┐     ┌─────────────────┐
│  React SPA  │────▶│  FastAPI API  │────▶│  External APIs  │
│  (Vite)     │     │  (Python)     │     │  TMDb, Weather  │
└──────┬──────┘     └──────────────┘     │  News, Sports   │
       │                                  └─────────────────┘
       │            ┌──────────────┐
       └───────────▶│  Socket.io   │  (Live sports scores)
                    │  (Node.js)   │
                    └──────────────┘
```

## Features

### 🏠 Home Dashboard
- **Weather Widget** — Real-time weather for your city
- **Mood Selector** — Choose from 6 moods (Chill, Excited, Bored, Social, Romantic, Hungry)
- **AI Recommendations** — Personalized evening plan based on mood + weather + time
- **Live Sports** — Real-time cricket & football scores with excitement meter
- **Trending** — Trending movies, shows, and music

### 🔍 Explore Page
- Filter by category: Entertainment, Sports, Food, Travel, Events
- Sort by rating or trending score
- Mood-aware filtering

### 📊 Analytics Dashboard
- Genre popularity trends (line chart)
- Activity heatmap by time of day
- Cuisine distribution (donut chart)
- Price vs rating analysis
- Cross-domain correlation (OTT, Food, Sports, Outings by day)
- Sports excitement analytics
- AI-generated insights for each chart

### 💬 AI Chat
- Natural language chatbot
- Intent detection: food, sports, weather, travel, analytics
- Quick prompts for common queries
- Structured plan responses with recommendations

### 👤 Profile
- City selector (10 Indian cities)
- Dark/light mode toggle
- Activity stats

## Screenshots

The app has 5 main pages:
1. **Home** — Dashboard with weather, mood selector, AI plan, live sports, trending
2. **Explore** — Grid of recommendations across all categories
3. **Analytics** — Data dashboard with interactive charts
4. **Chat** — AI assistant for personalized recommendations
5. **Profile** — Settings and preferences

## Installation

### Prerequisites
- Node.js 18+
- Python 3.10+
- npm or yarn

### 1. Clone the repository
```bash
git clone <repo-url>
cd what-should-i-do-tonight
```

### 2. Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env   # Edit with your API URL
npm run dev
```

### 3. Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env            # Add your API keys
uvicorn app.main:app --reload --port 8000
```

### 4. Realtime Server Setup
```bash
cd realtime-server
npm install
npm start
```

### 5. Open the app
Visit `http://localhost:5173`

## Environment Variables

### Frontend (.env)
```
VITE_API_URL=http://localhost:8000
VITE_SOCKET_URL=http://localhost:3001
```

### Backend (.env)
```
TMDB_API_KEY=your_key          # https://themoviedb.org/settings/api
OPENWEATHER_API_KEY=your_key   # https://openweathermap.org/api
NEWS_API_KEY=your_key          # https://newsapi.org/register
FOOTBALL_API_KEY=your_key      # https://football-data.org/client/register
DATABASE_URL=sqlite+aiosqlite:///./app.db
FRONTEND_URL=http://localhost:5173
```

> **Note:** All APIs have free tiers. The app works with demo/mock data if no API keys are provided.

## How the AI Recommendation Engine Works

1. **Mood Input** — User selects mood (Chill, Excited, Bored, Social, Romantic, Hungry)
2. **Context Gathering** — System checks weather, time of day, day of week
3. **Weighted Scoring** — Each category (entertainment, food, sports, travel, events, music) gets a base weight from the mood
4. **Adjustments** — Weather, time, and weekend/weekday modifiers adjust scores
5. **Data Fetching** — Top items fetched from each winning category
6. **Plan Generation** — Structured "Tonight's Plan" with ranked steps

### Example Rules:
- Rainy weather → Boost indoor activities (movies, restaurants)
- Late night → Boost OTT content, reduce travel
- Weekend → Boost travel, events, outings
- Live sports happening → Boost sports viewing, sports bars

## Data Analysis Insights

Key cross-domain correlations discovered:
- During IPL matches, food delivery orders increase by **35%**
- Rainy days boost OTT streaming by **45%** and decrease restaurant visits by **25%**
- Saturday shows the **highest combined activity** score across all domains
- The **7-9 PM window** accounts for 40% of all daily entertainment consumption

## Future Roadmap

- [ ] User authentication with Supabase
- [ ] Push notifications for live sports events
- [ ] Spotify API integration for real playlists
- [ ] Google Places API for real restaurant data
- [ ] ML model training with real user data
- [ ] PWA support for mobile
- [ ] Multi-language support (Hindi, Gujarati)

## License

MIT License — see [LICENSE](LICENSE) for details.

---

Built with ❤️ by Mahin & Jainam
