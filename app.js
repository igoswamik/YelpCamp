const express=require('express');
const path=require('path');
const mongoose=require('mongoose');
const ejsMate=require('ejs-mate');
const Joi=require('joi');  //schema data validator for javascript
const catchAsync=require('./utils/catchAsync');
const ExpressError=require('./utils/ExpressError');
const Campground=require('./models/campground');
const methodOverride=require('method-override');
const { required, string } = require('joi');
const {campgroundSchema}=require('./schemas.js');


mongoose.connect('mongodb://localhost:27017/yelp-camp',{
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
})


const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', ()=>{
  console.log("Database Connected!");
});

const app=express();

app.engine('ejs',ejsMate);// we tell express thats the one we wanna use istead the default one
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));

app.use(express.urlencoded({extended:true})); //it will parse the req body for us
app.use(methodOverride('_method'));


const validateCampgroud= (req,res,next)=>{
    //joi schema defined in schemas.js file as campgroundSchema for validation purpose
      const {error}=campgroundSchema.validate(req.body);
      if(error){
          const msg=error.details.map(el=>el.message).join(','); //mapping over error which is an array of objects and then extracting message from each element then joining in a single string with ',' comma if these are more than one error message 
          throw new ExpressError(msg,400);
      }
      else{
          next();   // if validation successful we proceed to further 
      }
}



app.get('/',(req,res)=>{
    res.render("home");
})

app.get('/campgrounds',async(req,res)=>{
    const campgrounds=await Campground.find({});
    res.render('campgrounds/index',{campgrounds});
})
app.get('/campgrounds/new',(req,res)=>{
    res.render('campgrounds/new');
})


app.post('/campgrounds',validateCampgroud,catchAsync(async (req,res,next)=>{
    // if(!req.body.campground) throw new ExpressError('campground data Invalid',400); //form is validated but still someone can send request (ex- using postman) then its shoul chek if campground object not present then should not save in database insted throw error whih will got to error handler throug next using catchAsync which we have defined 
    
    //instead of writing joi schema and validating here I will define middleware (validateCampgroud) which is passed as an argument  before this funtions runs
    const campground=new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
}))

app.get('/campgrounds/:id',catchAsync(async(req,res)=>{
    const campground=await Campground.findById(req.params.id);
    res.render('campgrounds/show',{campground});
}))
app.get('/campgrounds/:id/edit',catchAsync(async(req,res)=>{
    const campground=await Campground.findById(req.params.id);
    res.render('campgrounds/edit',{campground});
}))
app.put('/campgrounds/:id',validateCampgroud,catchAsync(async(req,res,next)=>{
    const {id}=req.params;
    const campground=await Campground.findByIdAndUpdate(id,req.body.campground,{runValidators:true,new:true});
    //res.send(req.body.campground);
    res.redirect(`/campgrounds/${campground._id}`);
}))
app.delete('/campgrounds/:id', catchAsync(async(req,res)=>{
    const {id}=req.params;
    const campground=await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
}))

app.all('*',(req,res,next)=>{
    next(new ExpressError('Page Not Found',404));
})

app.use((err,req,res,next)=>{
    const {statusCode=500,message='Something went wrong'}=err;
    if(!err.message) err.message='Something Went Wrong';
    res.status(statusCode).render('error',{err});
})

app.listen(3000,()=>{
    console.log("SERVING ON PORT 3000!");
})