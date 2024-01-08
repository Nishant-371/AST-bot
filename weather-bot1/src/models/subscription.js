const mongooes = require("mongoose");

const subscriptionSchema = new mongooes.Schema({
  chatId: {
    type: Number,
    unique: true,
  },
  name: {
    type: String,
    require: true,
    trim: true,
  },
  age: {
    type: Number,
    require: true,
  },
});

module.exports = mongooes.model("subscription", subscriptionSchema);
