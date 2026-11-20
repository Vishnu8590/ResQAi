# PROJECT SPECIFICATION — ResQAI

## 1. Project Name
ResQAI – Climate & Resource Resilience AI

## 2. Project Overview
ResQAI is an AI-powered web application designed to help people deal with climate-related problems such as floods, heavy rainfall, heatwaves, droughts, farming problems, water shortages, and electricity shortages.

The platform uses weather data, location information, AI, and maps to provide useful recommendations and help communities respond to emergencies.

The main goal is to turn environmental data into simple, understandable, and actionable information.

## 3. Problem Statement
People often lack timely and understandable information about climate risks, farming conditions, resource shortages, and emergencies.

Existing information is often scattered across different platforms. People may not know what precautions to take, how to protect crops, where to find resources, or how to respond during emergencies.

ResQAI aims to solve this by combining climate monitoring, agricultural advice, resource monitoring, and emergency assistance into one platform.

## 4. Target Users
- Farmers
- People living in flood-prone areas
- Local communities
- Emergency volunteers
- NGOs
- Students and researchers

## 5. Main Modules

### Module 1: ClimateWatch
A climate monitoring and risk analysis system.

Features:
- Current weather information
- Temperature
- Humidity
- Rainfall
- Wind speed
- Weather forecast
- Heavy rainfall warnings
- Flood risk indicators
- Heatwave indicators
- Drought risk indicators

Users can enter a location or select one on a map.

The system should display:
- Current climate conditions
- Risk level (Low, Moderate, High, Critical)
- Potential risks
- Precautionary measures
- AI-generated recommendations

Example:
Heavy rainfall is expected in your area.

Recommendations:
- Avoid low-lying areas.
- Stay away from flooded roads.
- Protect electrical equipment.
- Move important belongings to safer locations.

Do not claim that weather data alone can accurately predict floods. Clearly distinguish weather information from estimated risk.

### Module 2: AgriAI
An AI-powered farming assistant.

Users can enter:
- Location
- Crop name
- Soil type (optional)
- Planting date (optional)
- Crop condition (optional)

Features:
- Crop recommendations
- Weather-based farming advice
- Watering recommendations
- Fertilizer timing suggestions
- Planting and harvesting guidance
- Heavy rainfall precautions
- Drought protection
- Pest and disease prevention suggestions

Example:
Crop: Paddy
Condition: Heavy rainfall expected

AI recommendations:
- Check drainage systems.
- Protect seedlings from waterlogging.
- Avoid applying fertilizer immediately before heavy rain.

The assistant should use weather information and the user's crop details when available.

Agricultural advice must support Malayalam and English and should be easy for farmers to understand.

### Module 3: ResourceGuard
A resource monitoring system that helps users understand resource availability and possible shortages.

Monitor:
- Water availability
- Electricity availability
- Solar power availability
- Energy demand
- Resource shortage risks

For the initial version, use demo data or manually entered data. IoT hardware is not required.

Features:
- Resource status dashboard
- Water availability indicator
- Electricity status indicator
- Solar energy information
- Shortage alerts
- AI-generated conservation suggestions

Example:
Water availability is low.

Suggestions:
- Reduce unnecessary water usage.
- Reuse water where possible.
- Prioritize drinking water and essential needs.

Clearly label simulated data as Demo Data.

### Module 4: ReliefRoute
An emergency relief and supply coordination system.

Users can:
- Report emergencies
- Request essential supplies
- View emergency requests
- Find relief resources
- View shelters and relief points when verified data is available
- View emergency locations on a map

Emergency categories:
- Food
- Drinking water
- Medicine
- Shelter
- Clothing
- Rescue assistance
- Other

Each emergency request should contain:
- Title
- Description
- Location
- Category
- Priority
- Status
- Date and time

Priority levels:
- Low
- Medium
- High
- Critical

Status:
- Open
- In Progress
- Resolved

Users should be able to create requests and view existing requests.

Never invent emergency shelters, available supplies, or verified rescue services.

## 6. Main Dashboard

Create a dashboard that provides a quick overview of the entire platform.

Display:
- User location
- Current weather
- Temperature
- Rainfall information
- Overall climate risk
- Weather alerts
- Farming recommendations
- Water status
- Electricity status
- Active emergency requests
- Quick-access cards for all modules

