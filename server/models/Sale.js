const mongoose = require('mongoose');

const saleSchema = new mongoose.Schema({
  customer: { type: String, required: true },
  product: { type: String, required: true },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  quantity: { type: Number, required: true },
  sellingPrice: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  gst: { type: Number, default: 0 },
  paymentMethod: { type: String, default: 'Cash' },
  invoiceNo: { type: String },
  date: { type: String, default: () => new Date().toISOString() },
  total: { type: Number, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, {
  timestamps: true
});

module.exports = mongoose.model('Sale', saleSchema);

