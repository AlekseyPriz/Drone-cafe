const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// схема для Заказов
const userSchema = new Schema({
  name: {type: String, required: true},
  email: {type: String, index: { unique: true }},
  balance: {type: Number,  default: "100"}
});

const  User = mongoose.model('User', userSchema);

module.exports = User;
