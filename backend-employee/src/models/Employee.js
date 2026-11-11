const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  name:         { type: String, required: true },
  email:        { type: String, required: true, unique: true },
  phone:        { type: String },
  jobTitle:     { type: String, required: true },
  role:         { type: String, required: true },
  department:   { type: mongoose.Schema.Types.ObjectId, ref: 'Department' },
  location:     { type: String },
  status:       { type: String, enum: ['active', 'inactive'], default: 'active' },
  joinDate:     { type: Date, default: Date.now },
  profilePhoto: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Employee', employeeSchema);
