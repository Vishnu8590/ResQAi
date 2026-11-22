import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'node:path';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { EmergencyRequest, User } from './models.js';

const app = express();
app.use(cors({ origin: process.env.CLIENT_ORIGIN || true }));
app.use(express.json({ limit: '32kb' }));
const port = Number(process.env.PORT || 4000);
const hasMongo = Boolean(process.env.MONGODB_URI);
const hasJwt = Boolean(process.env.JWT_SECRET);
const demoRequests = [
  { _id: 'demo-1', title: 'Drinking water needed for families', description: 'Several families need clean drinking water after the local supply was interrupted.', category: 'Drinking water', priority: 'High', status: 'Open', location: 'Aluva, Kerala', coordinates: { lat: 10.1076, lng: 76.3516 }, createdAt: new Date().toISOString() },
  { _id: 'demo-2', title: 'Medicine delivery for elderly resident', description: 'Requesting help getting essential medicines to an elderly neighbour.', category: 'Medicine', priority: 'Medium', status: 'In Progress', location: 'Kalamassery, Kerala', coordinates: { lat: 10.0618, lng: 76.3264 }, createdAt: new Date(Date.now() - 3600000).toISOString() },
  { _id: 'demo-3', title: 'Food supplies for community', description: 'Non-perishable food requested for households affected by heavy rain.', category: 'Food', priority: 'Critical', status: 'Open', location: 'Ernakulam, Kerala', coordinates: { lat: 9.9816, lng: 76.2999 }, createdAt: new Date(Date.now() - 7200000).toISOString() }
];
const demoResources = { source: 'Demo Data', resources: { water: { availability: 55, status: 'Moderate', change: -4, unit: '%' }, electricity: { availability: 82, status: 'Stable', change: 2, unit: '%' }, solar: { generation: 4.2, status: 'Available', change: 12, unit: 'kWh' }, demand: { level: 'Normal', status: 'Balanced', change: 1, unit: '%' } }, history: [{ day: 'Mon', water: 68, energy: 72 }, { day: 'Tue', water: 64, energy: 78 }, { day: 'Wed', water: 61, energy: 74 }, { day: 'Thu', water: 60, energy: 81 }, { day: 'Fri', water: 58, energy: 76 }, { day: 'Sat', water: 55, energy: 82 }, { day: 'Sun', water: 55, energy: 82 }] };

if (hasMongo) mongoose.connect(process.env.MONGODB_URI).then(async () => {
  console.log('MongoDB connected');
  try {
    const count = await EmergencyRequest.countDocuments();
    if (count === 0) {
      await EmergencyRequest.insertMany(demoRequests.map(({ _id, ...r }) => r));
      console.log('Seeded sample emergency requests into MongoDB');
    }
  } catch (err) { console.error('Seeding error:', err.message); }
}).catch(err => console.error('MongoDB connection failed:', err.message));
const demoMode = () => !mongoose.connection.readyState;
const asyncRoute = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
const auth = (req, res, next) => {
  const token = req.headers.authorization?.replace(/^Bearer\s+/i, '');
  if (!token || !hasJwt) return res.status(401).json({ error: 'Please sign in to continue.' });
  try { req.user = jwt.verify(token, process.env.JWT_SECRET); next(); }
  catch { return res.status(401).json({ error: 'Your session has expired. Please sign in again.' }); }
};
const validateText = (value, max) => typeof value === 'string' && value.trim().length > 0 && value.trim().length <= max;
const sampleWeather = (place = 'Kochi, Kerala') => ({ source: 'Demo Data', location: place, temperature: 29, feelsLike: 33, humidity: 78, windSpeed: 14, rain: 12, condition: 'Light rain', description: 'Light rain', icon: '10d', forecast: [
  { day: 'Today', high: 29, low: 24, rain: 65, icon: '🌧️' }, { day: 'Tue', high: 30, low: 24, rain: 45, icon: '🌦️' }, { day: 'Wed', high: 31, low: 25, rain: 20, icon: '⛅' }, { day: 'Thu', high: 30, low: 24, rain: 70, icon: '🌧️' }, { day: 'Fri', high: 29, low: 24, rain: 55, icon: '🌦️' }
] });
function estimateRisk(weather) {
  const rain = Number(weather.rain || 0); const temp = Number(weather.temperature || 0);
  const score = Math.min(100, Math.round((rain > 30 ? 48 : rain > 15 ? 30 : rain > 5 ? 16 : 5) + (temp > 38 ? 35 : temp > 34 ? 22 : 8) + (weather.humidity > 85 ? 14 : 5)));
  const level = score >= 75 ? 'Critical' : score >= 55 ? 'High' : score >= 30 ? 'Moderate' : 'Low';
  return { score, level, factors: [rain > 15 ? 'Elevated rainfall' : 'Rainfall within typical range', temp > 34 ? 'High temperature' : 'Temperature not at heat threshold', weather.humidity > 85 ? 'Very high humidity' : 'Humidity considered'], precautions: rain > 15 ? ['Avoid flooded roads and low-lying areas.', 'Keep medicines and important documents dry.', 'Check local official alerts.'] : ['Stay hydrated and monitor local weather updates.', 'Check local official alerts.'] };
}

