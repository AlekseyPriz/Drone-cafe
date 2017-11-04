const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// схема для Заказов
const orderSchema = new Schema({
  visitorsEmail: {type: String},
  visitorsName: {type: String},
  dish: {type: Object},
  status: {type: String, default: "Заказано"},
  dishPrice: {type: Number}
});

const  Order = mongoose.model('Order', orderSchema);

module.exports = Order;
