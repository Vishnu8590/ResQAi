import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 80 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, select: false },
  preferredLanguage: { type: String, enum: ['en', 'ml'], default: 'en' },
  location: { type: String, default: '' },
  role: { type: String, enum: ['user', 'responder', 'admin'], default: 'user' }
}, { timestamps: true });

const emergencyRequestSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 120 },
  description: { type: String, required: true, trim: true, maxlength: 2000 },
  category: { type: String, enum: ['Food', 'Drinking water', 'Medicine', 'Shelter', 'Clothing', 'Rescue assistance', 'Other'], required: true },
  priority: { type: String, enum: ['Low', 'Medium', 'High', 'Critical'], default: 'Medium' },
  status: { type: String, enum: ['Open', 'In Progress', 'Resolved'], default: 'Open' },
  location: { type: String, required: true, trim: true },
  coordinates: { lat: Number, lng: Number },
  contact: { type: String, maxlength: 120 },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

const savedAdvisorySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  category: { type: String, required: true },
  location: String,
  content: { type: String, required: true }
}, { timestamps: true });

export const User = mongoose.models.User || mongoose.model('User', userSchema);
export const EmergencyRequest = mongoose.models.EmergencyRequest || mongoose.model('EmergencyRequest', emergencyRequestSchema);
export const SavedAdvisory = mongoose.models.SavedAdvisory || mongoose.model('SavedAdvisory', savedAdvisorySchema);
