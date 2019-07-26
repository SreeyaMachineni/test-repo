const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const User = require('../models/user');
const Hospital = require('../models/hospital');
const Nexmo = require('nexmo');
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const methodOverride = require('method-override');
const Menu = require('../models/menu');
var requestId;
// Init Nexmo
const nexmo = new Nexmo({
  apiKey: '17774bc1',
  apiSecret: 'wJpbXEK6eVOQgH5k'
}, { debug: true });

// Authenticate
router.post('/authenticate', (req, res, next) => {
  console.log('authenticate');
  const firstName = req.body.firstName;
  const password = req.body.password;
  console.log(firstName+' '+password);
  User.getUserByUsername(firstName, (err, user) => {
    if(err) throw err;
    if(!user){
      return res.json({success: false, msg: 'User not found'});
    }
    console.log('before compare');
    User.comparePassword(password, user.password, (err, isMatch) => {
      if(err) throw err;
      if(isMatch){
        console.log('matched');
        
        
        const token = jwt.sign({data: user}, config.secret, {
          expiresIn: 604800 // 1 week
        });
        res.json({
          success: true,
          token: `Bearer ${token}`,
          user: {
            id: user._id,
            firstName:user.firstName,
            lastName:user.lastName,
            dob:user.dob,
            email:user.email,
            phone:user.phone,
            address:user.address,
            userrole:user.userrole
          },
          expiresin:604800
        });
      } else {
        return res.json({success: false, msg: 'Wrong password'});
      }
    });
  });
});

// Profile
router.get('/profile', passport.authenticate('jwt', {session:false}), (req, res, next) => {                                  
  res.json({user: req.user});
});
let file;
var storage;
var upload;


// router.post('/test', (req, res,next) => {
//   console.log('testt');
//   file = req.body.image;
  
// //upload.single('file');

// });
// storage = new GridFsStorage({ 
//   url: config.database,
//   file: (req, file) => {
//     return new Promise((resolve, reject) => {
//        const fileInfo = {
//           filename: 'file_' + Date.now(),
//           bucketName: 'uploads',
//           metadata:{"someid":'a'}
          

//         };
//         resolve(fileInfo);
//     });
//   }
// });
// upload = multer({ storage });

// router.get('/uploadtest',upload.single('file'),(req,res)=>{
//   console.log('uploaded');
// })


router.post('/sendotp', (req, res) => { 
  const number = req.body.phone;

  nexmo.verify.request({
   // number:'919874605071',
   number:number,
    brand: 'Nexmo',
    code_length: '4'
  }, (err, result) => {
    console.log(err ? err : requestId=result.request_id)
  });
  
  res.json({message:'ok'});
});



// Register
router.post('/register', (req, res) => {
      nexmo.verify.check({
        request_id: requestId,
        code: req.body.otp
      }, (err, result) => {
        console.log(err ? err : result)
        if(result['status'] == 0){
        let newUser = new User({
          firstName:req.body.user.firstName,
          lastName:req.body.user.lastName,
          dob:req.body.user.dob,
          gender:req.body.user.gender,
          phone:req.body.user.phone,
          email:req.body.user.email,
          address:req.body.user.address,
          password:req.body.user.password,
         

      });

      User.addUser(newUser, (err, user) => {
        if(err){
          console.log(err);
          res.json({success: false, msg:'Failed to register user'});
        } else {
          const token = jwt.sign({data: user}, config.secret, {
            expiresIn: 604800 // 1 week
          });
          res.json({
            success: true,
            msg:'user registered',
            token: `Bearer ${token}`,
            user: {
              id: user._id,
              firstName:user.firstName,
              lastName:user.lastName,
              dob:user.dob,
              email:user.email,
              phone:user.phone,
              address:user.address,
              userrole:user.userrole
            },
            expiresin:604800
          });
         // res.json({success: true, msg:'User registered'});
        }
      });
    }
  });
});


