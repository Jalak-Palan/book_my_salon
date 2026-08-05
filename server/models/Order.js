const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  date: { type: String, required: true },
  customer: { type: String, required: true },
  amount: { type: Number, required: true },
  status: { type: String, default: 'Confirmed' },
  saleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Sale' },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, {
  timestamps: true
});

module.exports = mongoose.model('Order', orderSchema);
