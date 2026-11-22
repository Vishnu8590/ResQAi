# ResQAI — Climate & Resource Resilience AI

[![Node.js Version](https://img.shields.io/badge/Node.js-18%2B-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![React Version](https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Express](https://img.shields.io/badge/Express-4.21-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose%208-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Gemini AI](https://img.shields.io/badge/Google%20Gemini-Generative%20AI-8E75B2?logo=google&logoColor=white)](https://aistudio.google.com/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

> **ResQAI** is an AI-powered climate resilience web platform designed to empower vulnerable communities, farmers, local volunteers, and disaster responders. By combining real-time meteorological telemetry, localized agricultural intelligence, shared resource tracking, and geospatial emergency dispatch, ResQAI transforms raw environmental data into simple, life-saving actions.

---

## 🌟 Key Features

### ⛅ Module 1: ClimateWatch (Hazard & Risk Monitoring)
- **Live Environmental Conditions**: Real-time monitoring of temperature, relative humidity, wind speed, and precipitation.
- **Dynamic 4-Tier Risk Engine**: Heuristic algorithm that evaluates weather factors to calculate an estimated risk score (`0–100`) mapped to **Low**, **Moderate**, **High**, or **Critical** risk levels.
- **5-Day Local Outlook**: Multi-day weather forecasts to plan ahead.
- **Geospatial & Search**: Search by city, town, or district, or utilize native one-click browser geolocation (`navigator.geolocation`).

### 🌾 Module 2: AgriAI (Smart Farming Advisory)
- **Context-Aware Crop Guidance**: Tailored recommendations for crops (Paddy, Coconut, Rubber, Banana, Pepper, Vegetables, Tapioca, and more).
- **Weather-Grounded Protection**: Evaluates local precipitation and temperature to provide timing on drainage clearance, waterlogging prevention, and fertilizer application.
- **Bilingual Accessibility**: Native support for **Malayalam (`മലയാളം`)** and **English**, ensuring critical farming guidance is accessible to local grassroots farmers.

### 💧 Module 3: ResourceGuard (Resource & Utility Tracking)
- **Vital Utilities Overview**: Tracks community water availability (%), electricity grid stability (%), solar generation (kWh), and energy demand.
- **Interactive Availability Trends**: Recharts-powered area visualization tracking multi-day resource fluctuations.
- **AI Conservation Insights**: Automated, rule-based and AI-driven conservation guidance triggered during resource deficits.
- **Crowdsourced Reading Submissions**: Allows local operators to input manual readings to keep communities informed.

### 🆘 Module 4: ReliefRoute (Emergency Coordination & Dispatch)
- **Community Assistance Reporting**: Report urgent needs across categories: *Food, Drinking Water, Medicine, Shelter, Clothing, Rescue Assistance, and Other*.
- **Priority Triage**: Categorize requests by urgency (*Low, Medium, High, Critical*) with lifecycle tracking (*Open, In Progress, Resolved*).
- **Interactive OpenStreetMap / Leaflet**: Pinpoints community requests on an interactive map with popups detailing requester needs and location landmarks.
- **Role-Based Permissions**: Status updates are secured and restricted to verified `responder` and `admin` roles.

### 🤖 Module 5: ResQ Assistant (Safety-First Chatbot)
- **Weather-Grounded AI**: Answers climate safety, farming, and preparedness questions grounded with current local weather data.
- **Dual-Mode Intelligence**: Connects to Google's Gemini API with a robust fallback to a curated bilingual knowledge engine when offline or credentials are missing.
- **Safety Safeguards**: Strictly prevents hallucination of unverified shelters, medical advice, or official disaster declarations.

---

## 📁 Repository Structure

```text
ResQAi/
├── server/
│   ├── index.js          # Express API server, routes, rate-limiting & AI fallback engine
│   └── models.js         # Mongoose schemas: User, EmergencyRequest, SavedAdvisory
├── src/
│   ├── App.jsx           # Monolithic SPA entry: navigation, state, and page components:
│   │                     #  ├─ Landing & Auth (Sign in / Sign up)
│   │                     #  ├─ Dashboard (Overview & at-a-glance telemetry)
│   │                     #  ├─ ClimateWatch (Live weather & risk calculation)
│   │                     #  ├─ AgriAI (Crop advisory form & Malayalam/English engine)
│   │                     #  ├─ ResourceGuard (Utility gauges & Recharts visualizer)
│   │                     #  ├─ ReliefRoute (Requests list & Leaflet map)
│   │                     #  ├─ ResQ Assistant (Contextual AI chat interface)
│   │                     #  └─ Profile & Settings (Preferences & Dark theme)
│   ├── main.jsx          # React DOM entry point, CSS & Leaflet asset loader
│   └── styles.css        # Responsive custom CSS design system with Dark Mode
├── index.html            # Web app shell with preconnected Google Fonts (DM Sans, Manrope)
├── package.json          # Dependencies, scripts (concurrently, vite, express, mongoose)
├── vite.config.js        # Vite config with reverse-proxy rules for /api -> localhost:4000
├── spec.md               # Product specification & architectural design document
└── .env                  # Environment configuration secrets (git-ignored)
```

---

## 🛠️ Technology Stack

| Layer | Technology | Description |
| :--- | :--- | :--- |
| **Frontend Framework** | **React 18** | High-performance component-driven interface |
| **Build Tool & Bundler**| **Vite 6** | Instant HMR development server & production bundler |
| **Styling & Theme** | **Custom CSS Variables** | Native Light & Dark theme support, bespoke responsive layout |
| **Maps & Geospatial** | **Leaflet & React-Leaflet** | OpenStreetMap interactive geospatial pins & popups |
| **Data Visualization** | **Recharts** | Interactive SVG AreaCharts for resource availability trends |
| **Iconography** | **Lucide-React** | Clean, accessible vector icons across all modules |
| **Backend Runtime** | **Node.js (v18+) & Express 4** | RESTful API service with route handlers and middleware |
| **Database & ODM** | **MongoDB & Mongoose 8** | Cloud Atlas document storage for accounts and emergency requests |
| **Authentication** | **JWT & bcryptjs** | Salt-hashed passwords (cost 12) & stateless 7-day bearer tokens |
| **Generative AI** | **Google Gemini API** | Contextual natural language generation for farming and safety |
| **Weather Telemetry** | **OpenWeatherMap API** | Live geocoding, current weather observations, and 5-day forecasts |

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: version `18.0.0` or higher
- **npm**: version `9.0.0` or higher
- *(Optional)*: A free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster, an [OpenWeatherMap API Key](https://openweathermap.org/), and a [Google AI Studio API Key](https://aistudio.google.com/).

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/ResQAi.git
   cd ResQAi
   ```

2. **Install project dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the root directory (or update existing):
   ```env
   PORT=4000
   CLIENT_ORIGIN=http://localhost:5173
   MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.mongodb.net/resqai?retryWrites=true&w=majority
   JWT_SECRET=your-random-64-char-secret-key
   OPENWEATHER_API_KEY=your_openweather_api_key
   GEMINI_API_KEY=your_gemini_api_key
   ```
   > 💡 *To generate a secure 256-bit `JWT_SECRET`, run:*
   > ```bash
   > node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   > ```

4. **Launch the Development Server:**
   ```bash
   npm run dev
   ```
   This concurrently starts:
   - **Frontend (Vite)**: `http://localhost:5173`
   - **Backend (Express)**: `http://localhost:4000`

5. **Open ResQAI:**
   Open your browser and navigate to **`http://localhost:5173`**.

---

## 🔌 API Reference

### Health & Diagnostics
- `GET /api/health` — Returns system health and connectivity status of Database, Weather, and AI services.

### Authentication
- `POST /api/auth/register` — Create a new account (`name`, `email`, `password`, `preferredLanguage`, `location`).
- `POST /api/auth/login` — Authenticate and receive a signed JWT token.
- `GET /api/auth/me` — Retrieve the authenticated profile (*Requires Bearer token*).

### ClimateWatch
- `GET /api/climate/current?location=:query` — Fetch current weather, 5-day forecast, and calculated risk score.
- `GET /api/climate/forecast?location=:query` — Retrieve 5-day forecast outlook.
- `POST /api/climate/analyze` — Run algorithmic risk estimation on custom weather payloads.

### AgriAI
- `POST /api/agriculture/advice` — Generate weather-grounded crop care advice in English or Malayalam.
- `POST /api/agriculture/crop-recommendation` — Suggest suitable crops based on soil, season, and geography.

### ResourceGuard
- `GET /api/resources` — Retrieve current water, electricity, solar, and demand statistics.
- `POST /api/resources/update` — Submit updated community utility readings.
- `POST /api/resources/analyze` — Generate AI/heuristic conservation strategies based on resource levels.

### ReliefRoute
- `GET /api/emergency` — List all community requests (supports `category`, `priority`, and `status` query filters).
- `POST /api/emergency/create` — Post a new emergency assistance request.
- `GET /api/emergency/:id` — Retrieve details for a specific request.
- `PATCH /api/emergency/:id/status` — Update request status (*Restricted to `responder` / `admin` roles*).

### ResQ Assistant
- `POST /api/ai/chat` — Conversational assistant endpoint with rate-limiting and local weather context injection.

---

## 🛡️ Built-in Demo Mode (Graceful Fallbacks)

ResQAI is engineered with **zero lockout**:
- **Without MongoDB**: Newly submitted emergency requests and resource updates are maintained in server process memory; pre-loaded demo incidents are displayed.
- **Without OpenWeather API**: Automatically loads sample meteorological data for Kochi, Kerala, clearly marked with a `DEMO DATA` badge.
- **Without Gemini API**: The integrated `answerDemo()` engine responds to inquiries on floods, heatwaves, agriculture, and water shortages in English and Malayalam.

---

## ⚠️ Important Disclaimers

1. **Weather vs. Flood Warnings**: ResQAI calculates an *estimated climate risk index* based on atmospheric parameters. It is **not** an official meteorological warning or hydrology-grade flood model.
2. **Emergency Coordination**: ReliefRoute facilitates grassroots community awareness. It is not an integrated 911/112 emergency dispatch system. For life-threatening emergencies, always dial local emergency services.
3. **Agricultural Guidance**: Advice provided by AgriAI is informational. Farmers should cross-verify recommendations with local agricultural extension officers before applying treatments or making critical harvesting decisions.

---

## 🗺️ Roadmap & Future Enhancements

- [ ] **Automated Geocoding**: Automatically reverse-geocode freeform emergency addresses so community requests pin instantly to the Leaflet map.
- [ ] **Saved Advisories**: Connect the `SavedAdvisory` schema to allow farmers to bookmark customized seasonal recommendations in their user profile.
- [ ] **Modular Component Refactoring**: Split `src/App.jsx` into standalone component and page files (`/pages`, `/components`, `/hooks`).
- [ ] **SMS / WhatsApp Emergency Broadcasts**: Integration with Twilio for offline emergency alerts in remote low-bandwidth zones.
- [ ] **Offline PWA Support**: Service worker caching for basic field access without internet connectivity.

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for more information.
