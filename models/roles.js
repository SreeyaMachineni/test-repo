const mongoose = require("mongoose");
const config = require("../config/database");
const RoleSchema = mongoose.Schema({
    roleId:{type:String},
    roleName:{type:String},
    roleDesc:{type:String}
});
const Role=module.exports=mongoose.model("Role",RoleSchema);
mongoose.exports.getRoleIdByName = function(role,callback){
    Roles.findOne({roleName:role},callback); 
}