const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  sku: { type: String, required: true },
  category: { type: String, required: true },
  supplier: { type: String, default: '' },
  unit: { type: String, required: true },
  quantity: { type: Number, default: 0 },
  purchasePrice: { type: Number, default: 0 },
  sellingPrice: { type: Number, default: 0 },
  minStock: { type: Number, default: 0 },
  brand: { type: String, default: '' },
  description: { type: String, default: '' },
  image: { type: String, default: '' },
  location: { type: String, default: '' },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, {
  timestamps: true
});

module.exports = mongoose.model('Product', productSchema);
