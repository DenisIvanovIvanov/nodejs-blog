var mongoose = require('mongoose'),
    bcrypt = require('bcrypt-nodejs');  

var UserSchema = new mongoose.Schema({
  username: String,  
  email: String,
  password: String,
  role: String
});

UserSchema.methods.generateHash = function (password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
}

UserSchema.methods.validPassword = function (password) {
  return bcrypt.compareSync(password, this.password);
}

mongoose.model('User', UserSchema);

module.exports = mongoose.model('User');