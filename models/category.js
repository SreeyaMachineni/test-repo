const mongoose = require('mongoose');
const config = require('../config/database');
const CategorySchema = mongoose.Schema({
    name:{type:String,required:true},
    details:{type:String,required:true}
});
const Category = module.exports = mongoose.model('Category',CategorySchema);
module.exports.addCategory=function(category,callback){
    console.log(category);
    category.save(callback);
}
module.exports.deleteCategory = function(categoryId,callback){
    const query={_id:categoryId};
    Category.deleteOne(query,callback);
}
module.exports.editCategory = function(categoryId,category,callback){
    console.log(categoryId,category);

    const query = {_id:categoryId}
    Category.findById(categoryId,(err,category)=>{
        if(!category){
        console.log('couldnt find');
        }
        else{
          
          category.name=category.name;
          category.details=category.details;
          category.save(callback);

  
}
    });
}