router.post('/addEmp',(req,res)=>{
  console.log(req.body);
  console.log(req.body.user);
  let employee = new User({
    firstName:req.body.emp.firstName,
    lastName:req.body.emp.lastName,
    dob:req.body.emp.dob,
    gender:req.body.emp.gender,
    phone:req.body.emp.phone,
    email:req.body.emp.email,
    address:req.body.emp.address,
    password:req.body.emp.password,
    address:req.body.emp.address,
    userrole:req.body.emp.userrole,
    pan:req.body.emp.pan,
    passport:req.body.emp.passport,
    qualification:req.body.emp.qualification,
    maritalStatus:req.body.emp.maritalStatus
});
User.addUser(employee,(err,emp)=>{
  if(err){
    console.log(err);
          res.json({success: false, msg:'Failed to add employee'});
  }
  else{
    res.json({success:true,msg:'Successfully added employee'});
  }
})
})

router.get('/getEmp/:role',(req,res)=>{
User.getUsersByRole(req.params.role,(err,users)=>{
  if(err) throw err;
  else{
    res.json(users);
  }
})
})

router.get('/deleteEmp/:empid',(req,res)=>{
  User.deleteUser(req.params.empid,(err,success)=>{
    if(err) throw err;
    else{
      res.json({success: true, msg:'Deleted user'});
    }
  })
})

router.post('/editEmp/:empId',(req,res)=>{
  console.log(req.params.empId);
  User.findById(req.params.empId,(err,user)=>{
    if(!user){
      res.json({success: false, msg:'Unable to load doc'});
    }
    else{
      user.firstName=req.body.emp.firstName;
      user.lastName=req.body.emp.lastName;
      user.dob=req.body.emp.dob;
      user.gender=req.body.emp.gender;
      user.phone=req.body.emp.phone;
      user.email=req.body.emp.email;
      user.address=req.body.emp.address;
      user.password=req.body.emp.password;
      user.address=req.body.emp.address;
      user.userrole=req.body.emp.userrole;
      user.pan=req.body.emp.pan;
      user.passport=req.body.emp.passport;
      user.qualification=req.body.emp.qualification;
      user.maritalStatus=req.body.emp.maritalStatus;
      user.save().then((user)=>{
        res.json({success: true, msg:'Updated'});
      },
      err=>{
        res.json({success: false, msg:'Update failed'});
      }
    );
      

    }
  })
})









router.get('/menus/:role',(req,res)=>{
  
  Menu.getMenuByRole(req.params.role,(err,menu)=>{
    if(err) throw err;
    else {
res.json(menu);
      
    }
  })

})


router.post('/hospital/addHosp',(req,res)=>{
    let hospital = new Hospital({
    name:req.body.hosp.name,
    specialization:req.body.hosp.specialization,
    location:req.body.hosp.location,
    address:req.body.hosp.address,
    pointOfContact:req.body.hosp.pointOfContact,
});

Hospital.addHospital(hospital,(err,hosp)=>{

  (err)=>{res.json({success:false,msg:'failed to add hospital'})},
  (hosp)=>{console.log(hosp);res.json({success:true,msg:'successfully added hospital'})}
})

})


router.get('/hospital/getHosp',(req,res)=>{
   Hospital.find(function(err,hosp){
    if(err){console.log(err)}
    else{res.json(hosp);}
  })
})



router.get('/hospital/deleteHosp/:hospid',(req,res)=>{
  Hospital.deleteHospital(req.params.hospid,(err,success)=>{
    if(err) throw err;
    else{
      res.json({success: true, msg:'Deleted hospital'});
    }
  })
})




router.post('/hospital/editHosp/:hospid',(req,res)=>{
  console.log(req.params.hospid);
  Hospital.findById(req.params.hospid,(err,hosp)=>{
    if(!hosp){
      res.json({success: false, msg:'Unable to load doc'});
    }
    else{
      hosp.name=req.body.hosp.name,
      hosp.specialization=req.body.hosp.specialization,
      hosp.location=req.body.hosp.location,
      hosp.address=req.body.hosp.address,
      hosp.pointOfContact=req.body.hosp.pointOfContact,
      hosp.save().then((hosp)=>{
        res.json({success: true, msg:'Updated'});
      },
      err=>{
        res.json({success: false, msg:'Update failed'});
      }
    );
      

    }
  })
})




module.exports = router;
