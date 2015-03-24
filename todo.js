var Mongoose   = require('mongoose');
var Schema     = Mongoose.Schema;

var todoSchema = new Schema({
  title : { type: String },
  order : { type: Number },
  completed : { type: Boolean, default: false },
  url   : { type: String },
});

var todo = Mongoose.model('todo', todoSchema);

module.exports = {
  Todo: todo
};
