const mongoose = require('mongoose');
const config = require('../config/database');
const HospitalSchema = mongoose.Schema({
    name:{type:String,required:true},
    specialization:{type:String,required:true},
    location:{type:String,required:true},
    address:{type:String,required:true},
    pointOfContact:[{
        name:{type:String,required:true},
        phone:{type:String,required:true}
    }]
})
const Hospital = module.exports = mongoose.model('Hospital',HospitalSchema);
module.exports.addHospital = function(hospital,callback){
    console.log(hospital);
    hospital.save(callback);
}

module.exports.getHospital = function(callback){
    console.log('getHospital');
   Hospital.find({},callback)
}

module.exports.deleteHospital = function(hospid,callback){
    const query={_id:hospid};
    Hospital.deleteOne(query,callback);
}
module.exports.getHospitalId = function(id, callback){
    Hospital.findById(id, callback);
  }