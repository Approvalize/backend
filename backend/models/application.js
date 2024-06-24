const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  creatorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  approverPath: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }],
  currentApproverIndex: { type: Number, default: 0 },
  status: { type: String, enum: ['approved', 'pending', 'rejected'], default: 'pending' },
}, {
  timestamps: true,
});

const Application = mongoose.model('Application', applicationSchema);

module.exports = Application;