app.get('/api/health', (req, res) => res.json({ ok: true, demoMode: demoMode(), services: { database: mongoose.connection.readyState === 1 ? 'connected' : 'demo', weather: process.env.OPENWEATHER_API_KEY ? 'configured' : 'demo', ai: process.env.GEMINI_API_KEY ? 'configured' : 'demo' } }));

app.post('/api/auth/register', asyncRoute(async (req, res) => {
  const { name, email, password, location = '', preferredLanguage = 'en' } = req.body || {};
  if (!validateText(name, 80) || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email || '') || typeof password !== 'string' || password.length < 8 || password.length > 100) return res.status(400).json({ error: 'Enter a name, a valid email, and a password of at least 8 characters.' });
  if (demoMode()) return res.status(503).json({ error: 'Accounts require a connected MongoDB database. Explore the app in demo mode.' });
  if (!hasJwt) return res.status(503).json({ error: 'Authentication is not configured. Add JWT_SECRET to the server environment.' });
  if (await User.exists({ email: email.toLowerCase() })) return res.status(409).json({ error: 'An account with this email already exists.' });
  const user = await User.create({ name: name.trim(), email: email.toLowerCase(), password: await bcrypt.hash(password, 12), location, preferredLanguage });
  const token = jwt.sign({ sub: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
  res.status(201).json({ token, user: { id: user.id, name: user.name, email: user.email, location: user.location, preferredLanguage: user.preferredLanguage } });
}));
app.post('/api/auth/login', asyncRoute(async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: 'Enter your email and password.' });
  if (demoMode()) return res.status(503).json({ error: 'Accounts require a connected MongoDB database. Explore the app in demo mode.' });
  if (!hasJwt) return res.status(503).json({ error: 'Authentication is not configured.' });
  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
  if (!user || !(await bcrypt.compare(password, user.password))) return res.status(401).json({ error: 'Email or password is incorrect.' });
  const token = jwt.sign({ sub: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
  res.json({ token, user: { id: user.id, name: user.name, email: user.email, location: user.location, preferredLanguage: user.preferredLanguage } });
}));
app.get('/api/auth/me', auth, asyncRoute(async (req, res) => { const user = await User.findById(req.user.sub).select('name email location preferredLanguage role'); if (!user) return res.status(404).json({ error: 'Account not found.' }); res.json(user); }));

