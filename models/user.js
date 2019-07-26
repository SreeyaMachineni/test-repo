const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../config/database');

// User Schema
const UserSchema = mongoose.Schema({
  firstName: {
    type: String,
    required:true
  },
  lastName: {
    type: String,
    required:true
  },
  dob: {
    type: Date,
    required: true
  },
  gender:{
    type:String,
    require:true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  phone:{
    type:String,
    require:true
  },
  address:{
    type:String,
    require:true
  },
  userrole:{
    type:String
  },
  pan:{
    type:String
  },
  passport:{
    type:String
  },
  qualification:{
    type:String
  },
  maritalStatus:{
    type:String
  }

});

const User = module.exports = mongoose.model('User', UserSchema);

module.exports.getUserById = function(id, callback){
  User.findById(id, callback);
}

module.exports.getUsersByRole=function(userrole,callback){
  console.log(userrole);
  const query = {userrole:userrole};
  User.find(query,callback);
}

module.exports.getUserByUsername = function(firstName, callback){
  const query = {firstName: firstName}
  User.findOne(query, callback);
}

module.exports.addUser = function(newUser, callback){  
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(newUser.password, salt, (err, hash) => {
      if(err) throw err;
      newUser.password = hash;
      console.log(newUser.password);
      newUser.save(callback);
    });
  });
}

module.exports.deleteUser=function(empid,callback){
  const query = {_id:empid};
  User.deleteOne(query,callback);
}

module.exports.comparePassword = function(candidatePassword, hash, callback){
  bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
    if(err) throw err;
    callback(null, isMatch);
  });
}
