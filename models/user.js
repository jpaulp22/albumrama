let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let bcrypt = require('bcryptjs');

let userSchema = new Schema({
  email: String,
  password: String,
  grids: [[{type:String}]]
})



userSchema.methods.generateHash = function(password){
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8). null);
}

userSchema.methods.validPassword = function(password){
  return bcrypt.compareSync(password, this.local.password);
}

let User = mongoose.model('user', userSchema);
module.exports = User;