Dashboard cards should link to their respective modules.

The dashboard should be informative without becoming overcrowded.

## 7. AI Assistant — ResQ Assistant

Create a chatbot called ResQ Assistant.

Users should be able to ask questions such as:
- Will it rain heavily tomorrow?
- What should I do during a flood?
- Which crops are suitable for this season?
- How can I protect my crops from heavy rain?
- How can I save water during a drought?
- Where can I find emergency supplies?
- What precautions should I take during a heatwave?

Features:
- Text-based chat
- English language support
- Malayalam language support
- Simple answers
- Context-aware recommendations
- Weather-aware answers when weather data is available
- Agricultural assistance
- Climate safety guidance

Use Gemini API for AI responses.

The AI should use relevant application data when available instead of giving generic answers.

## 8. Technology Stack

Frontend:
- React.js
- Tailwind CSS
- Responsive design

Backend:
- Node.js
- Express.js

Database:
- MongoDB

AI:
- Gemini API

Weather:
- OpenWeather API or another suitable weather API

Maps:
- Leaflet
- OpenStreetMap

Authentication:
- JWT
- bcrypt

Charts:
- Recharts

Use a simple and maintainable architecture.

## 9. Application Pages

Create the following pages:

1. Landing Page
2. Login Page
3. Register Page
4. Dashboard
5. ClimateWatch
6. AgriAI
7. ResourceGuard
8. ReliefRoute
9. ResQ Assistant
10. Profile and Settings

Routes:

/
 /login
 /register
 /dashboard
 /climate
 /agriculture
 /resources
 /emergency
 /assistant
 /profile

Create a sidebar navigation for desktop and a responsive navigation for mobile.

## 10. UI and Design

Create a modern, professional, clean, and attractive interface.

Design requirements:
- Nature-inspired green, blue, and white color palette
- Light theme by default
- Optional dark mode
- Responsive desktop, tablet, and mobile layouts
- Sidebar navigation
- Modern dashboard cards
- Rounded corners
- Clean typography
- Simple charts
- Interactive maps
- Clear risk indicators
- Loading indicators
- Empty states
- Error states
- Toast notifications
- Smooth but subtle animations

Use a design that feels like a real climate technology startup product, not a basic student project.

Avoid unnecessary animations, excessive colors, clutter, and complicated layouts.

All buttons, links, menus, forms, and navigation must work correctly.

## 11. Climate Risk Levels

Use four risk levels:

- Low
- Moderate
- High
- Critical

Use weather data to calculate an estimated risk score.

Display:
- Risk score
- Risk level
- Factors contributing to the risk
- Recommended precautions

Clearly explain that the risk score is an estimate and not an official disaster warning.

## 12. Weather API Integration

Integrate a weather API to retrieve:
- Current weather
- Temperature
- Humidity
- Wind speed
- Rain information
- Weather forecasts

Allow users to search for locations.

Allow users to use their current location if they give browser permission.

If weather API access is unavailable, display demo data and clearly label it.

Never present demo weather as real-time weather.

## 13. AI Integration

Integrate Gemini API through the backend.

Use AI for:
- Climate risk explanations
- Farming recommendations
- Crop suggestions
- Weather-based precautions
- Resource conservation
- Emergency preparedness
- General climate-related questions

AI instructions:
- Give simple and practical answers.
- Avoid unnecessarily long responses.
- Prioritize safety.
- Use real application data when available.
- Never invent weather information.
- Never invent shelter locations or available supplies.
- Clearly state when information is unavailable.
- Support English and Malayalam.
- Provide recommendations in bullet points when appropriate.

## 14. ResourceGuard Data

Use demo data initially.

Example:

Water:
- Availability: 55%
- Status: Moderate

Electricity:
- Availability: 82%
- Status: Stable

Solar:
- Generation: 4.2 kWh
- Status: Available

Allow the user to view resource information through cards, progress indicators, and charts.

Clearly label all simulated values as Demo Data.

## 15. ReliefRoute Data

Create an emergency request form.

Fields:
- Title
- Description
- Emergency category
- Priority
- Location
- Optional contact information

Users should be able to:
- Submit emergency requests
- View requests
- Filter requests by category and priority
- View request details
- Update request status where authorized

