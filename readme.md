# Weather Monitoring System

## Project Description
A real-time weather monitoring system that tracks weather conditions across major Indian cities, providing current conditions, historical trends, and automated alerts.

## Architecture

### Backend (Python/FastAPI)
1. **Core Components:**
   - FastAPI web server
   - PostgreSQL database
   - OpenWeatherMap API integration
   - Real-time data processing

2. **Key Services:**
   - Weather Service: Fetches real-time weather data
   - Alert Service: Monitors and triggers weather alerts
   - Aggregation Service: Processes historical data and trends

### Frontend (Next.js/React)
1. **Main Features:**
   - Real-time weather dashboard
   - Interactive city selection
   - Temperature trend visualization
   - Alert management system
   - Backend connection monitoring

2. **UI Components:**
   - Current weather display
   - Temperature trend charts
   - Daily summaries
   - Alert notifications
   - Connection status indicator

## Key Features

1. **Real-time Weather Monitoring**
   - Current temperature, humidity, wind speed
   - Weather conditions and feels-like temperature
   - 5-minute automatic updates

2. **Historical Analysis**
   - Temperature trends over time
   - Daily weather summaries
   - Min/Max/Average temperature tracking

3. **Alert System**
   - Temperature threshold monitoring
   - Automatic alert generation
   - Alert management interface

4. **City Management**
   - Support for multiple Indian cities
   - Easy city switching
   - City-specific data tracking

## Technical Stack

### Backend
- FastAPI (Python web framework)
- PostgreSQL (Database)
- SQLAlchemy (ORM)
- Pydantic (Data validation)

### Frontend
- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Recharts (Data visualization)
- ShadcN UI Components

## Data Flow
1. Backend fetches data from OpenWeatherMap API
2. Data is processed and stored in PostgreSQL
3. Frontend requests data through REST APIs
4. UI updates in real-time with new data
5. Alerts are generated based on thresholds

## Key Endpoints

```plaintext
GET  /api/weather/current    - Current weather data
GET  /api/weather/summary    - Historical summaries
GET  /api/alerts            - Active weather alerts
POST /api/alerts/{id}/resolve - Resolve alerts
GET  /api/health            - System health check
```
## File Structure
weather-monitoring/
├── backend/
│   ├── __init__.py
│   ├── config.py                 # Configuration settings
│   ├── main.py                   # FastAPI application
│   ├── requirements.txt          # Python dependencies
│   ├── database/
│   │   ├── __init__.py
│   │   ├── database.py          # Database connection
│   │   └── models.py            # SQLAlchemy models
│   ├── services/
│   │   ├── __init__.py
│   │   ├── weather_service.py   # Weather data service
│   │   ├── alert_service.py     # Alert handling service
│   │   └── aggregation_service.py # Data aggregation service
│   └── utils/
│       ├── __init__.py
│       └── helpers.py           # Utility functions
│
├── frontend/
│   ├── .env.local               # Environment variables
│   ├── package.json             # Node dependencies
│   ├── tsconfig.json            # TypeScript configuration
│   ├── tailwind.config.js       # Tailwind CSS configuration
│   ├── next.config.js           # Next.js configuration
│   ├── public/
│   │   ├── favicon.ico
│   │   └── images/
│   └── src/
│       ├── app/
│       │   ├── dashboard/
│       │   │   └── page.tsx     # Dashboard page
│       │   ├── globals.css      # Global styles
│       │   ├── layout.tsx       # Root layout
│       │   └── page.tsx         # Root page with redirect
│       ├── components/
│       │   ├── ui/
│       │   │   ├── alert.tsx
│       │   │   ├── api-diagnostic.tsx
│       │   │   ├── button.tsx
│       │   │   ├── card.tsx
│       │   │   ├── connection-status.tsx
│       │   │   ├── error-message.tsx
│       │   │   ├── loading-spinner.tsx
│       │   │   └── select.tsx
│       │   ├── weather/
│       │   │   ├── current-weather.tsx
│       │   │   ├── temperature-trend.tsx
│       │   │   ├── daily-summary.tsx
│       │   │   ├── weather-alerts.tsx
│       │   │   └── city-selector.tsx
│       │   └── weather-dashboard.tsx
│       ├── hooks/
│       │   ├── use-weather.ts
│       │   └── use-connection-status.ts
│       ├── lib/
│       │   ├── utils.ts
│       │   └── constants.ts
│       ├── services/
│       │   └── api.ts
│       ├── styles/
│       │   └── globals.css
│       └── types/
│           ├── weather.ts
│           └── api.ts
│
├── .gitignore
└── README.md
```

Key configuration files:

1. Backend requirements:
```txt
# backend/requirements.txt
fastapi==0.109.0
uvicorn[standard]==0.27.0
sqlalchemy==2.0.25
psycopg2-binary==2.9.9
alembic==1.13.1
python-dotenv==1.0.0
pydantic==2.5.3
pydantic-settings==2.1.0
httpx==0.26.0
requests==2.31.0
python-dateutil==2.8.2
pytz==2024.1
numpy==1.26.3
pandas==2.1.4
aiohttp==3.9.1
```

2. Frontend dependencies:
```json
// frontend/package.json
{
  "dependencies": {
    "@radix-ui/react-alert-dialog": "^1.0.5",
    "@radix-ui/react-select": "^2.0.0",
    "@radix-ui/react-slot": "^1.0.2",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.1.0",
    "date-fns": "^3.3.1",
    "lucide-react": "^0.323.0",
    "next": "14.1.0",
    "react": "^18",
    "react-dom": "^18",
    "recharts": "^2.12.0",
    "tailwind-merge": "^2.2.1",
    "tailwindcss": "^3.3.0",
    "typescript": "^5"
  },
  "devDependencies": {
    "@types/node": "^20",
    "@types/react": "^18",
    "@types/react-dom": "^18",
    "@types/recharts": "^2.0.0",
    "autoprefixer": "^10.0.1",
    "postcss": "^8",
    "typescript": "^5"
  }
}
```

3. Environment variables:
```env
# frontend/.env.local
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_UPDATE_INTERVAL=300000

# backend/.env
DATABASE_URL=postgresql://username:password@localhost:5432/weather_db
OPENWEATHER_API_KEY=your_api_key_here
```

4. TypeScript configuration:
```json
// frontend/tsconfig.json
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

To run the project:

1. Backend:
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

2. Frontend:
```bash
cd frontend
npm install
npm run dev
```
