# ResQAI

AI-powered climate resilience platform for weather risk monitoring, smart agricultural advice, resource management, and emergency relief coordination. ResQAI turns climate and resource information into practical guidance for communities. The app runs in demo mode without external credentials and clearly labels simulated information.

## Requirements

- Node.js 18 or newer
- npm
- Optional: MongoDB, an OpenWeather API key, and a Gemini API key

## Setup

1. Copy `.env.example` to `.env` in the project root.
2. Run `npm install`.
3. Run `npm run dev` and open `http://localhost:5173`.

The Vite development server proxies `/api` requests to the Express API on port 4000. To run a production build, use `npm run build`, then set `NODE_ENV=production` and run `npm start`.

## Environment variables

- `PORT`: Express port (default `4000`)
- `MONGODB_URI`: MongoDB connection string; accounts and submitted requests are persisted when the database is available
- `JWT_SECRET`: secret for signed authentication tokens
- `OPENWEATHER_API_KEY`: enables live current weather and forecast data
- `GEMINI_API_KEY`: enables Gemini responses for the assistant and farming/resource advice
- `CLIENT_ORIGIN`: allowed browser origin for the API (default `http://localhost:5173`)

## Demo mode

Without a connected MongoDB, weather or resource data is served as demo data. The emergency list starts with sample community requests; newly submitted requests are kept in the running API process memory. AI features fall back to clearly labeled practical guidance when Gemini is unavailable. A demo-only resource submission is acknowledged but not persisted.

## MVP coverage

- Responsive landing page, dashboard, navigation, and profile preferences
- Climate conditions, location search, browser geolocation, risk estimate, and precautions
- Crop-specific advice form with English and Malayalam output selection
- Resource dashboard, chart, conservation recommendations, and manual reading form
- Community emergency form, filters, request list, and Leaflet/OpenStreetMap map
- English text assistant with safety-aware demo answers
- Optional MongoDB authentication with bcrypt and JWT, OpenWeather, and Gemini integrations

## Limitations

- Risk is a simple weather-based estimate and is not an official warning or flood prediction.
- Demo resources, weather, and sample request locations are simulated; no shelters, services, or supply availability are asserted as verified.
- Without MongoDB, demo emergency submissions exist only in API process memory. Real-time responder workflow and status management require an authenticated responder/admin account.
- Map tiles require an internet connection; sample coordinates are illustrative and not verified relief sites.
- AI guidance is informational. Confirm urgent, agricultural, and emergency decisions with appropriate local authorities or specialists.