Display emergency requests on an interactive map using Leaflet.

Use only locations provided by users or verified sources.

Do not build real-time vehicle tracking in the initial version.

## 16. Database

Use MongoDB.

Create the following collections/models:

### User
- Name
- Email
- Hashed password
- Preferred language
- Location
- Role
- Created date

### EmergencyRequest
- Title
- Description
- Category
- Priority
- Status
- Location
- Created by
- Created date

### SavedAdvisory
- User ID
- Category
- Location
- Advisory content
- Created date

Keep the database structure simple and use proper validation.

## 17. API Endpoints

Authentication:
POST /api/auth/register
POST /api/auth/login
GET /api/auth/me

Climate:
GET /api/climate/current
GET /api/climate/forecast
POST /api/climate/analyze

Agriculture:
POST /api/agriculture/advice
POST /api/agriculture/crop-recommendation

Resources:
GET /api/resources
POST /api/resources/update
POST /api/resources/analyze

Emergency:
POST /api/emergency/create
GET /api/emergency
GET /api/emergency/:id
PATCH /api/emergency/:id/status

AI:
POST /api/ai/chat

Implement proper validation, error handling, and authentication wherever necessary.

## 18. Security

- Store API keys in environment variables.
- Never expose API keys in frontend code.
- Hash passwords with bcrypt.
- Use JWT for authentication.
- Validate user inputs.
- Protect authenticated endpoints.
- Add rate limiting to AI endpoints.
- Handle API failures safely.
- Avoid storing unnecessary personal information.

## 19. Demo Mode

The application must still work if API keys are unavailable.

Create a demo mode with:
- Sample weather data
- Sample climate risks
- Sample resource information
- Sample emergency requests

Clearly display Demo Mode wherever simulated data is used.

Do not mix simulated data with live data without clearly identifying each source.

## 20. MVP Scope

Complete these features first:

- Responsive frontend
- Landing page
- Login and registration
- Dashboard
- Location search
- Weather information
- Climate risk analysis
- AI climate recommendations
- Agriculture assistant
- Malayalam and English support
- Resource monitoring with demo data
- Emergency request creation
- Emergency request listing
- Emergency map
- AI chatbot
- MongoDB integration
- Working backend APIs
- Demo mode

Do not implement these in the initial version:
- IoT hardware
- Satellite image processing
- Drone control
- Real-time vehicle tracking
- Complex machine learning training
- Automatic control of electrical grids
- Automated physical resource allocation

## 21. Future Improvements

These can be added later:

- Satellite image analysis
- Flood prediction
- Historical rainfall analysis
- Crop disease detection using images
- Soil sensor integration
- IoT water-level sensors
- Solar power monitoring
- Real-time relief vehicle tracking
- Emergency route optimization
- Voice assistant
- Mandi price integration
- SMS and WhatsApp alerts

## 22. Development Order

Build the project in this order:

1. Inspect the project directory.
2. Initialize the frontend and backend.
3. Create the folder structure.
4. Build the UI and navigation.
5. Implement authentication.
6. Connect MongoDB.
7. Integrate weather API.
8. Implement ClimateWatch.
9. Implement AgriAI.
10. Implement ResourceGuard.
11. Implement ReliefRoute.
12. Integrate Gemini AI.
13. Connect frontend and backend.
14. Test all features.
15. Fix errors.
16. Improve UI and responsiveness.

## 23. Final Instructions to Codex

Build the complete ResQAI application based on this specification.

Do not stop at creating a static UI.

All pages must be connected and functional. Forms must work. Buttons must perform their actions. Backend APIs must be implemented. Database operations must work. API integrations must be connected where credentials are available.

If credentials are missing, provide a working demo mode.

Do not leave placeholder pages, unfinished features, TODO comments, or fake functionality presented as real.

Keep the code clean, modular, maintainable, and beginner-friendly.

Prioritize functionality, good UI/UX, reliability, and a polished hackathon-ready demonstration.

Start implementing the project immediately. Do not ask unnecessary questions. Make reasonable decisions and continue until the application is complete.

At the end, provide:
- Features completed
- Project structure
- Setup instructions
- Required environment variables
- How to run frontend and backend
- Features available in demo mode
- Any remaining limitations