app.get('/api/climate/current', asyncRoute(async (req, res) => {
  const location = String(req.query.location || 'Kochi, Kerala').slice(0, 100);
  if (process.env.OPENWEATHER_API_KEY) {
    try {
      let lat; let lon; let name; let state; let country;
      if (/^-?\d+(?:\.\d+)?,-?\d+(?:\.\d+)?$/.test(location)) [lat, lon] = location.split(',').map(Number);
      else { const geo = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(location)}&limit=1&appid=${process.env.OPENWEATHER_API_KEY}`); const places = await geo.json(); if (!places[0]) throw new Error('Location not found'); ({ lat, lon, name, state, country } = places[0]); }
      const [currentResponse, forecastResponse] = await Promise.all([fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${process.env.OPENWEATHER_API_KEY}`), fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${process.env.OPENWEATHER_API_KEY}`)]);
      if (!currentResponse.ok || !forecastResponse.ok) throw new Error('Weather service unavailable');
      const cur = await currentResponse.json(); const fc = await forecastResponse.json();
      const weather = { source: 'Live Weather', location: [name, state, country].filter(Boolean).join(', ') || location, temperature: Math.round(cur.main.temp), feelsLike: Math.round(cur.main.feels_like), humidity: cur.main.humidity, windSpeed: Math.round(cur.wind.speed * 3.6), rain: cur.rain?.['1h'] || 0, condition: cur.weather?.[0]?.main || 'Unknown', description: cur.weather?.[0]?.description || '', icon: cur.weather?.[0]?.icon, forecast: (fc.list || []).filter((_, i) => i % 8 === 0).slice(0, 5).map(item => ({ day: new Date(item.dt * 1000).toLocaleDateString('en', { weekday: 'short' }), high: Math.round(item.main.temp_max), low: Math.round(item.main.temp_min), rain: Math.round((item.pop || 0) * 100), icon: item.weather?.[0]?.icon })) };
      return res.json({ weather, risk: estimateRisk(weather) });
    } catch (error) { console.error('Weather provider failed:', error.message); }
  }
  const weather = sampleWeather(location); res.json({ weather, risk: estimateRisk(weather) });
}));
app.get('/api/climate/forecast', asyncRoute(async (req, res) => { const weather = sampleWeather(String(req.query.location || 'Kochi, Kerala')); res.json({ source: weather.source, forecast: weather.forecast }); }));
app.post('/api/climate/analyze', (req, res) => { const weather = req.body?.weather || sampleWeather(); res.json(estimateRisk(weather)); });

app.get('/api/resources', (req, res) => res.json(demoResources));
app.post('/api/resources/update', (req, res) => { const { water, electricity, solar } = req.body || {}; for (const v of [water, electricity, solar]) if (v !== undefined && (!Number.isFinite(Number(v)) || Number(v) < 0 || Number(v) > 10000)) return res.status(400).json({ error: 'Resource values must be valid non-negative numbers.' }); if (water !== undefined) demoResources.resources.water.availability = Number(water); if (electricity !== undefined) demoResources.resources.electricity.availability = Number(electricity); if (solar !== undefined) demoResources.resources.solar.generation = Number(solar); res.json({ ok: true, message: 'Resource readings accepted for this demo session.' }); });
app.post('/api/resources/analyze', asyncRoute(async (req, res) => { const { water = 55, electricity = 82 } = req.body || {}; const suggestions = []; if (water < 60) suggestions.push('Prioritize drinking water and essential needs; reuse water where safe.'); if (electricity < 50) suggestions.push('Save power for essential appliances and check on neighbours who rely on medical devices.'); if (!suggestions.length) suggestions.push('Resource levels look stable. Keep monitoring and avoid unnecessary consumption.'); const ai = await askGemini(`Provide 3 short practical resource conservation tips for water availability ${water}% and electricity availability ${electricity}%.`); res.json({ recommendations: ai || suggestions, source: ai ? 'Gemini' : 'Demo guidance' }); }));

app.get('/api/emergency', asyncRoute(async (req, res) => {
  const { category, priority, status } = req.query;
  if (demoMode()) { const list = demoRequests.filter(r => (!category || r.category === category) && (!priority || r.priority === priority) && (!status || r.status === status)); return res.json({ requests: list, source: 'Demo Data' }); }
  const filters = {}; if (category) filters.category = category; if (priority) filters.priority = priority; if (status) filters.status = status;
  let requests = await EmergencyRequest.find(filters).sort({ createdAt: -1 }).limit(200);
  if (!requests.length && !category && !priority && !status) {
    try {
      await EmergencyRequest.insertMany(demoRequests.map(({ _id, ...r }) => r));
      requests = await EmergencyRequest.find(filters).sort({ createdAt: -1 }).limit(200);
    } catch {}
  }
  res.json({ requests, source: 'Community reports' });
}));
app.post('/api/emergency/create', asyncRoute(async (req, res) => {
  const { title, description, category, priority = 'Medium', location, contact = '' } = req.body || {};
  let { coordinates } = req.body || {};
  if (!validateText(title, 120) || !validateText(description, 2000) || !validateText(location, 200) || !['Food', 'Drinking water', 'Medicine', 'Shelter', 'Clothing', 'Rescue assistance', 'Other'].includes(category) || !['Low', 'Medium', 'High', 'Critical'].includes(priority)) return res.status(400).json({ error: 'Please complete all required fields with valid values.' });
  if (!coordinates || !Number.isFinite(+coordinates.lat) || !Number.isFinite(+coordinates.lng)) {
    if (process.env.OPENWEATHER_API_KEY) {
      try {
        const geoRes = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(location)}&limit=1&appid=${process.env.OPENWEATHER_API_KEY}`);
        const places = await geoRes.json();
        if (places && places[0]) coordinates = { lat: places[0].lat, lng: places[0].lon };
      } catch (err) { console.error('Geocoding emergency location failed:', err.message); }
    }
    if (!coordinates || !coordinates.lat) {
      coordinates = { lat: 9.9816 + (Math.random() - 0.5) * 0.08, lng: 76.2999 + (Math.random() - 0.5) * 0.08 };
    }
  }
  if (demoMode()) { const request = { _id: `local-${Date.now()}`, title: title.trim(), description: description.trim(), category, priority, status: 'Open', location: location.trim(), coordinates, createdAt: new Date().toISOString() }; demoRequests.unshift(request); return res.status(201).json({ request, source: 'Demo Data', message: 'Request added to this demo session.' }); }
  const request = await EmergencyRequest.create({ title, description, category, priority, location, contact, coordinates });
  res.status(201).json({ request, source: 'Community reports' });
}));
app.get('/api/emergency/:id', asyncRoute(async (req, res) => { if (demoMode()) { const request = demoRequests.find(r => r._id === req.params.id); return request ? res.json({ request, source: 'Demo Data' }) : res.status(404).json({ error: 'Request not found.' }); } const request = await EmergencyRequest.findById(req.params.id); return request ? res.json({ request, source: 'Community reports' }) : res.status(404).json({ error: 'Request not found.' }); }));
app.patch('/api/emergency/:id/status', auth, asyncRoute(async (req, res) => { if (req.user.role !== 'admin' && req.user.role !== 'responder') return res.status(403).json({ error: 'Only authorized responders can update request status.' }); const { status } = req.body || {}; if (!['Open', 'In Progress', 'Resolved'].includes(status)) return res.status(400).json({ error: 'Invalid status.' }); const request = await EmergencyRequest.findByIdAndUpdate(req.params.id, { status }, { new: true, runValidators: true }); return request ? res.json({ request }) : res.status(404).json({ error: 'Request not found.' }); }));

