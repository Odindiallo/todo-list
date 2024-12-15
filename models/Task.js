const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  category: {
    type: String,
    default: 'personal'
  },
  dueDate: {
    type: Date,
    required: false
  }
}, { 
  timestamps: true 
});

module.exports = mongoose.model('Task', TaskSchema);
