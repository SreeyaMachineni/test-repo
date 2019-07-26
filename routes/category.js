const express = require('express');
const router = express.Router();
const Category = require('../models/category');

router.post('/addCategory',(req,res)=>{
    console.log(req.body);  
    let category = new Category({
        name:req.body.category.name,
        details:req.body.category.details
    });
    Category.addCategory(category,(err,category)=>{
        (err)=>{res.json({success:false,msg:'failed to add category'})},
        (category)=>{res.json({success:true,msg:'added category'})}
    })
})

router.get('/getCategories',(req,res)=>{
    Category.find(function(err,cat){
     if(err)throw err;
     else{res.json(cat);}
   })
 })

 router.get('/deleteCategory/:categoryId',(req,res)=>{
     Category.deleteCategory(req.params.categoryId,(err,success)=>{
        (err)=>{res.json({success:false,msg:'failed to delete'})},
        (success)=>{res.json({success:true,msg:'delete successful'})}
     })
 })

 router.post('/editCategory/:categoryId',(req,res)=>{
     Category.editCategory(req.params.categoryId,req.body.category,(err,category)=>{
         (err)=>{res.json({success:false,msg:'failed to update'})},
         (category)=>{res.json({success:true,msg:'updated category'})}
     })
 })

module.exports = router;