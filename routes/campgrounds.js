const express=require('express');
const router=express.Router();
const catchAsync=require('../utils/catchAsync');
const Campground=require('../models/campground');
const campgrounds=require('../controllers/campgrounds'); 
const {isLoggedIn, isAuthor,validateCampgroud}=require('../middleware');
const multer  = require('multer');   //https://github.com/expressjs/multer
const {storage}=require('../cloudinary');
const upload = multer({ storage }); //Multer is a node.js middleware for handling multipart/form-data, which is primarily used for uploading files.


// router.get('/',catchAsync(campgrounds.index));
// router.post('/',isLoggedIn,validateCampgroud,catchAsync(campgrounds.createCampground));
//since these above 2 routes have same path we can route these in a fancy way using router.route 
router.route('/')
    .get(catchAsync(campgrounds.index))
    .post(isLoggedIn,upload.array('image'),validateCampgroud,catchAsync(campgrounds.createCampground))
    // .post(upload.array('image'),(req,res)=>{  //make sure input name (here-'image') matches the name in form
    //     console.log(req.body, req.files);  //without multer req.body will be an empty object bcz enctype of the form is set to multipart so we need multer middleware to handle these
    //     res.send("IT Worked!!");  //if we use arry those files will we stores in req.files
    // })

router.get('/new',isLoggedIn,campgrounds.renderNewForm);

router.route('/:id')
    .get(catchAsync(campgrounds.showCampground))
    .put(isLoggedIn,isAuthor,upload.array('image') ,validateCampgroud,catchAsync(campgrounds.updateCampground))
    .delete(isLoggedIn,isAuthor, catchAsync(campgrounds.deleteCampground))

router.get('/:id/edit',isLoggedIn,isAuthor,catchAsync(campgrounds.renderEditForm));

module.exports=router;