const rateBuckets = new Map();
function rateLimit(req, res, next) { const key = req.ip; const now = Date.now(); const bucket = rateBuckets.get(key) || { start: now, count: 0 }; if (now - bucket.start > 60000) { bucket.start = now; bucket.count = 0; } bucket.count++; rateBuckets.set(key, bucket); if (bucket.count > 20) return res.status(429).json({ error: 'Please wait a moment before trying again.' }); next(); }
async function askGemini(prompt) {
  if (!process.env.GEMINI_API_KEY) return null;
  try { const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ systemInstruction: { parts: [{ text: 'You are ResQ Assistant. Give concise, practical climate and safety advice. Never invent weather, shelter, supply, or rescue information. State clearly when data is unavailable. Use the language requested by the user. Prefer short bullet points.' }] }, contents: [{ parts: [{ text: String(prompt).slice(0, 4000) }] }], generationConfig: { temperature: 0.4, maxOutputTokens: 500 } }) }); if (!response.ok) throw new Error('AI provider unavailable'); const data = await response.json(); return data.candidates?.[0]?.content?.parts?.map(p => p.text).join('') || null; } catch (error) { console.error('Gemini request failed:', error.message); return null; }
}
function answerDemo(message, context = {}, language = 'en') { const q = message.toLowerCase(); if (language === 'ml') { if (/flood|വെള്ളപ്പൊക്കം/.test(q)) return 'വെള്ളപ്പൊക്ക സമയത്ത്: ഉയർന്ന സ്ഥലത്തേക്ക് മാറുക, വെള്ളം കയറിയ റോഡിലൂടെ നടക്കുകയോ വാഹനമോടിക്കുകയോ ചെയ്യരുത്, സുരക്ഷിതമാണെങ്കിൽ മാത്രം വൈദ്യുതി ഓഫ് ചെയ്യുക. പ്രാദേശിക അധികൃതരുടെ നിർദേശങ്ങൾ പാലിക്കുക. അടിയന്തര അപകടമുണ്ടെങ്കിൽ പ്രാദേശിക അടിയന്തര സേവനങ്ങളെ ബന്ധപ്പെടുക.'; if (/crop|farm|paddy|plant|കൃഷി|വിള/.test(q)) return 'വിളയെക്കുറിച്ചുള്ള കൃത്യമായ നിർദേശത്തിന് വിളയുടെ പേരും സ്ഥലവും പങ്കിടുക. കനത്ത മഴയ്ക്ക് മുമ്പ് ചാലുകൾ വൃത്തിയാക്കുക, തൈകളെ വെള്ളക്കെട്ടിൽ നിന്ന് സംരക്ഷിക്കുക, മഴയ്ക്ക് തൊട്ടുമുമ്പ് വളം ഇടുന്നത് ഒഴിവാക്കുക.'; if (/heat|hot|ചൂട്|വെയിൽ/.test(q)) return 'ചൂടുകാലത്ത് ഇടയ്ക്കിടെ വെള്ളം കുടിക്കുക, ഉച്ചസമയത്തെ കഠിനമായ പുറംപ്രവർത്തനം ഒഴിവാക്കുക, ലഘുവായ വസ്ത്രം ധരിക്കുക. കുട്ടികൾ, വയോധികർ, അയൽക്കാർ എന്നിവരുടെ ക്ഷേമം അന്വേഷിക്കുക.'; if (/water|drought|വെള്ളം|വരൾച്ച/.test(q)) return 'ജലക്ഷാമത്തിൽ കുടിവെള്ളത്തിനും ആവശ്യങ്ങൾക്കും മുൻഗണന നൽകുക, ചോർച്ചകൾ പരിഹരിക്കുക, സുരക്ഷിതമായ ഉപയോഗിച്ച വെള്ളം വീണ്ടും ഉപയോഗിക്കുക, പ്രാദേശിക ജല അതോറിറ്റിയുടെ നിർദേശങ്ങൾ പാലിക്കുക.'; if (/shelter|supply|help|emergency|അഭയം|സഹായം|അടിയന്തര/.test(q)) return 'സമൂഹം പങ്കുവെച്ച സഹായ അഭ്യർത്ഥനകൾ കാണിക്കാം. സ്ഥിരീകരിച്ച അഭയകേന്ദ്രങ്ങളുടെയോ സാധനങ്ങളുടെയോ വിവരങ്ങൾ എനിക്ക് ലഭ്യമല്ല. ഉറപ്പായ വിവരങ്ങൾക്ക് പ്രാദേശിക അധികൃതരെയോ അടിയന്തര സേവനങ്ങളെയോ ബന്ധപ്പെടുക.'; return `ഡെമോ മോഡിൽ തത്സമയ കാലാവസ്ഥാ പ്രവചനം ലഭ്യമല്ല.${context.location ? ` ${context.location} പ്രദേശത്തിനായി` : ''} നിലവിലെ വിവരങ്ങൾക്കും ഔദ്യോഗിക മുന്നറിയിപ്പുകൾക്കും പ്രാദേശിക കാലാവസ്ഥാ സേവനം പരിശോധിക്കുക. സുരക്ഷാ നിർദേശങ്ങൾക്കും കൃഷി, ജലസംരക്ഷണ സഹായത്തിനും ഞാൻ സഹായിക്കാം.`; } if (/rain|weather|tomorrow/.test(q)) return `I don’t have a live forecast in demo mode. ${context.location ? `For ${context.location}, ` : ''}check your local weather service for current conditions and official alerts. If heavy rain is forecast, avoid flooded roads and low-lying areas.`; if (/flood/.test(q)) return 'During flooding: move to higher ground, avoid walking or driving through floodwater, switch off electricity only if safe, and follow local emergency authority instructions. Call local emergency services if in immediate danger.'; if (/heat|hot/.test(q)) return 'During a heatwave: drink water regularly, avoid strenuous outdoor activity during the hottest hours, wear light clothing, and check on children, older adults, and neighbours.'; if (/crop|farm|paddy|plant/.test(q)) return 'For crop-specific guidance, share your crop and location. Before heavy rain, clear drainage, protect seedlings from waterlogging, and avoid applying fertilizer just before a downpour.'; if (/water|drought/.test(q)) return 'During water shortages, prioritize drinking and hygiene, fix leaks, reuse safe greywater for plants, and follow local water authority guidance.'; if (/shelter|supply|help|emergency/.test(q)) return 'I can show community-submitted requests, but I don’t have verified shelter or supply availability. Check with local authorities or emergency services for confirmed resources.'; return 'I can help with climate safety, farming, water conservation, and emergency preparedness. Tell me your location and what you need help with. I’ll clearly identify when live information is unavailable.'; }
app.post('/api/ai/chat', rateLimit, asyncRoute(async (req, res) => { const { message, language = 'en', context = {} } = req.body || {}; if (!validateText(message, 2000)) return res.status(400).json({ error: 'Enter a question to get started.' }); const contextText = context.weather ? `Weather data (${context.weather.source || 'provided'}): ${JSON.stringify(context.weather).slice(0, 1000)}.` : 'No live weather data is available unless supplied below.'; const reply = await askGemini(`Reply in ${language === 'ml' ? 'Malayalam' : 'English'}. User question: ${message}\nLocation: ${context.location || 'not supplied'}\nApplication context: ${contextText}\nOnly use the supplied weather. Do not claim to know shelters, supplies, or official warnings without verified data.`); res.json({ reply: reply || answerDemo(message, context, language), source: reply ? 'Gemini' : 'Demo guidance' }); }));
app.post('/api/agriculture/advice', rateLimit, asyncRoute(async (req, res) => { const { location = '', crop = '', soil = '', plantingDate = '', condition = '', language = 'en', weather } = req.body || {}; if (!validateText(crop, 80)) return res.status(400).json({ error: 'Enter a crop to get advice.' }); const prompt = `Give practical farming advice in ${language === 'ml' ? 'Malayalam' : 'English'} for crop ${crop}, location ${location || 'not provided'}, soil ${soil || 'not provided'}, planting date ${plantingDate || 'not provided'}, crop condition ${condition || 'not provided'}. ${weather ? `Weather data: ${JSON.stringify(weather).slice(0, 800)}` : 'No live weather data supplied; do not invent forecast.'} Focus on relevant planting, watering, rainfall, and crop care actions.`; const advice = await askGemini(prompt); const fallback = language === 'ml' ? `${crop} കൃഷിക്ക് ${location || 'നിങ്ങളുടെ പ്രദേശത്തെ'} കാർഷിക ഓഫീസിന്റെ നിർദേശങ്ങൾ പരിശോധിക്കുക. മഴ പ്രതീക്ഷിക്കുന്നുവെങ്കിൽ നീർചാലുകൾ വൃത്തിയാക്കുക, അമിതമായി നനയ്ക്കരുത്, വളത്തിന്റെ ലേബലും പ്രാദേശിക നിർദേശങ്ങളും പാലിക്കുക. ഡെമോ മാർഗ്ഗനിർദേശത്തിൽ തത്സമയ വിളയോ പ്രവചന വിവരങ്ങളോ ലഭ്യമല്ല.` : `For ${crop}, check local agricultural extension guidance for conditions in ${location || 'your area'}. Keep drainage clear if rain is expected, avoid overwatering, and follow fertilizer labels and local recommendations. No live crop or forecast data is available in demo guidance.`; res.json({ advice: advice || fallback, source: advice ? 'Gemini' : 'Demo guidance' }); }));
app.post('/api/agriculture/crop-recommendation', rateLimit, asyncRoute(async (req, res) => { const { location = '', soil = '', season = '', language = 'en' } = req.body || {}; const recommendation = await askGemini(`In ${language === 'ml' ? 'Malayalam' : 'English'}, suggest suitable crops to discuss with a local agriculture extension officer for ${location || 'unspecified location'}, soil ${soil || 'unspecified'}, season ${season || 'current season'}. State that suitability depends on local conditions and do not invent local data.`); res.json({ recommendation: recommendation || 'Crop suitability depends on local soil, season, and water access. Share your district and soil type, then verify options with your local agriculture extension office.', source: recommendation ? 'Gemini' : 'Demo guidance' }); }));

if (process.env.NODE_ENV === 'production') { app.use(express.static(path.resolve('dist'))); app.get('*', (req, res) => res.sendFile(path.resolve('dist/index.html'))); }
app.use((err, req, res, next) => { console.error(err); res.status(err.status || 500).json({ error: 'Something went wrong. Please try again.' }); });
app.listen(port, () => console.log(`ResQAI API listening on http://localhost:${port}`));
